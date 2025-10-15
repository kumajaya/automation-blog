/**
 * Script sinkronisasi Ghost → Jekyll/GitHub Pages
 * ------------------------------------------------
 * - Mengambil konten (posts/pages) dari Ghost API (dengan authors & tags)
 * - Menghasilkan file Markdown di folder `_posts` atau `pages/`
 * - Mengunduh media internal (field `image` & <img> di konten) ke `assets/media`
 * - Menulis frontmatter YAML yang kaya metadata (SEO, sosial, dsb.)
 *
 * NOTE:
 * - Membutuhkan Node.js v18+ (karena `fetch` & `replaceAll` sudah built-in)
 * - Field `feature_image` disimpan sebagai `image`
 * - Field `feature_image_caption` disimpan sebagai `image_caption`
 * - Field `feature_image_alt` disimpan sebagai `image_alt`
 * - Field `excerpt` atau `custom_excerpt` disimpan sebagai `excerpt`
 * - Field `primary_tag` disimpan sebagai `categories` (array, karena Jekyll)
 * - Field `primary_author` tetap dipertahankan (string)
 * - Domain media internal didefinisikan di konstanta `INTERNAL_MEDIA_DOMAINS`
 * - Gambar dari domain non-whitelist tidak diunduh; link eksternal dibiarkan utuh
 * - Unduhan media memakai retry + timeout untuk ketahanan jaringan
 * - Nama file `_posts` memakai prefix tanggal (YYYY-MM-DD) dari `published_at`
 */

const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Konfigurasi dari environment variable
const GHOST_API_URL = process.env.GHOST_API_URL;
const GHOST_API_KEY = process.env.GHOST_API_KEY;

// Path output
const POSTS_PATH = path.join(__dirname, '_posts');
const PAGES_PATH = path.join(__dirname, 'pages');
const MEDIA_PATH = path.join(__dirname, 'assets/media');
const BASE_URL = '/automation-blog';   // Base path untuk GitHub Pages

// Konstanta domain media internal yang diizinkan
const INTERNAL_MEDIA_DOMAINS = [
  'samatorgroup.com' // bisa ditambah jika ingin whitelist domain lain
];

// Utility: sanitize string agar aman ditulis ke YAML frontmatter
function sanitizeForYAML(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')  // escape backslash
    .replace(/"/g, '\\"')    // escape double quote
    .replace(/\r?\n/g, ' '); // ganti newline dengan spasi
}

// Utility: download file dari URL ke path lokal dengan retry & timeout
async function downloadFile(url, dest, retries = 3, timeoutMs = 10000) {
  if (fs.existsSync(dest)) return console.log(`Already exists: ${dest}`);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buffer);
      console.log(`Downloaded: ${dest}`);
      return; // sukses → keluar
    } catch (err) {
      console.warn(`Download failed (attempt ${attempt}/${retries}): ${url}`, err.message);
      if (attempt === retries) {
        console.error(`Giving up on: ${url}`);
      } else {
        await new Promise(r => setTimeout(r, 1000 * attempt)); // backoff sederhana
      }
    }
  }
}

// Utility: extract semua <img src="..."> dari HTML content
function extractImages(html) {
  const regex = /<img [^>]*src=["']([^"']+)["'][^>]*>/g;
  const urls = [];
  let match;
  while ((match = regex.exec(html)) !== null) urls.push(match[1]);
  return urls;
}

// Utility: cek apakah URL media internal (Ghost CMS)
function isInternalMedia(url) {
  try {
    const u = new URL(url);
    return INTERNAL_MEDIA_DOMAINS.some(domain => u.hostname.endsWith(domain));
  } catch {
    return false;
  }
}

