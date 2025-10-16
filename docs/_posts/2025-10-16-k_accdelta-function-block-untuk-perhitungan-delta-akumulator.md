---
title: "K_ACCDELTA: Function Block untuk Perhitungan Delta Akumulator"
date: "2025-10-16T20:30:41.000+07:00"
slug: "k_accdelta-function-block-untuk-perhitungan-delta-akumulator"
layout: "post"
excerpt: "Dirancang untuk menghitung delta energi atau akumulator dengan sinkronisasi baseline antar meter, tanpa mengganggu logsheet yang berjalan."
image: "https://images.unsplash.com/photo-1604176857763-71877b24864e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDZ8fG1ldGVyfGVufDB8fHx8MTc2MDYxODMxOXww&ixlib=rb-4.1.0&q=80&w=2000"
image_alt: ""
image_caption: "<span style=\"white-space: pre-wrap;\">Photo by </span><a href=\"https://unsplash.com/@thejmoore?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Jon Moore</span></a><span style=\"white-space: pre-wrap;\"> / </span><a href=\"https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Unsplash</span></a>"
author:
  - "Ketut Kumajaya"
tags:
  - "Distributed Control System"
  - "Practical Engineering"
  - "Field Experience"
categories:
  - "Distributed Control System"
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
url: "https://automation.samatorgroup.com/blog/k_accdelta-function-block-untuk-perhitungan-delta-akumulator/"
comment_id: "68f0b6b28a77df069caabd26"
reading_time: 3
access: true
comments: false
---

<p><em>Ditulis oleh Ketut Kumajaya — 16 Oktober 2025</em></p>
<h3 id="latar-belakang">Latar Belakang</h3>
<p>Dalam sistem distribusi energi, sering kali terdapat perbedaan waktu pemasangan antara power meter pada sisi sumber dan sisi beban. Akibatnya, nilai akumulasi energi pada beban dapat lebih besar dibandingkan sumber, menghasilkan delta negatif yang tidak realistis.</p>
<p>Untuk mengatasi hal ini, Function Block <code>K_ACCDELTA</code> dikembangkan menggunakan Structured Text (ST) untuk menghitung delta akumulator secara andal, dilengkapi dengan proteksi terhadap nilai negatif dan mekanisme <em>snapshot reset</em> guna menyamakan baseline antar meter.</p>
<hr>
<h3 id="struktur-function-block">Struktur Function Block</h3>
<pre><code class="language-pascal">(*=============================================================================
  Function Block Name : K_ACCDELTA
  Author              : Ketut Kumajaya
  Contributor         : Copilot (Microsoft AI)
  Date Created        : 15/10/2025
  Version             : 1.0
  Description         : Menghitung delta antara dua akumulator energi dengan
                        penyimpanan nilai buffer antar siklus. Dapat berfungsi
                        sebagai delta satu power meter maupun sistem netting
                        (sumber–pengurang). Dirancang untuk sinkronisasi
                        pembacaan energi dari power meter yang tidak
                        terpasang serentak, dengan proteksi nilai negatif.
  Inputs              : srcCur - total energi sumber saat ini (FLOAT)
                        subCur - total energi pengurang saat ini (FLOAT)
                        srcBuf - nilai buffer sumber (FLOAT, disimpan di luar FB)
                        subBuf - nilai buffer pengurang (FLOAT, disimpan di luar FB)
                        reset  - TRUE untuk reset output &amp; snapshot awal (BOOL)
  Outputs             : dSrc   - delta energi sumber (FLOAT)
                        dSub   - delta energi pengurang (FLOAT)
                        eNet   - delta netting (sumber - pengurang) (FLOAT)
                        srcOut - snapshot nilai sumber untuk update buffer (FLOAT)
                        subOut - snapshot nilai pengurang untuk update buffer (FLOAT)
  Proteksi Audit      : - Nilai negatif dipaksa nol
                        - Snapshot hanya diperbarui saat reset
                        - Variabel buffer dikelola di luar Function Block
=============================================================================*)

FUNCTION_BLOCK K_ACCDELTA
VAR_INPUT
    srcCur : FLOAT;
    subCur : FLOAT;
    srcBuf : FLOAT;
    subBuf : FLOAT;
    reset  : BOOL;
END_VAR

VAR_OUTPUT
    dSrc   : FLOAT;
    dSub   : FLOAT;
    eNet   : FLOAT;
    srcOut : FLOAT;
    subOut : FLOAT;
END_VAR

VAR
END_VAR

IF NOT reset THEN
    (* Hitung delta terhadap nilai buffer *)
    dSrc := srcCur - srcBuf;
    IF dSrc &lt; 0.0 THEN dSrc := 0.0; END_IF;

    dSub := subCur - subBuf;
    IF dSub &lt; 0.0 THEN dSub := 0.0; END_IF;

    (* Netting antara sumber dan pengurang *)
    eNet := dSrc - dSub;
    IF eNet &lt; 0.0 THEN eNet := 0.0; END_IF;
ELSE
    (* Reset semua output *)
    dSrc := 0.0;
    dSub := 0.0;
    eNet := 0.0;
    (* Snapshot nilai sekarang untuk pembaruan buffer *)
    srcOut := srcCur; (* gunakan untuk update srcBuf eksternal *)
    subOut := subCur; (* gunakan untuk update subBuf eksternal *)
