---
ghost_uuid: "8f4b5816-f49e-40e1-994a-4f5e00539cb0"
title: "Mengatasi Anomali Penamaan Struct di Supcon JX-300: Analisis dan Solusi Praktis"
date: "2025-11-07T08:45:48.000+07:00"
slug: "mengatasi-anomali-penamaan-struct-di-supcon-jx-300-analisis-dan-solusi-praktis"
layout: "post"
excerpt: |
  Anomali menarik pada Supcon JX-300: kompiler Structured Text salah menafsirkan field struct seperti V1..V16 sebagai array. Artikel ini menjelaskan penyebab teknisnya, solusi aman menggunakan Val1..Val16, dan insight ringan tentang cara berpikir legacy compiler di sistem kontrol industri.
image: "https://images.unsplash.com/photo-1511954766786-1f88f53fb528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDN8fGJ1Z3xlbnwwfHx8fDE3NjI0NzkwMDN8MA&ixlib=rb-4.1.0&q=80&w=2000"
image_alt: ""
image_caption: "<span style=\"white-space: pre-wrap;\">Photo by </span><a href=\"https://unsplash.com/@ziemer?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Paulo Ziemer</span></a><span style=\"white-space: pre-wrap;\"> / </span><a href=\"https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Unsplash</span></a>"
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
url: "https://automation.samatorgroup.com/blog/mengatasi-anomali-penamaan-struct-di-supcon-jx-300-analisis-dan-solusi-praktis/"
comment_id: "690d4b3428ca3e0592722a4e"
reading_time: 3
access: true
comments: false
---

{% raw %}
<p>Dalam pengembangan sistem otomasi industri, khususnya pada platform <strong>Supcon JX-300</strong>, konsistensi dan keandalan kompilasi kode merupakan fondasi utama untuk memastikan operasional yang stabil. Sebagai bagian dari upaya meningkatkan efisiensi dalam pengembangan function block (FB), saya telah mengidentifikasi sebuah anomali kecil namun signifikan terkait penamaan field struktur data (<code>struct</code>). Temuan ini berasal dari pengembangan FB <strong>K_SOE16</strong> untuk logika Sequence of Event (SOE), yang memerlukan struktur data multipel kanal untuk timestamp dan indeks.</p>
<p>Artikel ini menyajikan analisis teknis, dampak potensial, serta solusi praktis yang telah diverifikasi, dengan tujuan mendukung praktik pengembangan yang lebih berkelanjutan—di mana waktu pengembangan yang efisien berkontribusi pada pengurangan sumber daya komputasi dan mendukung inisiatif green engineering di sektor otomasi.</p>
<h4 id="analisis-teknis-konflik-parser-pada-pola-penamaan-field">Analisis Teknis: Konflik Parser pada Pola Penamaan Field</h4>
<p>Platform Supcon JX-300, yang dibangun di atas fondasi IEC 61131-3 dengan ekstensi proprietary, menggunakan parser Structured Text (ST) yang mewarisi elemen dari sistem ECS-3000 generasi sebelumnya. Parser ini memiliki prioritas lexical yang menyebabkan interpretasi pola nama field <strong>huruf diikuti angka langsung</strong> (misalnya, <code>V1</code>, <code>V2</code>, hingga <code>V16</code>) sebagai akses array subscript, bukan sebagai field struktur.</p>
<ul>
<li><strong>Mekanisme Konflik</strong>:
<ul>
<li>Saat kode mengakses <code>TsIn.V1</code>, parser menafsirkannya sebagai <code>(TsIn.V)[1]</code>—sebuah akses array <code>V</code> pada indeks 1.</li>
<li>Akses ini berfungsi normal hingga <code>V15</code> (indeks 15), tetapi gagal pada <code>V16</code> (indeks 16, yang dianggap out-of-bound untuk array hipotetis).</li>
<li>Akibatnya, kompiler menghasilkan error "Invalid access" atau "Out of bound" tanpa penjelasan rinci.</li>
</ul>
</li>
</ul>
<p>Fenomena ini muncul karena legacy rule di lexical analyzer, di mana pola <code>identifier[digit]</code> diprioritaskan sebagai array access untuk kompatibilitas dengan kode lama. Hal ini umum di compiler DCS berbasis PLC, di mana transisi dari bahasa discrete (seperti Ladder) ke ST membawa beban parser historis.</p>
<p><strong>Contoh Kode yang Bermasalah</strong>:</p>
<pre><code class="language-pascal">TYPE struct16ULONG :
STRUCT
    V1 : ULONG; -- Diinterpretasikan sebagai array V[1]
    V2 : ULONG; -- OK hingga V15
    ...
    V16 : ULONG; -- Fail pada V16
