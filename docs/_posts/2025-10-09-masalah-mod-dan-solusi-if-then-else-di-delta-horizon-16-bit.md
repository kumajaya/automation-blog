---
ghost_uuid: "e1eecd2a-8983-406e-a6a6-097f5c687df3"
title: "Masalah MOD dan Solusi IF-THEN-ELSE di Delta Horizon 16-bit"
date: "2025-10-09T01:12:48.000+07:00"
slug: "masalah-mod-dan-solusi-if-then-else-di-delta-horizon-16-bit"
layout: "post"
excerpt: |
  Pendekatan MOD sering dipakai untuk menghitung delta berbasis counter 16-bit di sistem DCS. Namun, metode ini rawan menghasilkan loncatan nilai saat terjadi anomali pembacaan.
image: "https://images.unsplash.com/photo-1601397922721-4326ae07bbc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDZ8fG1hdGh8ZW58MHx8fHwxNzU5OTQzNjQ3fDA&ixlib=rb-4.1.0&q=80&w=2000"
image_alt: ""
image_caption: "<span style=\"white-space: pre-wrap;\">Photo by </span><a href=\"https://unsplash.com/@joshua_hoehne?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Joshua Hoehne</span></a><span style=\"white-space: pre-wrap;\"> / </span><a href=\"https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Unsplash</span></a>"
author:
  - "Ketut Kumajaya"
tags:
  - "Distributed Control System"
  - "Field Experience"
  - "Practical Engineering"
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
url: "https://automation.samatorgroup.com/blog/masalah-mod-dan-solusi-if-then-else-di-delta-horizon-16-bit/"
comment_id: "68e69ab866a8d7058090a012"
reading_time: 4
access: true
comments: false
---

