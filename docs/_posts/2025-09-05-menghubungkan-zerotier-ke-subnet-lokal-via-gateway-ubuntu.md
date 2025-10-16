---
ghost_uuid: "6e84fe93-b386-4c8b-b427-a11c3c4d9022"
title: "Menghubungkan ZeroTier ke Subnet Lokal via Gateway Ubuntu"
date: "2025-09-05T16:38:25.000+07:00"
slug: "menghubungkan-zerotier-ke-subnet-lokal-via-gateway-ubuntu"
layout: "post"
excerpt: |
  Integrasi ZeroTier ke subnet lokal industri kini makin modular. Artikel ini menyajikan struktur NAT dan redireksi VNC yang siap-pakai, lengkap dengan flowchart dan validasi runtime.
image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDI3fHxuZXR3b3JraW5nfGVufDB8fHx8MTc1NzA1MTE4NHww&ixlib=rb-4.1.0&q=80&w=2000"
image_alt: ""
image_caption: "<span style=\"white-space: pre-wrap;\">Photo by </span><a href=\"https://unsplash.com/@jouwdan?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Jordan Harrison</span></a><span style=\"white-space: pre-wrap;\"> / </span><a href=\"https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Unsplash</span></a>"
author:
  - "Ketut Kumajaya"
tags:
  - "Remote Access"
  - "Practical Engineering"
  - "Field Experience"
categories:
  - "remote-access"
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
url: "https://automation.samatorgroup.com/blog/menghubungkan-zerotier-ke-subnet-lokal-via-gateway-ubuntu/"
comment_id: "68ba9e23f80c480576839a6a"
reading_time: 5
access: true
comments: false
---

<h3 id="struktur-nat-modular-redireksi-vnc-dan-internet-gateway">Struktur NAT Modular, Redireksi VNC, dan Internet Gateway</h3>
<p><em>Ditulis oleh Ketut Kumajaya | 5 September 2025</em></p>
<h3 id="konteks-operasional">Konteks Operasional</h3>
<p>Dalam sistem industri yang mengandalkan remote access yang aman, integrasi jaringan virtual seperti ZeroTier ke subnet lokal fisik menjadi kebutuhan penting. Artikel ini menyajikan struktur konfigurasi gateway Ubuntu yang modular, memungkinkan konektivitas eksplisit serta redireksi layanan seperti VNC melalui NAT serta akses internet saat diperlukan.</p>
<hr>
<h3 id="topologi-mapping-ip">Topologi &amp; Mapping IP</h3>
<table>
<thead>
<tr>
<th>Komponen</th>
<th>IP Address</th>
<th>Fungsi</th>
</tr>
</thead>
<tbody>
<tr>
<td>ZeroTier Gateway</td>
<td>192.168.194.72</td>
<td>Interface ZeroTier &amp; NAT</td>
</tr>
<tr>
<td>LAN Gateway</td>
<td>192.168.71.130</td>
<td>Interface lokal LAN</td>
</tr>
<tr>
<td>Target LAN</td>
<td>192.168.71.247</td>
<td>Tujuan akses dari ZeroTier</td>
</tr>
<tr>
<td>VNC Server</td>
<td>128.128.1.134</td>
<td>Tujuan DNAT port 5900</td>
</tr>
</tbody>
</table>
<div style="width: 100%; text-align: center; margin: 0.5em auto; max-width: 300px;">  
  <div class="mermaid" style="width: 100%; max-width: 600px;">  
    ---  
    config:  
      theme: neutral  
    ---  
    flowchart TD  
        ZTClient["ZeroTier Client<br>192.168.194.x"]:::client  
        ZTGateway["Gateway Ubuntu<br>192.168.194.72"]:::gateway  
        LANTarget["Target LAN<br>192.168.71.247"]:::lan  
        ZTClient --&gt;|Ping / VNC Request| ZTGateway  
        ZTGateway --&gt;|FORWARD Rule<br>zt+ → eth0| LANTarget  
        LANTarget --&gt;|Response| ZTGateway  
        ZTGateway --&gt;|FORWARD Rule<br>eth0 → zt+| ZTClient  
        classDef client fill:#d1ecf1,stroke:#0c5460,stroke-width:2px  
        classDef gateway fill:#fff3cd,stroke:#856404,stroke-width:2px  
        classDef lan fill:#d4edda,stroke:#155724,stroke-width:2px  
  </div>  
