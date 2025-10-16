---
ghost_uuid: "a116e101-54c9-4d2c-8e98-13d6d5764f2b"
title: "Manajemen OEE Shutdown di Sistem DCS"
date: "2025-08-16T02:23:08.000+07:00"
slug: "manajemen-oee-shutdown-di-sistem-dcs"
layout: "post"
excerpt: |
  Panduan ringkas bagi operator untuk memahami cara kerja buffer timer—mengakumulasi waktu shutdown saat trip—serta kapan memindahkannya ke kategori yang tepat, bahkan setelah plant restart.
image: "https://images.unsplash.com/photo-1748366416622-8bd7b3530dd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDYzfHxjb250cm9sJTIwcm9vbXxlbnwwfHx8fDE3NTUyODU5NDB8MA&ixlib=rb-4.1.0&q=80&w=2000"
image_alt: ""
image_caption: "<span style=\"white-space: pre-wrap;\">Photo by </span><a href=\"https://unsplash.com/@alteredpoint?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Igor Saikin</span></a><span style=\"white-space: pre-wrap;\"> / </span><a href=\"https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Unsplash</span></a>"
author:
  - "Ketut Kumajaya"
tags:
  - "Overall Equipment Effectiveness"
  - "Distributed Control System"
  - "Practical Engineering"
  - "FOSS Workflow"
categories:
  - "overall-equipment-effectiveness"
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
url: "https://automation.samatorgroup.com/blog/manajemen-oee-shutdown-di-sistem-dcs/"
comment_id: "689f701d7eeef80609b3ce17"
reading_time: 7
access: true
comments: false
---

<h2 id="pendekatan-modular-dengan-buffer-timer-dan-klasifikasi-setelah-trip">Pendekatan Modular dengan Buffer Timer dan Klasifikasi Setelah Trip</h2>
<p><em>Ditulis oleh Ketut Kumajaya | 16 Agustus 2025</em></p>
<h2 id="pendahuluan">Pendahuluan</h2>
<p>Manajemen <em>shutdown runtime</em> dalam sistem DCS bertujuan mencatat setiap penghentian operasi secara akurat dan terklasifikasi, guna mendukung pelaporan Overall Equipment Effectiveness (OEE) yang valid. Dalam praktik, operator tidak selalu bisa segera mengklasifikasikan jenis shutdown saat <em>trip</em> terjadi, sehingga data <em>downtime</em> berisiko tercatat tidak sesuai.</p>
<p>Pendekatan modular ini menggunakan <em>buffer runtime</em> sebagai penampung sementara durasi shutdown. Buffer tidak harus langsung ditransfer ke kategori yang sesuai; transfer dapat dilakukan setelah situasi terkendali akibat trip, termasuk pasca <em>plant restart</em>. Namun, jika hingga terjadi trip berikutnya klasifikasi belum dilakukan, durasi shutdown dari kategori berbeda berpotensi tercampur di buffer, mengaburkan akar penyebab downtime pada laporan OEE. Karena itu, klasifikasi sesegera mungkin sangat dianjurkan.</p>
<hr>
<h2 id="prinsip-kerja">Prinsip Kerja</h2>
<ul>
<li><strong>Saat plant shutdown/trip</strong>: Sistem otomatis masuk <em>buffer mode</em> untuk mencatat durasi downtime. Operator memilih kategori shutdown sebelum plant start (peluang pertama). Jika terlewat, klasifikasi masih dapat dilakukan sekali setelah start (peluang kedua). Shutdown berikutnya tanpa klasifikasi akan potensial mencampurkan data dengan kategori berbeda, menurunkan akurasi OEE.</li>
<li><strong>Setelah klasifikasi</strong>: Durasi di buffer dipindahkan ke kategori yang dipilih. Sistem melanjutkan pencatatan pada kategori yang sesuai jika shutdown masih berlanjut.</li>
<li><strong>Perhitungan waktu</strong>: Durasi shutdown dihitung otomatis per kategori, termasuk total eksternal shutdown.</li>
<li><strong>Retensi data</strong>: Semua status dan durasi tetap tersimpan meski plant restart.</li>
</ul>
<div style="width: 100%; text-align: center; margin: 0.5em auto; max-width: 480px;">
  <div class="mermaid" style="width: 100%; max-width: 800px;">
    ---
    config:
      look: handDrawn
      theme: neutral
    ---
    flowchart TD
        MULAI["Mulai"]:::startend --&gt; A{"Plant shutdown/trip?"}:::decision
        A -- Tidak --&gt; B["Monitor"]:::process --&gt; SELESAI["Selesai"]:::startend
        A -- Ya --&gt; D["Buffer aktif"]:::process
        D --&gt; F{"Kategori diketahui?"}:::decision
        F -- Tidak --&gt; G["Klasifikasikan saat aman"]:::process --&gt; SELESAI
        F -- Ya --&gt; H["Pilih kategori"]:::process
        H --&gt; I["Checklist → start/restart"]:::process --&gt; SELESAI["Kembali ke awal"]
        %% Style definitions
        classDef decision fill:#ffe0b3,stroke:#cc7a00,stroke-width:2px
        classDef process fill:#cce5ff,stroke:#004085,stroke-width:2px
        classDef startend fill:#d4edda,stroke:#155724,stroke-width:2px,font-weight:bold
  </div>
    <figcaption style="font-style: italic; margin-top: 0em; color: #555; font-size: 0.8em;">
    Panduan Cepat Alur Keputusan Kategori Shutdown
    </figcaption>