// Fungsi utama: sinkronisasi konten Ghost → Markdown Jekyll
async function syncContent(type, layout, outputFolder) {
  try {
    // 1. Fetch konten dari Ghost API (posts atau pages)
    const endpoint = `${GHOST_API_URL}${type}/?key=${GHOST_API_KEY}&include=authors,tags`;
    const res = await fetch(endpoint);

    if (res.status === 404) {
      console.warn(`No ${type} endpoint found or empty. Skipping...`);
      return 0;
    }
    if (!res.ok) throw new Error(`Failed to fetch ${type}: ${res.status} ${res.statusText}`);

    const data = await res.json();
    const items = data[type] || [];

    // 2. Pastikan folder output ada
    if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder, { recursive: true });
    if (!fs.existsSync(MEDIA_PATH)) fs.mkdirSync(MEDIA_PATH, { recursive: true });

    // 3. Loop setiap item → generate file Markdown
    for (const item of items) {
      const datePrefix = item.published_at?.substr(0, 10);
      const fileName = layout === 'post' ? `${datePrefix}-${item.slug}.md` : `${item.slug}.md`;
      const filePath = path.join(outputFolder, fileName);

      // 3a. Susun frontmatter standar
      const fm = {
        title: sanitizeForYAML(item.title),
        date: item.published_at || '',
        slug: item.slug,
        layout,
        excerpt: sanitizeForYAML(item.custom_excerpt || item.excerpt || ''),
        image: '', // akan diisi jika ada feature_image
        image_alt: sanitizeForYAML(item.feature_image_alt || ''),
        image_caption: sanitizeForYAML(item.feature_image_caption || ''),
        author: item.authors ? item.authors.map(a => sanitizeForYAML(a.name)) : [],
        tags: item.tags ? item.tags.map(t => sanitizeForYAML(t.name)) : [],
        categories: item.primary_tag ? [sanitizeForYAML(item.primary_tag.name)] : []
      };

      // 3b. Tambahkan field metadata Ghost (SEO, sosial, dsb.)
      fm.featured = item.featured || false;
      fm.visibility = item.visibility || '';
      fm.primary_author = item.primary_author ? sanitizeForYAML(item.primary_author.name) : '';
      fm.codeinjection_head = item.codeinjection_head || '';
      fm.codeinjection_foot = item.codeinjection_foot || '';
      fm.canonical_url = item.canonical_url || '';
      fm.og_title = item.og_title || '';
      fm.og_description = item.og_description || '';
      fm.og_image = item.og_image || '';
      fm.twitter_title = item.twitter_title || '';
      fm.twitter_description = item.twitter_description || '';
      fm.twitter_image = item.twitter_image || '';
      fm.url = item.url || '';
      fm.comment_id = item.comment_id || '';
      fm.reading_time = item.reading_time || 0;
      fm.access = item.access !== undefined ? item.access : true;
      fm.comments = item.comments !== undefined ? item.comments : false;

      // 3c. Download feature_image (jika ada & internal)
      if (item.feature_image) {
        if (isInternalMedia(item.feature_image)) {
          const urlObj = new URL(item.feature_image);
          const mediaFileName = path.basename(urlObj.pathname);
          const mediaPath = path.join(MEDIA_PATH, mediaFileName);
          await downloadFile(item.feature_image, mediaPath);
          fm.image = `${BASE_URL}/assets/media/${mediaFileName}`;
        } else {
          // eksternal → biarkan link asli
          fm.image = item.feature_image;
        }
      }

      // 3d. Download semua <img> di konten HTML → rewrite path hanya jika internal
      let contentHtml = item.html || '';
      const imgUrls = extractImages(contentHtml);
      for (const imgUrl of imgUrls) {
        if (isInternalMedia(imgUrl)) {
          try {
            const urlObj = new URL(imgUrl);
            const mediaFileName = path.basename(urlObj.pathname);
            const mediaPath = path.join(MEDIA_PATH, mediaFileName);
            await downloadFile(imgUrl, mediaPath);
            contentHtml = contentHtml.replaceAll(imgUrl, `${BASE_URL}/assets/media/${mediaFileName}`);
          } catch (e) {
            console.warn(`Skipping invalid URL: ${imgUrl}`);
          }
        } else {
          console.log(`External image left as-is: ${imgUrl}`);
        }
      }

      // 3e. Tulis file Markdown dengan frontmatter + konten HTML
      let frontMatter = '---\n';
      for (const [key, value] of Object.entries(fm)) {
        if (Array.isArray(value)) {
          frontMatter += `${key}:\n`;
          value.forEach(v => frontMatter += `  - "${v}"\n`);
        } else if (typeof value === 'string') {
          frontMatter += `${key}: "${value}"\n`;
        } else {
          frontMatter += `${key}: ${value}\n`;
        }
      }
      frontMatter += '---\n\n';

      fs.writeFileSync(filePath, frontMatter + contentHtml, 'utf-8');
      console.log(`Synced ${type.slice(0, -1)}: ${fileName}`);
    }

    console.log(`Total ${type} synced: ${items.length}`);
    return items.length;

  } catch (err) {
    console.error(`Sync failed for ${type}:`, err);
    // posts dianggap kritikal → gagal total
    if (type === 'posts') process.exit(1);
    // pages gagal → skip
    return 0;
  }
}

// Jalankan sinkronisasi untuk posts dan pages
syncContent('posts', 'post', POSTS_PATH);
syncContent('pages', 'page', PAGES_PATH);
