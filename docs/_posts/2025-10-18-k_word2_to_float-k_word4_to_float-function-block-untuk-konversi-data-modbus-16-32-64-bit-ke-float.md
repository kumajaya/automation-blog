---
ghost_uuid: "5d6c59ed-3cd4-43d1-b1b6-fb00c17baf96"
title: "K_WORD2_TO_FLOAT & K_WORD4_TO_FLOAT: Function Block untuk Konversi Data Modbus 16/32/64‑bit ke FLOAT"
date: "2025-10-18T00:00:07.000+07:00"
slug: "k_word2_to_float-k_word4_to_float-function-block-untuk-konversi-data-modbus-16-32-64-bit-ke-float"
layout: "post"
excerpt: |
  Konversi register Modbus tidak sesederhana membaca angka. Perbedaan endianness, addressing, dan varian protokol kerap menimbulkan kebingungan di lapangan. Artikel ini memperkenalkan K_WORD2_TO_FLOAT dan K_WORD4_TO_FLOAT sebagai solusi praktis dan konsisten.
image: "https://images.unsplash.com/photo-1531668383211-64743e924c66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEyfHxjYWJsZXxlbnwwfHx8fDE3NjA3MTc0MzV8MA&ixlib=rb-4.1.0&q=80&w=2000"
image_alt: ""
image_caption: "<span style=\"white-space: pre-wrap;\">Photo by </span><a href=\"https://unsplash.com/@possessedphotography?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Possessed Photography</span></a><span style=\"white-space: pre-wrap;\"> / </span><a href=\"https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Unsplash</span></a>"
author:
  - "Ketut Kumajaya"
tags:
  - "Distributed Control System"
  - "Practical Engineering"
  - "Field Experience"
categories:
  - "distributed-control-system"
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
url: "https://automation.samatorgroup.com/blog/k_word2_to_float-k_word4_to_float-function-block-untuk-konversi-data-modbus-16-32-64-bit-ke-float/"
comment_id: "68f25f378a77df069caabde0"
reading_time: 7
access: true
comments: false
---

