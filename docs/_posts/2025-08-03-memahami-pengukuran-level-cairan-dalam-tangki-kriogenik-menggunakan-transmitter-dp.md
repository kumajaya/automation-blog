---
ghost_uuid: "d948b11e-c613-4b0e-82e1-932d6e1eb803"
title: "Memahami Pengukuran Level Cairan dalam Tangki Kriogenik Menggunakan Transmitter DP"
date: "2025-08-03T02:27:34.000+07:00"
slug: "memahami-pengukuran-level-cairan-dalam-tangki-kriogenik-menggunakan-transmitter-dp"
layout: "post"
excerpt: |
  Dokumen ini menjelaskan metode pengukuran level cairan kriogenik dengan transmitter DP, menyoroti pengaruh suhu terhadap densitas serta kaitannya dengan tekanan dalam ruang tertutup. Disertai studi kasus dan rekomendasi teknis untuk evaluasi dan peningkatan akurasi.
image: "/automation-blog/assets/media/d948b11e-c613-4b0e-82e1-932d6e1eb803-perpective_mermaid.png"
image_alt: ""
image_caption: "<span style=\"white-space: pre-wrap;\">Diagram hasil rendering </span><a href=\"https://www.mermaidchart.com/play?utm_source=mermaid_js#pako:eNqdkF9LwzAUxb_KpfbBgYWxIWrAP6jQIQNhFfpgRLImWUrTZKSJc4y97KP6Sez6Z1Rxinu8Ofd3zsldeYmmzENeEARYJVrxdIawApBkqZ1FQMnMMKwqmUu9SAQxFsaT7Q5A_Iw931_Fa99H8MQyooiCUUqNLiyxaVG-GZc5A8d5PvrYbB572HuBILiCictd8VrzMVyCAIwTqi1Eoe-XS7V_FNYBUVgl3DJDLDwwVTrfpxmzRLj0m2MNypoTO2xOYMzemIQ7khqirreNej-izdARRGUmypYYc0OS8r91o13PZq9iRDe6m1lWtix35ZHa8OaINysoBJkzBEY7RRldf2myT47CfYr83VHsk_cKhV1KBjHwVEp0RPtsyvlJYY3OGDoaJEN22m_GYJFSK9Bg_t4l25vWPO_zs__xUXhwtGxDOR9ODygtDi7dknTIL-j536S3_gSQRimc\" rel=\"noreferrer\"><span style=\"white-space: pre-wrap;\">Mermaid Live Editor</span></a><span style=\"white-space: pre-wrap;\"> dengan efek perspektif dari </span><a href=\"https://www1.lunapic.com/editor/\" rel=\"noreferrer\"><span style=\"white-space: pre-wrap;\">LunaPic</span></a>"
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
url: "https://automation.samatorgroup.com/blog/memahami-pengukuran-level-cairan-dalam-tangki-kriogenik-menggunakan-transmitter-dp/"
comment_id: "6888a5c462601b27cbae6c34"
reading_time: 13
access: true
comments: false
---

{% raw %}

<!--kg-card-begin: html-->
<aside class="gh-sidebar">
  <button class="toc-toggle" aria-expanded="false" aria-controls="gh-toc">
    <span class="toc-toggle-icon">☰</span> Daftar Isi
  </button>
  <div class="gh-toc js-toc" id="gh-toc"></div>
</aside>
<!--kg-card-end: html-->
<p><i class="fa-solid fa-pen" aria-hidden="true"></i> <strong>Ditulis kembali oleh</strong>: Ketut Kumajaya<br>
<i class="fa-solid fa-calendar-alt" aria-hidden="true"></i> <strong>Publikasi awal</strong>: 28 November 2021</p>
<h2 id="i-classfa-solid-fa-compass-aria-hiddentruei-pendahuluan"><i class="fa-solid fa-compass" aria-hidden="true"></i> Pendahuluan</h2>
<p>Bejana kriogenik adalah tangki khusus untuk menyimpan cairan bersuhu sangat rendah, seperti nitrogen cair pada -195°C atau oksigen cair pada -183°C. Pengukuran level cairan dalam bejana bertekanan sering kali menjadi tantangan teknis di lapangan bagi banyak profesional gas industri, meskipun telah bertahun-tahun bergelut di dunia cairan kriogenik. Salah satu alat yang paling efisien untuk tugas ini adalah <em>Differential Pressure Transmitter</em> (DP transmitter), sebuah sensor yang mengukur selisih tekanan untuk menentukan ketinggian cairan.</p>
<p>Tangki kriogenik berbeda dengan tangki cairan biasa. Selain karena tekanan internalnya bisa mencapai 10 bar bahkan lebih, suhu cairannya bisa di bawah -180°C. Ketika suhu naik, cairan menguap dan menghasilkan tekanan tambahan yang bisa berdampak pada akurasi pembacaan level.</p>
<p>Artikel ini menyajikan pendekatan praktis, visual, dan dapat diaudit untuk memahami:</p>
<ul>
<li>Prinsip kerja DP transmitter</li>
<li>Rumus penghitungan level cairan</li>
<li>Dampak temperatur terhadap berat jenis</li>
<li>Studi kasus tangki nitrogen dan oksigen</li>
<li>Korelasi volume, berat, dan konversi gas</li>
</ul>
<hr>
<h2 id="i-classfa-solid-fa-microscope-aria-hiddentruei-prinsip-kerja-pengukuran-level-dalam-bejana-bertekanan"><i class="fa-solid fa-microscope" aria-hidden="true"></i> Prinsip Kerja Pengukuran Level dalam Bejana Bertekanan</h2>
<h3 id="i-classfa-solid-fa-lock-stylecolor-f39c12-aria-hiddentruei-bejana-kriogenik"><i class="fa-solid fa-lock" style="color: #f39c12;" aria-hidden="true"></i> Bejana Kriogenik</h3>
<p>Untuk cairan seperti oksigen atau nitrogen, digunakan bejana berdinding ganda dengan <strong>ruang vakum antar dinding</strong> sebagai komponen kunci yang berfungsi sebagai isolator panas. Tujuannya adalah:</p>
<ul>
<li>Meminimalkan transfer panas</li>
<li>Menjaga cairan tetap dalam bentuk kriogenik</li>
<li>Mencegah penguapan dini saat tekanan dibangun (<em>PB system</em>)</li>
</ul>
<div style="display: flex; flex-direction: column; align-items: center;">
  <img src="/automation-blog/assets/media/d948b11e-c613-4b0e-82e1-932d6e1eb803-level_measurement.svg" alt="level_measurement.svg" style="max-width:100%; height:auto;">
  <figcaption style="text-align:center; margin-top: 8px;">
    Gambar 1. Pengukuran Level Bejana Bertekanan
  </figcaption>