</div>
<hr>
<h2 id="kategori-shutdown">Kategori Shutdown</h2>
<table>
<thead>
<tr>
<th>Type</th>
<th>Kategori</th>
<th>Deskripsi</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>Idle</td>
<td>Tidak ada shutdown aktif</td>
</tr>
<tr>
<td>1</td>
<td>Buffered Shutdown</td>
<td>Belum diklasifikasikan; durasi disimpan di buffer</td>
</tr>
<tr>
<td>2</td>
<td>Agreed Shutdown (AG)</td>
<td>Shutdown terencana dan disepakati</td>
</tr>
<tr>
<td>3</td>
<td>Random Shutdown (RS)</td>
<td>Shutdown mendadak tanpa perencanaan</td>
</tr>
<tr>
<td>4</td>
<td>External – Electricity Trip (EG–ET)</td>
<td>Trip akibat gangguan listrik eksternal</td>
</tr>
<tr>
<td>5</td>
<td>External – Lack of Order (EG–LO)</td>
<td>Tidak ada pesanan produksi</td>
</tr>
<tr>
<td>6</td>
<td>External – Water Shortage (EG–WS)</td>
<td>Pasokan air tidak mencukupi</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="variabel-fungsi-utama">Variabel &amp; Fungsi Utama</h2>
<table>
<thead>
<tr>
<th>Variabel</th>
<th>Tipe</th>
<th>Deskripsi</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>OEE_RUN</code></td>
<td>BOOL</td>
<td>Status plant (TRUE = running, FALSE = trip).</td>
</tr>
<tr>
<td><code>OEE_RUP</code></td>
<td>BOOL</td>
<td>Trigger start plant (R_TRIG + TP). Reset status trip &amp; kategori.</td>
</tr>
<tr>
<td><code>OEE_RDN</code></td>
<td>BOOL</td>
<td>Trigger trip plant (F_TRIG + TP). Aktifkan buffer jika belum ada trip aktif.</td>
</tr>
<tr>
<td><code>FLG_IN</code></td>
<td>BOOL</td>
<td>Loop input flag trip global → FB.</td>
</tr>
<tr>
<td><code>TYP_IN</code></td>
<td>UINT</td>
<td>Loop input kategori shutdown global → FB.</td>
</tr>
<tr>
<td><code>FLG_OUT</code></td>
<td>BOOL</td>
<td>Loop output flag trip FB → global.</td>
</tr>
<tr>
<td><code>TYP_OUT</code></td>
<td>UINT</td>
<td>Loop output kategori shutdown FB → global.</td>
</tr>
<tr>
<td><code>OEE_BE..WE</code></td>
<td>BOOL</td>
<td>Enable akumulasi per kategori (Buffered, Agreed, Random, ElecTrip, NoOrder, WaterShort).</td>
</tr>
<tr>
<td><code>OEE_AD..WD</code></td>
<td>BOOL</td>
<td>Pulse transfer buffer → kategori</td>
</tr>
</tbody>
</table>
<hr>
<h3 id="fungsi-rutin-utama">Fungsi / Rutin Utama</h3>
<ul>
<li>
<p><strong>Deteksi Start (OEE_RUP)</strong><br>
Reset status trip, normalisasi kategori, siap untuk rekap eksternal.</p>
</li>
<li>
<p><strong>Deteksi Trip (OEE_RDN)</strong><br>
Masuk buffer mode, snapshot timer, trigger akumulasi awal.</p>
</li>
<li>
<p><strong>Proteksi Status</strong><br>
Normalisasi <code>typ</code> (Idle → Buffered, atau reset jika &gt;6).</p>
</li>
<li>
<p><strong>Transfer Buffer → Kategori</strong><br>
Pulse <code>OEE_AD..WD</code> sesuai kategori, reset buffer setelah transfer.</p>
</li>
<li>
<p><strong>Akumulasi Waktu</strong><br>
Enable <code>OEE_BE..WE</code> saat <code>OEE_RUN = FALSE</code>, sesuai kategori aktif.</p>
</li>
</ul>
<hr>
<h2 id="alur-operasional">Alur Operasional</h2>
<h3 id="1-plant-berjalan-oeerun-true">1. Plant Berjalan (<code>OEE_RUN = TRUE</code>)</h3>
<ul>
<li>Sistem dalam kondisi normal, tidak ada akumulasi downtime.</li>
<li>Jika <code>OEE_RUP = TRUE</code> (restart):
<ul>
<li>Reset status trip (<code>FLG_OUT := FALSE</code>, <code>TYP_OUT := 0</code>).</li>
<li>Normalisasi kategori shutdown.</li>
<li>Buffer dikosongkan, siap untuk siklus berikutnya.</li>
</ul>
</li>
</ul>
<h3 id="2-plant-trip-oeerun-false">2. Plant Trip (<code>OEE_RUN = FALSE</code>)</h3>
<ul>
<li>Jika <code>OEE_RDN = TRUE</code> dan belum ada trip aktif:
<ul>
<li>Sistem masuk <strong>buffer mode</strong> (<code>TYP_OUT := 1</code>, <code>FLG_OUT := TRUE</code>).</li>
<li>Timer buffer mulai mencatat durasi downtime.</li>
</ul>
</li>
<li>Jika <code>FLG_OUT = TRUE</code> dan <code>TYP_OUT = 1</code>:
<ul>
<li>Buffer terus mengakumulasi waktu shutdown.</li>
</ul>
</li>
<li>Jika <code>FLG_OUT = FALSE</code> dan <code>TYP_OUT ∈ [2..6]</code>:
<ul>
<li>Akumulasi langsung ke kategori yang dipilih.</li>
</ul>
</li>
</ul>
<h3 id="3-transfer-buffer-%E2%86%92-kategori">3. Transfer Buffer → Kategori</h3>
<ul>
<li>Saat operator memilih kategori shutdown (<code>TYP_OUT ∈ [2..6]</code>):
<ul>
<li>Pulse transfer trigger (<code>OEE_AD..WD := TRUE</code>) ke <code>EN</code> K_ADD_ACCUM, mengalihkan durasi buffer ke kategori.</li>
<li>Buffer dikosongkan menggunakan <code>ENO</code> K_ADD_ACCUM di atas, diisolasi MOVE_BOOL. Status trip dinormalisasi.</li>
</ul>
</li>
</ul>
<h3 id="4-akumulasi-waktu">4. Akumulasi Waktu</h3>
<ul>
<li>Selama <code>OEE_RUN = FALSE</code>:
<ul>
<li><code>OEE_BE</code> aktif jika masih di buffer.</li>
<li><code>OEE_AE..WE</code> aktif sesuai kategori shutdown yang dipilih. Ini dihubungkan ke <code>ENABLE</code> K_ACCUM.</li>
</ul>
</li>
</ul>
<h3 id="5-proteksi-status">5. Proteksi Status</h3>
<ul>
<li>Jika <code>TYP_OUT = 0</code> saat trip → otomatis dinormalisasi ke buffer (<code>TYP_OUT := 1</code>).</li>
<li>Jika <code>TYP_OUT &gt; 6</code> → diset ulang ke <code>0</code> (jika RUN) atau <code>1</code> (jika trip).</li>
</ul>
<h4 id="catatan">Catatan</h4>
<ul>
<li><strong>Rekap total runtime eksternal (ET, LO, WS)</strong> dilakukan di luar Function Block. Beberapa Function Block lain digunakan, diantaranya: K_ACCUM, K_ADD_ACCUM, dan K_SUB_ACCUM.</li>
<li>Operator wajib memilih kategori shutdown sebelum plant start untuk mencegah tercampurnya durasi antar kategori.</li>
</ul>
<hr>
<h2 id="program-dcs-dan-flowchart">Program DCS dan Flowchart</h2>
<p>Program DCS dibungkus dalam Function Block <strong>K_OEE</strong> sehingga ringkas, modular, traceable, dan portabel—mudah dipindahkan ke DCS/PLC lain.<br>
Pendekatan ini menegaskan bahwa <strong>K_OEE berperan murni sebagai <em>state machine</em></strong>, sementara eksekusi teknis didistribusikan ke blok lain sesuai fungsinya:</p>
<ul>
<li>K_ACCUM → menangani akumulasi waktu shutdown per kategori</li>
<li>K_ADD_ACCUM → menangani transfer durasi dari buffer ke kategori terpilih</li>
<li>K_SUB_ACCUM → menangani reset buffer setelah transfer</li>
</ul>
<p>Dengan pemisahan ini, setiap blok memiliki tanggung jawab yang jelas (<em>separation of concerns</em>), sehingga logika lebih mudah ditelusuri, diuji, dan diadaptasi lintas plant.</p>
<p>Flowchart menjadi referensi hidup yang memastikan setiap revisi logika tetap dapat ditelusuri, diaudit, dan diajarkan lintas operator.</p>
<details> <summary>Program DCS – Manajemen OEE Shutdown</summary>
<pre><code class="language-pascal">(*
===============================================================================
 Function Block : K_OEE
 Deskripsi      : Modul manajemen shutdown OEE berbasis buffer -&gt; kategori.
                  FB ini mengelola transisi event Trip/Restart, proteksi status,
                  transfer buffer ke kategori shutdown, serta akumulasi waktu
                  saat plant tidak RUN. Dirancang modular &amp; reusable antar plant.

 Penulis        : Ketut Kumajaya
 Kontributor    : Copilot (Microsoft AI)
 Versi          : 2.0 (FB version)
 Tanggal        : 28/09/2025

 Interface I/O  :
   VAR_INPUT
     OEE_RUN    - Status plant run
     OEE_RUP    - Trigger restart plant menggunakan R_TRIG + TP 1000ms eksternal
     OEE_RDN    - Trigger trip plant menggunakan F_TRIG + TP 1000ms eksternal
     FLG_IN     - Flag event aktif (loop input dari global/HMI)
     TYP_IN     - Tipe shutdown aktif (loop input dari global/HMI)

   VAR_OUTPUT
     OEE_BE..WE - Enable accumulator K_ACCUM (Buffered, Agreed, Random,
                  ElecTrip, NoOrder, WaterShort)
     OEE_AD..WD - Transfer flag buffer -&gt; kategori menggunakan TP 1000ms
                  sebagai pulse untuk K_ADD_ACCUM
     FLG_OUT    - Flag event aktif (loop output ke global/HMI)
     TYP_OUT    - Tipe shutdown aktif (loop output ke global/HMI)

 Catatan        :
   - OEE_FLG dan OEE_TYP tetap global untuk HMI, dihubungkan via _IN/_OUT.
   - FB dapat di‑instantiate per line/plant secara independen.
   - Reset accumulator buffer dilakukan di luar FB setelah transfer. Isolasi
     ENO K_ADD_ACCUM dengan MOVE_BOOL.
===============================================================================
*)

