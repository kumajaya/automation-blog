---
ghost_uuid: "df371bfb-fa10-4599-b2f9-968f4fa6f510"
title: "Konfigurasi Special Measurement Unit pada Emerson Micro Motion™ Model 1700"
date: "2025-10-31T20:34:39.000+07:00"
slug: "dokumentasi-konfigurasi-emerson-micro-motion-model-1700-transmitter-with-analog-outputs-coriolis-flowmeter"
layout: "post"
excerpt: |
  Ubah mass flow kg/h menjadi m³/h, termasuk base unit, scale factor, label, aktivasi unit, reset totalizer, dan read-back verifikasi untuk siap audit, mudah dikerjakan, aman, dan sesuai kontrak.
image: "https://images.unsplash.com/photo-1610731364280-cda6aadfeaf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDI2fHxtZWFzdXJlbWVudHxlbnwwfHx8fDE3NjE5MTYzMTJ8MA&ixlib=rb-4.1.0&q=80&w=2000"
image_alt: ""
image_caption: "<span style=\"white-space: pre-wrap;\">Photo by </span><a href=\"https://unsplash.com/@alexvazpx?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Alexandra Vázquez</span></a><span style=\"white-space: pre-wrap;\"> / </span><a href=\"https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Unsplash</span></a>"
author:
  - "Ketut Kumajaya"
tags:
  - "Practical Engineering"
  - "Field Experience"
  - "Measurement Accuracy"
categories:
  - "practical-engineering"
featured: false
visibility: "public"
primary_author: "Ketut Kumajaya"
codeinjection_head: ""
codeinjection_foot: ""
canonical_url: ""
og_title: ""
og_description: ""
og_image: ""
twitter_title: ""
twitter_description: ""
twitter_image: ""
url: "https://automation.samatorgroup.com/blog/dokumentasi-konfigurasi-emerson-micro-motion-model-1700-transmitter-with-analog-outputs-coriolis-flowmeter/"
comment_id: "690499b87db4e6bba1ca5c76"
reading_time: 3
access: true
comments: false
---

{% raw %}
<p><em>Ditulis oleh Ketut Kumajaya — 31 Oktober 2025</em></p>
<h2 id="konteks">Konteks</h2>
<p>Artikel ini mendokumentasikan konfigurasi <em>Emerson Micro Motion™ Model 1700</em> untuk mengonversi unit pengukuran dari <strong>mass flow (kg/h)</strong> menjadi <strong>special measurement unit (m³/h)</strong>. Konfigurasi meliputi penetapan base unit, scale factor, label, dan aktivasi unit khusus melalui register Modbus. Hasilnya sesuai kebutuhan kontrak maupun operasi lapangan.</p>
<blockquote>
<p><strong>Catatan:</strong> Scale factor ditetapkan sebagai inverse dari 0.8874378 m³/h per kg/h → 1 ÷ 0.8874378 ≈ 1.12695 sesuai definisi Micro Motion™.</p>
</blockquote>
<hr>
<h2 id="kerangka-implementasi-kgh-%E2%86%92-m%C2%B3h">Kerangka Implementasi: kg/h → m³/h</h2>
<ul>
<li>
<p><strong>Base Mass Unit:</strong> kilograms</p>
</li>
<li>
<p><strong>Base Time Unit:</strong> hours</p>
</li>
<li>
<p><strong>Konversi:</strong> 1 kg/h = 0.8874378 m³/h → faktor konversi = <strong>1.12695</strong></p>
</li>
<li>
<p><strong>Register Modbus (Node-RED 0-based):</strong></p>
<ul>
<li>Base Unit: 131–132</li>
<li>Scale Factor: 237–238</li>
<li>Flow Label: 52–55</li>
<li>Total Label: 56–59</li>
<li>Active Unit: 39</li>
</ul>
</li>
</ul>
<blockquote>
<p><strong>Penting:</strong> Semua register sudah disesuaikan untuk Node‑RED (0-based). Pastikan tidak salah tulis 1-based (Emerson manual).</p>
</blockquote>
<hr>
<h2 id="konfigurasi-register">Konfigurasi Register</h2>
<table>
<thead>
<tr>
<th>Fungsi</th>
<th>Emerson manual (1‑based)</th>
<th>Node‑RED (0‑based)</th>
<th>Write Value</th>
<th>Catatan Kritikal</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Base unit (mass flow)</strong></td>
<td>132–133</td>
<td>131–132</td>
<td>[61,52]</td>
<td>Pastikan sesuai Node‑RED, jangan terbalik.</td>
</tr>
<tr>
<td><strong>Conversion factor (float32, WordSwap)</strong></td>
<td>238–239</td>
<td>237–238</td>
<td>[16482,16272]</td>
<td>Word Swap harus tepat: high/low word jangan tertukar.</td>
</tr>
<tr>
<td><strong>Flow label (ASCII, 4 words)</strong></td>
<td>53–56</td>
<td>52–55</td>
<td>[19763,12104,8224,8224]</td>
<td>—</td>
</tr>
<tr>
<td><strong>Total label (ASCII, 4 words)</strong></td>
<td>57–60</td>
<td>56–59</td>
<td>[19763,8224,8224,8224]</td>
<td>—</td>
</tr>
<tr>
<td><strong>Active mass flow unit</strong></td>
<td>40</td>
<td>39</td>
<td>253</td>
<td>Jangan salah register; aktifkan hanya satu.</td>
</tr>
<tr>
<td><strong>Stop/start flowmeter (coil)</strong></td>
<td>2 / 2</td>
<td>1 / 1</td>
<td>0 / 1</td>
<td><strong>Kritikal:</strong> selalu stop (0) sebelum konfigurasi, start (1) setelah selesai.</td>
</tr>
<tr>
<td><strong>Reset totalizer (coils, opsional)</strong></td>
<td>3–4</td>
<td>2–3</td>
<td>[1,1]</td>
<td>Lakukan hanya saat reset diperbolehkan.</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="visualisasi-alur">Visualisasi Alur</h2>
<figure style="display:flex; flex-direction:column; align-items:center; margin:2em auto; max-width:100%;">
  <div class="mermaid" style="max-width:100%; text-align:center;">