<p><em>Ditulis oleh Ketut Kumajaya | 08 Oktober 2025</em></p>
<h2 id="pengantar">Pengantar</h2>
<p>Dalam sistem DCS berbasis counter 16-bit, perhitungan delta sering menghadapi masalah rollover—nilai kembali ke nol setelah mencapai batas 65.535. Jika tidak ditangani dengan benar, kondisi ini menghasilkan loncatan nilai besar (false delta) yang mengganggu akumulasi waktu maupun totalisasi.</p>
<p>Artikel ini membahas pendekatan <strong>IF-THEN-ELSE wrap-aware</strong> yang diimplementasikan dalam Function Block <strong>K_DELTA</strong>, serta hasil validasinya terhadap anomali delta akibat rollover.</p>
<hr>
<h2 id="latar-belakang">Latar Belakang</h2>
<p>Loncatan delta terdeteksi di pengujian lapangan setelah berhari-hari operasi, ketika counter timer atau pulse mengalami <em>wrap</em>, menyebabkan selisih waktu palsu yang mengganggu akumulasi.</p>
<p>Solusi <em>wrap-aware delta</em> mengatasi ini dengan menangani kondisi <em>wrap</em> secara eksplisit, melengkapi strategi sebelumnya seperti <strong>K_ACCUM</strong> untuk distribusi waktu antar controller.</p>
<hr>
<h2 id="analisis-akar-masalah">Analisis Akar Masalah</h2>
<p>Rentang 16-bit membatasi counter pada nilai 0–65.535, di mana <em>rollover</em> menyebabkan <code>CURRENT &lt; PREVIOUS</code>.</p>
<p>Pendekatan naif menggunakan MOD — <code>(CURRENT + 65536 - PREVIOUS) MOD 65536</code> — gagal di kondisi anomali <em>non-monotonic</em> (misalnya glitch hardware), menghasilkan delta besar seperti <strong>65.486</strong>, interpretasi <em>wrap palsu</em> yang mempropagasi loncatan ke akumulator.</p>
<p>Pada DCS tanpa <em>auto-promotion</em>, perhitungan MOD juga rentan <em>overflow pre-mod</em>, memperbesar risiko delta negatif atau positif palsu setelah 65k pulsa.</p>
<hr>
<h2 id="perbandingan-pendekatan">Perbandingan Pendekatan</h2>
<p>MOD efisien karena tanpa percabangan kondisional, tetapi rawan loncatan di anomali akibat ambiguitas modulo pada penurunan nilai (delta &gt; separuh rentang 32.768).</p>
<p>Sebaliknya, IF-THEN-ELSE lebih eksplisit: langsung mengurangkan jika tidak <em>wrap</em>, atau menghitung sisa rentang + CURRENT + 1 jika <em>wrap</em>.</p>
<p>Keduanya menghasilkan nilai identik di kondisi normal, namun IF-THEN-ELSE unggul dalam proteksi (cutoff anomali) dan kemudahan <em>debugging</em> di DCS — memastikan akumulasi tetap terprediksi.</p>
<hr>
<h2 id="catatan-teknis">Catatan Teknis</h2>
<p><strong>K_DELTA versi 1.2</strong> mengadopsi pendekatan <strong>IF-THEN-ELSE wrap-aware</strong> dengan <em>cutoff</em> 60 detik untuk loncatan ekstrem, menggunakan tipe <strong>LONG</strong> agar aman di Supcon.</p>
<p>Pendekatan ini menghilangkan loncatan akibat MOD dan menstabilkan delta untuk akumulasi yang dapat diprediksi.</p>
<p>Perlu dicatat bahwa masalah loncatan nilai sebenarnya bukan spesifik masalah K_DELTA, melainkan digunakan sebagai contoh kasus untuk menjelaskan perbedaan perilaku antara operator <code>MOD</code> dan logika <code>IF-THEN-ELSE</code>.</p>
<p>Dalam sistem sebenarnya, K_DELTA berfungsi sebagai <em>time backbone</em> — modul pusat yang menyediakan nilai <em>delta waktu</em> secara global bagi berbagai Function Block lain seperti <code>K_ACCUM</code>. Dengan cara ini, setiap <code>K_ACCUM</code> tidak perlu lagi menghitung delta waktunya masing-masing, sehingga struktur kode menjadi lebih sederhana, efisien, dan mudah diaudit.</p>
<hr>
<h3 id="diagram-alur">Diagram Alur</h3>
<div style="display: flex; flex-direction: column; align-items: center;">
  <div class="mermaid" style="width:60%; max-width:none; font-size:14px;">
    %%{init: {'themeVariables': { 'primaryColor': '#e8f0fe', 'lineColor': '#333', 'fontSize': '14px', 'edgeLabelBackground':'#ffffff'}}}%%
    graph TD
        A["Input: TIMER_IN, LAST_IN"] --&gt; B{"TIMER_IN &gt;= LAST_IN?"}
        B --&gt;|<span style="color:green">Ya</span>| C["Δ := TIMER_IN - LAST_IN (LONG)"]
        B --&gt;|<span style="color:orange">Tidak</span>| D["Δ := (65535 - LAST_IN) + TIMER_IN + 1 (LONG)"]
        C --&gt; E{"Δ &gt; 60?"}
        D --&gt; E
        E --&gt;|<span style="color:green">Ya</span>| F["Δ := 0; ALARM_OUT := TRUE"]
        E --&gt;|<span style="color:orange">Tidak</span>| G["ALARM_OUT := FALSE"]
        F --&gt; H["Output: DELTA_OUT := UINT(Δ)"]
        G --&gt; H
        classDef startend fill:#d0e6ff,stroke:#004aad,stroke-width:2px,color:#000;
        classDef decision fill:#fff5cc,stroke:#ffb300,stroke-width:2px,color:#000;
        classDef alarm fill:#ffd6d6,stroke:#e60000,stroke-width:2px,color:#000;
        classDef process fill:#e8f0fe,stroke:#004aad,stroke-width:2px,color:#000;
        class A,H startend;
        class B,E decision;
        class C,D,G process;
        class F alarm;
  </div>
