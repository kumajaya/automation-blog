---
title: "K_ACCUM: Solusi Presisi dan Efisien untuk Drift Akumulator di Modbus Controller"
date: 2025-09-25
tags: ["Distributed Control System", "Practical Engineering", "Field Experience"]
excerpt: "K_ACCUM adalah function block custom untuk mengatasi drift akumulasi dan keterbatasan alamat komunikasi antar controller. Dengan akumulasi tipe data LONG dengan nilai desimal dalam SFLOAT, solusi ini lebih presisi, hemat alamat, dan mudah ditangani."
feature_image: "/automation-blog/assets/media/photo-1633265486501-0cf524a07213"
feature_image_caption: "<span style=\"white-space: pre-wrap;\">Photo by </span><a href=\"https://unsplash.com/@towfiqu999999?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Towfiqu barbhuiya</span></a><span style=\"white-space: pre-wrap;\"> / </span><a href=\"https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Unsplash</span></a>"
---

<p><em>Ditulis oleh Ketut Kumajaya | 25 September 2025</em></p>
<h2 id="latar-belakang">Latar Belakang</h2>
<p>Dalam sistem industri berbasis DCS/SCADA, akumulasi data flow adalah fondasi penting untuk perhitungan energi, OEE, hour meter, maupun audit produksi. Supcon menyediakan function block bawaan <code>TOTAL_ACCUM</code> untuk fungsi ini. Namun, ketika block tersebut dijalankan di Modbus controller, muncul masalah serius: <em>drift</em> akumulasi akibat keterbatasan clock internal dan jitter eksekusi.</p>
<p>Selain itu, terdapat keterbatasan komunikasi: hanya tersedia 128 alamat 32‑bit untuk transfer data dari main controller ke Modbus controller. Sinyal analog SFLOAT 12‑bit hanya menempati 16‑bit, sehingga satu alamat 32‑bit dapat menampung dua sinyal. Sebaliknya, satu akumulator penuh menempati seluruh 32‑bit, sehingga konsumsi alamat menjadi dua kali lebih besar. Jika seluruh akumulasi dipusatkan di main controller, alokasi alamat akan cepat habis. Oleh karena itu, diperlukan solusi yang tidak hanya hemat alamat, tetapi juga tetap menjaga presisi.</p>
<hr>
<h2 id="tantangan-teknis">Tantangan Teknis</h2>
<ul>
<li><strong>Drift akumulasi</strong>: <code>TOTAL_ACCUM</code> bawaan bergantung pada clock internal Modbus controller yang tidak sinkron dengan main controller.</li>
<li><strong>Keterbatasan alamat komunikasi</strong>: hanya tersedia 128 alamat 32‑bit untuk transfer data.</li>
<li><strong>Perbedaan kebutuhan ruang data</strong>: sinyal flow 12‑bit disimpan dalam 16‑bit word, sehingga satu alamat 32‑bit dapat menampung dua sinyal. Sebaliknya, satu akumulator penuh menempati seluruh 32‑bit, membuat konsumsi alamat dua kali lebih besar.</li>
<li><strong>Kebutuhan auditabilitas</strong>: operator membutuhkan hasil akumulasi yang transparan, dapat ditelusuri, dan mudah dipahami lintas shift.</li>
</ul>
<hr>
<h2 id="analisis-akar-masalah">Analisis Akar Masalah</h2>
<ul>
<li><strong>Drift akumulasi</strong> terjadi karena clock internal Modbus controller berbasis 16‑bit tidak disiplin dan tidak sinkron dengan main controller, sehingga perhitungan delta waktu rawan melompat atau melambat.</li>
<li><strong>Alamat cepat habis</strong> disebabkan oleh perbedaan kebutuhan ruang: sinyal analog bisa dipadatkan (2 sinyal per alamat 32‑bit), sedangkan akumulator selalu menghabiskan satu alamat penuh.</li>
<li><strong>Kurangnya visibilitas audit</strong> muncul karena block bawaan <code>TOTAL_ACCUM</code> tidak mengekspos delta waktu. Operator hanya melihat nilai total, tanpa jejak perhitungan detail.</li>
</ul>
<hr>
<h2 id="solusi-kaccum">Solusi: K_ACCUM</h2>
<p>Saya merancang function block custom bernama <strong>K_ACCUM</strong>, dengan fitur utama:</p>
<ul>
<li>Clock referensi dari main controller → bebas drift, sinkron lintas device.</li>
<li>Integrasi wrap‑aware → rollover 16‑bit ditangani aman.</li>
<li>Proteksi delta &amp; RATE → delta negatif atau terlalu besar diabaikan, RATE anomali difilter.</li>
<li>Kompatibilitas penuh → menyediakan output FLOAT yang bisa dikonversi ke structAccum menggunakan function block CONVERT_TO_ACCUM</li>
<li>Audit‑friendly → komentar inline, reserved field dapat digunakan untuk logging delta atau flag anomali.</li>
</ul>
<h3 id="diagram-alur-mermaid">Diagram Alur (Mermaid)</h3>
<div style="display: flex; flex-direction: column; align-items: center;">
    <div class="mermaid" style="width:100%; max-width:none; font-size:14px;">
    flowchart LR
        A["Input"] --&gt; B["Proteksi"]
        B --&gt; C["Akumulasi"]
        C --&gt; D["Output"]
        C --&gt; E["Persistensi"]
        subgraph Input
            A1["ENABLE (BOOL)"]
            A2["RATE (SFLOAT)"]
            A3["DELTA (UINT)"]
            A4["ACC_IN (structKAccum)"]
        end
        subgraph Proteksi
            B1["Wrap-aware Timer 16-bit"]
            B2["Guard DeltaSec &gt; 60 (Clamp/Discard)"]
            B3["Guard RATE anomali"]
        end
        subgraph Akumulasi
            C1["AccReal := AccReal + (RATE * DeltaSec)"]
            C2["Preserve remainder (SFLOAT)"]
            C3["ENABLE = FALSE → Freeze AccReal"]
        end
        subgraph Output
            D1["ACC_OUT (structKAcuum)"]
            D2["ALT_OUT (FLOAT)"]
        end
        subgraph Persistensi
            E1["ACC_OUT := incremented ACC_IN"]
        end
        A1 --&gt; B
        A2 --&gt; B
        A3 --&gt; B
        A4 --&gt; B
        B --&gt; B1 --&gt; C
        B --&gt; B2 --&gt; C
        B --&gt; B3 --&gt; C
        C --&gt; D
        C --&gt; E
    </div>