</div>  
<p>Topologi ini memungkinkan node ZeroTier mengakses subnet lokal melalui gateway Ubuntu, sekaligus merelay koneksi VNC secara eksplisit.</p>
<hr>
<h3 id="ip-forwarding-kebijakan-routing">IP Forwarding &amp; Kebijakan Routing</h3>
<p>Aktifkan IP forwarding dengan mengedit konfigurasi UFW:</p>
<pre><code class="language-bash">sudo nano /etc/ufw/sysctl.conf
</code></pre>
<p>Set:</p>
<pre><code>net/ipv4/ip_forward = 1
</code></pre>
<p>Ubah kebijakan default forwarding:</p>
<pre><code class="language-bash">sudo nano /etc/default/ufw
</code></pre>
<p>Set:</p>
<pre><code>DEFAULT_FORWARD_POLICY="ACCEPT"
</code></pre>
<p>Untuk memastikan interface yang digunakan sesuai, cek dengan:</p>
<pre><code class="language-bash">ip a | grep inet
</code></pre>
<hr>
<h3 id="struktur-nat-rule-ufw">Struktur NAT &amp; Rule UFW</h3>
<p>Edit <code>/etc/ufw/before.rules</code> sebelum <code>COMMIT</code>:</p>
<pre><code class="language-bash">*nat
:POSTROUTING ACCEPT [0:0]

# MASQUERADE: NAT ZeroTier ke internet via eth0
-A POSTROUTING -s 192.168.194.0/24 -o eth0 -j MASQUERADE

COMMIT

*filter
:FORWARD ACCEPT [0:0]

# FORWARD: Trafik ZeroTier ke subnet lokal
-A FORWARD -i zt+ -o eth0 -s 192.168.194.0/24 -d 192.168.71.0/24 -j ACCEPT

# FORWARD: Trafik subnet lokal ke ZeroTier
-A FORWARD -i eth0 -o zt+ -s 192.168.71.0/24 -d 192.168.194.0/24 -j ACCEPT

COMMIT
</code></pre>
<p>Catatan: aturan NAT ditempatkan di <code>before.rules</code> agar diproses lebih awal sebelum aturan filter default UFW.</p>
<hr>
<h3 id="route-di-zerotier-controller">Route di ZeroTier Controller</h3>
<p>Tambahkan route:</p>
<table>
<thead>
<tr>
<th>Destination</th>
<th>Via</th>
</tr>
</thead>
<tbody>
<tr>
<td>192.168.71.0/24</td>
<td>192.168.194.72</td>
</tr>
</tbody>
</table>
<p>Route ini mengarahkan trafik subnet lokal melalui gateway ZeroTier. Jika menggunakan ZTNET self-hosted controller, konfigurasi dapat dilakukan melalui dashboard web.</p>
<hr>
<h3 id="redireksi-vnc-via-dnat">Redireksi VNC via DNAT</h3>
<p>Lakukan perubahan di blok <code>*nat</code> di <code>/etc/ufw/before.rules</code>:</p>
<pre><code class="language-bash">*nat
:PREROUTING ACCEPT [0:0]
:POSTROUTING ACCEPT [0:0]

# DNAT: Redirect port 5900 (VNC) ke server 128.128.1.134
-A PREROUTING -p tcp -d 192.168.194.72 --dport 5900 \
   -j DNAT --to-destination 128.128.1.134:5900

# MASQUERADE: NAT ZeroTier ke internet via eth0
-A POSTROUTING -s 192.168.194.0/24 -o eth0 -j MASQUERADE

# MASQUERADE: NAT untuk balasan dari VNC Server ke ZeroTier client
-A POSTROUTING -s 192.168.194.0/24 -d 128.128.1.0/24 -j MASQUERADE