flowchart LR
    subgraph CONF["Konfigurasi"]
        direction TB
        A["Inject: Configure"] --&gt; B["Stop Flowmeter (Coil 1=0)"]
        B --&gt; C["Set Base Unit → kg/h"]
        C --&gt; D["Set Scale Factor → 1.12695"]
        D --&gt; E["Set Flow Label → 'M3/H'"]
        E --&gt; F["Set Total Label → 'M3'"]
        F --&gt; G["Activate Special Unit (Reg 39=253)"]
        G --&gt; H["Reset Totalizer (Coil 2–3=[1,1]) (opsional)"]
        H --&gt; I["Start Flowmeter (Coil 1=1)"]
    end
    subgraph VERIF["Verifikasi"]
        direction TB
        V1["Read‑Back Base Unit → kg/h"] --&gt; V2["Read‑Back Scale Factor → 1.12695"]
        V2 --&gt; V3["Read‑Back Flow Label → 'M3/H'"]
        V3 --&gt; V4["Read‑Back Total Label → 'M3'"]
        V4 --&gt; V5["Read‑Back Active Unit (Reg 39=253)"]
        V5 --&gt; V6["Debug: Verification Output (log semua nilai)"]
    end
    CONF --&gt; VERIF
  </div>
  <figcaption style="margin-top:0.5em; font-size:0.9em; color:#555; text-align:center; font-style:italic;">
    Alur konfigurasi dan verifikasi special measurement unit pada Emerson Micro Motion™ Model 1700 (Node-RED 0‑based).
  </figcaption>
</figure>
<hr>
<h2 id="fungsi-bantu">Fungsi Bantu</h2>
<h3 id="float32-word-swap">Float32 Word Swap</h3>
<pre><code class="language-javascript">function wordsToFloatWordSwap(words) {
  // Micro Motion float WordSwap: high/low word invert
  const buf = Buffer.alloc(4);
  buf.writeUInt16BE(words[1], 0);
  buf.writeUInt16BE(words[0], 2);
  return buf.readFloatBE(0);
}

function floatToWordsWordSwap(f) {
  const buf = Buffer.alloc(4);
  buf.writeFloatBE(f, 0);
  return [buf.readUInt16BE(2), buf.readUInt16BE(0)];
}
</code></pre>
<h3 id="ascii-unit-string">ASCII Unit String</h3>
<pre><code class="language-javascript">function asciiToWords(str, wordsLen = 4) {
  // Convert string ke 4-word ASCII untuk register
  const s = str.padEnd(wordsLen * 2, ' ').slice(0, wordsLen * 2);
  const words = [];
  for (let i = 0; i &lt; s.length; i += 2) {
    words.push((s.charCodeAt(i) &lt;&lt; 8) | s.charCodeAt(i + 1));
  }
  return words;
}

function wordsToAscii(words) {
  return words.map(w =&gt;
    String.fromCharCode((w &gt;&gt; 8) &amp; 0xFF) + String.fromCharCode(w &amp; 0xFF)
  ).join('').trimEnd();
}

