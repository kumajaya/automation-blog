---
ghost_uuid: "b0d97689-0e46-4bb9-b16b-48232ff923b6"
title: "Roadmap Migrasi HMI dari Citect SCADA ke Rapid SCADA"
date: "2025-09-07T13:45:50.000+07:00"
slug: "roadmap-migrasi-hmi-dari-citect-scada-ke-rapid-scada"
layout: "post"
excerpt: |
  Strategi migrasi HMI yang memungkinkan monitoring remote tanpa mengganggu operasional lokal, dari read-only hingga full control.
image: "https://images.unsplash.com/photo-1653907696247-cf7ecde77d83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDE1fHxyZW1vdGUlMjBhY2Nlc3N8ZW58MHx8fHwxNzU3MjIxNDMwfDA&ixlib=rb-4.1.0&q=80&w=2000"
image_alt: ""
image_caption: "<span style=\"white-space: pre-wrap;\">Photo by </span><a href=\"https://unsplash.com/@matheusdesouzacom?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Matheus de Souza</span></a><span style=\"white-space: pre-wrap;\"> / </span><a href=\"https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Unsplash</span></a>"
author:
  - "Ketut Kumajaya"
tags:
  - "SCADA"
  - "Remote Access"
  - "Practical Engineering"
  - "Field Experience"
categories:
  - "scada"
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
url: "https://automation.samatorgroup.com/blog/roadmap-migrasi-hmi-dari-citect-scada-ke-rapid-scada/"
comment_id: "68bd058cf80c480576839b2f"
reading_time: 6
access: true
comments: false
---

{% raw %}
<h3 id="strategi-bertahap-untuk-pendekatan-remote-monitoring-mulai-dari-read-only-testing-hingga-operasional-paralel-dan-full-control">Strategi bertahap untuk pendekatan remote monitoring, mulai dari read-only, testing, hingga operasional paralel dan full control</h3>
<p><em>Ditulis oleh Ketut Kumajaya | 7 September 2025</em></p>
<h2 id="pendahuluan">Pendahuluan</h2>
<p>Tujuan migrasi ini adalah memungkinkan <strong>monitoring remote</strong> tanpa mengganggu operasional lokal. Strategi migrasi dilakukan secara bertahap: dimulai dengan read-only untuk meminimalkan risiko sebelum write/control diaktifkan. Pendekatan ini bersifat umum dan dapat diterapkan di berbagai plant.</p>
<p>Keunggulan:</p>
<ul>
<li>Monitoring remote aman.</li>
<li>Fase read-only meminimalkan risiko terhadap operasional.</li>
<li>Pengembangan paralel memungkinkan transisi bertahap.</li>
</ul>
<h3 id="ringkasan-tahapan-migrasi">Ringkasan Tahapan Migrasi</h3>
<ol>
<li><strong>Infrastruktur Jaringan</strong> – menyiapkan LAN, VPN, segmentasi, dan keamanan.</li>
<li><strong>Ekspor Tag dari Citect Studio</strong> – menghasilkan daftar tag dalam format yang kompatibel (CSV/DBF) dan re-useable.</li>
<li><strong>Rekonstruksi HMI</strong> – membangun halaman Rapid SCADA berbasis tag read-only.</li>
<li><strong>Routing &amp; Hak Akses</strong> – menetapkan role pengguna dan kontrol keamanan.</li>
<li><strong>Testing &amp; Upgrade</strong> – menguji kemampuan write/control di lab sebelum diaktifkan.</li>
<li><strong>Operasional Paralel</strong> – menjalankan Citect dan Rapid SCADA bersamaan untuk familiarisasi operator.</li>
<li><strong>Shutdown Citect</strong> – menghentikan sistem lama dan mengalihkan kontrol penuh ke Rapid SCADA.</li>
</ol>
<hr>
<h2 id="infrastruktur-jaringan">Infrastruktur Jaringan</h2>
<p><strong>Tujuan:</strong> Menyediakan jaringan internal dan remote yang stabil, aman, dan independen dari pihak lain.</p>
<p><strong>Langkah-langkah:</strong></p>
<ul>
<li>Bangun LAN internal yang stabil.</li>
<li>Menyediakan VPN atau VLAN untuk remote monitoring.</li>
<li>Segmentasi jaringan untuk memisahkan operator lokal dan remote access.</li>
<li>Verifikasi keamanan, redundansi, dan stabilitas jaringan.</li>
</ul>
<p><strong>Output:</strong> Jaringan LAN &amp; VPN stabil, tersegmentasi, dan lolos uji keamanan.</p>
<p><strong>Subflow Aktivitas:</strong></p>
<figure style="display:flex; flex-direction:column; align-items:center;">
  <pre class="mermaid">---