FUNCTION_BLOCK K_OEE
VAR_INPUT
    OEE_RUN    : BOOL;   (* Status plant run *)
    OEE_RUP    : BOOL;   (* Trigger restart plant *)
    OEE_RDN    : BOOL;   (* Trigger trip plant *)

    FLG_IN : BOOL;   (* Loop input dari global *)
    TYP_IN : UINT;   (* Loop input dari global *)
END_VAR

VAR_OUTPUT
    (* Enable accumulator *)
    OEE_BE, OEE_AE, OEE_RE : BOOL;
    OEE_EE, OEE_LE, OEE_WE : BOOL;

    (* Transfer flag *)
    OEE_AD, OEE_RD, OEE_ED : BOOL;
    OEE_LD, OEE_WD         : BOOL;

    (* Loop output ke global *)
    FLG_OUT : BOOL;
    TYP_OUT : UINT;
END_VAR

VAR
    flg : BOOL;   (* internal mirror dari FLG_IN *)
    typ : UINT;   (* internal mirror dari TYP_IN *)
END_VAR

(* ========================================================================== *)
(*  OEE Shutdown Management Logic                                             *)
(* ========================================================================== *)

(* Mirror input ke internal state *)
flg := FLG_IN;
typ := TYP_IN;

(* Reset semua enable accumulator di awal siklus *)
OEE_BE := FALSE; OEE_AE := FALSE; OEE_RE := FALSE;
OEE_EE := FALSE; OEE_LE := FALSE; OEE_WE := FALSE;

