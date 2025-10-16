---
ghost_uuid: "88173dfd-1504-4c07-bb99-637f72b68556"
title: "K_UNBALANCE: Function Block untuk Deteksi Ketidakseimbangan Tegangan/Arus di DCS"
date: "2025-10-03T16:04:31.000+07:00"
slug: "k_unbalance-function-block-untuk-deteksi-ketidakseimbangan-tegangan-arus-di-dcs"
layout: "post"
excerpt: |
  Dirancang untuk menghitung ketidakseimbangan tegangan atau arus dari tiga input dalam sistem DCS, khususnya pada power meter yang tidak menyediakan informasi unbalance.
image: "https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEyfHxiYWxhbmNlfGVufDB8fHx8MTc1OTQ4MTQ3Nnww&ixlib=rb-4.1.0&q=80&w=2000"
image_alt: ""
image_caption: "<span style=\"white-space: pre-wrap;\">Photo by </span><a href=\"https://unsplash.com/@coltonsturgeon?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Colton Sturgeon</span></a><span style=\"white-space: pre-wrap;\"> / </span><a href=\"https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Unsplash</span></a>"
author:
  - "Ketut Kumajaya"
tags:
  - "Distributed Control System"
  - "Practical Engineering"
  - "Field Experience"
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
url: "https://automation.samatorgroup.com/blog/k_unbalance-function-block-untuk-deteksi-ketidakseimbangan-tegangan-arus-di-dcs/"
comment_id: "68df8d117f770e05777e0ca8"
reading_time: 2
access: true
comments: false
---

<p><strong>Oleh: Ketut P. Kumajaya — 3 Oktober 2025</strong></p>
<h3 id="latar-belakang">Latar Belakang</h3>
<p>Dalam sistem distribusi daya, ketidakseimbangan antar fase tegangan atau arus dapat menyebabkan panas berlebih, penurunan efisiensi, dan gangguan pada peralatan. Sayangnya, banyak power meter tidak menyediakan informasi unbalance secara langsung. Untuk menutup celah ini, Function Block <code>K_UNBALANCE</code> dirancang menggunakan Structured Text (ST) di Supcon DCS sebagai artefak modular yang siap diaudit dan teachable lintas operator.</p>
<hr>
<h3 id="struktur-function-block">Struktur Function Block</h3>
<pre><code class="language-pascal">(*=============================================================================
  Function Block Name : K_UNBALANCE
  Author              : Ketut P. Kumajaya
  Date Created        : 18/03/2025
  Description         : Menghitung persentase ketidakseimbangan dari tiga input
                        dan memberikan nilai rata-rata sebagai referensi audit.
                        Dirancang untuk melengkapi power meter yang tidak
                        menyediakan informasi unbalance.
  Inputs              : IN1 - Input pertama (FLOAT)
                        IN2 - Input kedua (FLOAT)
                        IN3 - Input ketiga (FLOAT)
  Outputs             : UNB - Persentase ketidakseimbangan (FLOAT)
                        AVG - Nilai rata-rata dari ketiga input (FLOAT)
  Artefak Pairing     : arrayUNB - ARRAY [0..2] OF FLOAT
  Proteksi Audit      : Pembagian dengan nol dicegah secara eksplisit.
                        Nilai absolut dari AVG digunakan sebagai denominator
                        untuk memastikan UNB selalu positif, termasuk pada
                        input negatif akibat noise atau simulasi.
=============================================================================*)

FUNCTION_BLOCK K_UNBALANCE

VAR_INPUT
    IN1 : FLOAT; (* Input pertama *)
    IN2 : FLOAT; (* Input kedua *)
    IN3 : FLOAT; (* Input ketiga *)
END_VAR

VAR_OUTPUT
    UNB : FLOAT; (* Persentase ketidakseimbangan *)
    AVG : FLOAT; (* Nilai rata-rata dari ketiga input *)
END_VAR

