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
reading_time: 3
access: true
comments: false
---

{% raw %}
<p><strong>Oleh: Ketut P. Kumajaya — 3 Oktober 2025</strong></p>
<h3 id="latar-belakang">Latar Belakang</h3>
<p>Dalam sistem distribusi daya, ketidakseimbangan antar fase tegangan atau arus dapat menyebabkan panas berlebih, penurunan efisiensi, dan gangguan pada peralatan. Sayangnya, banyak power meter tidak menyediakan informasi unbalance secara langsung. Untuk menutup celah ini, Function Block <code>K_UNBALANCE</code> dirancang menggunakan Structured Text (ST) di Supcon DCS sebagai artefak modular yang siap diaudit dan teachable lintas operator.</p>
<hr>
<h3 id="struktur-function-block">Struktur Function Block</h3>
<pre><code class="language-pascal">(*------------------------------------------------------------------------------
 FB Name     : K_UNBALANCE
 Purpose     : Menghitung persentase ketidakseimbangan dari tiga input
               (tegangan atau arus 3-fasa) berdasarkan metode Unbalance Ratio
               (Voltage/Current). Memberikan nilai rata-rata sebagai referensi
               audit dan status alarm jika melebihi ambang batas.
 Author      : Ketut P. Kumajaya
 Contributor : Copilot (Microsoft AI)
 Version     : 1.1
 Date        : 21/10/2025

 Input       :
    IN1 (FLOAT) - Input pertama (misalnya V_A atau I_A)
    IN2 (FLOAT) - Input kedua (misalnya V_B atau I_B)
    IN3 (FLOAT) - Input ketiga (misalnya V_C atau I_C)
    THR (FLOAT) - Batas maksimum unbalance yang diperbolehkan

 Output      :
    UNB (FLOAT) - Persentase ketidakseimbangan
    AVG (FLOAT) - Nilai rata-rata dari ketiga input
    ALM (BOOL)  - Status alarm jika UNB &gt; THR

  Notes       :
    - UNB dihitung sebagai (deviasi maksimum / rata-rata) * 100% 
      (aproksimasi sederhana; untuk IEC Class A gunakan metode symmetrical components).
    - Proteksi div/0: jika AVG=0 maka UNB=0 dan ALM=FALSE.
    - Nilai absolut AVG digunakan sebagai denominator agar hasil selalu positif.
    - Voltage Unbalance harus dijaga ≤ 2% continuous (IEC 61000-4-30) 
      atau ≤ 1% di motor terminals (NEMA MG-1).
      Tegangan yang tidak seimbang sekecil 1–2% dapat memicu Current Unbalance 
      hingga 6–10 kali lebih besar. Current Unbalance direkomendasikan ≤ 10% 
      untuk menghindari derating motor.
    - Current Unbalance sangat sensitif terhadap voltage imbalance 
      dan dapat menyebabkan pemanasan berlebih. 
      Motor biasanya perlu derating 0.5–2% daya untuk setiap 1% Current Unbalance 
      yang melebihi batas.

  Referensi Standar :
    - IEC 61000-4-30 : Metode symmetrical components untuk Voltage Unbalance 
                       (Class A: agregasi 10-menit).
    - NEMA MG-1      : Voltage Unbalance &lt; 1% di motor terminals; 
                       Current Unbalance bisa 6–10 kali lebih besar 
                       (≤ 10% direkomendasikan).
    - IEEE 1159      : Praktik monitoring kualitas daya, termasuk imbalance detection.
------------------------------------------------------------------------------*)

FUNCTION_BLOCK K_UNBALANCE

VAR_INPUT
    IN1 : FLOAT;   (* Input pertama *)
    IN2 : FLOAT;   (* Input kedua *)
    IN3 : FLOAT;   (* Input ketiga *)
    THR : FLOAT;   (* Threshold unbalance *)
END_VAR

VAR_OUTPUT
    AVG : FLOAT;   (* Nilai rata-rata dari ketiga input *)
    UNB : FLOAT;   (* Persentase ketidakseimbangan *)
    ALM : BOOL;    (* Alarm jika UNB &gt; THR *)
END_VAR

VAR
    Delta1 : FLOAT;
    Delta2 : FLOAT;
    Delta3 : FLOAT;
    DeltaMax : FLOAT;
END_VAR