</div>
<h3 id="i-classfa-solid-fa-gauge-aria-hiddentruei-cara-kerja-dp-transmitter"><i class="fa-solid fa-gauge" aria-hidden="true"></i> Cara Kerja DP Transmitter</h3>
<p>DP transmitter mengukur selisih tekanan: Port H (di dasar bejana) menerima tekanan hidrostatis cairan dan tekanan permukaan, sedangkan Port L (di atas bejana) hanya menerima tekanan permukaan. Selisih ini mencerminkan tekanan hidrostatis akibat berat cairan (W).</p>
<p><i class="fa-solid fa-brain" style="color: #3498db;" aria-hidden="true"></i> <strong>Kesimpulan:</strong> Level cairan ditentukan oleh tekanan hidrostatis saja, efek tekanan permukaan tidak ada sama sekali.</p>
<h3 id="i-classfa-solid-fa-square-root-variable-aria-hiddentruei-rumus-pengukuran-level-cairan"><i class="fa-solid fa-square-root-variable" aria-hidden="true"></i> Rumus Pengukuran Level Cairan</h3>
<p>Level cairan diukur menggunakan transmitter tekanan diferensial (DP), yang membaca perbedaan tekanan antara dasar tangki dan titik referensi di atas.</p>
<div style="display: flex; flex-direction: column; align-items: center;">
  <div class="mermaid" style="width: 100%; max-width: 800px;">
    flowchart LR
        W["${W}$: Tekanan Hidrostatis Terukur<br><small>(mmH₂O)</small>"] --&gt; Rumus_W
        SG["${SG}$: Berat Jenis Diketahui"] --&gt; Rumus_W
        l["${h}$: Berapa Level Cairan?<br><small>(mm)</small>"] --&gt; Rumus_W
        Rumus_W["$$W = h \cdot SG$$"] --&gt; Rumus_h
        Rumus_h["$$h = \frac{W}{SG}$$"] --&gt; h["${h}$: Level Cairan Ditemukan<br><small>(mm)</small>"]
        style Rumus_W fill:#f0f7ff,stroke:#2c3e50,stroke-width:2px
        style Rumus_h fill:#f0f7ff,stroke:#2c3e50,stroke-width:2px
        style W fill:#d0ebff,stroke:#2c3e50,stroke-width:2px
        style SG fill:#d0ebff,stroke:#2c3e50,stroke-width:2px
        style l fill:#fff3bf,stroke:#2c3e50,stroke-width:2px
        style h fill:#d3f9d8,stroke:#2c3e50,stroke-width:2px
  </div>
  <figcaption style="text-align:center; margin-top: 8px;">
    Gambar 2. Visualisasi Rumus DP Transmitter
  </figcaption>
</div>
<ul>
<li><strong>W:</strong> Tekanan hidrostatis dalam satuan \(\text{mmH}_2\text{O}\)</li>
<li><strong>h:</strong> Tinggi level cairan dalam mm</li>
<li><strong>SG</strong>: Specific Gravity atau Berat Jenis — rasio densitas cairan terhadap densitas air pada 4°C (1,0 kg/liter)</li>
</ul>
<p><i class="fa-solid fa-bullhorn" style="color: #f39c12;" aria-hidden="true"></i> <strong>Penting:</strong> DP transmitter <strong>tidak mengukur tinggi cairan secara langsung</strong>, melainkan tekanan hidrostatis yang dihasilkan oleh kolom cairan. Maka, <strong>tinggi aktual baru bisa dihitung jika kita mengetahui berat jenis cairan tersebut</strong>.</p>
<h3 id="i-classfa-solid-fa-chart-bar-aria-hiddentruei-contoh-perhitungan"><i class="fa-solid fa-chart-bar" aria-hidden="true"></i> Contoh Perhitungan</h3>
<p>Setelah memahami rumus dasar, penting untuk mempertimbangkan bagaimana perubahan berat jenis memengaruhi pengukuran level. Misalnya, jika transmitter menunjukkan <strong>10000 mmH₂O</strong>, maka tinggi cairan aktual dapat berbeda tergantung berat jenisnya:</p>
<ul>
<li>SG = 1,141 → h = 10000 / 1,141 ≈ 8764 mm (8,76 m)</li>
<li>SG = 0,808 → h = 10000 / 0,808 ≈ 12376 mm (12,38 m)</li>
</ul>
<p><i class="fa-solid fa-book" style="color: #3498db;" aria-hidden="true"></i> <strong>Catatan:</strong> Karena air memiliki densitas 1,0 kg/liter pada 4°C, nilai berat jenis dari cairan kriogenik dapat langsung digunakan sebagai pendekatan untuk densitasnya dalam kg/liter.</p>
<p><i class="fa-solid fa-calculator" aria-hidden="true"></i> <strong>Contoh:</strong> Berat jenis nitrogen cair 0,808 → densitas ≈ 0,808 kg/liter <em>(karena SG tak bersatuan, sedangkan densitas air = 1 kg/liter)</em> → 1000 liter ≈ 808 kg. Untuk akurasi tinggi, gunakan tabel densitas terhadap suhu dan tekanan aktual.</p>
<hr>
<h2 id="i-classfa-solid-fa-flask-aria-hiddentruei-pengaruh-tekanan-terhadap-berat-jenis"><i class="fa-solid fa-flask" aria-hidden="true"></i> Pengaruh Tekanan terhadap Berat Jenis</h2>
<table>
<thead>
<tr>
<th>Cairan</th>
<th>SG @ 1 atm</th>
<th>SG @ 7 barg</th>
<th>SG @ 27 barg</th>
</tr>
</thead>
<tbody>
<tr>
<td>Nitrogen</td>
<td>0,808</td>
<td>0,687</td>
<td>0,492</td>
</tr>
<tr>
<td>Oksigen</td>
<td>1,141</td>
<td>1,000</td>
<td>0,814</td>
</tr>
<tr>
<td>Argon</td>
<td>1,395</td>
<td>1,221</td>
<td>0,984</td>
</tr>
<tr>
<td>CO₂</td>
<td>—</td>
<td>1,141</td>
<td>0,970</td>
</tr>
<tr>
<td>N₂O</td>
<td>1,216</td>
<td>1,084</td>
<td>—</td>
</tr>
</tbody>
</table>
<figcaption style="text-align:center; margin-top: 4px;">
  Catatan: Nilai berat jenis referensi diperoleh dari aplikasi Vessel Volume. Data untuk CO₂ pada 1 atm dan N₂O pada 27 barg tidak tersedia karena di luar rentang operasional standar.