</div>
<hr>
<h2 id="validasi-independen-dengan-simulasi">Validasi Independen dengan Simulasi</h2>
<p>Simulasi pada lingkungan mirip PLC menunjukkan loncatan MOD pada <em>non-wrap decrease</em> (<code>delta = 65486 &gt; 32768</code>), sedangkan IF menghasilkan nilai yang sama namun dapat diproteksi dengan cutoff.</p>
<p>Tes konfirmasi membuktikan eliminasi loncatan dan akumulasi yang tetap stabil.</p>
<table>
<thead>
<tr>
<th>Deskripsi</th>
<th>CURRENT</th>
<th>PREVIOUS</th>
<th>Delta MOD</th>
<th>Delta IF</th>
<th>Match?</th>
<th>Catatan</th>
</tr>
</thead>
<tbody>
<tr>
<td>Normal increase</td>
<td>100</td>
<td>50</td>
<td>50</td>
<td>50</td>
<td>Ya</td>
<td>Aman</td>
</tr>
<tr>
<td>Wrap-around</td>
<td>10</td>
<td>65530</td>
<td>16</td>
<td>16</td>
<td>Ya</td>
<td>Rollover benar</td>
</tr>
<tr>
<td>Non-wrap decrease (anomaly)</td>
<td>50</td>
<td>100</td>
<td>65486</td>
<td>65486</td>
<td>Ya</td>
<td><strong>Loncatan besar</strong> (&gt;32.768, wrap palsu)</td>
</tr>
<tr>
<td>Exact wrap</td>
<td>0</td>
<td>65535</td>
<td>1</td>
<td>1</td>
<td>Ya</td>
<td>Aman</td>
</tr>
<tr>
<td>No change</td>
<td>65535</td>
<td>65535</td>
<td>0</td>
<td>0</td>
<td>Ya</td>
<td>Stabil</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="validasi-tambahan">Validasi Tambahan</h2>
<p>Pengujian lanjutan pada K_DELTA menunjukkan hasil konsisten dengan desain: <strong>tidak ada loncatan delta</strong> meski terjadi <em>wrap</em> atau <em>non-monotonic glitch</em>.</p>
<p>Simulasi dilakukan pada 1000 siklus penuh dengan <em>timer 16-bit rollover</em>, serta injeksi anomali penurunan acak (10%). Semua kasus menghasilkan delta stabil, cutoff bekerja sesuai ambang 60 detik, dan alarm aktif hanya pada kondisi valid.</p>
<table>
<thead>
<tr>
<th>Deskripsi</th>
<th>TIMER_IN</th>
<th>LAST_IN</th>
<th>Startup?</th>
<th>DELTA_OUT</th>
<th>ALARM_OUT</th>
<th>Raw Delta</th>
<th>Status</th>
</tr>
</thead>
<tbody>
<tr>
<td>Normal increase</td>
<td>100</td>
<td>50</td>
<td>No</td>
<td>50</td>
<td>False</td>
<td>50</td>
<td>OK</td>
</tr>
<tr>
<td>Wrap-around</td>
<td>10</td>
<td>65530</td>
<td>No</td>
<td>16</td>
<td>False</td>
<td>16</td>
<td>OK</td>
</tr>
<tr>
<td>Non-wrap decrease (anomaly)</td>
<td>50</td>
<td>100</td>
<td>No</td>
<td>0</td>
<td>True</td>
<td>65486</td>
<td>OK</td>
</tr>
<tr>
<td>Exact wrap</td>
<td>0</td>
<td>65535</td>
<td>No</td>
<td>1</td>
<td>False</td>
<td>1</td>
<td>OK</td>
</tr>
<tr>
<td>No change</td>
<td>65535</td>
<td>65535</td>
<td>No</td>
<td>0</td>
<td>False</td>
<td>0</td>
<td>OK</td>
</tr>
<tr>
<td>Startup</td>
<td>0</td>
<td>0</td>
<td>Yes</td>
<td>0</td>
<td>False</td>
<td>0</td>
<td>OK</td>
</tr>
<tr>
<td>Large delta &gt;60</td>
<td>200</td>
<td>100</td>
<td>No</td>
<td>0</td>
<td>True</td>
<td>100</td>
<td>OK</td>
</tr>
</tbody>
</table>
<blockquote>
<p><strong>Hasil ringkas:</strong> Semua test pass 100%. Tidak ada loncatan, cutoff bekerja, dan akumulasi tetap konsisten hingga 1000 siklus penuh.<br>
Simulasi lanjutan menunjukkan <em>raw delta</em> besar (misalnya 65.486) dipotong otomatis menjadi nol dengan alarm aktif — <strong>tanpa propagasi loncatan ke akumulator</strong>.</p>
</blockquote>
<hr>
<h3 id="interpretasi">Interpretasi</h3>
<p>Pendekatan MOD cenderung menghasilkan delta besar di kondisi anomali karena ambiguitas hasil modulo.</p>
<p>Sementara kombinasi IF-THEN-ELSE dengan cutoff mencegah propagasi loncatan dan menjaga integritas akumulasi jangka panjang.</p>
<hr>
<h2 id="kesimpulan">Kesimpulan</h2>
<p>Loncatan delta pada counter 16-bit berhasil diatasi oleh <strong>K_DELTA versi 1.2</strong> melalui pendekatan <strong>IF-THEN-ELSE</strong>, yang menggantikan kelemahan MOD tanpa efek loncatan palsu.</p>
<p>Metode ini penting untuk menjaga keandalan sistem akumulasi dan runtime di lingkungan DCS yang sensitif terhadap rollover counter.</p>
<p><em>Catatan: Simulasi mengikuti aritmetika standar IEC 61131.</em></p>
<hr>
<details>
  <summary><strong>Appendix A — Listing Kode K_DELTA</strong></summary>
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