</div>
<hr>
<h2 id="detail-teknis">Detail Teknis</h2>
<ul>
<li><strong>Rekonstruksi nilai total</strong>: akumulasi <code>accum</code> dan <code>remainder</code>.</li>
<li><strong>Perhitungan delta waktu</strong>: wrap‑aware 16‑bit, dengan proteksi &gt;60 detik.</li>
<li><strong>Integrasi</strong>: <code>AccReal := AccReal + (RATE * DeltaSec)</code> dilakukan dalam FLOAT penuh.</li>
<li><strong>Fragmentasi kembali</strong>: meskipun struktur data berbeda dengan structAccum, konversi bisa dilakukan menggunakan block bawaan.</li>
<li><strong>Konversi ke SFLOAT di tahap akhir</strong>: akumulasi dijaga dalam FLOAT untuk presisi maksimum, lalu dipadatkan ke SFLOAT pada bagian akhir.</li>
</ul>
<hr>
<h2 id="catatan-teknis-structkaccum-dan-horizon-overflow">Catatan Teknis: structKAccum dan Horizon Overflow</h2>
<p>Selain presisi integrasi, salah satu aspek penting dari kompatibilitas <strong>K_ACCUM</strong> adalah bisa dikonversi ke <strong>structAccum</strong> bawaan Supcon, sehingga tidak ada masalah jika hasilnya ditampilkan ke HMI. Struktur data terdiri dari 2 field:</p>
<ul>
<li><strong>accum</strong> → long (32‑bit)</li>
<li><strong>remainder</strong> → pecahan (SFLOAT)</li>
</ul>
<p>Sedangkan struktur structAccum terdiri dari empat field:</p>
<ul>
<li><strong>accum1</strong> → low word (16‑bit)</li>
<li><strong>accum2</strong> → high word (16‑bit)</li>
<li><strong>remainder</strong> → pecahan (SFLOAT)</li>
<li><strong>reserved</strong> → dapat digunakan untuk logging atau flag anomali</li>
</ul>
<p>Dengan keduanya adalah kombinasi integer 32‑bit dan pecahan SFLOAT, baik structKAccum maupun structAccum memiliki karakteristik unik:</p>
<ul>
<li>
<p><strong>Horizon overflow ±136 tahun</strong><br>
Integer 32‑bit mampu menampung hingga 4,29 miliar detik. Overflow baru terjadi setelah lebih dari satu abad operasi kontinu. Praktis, operator tidak perlu melakukan reset manual untuk menghindari overflow.</p>
</li>
<li>
<p><strong>Independen dari skala input</strong><br>
Berapapun range engineering unit (misalnya 0–10.000 Nm³/h), sinyal tetap dipadatkan ke <strong>SFLOAT 0–1</strong> sebelum diakumulasi, lalu di-<em>back scaling</em> ke unit aslinya.</p>
</li>
<li>
<p><strong>Audit‑friendly</strong><br>
Nilai total dapat direkonstruksi dengan cara yang sama lintas block, sehingga konsistensi audit tetap terjaga.</p>
</li>
</ul>
<hr>
<h3 id="beralih-dari-kaccumulator-ke-kaccum">Beralih dari K_ACCUMULATOR ke K_ACCUM</h3>
<p>Salah satu alasan utama transisi dari K_ACCUMULATOR ke K_ACCUM adalah karena struktur <code>structAccum</code> bawaan Supcon menggunakan dua word 16‑bit (<code>accum1</code> dan <code>accum2</code>). Urutan bit/word ini ternyata <strong>tidak selalu konsisten</strong> (tergantung endianness, yaitu cara sistem menyusun byte dalam memori), sehingga hasil akumulasi bisa mendadak jatuh atau menurun. Untuk aplikasi audit jangka panjang, kondisi ini tidak bisa diterima karena membuat hasil akumulasi sulit diprediksi, dan kesalahan akumulasi tidak dapat ditoleransi.</p>
<p>Sebagai solusi, <code>K_ACCUM</code> dirancang menggunakan <strong><code>LONG</code> 32‑bit tunggal</strong> yang bebas dari ambiguitas bit order. Struktur ini tetap dilengkapi dengan <code>remainder</code> (SFLOAT) untuk menjaga presisi pecahan.</p>
<p>Dengan desain ini, <code>K_ACCUM</code> lebih stabil, tetap presisi, dan audit‑friendly.<br>
Konversi ke <code>structAccum</code> masih dimungkinkan jika diperlukan untuk kompatibilitas HMI, tetapi logika inti tetap aman di <code>structKAccum</code>.</p>
<hr>
<h3 id="dependensi-dan-ekstensi-modular-kaccum">Dependensi dan Ekstensi Modular K_ACCUM</h3>
<ul>
<li>
<p><strong>K_DELTA (Dependensi Waktu)</strong><br>
Menyediakan delta waktu wrap‑aware dari timer utama 16‑bit.<br>
→ Digunakan oleh K_ACCUM dan seluruh block turunan agar konsisten, presisi, dan audit‑friendly.</p>
</li>
<li>
<p><strong>K_ADD_ACCUM (Aggregator)</strong><br>
Menjumlahkan dua accumulator <code>structKAccum</code> menjadi satu total konsolidasi.<br>
Cocok untuk agregasi OEE lintas line, penggabungan energi dari beberapa sumber, atau chaining modular (shift → harian → bulanan).</p>
</li>
<li>
<p><strong>K_SUB_ACCUM (Differentiator)</strong><br>
Mengurangkan dua accumulator <code>structKAccum</code> untuk menyingkap selisih.<br>
Cocok untuk audit energi (supply–demand), neraca massa (inlet–outlet), atau analisis delta OEE. Jika dua accumulator yang sama dikurangkan, block ini berfungsi sebagai reset.</p>
</li>
</ul>
<h4 id="karakteristik-bersama">Karakteristik Bersama</h4>
<ul>
<li>Presisi terjaga dengan kombinasi <strong>LONG + SFLOAT</strong>.</li>
<li>Output utama tetap <code>structKAccum</code>, dengan <strong>ALT_OUT (FLOAT)</strong> sebagai alternatif cepat.</li>
<li>Audit‑friendly: hasil dapat direkonstruksi dengan cara yang sama seperti K_ACCUM.</li>
<li>Modular: operator cukup drag‑and‑drop block tanpa scripting manual.</li>
</ul>
<blockquote>
<p>Dengan K_DELTA sebagai <em>time backbone</em> dan K_ADD_ACCUM/K_SUB_ACCUM sebagai ekstensi, keluarga K_ACCUM membentuk arsitektur akumulasi modular yang presisi, efisien, dan siap audit lintas plant.</p>
</blockquote>
<hr>
<h3 id="implikasi-operasional">Implikasi Operasional</h3>
<ul>
<li><strong>Tidak perlu reset</strong> → operator terbebas dari prosedur reset akumulator yang berisiko menghapus histori.</li>
<li><strong>Data kontinu</strong> → histori akumulasi dapat berjalan tanpa interupsi, memudahkan analisis jangka panjang.</li>
<li><strong>Sederhana untuk transfer knowledge</strong> → operator baru cukup memahami bahwa akumulator akan terus bertambah, tanpa perlu menghafal SOP reset.</li>
</ul>
<blockquote>
<p>Dengan horizon overflow ±136 tahun, structKAccum praktis tidak memerlukan reset manual. Hal ini menghilangkan risiko kehilangan data akibat reset, sekaligus menyederhanakan SOP operator. Akumulator dapat berjalan kontinu, audit tetap konsisten, dan transfer knowledge lintas shift menjadi lebih mudah.</p>
</blockquote>
<hr>
<h2 id="potensi-ekstensi-fungsi">Potensi Ekstensi Fungsi</h2>
<table>
<thead>
<tr>
<th>Aplikasi</th>
<th>Konfigurasi RATE</th>
<th>Hasil</th>
</tr>
</thead>
<tbody>
<tr>
<td>Hour Meter</td>
<td>RATE = 1.0 saat equipment ON</td>
<td>Akumulasi detik operasi → jam</td>
</tr>
<tr>
<td>Runtime Counter</td>
<td>RATE = 1 saat ON, 0 saat OFF</td>
<td>Total waktu ON untuk PM</td>
</tr>
<tr>
<td>Event Duration Logger</td>
<td>RATE = 1 saat kondisi tertentu</td>
<td>Total durasi kondisi aktif</td>
</tr>
<tr>
<td>Audit Energi</td>
<td>RATE = konsumsi energi per detik</td>
<td>Total energi (kWh)</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="validasi-independen-dengan-rapid-scada">Validasi Independen dengan Rapid SCADA</h2>
<p>Untuk memastikan hasil tidak bias, pengujian dilakukan menggunakan Rapid SCADA sebagai sistem eksternal yang independen dari DCS.</p>
<ul>
<li><strong>Metode</strong>: flow statis 2500 diberikan secara identik ke K_ACCUM dan TOTAL_ACCUM dari variabel yang sama, lalu hasil ditrend di Rapid SCADA.</li>
<li><strong>Hasil</strong>:
<ul>
<li>K_ACCUM: 2499,3 (deviasi −0,03%)</li>
<li>TOTAL_ACCUM: 2450 (deviasi −2%)</li>
</ul>
</li>
<li><strong>Makna</strong>: bahkan dengan pengujian eksternal, in‑house FB terbukti lebih presisi dibanding block bawaan vendor.</li>
</ul>
<hr>
<h2 id="dampak-dan-nilai-tambah">Dampak dan Nilai Tambah</h2>
<ul>
<li>Efisiensi komunikasi → alamat 128 tidak cepat habis.</li>
<li>Presisi akumulasi → hasil konsisten, bebas drift jangka panjang.</li>
<li>Auditabilitas → operator dapat menelusuri delta waktu.</li>
<li>Fleksibilitas → block dapat digunakan sebagai accumulator, hour meter, runtime counter, maupun logger.</li>
<li>Kredibilitas eksternal → hasil diverifikasi oleh sistem independen (Rapid SCADA).</li>
</ul>
<hr>
<h2 id="kesimpulan">Kesimpulan</h2>
<p>K_ACCUM berhasil menurunkan deviasi dibanding block bawaan Supcon. Hasilnya memang tidak harus sempurna—karena faktor eksternal seperti jitter komunikasi dan keterbatasan representasi data tetap ada—tetapi penurunan deviasi dari 2% menjadi 0,03% adalah pencapaian nyata.</p>
<p>Solusi ini bukan sekadar “membuat block baru”, melainkan membangun arsitektur yang efisien, presisi, audit‑friendly, dan terbukti lebih baik bahkan saat diuji dengan sistem independen. Pencapaian ini menjadi basis kuat untuk benchmark jangka panjang, di mana performa K_ACCUM dapat diuji lebih lama (jam, hari, hingga minggu) untuk membuktikan stabilitasnya dalam kondisi operasi nyata.</p>
<hr>
<p><strong>Catatan kontributor:</strong> Artikel ini disusun oleh <strong>Ketut Kumajaya</strong> dengan dukungan editorial dari Copilot (Microsoft AI) dalam penyusunan narasi, struktur, dan dokumentasi teknis.</p>
<hr>
<h3 id="appendix-a-%E2%80%94-listing-kode-lengkap">Appendix A — Listing Kode Lengkap</h3>
<details>
<summary>Klik untuk membuka kode Function Block K_ACCUM</summary>
<pre><code class="language-pascal">
(*==============================================================================
FB Name     : K_ACCUM
Purpose     : Akumulator modular berbasis LONG + SFLOAT, menerima DELTA dari K_DELTA
Author      : Ketut Kumajaya
Contributor : Copilot (Microsoft AI)
Version     : 1.1 (tanpa RESET, dependensi ke K_DELTA)
Date        : 01/10/2025
Input       : ENABLE (BOOL)   - aktivasi akumulasi
              RATE   (SFLOAT) - laju akumulasi per detik
              DELTA  (UINT)   - selisih waktu antar siklus dari K_DELTA
              ACC_IN (structKAccum) - nilai akumulasi sebelumnya
Output      : ACC_OUT (structKAccum) - hasil akumulasi modular
              ALT_OUT (FLOAT)        - total nilai akumulasi sebagai alternatif
Notes       : - Input waktu TIMER telah digantikan oleh DELTA dari FB K_DELTA
              - K_ACCUM tidak menyimpan LAST_IN/OUT, sehingga lebih ringan
              - RATE dijaga dalam domain ±16 untuk stabilitas dan audit modular
              - Cocok untuk runtime, hour meter, OEE timer, dan akumulasi energi
              - Pairing waktu dan nilai dilakukan di artefak audit terpisah
Use-case    : Digunakan bersama K_DELTA untuk runtime modular lintas FB dan plant
==============================================================================*)