VAR
    AvgValue      : FLOAT;
    MaxDeviation  : FLOAT;
    Deviation     : FLOAT;
    i             : INT;
    Values        : arrayUNB; (* arrayUNB = ARRAY [0..2] OF FLOAT *)
END_VAR

(* Pairing input ke array *)
Values[0] := IN1;
Values[1] := IN2;
Values[2] := IN3;

(* Hitung nilai rata-rata *)
AvgValue := 0.0;
FOR i := 0 TO 2 DO
    AvgValue := AvgValue + Values[i];
END_FOR;
AvgValue := AvgValue / 3.0;

(* Cari deviasi maksimum terhadap rata-rata *)
MaxDeviation := 0.0;
FOR i := 0 TO 2 DO
    Deviation := ABS_FLOAT(Values[i] - AvgValue);
    IF Deviation &gt; MaxDeviation THEN
        MaxDeviation := Deviation;
    END_IF;
END_FOR;

(* Hitung unbalance dan kirim nilai rata-rata *)
IF AvgValue &lt;&gt; 0.0 THEN
    UNB := (MaxDeviation / ABS_FLOAT(AvgValue)) * 100.0;
ELSE
    UNB := 0.0; (* Proteksi pembagian dengan nol *)
END_IF;

AVG := AvgValue;

END_FUNCTION_BLOCK
</code></pre>
<hr>
<h3 id="penjelasan-modularitas">Penjelasan Modularitas</h3>
<p>FB ini menggunakan pendekatan array (<code>arrayUNB</code>) untuk menyimpan input, sehingga logika perhitungan menjadi ringkas dan konsisten. Looping untuk rata-rata dan deviasi maksimum dilakukan secara eksplisit, memudahkan validasi runtime dan audit pairing.</p>
<p>Output <code>UNB</code> menunjukkan persentase ketidakseimbangan, sedangkan <code>AVG</code> memberikan baseline referensi untuk analisis deviasi. Proteksi terhadap pembagian nol memastikan FB ini robust dan siap digunakan dalam sistem SCADA.</p>
<hr>
<h3 id="flowchart">Flowchart</h3>
<div style="width: 100%; text-align: center; margin: 0.5em auto; max-width: 800px;">
    <div class="mermaid" style="width: 100%; max-width: 800px;">
    flowchart TD
        IN1["IN1 (Input pertama)"]
        IN2["IN2 (Input kedua)"]
        IN3["IN3 (Input ketiga)"]
        ARRAY["Values : arrayUNB"]
        AVG_LOOP["Loop Hitung Rata-rata"]
        DEV_LOOP["Loop Deviasi Maksimum"]
        PROTEKSI["Proteksi: AvgValue ≠ 0"]
        HITUNG_UNB["Hitung UNB (%)"]
        OUTPUT_UNB["UNB (Output ketidakseimbangan)"]
        OUTPUT_AVG["AVG (Output rata-rata)"]
        IN1 --&gt; ARRAY
        IN2 --&gt; ARRAY
        IN3 --&gt; ARRAY
        ARRAY --&gt; AVG_LOOP
        AVG_LOOP --&gt; DEV_LOOP
        DEV_LOOP --&gt; PROTEKSI
        PROTEKSI --&gt;|True| HITUNG_UNB
        PROTEKSI --&gt;|False| OUTPUT_UNB
        HITUNG_UNB --&gt; OUTPUT_UNB
        AVG_LOOP --&gt; OUTPUT_AVG
    </div>
</div>
<hr>
<h3 id="kesimpulan">Kesimpulan</h3>
<p>Function Block <code>K_UNBALANCE</code> adalah artefak modular yang memperkuat transparansi dan efisiensi dalam sistem DCS. Dengan pairing array, proteksi multi-lapis, dan output yang informatif, FB ini bisa dijadikan template untuk pengembangan Function Block lain yang audit-grade dan teachable lintas plant.</p>