(* Reset semua enable transfer di awal siklus *)
OEE_AD := FALSE; OEE_RD := FALSE; OEE_ED := FALSE;
OEE_LD := FALSE; OEE_WD := FALSE;

(* EVENT: Restart Plant *)
IF OEE_RUP THEN
    OEE_BE := FALSE; OEE_AE := FALSE; OEE_RE := FALSE;
    OEE_EE := FALSE; OEE_LE := FALSE; OEE_WE := FALSE;
    IF (typ &gt;= 2) AND (typ &lt;= 6) THEN
        flg := FALSE; typ := 0;
        (* Reset status trip &amp; trigger rekap eksternal *)
    END_IF;
END_IF;

(* EVENT: Trip Plant *)
IF OEE_RDN THEN
    IF NOT flg THEN
        flg := TRUE; typ := 1;
        (* Masuk buffer mode, snapshot timer, trigger rekap *)
    END_IF;
END_IF;

(* PROTEKSI: konsistensi status *)
IF flg AND (typ = 0) THEN
    typ := 1; 
    (* Normalisasi tipe idle -&gt; buffered *)
END_IF;

(* PROTEKSI: Normalisasi tipe shutdown *)
IF typ &gt; 6 THEN
    IF OEE_RUN THEN typ := 0; ELSE typ := 1; END_IF;
