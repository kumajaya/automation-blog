---
ghost_uuid: "cf87a38e-d21d-475d-963e-b3737264a9e8"
title: "Anchor-Based Normalization: Strategi Koreksi Drift Data Akumulator di DCS/SCADA"
date: "2025-09-28T03:13:03.000+07:00"
slug: "anchor-based-normalization-strategi-koreksi-drift-data-akumulator-di-dcs-scada"
layout: "post"
excerpt: |
  Dari DCS ke ERP, data akumulasi sering “melenceng” tanpa kita sadari. Anchor‑Based Normalization menghadirkan cara sederhana namun kuat: satu anchor point, tiga zona deviasi, hasilnya data presisi dan transparan lintas sistem.
image: "https://images.unsplash.com/photo-1505778276668-26b3ff7af103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDl8fEdQU3xlbnwwfHx8fDE3NTkwMDM3ODd8MA&ixlib=rb-4.1.0&q=80&w=2000"
image_alt: ""
image_caption: "<span style=\"white-space: pre-wrap;\">Photo by </span><a href=\"https://unsplash.com/@jamie452?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Jamie Street</span></a><span style=\"white-space: pre-wrap;\"> / </span><a href=\"https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Unsplash</span></a>"
author:
  - "Ketut Kumajaya"
tags:
  - "Measurement Accuracy"
  - "Distributed Control System"
  - "Field Experience"
categories:
  - "measurement-accuracy"
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
url: "https://automation.samatorgroup.com/blog/anchor-based-normalization-strategi-koreksi-drift-data-akumulator-di-dcs-scada/"
comment_id: "68d838066d382e4b0503dd39"
reading_time: 3
access: true
comments: false
---