{% raw %}
<p><strong>Dari register mentah ke nilai proses — menjembatani protokol klasik dengan kebutuhan data modern.</strong></p>
<p><em>Ditulis oleh Ketut Kumajaya | 17 Oktober 2025</em></p>
<h2 id="latar-belakang">Latar Belakang</h2>
<p>Modbus adalah protokol komunikasi klasik yang diperkenalkan sejak akhir 1970‑an dan hingga kini tetap menjadi standar de facto di berbagai sistem industri. Kesederhanaan dan keterbukaannya membuat Modbus terus digunakan secara luas, baik pada perangkat lama maupun perangkat modern, mulai dari PLC hingga flowmeter.</p>
<p>Namun, karena Modbus hanya mendefinisikan pertukaran data dalam bentuk register 16‑bit, interpretasi data bernilai 32‑bit atau 64‑bit memerlukan mekanisme konversi tambahan. Tantangan umum yang muncul meliputi perbedaan <strong>endianness</strong>, perbedaan <strong>addressing</strong>, serta variasi <strong>hardware layer</strong> dan <strong>varian protokol</strong>.</p>
<h3 id="endianness">Endianness</h3>
<p>Endianness adalah urutan penyimpanan byte atau word dalam data biner:</p>
<ul>
<li><strong>Big‑endian</strong>: byte paling signifikan (MSB) disimpan lebih dulu.</li>
<li><strong>Little‑endian</strong>: byte paling signifikan disimpan paling akhir.</li>
</ul>
<h4 id="contoh-pada-modbus-32%E2%80%91bit">Contoh pada Modbus 32‑bit</h4>
<p>Nilai 1234.56 (FLOAT 32‑bit) dapat dikirim sebagai dua register 16‑bit:</p>
<table>
<thead>
<tr>
<th>Word Order</th>
<th>Register1</th>
<th>Register2</th>
<th>Keterangan</th>
</tr>
</thead>
<tbody>
<tr>
<td>Big‑endian (MSB dulu)</td>
<td>0x449A</td>
<td>0x51EC</td>
<td>MSB → LSB</td>
</tr>
<tr>
<td>Little‑endian (LSB dulu)</td>
<td>0x51EC</td>
<td>0x449A</td>
<td>LSB → MSB</td>
</tr>
</tbody>
</table>
<h4 id="catatan-untuk-64%E2%80%91bit">Catatan untuk 64‑bit</h4>
<p>Pada data 64‑bit, variasi urutan bisa terjadi baik di level register maupun byte, sehingga interpretasi lebih kompleks.</p>
<h4 id="praktik-lapangan">Praktik Lapangan</h4>
<p>Jika hasil konversi tidak sesuai ekspektasi, langkah pertama yang umum dilakukan adalah <strong>menukar urutan register</strong>.</p>
<blockquote>
<p>Pemahaman mengenai endianness ini penting karena menjadi salah satu sumber kesalahan paling sering saat integrasi perangkat Modbus lintas vendor.</p>
</blockquote>
<h3 id="addressing">Addressing</h3>
<p>Selain endianness, Modbus juga memiliki perbedaan sistem penomoran alamat register:</p>
<ul>
<li><strong>Zero‑based addressing</strong>: register pertama ditandai sebagai alamat 0.</li>
<li><strong>One‑based addressing</strong>: register pertama ditandai sebagai alamat 1.</li>
</ul>
<p>Akibatnya, dapat terjadi perbedaan satu offset antara dokumentasi perangkat dan implementasi di SCADA/DCS. Misalnya, dokumentasi menyebutkan data di register 40001, tetapi pada sistem zero‑based harus diakses pada alamat 40000.</p>
<p>Perbedaan addressing ini sering menjadi sumber kebingungan saat integrasi, sehingga penting untuk selalu memverifikasi konvensi yang digunakan oleh perangkat maupun sistem SCADA/DCS.</p>
<h3 id="hardware-layer-dan-varian-modbus">Hardware Layer dan Varian Modbus</h3>
<p>Modbus hadir dalam beberapa varian:</p>
<ul>
<li><strong>Modbus RTU</strong>: berjalan di atas RS‑232/RS‑485 dengan format biner yang efisien, paling umum digunakan di lapangan.</li>
<li><strong>Modbus ASCII</strong>: juga berbasis serial, data dikirim dalam teks ASCII, lebih mudah dibaca manusia tetapi jarang dipakai di aplikasi modern.</li>
<li><strong>Modbus TCP/IP</strong>: berjalan di atas Ethernet, menggunakan MBAP header menggantikan CRC, umum pada perangkat generasi baru.</li>
<li><strong>Modbus RTU over TCP</strong>: frame RTU (lengkap dengan CRC) ditransmisikan melalui TCP tanpa MBAP header. Biasanya digunakan untuk kompatibilitas dengan perangkat lama melalui jaringan IP.</li>
</ul>
<p>Perbedaan antara <strong>Modbus TCP/IP</strong> dan <strong>Modbus RTU over TCP</strong> sangat penting dipahami, karena driver atau library harus sesuai dengan format frame yang digunakan. Pemilihan varian yang tepat memastikan komunikasi berjalan konsisten di berbagai perangkat dan sistem.</p>
<h3 id="catatan-tambahan">Catatan Tambahan</h3>
<ul>
<li>Pada Modbus RTU, integritas data dijaga dengan CRC di level frame.</li>
<li>Pada Modbus TCP/IP, CRC tidak digunakan karena protokol TCP/IP sudah memiliki mekanisme pemeriksaan integritas bawaan (checksum, sequence number, retransmission). MBAP header menggantikan CRC dalam frame TCP/IP.</li>
<li>Frame Modbus RTU juga dapat ditransmisikan melalui media nirkabel seperti <strong>LoRa</strong> dalam mode <em>transparent</em>. Dalam hal ini, LoRa hanya berfungsi sebagai saluran komunikasi, sementara integritas data tetap dijaga oleh CRC Modbus.</li>
</ul>
<hr>
<h2 id="kword2tofloat">K_WORD2_TO_FLOAT</h2>
<p>Function Block ini digunakan untuk menggabungkan dua register UINT menjadi nilai FLOAT. FB ini menjadi baseline parsing untuk data 16‑bit maupun 32‑bit, baik ketika perangkat mengirimkan data dalam format IEEE 754 maupun sebagai akumulator numerik.</p>
<figure style="display: flex; flex-direction: column; align-items: center; margin: 20px 0;">
  <div class="mermaid" style="width:70%; max-width:700px; font-size:16px;">
    %%{init: {'themeVariables': { 'fontSize': '16px', 'primaryColor': '#e8f0fe', 'edgeLabelBackground':'#ffffff'}}}%%
    flowchart TD
            A["Start: Baca Register Modbus<br>IN0 UINT LSB<br>IN1 UINT MSB"] --&gt; B{Cek Endianness<br>Hasil sesuai?}
            B --&gt;|Ya| C["Gabung ke 32-bit<br>Temp32 = IN0 + IN1 &lt;&lt; 16"]
            B --&gt;|Tidak - Endian salah| D["Tukar Urutan<br>Swap IN0 ↔ IN1<br>Ulangi Cek"]
            D --&gt; B
            C --&gt; E{"D = 0?"}
            E --&gt;|Ya| F["OUT = 0.0<br>Proteksi Div-by-Zero"]
            E --&gt;|Tidak| G{IEE = TRUE?}
            G --&gt;|Ya| H["Mode IEEE 754<br>OUT = GETFLOAT(Temp32) / D"]
            G --&gt;|Tidak| I["Mode Numerik<br>OUT = Temp32 as LONG / D"]
            H --&gt; J["End: Output FLOAT<br>(Siap untuk Tampilan/Proses)"]
            I --&gt; J
            F --&gt; J
            classDef start fill:#e1f5fe,stroke:#333,stroke-width:2px
            classDef final fill:#c8e6c9,stroke:#333,stroke-width:2px
            classDef swap fill:#fff3e0,stroke:#333,stroke-width:2px
            classDef decision fill:#f3e5f5,stroke:#333,stroke-width:2px
            classDef process fill:#ffffff,stroke:#333,stroke-width:2px
            class A start
            class J final
            class D swap
            class B,E,G decision
            class C,F,H,I process
  </div>
  <figcaption style="text-align:center; font-size:13px; color:#555;">
    Gambar 1: Alur Konversi Register Modbus 32-bit ke FLOAT Menggunakan Function Block K_WORD2_TO_FLOAT
  </figcaption>
