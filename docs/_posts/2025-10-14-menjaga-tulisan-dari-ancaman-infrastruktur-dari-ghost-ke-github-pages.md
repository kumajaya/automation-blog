---
ghost_uuid: "448c2273-4869-45b5-b426-e5ea7276bfda"
title: "Menjaga Tulisan dari Ancaman Infrastruktur: Dari Ghost ke GitHub Pages"
date: "2025-10-14T18:36:06.000+07:00"
slug: "menjaga-tulisan-dari-ancaman-infrastruktur-dari-ghost-ke-github-pages"
layout: "post"
excerpt: |
  Dari Ghost ke GitHub, dari tulisan menjadi arsip pengetahuan. Sebuah perjalanan mencari cara agar dokumentasi teknis bertahan melampaui umur server dan penulisnya.
image: "https://images.unsplash.com/photo-1647696945040-56de84f73f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDF8fGJvb2tzaGVsZiUyMGtub3dsZWRnZXxlbnwwfHx8fDE3NjA0MjE5Nzd8MA&ixlib=rb-4.1.0&q=80&w=2000"
image_alt: ""
image_caption: "<span style=\"white-space: pre-wrap;\">Photo by </span><a href=\"https://unsplash.com/@gabigi?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Gabriela</span></a><span style=\"white-space: pre-wrap;\"> / </span><a href=\"https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Unsplash</span></a>"
author:
  - "Ketut Kumajaya"
tags:
  - "Practical Engineering"
  - "Team Collaboration"
  - "Open Source"
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
url: "https://automation.samatorgroup.com/blog/menjaga-tulisan-dari-ancaman-infrastruktur-dari-ghost-ke-github-pages/"
comment_id: "68eddfca510754064d2ff9c3"
reading_time: 3
access: true
comments: false
---