<p><em>Ditulis oleh Ketut Kumajaya | 28 September 2025</em></p>
<h2 id="pengantar">Pengantar</h2>
<p>Dalam sistem DCS/SCADA, drift data akumulasi adalah masalah klasik. Counter runtime, hour meter, atau energi meter sering mengalami penyimpangan akibat overflow tipe data, jitter komunikasi, atau perbedaan jam antar perangkat. Bias kecil yang dibiarkan akan menumpuk, menghasilkan data historis yang tidak konsisten dan menyimpang.</p>
<p>Contoh sederhana: akumulasi flowmeter menyimpang hingga 2% dari nilai seharusnya, tanpa ada yang menyadari.</p>
<p>Untuk mengatasi hal ini, artikel ini memperkenalkan pendekatan <strong>Anchor-Based Normalization</strong>: strategi koreksi berbasis satu titik referensi (anchor point) yang ditanam di DCS, dengan Rapid SCADA sebagai time authority dan Node-RED sebagai relay REST API yang melakukan koreksi on-demand.</p>
<p>Lebih dari sekadar normalisasi, pendekatan ini mewujudkan <strong>self-healing measurement pipeline</strong>, di mana sistem secara otomatis mendeteksi deviasi, menerapkan koreksi hanya saat diperlukan, dan menyimpan catatan audit secara transparan.</p>
<hr>
<h2 id="konsep-anchor-based-normalization">Konsep Anchor-Based Normalization</h2>
<ul>
<li><strong>Anchor Point</strong> → nilai referensi tunggal yang diketahui benar (misalnya input statis <code>flowrate = 3750</code>).</li>
<li><strong>Window Historis</strong> → data 4–24 jam terakhir dari Rapid SCADA digunakan untuk menghitung selisih (offset).</li>
<li><strong>Offset Correction</strong> → selisih antara anchor dan histori diterapkan ke semua accumulator.</li>
<li><strong>Normalization</strong> → setiap data yang diminta ERP atau sistem bisnis lain sudah terkoreksi, sementara data mentah tetap tersimpan di Rapid SCADA.</li>
</ul>
<p>Dengan cara ini, cukup satu anchor point untuk meluruskan seluruh accumulator.</p>
<hr>
<h2 id="zona-deviasi">Zona Deviasi</h2>
<p>Untuk menjaga keseimbangan antara presisi dan keandalan, digunakan logika tiga zona:</p>
<table>
<thead>
<tr>
<th>Zona</th>
<th>Kriteria Deviasi Relatif</th>
<th>Status Koreksi</th>
<th>Catatan Audit</th>
</tr>
</thead>
<tbody>
<tr>
<td>Hijau</td>
<td>≤ stddev</td>
<td>Tidak diterapkan (<code>applied: false</code>)</td>
<td>Deviasi dianggap noise, data dilewatkan apa adanya</td>
</tr>
<tr>
<td>Kuning</td>
<td>&gt; stddev dan ≤ max</td>
<td>Diterapkan (<code>applied: true</code>)</td>
<td>Koreksi normal, offset dicatat di header</td>
</tr>
<tr>
<td>Merah</td>
<td>&gt; max</td>
<td>Tidak diterapkan (<code>applied: false</code>)</td>
<td>Data dianggap outlier, dilewatkan <em>as-is</em> dengan flag audit</td>
</tr>
</tbody>
</table>
<p>Contoh kasus: deviasi 0.1% masuk zona hijau sehingga tidak dikoreksi, deviasi 0.35% masuk zona kuning sehingga koreksi diterapkan, sedangkan deviasi 12.5% masuk zona merah sehingga data dilewatkan apa adanya dengan catatan audit.</p>
<hr>
<h2 id="contoh-numerik-anchor-based-normalization">Contoh Numerik Anchor-Based Normalization</h2>
<ul>
<li><strong>Anchor Point (DCS)</strong>: <code>flowrate = 3750</code></li>
<li><strong>Window Historis (SCADA 4 jam terakhir)</strong>: rata-rata akumulator terbaca <code>3737</code></li>
<li><strong>Offset</strong>:<br>
$$\text{Offset} = \frac{3737 - 3750}{3750} \times 100% = -0.35%$$</li>
</ul>
<p>Offset negatif di sini artinya histori terbaca <strong>lebih rendah</strong> dibanding anchor.</p>
<hr>
<h3 id="evaluasi-zona-deviasi">Evaluasi Zona Deviasi</h3>
<ul>
<li><strong>Threshold stddev</strong>: 0.20%</li>
<li><strong>Threshold max</strong>: 5.0%</li>
</ul>
<p>Maka:</p>
<ul>
<li>Deviasi relatif = <strong>0.35%</strong></li>
<li>Karena <code>0.20% &lt; 0.35% ≤ 5.0%</code>, maka masuk <strong>Zona Kuning</strong>.</li>
<li>Status: <strong>applied = true</strong> → koreksi offset diterapkan.</li>
</ul>
<hr>
<h3 id="payload-hasil-koreksi">Payload Hasil Koreksi</h3>
<pre><code class="language-json">"correction": {
  "applied": true,
  "relative_deviation": 0.35,
  "std_dev_threshold": 0.20,
  "max_threshold": 5.0
}
</code></pre>
<p>ERP atau sistem bisnis cukup membaca bagian <code>data[]</code> dengan tenang, karena hasil sudah terjamin sesuai header <code>correction</code>.</p>
<hr>
<h3 id="perbandingan-kasus-lain">Perbandingan Kasus Lain</h3>
<ul>
<li><strong>Deviasi 0.1%</strong> → ≤ 0.20% → <strong>Zona Hijau</strong> → tidak dikoreksi (<code>applied: false</code>).</li>
<li><strong>Deviasi 0.35%</strong> → antara 0.20% dan 5.0% → <strong>Zona Kuning</strong> → dikoreksi (<code>applied: true</code>).</li>
<li><strong>Deviasi 12.5%</strong> → &gt; 5.0% → <strong>Zona Merah</strong> → tidak dikoreksi, dilewatkan <em>as-is</em> dengan catatan audit.</li>
</ul>
<hr>
<h2 id="implementasi-payload">Implementasi Payload</h2>
<p>Informasi koreksi cukup ditaruh sekali di header. Data di bawah tetap bersih, hanya menampilkan nilai akumulator.</p>
<pre><code class="language-json">{
  "site": "SIG025",
  "description": "SIG Bekasi",
  "correction": {
    "applied": true,
    "relative_deviation": 0.35,
    "std_dev_threshold": 0.20,
    "max_threshold": 5.0
  },
  "data": [
    {
      "index": 0,
      "code": "FTLOX-01",
      "description": "[1294] LOX Flow Totalizer",
      "source": "[1294] LOX Flow Totalizer",
      "data": [
        {
          "value": 829908.5625,
          "timestamp": "2025-09-28T01:00:00+07:00"
        },
        {
          "value": 826878.5,
          "timestamp": "2025-09-28T00:00:00+07:00"
        },
        {
          "value": 823849.1875,
          "timestamp": "2025-09-27T23:00:00+07:00"
        }
        ...
</code></pre>
<hr>
<h2 id="visualisasi-alur-data">Visualisasi Alur Data</h2>
<figure>
    <div class="mermaid">
    flowchart TD
        A["DCS: Akumulator (Flow Totalizer)"] --&gt; B["Rapid SCADA: Simpan raw historis"]
        B --&gt; C["Node-RED: Ambil raw saat ERP request"]
        C --&gt; D["Bandingkan dengan Anchor"]
        D --&gt; E{"Zona deviasi?"}
        E --&gt;|"Hijau (&lt;= stddev)"| F["Applied: false"]
        E --&gt;|"Kuning (antara stddev dan max)"| G["Applied: true"]
        E --&gt;|"Merah (&gt; max)"| H["Applied: false"]
        F --&gt; I["Header correction"]
        G --&gt; I
        H --&gt; I
        I --&gt; J["ERP: Konsumsi payload"]
    </div>
<figcaption>Alur Anchor-Based Normalization: SCADA tetap menyimpan data mentah, Node-RED memutuskan zona deviasi, dan ERP selalu menerima data yang sudah diputuskan sesuai header koreksi.</figcaption>
</figure>  
<hr>
<h2 id="kesimpulan">Kesimpulan</h2>
<p>Dengan Anchor-Based Normalization berbasis anchor point di DCS dan logika tiga zona deviasi, pipeline data menjadi lebih presisi karena drift wajar terkoreksi, lebih aman karena noise kecil diabaikan dan outlier besar dilewatkan, serta lebih transparan karena data mentah tetap utuh sementara catatan koreksi tersimpan jelas.</p>
<p>Pendekatan ini membuat sistem audit-ready, mudah diajarkan lintas operator, dan scalable untuk berbagai aplikasi industri, khususnya pada akumulator seperti flow totalizer.</p>
<p>Hasilnya, audit tidak lagi disibukkan membetulkan angka, melainkan dapat langsung fokus pada analisis operasional dan pemeriksaan lanjutan berbasis catatan koreksi.</p>