COMMIT
</code></pre>
<div style="width: 100%; text-align: center; margin: 0.5em auto; max-width: 280px;">  
  <div class="mermaid" style="width: 100%; max-width: 600px;">  
    ---  
    config:  
      theme: neutral  
    ---  
    flowchart TD  
        DNATRequest["ZeroTier Client<br>→ port 5900"]:::client  
        DNATGateway["Gateway Ubuntu<br>DNAT Rule"]:::gateway  
        VNCServer["VNC Server<br>128.128.1.134"]:::vnc  
        DNATRequest --&gt; DNATGateway  
        DNATGateway --&gt;|DNAT port 5900| VNCServer  
        VNCServer --&gt;|Response| DNATGateway  
        DNATGateway --&gt;|MASQUERADE<br>balasan ke client| DNATRequest  
        classDef client fill:#d1ecf1,stroke:#0c5460,stroke-width:2px  
        classDef gateway fill:#fff3cd,stroke:#856404,stroke-width:2px  
        classDef vnc fill:#d4edda,stroke:#155724,stroke-width:2px  
  </div>  
</div>  
<p>DNAT ini memungkinkan client ZeroTier mengakses VNC server secara langsung. Sebagai tambahan, tetap disarankan menggunakan password kuat atau tunneling (misalnya SSH) karena protokol VNC secara default tidak terenkripsi.</p>
<hr>
<h3 id="rule-ufw-untuk-port-vnc">Rule UFW untuk Port VNC</h3>
<pre><code class="language-bash">sudo ufw allow from 192.168.194.0/24 to any port 5900 proto tcp comment "VNC gateway"
</code></pre>
<p>Untuk meninjau aturan secara urut dan mudah dihapus bila salah:</p>
<pre><code class="language-bash">sudo ufw status numbered
</code></pre>
<hr>
<h3 id="gateway-ubuntu-sebagai-internet-gateway">Gateway Ubuntu sebagai Internet Gateway</h3>
<p>Selain berfungsi sebagai relay VNC, gateway Ubuntu juga dapat memberikan akses internet ke subnet lokal <code>128.128.1.0/24</code>, selama memiliki dua interface aktif:</p>
<ul>
<li><code>enxf8e43b8c14c6</code> → terhubung ke subnet 128.128.1.0/24</li>
<li><code>eth0</code> → terhubung ke subnet 192.168.71.0/24 dan memiliki akses internet</li>
</ul>
<div style="width: 100%; text-align: center; margin: 0.5em auto; max-width: 400px;">  
  <div class="mermaid" style="width: 100%; max-width: 600px;">  
    ---  
    config:  
      theme: neutral  
    ---  
    flowchart TD  
        HostSubnet["Host Industri<br>128.128.1.134"]:::client  
        GatewayUbuntu["Gateway Ubuntu<br>IP: 128.128.1.140"]:::gateway  
        Internet["Internet<br>(8.8.8.8, example.com)"]:::internet  
        HostSubnet --&gt;|Default Gateway: 128.128.1.140| GatewayUbuntu  
        GatewayUbuntu --&gt;|MASQUERADE via eth0| Internet  
        Internet --&gt;|Response| GatewayUbuntu  
        GatewayUbuntu --&gt;|Balasan NAT ke host| HostSubnet  
        classDef client fill:#d1ecf1,stroke:#0c5460,stroke-width:2px  
        classDef gateway fill:#fff3cd,stroke:#856404,stroke-width:2px  
        classDef internet fill:#d4edda,stroke:#155724,stroke-width:2px  
  </div>  
</div>  
<p>IP forwarding telah diaktifkan sebelumnya, sehingga gateway siap meneruskan trafik antar subnet.</p>
<p>Tambahkan ke blok <code>*nat</code> di <code>/etc/ufw/before.rules</code>:</p>
<pre><code class="language-bash"># MASQUERADE: NAT subnet industri (128.128.1.0/24) ke internet via eth0
-A POSTROUTING -s 128.128.1.0/24 -o eth0 -j MASQUERADE
</code></pre>
<p>Tambahkan ke blok <code>*filter</code>:</p>
<pre><code class="language-bash"># FORWARD: Trafik dari subnet industri ke internet
-A FORWARD -i enxf8e43b8c14c6 -o eth0 -s 128.128.1.0/24 -j ACCEPT