// Contoh: asciiToWords("M3/H") → [19763,12104,8224,8224]
</code></pre>
<hr>
<h2 id="read%E2%80%91back-log">Read‑Back Log</h2>
<table>
<thead>
<tr>
<th>Timestamp</th>
<th>Register</th>
<th>Read‑Back</th>
<th>Decode</th>
</tr>
</thead>
<tbody>
<tr>
<td>2025-10-31 18:45:02</td>
<td>131–132</td>
<td>[61,52]</td>
<td>kg/h</td>
</tr>
<tr>
<td>2025-10-31 18:45:03</td>
<td>237–238</td>
<td>[16482,16272]</td>
<td>1.12695</td>
</tr>
<tr>
<td>2025-10-31 18:45:04</td>
<td>52–55</td>
<td>[19763,12104,8224,8224]</td>
<td>M3/H</td>
</tr>
<tr>
<td>2025-10-31 18:45:05</td>
<td>56–59</td>
<td>[19763,8224,8224,8224]</td>
<td>M3</td>
</tr>
<tr>
<td>2025-10-31 18:45:06</td>
<td>39</td>
<td>253</td>
<td>Special unit aktif</td>
</tr>
</tbody>
</table>
<blockquote>
<p><strong>Kritikal:</strong> semua write dan read-back harus <strong>match</strong>. Word Swap diterapkan untuk scale factor float32.</p>
</blockquote>
<hr>
<h2 id="checklist-verifikasi">Checklist Verifikasi</h2>
<ul>
<li>
<p><strong>Base Unit:</strong> register 131–132 → kg/h</p>
</li>
<li>
<p><strong>Scale Factor:</strong> register 237–238 → decode Word Swap ≈ 1.12695</p>
</li>
<li>
<p><strong>Unit String:</strong></p>
<ul>
<li>Flow label 52–55 → “M3/H”</li>
<li>Total label 56–59 → “M3”</li>
</ul>
</li>
<li>
<p><strong>Active Unit:</strong> register 39 = 253 → special unit aktif</p>
</li>
<li>
<p><strong>Status Operasi:</strong> Coil 1 = 0 saat konfigurasi, Coil 1 = 1 setelah start</p>
</li>
<li>
<p><strong>Audit Logging:</strong> simpan log write/read (timestamp, address, values, hasil decode)</p>
</li>
<li>
<p><strong>Safety Reminder:</strong> pastikan flowmeter berhenti sebelum menulis register / coil</p>
</li>
</ul>
<hr>
<h2 id="catatan-teknis">Catatan Teknis</h2>
<ul>
<li><strong>Komunikasi:</strong> Modbus RTU via TCP gateway, mapping register sesuai manual.</li>
<li><strong>Endianness:</strong> gunakan Word Swap untuk float32.</li>
<li><strong>Delay:</strong> sisipkan 100–200 ms antar operasi.</li>
<li><strong>Persistensi:</strong> simpan konfigurasi ke EEPROM bila tersedia.</li>
<li><strong>Keselamatan:</strong> lakukan perubahan saat flowmeter berhenti.</li>
<li><strong>Addressing:</strong> perhatikan perbedaan 1‑based vs 0‑based, selalu verifikasi dengan read‑back.</li>
</ul>
<blockquote>
<p><strong>Pengingat cepat</strong>: Manual Emerson menggunakan <em>1‑based addressing</em>, sedangkan Node‑RED driver menggunakan <em>0‑based addressing</em>. Aturan praktis: <code>Address Node‑RED = Address Emerson - 1</code>. Contoh: Register 132–133 (manual) = Register 131–132 (Node‑RED).</p>
</blockquote>
<hr>
<h2 id="penutup">Penutup</h2>
<p>Konfigurasi <strong>special measurement unit</strong> memungkinkan operator menampilkan data proses dalam satuan yang lebih relevan, meski tidak tersedia secara default.</p>
<ul>
<li><strong>Audit‑grade:</strong> semua langkah terdokumentasi.</li>
<li><strong>Operator‑friendly:</strong> konfigurasi + verifikasi cukup sekali klik di Node-RED.</li>
<li><strong>Fleksibel:</strong> dapat diterapkan untuk unit lain dengan menyesuaikan faktor konversi dan label.</li>
</ul>
<hr>
<h2 id="referensi">Referensi</h2>
<ul>
<li><a href="https://www.emerson.com/documents/automation/manual-micro-motion-model-1700-transmitters-analog-outputs-en-62454.pdf?ref=automation.samatorgroup.com" target="_blank">Configuration &amp; Use Manual – Micro Motion Model 1700 Transmitters (Analog Outputs)</a> (Diakses: 31 Oktober 2025)</li>
<li><a href="https://www.emerson.com/documents/automation/manual-modbus-mapping-assignments-for-transmitters-micro-motion-en-65522.pdf?ref=automation.samatorgroup.com" target="_blank">Modbus Mapping Assignments for Micro Motion Transmitters</a> (Diakses: 31 Oktober 2025)</li>
</ul>

{% endraw %}