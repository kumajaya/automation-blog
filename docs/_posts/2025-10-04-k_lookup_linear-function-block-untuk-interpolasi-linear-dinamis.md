---
ghost_uuid: "909b5c69-a239-4ec1-9ddf-19a2d9d06983"
title: "K_LOOKUP_LINEAR: Function Block untuk Interpolasi Linear Dinamis"
date: "2025-10-04T13:04:05.000+07:00"
slug: "k_lookup_linear-function-block-untuk-interpolasi-linear-dinamis"
layout: "post"
excerpt: |
  `K_LOOKUP_LINEAR` adalah Function Block modular untuk interpolasi linear dinamis. Dengan dukungan hingga 32 titik, proteksi berlapis, dan flag audit. Implementasi ini memudahkan standardisasi lookup kurva, mempercepat commissioning, dan memastikan transparansi hasil perhitungan dalam operasi plant.
image: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDd8fG1hdGh8ZW58MHx8fHwxNzU5NTU1NjM4fDA&ixlib=rb-4.1.0&q=80&w=2000"
image_alt: ""
image_caption: "<span style=\"white-space: pre-wrap;\">Photo by </span><a href=\"https://unsplash.com/@antoine1003?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Antoine Dautry</span></a><span style=\"white-space: pre-wrap;\"> / </span><a href=\"https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Unsplash</span></a>"
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
url: "https://automation.samatorgroup.com/blog/k_lookup_linear-function-block-untuk-interpolasi-linear-dinamis/"
comment_id: "68e0abdc7f770e05777e0cd8"
reading_time: 5
access: true
comments: false
---

<p><em>Ditulis oleh Ketut P. Kumajaya | 4 Oktober 2025</em></p>
<h3 id="latar-belakang">Latar Belakang</h3>
<p>Interpolasi linear adalah metode sederhana namun krusial dalam otomasi proses. Banyak kurva performa peralatan—seperti garis surge centrifugal compressor, karakteristik valve, atau profil efisiensi pompa—tidak tersedia dalam bentuk persamaan matematis, melainkan tabel titik data.</p>
<p>Function Block <code>K_LOOKUP_LINEAR</code> dirancang di Supcon DCS menggunakan Structured Text (ST) untuk melakukan interpolasi linear berbasis array dinamis. Berbeda dengan <code>K_LIN_INTERP14</code> yang statis dengan 14 titik, FB ini mendukung hingga 32 titik referensi, dilengkapi proteksi multi‑lapis dan flag audit agar siap digunakan lintas plant.</p>
<p>Sebagai catatan, <code>K_LIN_INTERP14</code> telah diimplementasikan di salah satu plant untuk lookup kurva <strong>anti-surge</strong> dan terbukti stabil dalam operasi harian. Block ini sendiri merupakan implementasi bebas dari fungsi serupa yang tersedia di <strong>Yokogawa Centum VP</strong>, dan pengalaman lapangan inilah yang menjadi dasar pengembangan <code>K_LOOKUP_LINEAR</code> sebagai versi yang lebih fleksibel dan modular.</p>
<hr>
<h3 id="listing-function-block">Listing Function Block</h3>
<pre><code class="language-pascal">(*=============================================================================
  Function Block Name : K_LOOKUP_LINEAR
  Author              : Ketut P. Kumajaya
  Date Created        : 04/10/2025
  Description         : Interpolasi linear dinamis berbasis array referensi
                        dengan proteksi multi-lapis dan flag audit.
  Inputs              : Enable     - Aktivasi interpolasi (BOOL)
                        X          - Nilai input yang akan diinterpolasi (FLOAT)
                        N          - Jumlah titik referensi aktif (INT, min 2)
                        THRESHOLD  - Ambang deviasi audit (FLOAT)
                        X_REF      - array32FLOAT (koordinat X referensi)
                        Y_REF      - array32FLOAT (koordinat Y referensi)
  Outputs             : Y          - Hasil interpolasi linear (FLOAT)
                        X1_used    - Titik awal X interval aktif (FLOAT)
                        Y1_used    - Titik awal Y interval aktif (FLOAT)
                        X2_used    - Titik akhir X interval aktif (FLOAT)
                        Y2_used    - Titik akhir Y interval aktif (FLOAT)
                        Valid      - Flag validasi hasil interpolasi (BOOL)
                        AuditFlag  - Flag audit deviasi/ketidakrapihan data (BOOL)
                        DensityValid - Flag validasi monotoni X_REF (BOOL)
  Artefak Pairing     : array32FLOAT - ARRAY [0..31] OF FLOAT
  Proteksi Audit      : Clamp jika X di luar range; fallback pada interval
                        degenerat; AuditFlag aktif jika deviasi ekstrem atau
                        data tidak monoton; N dikunci dalam rentang aman.
=============================================================================*)