# FORWARD: Trafik balasan dari internet ke subnet industri
-A FORWARD -i eth0 -o enxf8e43b8c14c6 -d 128.128.1.0/24 -j ACCEPT
</code></pre>
<hr>
<h3 id="reload-verifikasi-konfigurasi">Reload &amp; Verifikasi Konfigurasi</h3>
<pre><code class="language-bash">sudo ufw reload
sudo ufw status verbose
</code></pre>
<p>Struktur lengkap <code>/etc/ufw/before.rules</code> setelah perubahan:</p>
<pre><code class="language-bash">*nat
:PREROUTING ACCEPT [0:0]
:POSTROUTING ACCEPT [0:0]

# DNAT: Redirect port 5900 (VNC) ke server 128.128.1.134
-A PREROUTING -p tcp -d 192.168.194.72 --dport 5900 \
   -j DNAT --to-destination 128.128.1.134:5900

# MASQUERADE: NAT ZeroTier ke internet via eth0
-A POSTROUTING -s 192.168.194.0/24 -o eth0 -j MASQUERADE

# MASQUERADE: Balasan dari VNC Server ke client ZeroTier
-A POSTROUTING -s 192.168.194.0/24 -d 128.128.1.0/24 -j MASQUERADE

# MASQUERADE: NAT subnet industri (128.128.1.0/24) ke internet via eth0
-A POSTROUTING -s 128.128.1.0/24 -o eth0 -j MASQUERADE

COMMIT

*filter
:FORWARD ACCEPT [0:0]

# FORWARD: Trafik ZeroTier ke subnet lokal
-A FORWARD -i zt+ -o eth0 -s 192.168.194.0/24 -d 192.168.71.0/24 -j ACCEPT

# FORWARD: Trafik subnet lokal ke ZeroTier
-A FORWARD -i eth0 -o zt+ -s 192.168.71.0/24 -d 192.168.194.0/24 -j ACCEPT

# FORWARD: Trafik dari subnet industri ke internet
-A FORWARD -i enxf8e43b8c14c6 -o eth0 -s 128.128.1.0/24 -j ACCEPT

# FORWARD: Trafik balasan dari internet ke subnet industri
-A FORWARD -i eth0 -o enxf8e43b8c14c6 -d 128.128.1.0/24 -j ACCEPT

COMMIT
</code></pre>
<hr>
<h3 id="validasi-runtime">Validasi Runtime</h3>
<p><strong>Akses Subnet Lokal dari Node ZeroTier:</strong></p>
<pre><code class="language-bash">ping 192.168.71.247
</code></pre>
<p><strong>Verifikasi Trafik di Gateway:</strong></p>
<pre><code class="language-bash">sudo tcpdump -i eth0 host 192.168.71.247
</code></pre>
<p><strong>Uji Koneksi VNC via Telnet:</strong></p>
<pre><code class="language-bash">telnet 192.168.194.72 5900
</code></pre>
<p>Jika berhasil:</p>
<pre><code>RFB 003.008
</code></pre>
<p>Respons RFB menandakan bahwa protokol VNC aktif dan DNAT berfungsi. Jika gagal, gunakan:</p>
<pre><code class="language-bash">sudo tcpdump -i &lt;interface&gt; port 5900
</code></pre>
<p><strong>Uji Koneksi Internet dari Subnet 128.128.1.0/24:</strong><br>
Dari host <code>128.128.1.134</code>, arahkan default gateway ke <code>128.128.1.140</code>, lalu uji koneksi:</p>
<pre><code class="language-bash">ping 8.8.8.8
curl https://example.com
</code></pre>
<hr>
<h3 id="penutup">Penutup</h3>
<p>Dengan konfigurasi ini, gateway Ubuntu berfungsi sebagai penghubung antara jaringan ZeroTier dan subnet lokal, serta sebagai relay layanan seperti VNC. Struktur NAT dan UFW yang modular mendukung konektivitas eksplisit dan dokumentasi yang siap diadopsi lintas proyek industri.</p>

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