</figcaption>
<div style="display: flex; flex-direction: column; align-items: center;">
  <img src="/automation-blog/assets/media/d948b11e-c613-4b0e-82e1-932d6e1eb803-kurva_sg_vs_tekanan.svg" alt="kurva_sg_vs_tekanan.svg" style="max-width:100%; height:auto;">
  <figcaption style="text-align:center; margin-top: 8px;">
    Gambar 3. Pengaruh Tekanan terhadap Berat Jenis Cairan Kriogenik
  </figcaption>
</div>
<details>
  <summary>Tampilkan script Python untuk plot kurva di atas</summary>
<pre><code class="language-python">import matplotlib.pyplot as plt
plt.rcParams['svg.fonttype'] = 'none'  # simpan teks sebagai teks, bukan path
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial']
plt.rcParams['font.size'] = 12

# Tekanan dalam bar gauge
pressures = [1, 7, 27]

# Data SG (None untuk nilai yang tidak tersedia)
fluids = {
    'Nitrogen': [0.808, 0.687, 0.492],
    'Oksigen':  [1.141, 1.000, 0.814],
    'Argon':    [1.395, 1.221, 0.984],
    'CO₂':      [None, 1.141, 0.970],
    'N₂O':      [1.216, 1.084, None]
}

# Plot
plt.figure(figsize=(8, 5))
for fluid, sg_values in fluids.items():
    valid_pressures = [p for p, sg in zip(pressures, sg_values) if sg is not None]
    valid_sg = [sg for sg in sg_values if sg is not None]
    plt.plot(valid_pressures, valid_sg, marker='o', label=fluid)

plt.title('Pengaruh Tekanan terhadap SG Cairan Kriogenik')
plt.xlabel('Tekanan (bar gauge)')
plt.ylabel('Specific Gravity (SG)')
plt.grid(True, linestyle='--', alpha=0.5)
plt.legend()

# Simpan sebagai SVG
plt.tight_layout()
plt.savefig("kurva_sg_vs_tekanan.svg", format="svg")

