---
ghost_uuid: "7224ade4-654d-4000-b306-e516250aaaf7"
title: "Arsitektur Edge-to-Server untuk Integrasi Data Industri"
date: "2025-10-07T12:08:20.000+07:00"
slug: "arsitektur-edge-to-server-untuk-integrasi-data-industri"
layout: "post"
excerpt: |
  Dengan perangkat sederhana dan software open source, sistem ini menghadirkan integrasi data industri yang aman, efisien, dan berkelanjutan.
image: "https://images.unsplash.com/photo-1639117474926-9e22670f6bf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDE2fHx0cmVuZHxlbnwwfHx8fDE3NTk3MDU1ODB8MA&ixlib=rb-4.1.0&q=80&w=2000"
image_alt: ""
image_caption: "<span style=\"white-space: pre-wrap;\">Photo by </span><a href=\"https://unsplash.com/@ayadighaith?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Ayadi Ghaith</span></a><span style=\"white-space: pre-wrap;\"> / </span><a href=\"https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Unsplash</span></a>"
author:
  - "Ketut Kumajaya"
tags:
  - "Edge Computing"
  - "Distributed Control System"
  - "Field Experience"
  - "Practical Engineering"
categories:
  - "edge-computing"
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
url: "https://automation.samatorgroup.com/blog/arsitektur-edge-to-server-untuk-integrasi-data-industri/"
comment_id: "68e32bff66a8d70580909f7a"
reading_time: 4
access: true
comments: false
---

{% raw %}
<p><em>Ditulis oleh Ketut Kumajaya | 6 Oktober 2025</em></p>
<h3 id="latar-belakang">Latar Belakang</h3>
<p>Dalam dunia otomasi industri, data proses bukan sekadar angka di layar; ia adalah dasar pengambilan keputusan bisnis.<br>
Dari pengalaman bertahun-tahun di lantai kontrol, beberapa masalah klasik sering muncul:</p>
<ul>
<li>Data DCS sulit diakses di luar jaringan unit produksi, atau hilang saat jaringan terganggu.</li>
<li>ERP membutuhkan data untuk analisis dan pelaporan, tapi tidak selalu membutuhkan data real-time.</li>
<li>Banyak sistem modern menerapkan push architecture, namun dalam praktik lapangan sering menghadapi tantangan saat jaringan putus atau SCADA restart.</li>
</ul>
<p>Solusi yang lebih tahan banting adalah mencatat data proses secara lokal di lapangan, menyimpannya dengan aman, lalu menariknya ke server hanya ketika diperlukan. Dengan cara ini, risiko kehilangan data berkurang drastis dan sistem tetap resilient.</p>
<h3 id="filosofi-pull-vs-push">Filosofi Pull vs Push</h3>
<blockquote>
<p>Dari pengalaman lapangan, push architecture sering menjadi rumit.<br>
Saat jaringan putus, data stagnan tanpa disadari. Restart SCADA bisa memutus aliran.<br>
Pull architecture lebih stabil: data dicatat lokal, server hanya menarik sesuai interval.<br>
Resilience lebih penting daripada kecepatan dalam operasi nyata. Kecepatan bisa ditunda, integritas tidak bisa ditawar.</p>
</blockquote>
<p>Dalam satu kasus nyata, jaringan antar-plant terputus selama 6 jam. Pada sistem push, histori hilang permanen. Pada sistem pull, edge tetap mencatat penuh. Begitu koneksi pulih, server menarik backlog, dan ERP tetap menerima histori lengkap tanpa celah.</p>
<hr>
<h3 id="arsitektur-sistem">Arsitektur Sistem</h3>
<p>Sistem ini dibagi menjadi dua lapisan utama: <strong>edge</strong> dan <strong>server</strong>.</p>
<p><strong>Edge computer</strong> ditempatkan di perbatasan antara dunia proses dan digital, seperti Raspberry Pi 4B dalam casing industrial Advantech UNO220, menjalankan Ubuntu Server headless. Perannya bukan sekadar gateway, melainkan <strong>pencatat data independen, pengolah awal, dan penghubung aman</strong> ke server pusat. Edge menyimpan buffer data beberapa bulan, sehingga meski jaringan terputus, histori tetap utuh.</p>
<p><strong>Server</strong> berjalan di VM Ubuntu Server yang juga headless. Ia bertindak sebagai <strong>relay dan integrator</strong>, menerima permintaan dari ERP atau Node‑RED, lalu meneruskannya ke edge sesuai lokasi. Server tidak perlu tahu detail teknis tiap edge, cukup berbicara dengan format JSON seragam dari proxy.</p>
<hr>
<h4 id="diagram-alur-sistem">Diagram Alur Sistem</h4>
<p>Diagram berikut memperlihatkan alur komunikasi:</p>
<ul>
<li><strong>DCS → Modbus RTU → Modbus TCP/RTU Gateway</strong>: data proses mentah keluar dari sistem kontrol.</li>
<li><strong>Rapid SCADA</strong> di edge mencatat data sebagai historian.</li>
<li><strong>Node‑RED</strong> di edge mengirim laporan otomatis atau status OS.</li>
<li><strong>Proxy Layer</strong> menjamin format JSON konsisten, menambahkan autentikasi dan flag audit.</li>
<li><strong>Server Node‑RED</strong> menerima permintaan dari ERP, lalu meneruskan ke proxy di edge.</li>
<li><strong>Grafana</strong> mengambil data dari proxy untuk visualisasi.</li>
<li><strong>Chat Server</strong> menerima laporan mandiri dari edge.</li>
</ul>
<div style="display: flex; flex-direction: column; align-items: center;">
    <div class="mermaid" style="width:100%; max-width:none; font-size:14px;">
    flowchart LR
     subgraph DCS_Side["Process"]
            DCS["DCS"]
      end
     subgraph Edge["    Edge Computer"]
            MB("Modbus RTU")
            MBD["Modbus TCP ↔ RTU"]
            RS["Rapid SCADA"]
            NR["Node-RED"]
            PL["Proxy Layer"]
      end
     subgraph Server["Server"]
            SNR["Node-RED"]
            SG["Grafana"]
            ERP["ERP System"]
            CHAT["Chat Server"]
      end
        MB --&gt; MBD
        MBD --&gt; RS
        NR --&gt; PL &amp; CHAT
        ERP --&gt; SNR
        SNR --&gt; PL
        PL --&gt; RS
        SG --&gt; PL
        DCS --&gt; MB
          DCS:::Ash
          MB:::Peach
          MBD:::Peach
          RS:::Peach
          NR:::Peach
          PL:::Peach
          SNR:::Sky
          SG:::Sky
          ERP:::Sky
          CHAT:::Sky
        classDef Rose stroke-width:2px, stroke-dasharray:none, stroke:#FF5978, fill:#FFDFE5, color:#8E2236
        classDef Peach stroke-width:2px, stroke-dasharray:none, stroke:#FBB35A, fill:#FFEFDB, color:#8F632D
        classDef Sky stroke-width:2px, stroke-dasharray:none, stroke:#374D7C, fill:#E2EBFF, color:#374D7C
        classDef Pine stroke-width:2px, stroke-dasharray:none, stroke:#254336, fill:#27654A, color:#FFFFFF
        classDef Ash stroke-width:2px, stroke-dasharray:none, stroke:#999999, fill:#EEEEEE, color:#000000
        style Server fill:transparent
        style Edge fill:transparent
        style DCS_Side fill:transparent
    </div>