<p><em>Ditulis oleh Ketut Kumajaya | 14 Oktober 2025</em></p>
<h3 id="pendahuluan">Pendahuluan</h3>
<p>Menulis blog itu sederhana. Tapi di balik kesederhanaannya, selalu ada satu kekhawatiran: bagaimana kalau <em>backbone</em> infrastruktur yang kita pakai tidak cukup kuat—dan suatu hari semua tulisan itu hilang begitu saja?</p>
<p>Saya masih punya akun WordPress lama. Masih aman, masih bisa diakses, tapi mulai terasa tidak nyaman karena gangguan iklan. Setelah itu, saya beralih ke blog pribadi dengan server berbayar yang saya kelola sendiri. Namun muncul kekhawatiran baru: bagaimana kalau suatu saat saya tidak lagi mampu membayar biaya server? Maka seluruh tulisan bisa hilang begitu saja.</p>
<p>Sekarang saya menulis di beberapa tempat—di blog pribadi, dan juga di blog dengan infrastruktur server yang disediakan tim IT korporasi. Tapi kekhawatiran itu tetap ada: bahwa suatu saat tulisan-tulisan itu bisa lenyap.</p>
<h4 id="pengetahuan-yang-hilang-usaha-yang-terulang">Pengetahuan yang Hilang, Usaha yang Terulang</h4>
<p>Jika itu terjadi, sekecil apa pun pengetahuan yang sudah terdokumentasi, tidak bisa lagi diwariskan. Orang lain akan mengulang usaha besar untuk hal yang sebenarnya sudah pernah terselesaikan.</p>
<p>Bagi saya, menulis bukan sekadar menyimpan kode atau konfigurasi, tetapi juga menyertakan narasi yang menjelaskan konteksnya. Program DCS, misalnya, akan jauh lebih mudah dipahami jika ada cerita di balik logikanya—kenapa dibuat seperti itu, dan bagaimana proses berpikirnya.</p>
<h4 id="mencari-jalan-agar-pengetahuan-tetap-hidup">Mencari Jalan agar Pengetahuan Tetap Hidup</h4>
<p>Dari kekhawatiran bahwa pengetahuan bisa hilang, saya mulai mencari pendekatan lain: menulis tetap di platform yang nyaman, di server mana pun, tetapi hasilnya disinkronkan ke layanan yang umurnya mungkin akan lebih panjang dari saya sendiri.</p>
<p>Saya tidak ingin generasi berikutnya masih harus belajar dari nol tentang <em>basic cryogenic</em>, <em>orifice flowmeter rescaling</em>, atau <em>performance curve analysis</em>, padahal semua itu sudah pernah kita lewati.</p>
<p>Karena itu, saya mulai melihat dokumentasi bukan hanya sebagai catatan kerja, tapi sebagai warisan yang harus dijaga keberlanjutannya.</p>
<hr>
<h3 id="github-tempat-menyimpan-warisan">GitHub: Tempat Menyimpan Warisan</h3>
<p>Sebagai pengguna GitHub sejak lama, banyak kode saya masih aman di sana—meskipun sempat muncul berbagai spekulasi setelah GitHub diakuisisi oleh Microsoft. Namun sejauh pengamatan saya, Microsoft bukan ancaman bagi proyek <em>open source</em>; justru kontribusinya semakin besar. Banyak aplikasi Microsoft kini bersifat <em>open source</em> dan berjalan lintas platform—baik di Windows maupun Linux (misalnya: VS Code atau .NET).</p>
<p>Kekuatan GitHub bukan hanya pada kemampuannya menyimpan kode, tetapi pada sistem <em>version control</em> di baliknya—<em>git</em>, ciptaan Linus Torvalds, sang pembuat Linux. Di mana pun saya menulis dokumen, pada dasarnya saya bisa menyinkronkannya ke GitHub secara otomatis. Setiap perubahan tercatat, setiap versi tersimpan.</p>
<p>Rasanya seperti memiliki <strong>arsip evolusi pengetahuan</strong> yang tidak akan pernah hilang.</p>
<hr>
<h3 id="praktiknya-blog-dan-mirroring">Praktiknya: Blog dan Mirroring</h3>
<p>Sekarang, ringkasannya seperti ini:</p>
<ul>
<li>Hal-hal umum dan tidak terlalu spesifik saya tulis di <a href="https://automation.samatorgroup.com/blog/" target="_blank">automation.samatorgroup.com/blog</a>.</li>
<li>Isinya saya <em>mirror</em> ke <a href="https://kumajaya.github.io/automation-blog/?ref=automation.samatorgroup.com" target="_blank">kumajaya.github.io/automation-blog</a> agar terjamin bisa diwariskan bahkan setelah saya tidak ada.</li>
</ul>
<p>Sinkronisasi diperiksa setiap hari secara otomatis oleh GitHub: jika ada perbedaan, sistem akan melakukan regenerasi konten. Dengan begitu, saya tetap bisa menulis di platform yang nyaman seperti Ghost, tetapi yakin bahwa hasilnya aman karena di-<em>mirror</em> setiap waktu. Otomasi terpenuhi—inovasi juga berjalan.</p>
<p>Saya selalu merasa <em>automation</em> itu lebih mudah diwujudkan karena hasilnya nyata, bisa diukur. Namun <em>innovation</em> sering kali lebih rumit—karena bagi saya, inovasi tidak harus selalu berbentuk alat atau sistem baru; kadang cukup dengan cara berpikir atau cara bekerja yang berubah.</p>
<p>Walau begitu, saya harus akui—tambahan kata <em>innovation</em> di nama departemen saya memang membawa beban tersendiri.</p>
<p>Semua teknik yang saya gunakan bersifat <em>open source</em>, dan bisa digunakan ulang siapa pun yang ingin melakukan hal serupa—karena pada akhirnya, pengetahuan baru akan benar-benar hidup jika bisa diwariskan dan digunakan kembali.</p>
<figure style="display: flex; flex-direction: column; align-items: center; margin: 20px 0;">
  <div class="mermaid" style="width:85%; max-width:800px; font-size:16px;">
    %%{init: {'themeVariables': { 'fontSize': '14px', 'primaryColor': '#e8f0fe', 'edgeLabelBackground':'#fff'}}}%%
    flowchart TB
        A["Ghost Blog<br>(automation.samatorgroup.com/blog)"]
        B["GitHub Pages<br>(kumajaya.github.io/automation-blog)"]
        A --&gt; E["Dokumentasi Internal<br>(Server Korporasi)"]
        E --&gt;|"Mirror otomatis"| B
        F["Cron Job &amp;<br>GitHub Action"] --&gt;|"Periksa &amp;<br>Regenerasi Harian"| B
        B --&gt; C["Pembaca Masa Depan"]
        A --&gt; D["Pembaca Masa Kini"]
        %% Definisi kelas
        classDef source fill:#1f77b4,stroke:#0d3d66,stroke-width:2px,color:#fff;
        classDef repo fill:#2ca02c,stroke:#145214,stroke-width:2px,color:#fff;
        classDef consumer fill:#ff7f0e,stroke:#a34b00,stroke-width:2px,color:#fff;
        classDef process fill:#9467bd,stroke:#4b2c6f,stroke-width:2px,color:#fff;
        %% Pemetaan node ke kelas
        class A source;
        class E source;
        class B repo;
        class C consumer;
        class D consumer;
        class F process;
  </div>
  <figcaption style="text-align:center; font-size:13px; color:#555;">
    Dari Ghost ke GitHub: Menjaga Pengetahuan Tetap Hidup
  </figcaption>
</figure>
<hr>
<h3 id="penutup-dokumentasi-sebagai-kolaborasi">Penutup: Dokumentasi sebagai Kolaborasi</h3>
<p>GitHub sebenarnya juga menyediakan layanan komersial. Jika para pengambil keputusan memahami potensi <em>git</em>, pendekatan ini sangat relevan untuk dokumentasi dengan <em>versioning control</em> yang ketat. Kita bisa bekerja bersama, mengembangkan ide yang sama, sambil tetap tahu siapa mengubah apa, kapan, dan kenapa.</p>
<p>Kode saya terbuka, bisa digunakan siapa saja, tanpa batasan. Namun, tentu saja tidak semua hal bisa dibuka—misalnya <em>API_KEY</em> blog pribadi, yang hanya saya miliki. Ghost tidak akan memberikan izin akses tanpa otorisasi, dan memang seharusnya begitu.</p>
<p>Karena pada akhirnya, sebagian pengetahuan memang harus dibuka agar bisa diwariskan, sementara sebagian yang lain tetap dijaga sebagai bentuk tanggung jawab.</p>
<p>Penasaran? Silakan kunjungi repo mirroring saya di <a href="https://github.com/kumajaya/automation-blog/tree/main?ref=automation.samatorgroup.com" target="_blank">GitHub</a>—mungkin Anda bisa fork, tambah kontribusi, atau adaptasi untuk proyek sendiri. Mari jaga warisan ini bersama!</p>