# Tampilkan
plt.show()
</code></pre>
</details>
<h3 id="i-classfa-solid-fa-tint-aria-hiddentruei-faktor-penyebab-perubahan-berat-jenis"><i class="fa-solid fa-tint" aria-hidden="true"></i> Faktor Penyebab Perubahan Berat Jenis</h3>
<p>Bayangkan cairan dalam tangki seperti balon yang mengembang saat dipanaskan: volumenya bertambah, namun massanya tetap sama. Pada bejana kriogenik, kenaikan suhu menyebabkan cairan mengalami ekspansi → densitas menurun → berat jenis turun. Karena ruang bejana tertutup, ekspansi ini juga menaikkan tekanan internal.</p>
<p>Namun perlu dicatat: <strong>bukan tekanan yang menyebabkan berat jenis cairan berubah</strong>, melainkan suhu. Untuk massa cairan yang tetap, volume yang membesar dapat menyebabkan <strong>kenaikan tinggi geometri cairan</strong>, walaupun <strong>massa totalnya tidak berubah</strong>.</p>
<p>Karena <strong>DP transmitter hanya mengukur tekanan hidrostatis</strong> (\(W = h \cdot SG\)), penurunan berat jenis (SG) dapat dikompensasi oleh kenaikan level (h), sehingga <strong>pembacaan DP bisa relatif tetap</strong>, padahal tinggi geometri cairan sebenarnya naik.</p>
<p><i class="fa-solid fa-lightbulb" style="color: #f39c12;" aria-hidden="true"></i> <strong>Kesimpulan penting:</strong> Pembacaan tekanan hidrostatis yang hampir konstan <strong>tidak selalu berarti</strong> level cairan konstan. Ini adalah <strong>sumber error signifikan</strong> jika berat jenis tidak dikoreksi.</p>
<h3 id="i-classfa-solid-fa-toolbox-aria-hiddentruei-solusi-praktis"><i class="fa-solid fa-toolbox" aria-hidden="true"></i> Solusi Praktis</h3>
<p>Untuk mengatasi tantangan perubahan berat jenis dalam pengukuran level cairan kriogenik, berikut beberapa solusi praktis yang dapat diterapkan:</p>
<ol>
<li>
<p><strong>Kompensasi berat jenis secara dinamis</strong><br>
Hitung berat jenis cairan kriogenik berdasarkan <strong>suhu dan tekanan aktual</strong>. Pendekatan ini dapat dilakukan melalui:</p>
<ul>
<li>Rumus empiris atau korelasi eksperimental</li>
<li><em>Lookup table</em> (misalnya untuk LOX, LIN, atau LAR), yang dikalibrasi berdasarkan data densitas pada berbagai kondisi operasi</li>
</ul>
<p>Dalam implementasinya, kompensasi ini dapat dilakukan secara otomatis menggunakan:</p>
<ul>
<li><strong>Mikrokontroler</strong> (seperti Arduino dengan perlindungan standar industri: Industruino, Controllino, Opta, Portenta, Industrial Shields) dengan sensor suhu dan tekanan digital</li>
<li><strong>PLC atau DCS</strong>, melalui function block atau skrip yang membaca transmitter suhu dan tekanan lalu menghitung berat jenis aktual secara real-time</li>
</ul>
</li>
<li>
<p><strong>Gunakan sensor level redundan</strong><br>
Sensor seperti <strong>radar</strong>, <strong>kapasitif</strong>, atau <strong>guided wave radar</strong> memberikan pembacaan level <strong>independen dari berat jenis cairan</strong>, sehingga lebih andal saat kondisi fisik berubah. Namun, implementasinya dapat menjadi tantangan bila tangki tidak dirancang untuk jenis sensor tersebut sejak awal.</p>
</li>
<li>
<p><strong>Perkiraan berat jenis berdasarkan rata-rata tekanan — hanya untuk estimasi kasar</strong><br>
Bila kompensasi real-time tidak tersedia, pendekatan alternatif adalah menggunakan berat jenis perkiraan berdasarkan tekanan rata-rata. Namun perlu diingat:</p>
<ul>
<li>Perubahan suhu yang kecil sekalipun dapat menyebabkan <strong>error signifikan dalam pembacaan level</strong></li>
<li>Koreksi ini tetap tidak menggantikan kompensasi berbasis data aktual</li>
</ul>
</li>
</ol>
<p><i class="fa-solid fa-calculator" style="color: #3498db;" aria-hidden="true"></i> Gunakan aplikasi <strong>Vessel Volume</strong> untuk memprediksi <strong>berat jenis cairan</strong> berdasarkan <strong>suhu atau tekanan</strong>, menghitung level cairan secara dinamis, serta memperkirakan <strong>volume cairan</strong> secara akurat sesuai <strong>geometri tangki</strong>.</p>
<hr>
<h2 id="i-classfa-solid-fa-stream-aria-hiddentruei-studi-kasus-tangki-nitrogen"><i class="fa-solid fa-stream" aria-hidden="true"></i> Studi Kasus Tangki Nitrogen</h2>
<p>Tangki dengan tinggi <em>trycock</em> = <strong>8837 mm</strong></p>
<h3 id="i-classfa-solid-fa-chart-line-aria-hiddentruei-perhitungan-dp-pada-berbagai-tekanan"><i class="fa-solid fa-chart-line" aria-hidden="true"></i> Perhitungan DP pada Berbagai Tekanan</h3>
<p>Dalam pengoperasian tangki kriogenik, <strong>DP transmitter membaca "berat kolom cairan"</strong>, bukan volume atau tinggi sebenarnya. Karena berat jenis cairan berubah terhadap suhu dan tekanan, maka <strong>pembacaan DP harus dikoreksi dengan berat jenis aktual</strong>.</p>
<p>Tabel berikut memperlihatkan bagaimana nilai DP berubah meskipun tinggi fisik cairan tetap sama:</p>
<table>
<thead>
<tr>
<th>Tekanan (barg)</th>
<th>SG</th>
<th>DP (mmH₂O)</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0,808</td>
<td>8837 × 0,808 ≈ 7140</td>
</tr>
<tr>
<td>7</td>
<td>0,687</td>
<td>8837 × 0,687 ≈ 6071</td>
</tr>
<tr>
<td>27</td>
<td>0,492</td>
<td>8837 × 0,492 ≈ 4348</td>
</tr>
</tbody>
</table>
<div style="display: flex; flex-direction: column; align-items: center;">
  <img src="/automation-blog/assets/media/d948b11e-c613-4b0e-82e1-932d6e1eb803-kurva_sg_vs_dp.svg" alt="kurva_sg_vs_dp.svg" style="max-width:100%; height:auto;">
  <figcaption style="text-align:center; margin-top: 8px;">
    Gambar 4. Pengaruh Tekanan terhadap Berat Jenis dan DP (Nitrogen)
  </figcaption>
</div>
<details>
  <summary>Tampilkan script Python untuk plot kurva di atas</summary>
<pre><code class="language-python">import matplotlib.pyplot as plt
plt.rcParams['svg.fonttype'] = 'none'  # simpan teks sebagai teks, bukan path
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial']
plt.rcParams['font.size'] = 12

# Data nitrogen cair
pressure = [0, 7, 27]  # dalam barg
sg = [0.808, 0.687, 0.492]
h_mm = 8837  # tinggi cairan tetap dalam mm
dp = [round(h_mm * s, 0) for s in sg]  # DP target dalam mmH2O

# Buat plot
fig, ax1 = plt.subplots(figsize=(8, 5))

# Sumbu Y kiri - SG
color = 'tab:blue'
ax1.set_xlabel('Tekanan (bar gauge)')
ax1.set_ylabel('Specific Gravity (SG)', color=color)
ax1.bar(pressure, sg, width=2.5, color=color, alpha=0.6, label='SG')
ax1.tick_params(axis='y', labelcolor=color)
ax1.set_ylim(0, 1)

# Sumbu Y kanan - DP
ax2 = ax1.twinx()
color = 'tab:red'
ax2.set_ylabel('DP Terukur (mmH₂O)', color=color)
ax2.plot(pressure, dp, color=color, marker='o', linewidth=2, label='DP Target')
ax2.tick_params(axis='y', labelcolor=color)
ax2.set_ylim(0, h_mm * sg[0] + 1000)