</figure>
<h3 id="fitur-utama">Fitur Utama</h3>
<ul>
<li>Mendukung data <strong>16‑bit</strong>: IN0 diisi, IN1 = 0, <code>IEE = FALSE</code>.</li>
<li>Mendukung data <strong>32‑bit</strong>: IN0 dan IN1 diisi sesuai register.</li>
<li>Mode <strong>IEEE 754</strong> (<code>IEE = TRUE</code>) atau mode <strong>numerik</strong> (<code>IEE = FALSE</code>).</li>
<li>Skala pembagi (<code>D</code>) dengan proteksi pembagian nol.</li>
<li>Fleksibel terhadap variasi endian antar perangkat.</li>
</ul>
<details>
<summary><strong>Klik untuk menampilkan kode K_WORD2_TO_FLOAT</strong></summary>
<pre><code class="language-pascal">(*
------------------------------------------------------------------------------
 FB Name     : K_WORD2_TO_FLOAT
 Purpose     : Konversi atau interpretasi 2 register UINT menjadi FLOAT
               - Mode numerik: gabungan register sebagai accumulator
               - Mode IEEE 754 FLOAT: interpretasi bit pattern sebagai IEEE 754
 Author      : Ketut Kumajaya
 Contributor : Copilot (Microsoft AI)
 Version     : 1.0
 Date        : 17/10/2025
 Input       : 
    IN0 (UINT) - LSB dari data Modbus
    IN1 (UINT) - MSB dari data Modbus
    D   (LONG) - skala pembagi (misalnya Wh ke kWh)
    IEE (BOOL) - TRUE untuk interpretasi IEEE 754 FLOAT
                 FALSE untuk konversi numerik dari accumulator
 Output      : 
    OUT (FLOAT) - hasil akhir
 Notes       : 
    - Cocok untuk perangkat yang mengirim data FLOAT 32-bit via Modbus
    - D diuji dan digunakan di kedua mode
    - Jika D = 0 maka OUT = 0.0 untuk mencegah pembagian nol
    - IEE = TRUE menggunakan GETFLOAT untuk interpretasi bit pattern
    - IEE = FALSE menghitung nilai sebagai integer lalu dibagi D
    - Urutan IN0 dan IN1 dapat disesuaikan jika perangkat menggunakan format endian berbeda
    - Jika hasil tidak sesuai, coba tukar IN0 dan IN1
    - FB ini tidak mendukung data 64-bit
    - Menggunakan SHL_DWORD dan DWORD untuk kompatibilitas Supcon
------------------------------------------------------------------------------
*)