FUNCTION_BLOCK K_LOOKUP_LINEAR

VAR_INPUT
    Enable    : BOOL;
    X         : FLOAT;
    N         : INT;
    THRESHOLD : FLOAT;
    X_REF     : array32FLOAT;
    Y_REF     : array32FLOAT;
END_VAR

VAR_OUTPUT
    Y           : FLOAT;
    X1_used     : FLOAT;
    Y1_used     : FLOAT;
    X2_used     : FLOAT;
    Y2_used     : FLOAT;
    Valid       : BOOL;
    AuditFlag   : BOOL;
    DensityValid: BOOL;
END_VAR

VAR
    i       : INT;
    n_eff   : INT;
    slope   : FLOAT;
    found   : BOOL;
END_VAR

(* --- Inisialisasi status --- *)
Valid        := FALSE;
AuditFlag    := FALSE;
DensityValid := TRUE;
found        := FALSE;

IF NOT Enable THEN
    RETURN;
END_IF;

(* --- Kunci N dalam rentang aman [2..32] --- *)
n_eff := N;
IF n_eff &lt; 2 THEN
    n_eff := 2;
ELSIF n_eff &gt; 32 THEN
    n_eff := 32;
END_IF;

(* --- Validasi monotoni X_REF --- *)
FOR i := 0 TO n_eff - 2 DO
    IF X_REF[i] &gt; X_REF[i + 1] THEN
        DensityValid := FALSE;
    END_IF;
END_FOR;

(* --- Cari interval aktif --- *)
FOR i := 0 TO n_eff - 2 DO
    IF (X &gt;= X_REF[i]) AND (X &lt;= X_REF[i+1]) THEN
        X1_used := X_REF[i];     Y1_used := Y_REF[i];
        X2_used := X_REF[i+1];   Y2_used := Y_REF[i+1];
        found := TRUE;
        EXIT;
    END_IF;
END_FOR;

(* --- Clamp jika X di luar range --- *)
IF NOT found THEN
    IF X &lt; X_REF[0] THEN
        X1_used := X_REF[0];       Y1_used := Y_REF[0];
        X2_used := X_REF[1];       Y2_used := Y_REF[1];
    ELSIF X &gt; X_REF[n_eff - 1] THEN
        X1_used := X_REF[n_eff - 2]; Y1_used := Y_REF[n_eff - 2];
        X2_used := X_REF[n_eff - 1]; Y2_used := Y_REF[n_eff - 1];
    ELSE
        X1_used := X_REF[0];       Y1_used := Y_REF[0];
        X2_used := X_REF[1];       Y2_used := Y_REF[1];
    END_IF;
END_IF;

(* --- Hitung interpolasi linear --- *)
IF (X2_used - X1_used) = 0.0 THEN
    Y := Y1_used;
    Valid := FALSE;
ELSE
    slope := (Y2_used - Y1_used) / (X2_used - X1_used);
    Y := Y1_used + slope * (X - X1_used);
    Valid := TRUE;
END_IF;

(* --- Flag audit --- *)
IF (ABS(Y2_used - Y1_used) &gt; THRESHOLD) OR (NOT DensityValid) THEN
    AuditFlag := TRUE;
ELSE
    AuditFlag := FALSE;
END_IF;