FUNCTION_BLOCK K_ACCUM
VAR_INPUT
    ENABLE : BOOL;
    RATE   : SFLOAT;
    DELTA  : UINT;
    ACC_IN : structKAccum;
END_VAR
VAR_OUTPUT
    ACC_OUT : structKAccum;
    ALT_OUT : FLOAT;
END_VAR
VAR
    AccReal : FLOAT;
    RateF   : FLOAT;
END_VAR

(* STEP 1: Rekonstruksi total dari input *)
AccReal := LONG_TO_FLOAT(ACC_IN.accum) + SFLOAT_TO_FLOAT(ACC_IN.remainder);

(* STEP 2: Integrasi normal *)
RateF := SFLOAT_TO_FLOAT(RATE);
IF ENABLE THEN
    IF (RateF &gt; -16.0) AND (RateF &lt; 16.0) THEN
        IF DELTA &gt; 0 THEN
            AccReal := AccReal + (RateF * UINT_TO_FLOAT(DELTA));
        END_IF;
    END_IF;
END_IF;

(* STEP 3: Pisahkan kembali ke integer + pecahan *)
ACC_OUT.accum     := FLOAT_TO_LONG(AccReal);
ACC_OUT.remainder := FLOAT_TO_SFLOAT(AccReal - LONG_TO_FLOAT(ACC_OUT.accum));