config:
  look: handDrawn
  theme: neutral
---
flowchart TD
    A1[Perencanaan Jaringan LAN] --&gt; A2[Implementasi LAN &amp; VPN]
    A2 --&gt; A3[Segmentasi &amp; Hak Akses]
    A3 --&gt; A4[Uji Keamanan &amp; Redundansi]
    classDef plan fill:#E3F2FD,stroke:#1E88E5,stroke-width:1px,color:#0D47A1;
    classDef build fill:#E8F5E9,stroke:#43A047,stroke-width:1px,color:#1B5E20;
    classDef secure fill:#FFF3E0,stroke:#FB8C00,stroke-width:1px,color:#E65100;
    classDef test fill:#F3E5F5,stroke:#8E24AA,stroke-width:1px,color:#4A148C;
    class A1 plan;
    class A2 build;
    class A3 secure;
    class A4 test;
  </pre>
  <figcaption style="font-style: italic; margin-top: 0.5em; color: #555; font-size: 0.8em;">
    Segmentasi LAN dan VPN untuk memastikan monitoring aman, stabil, dan terisolasi
  </figcaption>
</figure>
<hr>
<h2 id="ekspor-tag-dari-citect">Ekspor Tag dari Citect</h2>
<p><strong>Tujuan:</strong> Menyediakan struktur yang presisi dan daftar tag dari Citect untuk direkonstruksi di Rapid SCADA.</p>
<p><strong>Langkah-langkah:</strong></p>
<ul>
<li>Ekspor daftar tag dari <strong>Citect Studio</strong> ke format yang kompatibel (misalnya CSV/DBF) agar mudah digunakan kembali.</li>
<li>Klasifikasikan tag berdasarkan jenis: analog, digital, memory.</li>
<li>Tentukan prioritas tag untuk monitoring.</li>
<li>Lakukan backup penuh konfigurasi Citect sebelum proses rekonstruksi.</li>
<li>Gunakan <strong>OPC Server</strong> bawaan Citect hanya sebagai sumber <em>runtime data</em> (read-only) selama fase awal validasi.</li>
</ul>
<blockquote>
<p><strong>Catatan:</strong> Dengan kombinasi ekspor struktural dan validasi runtime, proses migrasi bisa dimulai tanpa mengganggu sistem lama.</p>
</blockquote>
<p><strong>Output:</strong> Daftar tag lengkap, terklasifikasi (analog, digital, memory), dan sudah di-backup.</p>
<p><strong>Subflow Aktivitas:</strong></p>
<figure style="display:flex; flex-direction:column; align-items:center;">
  <pre class="mermaid">---
config:
  look: handDrawn
  theme: neutral
---
flowchart TD
    B1[Identifikasi Tag Citect] --&gt; B2[Ekspor dari Citect Studio]
    B2 --&gt; B3[Backup Citect] --&gt; B4[Klasifikasi &amp; Prioritas]
    classDef id fill:#E3F2FD,stroke:#1E88E5,stroke-width:1px,color:#0D47A1;
    classDef export fill:#E8F5E9,stroke:#43A047,stroke-width:1px,color:#1B5E20;
    classDef backup fill:#FFF3E0,stroke:#FB8C00,stroke-width:1px,color:#E65100;
    classDef classify fill:#F3E5F5,stroke:#8E24AA,stroke-width:1px,color:#4A148C;
    class B1 id;
    class B2 export;
    class B3 backup;
    class B4 classify;
  </pre>
  <figcaption style="font-style: italic; margin-top: 0.5em; color: #555; font-size: 0.8em;">
    Ekspor tag Citect, klasifikasi awal untuk monitoring
  </figcaption>