</div>
<hr>
<h3 id="edge-layer">Edge Layer</h3>
<p>Edge computer berfungsi sebagai pencatat data independen, pengolah awal, sekaligus penghubung aman antara DCS dan server pusat. Untuk itu, beberapa layanan utama dijalankan secara paralel:</p>
<ul>
<li><strong>Rapid SCADA</strong> → mencatat data dari DCS sebagai historian.</li>
<li><strong>Node-RED</strong> → membuat auto report, memantau status OS, dan melakukan pengolahan sederhana sebelum data dikirim ke server.</li>
<li><strong>mbusbd</strong> → adapter yang memungkinkan Modbus RTU diakses bersama Rapid SCADA dan Node-RED tanpa konflik port.</li>
</ul>
<blockquote>
<p><strong>Advantech UNO220</strong> adalah casing standar industri yang dapat melengkapi Raspberry Pi 4B. Casing ini sudah termasuk pendingin pasif (<em>fanless cooling</em>), RTC Epson RX‑8010SJ‑B, TI TCA9554 I/O expander, Infineon OPTIGA™ TPM SLB9670 security chip, port serial RS‑232/RS‑485, dan dukungan Power over Ethernet (PoE).</p>
<p>Dukungan hardware tersebut sangat memadai, <strong>namun tetap membutuhkan konfigurasi software yang benar</strong> agar sistem berjalan stabil dan aman.<br>
Seluruh dukungan software tersedia di repositori penulis untuk memastikan integrasi berjalan mulus.</p>
</blockquote>
<h4 id="catatan-tentang-modbus-rtu">Catatan tentang Modbus RTU</h4>
<p>Meski sederhana, Modbus RTU berbasis RS‑485 justru memberi lapisan keamanan tambahan: tidak terekspos ke TCP/IP, stabil dengan pola master‑slave deterministik, dan mudah diaudit. Dengan gateway TCP/RTU di edge, DCS tetap terlindungi di domain serial, sementara server pusat tetap menerima data dalam format modern yang konsisten.</p>
<hr>
<h3 id="proxy-layer">Proxy Layer</h3>
<p>Proxy layer open source di edge:</p>
<ul>
<li>Menyediakan format JSON konsisten untuk server.</li>
<li>Menangani autentikasi: Rapid SCADA 5 (Basic Auth) vs Rapid SCADA 6 (session cookie).</li>
<li>Menambah keamanan: log akses, kontrol autentikasi, monitoring.</li>
</ul>
<blockquote>
<p>Server dan aplikasi lain (Node-RED, Grafana) dapat mengakses data tanpa mengetahui versi SCADA atau detail teknis edge.<br>
Open source, bebas lisensi, dan dapat disesuaikan sesuai kebutuhan — hasil development mandiri yang bisa terus dievolusi.</p>
</blockquote>
<hr>
<h3 id="server">Server</h3>
<p>Server berperan sebagai <strong>relay data dan integrator</strong>:</p>
<ul>
<li>ERP system mengirim REST → server meneruskan ke edge → hasil dikembalikan.</li>
<li>Node-RED dan Grafana mengambil data dengan cara seragam.</li>
<li>Chat server internal memungkinkan edge mengirim laporan performa atau status OS secara mandiri.</li>
</ul>
<p>ERP tidak butuh data real-time; cukup data 48 jam terakhir. Retry panggilan ERP diatur tim ERP — server tetap ringan dan fokus relay. Dengan pola ini, satu server bisa melayani puluhan edge tanpa bottleneck.</p>
<hr>
<h3 id="nilai-ekonomis">Nilai Ekonomis</h3>
<ul>
<li>Edge murah tapi cukup kuat: Raspberry Pi industrial, PC Windows, atau perangkat lain yang mendukung Modbus RTU.</li>
<li>Server dapat melayani banyak lokasi.</li>
<li>Pencatatan lokal mengurangi risiko downtime.</li>
<li>Open source → tanpa biaya lisensi.</li>
<li>Skalabilitas sederhana: menambah unit baru cukup edge minimal, atau komputer Windows yang ada + USB RS-485 converter → OS-independent.</li>
</ul>
<table>
<thead>
<tr>
<th>Komponen</th>
<th>Biaya</th>
<th>Fungsi Utama</th>
<th>Lisensi</th>
</tr>
</thead>
<tbody>
<tr>
<td>Edge (RPi)</td>
<td>Rendah</td>
<td>Pencatat &amp; gateway</td>
<td>Open source</td>
</tr>
<tr>
<td>Server (VM)</td>
<td>Sedang</td>
<td>Relay &amp; integrator</td>
<td>Open source</td>
</tr>
<tr>
<td>Proxy Layer</td>
<td>Nol</td>
<td>Format JSON &amp; keamanan</td>
<td>Open source</td>
</tr>
<tr>
<td>Rapid SCADA</td>
<td>Nol</td>
<td>Historian &amp; visualisasi</td>
<td>Open source</td>
</tr>
<tr>
<td>Node‑RED</td>
<td>Nol</td>
<td>Automasi &amp; REST handler</td>
<td>Open source</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Meski murah, sistem ini tidak murahan: dibangun dari pengalaman integrasi teruji.<br>
Vendor DCS dapat menawarkan solusi, dengan tantangan menghadirkan integrasi yang lebih luas, fleksibel, dan berjalan paralel dengan sistem yang sudah ada. Dengan begitu, ekosistem industri dapat tumbuh semakin terbuka, kolaboratif, dan berkelanjutan.</p>
</blockquote>
<hr>
<h3 id="penutup">Penutup</h3>
<p>Arsitektur ini lahir dari pengalaman lapangan sebagai system integrator yang ditempa oleh praktik nyata, bukan teori kelas. Setiap komponen — Rapid SCADA, Node-RED, ZeroTier, proxy layer — disatukan agar stabil, aman, dan saling memahami.</p>
<p>Sistem cukup sederhana untuk dipahami, tangguh, fleksibel, dan profesional.<br>
Setiap unit produksi mandiri, fleksibel dari sisi perangkat keras dan OS, tetap menjadi bagian dari ekosistem data aman yang efisien.</p>

{% endraw %}