(* STEP 4: Output alternatif total *)
ALT_OUT := AccReal;

END_FUNCTION_BLOCK

</code></pre>
</details>
<details>
<summary>Klik untuk membuka kode Function Block K_DELTA</summary>
<pre><code class="language-pascal">(*==============================================================================
FB Name     : K_DELTA
Purpose     : Menghitung delta waktu wrap-aware dari timer utama (UINT 16-bit)
Author      : Ketut Kumajaya
Version     : 1.2 (IF-THEN-ELSE, no MOD)
Date        : 07/10/2025
Input       : TIMER_IN (UINT), LAST_IN (UINT)
Output      : DELTA_OUT (UINT), LAST_OUT (UINT), ALARM_OUT (BOOL)
Notes       : - IF-THEN-ELSE untuk hindari loncatan MOD
              - Cutoff 60 detik; LONG untuk Supcon-safe
              - Persisten global LAST_IN/OUT
==============================================================================*)

FUNCTION_BLOCK K_DELTA
VAR_INPUT
    TIMER_IN : UINT;
    LAST_IN  : UINT;
END_VAR
VAR_OUTPUT
    DELTA_OUT : UINT;
    LAST_OUT  : UINT;
    ALARM_OUT : BOOL;
END_VAR
VAR
    Delta       : LONG;
    StartupFlag : BOOL;