END_FUNCTION_BLOCK
</code></pre>
<hr>
<h3 id="cara-penggunaan">Cara Penggunaan</h3>
<ol>
<li>Tentukan jumlah titik referensi aktual → set <code>N</code>.</li>
<li>Isi <code>X_REF[0..N-1]</code> dan <code>Y_REF[0..N-1]</code> dengan data kurva.</li>
<li>Biarkan <code>X_REF[N..31]</code> dan <code>Y_REF[N..31]</code> default (tidak dipakai).</li>
<li>Set <code>THRESHOLD</code> sesuai toleransi deviasi audit.</li>
<li>Aktifkan <code>Enable := TRUE</code>.</li>
</ol>
<hr>
<h3 id="contoh-tabel-input">Contoh Tabel Input</h3>
<table>
<thead>
<tr>
<th>Index</th>
<th>X_REF</th>
<th>Y_REF</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>10</td>
<td>5</td>
</tr>
<tr>
<td>2</td>
<td>20</td>
<td>15</td>
</tr>
<tr>
<td>3</td>
<td>30</td>
<td>25</td>
</tr>
<tr>
<td>4</td>
<td>40</td>
<td>35</td>
</tr>
<tr>
<td>5</td>
<td>50</td>
<td>50</td>
</tr>
</tbody>
</table>
<p>Jika <code>N = 6</code> dan <code>X = 22</code>, maka interval aktif <code>[20,30]</code> → hasil interpolasi <code>Y ≈ 17</code>.</p>
<hr>
<h3 id="flowchart-pairing">Flowchart Pairing</h3>
<div style="display: flex; flex-direction: column; align-items: center;">
  <div class="mermaid" style="width:100%; max-width:none; font-size:14px;">
    flowchart TD
        A(["Start"]) --&gt; B{"Enable?"}
        B -- "No" --&gt; Z(["Return"])
        B -- "Yes" --&gt; C["Set n_eff = N (clamp 2..32)"]
        C --&gt; D["Check monotoni X_REF"]
        D --&gt; E{"X in interval?"}
        E -- "Yes" --&gt; F["Set X1_used,Y1_used,X2_used,Y2_used"]
        E -- "No" --&gt; G{"X &lt; X_REF[0]?"}
        G -- "Yes" --&gt; H["Clamp ke interval awal"]
        G -- "No" --&gt; I{"X &gt; X_REF[n_eff-1]?"}
        I -- "Yes" --&gt; J["Clamp ke interval akhir"]
        I -- "No" --&gt; K["Fallback konservatif"]
        F --&gt; L{"Degenerate interval?"}
        H --&gt; L
        J --&gt; L
        K --&gt; L
        L -- "Yes" --&gt; M["Set Y=Y1_used, Valid=FALSE"]
        L -- "No" --&gt; N["Hitung slope dan Y, Valid=TRUE"]
        M --&gt; O{"Audit check"}
        N --&gt; O{"Audit check"}
        O -- "Deviasi &gt; THRESHOLD atau monotoni gagal" --&gt; P["AuditFlag=TRUE"]
        O -- "Normal" --&gt; Q["AuditFlag=FALSE"]
        P --&gt; Z(["End"])
        Q --&gt; Z(["End"])
  </div>
</div>
<hr>
<h3 id="kesimpulan">Kesimpulan</h3>
<p><code>K_LOOKUP_LINEAR</code> adalah artefak modular untuk interpolasi linear dinamis di Supcon DCS.<br>
Dengan fleksibilitas jumlah titik, proteksi multi-lapis, dan flag audit, FB ini memperkuat transparansi serta efisiensi sistem kontrol.</p>
<p>Mengapa hal ini penting bagi operasi plant?</p>
<ul>
<li><strong>Mengurangi duplikasi</strong>: tidak perlu lagi membuat FB statis dengan jumlah titik berbeda (misalnya 14, 20, dsb).</li>
<li><strong>Seragam lintas plant</strong>: format array 32 titik menjadi standar implementasi yang mudah diaudit dan diajarkan.</li>
<li><strong>Mempercepat commissioning</strong>: kurva peralatan baru dapat langsung dimasukkan tanpa modifikasi FB.</li>
<li><strong>Lebih aman</strong>: proteksi multi-lapis memastikan output stabil meski data referensi tidak sempurna.</li>
<li><strong>Audit-grade</strong>: adanya flag audit (<code>AuditFlag</code>, <code>DensityValid</code>) memberi transparansi penuh pada kualitas data dan hasil interpolasi.</li>
</ul>
<p>Sebagai ilustrasi nyata, lookup kurva <strong>anti-surge kompresor sentrifugal</strong> dengan 8–10 titik dapat langsung diakomodasi, tanpa harus menulis ulang FB baru seperti pada pendekatan statis <code>K_LIN_INTERP14</code>.</p>
<p><strong>Catatan praktis:</strong> Untuk anti-surge, interpolasi linear adalah pilihan terbaik karena:</p>
<ul>
<li>Perhitungan cepat dan ringan, tidak membebani CPU.</li>
<li>Mudah diverifikasi dan dipahami operator maupun engineer.</li>
<li>Transisi antar titik berjalan cepat sehingga stabil untuk kontrol real-time.</li>
<li>Cukup akurat untuk merepresentasikan performa kompresor di antara titik vendor.</li>
</ul>
<hr>
<h3 id="appendix-%E2%80%94-referensi-klininterp14">Appendix — Referensi <code>K_LIN_INTERP14</code></h3>
<ul>
<li><code>K_LIN_INTERP14</code> adalah <strong>versi statis</strong> dengan 14 titik, cocok untuk kurva performa yang sudah baku.</li>
<li><code>K_LOOKUP_LINEAR</code> adalah <strong>versi dinamis</strong> dengan jumlah titik fleksibel (2–32).</li>
<li>Menyertakan keduanya dalam artikel membantu pembaca memahami <strong>evolusi desain FB</strong> dari statis → dinamis, sekaligus memberi referensi audit.</li>
</ul>
<details>
<summary>K_LIN_INTERP14 Function Block (klik untuk membuka)</summary>
<pre><code class="language-pascal">(*=============================================================================
  Function Block Name : K_LIN_INTERP14
  Author              : Ketut P. Kumajaya
  Date Created        : 04/10/2025
  Description         : Melakukan interpolasi linear berdasarkan 14 pasang titik
                        (X0..X13, Y0..Y13). Umumnya digunakan untuk lookup
                        kurva performa peralatan proses (misalnya garis surge
                        centrifugal compressor).
  Inputs              : X        - Nilai input yang akan diinterpolasi (FLOAT)
                        X0..X13  - Koordinat X referensi (FLOAT)
                        Y0..Y13  - Koordinat Y referensi (FLOAT)
  Outputs             : Y        - Hasil interpolasi linear (FLOAT)
                        X1_used  - Titik awal X interval aktif (FLOAT)
                        Y1_used  - Titik awal Y interval aktif (FLOAT)
                        X2_used  - Titik akhir X interval aktif (FLOAT)
                        Y2_used  - Titik akhir Y interval aktif (FLOAT)
  Artefak Pairing     : X_ARRAY  - ARRAY [0..13] OF FLOAT
                        Y_ARRAY  - ARRAY [0..13] OF FLOAT
  Proteksi Audit      : Jika X di luar range, output dikunci pada ujung tabel.
                        Pembagian dengan nol dicegah dengan fallback ke nilai
                        tetap agar algoritma selalu stabil.
=============================================================================*)