END_IF;

(* TRANSFER: Buffer ke kategori *)
IF flg AND (typ &gt;= 2) AND (typ &lt;= 6) THEN
    OEE_BE := FALSE;
    CASE typ OF
        2: OEE_AD := TRUE; (* Agreed *)
        3: OEE_RD := TRUE; (* Random *)
        4: OEE_ED := TRUE; (* ElecTrip *)
        5: OEE_LD := TRUE; (* NoOrder *)
        6: OEE_WD := TRUE; (* WaterShort *)
    END_CASE;
    flg := FALSE;
    IF OEE_RUN THEN typ := 0; END_IF;
END_IF;

(* AKUMULASI: Dilakukan saat RUN=FALSE *)
IF NOT OEE_RUN THEN
    (* Buffered *)
    IF flg AND (typ = 1) THEN
        OEE_BE := TRUE;
    END_IF;

    (* Kategori 2..6 *)
    IF NOT flg THEN
        CASE typ OF
            2: OEE_AE := TRUE;
            3: OEE_RE := TRUE;
            4: OEE_EE := TRUE;
            5: OEE_LE := TRUE;
            6: OEE_WE := TRUE;
        END_CASE;
    END_IF;
END_IF;

(* Mirror internal state ke output *)
FLG_OUT := flg;
TYP_OUT := typ;

END_FUNCTION_BLOCK

