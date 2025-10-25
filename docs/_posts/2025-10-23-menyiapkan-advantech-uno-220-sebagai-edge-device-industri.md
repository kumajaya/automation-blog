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
reading_time: 23
access: true
comments: false
---

{% raw %}

<!--kg-card-begin: html-->
<aside class="gh-sidebar">
  <button class="toc-toggle" aria-expanded="false" aria-controls="gh-toc">
    <span class="toc-toggle-icon">☰</span> Daftar Isi
  </button>
  <div class="gh-toc js-toc" id="gh-toc"></div>
</aside>
<!--kg-card-end: html-->
<h2 id="1-pendahuluan">1. Pendahuluan</h2>
<p>Dokumentasi ini menyajikan panduan menyeluruh untuk menyiapkan <strong>Advantech UNO‑220‑P4N2AE</strong>, sebuah <em>casing</em> standar industri untuk <strong>Raspberry Pi 4 Model B</strong>, agar siap berfungsi sebagai <strong>edge device industri</strong>.</p>
<p>Panduan ini dirancang untuk memastikan UNO‑220 mampu:</p>
<ul>
<li>Beroperasi secara <strong>mandiri di lapangan</strong>, tanpa ketergantungan pada infrastruktur tambahan,</li>
<li>Terhubung <strong>aman</strong> ke server pusat melalui jaringan terenkripsi,</li>
<li>Menjalankan fungsi <strong>pengolahan data real‑time</strong> sekaligus <strong>visualisasi</strong> menggunakan <strong>Node‑RED</strong> (v4.x dengan Node.js v22 LTS) dan <strong>Rapid SCADA 6.4.3</strong>.</li>
</ul>
<p>Seluruh tahapan — mulai dari aktivasi fitur perangkat keras, penguatan keamanan sistem operasi, hingga instalasi perangkat lunak produksi — telah digabungkan dalam satu dokumen terpadu. Dengan demikian, panduan ini dapat dijadikan <strong>standar operasional</strong> untuk deployment UNO‑220 di lingkungan industri, tanpa perlu merujuk ke dokumen eksternal tambahan.</p>
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
<th>Alasan / Risiko</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Main Unit</strong></td>
<td>Advantech UNO‑220 (Raspberry Pi 4 Model B, IP40, PoE support)</td>
<td>Form factor industri, rugged, siap dipasang di panel; casing melindungi dari debu &amp; getaran.</td>
</tr>
<tr>
<td><strong>Media Penyimpanan</strong></td>
<td>MicroSD <strong>industrial‑grade</strong> ≥ 32 GB (Swissbit, Transcend Industrial, Apacer Industrial, Innodisk)</td>
<td>Endurance tinggi (pSLC/SLC), tahan suhu ekstrem, mencegah korupsi data akibat siklus tulis intensif.</td>
</tr>
<tr>
<td><strong>Catu Daya</strong></td>
<td>12 – 24 VDC atau PoE (Power over Ethernet). Jika PoE, wajib <strong>IEEE 802.3at (PoE+)</strong> untuk daya stabil hingga 30W.</td>
<td>Node‑RED + SCADA dapat menarik 15–20W; jika hanya 802.3af (maks 15W), risiko brownout/reboot spontan.</td>
</tr>
<tr>
<td><strong>RTC</strong></td>
<td>Epson RX‑8010SJ‑B (dengan battery backup)</td>
<td>Menjamin timestamp akurat meski tanpa koneksi NTP; penting untuk audit log &amp; histori data.</td>
</tr>
<tr>
<td><strong>I/O Expander</strong></td>
<td>TI TCA9554 (alamat I²C 0x27)</td>
<td>Menambah GPIO untuk kontrol/monitoring eksternal; kompatibel dengan Node‑RED &amp; SCADA.</td>
</tr>
<tr>
<td><strong>TPM</strong></td>
<td>Infineon OPTIGA TPM SLB9670</td>
<td>Mendukung secure boot, enkripsi, dan integritas sistem; mencegah tampering di lapangan.</td>
</tr>
<tr>
<td><strong>Jaringan</strong></td>
<td>Ethernet LAN (1 GbE) untuk konfigurasi awal; <strong>ZeroTier</strong> untuk manajemen jarak jauh</td>
<td>Ethernet stabil untuk setup awal; ZeroTier memberi VPN overlay aman tanpa port publik.</td>
</tr>
</tbody>
</table>
<hr>
<h3 id="22-perangkat-lunak">2.2 Perangkat Lunak</h3>
<ul>
<li><strong>Ubuntu Server 25.10 (arm64, kernel 6.17+)</strong> → sistem operasi modern, rilis interim saat ini (non-LTS; upgrade ke 26.04 LTS nanti untuk produksi jangka panjang), kompatibel dengan Raspberry Pi 4.</li>
<li><strong>Tool flashing</strong>: Raspberry Pi Imager atau Balena Etcher → untuk menulis image OS ke microSD.</li>
<li><strong>Akses jaringan &amp; SSH dari komputer host</strong> → diperlukan untuk konfigurasi awal headless (tanpa monitor/keyboard).</li>
</ul>
<hr>
<h2 id="3-instalasi-ubuntu-server-2510">3. Instalasi Ubuntu Server 25.10</h2>
<p>Penggunaan <strong>microSD industrial‑grade</strong> sangat disarankan untuk UNO‑220 karena:</p>
<ul>
<li>Endurance tinggi (pSLC/SLC NAND, High TBW).</li>
<li>Tahan suhu ekstrem (‑40°C hingga +85°C) dan getaran.</li>
<li>Dilengkapi <strong>Power Loss Protection</strong> dan <strong>ECC</strong>.</li>
<li>Dirancang untuk operasi 24/7 di lingkungan industri.</li>
</ul>
<h3 id="rekomendasi-spesifikasi-microsd">Rekomendasi Spesifikasi microSD</h3>
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
<td>Class 10 / UHS‑I</td>
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
<td>‑40°C hingga +85°C</td>
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
<h3 id="langkah-instalasi">Langkah Instalasi</h3>
<ol>
<li>
<p><strong>Unduh image OS</strong><br>
Ambil <em>image</em> <strong>Ubuntu Server 25.10 (arm64)</strong> dari <a href="https://cdimage.ubuntu.com/releases/25.10/release/?ref=automation.samatorgroup.com">situs resmi Ubuntu</a>.</p>
</li>
<li>
<p><strong>Tulis image ke microSD</strong><br>
Gunakan Raspberry Pi Imager atau Balena Etcher.</p>
</li>
<li>
<p><strong>Aktifkan SSH</strong><br>
Setelah flashing selesai, mount partisi <code>boot</code> lalu buat file kosong bernama <code>ssh</code>:</p>
<pre><code class="language-bash">touch /media/&lt;user&gt;/boot/ssh
</code></pre>
</li>
<li>
<p><strong>Pasang microSD &amp; hubungkan perangkat</strong><br>
Masukkan microSD ke UNO‑220, hubungkan kabel Ethernet dan catu daya.</p>
</li>
<li>
<p><strong>Temukan alamat IP</strong></p>
<ul>
<li>Via router/DHCP lease</li>
<li>Atau gunakan:<pre><code class="language-bash">sudo nmap -sn 192.168.1.0/24
</code></pre>
</li>
</ul>
</li>
<li>
<p><strong>Login pertama via SSH</strong></p>
<pre><code class="language-bash">ssh ubuntu@&lt;ip_address&gt;
</code></pre>
<p>Password default: <code>ubuntu</code> (akan diminta ganti saat login pertama).</p>
</li>
<li>
<p><strong>Set zona waktu</strong><br>
Pilih sesuai lokasi operasional:</p>
<table>
<thead>
<tr>
<th>Wilayah Operasional</th>
<th>Zona Waktu</th>
<th>Pilihan</th>
</tr>
</thead>
<tbody>
<tr>
<td>Sumatra, Jawa, Kalimantan Barat/Tengah</td>
<td>WIB (UTC+7)</td>
<td>Asia/Jakarta</td>
</tr>
<tr>
<td>Bali, Nusa Tenggara, Kalimantan Selatan/Timur</td>
<td>WITA (UTC+8)</td>
<td>Asia/Makassar</td>
</tr>
<tr>
<td>Maluku, Papua</td>
<td>WIT (UTC+9)</td>
<td>Asia/Jayapura</td>
</tr>
</tbody>
</table>
<p>Contoh:</p>
<pre><code class="language-bash">sudo timedatectl set-timezone Asia/Jakarta
timedatectl status
</code></pre>
</li>
<li>
<p><strong>Update sistem</strong></p>
<pre><code class="language-bash">sudo apt update &amp;&amp; sudo apt upgrade -y
sudo apt autoremove -y &amp;&amp; sudo apt clean
</code></pre>
</li>
</ol>
<h3 id="troubleshooting">Troubleshooting</h3>
<ul>
<li><strong>IP tidak terdeteksi</strong> → gunakan <code>arp -a</code> atau <code>nmap</code> untuk scanning subnet.</li>
<li><strong>SSH gagal</strong> → pastikan file <code>ssh</code> ada di partisi boot, atau gunakan monitor + keyboard sementara.</li>
<li><strong>MicroSD lambat</strong> → uji dengan:<pre><code class="language-bash">sudo hdparm -tT /dev/mmcblk0
</code></pre>
</li>
</ul>
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
<h3 id="40-kompilasi-semua-overlay">4.0 Kompilasi Semua Overlay</h3>
<p>Compile kedua overlay secara berurutan:</p>
<pre><code class="language-bash">sudo dtc -@ -I dts -O dtb dts/i2c-rtc-overlay.dts -o /boot/firmware/current/overlays/i2c-rtc-mod.dtbo
sudo dtc -@ -I dts -O dtb dts/tpm-slb9670-overlay.dts -o /boot/firmware/current/overlays/tpm-slb9670-mod.dtbo
</code></pre>
<blockquote>
<p>I/O Expander TCA9554 gunakan overlay standar <code>pca953x</code>.</p>
</blockquote>
<p><strong>Verifikasi:</strong></p>
<pre><code class="language-bash">ls /boot/firmware/current/overlays/ | grep -E 'i2c-rtc-mod|tpm-slb9670-mod'
</code></pre>
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
<h3 id="42-uji-rtc-epson-rx-8010sj-b">4.2 Uji RTC (Epson RX-8010SJ-B)</h3>
<pre><code class="language-bash">sudo apt install util-linux-extra -y
sudo hwclock -r --verbose
sudo hwclock -w --verbose
timedatectl status
</code></pre>
<h3 id="43-uji-io-expander-ti-tca9554">4.3 Uji I/O Expander (TI TCA9554)</h3>
<p>Uji (hubungkan kabel dari GPIO 0 ke 1 untuk loopback):</p>
<pre><code class="language-bash">sudo apt install gpiod -y
gpiodetect
gpioinfo
gpioset 2 0=0 &amp;&amp; gpioget 2 1  # Off
gpioset 2 0=1 &amp;&amp; gpioget 2 1  # On
</code></pre>
<p><em>Note:</em> Jika ingin mengakses TCA9554 langsung dari Node-RED menggunakan <code>node-red-contrib-tca9554</code>, pastikan driver kernel <code>gpio_pca953x</code> tidak aktif.</p>
<ul>
<li>Untuk akses sementara:<pre><code class="language-bash">sudo modprobe -r gpio_pca953x
</code></pre>
</li>
<li>Untuk menonaktifkan permanen, tambahkan tanda <code>#</code> di depan baris <code>dtoverlay=pca953x,addr=0x27</code> pada <code>/boot/firmware/config.txt</code>.</li>
</ul>
<h3 id="44-uji-trusted-platform-module-slb9670">4.4 Uji Trusted Platform Module (SLB9670)</h3>
<pre><code class="language-bash">sudo apt install tpm2-tools -y
tpm2_getrandom 8 | xxd -p
tpm2_getrandom 16 | xxd -p
tpm2_getrandom 32 | xxd -p
</code></pre>
<h3 id="45-gpio-led-pl1">4.5 GPIO &amp; LED PL1</h3>
<p>Untuk dapat mengendalikan <strong>PL1 GPIO LED</strong> di UNO‑220 dibutuhkan kombinasi konfigurasi <strong>udev rules</strong> + dependensi Python agar Node‑RED dapat melakukan <strong>akses GPIO tanpa hak <code>root</code></strong>.</p>
<ul>
<li>
<p>Tambahkan aturan udev di <code>/etc/udev/rules.d/45-gpio.rules</code>:</p>
<pre><code class="language-udev">KERNEL=="gpiochip*", GROUP="gpio", MODE="0660"
KERNEL=="gpiomem",   GROUP="gpio", MODE="0660"
</code></pre>
<p>Reload rules:</p>
<pre><code class="language-bash">sudo udevadm control --reload-rules &amp;&amp; sudo udevadm trigger
</code></pre>
</li>
<li>
<p>Tambahkan user ke grup <code>gpio</code>:</p>
<pre><code class="language-bash">sudo usermod -aG gpio ubuntu
</code></pre>
</li>
<li>
<p>Install dependensi Python untuk Node‑RED GPIO node:</p>
<pre><code class="language-bash">sudo apt install python3-rpi.gpio -y  # Untuk Node-RED GPIO
</code></pre>
</li>
</ul>
<p>LED <strong>PL1</strong> (GPIO12, pin 32 pada header Raspberry Pi, terhubung ke <code>gpiochip0</code>) dapat dikendalikan via Node‑RED node <code>rpi-gpio out</code>.<br>
Pengujian manual dapat dilakukan dengan perintah:</p>
<pre><code class="language-bash">gpioset 0 12=1   # LED ON
gpioset 0 12=0   # LED OFF
</code></pre>
<h3 id="46-serial-console-rs%E2%80%91232rs%E2%80%91485">4.6 Serial Console (RS‑232/RS‑485)</h3>
<p>UNO‑220 mendukung koneksi fisik RS‑232 dan RS‑485 yang dipetakan ke <code>/dev/ttyS0</code>. Secara default, <code>/dev/ttyS0</code> digunakan sebagai <strong>console debug</strong> oleh kernel. Agar port ini dapat digunakan aplikasi lain (misalnya komunikasi dengan perangkat eksternal atau Modbus RTU), hapus parameter berikut dari <code>/boot/firmware/cmdline.txt</code>:</p>
<pre><code class="language-text">console=serial0,115200
</code></pre>
<p>Simpan perubahan lalu reboot.</p>
<p><strong>Pengujian koneksi serial:</strong></p>
<pre><code class="language-bash">sudo apt install minicom -y
minicom -D /dev/ttyS0 -b 115200
</code></pre>
<h3 id="47-disable-usb-boot-keamanan-fisik-untuk-lapangan-rentan">4.7 Disable USB Boot (Keamanan Fisik untuk Lapangan Rentan)</h3>
<blockquote>
<p>“Disarankan untuk selalu menyertakan SD card dalam urutan BOOT_ORDER. Hal ini untuk memastikan dapat melakukan recovery dengan mudah menggunakan image rescue di microSD, jika konfigurasi boot lain gagal.”</p>
</blockquote>
<p>Untuk mencegah perangkat <strong>boot dari USB eksternal</strong> (risiko tampering di lapangan), lakukan konfigurasi EEPROM bootloader agar hanya mengizinkan boot dari microSD.</p>
<ol>
<li>
<p><strong>Install tool EEPROM</strong></p>
<pre><code class="language-bash">sudo apt install rpi-eeprom -y
</code></pre>
</li>
<li>
<p><strong>Edit konfigurasi EEPROM</strong></p>
<pre><code class="language-bash">sudo rpi-eeprom-config --edit
</code></pre>
<p>Ubah atau tambahkan baris:</p>
<pre><code class="language-ini">BOOT_ORDER=0xf41
</code></pre>
<ul>
<li><code>0xF41</code> → SD → USB → ulangi (default modern Pi, aman karena SD tetap ada).</li>
<li><code>0xF0</code>  → hanya SD card (paling ketat, tanpa fallback).</li>
</ul>
<p>Simpan dan keluar dari editor.</p>
</li>
<li>
<p><strong>Update EEPROM &amp; reboot</strong></p>
<pre><code class="language-bash">sudo rpi-eeprom-update -a
sudo reboot
</code></pre>
</li>
<li>
<p><strong>Verifikasi konfigurasi</strong></p>
<pre><code class="language-bash">sudo vcgencmd bootloader_config | grep BOOT_ORDER
</code></pre>
<p>Output harus menampilkan <code>0xF41</code> atau <code>0xF0</code>.</p>
</li>
</ol>
<p><strong>Contoh nilai BOOT_ORDER umum:</strong></p>
<table>
<thead>
<tr>
<th>Nilai</th>
<th>Urutan Boot</th>
<th>Catatan</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>0xF41</code></td>
<td>SD → USB → ulangi</td>
<td>Default modern Pi, aman</td>
</tr>
<tr>
<td><code>0xF14</code></td>
<td>USB → SD → ulangi</td>
<td>Masih aman, SD tetap ada</td>
</tr>
<tr>
<td><code>0xF461</code></td>
<td>SD → NVMe → USB → ulangi</td>
<td>Cocok untuk CM4/Pi 5 dengan SSD</td>
</tr>
<tr>
<td><code>0xF21</code></td>
<td>SD → Network (TFTP) → ulangi</td>
<td>Aman untuk network boot, SD tetap ada</td>
</tr>
<tr>
<td><code>0xF0</code></td>
<td>SD only</td>
<td>Paling ketat, tanpa fallback</td>
</tr>
</tbody>
</table>
<p><strong>Catatan:</strong></p>
<ul>
<li>Gunakan microSD industrial‑grade, karena setelah USB boot dinonaktifkan, recovery hanya bisa dilakukan via <strong>Raspberry Pi Imager</strong> dengan flashing ulang bootloader image.</li>
<li>Jika update EEPROM gagal, fallback ke metode resmi Raspberry Pi Imager untuk restore bootloader.</li>
</ul>
<p><strong>Troubleshooting Hardware:</strong></p>
<ul>
<li>Jika overlay gagal terpasang:<pre><code class="language-bash">dmesg | grep i2c
i2cdetect -y 1
</code></pre>
</li>
<li>Setelah melakukan perubahan pada <code>config.txt</code>, lakukan reboot agar overlay aktif.</li>
<li>Gunakan <code>ls /boot/firmware/current/overlays/</code> untuk memastikan file <code>.dtbo</code> hasil compile tersedia.</li>
</ul>
<hr>
<h2 id="5-instalasi-node%E2%80%91red">5. Instalasi Node‑RED</h2>
<ol>
<li>
<p><strong>Update sistem</strong></p>
<pre><code class="language-bash">sudo apt update &amp;&amp; sudo apt upgrade -y
</code></pre>
</li>
<li>
<p><strong>Jalankan installer resmi Node‑RED</strong><br>
Script ini akan menghapus instalasi lama, memasang Node.js sesuai versi yang dipilih, menginstal Node‑RED terbaru, serta menyiapkan service systemd.</p>
<p>Pilih Node.js 22 LTS dengan opsi <code>--node22</code> dan tambahkan opsi <code>--pi</code> untuk sekaligus memasang node khusus Raspberry Pi (GPIO, I²C, dsb.):</p>
<pre><code class="language-bash">bash &lt;(curl -sL https://raw.githubusercontent.com/node-red/linux-installers/master/deb/update-nodejs-and-nodered) --confirm-root --node22 --pi
</code></pre>
</li>
<li>
<p><strong>Aktifkan service</strong></p>
<pre><code class="language-bash">sudo systemctl enable nodered.service
sudo systemctl start nodered.service
</code></pre>
</li>
<li>
<p><strong>Akses editor</strong><br>
Buka browser ke alamat:<br>
<code>http://&lt;ip&gt;:1880</code></p>
</li>
</ol>
<h3 id="51-amankan-akses-node%E2%80%91red">5.1 Amankan Akses Node‑RED</h3>
<p>Edit file <code>~/.node-red/settings.js</code>:</p>
<pre><code class="language-js">adminAuth: {
    type: "credentials",
    users: [{
        username: "admin",
        password: "&lt;hash&gt;",
        permissions: "*"
    }]
},
</code></pre>
<p>Untuk mengisi nilai <code>&lt;hash&gt;</code> pada konfigurasi <code>settings.js</code>, jalankan perintah berikut:</p>
<pre><code class="language-bash">node-red admin hash-pw
</code></pre>
<p>Salin hasil hash ke field <code>password</code> pada konfigurasi <code>adminAuth</code>.</p>
<p>Setelah itu, restart service agar perubahan aktif:</p>
<pre><code class="language-bash">sudo systemctl restart nodered.service
</code></pre>
<h3 id="52-aktivasi-logging-untuk-monitoring-io-dan-deteksi-error-hardware">5.2 Aktivasi Logging untuk Monitoring I/O dan Deteksi Error Hardware</h3>
<p>Edit <code>~/.node-red/settings.js</code> untuk mengaktifkan logging detail. Logging ini berguna untuk:</p>
<ul>
<li><strong>Monitoring I/O</strong>: menangkap event GPIO, I²C expander (TCA9554), dan komunikasi serial.</li>
<li><strong>Deteksi error hardware</strong>: misalnya kegagalan RTC (RX‑8010) atau TPM (SLB9670).</li>
<li><strong>Audit</strong>: mencatat perubahan konfigurasi dan akses API.</li>
</ul>
<pre><code class="language-js">logging: {
    console: {
        // Gunakan "info" untuk operasi normal
        // Naikkan ke "debug" saat commissioning
        // Gunakan "trace" hanya untuk troubleshooting detail
        level: "info",   // "debug" untuk detail commissioning, "trace" untuk troubleshooting mendalam
        metrics: true,   // Log node events (receive/send) dan memory usage (monitoring resource hardware)
        audit: true      // Log API access untuk melacak perubahan konfigurasi
    }
}
</code></pre>
<p><strong>Catatan Operasional:</strong></p>
<ul>
<li><strong>Metrics</strong>: mencatat event inject/receive/send, misalnya perubahan status GPIO expander.</li>
<li><strong>Memory logs</strong>: setiap 15 detik, Node‑RED mencatat heap usage. Berguna untuk mendeteksi potensi overload pada RPi4B ARM64.</li>
<li><strong>Level rekomendasi</strong>:
<ul>
<li><code>info</code> → operasi normal (default).</li>
<li><code>debug</code> → commissioning, validasi hardware.</li>
<li><code>trace</code> → troubleshooting detail, gunakan hanya sementara karena log akan sangat besar.</li>
</ul>
</li>
</ul>
<p><strong>Restart service agar konfigurasi aktif:</strong></p>
<pre><code class="language-bash">sudo systemctl restart nodered.service
</code></pre>
<p><strong>Melihat log:</strong></p>
<pre><code class="language-bash">sudo journalctl -u nodered.service -f
# atau
node-red-log
</code></pre>
<p><strong>Filter hardware issues:</strong></p>
<pre><code class="language-bash">sudo journalctl -u nodered.service | grep "error\|I/O"
</code></pre>
<p><strong>Troubleshooting:</strong></p>
<ul>
<li>Jika terjadi error npm terkait memori, jalankan Node‑RED dengan opsi:<pre><code class="language-bash">node-red-pi --max-old-space-size=512
</code></pre>
</li>
<li>Semua log tersimpan di journal systemd, sehingga tetap terintegrasi dengan mekanisme logrotate.</li>
</ul>
<h3 id="53-system-resource-monitoring-cpu-temperature-memory-usage-cpu-load-disk-usage-uptime-dengan-node%E2%80%91red">5.3 System Resource Monitoring (CPU Temperature, Memory Usage, CPU Load, Disk Usage, Uptime) dengan Node‑RED</h3>
<p>Untuk memantau metrik sistem secara real‑time (CPU Temperature, Memory Usage, CPU Load, Disk Usage, Uptime), kita gunakan <strong>exec node</strong> di Node‑RED untuk menjalankan perintah Linux, lalu visualisasikan hasilnya di dashboard dan simpan ke file CSV untuk integrasi dengan Rapid SCADA (lihat 7.2).</p>
<p><strong>Threshold alert yang disarankan:</strong></p>
<ul>
<li>Temperature &gt; 80 °C</li>
<li>CPU Load &gt; 2.0 (1‑min average)</li>
<li>Memory Usage &gt; 80%</li>
<li>Disk Usage &gt; 80%</li>
</ul>
<h3 id="531-instal-node-tambahan">5.3.1 Instal Node Tambahan</h3>
<p>Di editor Node‑RED (<code>http://&lt;ip&gt;:1880</code>), buka <strong>Menu → Manage palette → Install</strong>:</p>
<ul>
<li><code>node-red-dashboard</code> (untuk UI gauge/chart)</li>
</ul>
<p>Restart Node‑RED setelah instalasi.</p>
<h3 id="532-flow-lengkap">5.3.2 Flow Lengkap</h3>
<p>Flow berikut melakukan polling setiap 10 detik, mengeksekusi perintah sistem, menggabungkan hasil, menuliskannya ke CSV, dan menampilkan di dashboard.</p>
<p><strong>Langkah Import:</strong></p>
<ol>
<li>Salin JSON di bawah.</li>
<li>Di Node‑RED editor, pilih <strong>Menu → Import → Clipboard</strong>.</li>
<li>Paste JSON, lalu klik <strong>Import</strong>.</li>
</ol>
<details>
<summary>Klik untuk lihat JSON Flow</summary>
<pre><code class="language-json">[
  {
    "id": "fe919f4f898a361a",
    "type": "inject",
    "z": "2aa78c88.04da44",
    "name": "Poll 10s",
    "props": [
      {
        "p": "payload",
        "v": "",
        "vt": "str"
      },
      {
        "p": "topic",
        "v": "",
        "vt": "str"
      }
    ],
    "repeat": "10",
    "once": true,
    "onceDelay": "5",
    "x": 120,
    "y": 220,
    "wires": [
      [
        "fca6b8400889d4f3",
        "27f74b0ccf05dca3",
        "231f57b96b131413",
        "450425f381c32b46",
        "01694ddd54ec6a73"
      ]
    ]
  },
  {
    "id": "f1188809e56ab2de",
    "type": "exec",
    "z": "2aa78c88.04da44",
    "command": "nproc --all",
    "addpay": "",
    "append": "",
    "timer": "",
    "winHide": false,
    "name": "Get CPU Cores",
    "x": 340,
    "y": 200,
    "wires": [
      [
        "d204093578cae4b4"
      ],
      [],
      []
    ]
  },
  {
    "id": "fca6b8400889d4f3",
    "type": "exec",
    "z": "2aa78c88.04da44",
    "command": "bash -c 'if sudo command -v vcgencmd &gt;/dev/null 2&gt;&amp;1; then sudo vcgencmd measure_temp | grep -o \"[0-9]*\\.[0-9]*\"; else awk \"{printf(\\\"%.1f\\\", \\$1/1000)}\" /sys/class/thermal/thermal_zone0/temp; fi'",
    "addpay": "",
    "append": "",
    "timer": "",
    "winHide": false,
    "name": "CPU Temp",
    "x": 330,
    "y": 80,
    "wires": [
      [
        "23fd137e13f7dd24"
      ],
      [],
      []
    ]
  },
  {
    "id": "23fd137e13f7dd24",
    "type": "change",
    "z": "2aa78c88.04da44",
    "name": "Set Topic Temp",
    "rules": [
      {
        "t": "set",
        "p": "topic",
        "pt": "msg",
        "to": "Temperature",
        "tot": "str"
      }
    ],
    "x": 560,
    "y": 80,
    "wires": [
      [
        "71d65c821a231f67"
      ]
    ]
  },
  {
    "id": "27f74b0ccf05dca3",
    "type": "exec",
    "z": "2aa78c88.04da44",
    "command": "awk '{print $1}' /proc/loadavg",
    "addpay": "",
    "append": "",
    "timer": "",
    "winHide": false,
    "name": "CPU Load",
    "x": 330,
    "y": 140,
    "wires": [
      [
        "a75ecd76131c54e9"
      ],
      [],
      []
    ]
  },
  {
    "id": "a75ecd76131c54e9",
    "type": "change",
    "z": "2aa78c88.04da44",
    "name": "Set Topic Load",
    "rules": [
      {
        "t": "set",
        "p": "topic",
        "pt": "msg",
        "to": "Load",
        "tot": "str"
      },
      {
        "t": "set",
        "p": "payload",
        "pt": "msg",
        "to": "($number($trim(payload)) ? $number($trim(payload)) : 0) / ($flowContext(\"cpu_cores\") ? $flowContext(\"cpu_cores\") : 4) * 100.0 ~&gt; $round(2)\t",
        "tot": "jsonata"
      }
    ],
    "x": 560,
    "y": 140,
    "wires": [
      [
        "71d65c821a231f67"
      ]
    ]
  },
  {
    "id": "231f57b96b131413",
    "type": "exec",
    "z": "2aa78c88.04da44",
    "command": "free | awk '/Mem/ {printf(\"%.2f\", $3/$2 * 100.0)}'",
    "addpay": "",
    "append": "",
    "timer": "",
    "winHide": false,
    "name": "Memory Usage",
    "x": 340,
    "y": 260,
    "wires": [
      [
        "fe468f39b7e6bb81"
      ],
      [],
      []
    ]
  },
  {
    "id": "fe468f39b7e6bb81",
    "type": "change",
    "z": "2aa78c88.04da44",
    "name": "Set Topic Mem",
    "rules": [
      {
        "t": "set",
        "p": "topic",
        "pt": "msg",
        "to": "Memory",
        "tot": "str"
      }
    ],
    "x": 560,
    "y": 260,
    "wires": [
      [
        "71d65c821a231f67"
      ]
    ]
  },
  {
    "id": "450425f381c32b46",
    "type": "exec",
    "z": "2aa78c88.04da44",
    "command": "df -h / | awk 'NR==2 {print $5}' | tr -d '%' | awk '{print $1 + 0}'",
    "addpay": "",
    "append": "",
    "timer": "",
    "winHide": false,
    "name": "Disk Usage",
    "x": 330,
    "y": 380,
    "wires": [
      [
        "49baac92701386dd"
      ],
      [],
      []
    ]
  },
  {
    "id": "49baac92701386dd",
    "type": "change",
    "z": "2aa78c88.04da44",
    "name": "Set Topic Disk",
    "rules": [
      {
        "t": "set",
        "p": "topic",
        "pt": "msg",
        "to": "Disk",
        "tot": "str"
      },
      {
        "t": "set",
        "p": "payload",
        "pt": "msg",
        "to": "$trim(payload)",
        "tot": "jsonata"
      }
    ],
    "x": 560,
    "y": 380,
    "wires": [
      [
        "71d65c821a231f67"
      ]
    ]
  },
  {
    "id": "01694ddd54ec6a73",
    "type": "exec",
    "z": "2aa78c88.04da44",
    "command": "awk '{print $1}' /proc/uptime",
    "addpay": "",
    "append": "",
    "timer": "",
    "winHide": false,
    "name": "Uptime",
    "x": 320,
    "y": 320,
    "wires": [
      [
        "198a0c0ac2416c0c"
      ],
      [],
      []
    ]
  },
  {
    "id": "198a0c0ac2416c0c",
    "type": "change",
    "z": "2aa78c88.04da44",
    "name": "Set Topic Uptime",
    "rules": [
      {
        "t": "set",
        "p": "topic",
        "pt": "msg",
        "to": "Uptime",
        "tot": "str"
      },
      {
        "t": "set",
        "p": "payload",
        "pt": "msg",
        "to": "($number($trim(payload)) ? $number($trim(payload)) : 0) / 3600 ~&gt; $round(2)",
        "tot": "jsonata"
      }
    ],
    "x": 570,
    "y": 320,
    "wires": [
      [
        "71d65c821a231f67"
      ]
    ]
  },
  {
    "id": "71d65c821a231f67",
    "type": "join",
    "z": "2aa78c88.04da44",
    "name": "Join Metrics",
    "mode": "manual",
    "build": "object",
    "property": "payload",
    "timeout": "10",
    "count": "5",
    "x": 830,
    "y": 240,
    "wires": [
      [
        "a7f8cf77487b9a83",
        "891b1b27.c66998",
        "30378886.4cc918",
        "500cb64f.5bd7c8",
        "70e60250.56125c",
        "2280e8e0.31af58"
      ]
    ]
  },
  {
    "id": "a7f8cf77487b9a83",
    "type": "function",
    "z": "2aa78c88.04da44",
    "name": "Format CSV",
    "func": "let ts = moment().utc().format('YYYY.MM.DD HH:mm:ss');\nlet p = msg.payload;\nlet row = `${ts},${p.Temperature},${p.Load},${p.Memory},${p.Uptime},${p.Disk}`;\nmsg.payload = row;\nreturn msg;",
    "outputs": 1,
    "timeout": "",
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "libs": [
      {
        "var": "moment",
        "module": "moment"
      }
    ],
    "x": 1070,
    "y": 300,
    "wires": [
      [
        "375bd16453cc4dd0"
      ]
    ]
  },
  {
    "id": "375bd16453cc4dd0",
    "type": "file",
    "z": "2aa78c88.04da44",
    "name": "Append CSV",
    "filename": "/home/ubuntu/uno220_stat.csv",
    "filenameType": "str",
    "appendNewline": true,
    "createDir": true,
    "overwriteFile": "false",
    "x": 1270,
    "y": 300,
    "wires": [
      []
    ]
  },
  {
    "id": "8f5767ef7b5ad18c",
    "type": "change",
    "z": "2aa78c88.04da44",
    "name": "",
    "rules": [
      {
        "t": "set",
        "p": "payload",
        "pt": "msg",
        "to": "Timestamp,Temperature,Load,Memory,Uptime,Disk",
        "tot": "str"
      }
    ],
    "action": "",
    "property": "",
    "from": "",
    "to": "",
    "reg": false,
    "x": 1080,
    "y": 340,
    "wires": [
      [
        "6aef7d561dd3b777"
      ]
    ]
  },
  {
    "id": "3668be62b36e7593",
    "type": "inject",
    "z": "2aa78c88.04da44",
    "name": "Clear",
    "props": [
      {
        "p": "payload"
      },
      {
        "p": "topic",
        "vt": "str"
      }
    ],
    "repeat": "60",
    "crontab": "",
    "once": true,
    "onceDelay": 0.1,
    "topic": "",
    "payload": "",
    "payloadType": "date",
    "x": 890,
    "y": 340,
    "wires": [
      [
        "8f5767ef7b5ad18c"
      ]
    ]
  },
  {
    "id": "6aef7d561dd3b777",
    "type": "file",
    "z": "2aa78c88.04da44",
    "name": "Clear CSV",
    "filename": "/home/ubuntu/uno220_stat.csv",
    "filenameType": "str",
    "appendNewline": true,
    "createDir": false,
    "overwriteFile": "true",
    "encoding": "none",
    "x": 1270,
    "y": 340,
    "wires": [
      []
    ]
  },
  {
    "id": "891b1b27.c66998",
    "type": "ui_gauge",
    "z": "2aa78c88.04da44",
    "name": "",
    "group": "dafb9311.e6497",
    "order": 1,
    "width": 0,
    "height": 0,
    "gtype": "gage",
    "title": "Temperature",
    "label": "",
    "format": "{{msg.payload.Temperature}}°C",
    "min": 0,
    "max": "100",
    "colors": [
      "#00b500",
      "#e6e600",
      "#ca3838"
    ],
    "seg1": "",
    "seg2": "",
    "diff": false,
    "className": "",
    "x": 1070,
    "y": 100,
    "wires": []
  },
  {
    "id": "30378886.4cc918",
    "type": "ui_template",
    "z": "2aa78c88.04da44",
    "group": "dafb9311.e6497",
    "name": "CPU Load",
    "order": 3,
    "width": 6,
    "height": 2,
    "format": "&lt;link rel=\"stylesheet\" href=\"https://www.w3schools.com/w3css/4/w3.css\"&gt;\n&lt;div&gt;\n    &lt;b&gt;CPU Load:&lt;/b&gt;\n    &lt;div class=\"w3-light-grey w3-xlarge w3-border w3-round-medium\"&gt;\n        &lt;div class=\"w3-container w3-green w3-round-medium\" style=\"width:{{msg.payload.Load}}%;color: #000!important;\"&gt;{{msg.payload.Load}}%&lt;/div&gt;\n    &lt;/div&gt;\n&lt;/div&gt;",
    "storeOutMessages": true,
    "fwdInMessages": true,
    "resendOnRefresh": true,
    "templateScope": "local",
    "className": "",
    "x": 1070,
    "y": 140,
    "wires": [
      []
    ]
  },
  {
    "id": "500cb64f.5bd7c8",
    "type": "ui_gauge",
    "z": "2aa78c88.04da44",
    "name": "",
    "group": "d597c1ca.fe019",
    "order": 1,
    "width": 0,
    "height": 0,
    "gtype": "gage",
    "title": "Memory Usage",
    "label": "",
    "format": "{{msg.payload.Memory}}%",
    "min": 0,
    "max": "100",
    "colors": [
      "#00b500",
      "#e6e600",
      "#ca3838"
    ],
    "seg1": "",
    "seg2": "",
    "diff": false,
    "className": "",
    "x": 1080,
    "y": 180,
    "wires": []
  },
  {
    "id": "70e60250.56125c",
    "type": "ui_text",
    "z": "2aa78c88.04da44",
    "group": "dafb9311.e6497",
    "order": 2,
    "width": 0,
    "height": 0,
    "name": "",
    "label": "Uptime",
    "format": "{{msg.payload.Uptime}}hour(s)",
    "layout": "row-center",
    "className": "",
    "style": false,
    "font": "",
    "fontSize": "",
    "color": "#000000",
    "x": 1060,
    "y": 220,
    "wires": []
  },
  {
    "id": "2280e8e0.31af58",
    "type": "ui_template",
    "z": "2aa78c88.04da44",
    "group": "d597c1ca.fe019",
    "name": "Disk Usage",
    "order": 3,
    "width": 6,
    "height": 2,
    "format": "&lt;link rel=\"stylesheet\" href=\"https://www.w3schools.com/w3css/4/w3.css\"&gt;\n&lt;div&gt;\n    &lt;b&gt;Disk Usage:&lt;/b&gt;\n    &lt;div class=\"w3-light-grey w3-xlarge w3-border w3-round-medium\"&gt;\n        &lt;div class=\"w3-container w3-green w3-round-medium\" style=\"width:{{msg.payload.Disk}}%;color: #000!important;\"&gt;{{msg.payload.Disk}}%&lt;/div&gt;\n    &lt;/div&gt;\n&lt;/div&gt;",
    "storeOutMessages": true,
    "fwdInMessages": true,
    "resendOnRefresh": true,
    "templateScope": "local",
    "className": "",
    "x": 1070,
    "y": 260,
    "wires": [
      []
    ]
  },
  {
    "id": "d204093578cae4b4",
    "type": "change",
    "z": "2aa78c88.04da44",
    "name": "Store Cores",
    "rules": [
      {
        "t": "set",
        "p": "cpu_cores",
        "pt": "flow",
        "to": "$number($trim(payload)) ? $number($trim(payload)) : 4",
        "tot": "jsonata"
      }
    ],
    "action": "",
    "property": "",
    "from": "",
    "to": "",
    "reg": false,
    "x": 550,
    "y": 200,
    "wires": [
      []
    ]
  },
  {
    "id": "ebf66d26260831f1",
    "type": "inject",
    "z": "2aa78c88.04da44",
    "name": "Init 3s",
    "props": [
      {
        "p": "payload"
      },
      {
        "p": "topic",
        "vt": "str"
      }
    ],
    "repeat": "",
    "crontab": "",
    "once": true,
    "onceDelay": "3",
    "topic": "",
    "payload": "",
    "payloadType": "str",
    "x": 130,
    "y": 160,
    "wires": [
      [
        "f1188809e56ab2de"
      ]
    ]
  },
  {
    "id": "dafb9311.e6497",
    "type": "ui_group",
    "name": "",
    "tab": "d7c34f92.385aa",
    "order": 1,
    "disp": true,
    "width": 6,
    "collapse": false
  },
  {
    "id": "d597c1ca.fe019",
    "type": "ui_group",
    "name": "",
    "tab": "d7c34f92.385aa",
    "order": 2,
    "disp": true,
    "width": 6,
    "collapse": false
  },
  {
    "id": "d7c34f92.385aa",
    "type": "ui_tab",
    "name": "UNO-220",
    "icon": "dashboard",
    "disabled": false,
    "hidden": false
  },
  {
    "id": "41ff339a7cb34b56",
    "type": "global-config",
    "env": [],
    "modules": {
      "node-red-dashboard": "3.6.6"
    }
  }
]
</code></pre>
</details>
<h3 id="533-penjelasan-flow">5.3.3 Penjelasan Flow</h3>
<ul>
<li><strong>Inject node</strong>: trigger setiap 10 detik.</li>
<li><strong>Exec nodes</strong>: jalankan perintah Linux untuk ambil metrik.</li>
<li><strong>Join node</strong>: gabungkan hasil menjadi satu objek (<code>msg.payload.Temperature</code>, <code>Load</code>, <code>Memory</code>, <code>Disk</code>, <code>Uptime</code>).</li>
<li><strong>Function node</strong>: format ke CSV dengan timestamp ISO.</li>
<li><strong>File node</strong>: append ke <code>/home/ubuntu/uno220_stat.csv</code>.</li>
<li><strong>Dashboard nodes</strong>: gauge untuk Temp, Load, Memory, Disk; text untuk Uptime.</li>
</ul>
<h3 id="534-persiapan-csv">5.3.4 Persiapan CSV</h3>
<p>Buat header file CSV sekali:</p>
<pre><code class="language-bash">echo "Timestamp,Temperature,Load,Memory,Uptime,Disk" &gt; /home/ubuntu/uno220_stat.csv
</code></pre>
<h3 id="535-akses-dashboard">5.3.5 Akses Dashboard</h3>
<p>Buka:<br>
<code>http://&lt;ip&gt;:1880/ui</code></p>
<h3 id="536-troubleshooting">5.3.6 Troubleshooting</h3>
<ul>
<li>Jika <code>vcgencmd</code> tidak tersedia di Ubuntu, flow otomatis fallback ke <code>/sys/class/thermal/thermal_zone0/temp</code>.</li>
<li>Jika <code>join</code> timeout, naikkan <code>timeout</code> ke 15 detik.</li>
<li>Cek hasil CSV:<pre><code class="language-bash">tail -f /home/ubuntu/uno220_stat.csv
</code></pre>
</li>
</ul>
<hr>
<h2 id="6-instalasi-zerotier">6. Instalasi ZeroTier</h2>
<p>ZeroTier digunakan untuk menyediakan konektivitas aman antar perangkat tanpa perlu membuka port publik. UNO‑220 akan bergabung ke jaringan virtual ZeroTier dan dapat diakses menggunakan alamat IP internal ZeroTier.</p>
<h3 id="61-instalasi-paket">6.1 Instalasi Paket</h3>
<pre><code class="language-bash">curl -s https://install.zerotier.com | sudo bash
sudo systemctl enable zerotier-one
sudo systemctl start zerotier-one
</code></pre>
<p>Verifikasi instalasi:</p>
<pre><code class="language-bash">zerotier-cli info
</code></pre>
<p>Output normal: <code>200 info &lt;node_id&gt; &lt;version&gt; ONLINE</code></p>
<h3 id="62-join-ke-network">6.2 Join ke Network</h3>
<pre><code class="language-bash">sudo zerotier-cli join &lt;network_id&gt;
</code></pre>
<ul>
<li><code>&lt;network_id&gt;</code> adalah ID jaringan yang sudah dibuat di controller (publik atau self‑hosted).</li>
<li>Cek status:<pre><code class="language-bash">zerotier-cli listnetworks
</code></pre>
</li>
</ul>
<h3 id="63-otorisasi-node">6.3 Otorisasi Node</h3>
<ul>
<li><strong>Jika menggunakan controller publik (<code>my.zerotier.com</code>)</strong>: login ke dashboard, pilih network, lalu authorize <code>&lt;node_id&gt;</code>.</li>
<li><strong>Jika menggunakan controller self‑hosted</strong>: lakukan otorisasi node melalui web UI atau API controller internal. Pastikan node muncul di daftar anggota network, lalu tandai sebagai authorized.</li>
</ul>
<h3 id="64-verifikasi-koneksi">6.4 Verifikasi Koneksi</h3>
<ul>
<li>Cek interface ZeroTier:<pre><code class="language-bash">ip addr show zt*
</code></pre>
</li>
<li>Gunakan IP ZeroTier untuk SSH:<pre><code class="language-bash">ssh ubuntu@&lt;ip_zerotier&gt;
</code></pre>
</li>
<li>Uji konektivitas antar node:<pre><code class="language-bash">ping &lt;ip_zerotier_peer&gt;
</code></pre>
</li>
</ul>
<h3 id="65-catatan-keamanan">6.5 Catatan Keamanan</h3>
<ul>
<li>Gunakan <strong>IP ZeroTier</strong> untuk remote SSH, bukan IP publik.</li>
<li>Pastikan firewall (<code>ufw</code>) hanya membuka port yang diperlukan (22, 80, 443, 1880).</li>
<li>ZeroTier menggunakan UDP port 9993; pastikan tidak diblokir di perangkat maupun firewall jaringan.</li>
<li>Untuk self‑hosted controller, pastikan server controller terlindungi dengan TLS/HTTPS dan hanya dapat diakses oleh admin.</li>
</ul>
<h3 id="66-troubleshooting">6.6 Troubleshooting</h3>
<ul>
<li>Jika join gagal:<pre><code class="language-bash">journalctl -u zerotier-one -f
</code></pre>
</li>
<li>Jika node tidak muncul di controller:
<ul>
<li>Pastikan network ID benar.</li>
<li>Pastikan perangkat dapat menjangkau server controller (cek UDP 9993).</li>
</ul>
</li>
<li>Jika IP ZeroTier tidak muncul:<pre><code class="language-bash">sudo systemctl restart zerotier-one
zerotier-cli listnetworks
</code></pre>
</li>
</ul>
<hr>
<h2 id="7-instalasi-rapid-scada-643-nginx">7. Instalasi Rapid SCADA 6.4.3 &amp; Nginx</h2>
<h3 id="71-net-80-runtime">7.1 .NET 8.0 Runtime</h3>
<p>Rapid SCADA 6.4.3 membutuhkan <strong>ASP.NET Core Runtime 8.0.x</strong>.<br>
Instalasi di Ubuntu 25.10 ARM64:</p>
<pre><code class="language-bash">sudo apt update &amp;&amp; sudo apt install -y aspnetcore-runtime-8.0
dotnet --info   # pastikan versi 8.0.x tampil
</code></pre>
<h3 id="72-rapid-scada">7.2 Rapid SCADA</h3>
<h4 id="opsi-a-%E2%80%93-instalasi-via-paket-deb-disarankan">Opsi A – Instalasi via Paket <code>.deb</code> (disarankan)</h4>
<ol>
<li>Unduh dan ekstrak paket ZIP resmi:<pre><code class="language-bash">mkdir -p /home/ubuntu/scada
cd /home/ubuntu/scada
wget https://rapidscada.org/download/rapidscada_6.4.3_windows_en.zip
unzip rapidscada_6.4.3_windows_en.zip -d scada
cd scada
</code></pre>
</li>
<li>Instal paket <code>.deb</code>:<pre><code class="language-bash">sudo dpkg -i rapidscada_6.4.3-1_all.deb
</code></pre>
</li>
<li>Aktifkan dan jalankan service:<pre><code class="language-bash">sudo systemctl enable scadaagent6 scadaserver6 scadacomm6 scadaweb6
sudo systemctl start scadaagent6 scadaserver6 scadacomm6 scadaweb6
</code></pre>
</li>
</ol>
<h4 id="opsi-b-%E2%80%93-instalasi-manual-opsional">Opsi B – Instalasi Manual (opsional)</h4>
<p>Digunakan jika <code>.deb</code> gagal atau butuh kustomisasi.</p>
<pre><code class="language-bash">sudo cp -r scada/* /opt/scada/
sudo chmod +x /opt/scada/make_executable.sh
sudo /opt/scada/make_executable.sh
sudo cp daemons/* /etc/systemd/system/
sudo systemctl enable scadaagent6 scadaserver6 scadacomm6 scadaweb6
sudo systemctl start scadaagent6 scadaserver6 scadacomm6 scadaweb6
</code></pre>
<h4 id="integrasi-csv-trending">Integrasi CSV Trending</h4>
<ul>
<li>Driver: <strong>CSV File Reader</strong></li>
<li>File: <code>/home/ubuntu/uno220_stat.csv</code></li>
<li>Delimiter: <code>,</code> ; Header: Yes</li>
<li>Map kolom → tag: <code>Timestamp</code>, <code>Temperature</code>, <code>Load</code>, <code>Memory</code>, <code>Uptime</code>, <code>Disk</code></li>
</ul>
<h3 id="73-ram-drive-untuk-log">7.3 RAM Drive untuk Log</h3>
<pre><code class="language-bash">sudo mkdir /var/log/scada
sudo cp /etc/fstab /etc/fstab.bak
echo "tmpfs /var/log/scada tmpfs defaults,noatime,size=100m,mode=1777 0 0" | sudo tee -a /etc/fstab
sudo mount -a
</code></pre>
<h3 id="74-nginx-reverse-proxy">7.4 Nginx Reverse Proxy</h3>
<p>Instalasi:</p>
<pre><code class="language-bash">sudo apt install nginx -y
sudo systemctl enable nginx
</code></pre>
<p>Salin konfigurasi bawaan:</p>
<pre><code class="language-bash">sudo cp /home/ubuntu/scada/scada/nginx/default /etc/nginx/sites-available/scada
sudo ln -s /etc/nginx/sites-available/scada /etc/nginx/sites-enabled/
</code></pre>
<p>Validasi &amp; restart:</p>
<pre><code class="language-bash">sudo nginx -t
sudo systemctl restart nginx
</code></pre>
<p><strong>SSL:</strong></p>
<ul>
<li>Self‑signed:<pre><code class="language-bash">sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
-keyout /etc/ssl/private/nginx-selfsigned.key \
-out /etc/ssl/certs/nginx-selfsigned.crt
</code></pre>
</li>
<li>Produksi: gunakan Let’s Encrypt (<code>sudo certbot --nginx</code>).</li>
</ul>
<h3 id="75-verifikasi">7.5 Verifikasi</h3>
<p>Cek status service:</p>
<pre><code class="language-bash">systemctl status scadaserver6 scadacomm6 scadaweb6
</code></pre>
<p>Akses web:</p>
<ul>
<li><code>http://&lt;ip_zerotier&gt;</code> atau <code>https://&lt;ip_zerotier&gt;</code></li>
<li>Login default: <strong>admin / scada</strong></li>
</ul>
<hr>
<h2 id="8-instalasi-modbus-tcp-to-rtu-gateway">8. Instalasi Modbus TCP to RTU Gateway</h2>
<p><code>mbusd</code> memungkinkan UNO‑220 menjembatani perangkat Modbus RTU (RS‑232/RS‑485) ke Modbus TCP server. Dengan ini, Node‑RED maupun Rapid SCADA bisa membaca data RTU melalui TCP port 502.</p>
<h3 id="82-instalasi">8.2 Instalasi</h3>
<pre><code class="language-bash">sudo apt update
sudo apt install -y build-essential cmake git

git clone https://github.com/3cky/mbusd.git
cd mbusd
mkdir build &amp;&amp; cd build
cmake -DCMAKE_INSTALL_PREFIX=/usr ..
make
sudo make install
</code></pre>
<h3 id="83-konfigurasi">8.3 Konfigurasi</h3>
<p>Buat file <code>/etc/mbusd/mbusd-ttyS0.conf</code>:</p>
<pre><code>device   = /dev/ttyS0
speed    = 9600
mode     = 8N1
rs485    = yes
address  = 0.0.0.0
port     = 502
maxconn  = 32
retries  = 3
pause    = 100
wait     = 500
timeout  = 60
logfile  = /var/log/mbusd.log
verbosity = 2
</code></pre>
<h3 id="84-jalankan-sebagai-service">8.4 Jalankan sebagai service</h3>
<pre><code class="language-bash">sudo systemctl start mbusd@ttyS0.service
sudo systemctl enable mbusd@ttyS0.service
sudo systemctl status mbusd@ttyS0.service
</code></pre>
<h3 id="85-uji-koneksi">8.5 Uji koneksi</h3>
<p>Dari host lain:</p>
<pre><code class="language-bash">modpoll -m tcp -t 3 -r 1 -c 10 &lt;ip_uno220&gt;
</code></pre>
<p>→ Harus mendapat respons register dari slave RTU.</p>
<h3 id="86-integrasi">8.6 Integrasi</h3>
<ul>
<li><strong>Node‑RED</strong>: gunakan node <code>node-red-contrib-modbus</code> → Modbus TCP client ke <code>tcp://&lt;ip_uno220&gt;:502</code>.</li>
<li><strong>Rapid SCADA</strong>: tambahkan channel Modbus TCP pointing ke UNO‑220.</li>
</ul>
<h3 id="87-keamanan">8.7 Keamanan</h3>
<ul>
<li>Batasi akses port 502 hanya dari jaringan ZeroTier:<pre><code class="language-bash">sudo ufw allow from &lt;zerotier_subnet&gt; to any port 502 proto tcp
</code></pre>
</li>
<li>Jangan buka port 502 ke publik.</li>
</ul>
<hr>
<h2 id="9-instalasi-scada-grafana-proxy">9. Instalasi Scada Grafana Proxy</h2>
<p><code>scada-grafana-proxy</code> adalah server proxy ringan berbasis Node.js yang:</p>
<ul>
<li>Mengambil data dari <strong>Rapid SCADA 6</strong> maupun <strong>Rapid SCADA 5</strong> via REST API.</li>
<li>Mengubah format respons menjadi seragam dan kompatibel dengan <strong>Grafana Infinity Datasource</strong>.</li>
<li>Menyediakan <strong>Basic Authentication</strong> untuk keamanan.</li>
<li>Mendukung konfigurasi berbasis environment (<code>.env</code>).</li>
<li>Menyediakan <strong>health check endpoint</strong> untuk monitoring.</li>
</ul>
<h3 id="92-instalasi">9.2 Instalasi</h3>
<pre><code class="language-bash"># Clone repo
git clone https://github.com/kumajaya/scada-grafana-proxy.git
cd scada-grafana-proxy

# Install dependensi
npm install
</code></pre>
<h3 id="93-konfigurasi">9.3 Konfigurasi</h3>
<p>Salin contoh environment:</p>
<pre><code class="language-bash">cp env-example .env
nano .env
</code></pre>
<p>Isi variabel sesuai kebutuhan, misalnya:</p>
<pre><code>PROXY_PORT=3000
PROXY_USER=admin
PROXY_PASS=admin
SCADA_BASE_URL=http://localhost:10008
SCADA_USERNAME=admin
SCADA_PASSWORD=admin
SCADA_ARCHIVEBIT_THRESHOLD=24
SCADA5_BASE_URL=http://localhost/grafanadataprovider
</code></pre>
<h3 id="94-jalankan">9.4 Jalankan</h3>
<pre><code class="language-bash">npm start
</code></pre>
<p>Akses proxy di:<br>
<code>http://&lt;ip_uno220&gt;:3000</code></p>
<h3 id="95-systemd-service">9.5 Systemd Service</h3>
<p>File <code>scada-grafana-proxy.service</code> sudah disediakan. Install:</p>
<pre><code class="language-bash">sudo cp scada-grafana-proxy.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable scada-grafana-proxy
sudo systemctl start scada-grafana-proxy
</code></pre>
<p>Cek status:</p>
<pre><code class="language-bash">systemctl status scada-grafana-proxy
</code></pre>
<p>Uji health check:</p>
<pre><code class="language-bash">curl -u admin:admin http://&lt;ip_uno220&gt;:3000/health
</code></pre>
<h3 id="96-integrasi-dengan-grafana">9.6 Integrasi dengan Grafana</h3>
<ol>
<li>Tambahkan <strong>Infinity Datasource</strong> di Grafana.</li>
<li>Atur URL ke <code>http://&lt;ip_uno220&gt;:3000</code>.</li>
<li>Gunakan Basic Auth sesuai <code>.env</code>.</li>
<li>Query data Rapid SCADA langsung dari Grafana dashboard.</li>
</ol>
<h3 id="97-keamanan">9.7 Keamanan</h3>
<ul>
<li>Gunakan <strong>UFW</strong> untuk membatasi akses port 3000 hanya dari host Grafana:<pre><code class="language-bash">sudo ufw allow from &lt;ip_grafana&gt; to any port 3000 proto tcp
</code></pre>
</li>
<li>Jika Grafana berjalan di server terpisah, gunakan <strong>ZeroTier</strong> agar komunikasi tetap terenkripsi.</li>
</ul>
<p>Dengan penambahan ini, UNO‑220 berevolusi dari sekadar gateway dan server SCADA menjadi <strong>penyedia data terintegrasi untuk Grafana maupun ERP</strong>. Membawa visibilitas real‑time melalui dashboard modern dan tinjauan histori kinerja secara komprehensif, sementara sistem ERP menerima aliran data SCADA yang sudah dinormalisasi. Alur ini tidak hanya memperkaya analitik dan pengambilan keputusan, tetapi juga memastikan integrasi berlangsung dengan cara yang <strong>aman, konsisten, dan mudah</strong>.</p>
<hr>
<h2 id="10-hardening-optimisasi">10. Hardening &amp; Optimisasi</h2>
<h3 id="101-ssh-secure-shell">10.1 SSH (Secure Shell)</h3>
<ol>
<li>
<p><strong>Generate Key di Host Admin</strong></p>
<ul>
<li>Linux:<pre><code class="language-bash">ssh-keygen -t ed25519 -C "admin@uno220"
</code></pre>
</li>
<li>Windows (PowerShell, OpenSSH bawaan):<pre><code class="language-powershell">ssh-keygen -t ed25519 -C "admin@uno220"
</code></pre>
</li>
</ul>
</li>
<li>
<p><strong>Copy Public Key ke UNO‑220</strong></p>
<ul>
<li>Linux:<pre><code class="language-bash">ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@&lt;ip_zerotier&gt;
</code></pre>
</li>
<li>Windows PowerShell:<pre><code class="language-powershell">type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh ubuntu@&lt;ip_zerotier&gt; "mkdir -p ~/.ssh &amp;&amp; cat &gt;&gt; ~/.ssh/authorized_keys"
</code></pre>
</li>
</ul>
</li>
<li>
<p><strong>Uji Login Key‑Based</strong></p>
<pre><code class="language-bash">ssh ubuntu@&lt;ip_zerotier&gt;
</code></pre>
<p>→ Harus langsung masuk tanpa password.</p>
</li>
<li>
<p><strong>Aktifkan Hardening SSH</strong> (setelah uji berhasil)<br>
Edit <code>/etc/ssh/sshd_config</code>:</p>
<pre><code>PermitRootLogin no
PubkeyAuthentication yes
PasswordAuthentication no
</code></pre>
<p>Restart:</p>
<pre><code class="language-bash">sudo systemctl restart ssh
</code></pre>
</li>
</ol>
<h3 id="102-firewall-ufw">10.2 Firewall (UFW)</h3>
<p>Konfigurasi dasar:</p>
<pre><code class="language-bash">sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh/tcp      # Port 22
sudo ufw allow 1880/tcp     # Node-RED
sudo ufw allow 80/tcp       # Nginx HTTP
sudo ufw allow 443/tcp      # Nginx HTTPS
sudo ufw allow 9993/udp     # ZeroTier
sudo ufw allow 10002/tcp    # SCADA Agent
sudo ufw enable
</code></pre>
<p>Verifikasi port terbuka:</p>
<pre><code class="language-bash">sudo ss -tuln
</code></pre>
<p>→ Hanya 22, 80, 443, 1880, 9993, 10002 yang aktif.</p>
<h3 id="103-fail2ban-proteksi-ssh">10.3 Fail2Ban (Proteksi SSH)</h3>
<ol>
<li>Instalasi:<pre><code class="language-bash">sudo apt install fail2ban -y
</code></pre>
</li>
<li>Konfigurasi <code>/etc/fail2ban/jail.local</code>:<pre><code>[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
</code></pre>
Tambahkan <code>ignoreip = 127.0.0.1/8 &lt;your_ip&gt;</code> untuk whitelist.</li>
<li>Restart:<pre><code class="language-bash">sudo systemctl restart fail2ban
</code></pre>
</li>
<li>Verifikasi:<pre><code class="language-bash">sudo fail2ban-client status sshd
</code></pre>
</li>
</ol>
<h3 id="104-auto-security-updates">10.4 Auto Security Updates</h3>
<ol>
<li>Instalasi:<pre><code class="language-bash">sudo apt install unattended-upgrades -y
</code></pre>
</li>
<li>Enable:<pre><code class="language-bash">sudo dpkg-reconfigure unattended-upgrades
</code></pre>
Pilih <strong>Yes</strong>.</li>
<li>Edit <code>/etc/apt/apt.conf.d/50unattended-upgrades</code> → pastikan baris berikut aktif:<pre><code>Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
};
</code></pre>
</li>
<li>Uji:<pre><code class="language-bash">sudo unattended-upgrades --dry-run
</code></pre>
</li>
</ol>
<h3 id="105-sinkronisasi-rtc-real-time-clock">10.5 Sinkronisasi RTC (Real-Time Clock)</h3>
<ul>
<li>Pastikan NTP aktif:<pre><code class="language-bash">timedatectl status
</code></pre>
</li>
<li>Tambahkan cron job:<pre><code class="language-bash">sudo crontab -e
</code></pre>
Isi:<pre><code>@daily /usr/sbin/hwclock -w &amp;&amp; logger "RTC updated from system clock"
@reboot /usr/sbin/hwclock -s &amp;&amp; logger "System clock initialized from RTC"
</code></pre>
</li>
<li>Uji manual:<pre><code class="language-bash">sudo hwclock -s &amp;&amp; hwclock -r
</code></pre>
</li>
</ul>
<h3 id="106-disable-unused-services">10.6 Disable Unused Services</h3>
<p>Matikan service yang tidak diperlukan:</p>
<pre><code class="language-bash">sudo systemctl disable bluetooth avahi-daemon
</code></pre>
<h3 id="107-verifikasi-hardening">10.7 Verifikasi Hardening</h3>
<ul>
<li>SSH hanya menerima key‑based login:<pre><code class="language-bash">ssh ubuntu@&lt;ip_zerotier&gt;
</code></pre>
</li>
<li>Firewall hanya membuka port yang diizinkan:<pre><code class="language-bash">sudo ss -tuln
</code></pre>
</li>
<li>Fail2Ban aktif:<pre><code class="language-bash">sudo fail2ban-client status sshd
</code></pre>
</li>
<li>Update otomatis aktif:<pre><code class="language-bash">systemctl status unattended-upgrades
</code></pre>
</li>
<li>RTC sinkron:<pre><code class="language-bash">hwclock -r
</code></pre>
</li>
</ul>
<h3 id="108-troubleshooting">10.8 Troubleshooting</h3>
<ul>
<li><strong>Fail2Ban gagal start</strong> → cek log:<pre><code class="language-bash">sudo journalctl -u fail2ban
</code></pre>
</li>
<li><strong>SSH terkunci</strong> → login via ZeroTier console atau akses fisik, lalu aktifkan kembali <code>PasswordAuthentication yes</code> sementara.</li>
<li><strong>UFW blokir ZeroTier</strong> → pastikan <code>sudo ufw allow 9993/udp</code>.</li>
</ul>
<hr>
<h2 id="11-backup-recovery">11. Backup &amp; Recovery</h2>
<h3 id="111-backup-manual">11.1 Backup Manual</h3>
<p><strong>Node‑RED</strong></p>
<pre><code class="language-bash">cd ~/.node-red &amp;&amp; tar czvf nodered_config_backup_$(date +%F).tar.gz flows.json settings.js package.json
</code></pre>
<p><strong>Rapid SCADA</strong></p>
<pre><code class="language-bash">sudo tar czvf scada_backup_$(date +%F).tar.gz /opt/scada /etc/systemd/system/scada*.service
</code></pre>
<p><strong>ZeroTier</strong></p>
<pre><code class="language-bash">sudo tar czvf zerotier_backup_$(date +%F).tar.gz /var/lib/zerotier-one
</code></pre>
<h3 id="112-backup-rutin-otomatis-cron-rsync-ke-usbnas">11.2 Backup Rutin Otomatis (Cron + rsync ke USB/NAS)</h3>
<ol>
<li>
<p><strong>Setup Mount USB/NAS</strong></p>
<ul>
<li>USB:<pre><code class="language-bash">sudo mkdir -p /mnt/usb
sudo mount /dev/sda1 /mnt/usb   # ganti sda1 sesuai device
</code></pre>
</li>
<li>NAS (NFS):<pre><code class="language-bash">sudo mkdir -p /mnt/nas
sudo mount -t nfs &lt;nas_ip&gt;:/share /mnt/nas
</code></pre>
</li>
<li>NAS (SMB/CIFS):<pre><code class="language-bash">sudo mkdir -p /mnt/nas
sudo mount -t cifs //&lt;nas_ip&gt;/share /mnt/nas -o username=user,password=pass
</code></pre>
</li>
</ul>
</li>
<li>
<p><strong>Buat Script Backup</strong><br>
Simpan sebagai <code>/usr/local/bin/backup_routine.sh</code>:</p>
<pre><code class="language-bash">#!/bin/bash
set -euo pipefail

DATE="$(date +%Y%m%d_%H%M%S)"
SRC_DIRS="/home/ubuntu/.node-red /var/lib/zerotier-one /etc /home/ubuntu/uno220_stat.csv"
DEST="/mnt/usb/backups"   # atau /mnt/nas/backups
LOG="/var/log/backup.log"
 
if ! mountpoint -q /mnt/usb; then
  echo "$(date) - USB tidak ter-mount, backup dibatalkan" | tee -a "$LOG"
  exit 1
fi

mkdir -p "$DEST/$DATE"
rsync -avz --delete --log-file="$LOG" $SRC_DIRS "$DEST/$DATE"

# Hapus backup &gt;7 hari
find "$DEST" -maxdepth 1 -mindepth 1 -type d -mtime +7 -exec rm -rf {} +

# Mirror khusus Rapid SCADA
mkdir -p /mnt/usb/scada_backup
rsync -av --delete /opt/scada /mnt/usb/scada_backup/
</code></pre>
<p>Buat executable:</p>
<pre><code class="language-bash">sudo chmod +x /usr/local/bin/backup_routine.sh
</code></pre>
</li>
<li>
<p><strong>Jadwalkan Cron Job</strong></p>
<pre><code class="language-bash">sudo crontab -e
</code></pre>
<p>Tambahkan:</p>
<pre><code>0 2 * * * /usr/local/bin/backup_routine.sh   # Harian jam 2 pagi
</code></pre>
<p>Verifikasi:</p>
<pre><code class="language-bash">sudo crontab -l
</code></pre>
<p>Log tersimpan di <code>/var/log/backup.log</code>.</p>
</li>
</ol>
<h3 id="113-log-retention-dengan-logrotate">11.3 Log Retention dengan Logrotate</h3>
<p>Cegah log backup membengkak di microSD.</p>
<ol>
<li>Pastikan logrotate terpasang:<pre><code class="language-bash">sudo apt install logrotate -y
</code></pre>
</li>
<li>Buat config <code>/etc/logrotate.d/backup_logs</code>:<pre><code>/var/log/backup.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 644 root root
    postrotate
        /usr/bin/killall -q -HUP rsyslogd 2&gt; /dev/null || true
    endscript
}
</code></pre>
</li>
<li>Uji:<pre><code class="language-bash">sudo logrotate -d /etc/logrotate.d/backup_logs
</code></pre>
</li>
<li>Jalankan manual:<pre><code class="language-bash">sudo logrotate -f /etc/logrotate.conf
</code></pre>
</li>
</ol>
<h3 id="114-recovery">11.4 Recovery</h3>
<ul>
<li>
<p><strong>Restore Node‑RED</strong>:</p>
<pre><code class="language-bash">tar xzvf nodered_config_backup_*.tar.gz -C ~/.node-red
</code></pre>
</li>
<li>
<p><strong>Restore Rapid SCADA</strong>:</p>
<pre><code class="language-bash">sudo tar xzvf scada_backup_*.tar.gz -C /
sudo systemctl daemon-reload
sudo systemctl restart scadaagent6 scadaserver6 scadacomm6 scadaweb6
</code></pre>
</li>
<li>
<p><strong>Restore ZeroTier</strong>:</p>
<pre><code class="language-bash">sudo systemctl stop zerotier-one
sudo tar xzvf zerotier_backup_*.tar.gz -C /
sudo systemctl start zerotier-one
</code></pre>
</li>
<li>
<p><strong>Restore dari USB/NAS</strong>:</p>
<pre><code class="language-bash">sudo rsync -avz /mnt/usb/backups/&lt;tanggal&gt;/ /
</code></pre>
</li>
</ul>
<h3 id="115-troubleshooting">11.5 Troubleshooting</h3>
<ul>
<li><strong>rsync gagal ke NAS</strong> → pastikan mount sukses (<code>df -h</code>), gunakan SSH keyless (<code>ssh-keygen &amp;&amp; ssh-copy-id user@nas_ip</code>).</li>
<li><strong>USB tidak terdeteksi</strong> → cek <code>lsblk</code> atau <code>dmesg | grep sd</code>.</li>
<li><strong>Logrotate error permission</strong> → sesuaikan baris <code>create 644 root root</code> di config.</li>
</ul>
<hr>
<h2 id="12-testing-validasi">12. Testing &amp; Validasi</h2>
<h3 id="121-verifikasi-node%E2%80%91red">12.1 Verifikasi Node‑RED</h3>
<pre><code class="language-bash">systemctl status nodered.service
</code></pre>
<ul>
<li>Status harus <code>active (running)</code>.</li>
<li>Akses editor: <code>http://&lt;ip&gt;:1880</code></li>
<li>Akses dashboard: <code>http://&lt;ip&gt;:1880/ui</code></li>
</ul>
<p><strong>Contoh Output:</strong></p>
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
<h3 id="122-verifikasi-rapid-scada">12.2 Verifikasi Rapid SCADA</h3>
<pre><code class="language-bash">systemctl status scadaserver6.service scadacomm6.service scadaweb6.service
</code></pre>
<ul>
<li>Semua service harus <code>active (running)</code>.</li>
<li>Akses web: <code>http://&lt;ip&gt;</code> atau <code>https://&lt;ip&gt;</code></li>
<li>Login default: <strong>admin / scada</strong></li>
</ul>
<h3 id="123-uji-koneksi-zerotier">12.3 Uji Koneksi ZeroTier</h3>
<pre><code class="language-bash">ping &lt;IP_ZeroTier_peer&gt;
</code></pre>
<ul>
<li>Harus ada balasan ICMP.</li>
<li>Jika gagal: cek <code>zerotier-cli listnetworks</code> dan pastikan node authorized.</li>
</ul>
<h3 id="124-uji-hardware">12.4 Uji Hardware</h3>
<ul>
<li>
<p><strong>RTC</strong></p>
<pre><code class="language-bash">hwclock -r
</code></pre>
<p><strong>Contoh Output:</strong></p>
<pre><code>2025-10-22 12:34:56.789012 UTC
</code></pre>
<p>→ Bandingkan dengan <code>date</code> untuk memastikan sinkron.</p>
</li>
<li>
<p><strong>GPIO Expander</strong></p>
<pre><code class="language-bash">gpiodetect
</code></pre>
<p><strong>Contoh Output:</strong></p>
<pre><code>gpiochip0 [pinctrl-bcm2835] (58 lines)
gpiochip1 [raspberrypi-exp-gpio] (8 lines)
gpiochip2 [pca953x] (8 lines, tca9554@27)
</code></pre>
</li>
<li>
<p><strong>LED PL1</strong></p>
<pre><code class="language-bash">gpioset 0 12=1   # LED ON
gpioset 0 12=0   # LED OFF
</code></pre>
</li>
<li>
<p><strong>TPM</strong></p>
<pre><code class="language-bash">tpm2_getrandom 16 | xxd -p
</code></pre>
<p><strong>Contoh Output:</strong></p>
<pre><code>a1b2c3d4e5f6789012345678abcdef90
</code></pre>
</li>
<li>
<p><strong>Serial Port</strong></p>
<pre><code class="language-bash">minicom -D /dev/ttyS0 -b 115200
</code></pre>
<p>→ Pastikan komunikasi serial berjalan.</p>
</li>
</ul>
<h3 id="125-checklist">12.5 Checklist</h3>
<ul>
<li>[ ] Node‑RED dashboard dapat diakses via browser</li>
<li>[ ] Rapid SCADA menampilkan halaman login</li>
<li>[ ] ZeroTier peer dapat saling ping</li>
<li>[ ] RTC terbaca dengan benar (<code>hwclock -r</code>)</li>
<li>[ ] LED PL1 dapat dikendalikan (ON/OFF)</li>
<li>[ ] Port serial berfungsi (<code>minicom</code>)</li>
<li>[ ] Hanya port 22/80/443/1880/9993/10008 terbuka (<code>ss -tuln</code>)</li>
<li>[ ] Fail2Ban aktif (<code>fail2ban-client status sshd</code>)</li>
<li>[ ] Node‑RED logs capture I/O errors (<code>journalctl -u nodered</code>)</li>
<li>[ ] Backup cron berjalan (cek <code>/var/log/backup.log</code>)</li>
<li>[ ] Logrotate config valid (<code>logrotate -d /etc/logrotate.d/backup_logs</code>)</li>
<li>[ ] System metrics dashboard tampil (CPU &lt;80%, RAM &lt;70%, Temp &lt;80°C)</li>
<li>[ ] CSV file update (<code>tail -f uno220_stat.csv</code>) &amp; Rapid SCADA trend visible</li>
</ul>
<h3 id="126-troubleshooting-cepat">12.6 Troubleshooting Cepat</h3>
<ul>
<li><strong>Node‑RED tidak jalan</strong> → cek <code>journalctl -u nodered -f</code></li>
<li><strong>SCADA 502 Bad Gateway</strong> → cek <code>journalctl -u scadaweb6 -f</code></li>
<li><strong>ZeroTier tidak connect</strong> → cek <code>zerotier-cli info</code></li>
<li><strong>RTC error</strong> → pastikan overlay aktif (<code>dmesg | grep rtc</code>)</li>
<li><strong>GPIO/LED gagal</strong> → cek <code>gpioinfo</code> untuk mapping pin</li>
<li><strong>TPM error</strong> → pastikan modul kernel TPM aktif (<code>lsmod | grep tpm</code>)</li>
</ul>
<hr>
<h2 id="13-deployment">13. Deployment</h2>
<ol>
<li>
<p><strong>Penempatan Perangkat</strong></p>
<ul>
<li>Tempatkan UNO‑220 di lokasi lapangan sesuai rencana instalasi.</li>
<li>Pastikan lingkungan sesuai spesifikasi industri (suhu, kelembaban, getaran).</li>
</ul>
</li>
<li>
<p><strong>Koneksi Daya &amp; Jaringan</strong></p>
<ul>
<li>Hubungkan ke catu daya <strong>12–24 VDC</strong> atau <strong>PoE+ (802.3at)</strong>.</li>
<li>Catatan: hindari PoE 802.3af karena tidak stabil saat beban tinggi (Node‑RED + SCADA dapat menarik 15–20W).</li>
</ul>
</li>
<li>
<p><strong>Verifikasi ZeroTier</strong></p>
<ul>
<li>Pastikan device muncul di jaringan ZeroTier:<pre><code class="language-bash">zerotier-cli listnetworks
</code></pre>
</li>
<li>Cek status ONLINE di controller.</li>
</ul>
</li>
<li>
<p><strong>Akses Aplikasi</strong></p>
<ul>
<li>Node‑RED: <code>http://&lt;ip_zerotier&gt;:1880</code></li>
<li>Rapid SCADA: <code>http://&lt;ip_zerotier&gt;</code> atau <code>https://&lt;ip_zerotier&gt;</code></li>
</ul>
</li>
<li>
<p><strong>Validasi Fungsi I/O &amp; Flow</strong></p>
<ul>
<li>Uji dashboard Node‑RED (sensor, GPIO, expander, serial).</li>
<li>Uji trending Rapid SCADA (CSV file update → grafik tampil).</li>
<li>Simulasikan skenario logika industri (misalnya alarm, interlock).</li>
</ul>
</li>
<li>
<p><strong>Label Fisik Unit</strong></p>
<ul>
<li>Tempel label berisi:
<ul>
<li><strong>ID ZeroTier</strong></li>
<li><strong>IP lokal</strong></li>
<li><strong>Tanggal deployment</strong></li>
</ul>
</li>
<li>Gunakan label tahan panas &amp; kelembaban.</li>
</ul>
</li>
<li>
<p><strong>Proteksi Daya</strong></p>
<ul>
<li>Gunakan <strong>UPS mini DC</strong> atau supply redundant untuk menjaga kestabilan.</li>
<li>Catat kapasitas UPS (misalnya 12V/24V, 30–60 menit backup).</li>
</ul>
</li>
</ol>
<hr>
<h2 id="14-penutup">14. Penutup</h2>
<p>UNO‑220 kini siap beroperasi sebagai <strong>edge device industri</strong> yang tangguh, dengan konfigurasi yang <strong>aman, modular, dan audit‑ready</strong>. Seluruh tahapan — mulai dari instalasi sistem operasi, aktivasi fitur perangkat keras, pengamanan layanan, hingga integrasi aplikasi — telah dirancang agar konsisten, mudah direplikasi, dan dapat diaudit.</p>
<p>Komponen utama yang terintegrasi:</p>
<ul>
<li><strong>Node‑RED</strong> → automasi dan dashboard lokal, lengkap dengan logging I/O dan monitoring sistem ke CSV.</li>
<li><strong>Rapid SCADA 6.4.3</strong> → server SCADA dengan integrasi trending CSV untuk histori data yang akurat.</li>
<li><strong>ZeroTier</strong> → konektivitas aman dan fleksibel untuk remote management tanpa membuka port publik.</li>
<li><strong>RAM drive &amp; hardening</strong> (UFW + Fail2Ban) → perlindungan sistem sekaligus memperpanjang umur media penyimpanan.</li>
<li><strong>Backup rutin + logrotate</strong> → memastikan recovery cepat dan manajemen log yang efisien.</li>
</ul>
<p>Dengan rancangan ini, UNO‑220 dapat dijadikan <strong>standar operasional deployment</strong> di seluruh fasilitas industri, menjamin <strong>konsistensi, keamanan, dan keandalan</strong>.</p>
<blockquote>
<p><strong>Catatan:</strong> Untuk menjaga keberlanjutan, lakukan validasi berkala (service status, backup, update keamanan) dan selalu cek versi terbaru software dari sumber resmi sebelum upgrade.</p>
</blockquote>

<!--kg-card-begin: html-->
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