END_IF;

END_FUNCTION_BLOCK
</code></pre>
<hr>
<h3 id="penjelasan">Penjelasan</h3>
<p>Function Block ini dirancang <strong>minimalis</strong>, tanpa penyimpanan <em>state</em> internal. Seluruh baseline (<code>srcBuf</code>, <code>subBuf</code>) dikelola secara eksternal, sehingga blok ini dapat digunakan lintas plant tanpa perlu modifikasi besar.</p>
<ul>
<li><strong>Proteksi nilai negatif</strong> — memastikan delta energi tidak pernah bernilai negatif, menjaga akumulator tetap monoton meningkat.</li>
<li><strong>Snapshot reset</strong> — baseline hanya diperbarui saat reset dilakukan.</li>
<li><strong>Auditability</strong> — setiap aksi reset dapat dicatat sebagai baseline baru, menjaga transparansi pelaporan dan rekonsiliasi data.</li>
</ul>
<p>Selain mode <em>netting</em> (dua meter: sumber dan pengurang), blok ini juga mendukung mode <strong>single-meter delta</strong>. Pada mode ini, input <code>subCur</code> dan <code>subBuf</code> diisi <code>0.0</code>, sehingga <code>K_ACCDELTA</code> berfungsi sebagai kalkulator delta untuk satu power meter saja, di mana eNet = dSrc.</p>
<hr>
<h3 id="reset-logis-di-level-dcs">Reset Logis di Level DCS</h3>
<p>Reset pada <code>K_ACCDELTA</code> dilakukan <strong>di level DCS</strong>, bukan pada power meter fisik. Power meter terus mengakumulasi total energi tanpa pernah direset, sedangkan reset di DCS hanya menetapkan <strong>baseline baru</strong> sebagai titik awal perhitungan delta berikutnya tanpa mengubah nilai aktual di meter.</p>
<p>Reset ini berfungsi sebagai <strong>sinkronisasi baseline</strong> antar power meter, memastikan perhitungan delta tetap akurat meskipun waktu pemasangan atau status akumulasi antar meter berbeda.</p>
<p>Pendekatan ini memiliki beberapa keuntungan:</p>
<ul>
<li>Tidak memerlukan akses konfigurasi langsung ke power meter.</li>
<li>Aman terhadap kesalahan pembacaan maupun sistem billing.</li>
<li>Fleksibel dan dapat diterapkan lintas sistem.</li>
<li>Baseline reset dapat diaudit melalui rekam operasi DCS.</li>
</ul>
<p>Mekanisme reset logis ini <strong>tidak mengganggu logsheet maupun histori energi</strong>. Nilai akumulasi tetap tercatat normal, sementara baseline baru hanya memengaruhi perhitungan delta pada sisi DCS.</p>
<hr>
<h3 id="flowchart">Flowchart</h3>
<figure style="display: flex; flex-direction: column; align-items: center; margin: 20px 0;">
  <div class="mermaid" style="width:75%; max-width:700px; font-size:16px;">
%%{init: {'themeVariables': { 'fontSize': '14px', 'primaryColor': '#e8f0fe', 'edgeLabelBackground':'#ffffff'}}}%%
flowchart TD
    A["Mulai"] --&gt; B["Apakah reset = TRUE?"]
    B -- Ya --&gt; C["Snapshot buffer eksternal:<br>srcOut = srcCur<br>subOut = subCur"]
    B -- Tidak --&gt; D["Hitung delta sumber:<br>dSrc = srcCur - srcBuf"]
    D --&gt; E["Hitung delta pengurang:<br>dSub = subCur - subBuf"]
    E --&gt; F["Hitung energi bersih:<br>eNet = dSrc - dSub"]
    C --&gt; G["Kirim output:<br>dSrc, dSub, eNet, srcOut, subOut"]
    F --&gt; G
    G --&gt; H["Selesai"]
    A:::Pine
    B:::Peach
    C:::Ash
    D:::Ash
    E:::Ash
    F:::Ash
    G:::Ash
    H:::Pine
    classDef Peach stroke-width:2px, stroke-dasharray:none, stroke:#FBB35A, fill:#FFEFDB, color:#8F632D
    classDef Pine stroke-width:2px, stroke-dasharray:none, stroke:#254336, fill:#27654A, color:#FFFFFF
    classDef Ash stroke-width:2px, stroke-dasharray:none, stroke:#999999, fill:#EEEEEE, color:#000000
  </div>
  <figcaption style="text-align:center; font-size:13px; color:#555;">
    K_ACCDELTA: Perhitungan delta energi dengan proteksi negatif dan fungsi reset
  </figcaption>
</figure>
<hr>
<h3 id="kesimpulan">Kesimpulan</h3>
<p>Function Block <code>K_ACCDELTA</code> menghitung delta energi dengan proteksi nilai negatif dan mekanisme snapshot reset. Dengan desain yang minimalis dan modular, FB ini dapat digunakan baik untuk <strong>netting dua meter</strong> maupun <strong>single-meter delta</strong>, serta mendukung auditabilitas lintas plant. Reset dilakukan secara logis di DCS, memungkinkan pembaruan baseline kapan pun tanpa memengaruhi nilai akumulasi pada power meter.</p>