FUNCTION_BLOCK K_WORD2_TO_FLOAT
VAR_INPUT
    IN0 : UINT; (* LSB *)
    IN1 : UINT; (* MSB *)
    D   : LONG; (* Skala pembagi *)
    IEE : BOOL; (* TRUE = interpretasi bit sebagai IEEE 754 FLOAT *)
END_VAR

VAR_OUTPUT
    OUT : FLOAT; (* Hasil akhir *)
END_VAR

VAR
    Temp32 : DWORD;
END_VAR

(* Gabungkan 2 UINT menjadi 32-bit bit pattern *)
Temp32 := ULONG_TO_DWORD(UINT_TO_ULONG(IN0));
Temp32 := Temp32 + SHL_DWORD(ULONG_TO_DWORD(UINT_TO_ULONG(IN1)), 16);

(* Interpretasi sesuai mode *)
IF D &lt;&gt; 0 THEN
    IF IEE THEN
        OUT := GETFLOAT(Temp32) / LONG_TO_FLOAT(D);
    ELSE
        OUT := LONG_TO_FLOAT(DWORD_TO_LONG(Temp32)) / LONG_TO_FLOAT(D);
    END_IF;
ELSE
    OUT := 0.0;
END_IF;
END_FUNCTION_BLOCK

</code></pre>
</details>
<hr>
<h2 id="kword4tofloat">K_WORD4_TO_FLOAT</h2>
<p>Function Block ini digunakan untuk menggabungkan empat register UINT menjadi nilai 64‑bit, kemudian dikonversi ke FLOAT untuk keperluan tampilan, trending, atau estimasi. FB ini umumnya dipakai untuk perangkat yang mengirimkan akumulator energi, counter besar, atau nilai kumulatif lainnya.</p>
<figure style="display: flex; flex-direction: column; align-items: center; margin: 20px 0;">
  <div class="mermaid" style="width:70%; max-width:700px; font-size:16px;">
    %%{init: {'themeVariables': { 'fontSize': '16px', 'primaryColor': '#e8f0fe', 'edgeLabelBackground':'#ffffff'}}}%%
    flowchart TD
            A["Start: Baca Register Modbus<br>IN0 UINT LSB Low<br>IN1 UINT MSB Low<br>IN2 UINT LSB High<br>IN3 UINT MSB High"] --&gt; B{Cek Endianness<br>Hasil sesuai?}
            B --&gt;|Ya| C["Gabung Low32 = IN1 &lt;&lt; 16 + IN0<br>High32 = IN3 &lt;&lt; 16 + IN2"]
            B --&gt;|Tidak - Endian salah| D["Tukar Urutan<br>Swap IN0 ↔ IN1 (Low)<br>Swap IN2 ↔ IN3 (High)<br>Ulangi Cek"]
            D --&gt; B
            C --&gt; E{"D = 0?"}
            E --&gt;|Ya| F["OUT = 0.0<br>Proteksi Div-by-Zero"]
            E --&gt;|Tidak| G["Hitung 64-bit ke FLOAT<br>OUT = (High32 as LONG * 4294967296.0 + Low32 as LONG) / D"]
            G --&gt; H["End: Output FLOAT<br>(Untuk Monitoring/Estimasi)"]
            F --&gt; H
            classDef start fill:#e1f5fe,stroke:#333,stroke-width:2px
            classDef final fill:#c8e6c9,stroke:#333,stroke-width:2px
            classDef swap fill:#fff3e0,stroke:#333,stroke-width:2px
            classDef decision fill:#f3e5f5,stroke:#333,stroke-width:2px
            classDef process fill:#ffffff,stroke:#333,stroke-width:2px
            class A start
            class H final
            class D swap
            class B,E decision
            class C,F,G process
  </div>
  <figcaption style="text-align:center; font-size:13px; color:#555;">
    Gambar 2: Alur Rekonstruksi Data 64-bit dari Empat Register Modbus ke FLOAT
  </figcaption>