END_VAR

StartupFlag := g_bColdStartup OR g_bHotStartup OR g_bDownUsrPrgFlag OR g_bDownCfgFlag;

IF StartupFlag THEN
    Delta := 0;
    ALARM_OUT := FALSE;
    g_bColdStartup := FALSE;
    g_bHotStartup := FALSE;
    g_bDownUsrPrgFlag := FALSE;
    g_bDownCfgFlag := FALSE;
ELSE
    IF TIMER_IN &gt;= LAST_IN THEN
        Delta := ULONG_TO_LONG(UINT_TO_ULONG(TIMER_IN)) - ULONG_TO_LONG(UINT_TO_ULONG(LAST_IN));
    ELSE
        Delta := ULONG_TO_LONG(UINT_TO_ULONG(65535 - LAST_IN)) + ULONG_TO_LONG(UINT_TO_ULONG(TIMER_IN)) + 1;
    END_IF;

    IF Delta &gt; 60 THEN
        Delta := 0;
        ALARM_OUT := TRUE;
    ELSE
        ALARM_OUT := FALSE;
    END_IF;
END_IF;

DELTA_OUT := ULONG_TO_UINT(LONG_TO_ULONG(Delta));
LAST_OUT  := TIMER_IN;

END_FUNCTION_BLOCK