</figure>
<hr>
<h2 id="rekonstruksi-tag-dan-halaman-di-rapid-scada">Rekonstruksi Tag dan Halaman di Rapid SCADA</h2>
<p><strong>Tujuan:</strong> Membuat halaman Rapid SCADA menyerupai layout Citect.</p>
<p><strong>Langkah-langkah:</strong></p>
<ul>
<li>Rekonstruksi tag di Rapid SCADA menggunakan OPC DA driver.</li>
<li>Buat halaman HMI awal <strong>read-only</strong> untuk validasi tampilan dan akurasi data.</li>
<li>Verifikasi data real-time terhadap Citect.</li>
</ul>
<blockquote>
<p><strong>Catatan:</strong> Fase read-only sangat penting untuk meminimalkan risiko intervensi terhadap operator.</p>
</blockquote>
<p><strong>Output:</strong> Halaman HMI awal di Rapid SCADA menampilkan data real-time sesuai dengan Citect.</p>
<p><strong>Subflow Aktivitas:</strong></p>
<figure style="display:flex; flex-direction:column; align-items:center;">
  <pre class="mermaid">---
config:
  look: handDrawn
  theme: neutral
---
flowchart TD
    C1[Rekonstruksi Tag] --&gt; C2[Buat Halaman HMI Rapid SCADA]
    C2 --&gt; C3[Uji Validasi Data &amp; Tampilan]
    classDef tag fill:#E3F2FD,stroke:#1E88E5,stroke-width:1px,color:#0D47A1;
    classDef hmi fill:#E8F5E9,stroke:#43A047,stroke-width:1px,color:#1B5E20;
    classDef validate fill:#FFF3E0,stroke:#FB8C00,stroke-width:1px,color:#E65100;
    class C1 tag;
    class C2 hmi;
    class C3 validate;
  </pre>
  <figcaption style="font-style: italic; margin-top: 0.5em; color: #555; font-size: 0.8em;">
    Replikasi layout Citect di Rapid SCADA, validasi tampilan dan data
  </figcaption>
</figure>
<hr>
<h2 id="routing-dan-hak-akses-pengguna">Routing dan Hak Akses Pengguna</h2>
<p><strong>Tujuan:</strong> Mengatur siapa yang dapat monitoring dan siapa yang dapat write.</p>
<p><strong>Langkah-langkah:</strong></p>
<ul>
<li>Konfigurasi hak akses di Rapid SCADA.</li>
<li>Buat role-based access: operator lokal, supervisor, remote monitoring.</li>
<li>Verifikasi hak akses melalui simulasi.</li>
</ul>
<blockquote>
<p><strong>Catatan:</strong> Hak akses yang jelas menghindari kesalahan kontrol dari jarak jauh.</p>
</blockquote>
<p><strong>Output:</strong> Role-based access berjalan, operator remote hanya bisa monitoring, kontrol penuh tetap di lokal.</p>
<p><strong>Subflow Aktivitas:</strong></p>
<figure style="display:flex; flex-direction:column; align-items:center;">
  <pre class="mermaid">---
config:
  look: handDrawn
  theme: neutral
---
flowchart TD
    D1[Identifikasi Role Pengguna] --&gt; D2[Konfigurasi Hak Akses]
    D2 --&gt; D3[Simulasi &amp; Verifikasi Akses]
    classDef role fill:#E1F5FE,stroke:#0288D1,stroke-width:1px,color:#01579B;
    classDef access fill:#F1F8E9,stroke:#558B2F,stroke-width:1px,color:#33691E;
    classDef verify fill:#FFF8E1,stroke:#F9A825,stroke-width:1px,color:#E65100;
    class D1 role;
    class D2 access;
    class D3 verify;
  </pre>
  <figcaption style="font-style: italic; margin-top: 0.5em; color: #555; font-size: 0.8em;">
    Role-based access untuk kontrol aman dan terpisah
  </figcaption>