</figure>
<h3 id="fitur-utama">Fitur Utama</h3>
<ul>
<li>Menggabungkan <strong>Low32</strong> dan <strong>High32</strong> secara manual.</li>
<li>Rumus: <code>OUT = (High32 × 2^32 + Low32) ÷ D</code>.</li>
<li>Proteksi pembagian nol.</li>
<li>Catatan presisi: konversi ke FLOAT 32‑bit dilakukan agar nilai dapat diproses di DCS. Hasil ini memadai untuk kebutuhan operasional sehari‑hari, tetapi tidak memenuhi standar akurasi untuk audit atau billing. Untuk keperluan tersebut, gunakan data 64‑bit asli dari perangkat.</li>
</ul>
<details>
<summary><strong>Klik untuk menampilkan kode K_WORD4_TO_FLOAT</strong></summary>
<pre><code class="language-pascal">(*
------------------------------------------------------------------------------
 FB Name     : K_WORD4_TO_FLOAT
 Purpose     : Menggabungkan 4 register UINT menjadi nilai FLOAT 64-bit
               - Low32 dan High32 dibaca terpisah lalu digabung manual
 Author      : Ketut Kumajaya
 Contributor : Copilot (Microsoft AI)
 Version     : 1.0
 Date        : 17/10/2025
 Input       : 
    IN0 (UINT) - LSB dari bagian bawah (Low32)
    IN1 (UINT) - MSB dari bagian bawah (Low32)
    IN2 (UINT) - LSB dari bagian atas (High32)
    IN3 (UINT) - MSB dari bagian atas (High32)
    D   (LONG) - skala pembagi (misalnya Wh ke kWh)
 Output      : 
    OUT (FLOAT) - hasil akhir
 Notes       : 
    - Cocok untuk perangkat yang mengirim data 64-bit integer via Modbus
    - Supcon tidak mendukung tipe data 64-bit, maka penggabungan dilakukan manual
    - OUT = (High32 × 4294967296.0 + Low32) ÷ D
    - Jika D = 0 maka OUT = 0.0 untuk mencegah pembagian nol
    - Jika hasil tidak sesuai, coba tukar IN0 dan IN1, atau IN2 dan IN3
    - Presisi terbatas karena hasil disimpan sebagai FLOAT 32-bit
    - Gunakan FLOAT hanya untuk tampilan atau estimasi, bukan akurasi billing
    - Untuk audit, pastikan urutan register sesuai dokumentasi perangkat
    - Menggunakan SHL_DWORD dan DWORD untuk kompatibilitas Supcon
------------------------------------------------------------------------------
*)

FUNCTION_BLOCK K_WORD4_TO_FLOAT
VAR_INPUT
    IN0 : UINT; (* LSB Low *)
    IN1 : UINT; (* MSB Low *)
    IN2 : UINT; (* LSB High *)
    IN3 : UINT; (* MSB High *)
    D   : LONG; (* Skala pembagi *)
END_VAR

VAR_OUTPUT
    OUT : FLOAT;
END_VAR

VAR
    Low32  : DWORD;
    High32 : DWORD;
END_VAR

(* Gabungkan masing-masing pasangan *)
Low32  := SHL_DWORD(ULONG_TO_DWORD(UINT_TO_ULONG(IN1)), 16) + ULONG_TO_DWORD(UINT_TO_ULONG(IN0));
High32 := SHL_DWORD(ULONG_TO_DWORD(UINT_TO_ULONG(IN3)), 16) + ULONG_TO_DWORD(UINT_TO_ULONG(IN2));

(* Hitung total sebagai FLOAT *)
IF D &lt;&gt; 0 THEN
    OUT := (LONG_TO_FLOAT(DWORD_TO_LONG(High32)) * 4294967296.0 + LONG_TO_FLOAT(DWORD_TO_LONG(Low32))) / LONG_TO_FLOAT(D);