</code></pre>
</details>
<details> <summary>Flowchart – Alur Logika Shutdown</summary>
<div style="width: 100%; text-align: center; margin: 0.5em auto; max-width: 800px;">
  <div class="mermaid" style="width: 100%; max-width: 800px;">
    ---
    config:
      look: handDrawn
      theme: neutral
      layout: fixed
    ---
    flowchart TD
        classDef mulai fill:#d4f4dd,stroke:#2e7d32,stroke-width:1px,color:#000
        classDef decision fill:#fff3cd,stroke:#f0ad4e,stroke-width:1px,color:#000
        classDef process fill:#d9edf7,stroke:#31708f,stroke-width:1px,color:#000
        classDef akhir fill:#f5f5f5,stroke:#777,stroke-width:1px,color:#000
        A["Mulai siklus"]:::mulai --&gt; B["Mirror Input: FLG_IN, TYP_IN"]:::process
        B --&gt; C["Reset semua pengaktif accumulator &amp; transfer"]:::process
        %% Event Handling
        subgraph S1[" "]
            C --&gt; D{"OEE_RUP?"}:::decision
            D --&gt;|Ya| E1{"typ &gt;= 2 AND typ &lt;= 6?"}:::decision
            E1 --&gt;|Ya| E2["Reset status trip: flg:=FALSE, typ:=0"]:::process
            E1 --&gt;|Tidak| E3["Reset semua accumulator"]:::process
            D --&gt;|Tidak| F{"OEE_RDN AND NOT flg?"}:::decision
            E2 --&gt; Q
            E3 --&gt; Q
            F --&gt;|Ya| G["Set flg:=TRUE, typ:=1 (Buffer Mode)"]:::process
            F --&gt;|Tidak| H["Proteksi Status"]:::process
            G --&gt; Q
        end
        style S1 fill:transparent,stroke:transparent
        %% Proteksi
        subgraph S2[" "]
            H --&gt; I1{"flg AND typ = 0?"}:::decision
            I1 --&gt;|Ya| J1["typ := 1"]:::process
            I1 --&gt;|Tidak| I2{"typ &gt; 6?"}:::decision
            I2 --&gt;|Ya| J2{"OEE_RUN?"}:::decision
            J2 --&gt;|Ya| J3["typ := 0"]:::process
            J2 --&gt;|Tidak| J4["typ := 1"]:::process
            I2 --&gt;|Tidak| K
            J1 --&gt; K
            J3 --&gt; K
            J4 --&gt; K
        end
        style S2 fill:transparent,stroke:transparent
        %% Transfer Buffer ke Kategori
        subgraph S3[" "]
            K{"flg AND typ &gt;= 2 AND typ &lt;= 6?"}:::decision
            K --&gt;|typ=2| L1["OEE_BE:=FALSE; Pulse Transfer ke Agreed"]:::process
            K --&gt;|typ=3| L2["OEE_BE:=FALSE; Pulse Transfer ke Random"]:::process
            K --&gt;|typ=4| L3["OEE_BE:=FALSE; Pulse Transfer ke ElecTrip"]:::process
            K --&gt;|typ=5| L4["OEE_BE:=FALSE; Pulse Transfer ke NoOrder"]:::process
            K --&gt;|typ=6| L5["OEE_BE:=FALSE; Pulse Transfer ke WaterShort"]:::process
            L1 --&gt; M["flg:=FALSE; IF OEE_RUN THEN typ:=0"]:::process
            L2 --&gt; M
            L3 --&gt; M
            L4 --&gt; M
            L5 --&gt; M
            M --&gt; N
            K --&gt;|Tidak| N
        end
        style S3 fill:transparent,stroke:transparent
        %% Akumulasi
        subgraph S4[" "]
            N{"OEE_RUN = FALSE?"}:::decision
            N --&gt;|Ya| N1{"flg = TRUE AND typ = 1?"}:::decision
            N1 --&gt;|Ya| O1["Enable Buffered Accumulator"]:::process
            N1 --&gt;|Tidak| N2{"flg = FALSE AND typ &gt;= 2 AND typ &lt;= 6?"}:::decision
            N2 --&gt;|typ=2| O2["Enable Agreed Accumulator"]:::process
            N2 --&gt;|typ=3| O3["Enable Random Accumulator"]:::process
            N2 --&gt;|typ=4| O4["Enable ElecTrip Accumulator"]:::process
            N2 --&gt;|typ=5| O5["Enable NoOrder Accumulator"]:::process
            N2 --&gt;|typ=6| O6["Enable WaterShort Accumulator"]:::process
            N --&gt;|Tidak| P["Skip Akumulasi"]:::process
            N2 --&gt;|Tidak| P
        end
        style S4 fill:transparent,stroke:transparent
        %% Output &amp; Loop
        O1 --&gt; Q["Mirror ke FLG_OUT, TYP_OUT"]:::process
        O2 --&gt; Q
        O3 --&gt; Q
        O4 --&gt; Q
        O5 --&gt; Q
        O6 --&gt; Q
        P --&gt; Q
        Q --&gt; R["Kembali ke siklus awal"]:::akhir
  </div>
</div>
</details>
<hr>
<h2 id="penutup">Penutup</h2>
<p>Buffer runtime mempertahankan durasi downtime sampai ditransfer ke kategori yang benar. Menunda klasifikasi berisiko mencampur kategori dan mengaburkan akar penyebab, sehingga klasifikasi cepat menjadi kunci akurasi dan auditabilitas OEE. Dirancang mengikuti realitas lapangan, logika ini mendukung pengambilan keputusan operator secara tepat dan manusiawi. Sebelum plant start, operator wajib memastikan kategori shutdown telah dipilih sesuai checklist untuk mencegah tercampurnya durasi antarkategori dan menjaga integritas data.</p>
<p><strong>Manfaat utama:</strong></p>
<ul>
<li>Mengurangi risiko kehilangan runtime akibat kelengahan operator.</li>
<li>Audit trail kuat untuk penelusuran dan pemantauan performa plant.</li>
<li>Struktur kode modular dan portabel, mudah diadaptasi lintas DCS/PLC.</li>
</ul>

<!--kg-card-begin: html-->
<!--   Scroll Top   -->
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