</figure>
<hr>
<h2 id="testing-dan-upgrade-rapid-scada">Testing dan Upgrade Rapid SCADA</h2>
<p><strong>Tujuan:</strong> Mengubah halaman dari read-only menjadi <strong>write/control</strong> secara aman.</p>
<p><strong>Langkah-langkah:</strong></p>
<ul>
<li>Uji semua tag write di lingkungan simulasi atau lab.</li>
<li>Pastikan sekuriti tetap diterapkan (password, logging).</li>
<li>Upgrade halaman HMI sesuai kebutuhan operasional.</li>
</ul>
<blockquote>
<p><strong>Catatan:</strong> Jangan aktifkan write/control sebelum semua pengujian selesai.</p>
</blockquote>
<p><strong>Output:</strong> Semua perintah write berfungsi di lingkungan simulasi, sudah ada logging &amp; proteksi password.</p>
<p><strong>Subflow Aktivitas:</strong></p>
<figure style="display:flex; flex-direction:column; align-items:center;">
  <pre class="mermaid">---
config:
  look: handDrawn
  theme: neutral
---
flowchart TD
    E1[Simulasi Lingkungan Lab] --&gt; E2[Uji Tag Write/Control]
    E2 --&gt; E3[Terapkan Sekuriti &amp; Logging]
    E3 --&gt; E4[Upgrade Halaman HMI]
    classDef lab fill:#EDE7F6,stroke:#5E35B1,stroke-width:1px,color:#311B92;
    classDef test fill:#E3F2FD,stroke:#1565C0,stroke-width:1px,color:#0D47A1;
    classDef security fill:#FFF3E0,stroke:#FB8C00,stroke-width:1px,color:#E65100;
    classDef upgrade fill:#E8F5E9,stroke:#2E7D32,stroke-width:1px,color:#1B5E20;
    class E1 lab;
    class E2 test;
    class E3 security;
    class E4 upgrade;
  </pre>
  <figcaption style="font-style: italic; margin-top: 0.5em; color: #555; font-size: 0.8em;">
    Uji tag write dan upgrade halaman sebelum aktivasi kontrol
  </figcaption>
</figure>
<hr>
<h2 id="operasional-paralel">Operasional Paralel</h2>
<p><strong>Tujuan:</strong> Menjalankan Citect dan Rapid SCADA bersamaan untuk familiarisasi operator.</p>
<p><strong>Langkah-langkah:</strong></p>
<ul>
<li>Jalankan kedua sistem secara bersamaan.</li>
<li>Monitor performa dan keakuratan data.</li>
<li>Berikan training singkat untuk operator.</li>
</ul>
<blockquote>
<p><strong>Catatan:</strong> Fase paralel memungkinkan transisi aman sebelum shutdown Citect.</p>
</blockquote>
<p><strong>Output:</strong> Operator sudah bisa membaca data dari kedua sistem dan mulai terbiasa dengan Rapid SCADA.</p>
<p><strong>Subflow Aktivitas:</strong></p>
<figure style="display:flex; flex-direction:column; align-items:center;">
  <pre class="mermaid">---
config:
  look: handDrawn
  theme: neutral
---
flowchart TD
    F1[Operasional Citect] --&gt; F2[Operasional Rapid SCADA Paralel]
    F2 --&gt; F3[Monitoring &amp; Verifikasi Data]
    F3 --&gt; F4[Operator Familiarisasi]
    classDef citect fill:#FFEBEE,stroke:#C62828,stroke-width:1px,color:#B71C1C;
    classDef parallel fill:#E3F2FD,stroke:#1565C0,stroke-width:1px,color:#0D47A1;
    classDef monitor fill:#FFF8E1,stroke:#F9A825,stroke-width:1px,color:#E65100;
    classDef familiar fill:#F1F8E9,stroke:#2E7D32,stroke-width:1px,color:#1B5E20;
    class F1 citect;
    class F2 parallel;
    class F3 monitor;
    class F4 familiar;
  </pre>
  <figcaption style="font-style: italic; margin-top: 0.5em; color: #555; font-size: 0.8em;">
    Jalankan dua sistem untuk transisi dan pelatihan operator
  </figcaption>