ELSE
    OUT := 0.0;
END_IF;
END_FUNCTION_BLOCK
</code></pre>
</details>
<hr>
<h2 id="panduan-singkat-penggunaan">Panduan Singkat Penggunaan</h2>
<h3 id="kapan-menggunakan-kword2tofloat">Kapan menggunakan K_WORD2_TO_FLOAT</h3>
<ul>
<li><strong>16‑bit</strong>: isi IN0, set IN1 = 0, gunakan <code>IEE = FALSE</code>.</li>
<li><strong>32‑bit</strong>: isi IN0 dan IN1 sesuai register.
<ul>
<li>IEEE 754 → <code>IEE = TRUE</code>.</li>
<li>Numerik → <code>IEE = FALSE</code>.</li>
</ul>
</li>
<li>Jika hasil tidak sesuai, coba tukar IN0 dan IN1.</li>
</ul>
<p>FB ini ideal untuk parsing data register tunggal atau ganda yang umum ditemui pada sensor dan flowmeter.</p>
<h3 id="kapan-menggunakan-kword4tofloat">Kapan menggunakan K_WORD4_TO_FLOAT</h3>
<ul>
<li><strong>64‑bit</strong>: isi IN0–IN3 sesuai register.</li>
<li>Cocok untuk akumulator besar (misalnya energi, volume kumulatif, atau counter jarak jauh).</li>
<li>OUT hanya untuk monitoring, bukan billing.</li>
<li>Jika hasil tidak sesuai, coba tukar pasangan register.</li>
</ul>
<p>FB ini relevan untuk perangkat yang mengirimkan nilai kumulatif besar, dengan catatan hasil konversi hanya dipakai untuk tampilan dan analisis tren.</p>
<h3 id="catatan-umum">Catatan Umum</h3>
<ul>
<li><strong>D = 0 → OUT = 0.0</strong>.</li>
<li>Addressing dapat berbeda (0‑based vs 1‑based).</li>
<li>Endianness antar vendor tidak selalu sama.</li>
<li>Pembagi (<code>D</code>) didefinisikan sebagai <code>LONG</code> (32‑bit signed). Rentang ini sudah memadai untuk kebutuhan scaling Modbus, sekaligus lebih sederhana dibanding <code>ULONG</code> yang di Supcon memerlukan konversi tambahan.</li>
</ul>
<hr>
<h2 id="lanjutan">Lanjutan</h2>
<p>Setelah data akumulator berhasil direkonstruksi menjadi nilai FLOAT yang siap dipakai, langkah berikutnya sering kali adalah menghitung <strong>delta energi</strong> untuk kebutuhan laporan periodik, rekonsiliasi antar meter, maupun audit energi.</p>
<p>Untuk tujuan tersebut, tersedia Function Block <strong>K_ACCDELTA</strong> sebagai modul terpisah. FB ini dirancang untuk menghitung delta akumulator secara andal, dengan proteksi nilai negatif dan mekanisme <em>snapshot reset</em> untuk sinkronisasi baseline antar meter. Modul ini menjadi kelanjutan alami dari FB parsing (K_WORD2/4_TO_FLOAT), sehingga alur pengolahan data tetap modular dan konsisten.</p>
<p>→ <a href="https://automation.samatorgroup.com/blog/k_accdelta-function-block-untuk-perhitungan-delta-akumulator/" target="_blank">K_ACCDELTA: Function Block untuk Perhitungan Delta Akumulator</a></p>
<hr>
<h2 id="penutup">Penutup</h2>
<p>Konversi register Modbus membutuhkan ketelitian terhadap format data, endianness, addressing, dan varian protokol. Kedua Function Block di atas dirancang untuk menyajikan nilai proses secara konsisten dan dapat ditelusuri kembali, sekaligus mengakui batasan presisi ketika menggunakan FLOAT 32‑bit.</p>
<p>Dengan dokumentasi yang jelas dan logika yang eksplisit, konversi bukan sekadar kalkulasi teknis, melainkan sarana untuk memastikan operator, engineer, dan auditor memahami proses dengan cara yang sama. Transparansi inilah yang menjadikan integrasi data lebih andal dan berkelanjutan.</p>

{% endraw %}