# Judul dan grid
plt.title('Pengaruh Tekanan terhadap SG dan DP (tinggi cairan tetap)')
ax1.grid(True)
plt.tight_layout()

# Simpan sebagai SVG
plt.savefig("kurva_sg_vs_dp.svg", format="svg")

# Tampilkan
plt.show()
</code></pre>
</details>
<p><i class="fa-solid fa-chart-line" aria-hidden="true"></i> <em>Perbedaan pembacaan DP transmitter di tiga tekanan berbeda pada ketinggian fisik yang sama menggambarkan betapa pentingnya menggunakan berat jenis aktual. Tanpa koreksi ini, operator bisa keliru menginterpretasikan level cairan.</em></p>
<p><i class="fa-solid fa-check-circle" style="color: #3498db;" aria-hidden="true"></i> <strong>Insight:</strong> Saat cairan lebih hangat pada tangki dengan tekanan kerja 27 barg, berat jenis lebih rendah signifikan → DP transmitter membaca level yang lebih rendah meskipun tinggi geometri cairan sama. Jadi, tanpa koreksi berat jenis, DP transmitter bisa “menipu”: level fisik penuh, tapi pembacaan tampak rendah.</p>
<h3 id="i-classfa-solid-fa-calculator-stylecolor-3498db-aria-hiddentruei-aplikasi-vessel-volume"><i class="fa-solid fa-calculator" style="color: #3498db;" aria-hidden="true"></i> Aplikasi Vessel Volume</h3>
<p>Sebelum mengandalkan data dari DP transmitter, penting untuk memahami bagaimana <strong>temperatur dan tekanan</strong> memengaruhi berat jenis cairan kriogenik. Aplikasi <strong>Vessel Volume</strong> bisa digunakan untuk keperluan tersebut.</p>
<h3 id="i-classfa-solid-fa-explosion-stylecolor-e74c3c-aria-hiddentruei-risiko-overfill"><i class="fa-solid fa-explosion" style="color: #e74c3c;" aria-hidden="true"></i>  Risiko Overfill</h3>
<p>Kapasitas berat maksimum cairan biasanya dihitung saat cairan berada pada kondisi terdingin (1 atm). Jika tangki ingin diisi hingga berat maksimum dalam kondisi bertekanan tinggi, volume cairan akan melebihi batas geometris tangki karena cairan mengembang.</p>
<p>Bayangkan mengisi botol air hingga penuh, lalu memanaskannya—air akan meluap karena mengembang. Hal serupa terjadi pada cairan kriogenik, yang dapat menyebabkan overfill jika perubahan berat jenis tidak diperhitungkan.</p>
<p>Tabel berikut menunjukkan bagaimana <strong>berat dan keluaran gas berubah</strong> pada tekanan berbeda, meskipun <strong>volume tetap sama</strong>:</p>
<table>
<thead>
<tr>
<th>Tekanan (barg)</th>
<th>Volume (L)</th>
<th>Berat (kg)</th>
<th>Gas @ 1 atm (Nm³)</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>30000</td>
<td>24225</td>
<td>21498</td>
</tr>
<tr>
<td>7</td>
<td>30000</td>
<td>20594</td>
<td>18276</td>
</tr>
<tr>
<td>27</td>
<td>30000</td>
<td>14773</td>
<td>13110</td>
</tr>
</tbody>
</table>
<div style="display: flex; flex-direction: column; align-items: center;">
  <img src="/automation-blog/assets/media/d948b11e-c613-4b0e-82e1-932d6e1eb803-kurva_berat_vs_tekanan.svg" alt="kurva_berat_vs_tekanan.svg" style="max-width:100%; height:auto;">
  <figcaption style="text-align:center; margin-top: 8px;">
    Gambar 5. Pengaruh Tekanan terhadap Berat
  </figcaption>
</div>
<details>
  <summary>Tampilkan script Python untuk plot kurva di atas</summary>
<pre><code class="language-python">import matplotlib.pyplot as plt
plt.rcParams['svg.fonttype'] = 'none'  # simpan teks sebagai teks, bukan path
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial']
plt.rcParams['font.size'] = 12

# Data nitrogen cair
pressure = [0, 7, 27]  # barg
volume = [30000, 30000, 30000]  # Liter (tetap)
weight = [24225, 20594, 14773]  # kg LIN
gas_output = [21498, 18276, 13110]  # Nm³ nitrogen @ 1 atm

# Buat plot
fig, ax1 = plt.subplots(figsize=(8, 5))

# Sumbu Y kiri - berat nitrogen
color = 'tab:blue'
ax1.set_xlabel('Tekanan (bar gauge)')
ax1.set_ylabel('Berat Nitrogen Cair (kg)', color=color)
ax1.bar(pressure, weight, width=2.5, color=color, alpha=0.6, label='Berat LIN')
ax1.tick_params(axis='y', labelcolor=color)
ax1.set_ylim(0, max(weight)*1.1)

# Sumbu Y kanan - gas yang bisa diambil
ax2 = ax1.twinx()
color = 'tab:green'
ax2.set_ylabel('Konversi ke Gas @ 1 atm (Nm³)', color=color)
ax2.plot(pressure, gas_output, color=color, marker='o', linewidth=2, label='Gas LIN @ 1 atm')
ax2.tick_params(axis='y', labelcolor=color)
ax2.set_ylim(0, max(gas_output)*1.1)

# Judul dan grid
plt.title('Pengaruh Tekanan terhadap Berat (volume tetap)')
ax1.grid(True)
plt.tight_layout()

# Simpan sebagai SVG
plt.savefig("kurva_berat_vs_tekanan.svg", format="svg")