FUNCTION_BLOCK K_LIN_INTERP14

VAR_INPUT
    X   : FLOAT;
    X0  : FLOAT;   Y0  : FLOAT;
    X1  : FLOAT;   Y1  : FLOAT;
    X2  : FLOAT;   Y2  : FLOAT;
    X3  : FLOAT;   Y3  : FLOAT;
    X4  : FLOAT;   Y4  : FLOAT;
    X5  : FLOAT;   Y5  : FLOAT;
    X6  : FLOAT;   Y6  : FLOAT;
    X7  : FLOAT;   Y7  : FLOAT;
    X8  : FLOAT;   Y8  : FLOAT;
    X9  : FLOAT;   Y9  : FLOAT;
    X10 : FLOAT;   Y10 : FLOAT;
    X11 : FLOAT;   Y11 : FLOAT;
    X12 : FLOAT;   Y12 : FLOAT;
    X13 : FLOAT;   Y13 : FLOAT;
END_VAR

VAR_OUTPUT
    X1_used : FLOAT;
    Y1_used : FLOAT;
    X2_used : FLOAT;
    Y2_used : FLOAT;
    Y       : FLOAT;
END_VAR

VAR
    X_ARRAY : array14FLOAT; (* user defined data type *)
    Y_ARRAY : array14FLOAT; (* user defined data type *)
    i       : INT;
    slope   : FLOAT;
END_VAR

(* --- Inisialisasi array --- *)
X_ARRAY[0] := X0;   Y_ARRAY[0] := Y0;
X_ARRAY[1] := X1;   Y_ARRAY[1] := Y1;
...
X_ARRAY[13] := X13; Y_ARRAY[13] := Y13;

(* --- Cari interval aktif --- *)
FOR i := 0 TO 12 DO
    IF (X &gt;= X_ARRAY[i]) AND (X &lt;= X_ARRAY[i+1]) THEN
        X1_used := X_ARRAY[i];   Y1_used := Y_ARRAY[i];
        X2_used := X_ARRAY[i+1]; Y2_used := Y_ARRAY[i+1];
        EXIT;
    END_IF;
END_FOR;

(* --- Clamp jika X di luar range --- *)
IF X &lt; X_ARRAY[0] THEN
    X1_used := X_ARRAY[0];   Y1_used := Y_ARRAY[0];
    X2_used := X_ARRAY[1];   Y2_used := Y_ARRAY[1];
ELSIF X &gt; X_ARRAY[13] THEN
    X1_used := X_ARRAY[12];  Y1_used := Y_ARRAY[12];
    X2_used := X_ARRAY[13];  Y2_used := Y_ARRAY[13];
END_IF;

(* --- Hitung interpolasi linear --- *)
IF (X2_used - X1_used) = 0 THEN
    Y := Y1_used; (* fallback jika interval degenerat *)
ELSE
    slope := (Y2_used - Y1_used) / (X2_used - X1_used);
    Y := Y1_used + slope * (X - X1_used);
END_IF;

END_FUNCTION_BLOCK
</code></pre>
</details>