END_STRUCT
END_TYPE

-- Di FB:
TsInt[0] := TsIn.V1; -- OK
TsInt[15] := TsIn.V16; -- Fail
</code></pre>
<h4 id="dampak-pada-pengembangan-fb-dan-operasional">Dampak pada Pengembangan FB dan Operasional</h4>
<p>Anomali ini dapat memperlambat siklus pengembangan di FB kompleks seperti SOE, di mana mapping loop CASE untuk 16 kanal menjadi tulang punggung. Dampak operasional termasuk:</p>
<ul>
<li><strong>Keterlambatan Deployment</strong>: Compile gagal di tahap akhir, memaksa debug manual.</li>
<li><strong>Risiko Kesalahan Mapping</strong>: Field salah interpretasi bisa menyebabkan data kanal terbalik di HMI atau report, memengaruhi analisis post-event (e.g., kronologi trip salah urutan).</li>
<li><strong>Aspek Sustainability</strong>: Waktu debug tambahan berkontribusi pada konsumsi energi komputasi lebih tinggi, bertentangan dengan prinsip green automation yang menekankan efisiensi proses dan pengurangan waste sumber daya.</li>
</ul>
<p>Dalam konteks industri, di mana SOE mendukung kepatuhan safety (e.g. IEC 61511), konsistensi kompilasi seperti ini krusial untuk menjaga integritas sistem.</p>
<h4 id="solusi-dan-rekomendasi-implementasi">Solusi dan Rekomendasi Implementasi</h4>
<p>Solusi utama adalah mengubah pola penamaan field menjadi <strong>prefix deskriptif + angka</strong>, seperti <code>Val1, Val2, ..., Val16</code>. Prefix "Val" (atau "TsVal" untuk timestamp) memecah pola huruf-digit murni, sehingga parser mengenalinya sebagai identifier field biasa.</p>
<p><strong>Implementasi di UDT</strong>:</p>
<pre><code class="language-pascal">TYPE struct16ULONG :
STRUCT
    Val1 : ULONG;
    Val2 : ULONG;
    ...
    Val16 : ULONG;
END_STRUCT
END_TYPE
</code></pre>
<p><strong>Di FB Mapping Loop</strong>:</p>
<pre><code class="language-pascal">FOR i := 0 TO 15 DO
    CASE i OF
        0: TsInt[i] := TsIn.Val1;
        1: TsInt[i] := TsIn.Val2;
        ...
        15: TsInt[i] := TsIn.Val16;
    END_CASE;
END_FOR;
</code></pre>
<p><strong>Rekomendasi Tambahan</strong>:</p>
<ol>
<li><strong>Standarisasi di Library</strong>: Adopsi pola <code>ValN</code> secara konsisten untuk semua struct numerik (ULONG, UINT, INT) di library FB. Ini mengurangi variasi dan risiko error.</li>
<li><strong>Alternatif Pola</strong>:
<ul>
<li>Underscore: <code>Ts_1, Ts_2</code> (pendek, aman dari subscript misread).</li>
<li>Deskriptif: <code>TimestampCh1, TimestampCh2</code> (untuk readability tinggi di tim besar).</li>
</ul>
</li>
<li><strong>Verifikasi</strong>: Selalu test di FB dummy dengan compile full project—periksa log parser untuk "lexical conflict".</li>
<li><strong>Sustainability Angle</strong>: Pola ini tidak hanya fix teknis, tapi juga dukung sustainable development dengan mengurangi waktu debug (hemat energi server per iterasi).</li>
</ol>
<h4 id="kesimpulan">Kesimpulan</h4>
<p>Anomali penamaan field di Supcon JX-300 adalah karakteristik parser legacy yang mewarisi prioritas array access dari ECS-3000, tapi mudah diatasi dengan pola nama yang tepat. Dengan implementasi <code>Val1..ValN</code>, FB seperti K_SOE16 bisa dikembangkan lebih cepat dan andal, mendukung operasional yang lebih efisien dan berkelanjutan—di mana setiap detik hemat debug berarti pengurangan jejak karbon dari server idle.</p>
<p>Apakah Anda pernah mengalami isu serupa di platform DCS lain?</p>
<blockquote>
<p><em>Ingat, di dunia DCS dan otomasi: Kalau sesuatu berperilaku aneh tapi konsisten... ya, itu bukan bug—itu fitur. 😏</em></p>
</blockquote>
<p><em>Referensi: Supcon JX-300 Programming Guide, IEC 61131-3 ST Syntax Reference.</em></p>

{% endraw %}