(* Hitung rata-rata *)
AVG := (IN1 + IN2 + IN3) / 3.0;

(* Proteksi div/0 *)
IF AVG &lt;&gt; 0.0 THEN
    (* Deviasi masing-masing input *)
    Delta1 := ABS_FLOAT(IN1 - AVG);
    Delta2 := ABS_FLOAT(IN2 - AVG);
    Delta3 := ABS_FLOAT(IN3 - AVG);

    (* Cari deviasi terbesar *)
    DeltaMax := MAX_FLOAT(Delta1, Delta2);
    DeltaMax := MAX_FLOAT(DeltaMax, Delta3);

    (* Hitung unbalance *)
    UNB := (DeltaMax / ABS_FLOAT(AVG)) * 100.0;

    (* Alarm check *)
    IF UNB &gt; THR THEN
        ALM := TRUE;
    ELSE
        ALM := FALSE;
    END_IF;
ELSE
    UNB := 0.0;
    ALM := FALSE;
END_IF;

END_FUNCTION_BLOCK
</code></pre>
<hr>
<h3 id="penjelasan-modularitas">Penjelasan Modularitas</h3>
<p>FB ini menggunakan pendekatan perhitungan eksplisit untuk menghitung rata-rata (<code>AVG</code>), deviasi tiap input, dan deviasi maksimum. Dengan cara ini, setiap langkah logika terlihat jelas dan mudah dipahami.</p>
<p>Output <code>UNB</code> menunjukkan persentase ketidakseimbangan, <code>AVG</code> menjadi baseline referensi, dan <code>ALM</code> memberikan status alarm otomatis jika nilai unbalance melebihi ambang batas (<code>THR</code>). Proteksi terhadap pembagian nol tetap diterapkan, sehingga FB robust dan siap diintegrasikan ke sistem SCADA lintas plant.</p>
<hr>
<h3 id="flowchart">Flowchart</h3>
<div style="width: 100%; text-align: center; margin: 0.5em auto; max-width: 800px;">
    <div class="mermaid" style="width: 100%; max-width: 800px;">
    flowchart TD
        IN1["IN1 (Input pertama)"]
        IN2["IN2 (Input kedua)"]
        IN3["IN3 (Input ketiga)"]
        THR["THR (Threshold)"]
        AVG_CALC["Hitung AVG = (IN1+IN2+IN3)/3"]
        PROTEKSI{"AVG ≠ 0 ?"}
        DELTA["Hitung deviasi Δ1, Δ2, Δ3"]
        DELTAMAX["Cari deviasi maksimum"]
        HITUNG_UNB["Hitung UNB = (Δmax / |AVG|) * 100%"]
        CEK_ALM{"UNB &gt; THR ?"}
        OUTPUT_UNB["UNB (Persentase ketidakseimbangan)"]
        OUTPUT_AVG["AVG (Nilai rata-rata)"]
        OUTPUT_ALM["ALM (Status Alarm)"]
        IN1 --&gt; AVG_CALC
        IN2 --&gt; AVG_CALC
        IN3 --&gt; AVG_CALC
        AVG_CALC --&gt; PROTEKSI
        PROTEKSI --&gt;|True| DELTA
        PROTEKSI --&gt;|False| OUTPUT_UNB
        DELTA --&gt; DELTAMAX
        DELTAMAX --&gt; HITUNG_UNB
        HITUNG_UNB --&gt; CEK_ALM
        THR --&gt; CEK_ALM
        CEK_ALM --&gt;|Ya| OUTPUT_ALM
        CEK_ALM --&gt;|Tidak| OUTPUT_ALM
        HITUNG_UNB --&gt; OUTPUT_UNB
        AVG_CALC --&gt; OUTPUT_AVG
    </div>
</div>
<hr>
<h3 id="kesimpulan">Kesimpulan</h3>
<p>Function Block <code>K_UNBALANCE</code> adalah artefak modular yang memperkuat transparansi dan efisiensi dalam sistem DCS. Dengan perhitungan eksplisit, proteksi terhadap pembagian nol, serta output yang informatif (<code>UNB</code>, <code>AVG</code>, dan <code>ALM</code>), FB ini siap dijadikan template untuk pengembangan Function Block lain yang audit‑grade dan teachable lintas plant.</p>

{% endraw %}