# Tampilkan
plt.show()
</code></pre>
</details>
<p><i class="fa-solid fa-bullhorn" style="color: #f39c12;" aria-hidden="true"></i> <strong>Catatan Audit:</strong> Jika tangki ingin diisi hingga berat maksimum dalam kondisi bertekanan tinggi, volume cairan akan melebihi batas geometris tangki karena cairan mengembang.</p>
<p><i class="fa-solid fa-exclamation-triangle" style="color: #e74c3c;" aria-hidden="true"></i> <em>Hal ini sangat berisiko menyebabkan overfill</em>, tekanan berlebih, dan aktivasi venting otomatis, termasuk DP transmitter yang dibanjiri cairan kriogenik bisa mengakibatkan kerusakan alat.</p>
<hr>
<h2 id="i-classfa-solid-fa-stream-aria-hiddentruei-studi-kasus-tambahan-tangki-oksigen"><i class="fa-solid fa-stream" aria-hidden="true"></i> Studi Kasus Tambahan: Tangki Oksigen</h2>
<p>Sebagai pelengkap, studi kasus berikut menyoroti pentingnya koreksi berat jenis untuk oksigen cair dengan pembahasan yang lebih ringkas.</p>
<p>Sebuah tangki oksigen cair memiliki ketinggian <em>trycock</em> 8837 mm. Pada kondisi atmosfer (1 atm), berat jenis oksigen cair adalah <strong>1,141</strong>, sehingga tekanan diferensial (DP) untuk level penuh adalah:</p>
<p><code>DP = 8837 mm × 1,141 ≈ 10086 mmH₂O</code></p>
<p>Namun, berat jenis oksigen cair akan berubah tergantung tekanan. Misalnya:</p>
<ul>
<li>Pada <strong>7 barg</strong> (SG ≈ 1,000), maka <code>DP ≈ 8837 mmH₂O</code></li>
<li>Pada <strong>27 barg</strong> (SG ≈ 0,814), maka <code>DP ≈ 7195 mmH₂O</code></li>
</ul>
<p>Artinya, <strong>meskipun tinggi geometri cairan tetap</strong>, <strong>nilai DP bisa berubah signifikan</strong> akibat perubahan berat jenis. Hal ini semakin menegaskan pentingnya melakukan <strong>koreksi berat jenis</strong> saat menggunakan transmitter DP untuk pengukuran level cairan kriogenik seperti oksigen dan nitrogen cair.</p>
<div style="display: flex; flex-direction: column; align-items: center;">
  <img src="/automation-blog/assets/media/d948b11e-c613-4b0e-82e1-932d6e1eb803-kurva_sg_vs_dp_oksigen.svg" alt="kurva_sg_vs_dp_oksigen.svg" style="max-width:100%; height:auto;">
  <figcaption style="text-align:center; margin-top: 8px;">
    Gambar 6. Pengaruh Tekanan terhadap Berat Jenis dan DP (Oksigen)
  </figcaption>
</div>
<details>
  <summary>Tampilkan script Python untuk plot kurva di atas</summary>
<pre><code class="language-python">import matplotlib.pyplot as plt
plt.rcParams['svg.fonttype'] = 'none'  # simpan teks sebagai teks, bukan path
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial']
plt.rcParams['font.size'] = 12

# Data oksigen cair
pressure = [0, 7, 27]  # dalam barg
sg = [1.141, 1.000, 0.814]  # Berat Jenis
h_mm = 8837  # tinggi cairan tetap dalam mm
dp = [round(h_mm * s, 0) for s in sg]  # DP target dalam mmH2O

# Buat plot
fig, ax1 = plt.subplots(figsize=(8, 5))

# Sumbu Y kiri - SG
color = 'tab:blue'
ax1.set_xlabel('Tekanan (bar gauge)')
ax1.set_ylabel('Specific Gravity (SG)', color=color)
ax1.bar(pressure, sg, width=2.5, color=color, alpha=0.6, label='SG')
ax1.tick_params(axis='y', labelcolor=color)
ax1.set_ylim(0, 1.5)

# Sumbu Y kanan - DP
ax2 = ax1.twinx()
color = 'tab:red'
ax2.set_ylabel('DP Terukur (mmH₂O)', color=color)
ax2.plot(pressure, dp, color=color, marker='o', linewidth=2, label='DP Target')
ax2.tick_params(axis='y', labelcolor=color)
ax2.set_ylim(0, h_mm * sg[0] + 1000)

# Judul dan grid
plt.title('Pengaruh Tekanan terhadap SG dan DP (O₂, tinggi cairan tetap)')
ax1.grid(True)

# Simpan sebagai SVG
plt.tight_layout()
plt.savefig("kurva_sg_vs_dp_oksigen.svg", format="svg")

# Tampilkan
plt.show()
</code></pre>
</details>
<hr>
<h2 id="i-classfa-solid-fa-exclamation-circle-stylecolor-3498db-aria-hiddentruei-rekomendasi"><i class="fa-solid fa-exclamation-circle" style="color: #3498db;" aria-hidden="true"></i> Rekomendasi</h2>
<ul>
<li>Gunakan aplikasi <strong>Vessel Volume</strong> untuk menghitung <strong>berat jenis dinamis</strong> dan memperkirakan <strong>jangkauan transmitter DP</strong> berdasarkan berat jenis aktual yang dihitung dari suhu atau tekanan operasi.</li>
<li>Jangan gunakan tabel konversi dari vendor tangki secara langsung tanpa koreksi kondisi kerja.</li>
<li>Contoh kasus di atas pada kondisi 27 barg, cukup isi tangki hingga DP transmitter membaca ±4348 mmH₂O (bukan target level cairan pada 1 atm yang 7140 mmH₂O).</li>
</ul>
<p><i class="fa-solid fa-wrench" style="color: #f39c12;" aria-hidden="true"></i> <strong>Tips Operasional:</strong> Semakin tinggi tekanan → semakin sedikit berat cairan yang bisa dimasukkan ke tangki untuk volume yang tetap.</p>
<p><i class="fa-solid fa-code-branch" aria-hidden="true"></i> Untuk memastikan pengukuran level yang akurat, ikuti langkah-langkah berikut dalam flowchart untuk mengintegrasikan koreksi berat jenis dengan transmitter DP:</p>
<details>
  <summary>Tampilkan Flowchart Pengukuran Level menggunakan Transmitter DP</summary>
