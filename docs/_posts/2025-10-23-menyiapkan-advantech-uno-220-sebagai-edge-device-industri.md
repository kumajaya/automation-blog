---
ghost_uuid: "ba5db4f9-d452-47fd-89e2-6d23e5ee0ab0"
title: "Menyiapkan Advantech UNO-220 sebagai Edge Device Industri"
date: "2025-10-23T00:31:39.000+07:00"
slug: "menyiapkan-advantech-uno-220-sebagai-edge-device-industri"
layout: "post"
excerpt: |
  UNO‑220 siap beroperasi sebagai edge device industri: Node‑RED untuk automasi & dashboard lokal, Rapid SCADA 6.4.3 untuk trending historis, ZeroTier untuk konektivitas aman, serta hardening + backup rutin agar sistem modular, audit‑ready, dan andal.
image: "https://images.unsplash.com/photo-1631553127988-36343ac5bb0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDN8fHJhc3BiZXJyeSUyMHBpfGVufDB8fHx8MTc2MTE1Mzc3M3ww&ixlib=rb-4.1.0&q=80&w=2000"
image_alt: ""
image_caption: "<span style=\"white-space: pre-wrap;\">Photo by </span><a href=\"https://unsplash.com/@jainath?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Jainath Ponnala</span></a><span style=\"white-space: pre-wrap;\"> / </span><a href=\"https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Unsplash</span></a>"
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
url: "https://automation.samatorgroup.com/blog/menyiapkan-advantech-uno-220-sebagai-edge-device-industri/"
comment_id: "68f8facb8a77df069caabfbb"
reading_time: 14
access: true
comments: false
---

{% raw %}
<h1 id="menyiapkan-advantech-uno-220-sebagai-edge-device-industri">Menyiapkan Advantech UNO-220 sebagai Edge Device Industri</h1>
<h2 id="1-pendahuluan">1. Pendahuluan</h2>
<p>Dokumentasi ini menjelaskan secara menyeluruh langkah-langkah menyiapkan <strong>Advantech UNO-220-P4N2AE</strong> berbasis <strong>Raspberry Pi 4 Model B</strong> agar siap digunakan sebagai <strong>edge device industri</strong>.<br>
Tujuan utamanya adalah menjadikan UNO-220 dapat beroperasi secara mandiri di lapangan, terhubung aman ke server pusat, dan menjalankan fungsi pengolahan serta visualisasi data menggunakan <strong>Node-RED</strong> (v4.x dengan Node.js v22 LTS) dan <strong>Rapid SCADA 6.4.3</strong>.</p>
<p>Panduan ini menggabungkan seluruh komponen yang dibutuhkan — mulai dari aktivasi fitur perangkat keras, pengamanan sistem operasi, hingga instalasi software produksi — tanpa ketergantungan pada dokumen luar.</p>
<figure style="display:flex; flex-direction:column; align-items:center;">
  <img src="https://advanbuy.com/wp-content/uploads/UNO-220-P4N1AE.jpg" alt="Advantech UNO-220" style="width:75%; display:block;">
  <figcaption style="text-align:center; margin-top:4px;">
    Advantech UNO‑220 sebagai edge device industri
  </figcaption>