</figure>
<hr>
<h2 id="shutdown-citect">Shutdown Citect</h2>
<p><strong>Tujuan:</strong> Menjadikan Rapid SCADA sebagai sistem utama.</p>
<p><strong>Langkah-langkah:</strong></p>
<ul>
<li>Pastikan semua halaman, tag, dan driver siap.</li>
<li>Shutdown Citect HMI.</li>
<li>Rapid SCADA menjadi sistem utama untuk monitoring dan control.</li>
<li>Driver langsung ke PLC dapat dikembangkan untuk menghapus ketergantungan pada Citect I/O server.</li>
</ul>
<blockquote>
<p><strong>Catatan:</strong> Pastikan backup terakhir Citect tersedia sebelum shutdown.</p>
</blockquote>
<p><strong>Output:</strong> Rapid SCADA menjadi satu-satunya sistem monitoring &amp; control, backup Citect tersedia sebagai cadangan.</p>
<p><strong>Subflow Aktivitas:</strong></p>
<figure style="display:flex; flex-direction:column; align-items:center;">
  <pre class="mermaid">---
config:
  look: handDrawn
  theme: neutral
---
flowchart TD
    G1[Verifikasi Semua Halaman &amp; Tag] --&gt; G2[Shutdown Citect HMI]
    G2 --&gt; G3[Rapid SCADA Full Monitoring &amp; Control]
    G3 --&gt; G4[Kembangkan Driver PLC Langsung]
    classDef verify fill:#E3F2FD,stroke:#1565C0,stroke-width:1px,color:#0D47A1;
    classDef shutdown fill:#FFEBEE,stroke:#C62828,stroke-width:1px,color:#B71C1C;
    classDef full fill:#E8F5E9,stroke:#2E7D32,stroke-width:1px,color:#1B5E20;
    classDef driver fill:#F3E5F5,stroke:#8E24AA,stroke-width:1px,color:#4A148C;
    class G1 verify;
    class G2 shutdown;
    class G3 full;
    class G4 driver;
  </pre>
  <figcaption style="font-style: italic; margin-top: 0.5em; color: #555; font-size: 0.8em;">
    Alihkan kontrol penuh ke Rapid SCADA, hentikan sistem lama
  </figcaption>
</figure>
<hr>
<h2 id="diagram-alur-utama-migrasi">Diagram Alur Utama Migrasi</h2>
<figure style="display:flex; flex-direction:column; align-items:center;">
  <pre class="mermaid">---
config:
  look: handDrawn
  theme: neutral
---
flowchart TD
    A[Infrastruktur Jaringan] --&gt; B[Ekspor Tag dari Citect]
    B --&gt; C[Rapid SCADA Read-Only]
    C --&gt; D[Rekonstruksi Halaman HMI]
    D --&gt; E[Routing &amp; Hak Akses]
    E --&gt; F["Testing &amp; Upgrade Rapid SCADA (Read/Write)"]
    F --&gt; G[Operasional Paralel]
    G --&gt; H[Shutdown Citect]
    H --&gt; I[Rapid SCADA Full Monitoring &amp; Control]
    %% Definisi gaya untuk tiap fase
    classDef infra fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#0d47a1;
    classDef prepare fill:#f1f8e9,stroke:#2e7d32,stroke-width:2px,color:#1b5e20;
    classDef build fill:#fff3e0,stroke:#ef6c00,stroke-width:2px,color:#e65100;
    classDef run fill:#ede7f6,stroke:#4527a0,stroke-width:2px,color:#311b92;
    classDef final fill:#fce4ec,stroke:#ad1457,stroke-width:2px,color:#880e4f;
    %% Pemetaan node ke fase
    class A infra;
    class B,C prepare;
    class D,E build;
    class F,G run;
    class H,I final;
  </pre>
  <figcaption style="font-style: italic; margin-top: 0.5em; color: #555; font-size: 0.8em;">
    Migrasi bertahap dari read-only ke full control, memastikan transisi aman
  </figcaption>
</figure>
<hr>
<h2 id="kesimpulan">Kesimpulan</h2>
<ul>
<li>Pendekatan bertahap meminimalkan risiko dan memastikan stabilitas.</li>
<li>Fase read-only → testing → write/control → operasional paralel → full migration.</li>
<li>Remote monitoring dapat dilakukan tanpa mengganggu operasional lokal.</li>
<li>Pendekatan ini dapat diterapkan secara umum, tidak tergantung plant tertentu.</li>
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

{% endraw %}