<div style="display: flex; flex-direction: column; align-items: center;">
  <div class="mermaid" style="width: 100%; max-width: 650px; font-size: 14px;">
    flowchart TD
        %% === Class Definitions ===
        classDef utama fill:#e0f2fe,stroke:#0284c7,color:#0c4a6e,stroke-width:2px,font-weight:bold;
        classDef proses fill:#ecfdf5,stroke:#10b981,color:#065f46;
        classDef keputusan fill:#fefce8,stroke:#eab308,color:#92400e;
        classDef akhir fill:#f3e8ff,stroke:#a855f7,color:#6b21a8,stroke-width:2px;
        %% === Diagram Nodes ===
        A["Mulai"]:::utama --&gt; B{"Berat jenis cairan<br>diketahui?"}:::keputusan
        B -- "Ya" --&gt; C{"Berat jenis<br>konstan?"}:::keputusan
        B -- "Tidak" --&gt; D["Ambil data dari<br>tabel berat jenis atau<br>hitung dari suhu &amp; tekanan"]:::proses
        D --&gt; C
        C -- "Ya" --&gt; I["Hitung level<br>$$h = \frac{DP}{SG}$$"]:::proses
        C -- "Tidak" --&gt; E["Implementasi koreksi<br>di DCS / PLC / mikrokontroler"]:::proses
        E --&gt; F["Ambil data<br>suhu &amp; tekanan"]:::proses
        F --&gt; G["Hitung<br>berat jenis cairan"]:::proses
        G --&gt; I
        I --&gt; J{"Hasil valid?"}:::keputusan
        J -- "Ya" --&gt; K["Selesai"]:::akhir
        J -- "Tidak" --&gt; C
  </div>
  <figcaption style="text-align:center; margin-top: 8px;">
    Gambar 7. Flowchart Pengukuran Level menggunakan Transmitter DP
  </figcaption>