</code></pre>
</details>
<details>
<summary>Klik untuk membuka kode Function Block K_ADD_ACCUM</summary>
<pre><code class="language-pascal">(*==============================================================================
 FB Name     : K_ADD_ACCUM
 Purpose     : Menjumlahkan dua accumulator (structKAccum) secara modular
 Author      : Ketut Kumajaya
 Contributor : Copilot (Microsoft AI)
 Version     : 1.0 (initial release)
 Date        : 28/09/2025
 Input       : ACC1 (structKAccum), ACC2 (structKAccum)
 Output      : ACC_OUT (structKAccum), ALT_OUT (FLOAT total)
 Notes       : - Presisi dijaga dengan LONG + SFLOAT
               - ALT_OUT = total float alternatif
               - Cocok untuk merge runtime, energy, atau counter modular
 Use-case    : Penjumlahan antar accumulator, agregasi OEE, chaining modular
==============================================================================*)

FUNCTION_BLOCK K_ADD_ACCUM
VAR_INPUT
    ACC1 : structKAccum;
    ACC2 : structKAccum;
END_VAR
VAR_OUTPUT
    ACC_OUT : structKAccum;
    ALT_OUT : FLOAT;
END_VAR
VAR
    SumReal : FLOAT;
END_VAR

(* STEP 1: Rekonstruksi total dari masing-masing input *)
SumReal := LONG_TO_FLOAT(ACC1.accum) + SFLOAT_TO_FLOAT(ACC1.remainder)
         + LONG_TO_FLOAT(ACC2.accum) + SFLOAT_TO_FLOAT(ACC2.remainder);

(* STEP 2: Pisahkan kembali ke integer + pecahan *)
ACC_OUT.accum     := FLOAT_TO_LONG(SumReal);
ACC_OUT.remainder := FLOAT_TO_SFLOAT(SumReal - LONG_TO_FLOAT(ACC_OUT.accum));

(* STEP 3: Output alternatif total *)
ALT_OUT := SumReal;

END_FUNCTION_BLOCK

</code></pre>
</details>

<details>
<summary>Klik untuk membuka kode Function Block K_SUB_ACCUM</summary>
<pre><code class="language-pascal">(*==============================================================================
 FB Name     : K_SUB_ACCUM
 Purpose     : Mengurangkan dua accumulator (structKAccum) secara modular
 Author      : Ketut Kumajaya
 Contributor : Copilot (Microsoft AI)
 Version     : 1.0 (initial release)
 Date        : 28/09/2025
 Input       : ACC1 (structKAccum), ACC2 (structKAccum)
 Output      : ACC_OUT (structKAccum), ALT_OUT (FLOAT total)
 Notes       : - Presisi dijaga dengan LONG + SFLOAT
               - ALT_OUT = total float alternatif
               - Cocok untuk selisih runtime, energy, atau counter modular
 Use-case    : Pengurangan antar accumulator, analisis delta OEE, chaining modular
==============================================================================*)

FUNCTION_BLOCK K_SUB_ACCUM
VAR_INPUT
    ACC1 : structKAccum;
    ACC2 : structKAccum;
END_VAR
VAR_OUTPUT
    ACC_OUT : structKAccum;
    ALT_OUT : FLOAT;
END_VAR
VAR
    DiffReal : FLOAT;
END_VAR

(* STEP 1: Rekonstruksi total dari masing-masing input *)
DiffReal := (LONG_TO_FLOAT(ACC1.accum) + SFLOAT_TO_FLOAT(ACC1.remainder))
          - (LONG_TO_FLOAT(ACC2.accum) + SFLOAT_TO_FLOAT(ACC2.remainder));