</figure>
<hr>
<h2 id="2-persiapan-perangkat">2. Persiapan Perangkat</h2>
<h3 id="21-perangkat-keras">2.1 Perangkat Keras</h3>
<table>
<thead>
<tr>
<th>Komponen</th>
<th>Spesifikasi / Catatan</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Main Unit</strong></td>
<td>Advantech UNO-220 (Raspberry Pi 4 Model B, IP40, PoE support)</td>
</tr>
<tr>
<td><strong>Media Penyimpanan</strong></td>
<td>MicroSD <strong>industrial-grade</strong> ≥ 32 GB (mis. Swissbit, Transcend Industrial, Apacer Industrial)</td>
</tr>
<tr>
<td><strong>Catu Daya</strong></td>
<td>12 – 24 VDC atau PoE (Power over Ethernet); jika PoE digunakan, pastikan switch mendukung <strong>IEEE 802.3at (PoE+)</strong> untuk daya stabil hingga 30W—terutama saat Node-RED + Rapid SCADA berjalan (load tinggi bisa capai 15-20W; hindari 802.3af saja untuk cegah brownout)</td>
</tr>
<tr>
<td><strong>RTC</strong></td>
<td>Epson RX-8010SJ-B (battery backup untuk timekeeping akurat)</td>
</tr>
<tr>
<td><strong>I/O Expander</strong></td>
<td>TI TCA9554 (alamat I2C 0x27)</td>
</tr>
<tr>
<td><strong>TPM</strong></td>
<td>Infineon OPTIGA TPM SLB9670 (untuk secure boot &amp; encryption)</td>
</tr>
<tr>
<td><strong>Jaringan</strong></td>
<td>Ethernet LAN (1 GbE) untuk konfigurasi awal, ZeroTier untuk manajemen jarak jauh</td>
</tr>
</tbody>
</table>
<h3 id="22-perangkat-lunak">2.2 Perangkat Lunak</h3>
<ul>
<li>Ubuntu Server 25.04 (arm64, kernel 6.8+)</li>
<li>Tool flashing: Raspberry Pi Imager atau Balena Etcher</li>
<li>Akses jaringan dan SSH dari komputer host</li>
</ul>
<hr>
<h2 id="3-instalasi-ubuntu-server-2504">3. Instalasi Ubuntu Server 25.04</h2>
<p>Penggunaan <strong>microSD industrial-grade</strong> sangat disarankan untuk UNO-220, karena:</p>
<ul>
<li>Memiliki <strong>endurance tinggi (High TBW)</strong> dan <strong>SLC atau pSLC NAND</strong>.</li>
<li>Tahan terhadap suhu ekstrem (-40°C hingga +85°C) dan getaran.</li>
<li>Memiliki <strong>Power Loss Protection</strong> serta <strong>ECC</strong> yang andal.</li>
<li>Didesain untuk <strong>operasi 24/7 di lingkungan industri</strong>.</li>
</ul>
<h3 id="rekomendasi-spesifikasi">Rekomendasi spesifikasi</h3>
<table>
<thead>
<tr>
<th>Parameter</th>
<th>Nilai Minimum</th>
</tr>
</thead>
<tbody>
<tr>
<td>Kelas Speed</td>
<td>Class 10 / UHS-I</td>
</tr>
<tr>
<td>Kapasitas</td>
<td>≥ 32 GB</td>
</tr>
<tr>
<td>NAND Type</td>
<td>pSLC / Industrial SLC</td>
</tr>
<tr>
<td>Operating Temp.</td>
<td>-40°C hingga +85°C</td>
</tr>
<tr>
<td>Endurance</td>
<td>≥ 30K write cycles</td>
</tr>
<tr>
<td>Brand</td>
<td>Transcend Industrial, Swissbit, Apacer Industrial, Innodisk</td>
</tr>
</tbody>
</table>
<p><strong>Langkah instalasi:</strong></p>
<ol>
<li>Unduh <em>image</em> <strong>Ubuntu Server 25.04 (arm64)</strong> dari <a href="https://cdimage.ubuntu.com/releases/plucky/release?ref=automation.samatorgroup.com">cdimage.ubuntu.com/releases/plucky/release</a>.</li>
<li>Tulis <em>image</em> ke microSD menggunakan Raspberry Pi Imager atau Balena Etcher.</li>
<li>Setelah selesai, mount partisi <code>boot</code> dan buat file kosong bernama <code>ssh</code> untuk mengaktifkan SSH.</li>
<li>Pasang microSD ke UNO-220, hubungkan kabel jaringan dan catu daya.</li>
<li>Temukan alamat IP perangkat (via router atau <code>nmap</code>), lalu sambungkan:<pre><code class="language-bash">ssh ubuntu@&lt;ip_address&gt;
</code></pre>
Password awal: <code>ubuntu</code> (akan diminta ganti).</li>
<li>Set zona waktu:<pre><code class="language-bash">sudo timedatectl set-timezone Asia/Jakarta
</code></pre>
</li>
<li>Perbarui sistem:<pre><code class="language-bash">sudo apt update &amp;&amp; sudo apt upgrade -y
</code></pre>
</li>
</ol>
<p><strong>Troubleshooting:</strong> Jika IP tak terdeteksi, gunakan <code>sudo nmap -sn 192.168.1.0/24</code> (sesuaikan subnet).</p>
<hr>
<h2 id="4-aktivasi-fitur-hardware-uno-220">4. Aktivasi Fitur Hardware UNO-220</h2>
<p>Sebelum mengaktifkan fitur hardware UNO-220, pastikan sistem memiliki paket dasar untuk kompilasi dan pengambilan kode sumber. Jalankan perintah berikut untuk menginstal semua dependensi penting:</p>
<pre><code class="language-bash">sudo apt update
sudo apt install -y build-essential git curl device-tree-compiler
</code></pre>
<p>Kloning terlebih dahulu repository yang berisi berkas <em>device tree overlay</em> untuk hardware UNO-220:</p>
<pre><code class="language-bash">git clone --depth=1 https://github.com/kumajaya/uno-220-poe.git
cd uno-220-poe
</code></pre>
<h3 id="40-compile-semua-overlays">4.0 Compile Semua Overlays</h3>
<p>Compile kedua overlay secara berurutan:</p>
<pre><code class="language-bash">sudo dtc -@ -I dts -O dtb dts/i2c-rtc-overlay.dts -o /boot/firmware/current/overlays/i2c-rtc-mod.dtbo
sudo dtc -@ -I dts -O dtb dts/tpm-slb9670-overlay.dts -o /boot/firmware/current/overlays/tpm-slb9670-mod.dtbo
# I/O Expander tidak membutuhkan custom overlay; gunakan overlay standar pca953x
</code></pre>
<p><em>Verifikasi:</em> <code>ls /boot/firmware/overlays/ | grep -E 'i2c-rtc-mod|tpm-slb9670-mod'</code>—harus tampil file .dtbo.</p>
<h3 id="41-update-configtxt">4.1 Update config.txt</h3>
<p>Edit <code>/boot/firmware/config.txt</code>:</p>
<pre><code class="language-bash">sudo nano /boot/firmware/config.txt
</code></pre>
<p>Tambahkan baris-baris ini di akhir file:</p>
<pre><code># RTC Epson RX-8010
dtoverlay=i2c-rtc-mod,rx8010
# TI TCA9554
dtoverlay=pca953x,addr=0x27
# Infineon TPM SLB9670
dtoverlay=tpm-slb9670-mod,cs=0x00
</code></pre>
<p>Simpan, lalu reboot:</p>
<pre><code class="language-bash">sudo reboot
</code></pre>
<h3 id="42-test-rtc-epson-rx-8010sj-b">4.2 Test RTC Epson RX-8010SJ-B</h3>
<pre><code class="language-bash">sudo apt install util-linux-extra -y
sudo hwclock -r --verbose
sudo hwclock -w --verbose
timedatectl status
</code></pre>
<h3 id="43-test-ti-tca9554-io-expander">4.3 Test TI TCA9554 I/O Expander</h3>
<p>Uji (hubungkan GPIO 0 ke 1 untuk loopback):</p>
<pre><code class="language-bash">sudo apt install gpiod -y
gpiodetect
gpioinfo
gpioset 2 0=0 &amp;&amp; gpioget 2 1  # Off
gpioset 2 0=1 &amp;&amp; gpioget 2 1  # On
</code></pre>
<p><em>Note:</em> Untuk Node-RED, unload kernel module: <code>sudo modprobe -r gpio_pca953x</code>.</p>
<h3 id="44-test-tpm-slb9670">4.4 Test TPM SLB9670</h3>
<pre><code class="language-bash">sudo apt install tpm2-tools -y
tpm2_getrandom 16 | xxd -p
</code></pre>
<h3 id="45-gpio-led-pl1">4.5 GPIO &amp; LED PL1</h3>
<p>Tambahkan aturan udev di <code>/etc/udev/rules.d/45-gpio.rules</code>:</p>
<pre><code>KERNEL=="gpiochip*", GROUP="gpio", MODE="0660"
KERNEL=="gpiomem", GROUP="gpio", MODE="0660"
</code></pre>
<p>Reload rules:</p>
<pre><code class="language-bash">sudo udevadm control --reload-rules &amp;&amp; sudo udevadm trigger
sudo apt install python3-rpi.gpio  -y # Untuk Node-RED GPIO
</code></pre>
<p>LED PL1 (GPIO12, pin 32) dapat dikendalikan via Node-RED:</p>
<pre><code class="language-bash">gpioset 0 12=1   # LED ON (gunakan gpiochip0 untuk RPi GPIO)
gpioset 0 12=0   # LED OFF
</code></pre>
<h3 id="46-serial-console">4.6 Serial Console</h3>
<p>Hapus <code>console=serial0,115200</code> dari <code>/boot/firmware/cmdline.txt</code> agar port bisa dipakai aplikasi lain. Uji dengan <code>minicom -D /dev/ttyS0 -b 115200</code> (install: <code>sudo apt install minicom -y</code>).</p>
<h3 id="47-disable-usb-boot-keamanan-fisik-untuk-lapangan-rentan">4.7 Disable USB Boot (Keamanan Fisik untuk Lapangan Rentan)</h3>
<p>Untuk cegah boot dari USB eksternal (risiko tampering di lapangan), disable via EEPROM bootloader:</p>
<ol>
<li>Install tool: <code>sudo apt install rpi-eeprom -y</code>.</li>
<li>Edit <code>/boot/firmware/bootconf.txt</code> (atau buat jika belum ada):<pre><code>BOOT_ORDER=0xf41  # SD card only; disable USB/NVMe (0xf41 = SD -&gt; USB -&gt; Network, tapi set ke 0xf0 untuk SD only jika ekstrem)
</code></pre>
</li>
<li>Update EEPROM: <code>sudo rpi-eeprom-update -d -a</code>. Reboot.<br>
<em>Verifikasi:</em> <code>vcgencmd bootloader_config | grep BOOT_ORDER</code>—harus tampil 0xf41 atau 0xf0.<br>
<em>Note:</em> Ini kompatibel Ubuntu 25.04; fallback ke Imager bootloader image jika error.</li>
</ol>
<p><strong>Troubleshooting Hardware:</strong> Jika overlay gagal, cek <code>dmesg | grep i2c</code> atau <code>i2cdetect -y 1</code>; reboot setelah edit config.txt.</p>
<hr>
<h2 id="5-instalasi-node-red">5. Instalasi Node-RED</h2>
<pre><code class="language-bash">sudo apt update &amp;&amp; sudo apt upgrade -y
bash &lt;(curl -sL https://raw.githubusercontent.com/node-red/linux-installers/master/deb/update-nodejs-and-nodered)  # Install Node.js v22 LTS
sudo systemctl enable nodered.service
sudo systemctl start nodered.service
</code></pre>
<p>Akses: <code>http://&lt;ip&gt;:1880</code><br>
Amankan dengan <code>adminAuth</code> di <code>~/.node-red/settings.js</code> (edit: <code>httpNodeAuth: {type:"credentials", users: [{username:"admin", password:"hash"}}}</code>; generate hash via <code>node-red admin hash-pw</code>).</p>
<h3 id="51-aktivasi-logging-untuk-monitoring-io-dan-deteksi-error-hardware">5.1 Aktivasi Logging untuk Monitoring I/O dan Deteksi Error Hardware</h3>
<p>Edit <code>~/.node-red/settings.js</code> untuk enable detailed logging (level <code>debug</code> untuk capture I/O seperti GPIO/TCA9554 dan hardware errors seperti RTC/TPM failures):</p>
<pre><code>logging: {
    console: {
        // Gunakan "info" untuk operasi normal
        // Naikkan ke "debug" saat commissioning
        // Gunakan "trace" hanya untuk troubleshooting detail
        level: "info",  // Atau "debug" untuk detail atau "trace" untuk sangat detail; capture warn/error I/O
        metrics: true,  // Log node events (receive/send) dan memory usage (untuk hardware resource monitoring)
        audit: true     // Log API access untuk track config changes terkait hardware
    }
}
</code></pre>
<ul>
<li><strong>Metrics contoh (untuk I/O monitoring)</strong>: Log node inject/receive/send (e.g., GPIO expander events).</li>
<li><strong>Memory logs</strong>: Setiap 15 detik, monitor heap usage untuk deteksi hardware overload di RPi4B ARM64.</li>
<li>Restart: <code>sudo systemctl restart nodered.service</code>.</li>
<li>View logs: <code>sudo journalctl -u nodered.service -f</code> (real-time) atau <code>node-red-log</code> untuk service.</li>
</ul>
<p><strong>Troubleshooting:</strong> Jika npm error, tambah <code>--max-old-space-size=512</code> untuk low-RAM. Logs tersimpan di journal systemd; gunakan <code>grep "error\|I/O"</code> untuk filter hardware issues.</p>
<h3 id="52-system-resource-monitoring-cpu-temperature-memory-usage-cpu-load-disk-usage-uptime-dengan-node-red">5.2 System Resource Monitoring (CPU Temperature, Memory Usage, CPU Load, Disk Usage, Uptime) dengan Node-RED</h3>
<p>Untuk monitor real-time metrik kunci (CPU Temperature, Memory Usage, CPU Load, Disk Usage, Uptime), gunakan exec node dengan command Raspberry Pi. Visualisasikan via dashboard, dan simpan ke CSV untuk integrasi Rapid SCADA (lihat 7.2). Threshold alert: Temp &gt;80°C, Load &gt;2.0, Memory/Disk &gt;80%.</p>
<ol>
<li>
<p><strong>Instal Nodes Tambahan:</strong> Di Node-RED editor (http://<ip>:1880), buka Palette Manager &gt; Install:</ip></p>
<ul>
<li><code>node-red-dashboard</code> (untuk UI gauge/chart).<br>
Restart Node-RED setelah instal.</li>
</ul>
</li>
<li>
<p><strong>Contoh Flow Lengkap (Import ke Node-RED):</strong><br>
Buat flow baru dengan nodes berikut (copy JSON di bawah ke Import menu). Flow ini poll setiap 10 detik, set msg.topic unik per exec, join by topic untuk merge benar, parse data, tampilkan di gauge, dan append ke <code>/home/ubuntu/uno220_stat.csv</code> dengan format: <code>Timestamp,Temperature,Load,Memory,Uptime,Disk</code> (Timestamp=ISO, Temperature=°C, Load=1-min avg, Memory=%, Uptime=days:hours:mins, Disk=% used).</p>
</li>
</ol>
<details>
<summary>Klik untuk lihat JSON Flow (Copy &amp; Import ke Node-RED)</summary>
<pre><code class="language-json">[
  {
    "id": "inject_timer",
    "type": "inject",
    "repeat": "10",
    "name": "Poll Metrics",
    "topic": "",
    "payload": "",
    "payloadType": "date",
    "x": 100,
    "y": 100,
    "wires": [["exec_temp", "exec_load", "exec_memory", "exec_disk", "exec_uptime"]]
  },
  {
    "id": "exec_temp",
    "type": "exec",
    "command": "vcgencmd measure_temp",
    "addpay": true,
    "append": "",
    "useSpawn": "false",
    "timer": "",
    "name": "Get Temp",
    "topic": "temp",
    "x": 300,
    "y": 60,
    "wires": [["parse_temp"], [], []]
  },
  {
    "id": "parse_temp",
    "type": "function",
    "name": "Parse Temp",
    "func": "msg.payload = parseFloat(msg.payload.split('=')[1].replace('\'C', ''));\nreturn msg;",
    "x": 500,
    "y": 60,
    "wires": [[]]
  },
  {
    "id": "exec_load",
    "type": "exec",
    "command": "uptime | awk '{print $(NF-2)}' | tr -d ','",
    "addpay": true,
    "append": "",
    "useSpawn": "false",
    "timer": "",
    "name": "Get Load",
    "topic": "load",
    "x": 300,
    "y": 120,
    "wires": [["parse_load"], [], []]
  },
  {
    "id": "parse_load",
    "type": "function",
    "name": "Parse Load",
    "func": "msg.payload = parseFloat(msg.payload);\nreturn msg;",
    "x": 500,
    "y": 120,
    "wires": [[]]
  },
  {
    "id": "exec_memory",
    "type": "exec",
    "command": "free -m | awk 'NR==2{printf \"%.2f\", $3*100/$2 }'",
    "addpay": true,
    "append": "",
    "useSpawn": "false",
    "timer": "",
    "name": "Get Memory",
    "topic": "memory",
    "x": 300,
    "y": 180,
    "wires": [["parse_memory"], [], []]
  },
  {
    "id": "parse_memory",
    "type": "function",
    "name": "Parse Memory",
    "func": "msg.payload = parseFloat(msg.payload);\nreturn msg;",
    "x": 500,
    "y": 180,
    "wires": [[]]
  },
  {
    "id": "exec_disk",
    "type": "exec",
    "command": "df -h / | awk 'NR==2{printf \"%.2f\", $5+0}' | tr -d '%'",
    "addpay": true,
    "append": "",
    "useSpawn": "false",
    "timer": "",
    "name": "Get Disk",
    "topic": "disk",
    "x": 300,
    "y": 240,
    "wires": [["parse_disk"], [], []]
  },
  {
    "id": "parse_disk",
    "type": "function",
    "name": "Parse Disk",
    "func": "msg.payload = parseFloat(msg.payload);\nreturn msg;",
    "x": 500,
    "y": 240,
    "wires": [[]]
  },
  {
    "id": "exec_uptime",
    "type": "exec",
    "command": "uptime -p",
    "addpay": true,
    "append": "",
    "useSpawn": "false",
    "timer": "",
    "name": "Get Uptime",
    "topic": "uptime",
    "x": 300,
    "y": 300,
    "wires": [["parse_uptime"], [], []]
  },
  {
    "id": "parse_uptime",
    "type": "function",
    "name": "Parse Uptime",
    "func": "msg.payload = msg.payload.trim();  // e.g., 'up 2 days, 15 hours, 23 minutes'\nreturn msg;",
    "x": 500,
    "y": 300,
    "wires": [[]]
  },
  {
    "id": "join_metrics",
    "type": "join",
    "name": "Join by Topic",
    "mode": "complete",
    "build": "merged",
    "property": "metrics",
    "propertyType": "msg",
    "key": "topic",
    "joiner": "\\n",
    "joinerType": "str",
    "accumulate": false,
    "timeout": "5",
    "count": "5",
    "reduceRight": false,
    "reduceExp": "",
    "reduceInit": "",
    "reduceInitType": "",
    "reduceFixup": "",
    "x": 700,
    "y": 180,
    "wires": [["format_csv"]]
  },
  {
    "id": "format_csv",
    "type": "function",
    "name": "Format CSV Row",
    "func": "var timestamp = new Date().toISOString();\nvar temp = RED.util.getMessageProperty(msg.metrics.temp, 'payload', true) || 0;\nvar load = RED.util.getMessageProperty(msg.metrics.load, 'payload', true) || 0;\nvar memory = RED.util.getMessageProperty(msg.metrics.memory, 'payload', true) || 0;\nvar uptime = RED.util.getMessageProperty(msg.metrics.uptime, 'payload', true) || '0';\nvar disk = RED.util.getMessageProperty(msg.metrics.disk, 'payload', true) || 0;\nvar row = timestamp + ',' + temp + ',' + load + ',' + memory + ',' + uptime + ',' + disk;\nmsg.payload = row + '\\n';\nmsg.filename = '/home/ubuntu/uno220_stat.csv';\ndelete msg.metrics;  // Cleanup\nreturn msg;",
    "x": 900,
    "y": 180,
    "wires": [["write_csv", "ui_gauges"]]
  },
  {
    "id": "write_csv",
    "type": "file",
    "filename": "",
    "appendNewline": true,
    "createDir": true,
    "overwriteFile": "false",
    "encoding": "utf8",
    "x": 1100,
    "y": 120,
    "wires": [[]]
  },
  {
    "id": "ui_gauges",
    "type": "ui_gauge",
    "group": "dashboard_group",
    "name": "System Metrics Dashboard",
    "label": "{{topic}}: {{value}}",
    "format": "{{value}}",
    "min": 0,
    "max": 100,
    "colors": ["#00b500", "#e6e600", "#ca3838"],
    "x": 1100,
    "y": 240,
    "wires": []
  },
  {
    "id": "dashboard_group",
    "type": "ui_group",
    "name": "System Metrics",
    "tab": "ui_tab",
    "order": 1,
    "disp": true,
    "width": "6",
    "collapse": false
  },
  {
    "id": "ui_tab",
    "type": "ui_tab",
    "name": "Dashboard",
    "icon": "dashboard",
    "disabled": false,
    "hidden": false
  }
]
</code></pre>
</details>
<ul>
<li><strong>Penjelasan Flow:</strong> Inject timer; exec paralel dengan topic unik; parse per metrik; join by topic (mode "complete", count 5) untuk tunggu semua data; format CSV dengan getMessageProperty untuk akses by topic; append ke file; tampilkan gauge. Akses dashboard: http://<ip>:1880/ui. Header CSV: <code>echo "Timestamp,Temperature,Load,Memory,Uptime,Disk" &gt; /home/ubuntu/uno220_stat.csv</code> (jalankan sekali).</ip></li>
<li><strong>Alert Tambahan:</strong> Tambah switch node setelah format_csv: Jika temp &gt;80, hubung ke email node (<code>node-red-node-email</code>).</li>
</ul>
<ol start="3">
<li><strong>Deploy &amp; Test:</strong> Klik Deploy. Cek file: <code>tail /home/ubuntu/uno220_stat.csv</code> (contoh row: <code>2025-10-22T10:00:00.000Z,45.2,0.05,6.25,2 days 15 hours 23 minutes,16.00</code>).</li>
</ol>
<p><strong>Troubleshooting:</strong> Jika join timeout (5s), naikkan timeout; test command di terminal. CSV append aman untuk microSD.</p>
<hr>
<h2 id="6-instalasi-zerotier">6. Instalasi ZeroTier</h2>
<pre><code class="language-bash">curl -s https://install.zerotier.com | sudo bash
zerotier-cli info
sudo zerotier-cli join &lt;network_id&gt;
sudo zerotier-cli authorize &lt;node_id&gt;  # Di dashboard ZeroTier
sudo systemctl enable zerotier-one
sudo systemctl start zerotier-one
</code></pre>
<p>Gunakan IP ZeroTier untuk remote SSH, bukan IP publik.</p>
<p><strong>Troubleshooting:</strong> Jika join gagal, cek <code>journalctl -u zerotier-one</code>.</p>
<hr>
<h2 id="7-instalasi-rapid-scada-643-nginx">7. Instalasi Rapid SCADA 6.4.3 &amp; Nginx</h2>
<h3 id="71-net-80-runtime">7.1 .NET 8.0 Runtime</h3>
<pre><code class="language-bash">sudo apt update &amp;&amp; sudo apt install -y aspnetcore-runtime-8.0  # Native di Ubuntu 25.04 ARM64
dotnet --info  # Verifikasi ASP.NET Core 8.0.x
</code></pre>
<h3 id="72-rapid-scada">7.2 Rapid SCADA</h3>
<p>Opsi <code>.deb</code> (recommended): Download dari rapidscada.org, lalu <code>sudo dpkg -i rapidscada_6.4.3_all.deb</code>.<br>
Atau manual: <code>sudo cp -r scada/* /opt/scada/</code> dan enable daemons seperti di referensi.</p>
<p><strong>Integrasi CSV untuk Trending:</strong> Gunakan CSV device driver (built-in Rapid SCADA) untuk baca <code>/home/ubuntu/uno220_stat.csv</code> sebagai tag data (real-time/historical).</p>
<ol>
<li>Di Rapid SCADA Configurator: Tools &gt; Device/Tag Editor &gt; New Device &gt; Pilih "CSV File Reader Driver".</li>
<li>Set file path: <code>/home/ubuntu/uno220_stat.csv</code>; delimiter: <code>,</code>; header: yes.</li>
<li>Map kolom ke tag: Timestamp (time), Temperature/Load/Memory/Uptime/Disk (value).</li>
<li>Enable polling (e.g., every 30s untuk trend). View di web: Charts &gt; Add trend untuk visualisasi historis.<br>
<em>Note:</em> Driver baca last record untuk real-time; full CSV untuk archive trending (support demo/real-time mode).</li>
</ol>
<h3 id="73-ram-drive">7.3 RAM Drive</h3>
<p>Tambah ke <code>/etc/fstab</code> (backup dulu):</p>
<pre><code>tmpfs /var/log/scada tmpfs defaults,noatime,size=100m,mode=1777 0 0
</code></pre>
<p>Remount: <code>sudo mount -a</code>.</p>
<h3 id="74-nginx">7.4 Nginx</h3>
<p>Install: <code>sudo apt install nginx -y &amp;&amp; sudo systemctl enable nginx</code>.<br>
Gunakan file <code>scada.conf</code> agar jelas:</p>
<pre><code class="language-bash">sudo cp nginx/scada.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/scada.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
</code></pre>
<p>Setup SSL: Gunakan self-signed atau Let's Encrypt (<code>sudo certbot --nginx</code>).</p>
<p><strong>Troubleshooting:</strong> Jika 502, cek <code>journalctl -u scadaweb6</code>; pastikan proxy_pass ke localhost:10001.</p>
<hr>
<h2 id="8-hardening-optimisasi">8. Hardening &amp; Optimisasi</h2>
<ul>
<li>
<p><strong>SSH</strong>: Edit <code>/etc/ssh/sshd_config</code>: <code>PermitRootLogin no</code>, <code>PubkeyAuthentication yes</code>. Restart: <code>sudo systemctl restart ssh</code>. Uji key-based auth sebelum tutup sesi.</p>
</li>
<li>
<p><strong>Firewall (UFW - Tutup Semua Port Tidak Digunakan)</strong>:</p>
<pre><code class="language-bash">sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh/tcp          # Port 22
sudo ufw allow 1880/tcp         # Node-RED
sudo ufw allow 80/tcp           # Nginx HTTP
sudo ufw allow 443/tcp          # Nginx HTTPS
sudo ufw enable
</code></pre>
<p>Jawab <code>y</code> saat konfirmasi.<br>
<em>Verifikasi:</em> <code>sudo ss -tuln</code> atau <code>sudo netstat -tuln</code>—hanya port 22/80/443/1880 yang open incoming. Jika port lain muncul (e.g., ZeroTier 9993 UDP), allow jika perlu tapi deny via UFW.</p>
</li>
<li>
<p><strong>Fail2Ban untuk Proteksi SSH (Anti Brute-Force)</strong>:</p>
<ol>
<li>Install: <code>sudo apt update &amp;&amp; sudo apt install fail2ban -y</code>.</li>
<li>Config jail: Buat <code>/etc/fail2ban/jail.local</code>:<pre><code>[DEFAULT]
bantime = 3600  # Ban 1 jam
findtime = 600  # Scan 10 menit
maxretry = 5    # Max 5 gagal

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
</code></pre>
</li>
<li>Restart: <code>sudo systemctl restart fail2ban</code>.</li>
<li>Verifikasi: <code>sudo fail2ban-client status sshd</code> (cek banned IPs). Tambah <code>ignoreip = 127.0.0.1/8 &lt;your_ip&gt;</code> di jail.local untuk whitelist.</li>
</ol>
</li>
<li>
<p><strong>Auto Security Updates dengan Unattended-Upgrades</strong>:</p>
<ol>
<li>Install: <code>sudo apt install unattended-upgrades -y</code>.</li>
<li>Enable: <code>sudo dpkg-reconfigure unattended-upgrades</code> (pilih Yes).</li>
<li>Config <code>/etc/apt/apt.conf.d/50unattended-upgrades</code>: Uncomment <code>Unattended-Upgrade::Allowed-Origins</code> untuk security updates only (e.g., "${distro_id}:${distro_codename}-security").</li>
<li>Test: <code>sudo unattended-upgrades --dry-run</code>.<br>
<em>Otomatis:</em> Cron harian via /etc/cron.daily/apt-compat.</li>
</ol>
</li>
<li>
<p><strong>Pengecekan Drift RTC untuk Timestamp Konsisten</strong>:<br>
Pastikan NTP (systemd-timesyncd) harus tetap aktif agar RTC selalu dikoreksi dari sumber resmi. Tambah cron job untuk sync sistem ke RTC (cegah drift &gt;1s/hari): Edit root crontab (<code>sudo crontab -e</code>):</p>
<pre><code>@daily /usr/sbin/hwclock -w &amp;&amp; logger "RTC updated from system clock"
@reboot /usr/sbin/hwclock -s &amp;&amp; logger "System clock initialized from RTC"
</code></pre>
<p>Verifikasi: <code>sudo crontab -l</code>. Log di /var/log/syslog; test manual: <code>sudo hwclock -s &amp;&amp; hwclock -r</code>.</p>
</li>
<li>
<p>Tambah: Disable unused services (<code>sudo systemctl disable bluetooth avahi-daemon</code>).</p>
</li>
</ul>
<p><strong>Troubleshooting:</strong> Jika Fail2Ban gagal, cek <code>sudo journalctl -u fail2ban</code>; test brute-force dengan <code>ssh invalid@ip</code> berulang.</p>
<hr>
<h2 id="9-backup-recovery">9. Backup &amp; Recovery</h2>
<h3 id="backup-manual">Backup Manual</h3>
<h3 id="node-red">Node-RED</h3>
<pre><code class="language-bash">cd ~/.node-red &amp;&amp; tar czvf nodered_config_backup.tar.gz flows.json settings.js package.json
</code></pre>
<h3 id="rapid-scada">Rapid SCADA</h3>
<pre><code class="language-bash">sudo tar czvf scada_backup_$(date +%F).tar.gz /opt/scada /etc/systemd/system/scada*.service
</code></pre>
<h3 id="zerotier">ZeroTier</h3>
<pre><code class="language-bash">sudo tar czvf zerotier_backup.tar.gz /var/lib/zerotier-one
</code></pre>
<h3 id="backup-rutin-otomatis-cron-rsync-ke-usbnas">Backup Rutin Otomatis (Cron + rsync ke USB/NAS)</h3>
<ol>
<li><strong>Setup USB/NAS Mount</strong>: Untuk USB, plug dan mount: <code>sudo mkdir /mnt/usb &amp;&amp; sudo mount /dev/sda1 /mnt/usb</code> (ganti sda1). Untuk NAS: <code>sudo mkdir /mnt/nas &amp;&amp; sudo mount -t nfs &lt;nas_ip&gt;:/share /mnt/nas</code> (atau SMB via cifs).</li>
<li><strong>Buat Script Backup</strong> (<code>/usr/local/bin/backup_routine.sh</code>):<pre><code class="language-bash">#!/bin/bash
set -euo pipefail

DATE="$(date +%Y%m%d_%H%M%S)"
SRC_DIRS="/home/ubuntu/.node-red /var/lib/zerotier-one /etc /home/ubuntu/uno220_stat.csv"
DEST="/mnt/usb/backups"   # atau /mnt/nas/backups
LOG="/var/log/backup.log"
 
if ! mountpoint -q /mnt/usb; then
  echo "USB tidak ter-mount, backup dibatalkan" | tee -a "$LOG"
  exit 1
fi

mkdir -p "$DEST/$DATE"
rsync -avz --delete --log-file="$LOG" $SRC_DIRS "$DEST/$DATE"

# Hapus backup &gt;7 hari, hanya di level 1
find "$DEST" -maxdepth 1 -mindepth 1 -type d -mtime +7 -exec rm -rf {} +

# Mirror khusus Rapid SCADA agar tidak menumpuk file lama
mkdir -p /mnt/usb/scada_backup
rsync -av --delete /opt/scada /mnt/usb/scada_backup/
</code></pre>
Buat executable: <code>sudo chmod +x /usr/local/bin/backup_routine.sh</code>.</li>
<li><strong>Cron Job</strong>: Edit crontab: <code>sudo crontab -e</code>, tambah:<pre><code>0 2 * * * /usr/local/bin/backup_routine.sh  # Harian jam 2 pagi
</code></pre>
Verifikasi: <code>sudo crontab -l</code>. Logs di <code>/var/log/backup.log</code>.</li>
</ol>
<h3 id="log-retention-dengan-logrotate-cegah-pembengkakan-log">Log Retention dengan Logrotate (Cegah Pembengkakan Log)</h3>
<p>Untuk memastikan /var/log/backup.log (dan logs lain) tidak membengkak di microSD, gunakan logrotate (bawaan Ubuntu 25.04).</p>
<ol>
<li>Install jika perlu: <code>sudo apt install logrotate -y</code> (sudah default).</li>
<li>Buat config custom di <code>/etc/logrotate.d/backup_logs</code>:<pre><code>/var/log/backup.log {
    daily                    # Rotate harian
    rotate 7                 # Simpan 7 hari
    compress                 # Kompres .gz
    delaycompress            # Kompres di rotasi berikutnya
    missingok                # OK jika file hilang
    notifempty               # Skip jika kosong
    create 644 root root     # Buat ulang dengan permission ini
    postrotate
        /usr/bin/killall -q -HUP rsyslogd 2&gt; /dev/null || true  # Reload logger jika perlu
    endscript
}
</code></pre>
</li>
<li>Test: <code>sudo logrotate -d /etc/logrotate.d/backup_logs</code> (debug mode).</li>
<li>Jalankan manual: <code>sudo logrotate -f /etc/logrotate.conf</code>.<br>
<em>Otomatis:</em> Via cron harian (<code>/etc/cron.daily/logrotate</code>).</li>
</ol>
<p><strong>Troubleshooting:</strong> Cek status: <code>sudo logrotate -v /etc/logrotate.conf</code>; jika error permission, sesuaikan create line.</p>
<p><strong>Recovery:</strong> Restore via <code>rsync -avz /mnt/usb/backups/latest/ /</code> atau <code>tar xzvf backup.tar.gz -C /path/</code>.</p>
<p><strong>Troubleshooting:</strong> Jika rsync gagal ke NAS, setup SSH keyless (<code>ssh-keygen &amp;&amp; ssh-copy-id user@nas_ip</code>); cek mount dengan <code>df -h</code>.</p>
<hr>
<h2 id="10-testing-validasi">10. Testing &amp; Validasi</h2>
<ol>
<li>
<p><strong>Verifikasi Node-RED</strong></p>
<pre><code class="language-bash">systemctl status nodered.service
</code></pre>
<p>Pastikan <code>active (running)</code>; akses dashboard di browser.<br>
<strong>(Contoh Output):</strong></p>
<pre><code>● nodered.service - Node-RED
     Loaded: loaded (/lib/systemd/system/nodered.service; enabled; preset: enabled)
     Active: active (running) since Tue 2025-10-22 10:00:00 UTC; 2h ago
     Main PID: 1234 (node)
     Tasks: 15 (limit: 4915)
     Memory: 45.2M
     CPU: 1min 23.456s
     CGroup: /system.slice/nodered.service
             └─1234 /usr/bin/node /usr/lib/node_modules/node-red/red.js
</code></pre>
</li>
<li>
<p><strong>Verifikasi Rapid SCADA</strong></p>
<pre><code class="language-bash">systemctl status scadaserver6.service scadacomm6.service scadaweb6.service
</code></pre>
<p>Semua <code>active (running)</code>; login admin/scada di http://<ip>.</ip></p>
</li>
<li>
<p><strong>Uji koneksi ZeroTier antar node</strong></p>
<pre><code class="language-bash">ping &lt;IP_ZeroTier_peer&gt;
</code></pre>
</li>
<li>
<p><strong>Uji hardware</strong></p>
<ul>
<li><strong>RTC:</strong> <code>hwclock -r</code><br>
<strong>(Contoh Output, verbose mode):</strong><pre><code>hwclock from command line: 2025-10-22 12:34:56.789012 UTC
Last calibrate from /var/lib/hwclock/adjfile: 2025-10-22 12:34:56.789012 UTC
Hardware Clock: 2025-10-22 12:34:56.789012 UTC
</code></pre>
</li>
<li><strong>GPIO Expander:</strong> <code>gpiodetect</code><br>
<strong>(Contoh Output, dengan TCA9554):</strong><pre><code>gpiochip0 [pinctrl-bcm2835] (58 lines)
gpiochip1 [raspberrypi-exp-gpio] (8 lines)
gpiochip2 [pca953x] (8 lines, tca9554@27)
</code></pre>
</li>
<li><strong>LED PL1:</strong><pre><code class="language-bash">gpioset 0 12=1   # LED ON
gpioset 0 12=0   # LED OFF
</code></pre>
</li>
<li><strong>TPM:</strong> <code>tpm2_getrandom 16 | xxd -p</code><br>
<strong>(Contoh Output, random hex):</strong><pre><code>a1b2c3d4e5f6789012345678abcdef90
</code></pre>
</li>
<li>Serial port: <code>minicom -D /dev/ttyS0 -b 115200</code></li>
</ul>
</li>
</ol>
<p><strong>Checklist Operator (contoh):</strong></p>
<ul>
<li>[ ] Node-RED dashboard dapat diakses via browser</li>
<li>[ ] Rapid SCADA menampilkan halaman login</li>
<li>[ ] ZeroTier peer dapat saling ping</li>
<li>[ ] RTC terbaca dengan benar (bandingkan output hwclock)</li>
<li>[ ] LED PL1 dapat dikendalikan</li>
<li>[ ] Port serial berfungsi</li>
<li>[ ] Hanya port 22/80/443/1880 open (ss -tuln)</li>
<li>[ ] Fail2Ban active (fail2ban-client status sshd)</li>
<li>[ ] Node-RED logs capture I/O errors (journalctl -u nodered)</li>
<li>[ ] Backup cron run (cek /var/log/backup.log)</li>
<li>[ ] Logrotate config valid (logrotate -d /etc/logrotate.d/backup_logs)</li>
<li>[ ] System metrics dashboard tampil (CPU &lt;80%, RAM &lt;70%, Temp &lt;80°C)</li>
<li>[ ] CSV file update (tail uno220_stat.csv) &amp; Rapid SCADA trend visible</li>
</ul>
<hr>
<h2 id="11-deployment">11. Deployment</h2>
<ol>
<li>Tempatkan UNO-220 di lokasi lapangan.</li>
<li>Hubungkan ke catu daya dan jaringan (Ethernet atau PoE—lihat catatan di 2.1 untuk 802.3at agar stabil saat Node-RED + SCADA load tinggi).</li>
<li>Pastikan device muncul di jaringan ZeroTier.</li>
<li>Akses Node-RED dan Rapid SCADA melalui IP ZeroTier.</li>
<li>Lakukan validasi fungsi I/O dan flow logika industri.</li>
<li>Beri label fisik pada unit (ID ZeroTier, IP lokal) untuk memudahkan identifikasi lapangan.</li>
<li>Disarankan menggunakan <strong>UPS mini DC</strong> untuk menjaga kestabilan supply.</li>
</ol>
<hr>
<h2 id="12-penutup">12. Penutup</h2>
<p>UNO-220 kini siap beroperasi sebagai <strong>edge device industri</strong> dengan konfigurasi yang aman, modular, dan audit-ready:</p>
<ul>
<li><strong>Node-RED</strong> untuk automasi dan dashboard lokal (dengan logging I/O + system monitoring ke CSV).</li>
<li><strong>Rapid SCADA 6.4.3</strong> untuk monitoring &amp; SCADA server (integrasi CSV trending).</li>
<li><strong>ZeroTier</strong> untuk konektivitas aman dan remote management.</li>
<li><strong>RAM drive &amp; hardening</strong> (UFW + Fail2Ban) untuk keamanan dan memperpanjang umur microSD.</li>
<li><strong>Backup cron + logrotate</strong> untuk recovery cepat dan log management.</li>
</ul>
<p>Dokumen ini dapat dijadikan <strong>standar operasional deployment UNO-220</strong> di seluruh fasilitas industri, memastikan konsistensi, keamanan, dan keandalan. Untuk update masa depan, cek versi software di sumber resmi.</p>

{% endraw %}