</div>
</details>
<hr>
<h2 id="i-classfa-solid-fa-book-open-aria-hiddentruei-glosarium"><i class="fa-solid fa-book-open" aria-hidden="true"></i> Glosarium</h2>
<ul>
<li><strong><code>Bejana Kriogenik</code></strong>: Tangki khusus dengan ruang vakum antar dinding untuk menyimpan cairan kriogenik, seperti nitrogen atau oksigen cair, pada suhu di bawah -180°C.</li>
<li><strong><code>Densitas</code></strong>: Massa per satuan volume cairan (kg/liter atau kg/m³), digunakan untuk menghitung berat jenis.</li>
<li><strong><code>DP transmitter</code></strong>: Sensor Tekanan Diferensial untuk membaca level cairan.</li>
<li><strong><code>Headspace</code></strong>: Ruang di atas cairan dalam bejana kriogenik yang berisi gas hasil penguapan, memengaruhi tekanan tetapi tidak terdeteksi oleh DP transmitter.</li>
<li><strong><code>mmH₂O</code></strong>: Satuan tekanan hidrostatis berdasarkan kolom air.</li>
<li><strong><code>Overfill</code></strong>: Kondisi ketika tangki diisi melebihi kapasitas geometrisnya, berisiko menyebabkan tekanan berlebih.</li>
<li><strong><code>PB</code></strong>: Pressure Building — sistem pemanas cairan untuk menaikkan tekanan.</li>
<li><strong><code>SG</code></strong>: Specific Gravity — rasio densitas cairan terhadap densitas air pada 4°C. Dalam bahasa Indonesia dikenal sebagai Berat Jenis.</li>
<li><strong><code>Tekanan Hidrostatis</code></strong>: Tekanan akibat berat cairan dalam bejana, diukur oleh DP transmitter untuk menghitung tinggi level cairan.</li>
<li><strong><code>Trycock</code></strong>: Posisi verifikasi level cairan secara manual.</li>
<li><strong><code>Venting Otomatis</code></strong>: Sistem pelepasan gas otomatis untuk mencegah tekanan berlebih.</li>
<li><strong><code>Vessel Volume &amp; Level Calculation</code></strong>: Aplikasi untuk menghitung volume cairan dalam bejana bertekanan berdasarkan dimensi, geometri, dan orientasi. Dilengkapi kalkulasi berat jenis cairan berdasarkan suhu atau tekanan untuk estimasi level dan massa secara lebih akurat.</li>
</ul>
<hr>
<h2 id="i-classfa-solid-fa-edit-aria-hiddentruei-penutup"><i class="fa-solid fa-edit" aria-hidden="true"></i> Penutup</h2>
<p>DP transmitter adalah alat yang sangat presisi untuk membaca level cairan dalam bejana bertekanan. Namun, interpretasi hasilnya membutuhkan pemahaman menyeluruh tentang berat jenis, suhu cairan, tekanan operasi, dan karakteristik cairan kriogenik.</p>
<p><i class="fa-solid fa-lightbulb" style="color: #f39c12;" aria-hidden="true"></i> <em>Sederhananya, bayangkan DP transmitter seperti <strong>timbangan</strong>: ia hanya mengukur “berat” cairan, bukan tekanan udara di atasnya.</em></p>
<p><i class="fa-solid fa-clipboard-check" style="color: #f39c12;" aria-hidden="true"></i> <strong>Catatan praktis:</strong> Gas di ruang atas bejana kriogenik ikut menentukan total gas yang tersedia. Karena tidak terukur oleh DP transmitter, <strong>estimasi level cairan saja bisa menyesatkan</strong>, terutama saat tekanan permukaan tinggi.</p>
<p>Dokumentasi seperti ini bertujuan membekali operator dan teknisi dengan konteks praktis yang bisa diandalkan dan diaudit.</p>
<p><i class="fa-solid fa-envelope" style="color: #3498db;" aria-hidden="true"></i> Untuk akses aplikasi <strong>Vessel Volume</strong>—termasuk estimasi jangkauan DP transmitter, referensi tabel konversi untuk pengisian tangki kriogenik, dan materi pelatihan—silakan hubungi tim <strong>Automation and Innovation</strong>.</p>
<hr>
<h2 id="i-classfa-solid-fa-tools-aria-hiddentruei-alat-pendukung"><i class="fa-solid fa-tools" aria-hidden="true"></i> Alat Pendukung</h2>
<p><i class="fa-solid fa-calculator" style="color: #3498db;" aria-hidden="true"></i> <strong>Vessel Volume &amp; Level Calculation</strong> adalah aplikasi internal untuk menghitung volume berdasarkan level ketinggian cairan dalam bejana bertekanan. Aplikasi ini mendukung berbagai tipe head, termasuk:</p>
<ul>
<li><strong>Ellipsoidal Head</strong> (2:1 elliptical)</li>
<li><strong>Spherical Head</strong> (hemispherical)</li>
<li><strong>Torispherical Head</strong>
<ul>
<li>ASME F&amp;D (Flanged and Dished)</li>
<li>Standard F&amp;D</li>
<li>80:10 F&amp;D</li>
</ul>
</li>
<li><strong>Flat Head</strong></li>
</ul>
<p>Aplikasi dirancang untuk menangani bejana dengan orientasi <strong>vertikal maupun horizontal</strong>, dengan memperhitungkan geometri head untuk estimasi volume parsial yang lebih akurat dibandingkan pendekatan silinder sederhana.</p>
<p><i class="fa-solid fa-sliders" aria-hidden="true"></i> Aplikasi ini menggunakan beberapa referensi teknis untuk mendukung akurasi prediksi berat jenis cairan berdasarkan suhu atau tekanan, serta kalkulasi volume tangki di antaranya:</p>
<ol>
<li><a href="http://www.ddbst.com/calculation.html?ref=automation.samatorgroup.com" target="_blank" rel="noopener"><strong>DDBST Online Calculation</strong></a> – Basis data properti termofisika untuk berbagai zat kimia.</li>
<li><a href="https://webbook.nist.gov/?ref=automation.samatorgroup.com" target="_blank" rel="noopener"><strong>NIST Chemistry WebBook</strong></a> – Referensi resmi dari NIST untuk data termokimia dan spektrum zat.</li>
<li><a href="https://lar.bnl.gov/properties/basic.html?ref=automation.samatorgroup.com" target="_blank" rel="noopener"><strong>LAr Basic Properties</strong> – Brookhaven National Laboratory</a> – Informasi sifat dasar Argon cair.</li>
<li><a href="https://books.google.co.id/books?id=N8RcH8juG_YC&lpg=PP1&hl=id&pg=PA103&ref=automation.samatorgroup.com#v=onepage&q&f=true" target="_blank" rel="noopener"><strong>Perry’s Chemical Engineers’ Handbook, 7th Ed.</strong></a> – Khususnya bagian tabel properti fisik cairan dan gas.</li>
<li><a href="http://edge.rit.edu/edge/P07106/public/Nox.pdf?ref=automation.samatorgroup.com" target="_blank" rel="noopener"><strong>Thermophysical Properties of Nitrous Oxide</strong></a> – Publikasi teknis dari Rochester Institute of Technology.</li>
<li><a href="https://pdf4pro.com/view/calculating-tank-volume-50d8dd.html?ref=automation.samatorgroup.com" target="_blank" rel="noopener"><strong>Calculating Tank Volume</strong></a> – Artikel oleh Dan Jones, Ph.D., P.E., seorang ahli kimia proses dari Stockhausen Louisiana, LLC. Artikel ini dijadikan acuan luas dalam komunitas teknik proses untuk pendekatan kalkulasi volume tangki dengan geometri kompleks seperti torispherical head.</li>
</ol>
<hr>
<h2 id="i-classfa-solid-fa-file-invoice-aria-hiddentruei-atribusi-ai"><i class="fa-solid fa-file-invoice" aria-hidden="true"></i> Atribusi AI</h2>
<p>Tulisan ini disusun oleh <strong>Ketut Kumajaya</strong>, berdasarkan referensi teknis dan pengalaman lapangan. Sebagian struktur, narasi, serta klarifikasi teknis dalam dokumen ini telah direstrukturisasi dengan bantuan <strong>Copilot dari Microsoft</strong> dan <strong>ChatGPT dari OpenAI</strong>.</p>
<p>Artikel asli sebelum restrukturisasi dapat diakses di <a href="https://blog.kiiota.com/?ref=automation.samatorgroup.com" target="_blank" rel="noopener">Cerita Kiiota</a>.</p>
<p><i class="fa-solid fa-robot" style="color: #2ecc71;" aria-hidden="true"></i> <em>Penggunaan AI dalam dokumentasi ini mengikuti prinsip <strong>keterbukaan, akurasi, dan atribusi etis</strong>, dengan proses kurasi yang ketat serta kendali penuh tetap berada di tangan penulis.</em></p>
<hr>
<p>© 2025 Technical &amp; Sustainability Digest – Audit Teknik &amp; Dokumentasi Industri</p>

<!--kg-card-begin: html-->
<div class="scroll-button">
  <button class="btn-toggle-round scroll-top js-scroll-top" type="button" title="Scroll to top">
    <svg class="progress-circle" width="100%" height="100%" viewBox="-1 -1 102 102">
      <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"/>
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-up" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="cuurentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="18" y1="11" x2="12" y2="5" />
      <line x1="6" y1="11" x2="12" y2="5" />
    </svg>
  </button>
</div>
<!--kg-card-end: html-->

{% endraw %}