(* STEP 2: Pisahkan kembali ke integer + pecahan *)
ACC_OUT.accum     := FLOAT_TO_LONG(DiffReal);
ACC_OUT.remainder := FLOAT_TO_SFLOAT(DiffReal - LONG_TO_FLOAT(ACC_OUT.accum));

(* STEP 3: Output alternatif total *)
ALT_OUT := DiffReal;

END_FUNCTION_BLOCK

</code></pre>
</details>
<details>
<summary>Klik untuk membuka kode Function Block legacy K_ACCUMULATOR</summary>
<pre><code class="language-pascal">
(*
==============================================================================
 Function Block : K_ACCUMULATOR
 Deskripsi      : Integrator berbasis laju per detik (SFLOAT) dan free-running
                  timer 16-bit, kompatibel Supcon structAccum
 Penulis        : Ketut Kumajaya
 Kontributor    : Copilot (Microsoft AI)
 Versi          : 1.1
 Tanggal        : 25/09/2025
==============================================================================

Fungsi:
- Mengakumulasi nilai = RATE * DeltaSec setiap scan.
- Menggunakan external clock T_IN (0..65535 detik, wrap-aware).
- Reset penuh ditangani oleh built-in FB Supcon melalui structAccum.
- Proteksi delta waktu: delta negatif atau terlalu besar (&gt;60 detik) diabaikan.
- Guard RATE: nilai anomali (-16 &gt; RATE &gt; 16) diabaikan.
- Struktur kompatibel dengan accumulator built-in Supcon.

Versi 1.1 (26/09/2025)
- AccInt diganti ke tipe LONG → konversi lebih sederhana dan mendukung nilai negatif
- Validasi remainder selalu dinormalisasi ke [0,1)
- Patch encoding low word → dipaksa unsigned (0..65535) agar kompatibel penuh dengan structAccum
- Eliminasi bug “accum1 = –32768” yang menyebabkan akumulasi tampak menurun
==============================================================================
*)

FUNCTION_BLOCK K_ACCUMULATOR
VAR_INPUT
    RATE     : SFLOAT;       (* Laju per detik (unit/s) *)
    T_IN     : UINT;         (* Free-running timer (0..65535 detik) *)
    ACC_IN   : structAccum;  (* Akumulator persisten input *)
    LAST_IN  : UINT;         (* Snapshot timer sebelumnya *)
END_VAR
VAR_OUTPUT
    ACC_OUT  : structAccum;  (* Akumulator hasil update *)
    LAST_OUT : UINT;         (* Snapshot timer berikutnya *)
END_VAR
VAR
    AccReal   : FLOAT;       (* Rekonstruksi total accumulator *)
    AccInt    : LONG;        (* Bagian integer dari AccReal *)
    AccFrac   : FLOAT;       (* Bagian pecahan dari AccReal *)
    DeltaSec  : UINT;        (* Selisih detik antar scan *)
    RateF     : FLOAT;       (* RATE dalam FLOAT *)
    LowWord   : WORD;
    HighWord  : INT;
END_VAR

(* NOTE: accum1 = low word, accum2 = high word, remainder = fractional part *)
(* EVENT: Rekonstruksi nilai total dari ACC_IN *)
AccInt := INT_TO_LONG(WORD_TO_INT(INT_TO_WORD(ACC_IN.accum1)))
        + DWORD_TO_LONG(
            SHL_DWORD(LONG_TO_DWORD(INT_TO_LONG(ACC_IN.accum2)),
                16));                         (* shift high word 16 bit *)
AccFrac := SFLOAT_TO_FLOAT(ACC_IN.remainder); (* fractional part *)
AccReal := LONG_TO_FLOAT(AccInt) + AccFrac;   (* total accumulator *)

(* PROTEKSI: hitung delta dengan wrap 16-bit (modular, no-branch) *)
DeltaSec := (T_IN + 65536 - LAST_IN) MOD 65536;

(* PROTEKSI: guard delta anomali *)
IF DeltaSec &gt; 60 THEN
    DeltaSec := 0;
END_IF;

(* PROTEKSI: guard RATE anomali sesuai domain SFLOAT 12-bit: -16..+16 *)
RateF := SFLOAT_TO_FLOAT(RATE);
IF (RateF &lt; 16) AND (RateF &gt; -16) THEN
    IF DeltaSec &gt; 0 THEN
        AccReal := AccReal + (RateF * UINT_TO_FLOAT(DeltaSec));
    END_IF;
