#!/usr/bin/env node
/**
 * Script sinkronisasi Ghost → Jekyll/GitHub Pages
 * ------------------------------------------------
 * - Mengambil konten (posts/pages) dari Ghost API (dengan authors & tags)
 * - Menghasilkan file Markdown di folder `_posts` atau `pages/`
 * - Mengunduh media internal (field `image` & <img> di konten) ke `assets/media`
 * - Menulis frontmatter YAML yang kaya metadata (SEO, sosial, dsb.)
 *
 * NOTE:
 * - Membutuhkan Node.js v18+ (karena `fetch`, `AbortController`, dan `replaceAll`)
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
 *
 * Perubahan "production-ready" (ringkasan):
 * - Semua I/O asinkron (fs.promises)
 * - Jalankan posts lalu pages secara berurutan
 * - Sanitasi nama file media (decode + ganti karakter illegal)
 * - Rate limiter antar halaman
 * - Opsi --dry-run
 * - Logging berwarna via ANSI escape (tanpa dependency eksternal)
 * - Media cache ('.media-cache.json') agar tidak mengunduh ulang file
 *
 * Cara pakai:
 *   GHOST_API_URL="https://samatorgroup.com/ghost/api/content/" GHOST_API_KEY="xxx" node sync-ghost.js
 *   atau
 *   node sync-ghost.js --dry-run
 */

const fs = require('fs').promises;        // gunakan versi promise untuk non-blocking I/O
const fsSync = require('fs');            // beberapa cek sinkron kecil (existsSync)
const path = require('path');
const { URL } = require('url');
const process = require('process');

// ---------- Konfigurasi dari environment variable ----------
const GHOST_API_URL = process.env.GHOST_API_URL;
const GHOST_API_KEY = process.env.GHOST_API_KEY;

// Path output (relatif terhadap lokasi skrip)
const ROOT = path.resolve(__dirname);
const POSTS_PATH = path.join(ROOT, '_posts');
const PAGES_PATH = path.join(ROOT, 'pages');
const MEDIA_PATH = path.join(ROOT, 'assets/media');
// Base path untuk GitHub Pages (sesuaikan jika repo menggunakan subpath)
const BASE_URL = '/automation-blog';

// Konstanta domain media internal yang diizinkan
const INTERNAL_MEDIA_DOMAINS = [
  'samatorgroup.com',
  'kiiota.com' // tambahkan domain lain bila perlu
];

// ---------- CLI args ----------
const ARGV = process.argv.slice(2);
const DRY_RUN = ARGV.includes('--dry-run');
const PAGE_DELAY_MS = parseInt(getArgValue('--delay')) || 500; // default 500ms antar halaman

function getArgValue(flag) {
  const idx = ARGV.indexOf(flag);
  if (idx >= 0 && ARGV.length > idx + 1) return ARGV[idx + 1];
  return null;
}

// ---------- Simple ANSI-colored logging (no deps) ----------
// gunakan ANSI escape agar tetap tanpa dependency (cocok untuk GitHub Actions)
const COLORS = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function logInfo(msg) { console.log(`${COLORS.cyan}[INFO]${COLORS.reset} ${msg}`); }
function logGood(msg) { console.log(`${COLORS.green}[OK]${COLORS.reset} ${msg}`); }
function logWarn(msg) { console.warn(`${COLORS.yellow}[WARN]${COLORS.reset} ${msg}`); }
function logErr(msg) { console.error(`${COLORS.red}[ERR]${COLORS.reset} ${msg}`); }

// ---------- Utilities ----------

/**
 * sanitizeForYAML
 * - Menjaga string agar aman ditulis ke YAML frontmatter
 * - Jika multiline=true, mengembalikan block scalar YAML (|-style)
 * - Tetap ringkas: escape backslash dan double quote
 */
function sanitizeForYAML(str, { multiline = false } = {}) {
  if (!str) return '';

  if (multiline) {
    // Gunakan block scalar untuk YAML agar paragraph tetap rapi
    return '|\n  ' + String(str)
      .replace(/\r\n/g, '\n')   // normalisasi newline
      .split('\n')
      .map(line => line.replace(/"/g, '\\"')) // Hanya escape double quote, biarkan backslash
      .join('\n  ');
  }

  // Single-line: ganti newline jadi spasi, escape " dan \
  return String(str)
    .replace(/\\/g, '\\\\')  // tetap escape backslash untuk single-line
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, ' ');
}

/**
 * extractImages
 * - Ekstrak semua atribut src pada tag <img ...>
 * - Tidak mencoba parse HTML sepenuhnya (cukup untuk kasus umum)
 */
function extractImages(html) {
  if (!html) return [];
  const regex = /<img [^>]*src=["']([^"']+)["'][^>]*>/g;
  const urls = [];
  let match;
  while ((match = regex.exec(html)) !== null) urls.push(match[1]);
  return urls;
}

/**
 * isInternalMedia
 * - Toleran: hapus prefix www., lalu cek endsWith(domain)
 * - Menghindari false negative untuk host: subdomain.samatorgroup.com
 */
function isInternalMedia(urlStr) {
  try {
    const u = new URL(urlStr);
    const host = u.hostname.replace(/^www\./, '');
    return INTERNAL_MEDIA_DOMAINS.some(domain => host.endsWith(domain));
  } catch {
    return false;
  }
}

/**
 * safeMediaFileName
 * - decode URI component, ambil basename, lalu sanitize karakter illegal filesystem
 * - tambahkan prefix uuid agar unik antar posting
 */
function safeMediaFileName(uuid, urlPath) {
  // decode dahulu, kemudian ambil basename tanpa query params
  let base = path.basename(decodeURIComponent((urlPath || '').split('?')[0] || 'file'));
  // ganti karakter yang tidak aman untuk filesystem
  base = base.replace(/[<>:"/\\|?*\x00-\x1F]+/g, '_').replace(/\s+/g, '_');
  // fallback jika kosong
  if (!base || base === '.' || base === '..') base = 'media';
  return `${uuid}-${base}`;
}

/**
 * fileExists (async)
 * - wrapper untuk fs.access
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// ---------- Media cache (agar tidak mengunduh ulang) ----------
const MEDIA_CACHE_FILE = path.join(ROOT, '.media-cache.json');
let mediaCache = {};

/**
 * loadMediaCache
 * - Baca .media-cache.json jika ada, fallback {}
 * - Cache format: { "<original_url>": "<relative/path/to/file>" }
 */
async function loadMediaCache() {
  try {
    if (fsSync.existsSync(MEDIA_CACHE_FILE)) {
      const txt = await fs.readFile(MEDIA_CACHE_FILE, 'utf-8');
      mediaCache = JSON.parse(txt || '{}');
      logInfo(`Loaded media cache (${Object.keys(mediaCache).length} entries)`);
    } else {
      mediaCache = {};
      logInfo('No media cache file, starting fresh');
    }
  } catch (e) {
    logWarn(`Failed to load media cache: ${e.message}`);
    mediaCache = {};
  }
}

/**
 * saveMediaCache
 * - Tulis kembali file cache (kecuali DRY_RUN)
 */
async function saveMediaCache() {
  try {
    if (DRY_RUN) {
      logInfo('[DRY-RUN] Skipping media cache save');
      return;
    }
    await fs.writeFile(MEDIA_CACHE_FILE, JSON.stringify(mediaCache, null, 2), 'utf-8');
    logInfo(`Saved media cache (${Object.keys(mediaCache).length} entries)`);
  } catch (e) {
    logWarn(`Failed to save media cache: ${e.message}`);
  }
}

/**
 * downloadFile
 * - Download dengan retry + timeout
 * - Memeriksa cache: jika URL sudah ada dan file ditemukan, skip download
 * - Mengembalikan path relatif yang tersimpan di cache (relative terhadap ROOT)
 *
 * Note: fungsi ini menggunakan fetch (Node 18+)
 */
async function downloadFile(url, dest, retries = 3, timeoutMs = 15000) {
  // jika sudah ada di cache dan file benar-benar ada → skip
  const cached = mediaCache[url];
  if (cached) {
    const abs = path.join(ROOT, cached);
    if (fsSync.existsSync(abs)) {
      logInfo(`Media in cache, skip download: ${url}`);
      return cached;
    } else {
      // cache stale → hapus entry dan lanjutkan download
      delete mediaCache[url];
      logWarn(`Stale cache entry removed for: ${url}`);
    }
  }

  if (DRY_RUN) {
    logInfo(`[DRY-RUN] Would download: ${url} → ${dest}`);
    const rel = path.relative(ROOT, dest);
    mediaCache[url] = rel;
    return rel;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // pastikan folder ada
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.writeFile(dest, buffer);

      const rel = path.relative(ROOT, dest);
      mediaCache[url] = rel;
      logGood(`Downloaded media: ${url} → ${rel}`);
      return rel;
    } catch (err) {
      logWarn(`Download failed (attempt ${attempt}/${retries}) for ${url}: ${err.message}`);
      if (attempt === retries) {
        logErr(`Giving up on: ${url}`);
        throw err;
      }
      // backoff linear sederhana
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
}

/**
 * syncContent
 * - type: 'posts' | 'pages' (sesuai endpoint Ghost)
 * - layout: 'post' | 'page' (frontmatter layout)
 * - outputFolder: path absolut tujuan penulisan file
 *
 * Alur:
 *  1. Paginate request ke Ghost API
 *  2. Untuk setiap item:
 *     - Siapkan frontmatter (banyak field dari Ghost)
 *     - Unduh feature_image jika internal
 *     - Cari <img> di konten, unduh internal, rewrite path
 *     - Tulis file markdown ke outputFolder (atau log jika DRY_RUN)
 */
async function syncContent(type, layout, outputFolder) {
  try {
    if (!GHOST_API_URL || !GHOST_API_KEY) {
      throw new Error('GHOST_API_URL and GHOST_API_KEY must be set as environment variables.');
    }

    let page = 1;
    let totalPages = 1;
    let totalItems = 0;

    // Pastikan folder output ada (kecuali DRY_RUN)
    if (!DRY_RUN) {
      await fs.mkdir(outputFolder, { recursive: true });
      await fs.mkdir(MEDIA_PATH, { recursive: true });
    } else {
      logInfo(`[DRY-RUN] Ensure output folder (skipped creation): ${outputFolder}`);
    }

    do {
      // Build endpoint (include authors,tags)
      const endpoint = new URL(`${type}/?key=${GHOST_API_KEY}&include=authors,tags&limit=50&page=${page}`, GHOST_API_URL).toString();
      logInfo(`Fetching: ${endpoint}`);

      const res = await fetch(endpoint);
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Failed to fetch ${type}: ${res.status} ${res.statusText}\n${text}`);
      }

      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error(`Invalid JSON response for ${type}: ${e.message}`);
      }

      const items = data[type] || [];
      const pagination = data.meta?.pagination || {};
      totalPages = pagination.pages || 1;
      logInfo(`Fetched page ${pagination.page || 1}/${totalPages || 1}`);

      // Loop tiap item
      for (const item of items) {
        // datePrefix untuk _posts; fallback ke now jika tidak ada published_at
        const datePrefix = item.published_at?.substr(0, 10) || (new Date().toISOString().substr(0,10));
        const fileName = layout === 'post' ? `${datePrefix}-${item.slug}.md` : `${item.slug}.md`;
        const filePath = path.join(outputFolder, fileName);

        // --- Bangun frontmatter (konsisten dengan versi lama namun sanitized) ---
        const fm = {
          ghost_uuid: item.uuid || '',
          title: sanitizeForYAML(item.title),
          date: item.published_at || '',
          slug: item.slug || item.uuid,
          layout,
          excerpt: sanitizeForYAML(item.custom_excerpt || item.excerpt || '', { multiline: true }),
          image: '',
          image_alt: sanitizeForYAML(item.feature_image_alt || ''),
          image_caption: sanitizeForYAML(item.feature_image_caption || ''),
          author: item.authors ? item.authors.map(a => sanitizeForYAML(a.name)) : [],
          tags: item.tags ? item.tags.map(t => sanitizeForYAML(t.name)) : [],
          categories: item.primary_tag ? [sanitizeForYAML(item.primary_tag.slug)] : []
        };

        // Tambahan metadata Ghost (SEO, social, flags)
        fm.featured = item.featured || false;
        fm.visibility = item.visibility || '';
        fm.primary_author = item.primary_author ? sanitizeForYAML(item.primary_author.name) : '';
        fm.codeinjection_head = sanitizeForYAML(item.codeinjection_head, { multiline: true }) || '';
        fm.codeinjection_foot = sanitizeForYAML(item.codeinjection_foot, { multiline: true }) || '';
        fm.canonical_url = item.canonical_url || '';
        fm.og_title = item.og_title || '';
        fm.og_description = sanitizeForYAML(item.og_description, { multiline: true }) || '';
        fm.og_image = item.og_image || '';
        fm.twitter_title = item.twitter_title || '';
        fm.twitter_description = sanitizeForYAML(item.twitter_description, { multiline: true }) || '';
        fm.twitter_image = item.twitter_image || '';
        fm.url = item.url || '';
        fm.comment_id = item.comment_id || '';
        fm.reading_time = item.reading_time || 0;
        fm.access = item.access !== undefined ? item.access : true;
        fm.comments = item.comments !== undefined ? item.comments : false;

        // --- Feature image handling ---
        if (item.feature_image) {
          if (isInternalMedia(item.feature_image)) {
            try {
              const urlObj = new URL(item.feature_image);
              const mediaFileName = safeMediaFileName(item.uuid, urlObj.pathname);
              const mediaPath = path.join(MEDIA_PATH, mediaFileName);
              try {
                const rel = await downloadFile(item.feature_image, mediaPath).catch(e => null);
                if (rel) fm.image = `${BASE_URL}/${rel.replace(/\\/g, '/')}`;
                else fm.image = item.feature_image; // fallback ke original bila gagal
              } catch (e) {
                logWarn(`Feature image download error for ${item.slug}: ${e.message}`);
                fm.image = item.feature_image;
              }
            } catch (e) {
              logWarn(`Invalid feature_image URL for ${item.slug}: ${item.feature_image}`);
              fm.image = item.feature_image;
            }
          } else {
            // eksternal image — biarkan apa adanya
            fm.image = item.feature_image;
          }
        }

        // --- Konten HTML: cari <img> dan unduh internal media, rewrite path ---
        let contentHtml = item.html || '';
        const imgUrls = extractImages(contentHtml);
        for (const imgUrl of imgUrls) {
          if (isInternalMedia(imgUrl)) {
            try {
              const urlObj = new URL(imgUrl);
              const mediaFileName = safeMediaFileName(item.uuid, urlObj.pathname);
              const mediaPath = path.join(MEDIA_PATH, mediaFileName);
              try {
                const rel = await downloadFile(imgUrl, mediaPath).catch(e => {
                  logWarn(`Failed to download image ${imgUrl}: ${e?.message || e}`);
                  return null;
                });
                if (rel) {
                  const newUrl = `${BASE_URL}/${rel.replace(/\\/g, '/')}`;
                  // rewrite semua kemunculan
                  contentHtml = contentHtml.replaceAll(imgUrl, newUrl);
                }
              } catch (e) {
                logWarn(`Error downloading image ${imgUrl}: ${e.message}`);
              }
            } catch (e) {
              logWarn(`Skipping invalid URL in content: ${imgUrl}`);
            }
          } else {
            logInfo(`External image left as-is: ${imgUrl}`);
          }
        }

        // --- Tulis file Markdown (frontmatter + HTML content) ---
        let frontMatter = '---\n';
        for (const [key, value] of Object.entries(fm)) {
          if (Array.isArray(value)) {
            frontMatter += `${key}:\n`;
            value.forEach(v => frontMatter += `  - "${v}"\n`);
          } else if (typeof value === 'string') {
            if (value.startsWith('|\n')) {
              frontMatter += `${key}: ${value}\n`;
            } else {
              frontMatter += `${key}: "${value}"\n`;
            }
          } else {
            frontMatter += `${key}: ${value}\n`;
          }
        }
        frontMatter += '---\n\n';

        if (DRY_RUN) {
          logInfo(`[DRY-RUN] Would write: ${path.relative(ROOT, filePath)} (${layout})`);
        } else {
          await fs.writeFile(filePath, frontMatter + `{% raw %}\n${contentHtml}\n{% endraw %}`, 'utf-8');
          logGood(`Synced ${type.slice(0, -1)}: ${path.relative(ROOT, filePath)}`);
        }
      } // end for items

      totalItems += items.length;
      logInfo(`Processed page ${page}/${totalPages} — ${items.length} items, total so far: ${totalItems}/${pagination.total}`);

      page++;

      // rate limit antar halaman (jika masih ada page berikutnya)
      if (page <= totalPages) await new Promise(r => setTimeout(r, PAGE_DELAY_MS));
    } while (page <= totalPages);

    logGood(`Total ${type} synced: ${totalItems}`);
    return totalItems;
  } catch (err) {
    logErr(`Sync failed for ${type}: ${err.message}`);
    // jika fatal untuk posts, set exitCode non-zero agar CI mendeteksi kegagalan
    if (type === 'posts') process.exitCode = 1;
    return 0;
  }
}

// ---------- Main runner (sekuensial posts -> pages) ----------
(async () => {
  logInfo(`Starting Ghost → Jekyll sync${DRY_RUN ? ' (DRY-RUN)' : ''}`);
  await loadMediaCache();

  // Run posts lalu pages, sekuensial agar log rapi & mengurangi beban API
  try {
    await syncContent('posts', 'post', POSTS_PATH);
    await syncContent('pages', 'page', PAGES_PATH);
  } catch (e) {
    logErr(`Unhandled error during sync: ${e.message}`);
    process.exitCode = 1;
  }

  await saveMediaCache();
  logGood('Sync finished.');
})();