END_IF;

(* EVENT: Pisahkan kembali ke structAccum *)
AccInt  := FLOAT_TO_LONG(AccReal);
AccFrac := AccReal - LONG_TO_FLOAT(AccInt);

(* Normalisasi remainder ke [0,1) *)
IF AccFrac &lt; 0.0 THEN
    AccInt  := AccInt - 1;
    AccFrac := AccFrac + 1.0;
ELSE
    IF AccFrac &gt;= 1.0 THEN
        AccInt  := AccInt + 1;
        AccFrac := AccFrac - 1.0;
    END_IF;
END_IF;

(* NOTE: LowWord dipaksa unsigned (0..65535) agar kompatibel dengan structAccum.
   HighWord tetap signed. Total AccInt = HighWord*65536 + LowWord. *)
LowWord  := INT_TO_WORD(LONG_TO_INT(AccInt MOD 65536)); (* selalu 0..65535 *)
HighWord := LONG_TO_INT(AccInt / 65536);                (* high word bisa signed *)

ACC_OUT.accum1    := WORD_TO_INT(LowWord); (* low word aman, tidak pernah -32768 *)
ACC_OUT.accum2    := HighWord;             (* high word signed *)
ACC_OUT.remainder := FLOAT_TO_SFLOAT(AccFrac);
ACC_OUT.reserved  := 0.0;

(* Persist snapshot untuk scan berikutnya *)
LAST_OUT := T_IN;

END_FUNCTION_BLOCK

</code></pre>
</details>
<h3 id="appendix-b-%E2%80%94-extended-validation-runtime-1%E2%80%936-jam">Appendix B — Extended Validation Runtime (1–6 Jam)</h3>
<p>Pengujian runtime lebih panjang dilakukan dengan flow statis 2500 untuk melihat pola drift akumulasi secara progresif.</p>
<h4 id="hasil-pengujian-runtime">Hasil Pengujian Runtime</h4>
<table>
<thead>
<tr>
<th>Runtime</th>
<th>Ideal</th>
<th>K_ACCUM</th>
<th>Deviasi Absolut</th>
<th>Deviasi Relatif</th>
<th>TOTAL_ACCUM</th>
<th>Deviasi Absolut</th>
<th>Deviasi Relatif</th>
</tr>
</thead>
<tbody>
<tr>
<td>1 jam</td>
<td>2500</td>
<td>2499.31</td>
<td>−0.694</td>
<td>−0.028%</td>
<td>2450.69</td>
<td>−49.306</td>
<td>−1.972%</td>
</tr>
<tr>
<td>2 jam</td>
<td>5000</td>
<td>5002.08</td>
<td>+2.083</td>
<td>+0.042%</td>
<td>4905.56</td>
<td>−94.444</td>
<td>−1.898%</td>
</tr>
<tr>
<td>3 jam</td>
<td>7500</td>
<td>7500.69</td>
<td>+0.694</td>
<td>+0.009%</td>
<td>7355.56</td>
<td>−144.445</td>
<td>−1.926%</td>
</tr>
<tr>
<td>4 jam</td>
<td>10000</td>
<td>10000.69</td>
<td>+0.694</td>
<td>+0.007%</td>
<td>9806.94</td>
<td>−193.056</td>
<td>−1.931%</td>
</tr>
<tr>
<td>5 jam</td>
<td>12500</td>
<td>12500.00</td>
<td>+0.000</td>
<td>+0.000%</td>
<td>12258.33</td>
<td>−241.667</td>
<td>−1.933%</td>
</tr>
<tr>
<td>6 jam</td>
<td>15000</td>
<td>14998.61</td>
<td>−1.389</td>
<td>−0.009%</td>
<td>14708.33</td>
<td>−291.666</td>
<td>−1.944%</td>
</tr>
</tbody>
</table>
<h4 id="interpretasi">Interpretasi</h4>
<ul>
<li><strong>K_ACCUM</strong>: deviasi relatif tetap &lt;0.05% bahkan hingga 6 jam, menunjukkan presisi tinggi dan stabilitas jangka panjang.</li>
<li><strong>TOTAL_ACCUM</strong>: drift konsisten di sekitar −1.9% sejak awal hingga 6 jam, menegaskan bias bawaan block vendor.</li>
<li><strong>Makna audit</strong>: tren progresif ini memperkuat klaim bahwa K_ACCUM bukan hanya presisi sesaat, tetapi juga tahan drift dalam runtime panjang.</li>
</ul>

