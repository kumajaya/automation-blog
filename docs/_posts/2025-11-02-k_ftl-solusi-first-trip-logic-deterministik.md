---
ghost_uuid: "3e0d6753-b2cd-4b98-a6d9-5e4db663f97b"
title: "K_FTL: Solusi First Trip Logic Deterministik"
date: "2025-11-02T21:20:50.000+07:00"
slug: "k_ftl-solusi-first-trip-logic-deterministik"
layout: "post"
excerpt: |
  First Trip Logic (FTL) membantu menentukan mesin pertama yang mengalami trip di antara banyak unit yang berjalan paralel. Artikel ini membahas desain, implementasi, dan validasi logika FTL menggunakan Structured Text dan Python di lingkungan Jupyter Notebook.
image: "https://images.unsplash.com/flagged/photo-1578928534298-9747fc52ec97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDJ8fHdpbm5lcnxlbnwwfHx8fDE3NjIwOTI0MzJ8MA&ixlib=rb-4.1.0&q=80&w=2000"
image_alt: ""
image_caption: "<span style=\"white-space: pre-wrap;\">Photo by </span><a href=\"https://unsplash.com/@joshgmit?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Joshua Golde</span></a><span style=\"white-space: pre-wrap;\"> / </span><a href=\"https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Unsplash</span></a>"
author:
  - "Ketut Kumajaya"
tags:
  - "Distributed Control System"
  - "Measurement Accuracy"
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
url: "https://automation.samatorgroup.com/blog/k_ftl-solusi-first-trip-logic-deterministik/"
comment_id: "6906e5aa28ca3e05927228de"
reading_time: 8
access: true
comments: false
---

{% raw %}
<p><strong>First Trip Logic Deterministik untuk Deteksi Trip Pertama Secara Akurat</strong></p>
<p><em>Ditulis oleh Ketut Kumajaya — 2 November 2025</em></p>
<h2 id="pendahuluan">Pendahuluan</h2>
<p>Dalam pengoperasian beberapa unit mesin secara bersamaan, seringkali terjadi trip yang tidak terduga. Yang paling krusial bagi operator dan engineer adalah <strong>mesin pertama yang mengalami trip</strong>, karena ini biasanya menjadi indikator awal masalah yang memerlukan tindakan cepat.</p>
<p>Logika standar yang hanya mencatat semua trip tanpa urutan seringkali membuat analisis menjadi lambat dan membingungkan. Untuk mengatasi hal ini, kita dapat menggunakan <strong>First Trip Logic (FTL)</strong> berbasis array dengan fitur rising edge detection, trip latching, dan pencatatan timestamp. Operator tetap bisa memantau status masing-masing mesin melalui pin input/output individual di diagram HMI.</p>
<hr>
<h2 id="desain-arsitektur-ftl">Desain Arsitektur FTL</h2>
<p>Solusi FTL terdiri dari dua bagian:</p>
<ol>
<li>
<p><strong>Core Function Block (K_FTL)</strong></p>
<ul>
<li>Mendeteksi trip pertama dari sejumlah mesin (default 8 channel).</li>
<li>Array-based input (<code>RunInputs[1..8]</code>).</li>
<li>Rising edge detection per channel untuk menghindari false trip.</li>
<li><code>TripLatched[]</code> menandai mesin yang sudah trip sampai reset manual.</li>
<li><code>FirstTripIndex</code> menunjukkan mesin pertama yang trip.</li>
<li><code>TripTime[]</code> mencatat timestamp trip untuk audit trail.</li>
<li>Deterministik: prioritas indeks mesin dijaga.</li>
</ul>
</li>
<li>
<p><strong>Wrapper Function Block (K_FTLW)</strong></p>
<ul>
<li>Memetakan 8 input/output individual (<code>In1..In8</code> → <code>RunInputs[1..8]</code>, <code>TripLatched[1..8]</code> → <code>Out1..Out8</code>).</li>
<li>Operator tetap dapat memantau status masing-masing mesin di diagram HMI.</li>
<li>Reset diteruskan ke core FB, dengan edge-hold untuk mencegah false first trip.</li>
</ul>
</li>
</ol>
<p><strong>Alur Logika:</strong></p>
<ul>
<li>Reset → inisialisasi semua trip latched &amp; timestamp → monitoring RunInputs → deteksi rising edge → latching → pencatatan FirstTripIndex &amp; TripTime.</li>
</ul>
<figure style="max-width:100%; margin:auto; text-align:center;">
  <div class="mermaid" style="width:75%; height:auto;">
%%{init: {'themeVariables': { 'primaryColor': '#FF5C6A', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#A5D8FF'}}}%%
flowchart TD
    A(["Start / Reset?"]) -- "Reset=TRUE" --&gt; B(["Set FirstTripIndex=0, TripLocked=FALSE, ResetLatch=TRUE"])
    B --&gt; C(["Inisialisasi TripLatched i=FALSE, TripTime i=DT#1970-01-01, PrevInputs i=RunInputs i"])
    C --&gt; D(["End Reset"])
    A -- "Reset=FALSE" --&gt; E(["ResetLatch=FALSE"])
    E --&gt; F(["Loop i=1..8"])
    F --&gt; G{"RunInputs i=TRUE AND PrevInputs i=FALSE?"}
    G -- Yes --&gt; H(["TripLatched i=TRUE, TripTime i=SYSTIME()"])
    H --&gt; I{"TripLocked=FALSE?"}
    I -- Yes --&gt; J(["FirstTripIndex=i, TripLocked=TRUE"])
    I -- No --&gt; K(["Do nothing"])
    G -- No --&gt; K
    K --&gt; L(["PrevInputs i=RunInputs i"])
    L --&gt; M{"i&lt;8?"}
    M -- Yes --&gt; F
    M -- No --&gt; N(["End Loop / Update Outputs"])
    N --&gt; O(["Map TripLatched i → Out1..Out8"])
    O --&gt; P(["Operator Monitoring Diagram"])
     A:::Rose
     B:::Ash
     C:::Ash
     D:::Rose
     E:::Sky
     F:::Rose
     G:::Peach
     H:::Sky
     I:::Peach
     J:::Sky
     K:::Sky
     L:::Sky
     M:::Peach
     N:::Rose
     O:::Pine
     P:::Pine
classDef Rose stroke-width:2px, stroke:#A0002E, fill:#FF5C6A, color:#FFFFFF
classDef Ash stroke-width:1px, stroke:#666666, fill:#DDDDDD, color:#000
classDef Sky stroke-width:1px, stroke:#1E3A8A, fill:#A5D8FF, color:#1E3A8A
classDef Peach stroke-width:2px, stroke:#FF8C00, fill:#FFD699, color:#8B4513
classDef Pine stroke-width:2px, stroke:#006400, fill:#3CB371, color:#FFFFFF
  </div>
  <figcaption style="font-style:italic; margin-top:8px;">
    Diagram First Trip Logic: Alur logika untuk mendeteksi trip pertama dari sekumpulan mesin
  </figcaption>
</figure>
<hr>
<h2 id="kode-implementasi">Kode Implementasi</h2>
<p>Berikut implementasi dalam Structured Text (ST) berdasarkan standar IEC 61131-3, dapat digunakan langsung pada PLC atau DCS yang kompatibel.</p>
<h3 id="core-function-block-%E2%80%93-kftl">Core Function Block – K_FTL</h3>
<pre><code class="language-pascal">(*
===========================================================
  K_FTL : Ketut - First Trip Logic
  Versi  : 1.0
  Author : Ketut Kumajaya
  Scope  : Function block untuk mendeteksi trip pertama
           dari sekumpulan mesin (default 8 input).
  Fitur  :
    - Array-based input (RunInputs[1..8])
    - Rising edge detection per channel
    - TripLatched[] → status trip latched sampai reset manual
    - FirstTripIndex → menunjukkan mesin pertama yang trip
    - TripTime[] → timestamp absolut untuk audit trail
    - Reset manual menghapus semua status
  Catatan :
    - Deterministik dengan prioritas indeks array
    - Nama mengikuti istilah industri: First Trip Logic
    - **Input RunInputs[i] harus aktif HIGH saat trip terjadi**
      Jika sinyal asli aktif LOW, lakukan inversi sebelum masuk FB:
        RunInputs[i] := NOT OriginalSignal[i]
===========================================================
*)

FUNCTION_BLOCK K_FTL
VAR_INPUT
    RunInputs : ARRAY[1..8] OF BOOL;  
    Reset     : BOOL;
END_VAR

VAR_OUTPUT
    FirstTripIndex : INT;                
    TripLatched    : ARRAY[1..8] OF BOOL;
    TripTime       : ARRAY[1..8] OF DT;  
END_VAR

VAR
    PrevInputs : ARRAY[1..8] OF BOOL;
    TripLocked : BOOL;
    ResetLatch : BOOL; 
    i          : INT;
END_VAR

IF Reset THEN
    FirstTripIndex := 0;
    TripLocked := FALSE;
    ResetLatch := TRUE;

    FOR i := 1 TO 8 DO
        TripLatched[i] := FALSE;
        TripTime[i] := DT#1970-01-01-00:00:00;
        PrevInputs[i] := RunInputs[i];  
    END_FOR;
ELSE
    ResetLatch := FALSE;

    FOR i := 1 TO 8 DO
        IF (NOT ResetLatch) AND (RunInputs[i] = TRUE) AND (PrevInputs[i] = FALSE) THEN
            TripLatched[i] := TRUE;
            TripTime[i] := SYSTIME();  

            IF NOT TripLocked THEN
                FirstTripIndex := i;
                TripLocked := TRUE;
            END_IF;
        END_IF;
        PrevInputs[i] := RunInputs[i];
    END_FOR;
END_IF;
END_FUNCTION_BLOCK
</code></pre>
<h3 id="wrapper-function-block-%E2%80%93-kftlw">Wrapper Function Block – K_FTLW</h3>
<pre><code class="language-pascal">(*===========================================================
  K_FTLW : Ketut - First Trip Logic Wrapper
  Versi  : 1.0
  Author : Ketut Kumajaya
  Scope  : Wrapper untuk K_FTL agar operator melihat
           8 pin input/output individual di diagram.
  Fitur  :
    - Memanggil K_FTL (array-based) di dalamnya
    - Memetakan In1..In8 → RunInputs[1..8]
    - Memetakan Out1..Out8 ← TripLatched[1..8]
    - Reset manual diteruskan ke core FB
  Catatan :
    - Operator tetap bisa memantau status individual
    - Deterministik dengan prioritas indeks array
===========================================================*)

FUNCTION_BLOCK K_FTLW
VAR_INPUT
    In1, In2, In3, In4, In5, In6, In7, In8 : BOOL;
    Reset : BOOL;
END_VAR

VAR_OUTPUT
    FirstTripIndex : INT;
    Out1, Out2, Out3, Out4, Out5, Out6, Out7, Out8 : BOOL;
END_VAR

VAR
    Core     : K_FTL;               
    RunArray : ARRAY[1..8] OF BOOL;
    i        : INT;
END_VAR

(* Map inputs *)
RunArray[1] := In1;
RunArray[2] := In2;
RunArray[3] := In3;
RunArray[4] := In4;
RunArray[5] := In5;
RunArray[6] := In6;
RunArray[7] := In7;
RunArray[8] := In8;

(* Call core FB *)
Core(RunInputs := RunArray, Reset := Reset);

(* Map outputs *)
FirstTripIndex := Core.FirstTripIndex;
Out1 := Core.TripLatched[1];
Out2 := Core.TripLatched[2];
Out3 := Core.TripLatched[3];
Out4 := Core.TripLatched[4];
Out5 := Core.TripLatched[5];
Out6 := Core.TripLatched[6];
Out7 := Core.TripLatched[7];
Out8 := Core.TripLatched[8];
</code></pre>
<hr>
<h2 id="verifikasi-melalui-simulasi">Verifikasi melalui Simulasi</h2>
<p>Untuk memvalidasi logika <strong>K_FTL</strong>, simulasi dilakukan menggunakan <strong>Python</strong> (mengadaptasi kode Structured Text ke class sederhana). Test case mencakup reset, no-trip, single trip, multiple trip, dan reset ulang. Timestamp menggunakan waktu real (mirip <code>SYSTIME()</code> di PLC).</p>
<blockquote>
<p>Untuk memastikan reprodusibilitas hasil dan mempercepat validasi, simulasi dilakukan di lingkungan <strong>Jupyter Notebook</strong>, yang memungkinkan eksekusi kode Python dan visualisasi hasil dalam satu lingkungan interaktif. Pendekatan ini memudahkan verifikasi logika <code>First Trip Logic</code> secara real-time, karena setiap perubahan nilai input dapat langsung diamati melalui output dan grafik timeline tanpa perlu kompilasi ulang atau deploy ke PLC.</p>
</blockquote>
<table>
<thead>
<tr>
<th>Test Case</th>
<th>Deskripsi</th>
<th>Input (RunInputs, Channel 1-8)</th>
<th>Reset Input</th>
<th>Hasil Utama</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>1: Reset Awal</strong></td>
<td>Inisialisasi semua status</td>
<td>[False x8]</td>
<td>True</td>
<td>FirstTripIndex=0<br>TripLatched=[False x8]<br>TripTime=[1970-01-01 x8]</td>
</tr>
<tr>
<td><strong>2: No Trip</strong></td>
<td>Monitoring tanpa perubahan</td>
<td>[False x8]</td>
<td>False</td>
<td>FirstTripIndex=0<br>TripLatched=[False x8]<br>TripTime=[1970-01-01 x8]</td>
</tr>
<tr>
<td><strong>3: Single Trip (Channel 4)</strong></td>
<td>Rising edge di channel 4</td>
<td>[False, False, False, <strong>True</strong> x4]</td>
<td>False</td>
<td>FirstTripIndex=<strong>4</strong><br>TripLatched=[False, False, False, <strong>True</strong> x4]<br>TripTime=[1970-01-01 x6, <strong>T1</strong> untuk ch4]</td>
</tr>
<tr>
<td><strong>4: Multiple Trip</strong></td>
<td>Tambah rising edge di semua channel</td>
<td>[True x8]</td>
<td>False</td>
<td>FirstTripIndex=<strong>4</strong> (tetap locked!)<br>TripLatched=[<strong>True x8</strong>]<br>TripTime=[<strong>T2</strong> x7, T1 untuk ch4]</td>
</tr>
<tr>
<td><strong>5: Reset Ulang</strong></td>
<td>Reset setelah multiple trip</td>
<td>[False x8]</td>
<td>True</td>
<td>FirstTripIndex=0<br>TripLatched=[False x8]<br>TripTime=[1970-01-01 x8]</td>
</tr>
</tbody>
</table>
<p><strong>Catatan Simulasi:</strong> Rising edge detection dan prioritas indeks terjaga. Timestamp <code>T1/T2</code> adalah waktu real saat trip.</p>
<details>
<summary><strong>Klik untuk Lihat Script Python Lengkap (Simulasi Real-Time)</strong></summary>
<pre><code class="language-python">import time, random
from datetime import datetime

class K_FTL:
    """
    K_FTL — First Trip Logic Deterministik

    Simulasi Function Block (FB) untuk mendeteksi sinyal trip pertama
    di antara beberapa input digital, lalu mengunci (lock) hasilnya
    agar tetap konsisten sampai di-reset.
    """

    def __init__(self):
        # --- Variabel internal ---
        self.FirstTripIndex = 0         # Channel pertama yang trip (1-based)
        self.TripLatched = [False] * 8  # Status latched tiap channel
        self.TripTime = [None] * 8      # Timestamp trip per channel
        self.PrevInputs = [False] * 8   # Nilai input sebelumnya
        self.TripLocked = False         # Lock ketika first trip sudah ditentukan
        self.ResetLatch = False         # Status reset terakhir

    def execute(self, RunInputs, Reset):
        """
        Jalankan logika FTL.
        RunInputs: list[bool] panjang 8 — status input digital
        Reset: bool — sinyal reset latch
        """
        current_real_time = time.time()

        if Reset:
            # Reset semua status internal
            self.FirstTripIndex = 0
            self.TripLocked = False
            self.ResetLatch = True
            for i in range(8):
                self.TripLatched[i] = False
                self.TripTime[i] = None
                self.PrevInputs[i] = RunInputs[i]
        else:
            self.ResetLatch = False
            for i in range(8):
                # Deteksi rising edge: FALSE → TRUE
                if not self.ResetLatch and RunInputs[i] and not self.PrevInputs[i]:
                    self.TripLatched[i] = True
                    self.TripTime[i] = current_real_time
                    # Catat trip pertama hanya sekali
                    if not self.TripLocked:
                        self.FirstTripIndex = i + 1
                        self.TripLocked = True
                self.PrevInputs[i] = RunInputs[i]


def print_status(ftl, test_name):
    """
    Print status internal FB dengan format waktu yang mudah dibaca.
    """
    print(f"\n{test_name}:")
    print(f"  FirstTripIndex: {ftl.FirstTripIndex}")
    print(f"  TripLatched   : {ftl.TripLatched}")
    formatted_times = [
        datetime.fromtimestamp(t).strftime('%Y-%m-%d %H:%M:%S')
        if t else '1970-01-01' for t in ftl.TripTime
    ]
    print(f"  TripTime      : {formatted_times}")

# --- Simulasi FTL ---
ftl = K_FTL()

# Test 1: Reset Awal
RunInputs = [False] * 8
ftl.execute(RunInputs, True)
print_status(ftl, "Test 1 - Reset Awal")

# Test 2: No Trip
ftl.execute(RunInputs, False)
print_status(ftl, "Test 2 - No Trip")

# Test 3: Single Trip (ubah channel sesuai kebutuhan)
trip_channel = 4
RunInputs[trip_channel - 1] = True
ftl.execute(RunInputs, False)
print_status(ftl, f"Test 3 - Single Trip Channel {trip_channel}")

# Test 4: Multiple Trip dengan delay acak 0.3–1.5s dan channel acak
channels = list(range(8))
random.shuffle(channels)  # urutan channel diacak
delays = [random.uniform(0.3, 1.5) for _ in range(8)]

print("\nTest 4 - Multiple Trip dengan delay acak dan channel acak:")
for ch, delay in zip(channels, delays):
    if not ftl.TripLatched[ch]:
        RunInputs[ch] = True
        time.sleep(delay)
        ftl.execute(RunInputs, False)
        print(f"  Tripped ch{ch+1} after {delay:.2f}s at {datetime.now().strftime('%H:%M:%S.%f')[:-3]}")
print_status(ftl, "Test 4 - Multiple Trip (random delay &amp; channel acak)")

# Test 5: Reset Ulang
ftl.execute(RunInputs, True)
print_status(ftl, "Test 5 - Reset Ulang")

</code></pre>
<h3 id="visualisasi-hasil-simulasi">Visualisasi Hasil Simulasi</h3>
<p>Script berikut untuk membuat visualisasi timeline terjadinya trip pada masing-masing channel berdasarkan hasil eksekusi class K_FTL di cell Jupyter Notebook sebelumnya. Setiap batang horizontal merepresentasikan waktu relatif terhadap trip pertama, sementara warna menunjukkan identitas channel yang mengalami trip.</p>
<blockquote>
<p><strong>Catatan</strong>: Pastikan bagian <code>Test 5: Reset Ulang</code> pada cell simulasi sebelumnya dihapus atau tidak dijalankan sebelum melakukan visualisasi, agar hasil grafik tetap merepresentasikan kondisi trip terakhir dengan benar.</p>
</blockquote>
<pre><code class="language-python">from datetime import datetime
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
import seaborn as sns

# --- Plotting ---
rel_times = [max(0.1, (ftl.TripTime[i] - ftl.TripTime[ftl.FirstTripIndex-1] if ftl.TripTime[i] else 0.1))
             for i in range(8)]

plt.rcParams['svg.fonttype'] = 'none'  # simpan teks sebagai teks, bukan path
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial']
plt.rcParams['font.size'] = 9  # basis font size lebih kecil
sns.set_style("whitegrid")
plt.style.use('seaborn-v0_8-darkgrid')
fig, ax = plt.subplots(figsize=(10,5))
colors = sns.color_palette("Spectral", 8)
colors[ftl.FirstTripIndex-1] = 'red'

for i in range(8):
    ax.barh(i, rel_times[i], color=colors[i],
            edgecolor='darkred' if i==ftl.FirstTripIndex-1 else 'navy',
            linewidth=1.5 if i==ftl.FirstTripIndex-1 else 1)
    if ftl.TripTime[i]:
        ax.text(rel_times[i]+0.05, i,
                datetime.fromtimestamp(ftl.TripTime[i]).strftime('%H:%M:%S'),
                va='center', ha='left', fontsize=8)

# Annotasi First Trip
ax.annotate(f'First Trip (Ch {ftl.FirstTripIndex})',
            xy=(rel_times[ftl.FirstTripIndex-1]+0.4, ftl.FirstTripIndex-1),
            xytext=(rel_times[ftl.FirstTripIndex-1]+1, ftl.FirstTripIndex-1+0.05),
            arrowprops=dict(facecolor='black', shrink=0.05, width=1.5, headwidth=6),
            fontsize=9, color='red')

ax.set_yticks(range(8))
ax.set_yticklabels(range(1,9))
ax.invert_yaxis()
ax.set_xlabel('Detik dari Trip Pertama')
ax.set_title(f'Timeline Trip per Channel (First Trip: Ch {ftl.FirstTripIndex})')
ax.grid(axis='x', linestyle='--', alpha=0.45, color='gray')
ax.set_xlim(0, max(rel_times)+1)

# Legend lebih ringkas
legend_elements = [Line2D([0],[0], color=colors[i], lw=3, label=f'Ch {i+1}') for i in range(8)]
ax.legend(handles=legend_elements, loc='upper right', fontsize=8)

# Simpan dan tampilkan plot
plt.tight_layout()
plt.savefig('ftl_trip_timeline.svg', format='svg')
plt.savefig('ftl_trip_timeline.png', format='png', dpi=300)
plt.show()

</code></pre>
</details>
<h3 id="visualisasi-timeline-trip-per-channel">Visualisasi Timeline Trip per Channel</h3>
<p>Setelah logika <code>First Trip Logic</code> disimulasikan dan diverifikasi di Jupyter Notebook, hasilnya divisualisasikan dalam bentuk diagram waktu agar memudahkan interpretasi urutan trip secara visual. Grafik ini juga berfungsi sebagai bukti deterministik bahwa <code>FirstTripIndex</code> <strong>selalu konsisten dengan urutan aktual terjadinya trip</strong>.</p>
<figure style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; max-width:900px; margin:16px auto;">
  <img src="/automation-blog/assets/media/3e0d6753-b2cd-4b98-a6d9-5e4db663f97b-ftl_trip_timeline.svg" alt="Timeline Trip per Channel" style="width:100%; height:auto; border:1px solid #ccc; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
  <figcaption style="font-style:italic; margin-top:8px;">
    Hasil Simulasi: Channel dengan titik waktu paling awal (contoh: Channel&nbsp;4)
    ditetapkan sebagai <strong>First Trip</strong>
  </figcaption>
</figure>
<hr>
<h2 id="manfaat-dan-kelebihan">Manfaat dan Kelebihan</h2>
<ul>
<li><strong>Human‑friendly</strong>: status mesin ditampilkan per pin di diagram HMI.</li>
<li><strong>Audit-ready</strong>: timestamp tiap trip memudahkan analisis root-cause.</li>
<li><strong>Deterministik</strong>: prioritas indeks terjaga; mesin pertama tercatat dengan benar.</li>
<li><strong>Scalable</strong>: core FB bisa diperluas dari 8 ke 16 channel dengan minimal modifikasi.</li>
<li><strong>Integrasi mudah</strong>: langsung bisa dipasang di DCS/PLC tanpa board tambahan.</li>
</ul>
<hr>
<h2 id="tips-best-practices">Tips &amp; Best Practices</h2>
<ol>
<li>Pastikan <strong>RunInputs</strong> aktif sebelum monitoring untuk menghindari false trip saat startup.</li>
<li>Lakukan <strong>reset saat kondisi aman</strong> agar first trip logika tidak salah deteksi.</li>
<li>Periksa fungsi timestamp di DCS Anda (SYSTIME atau CURRENT_DATE_TIME).</li>
<li>Simulasikan beberapa mesin trip secara bersamaan untuk memastikan <strong>FirstTripIndex</strong> berfungsi sesuai harapan.</li>
</ol>
<p><strong>Catatan</strong>:</p>
<ul>
<li>FB ini menentukan first trip secara deterministik berdasarkan <strong>indeks array input</strong>.</li>
<li>Jika beberapa mesin trip hampir bersamaan, prioritas dipengaruhi posisi di array.</li>
<li>Untuk kondisi kritis, bisa menggunakan <strong>dual FB parallel</strong>:<br>
• Jika kedua FB menghasilkan FirstTripIndex sama → trip pertama valid.<br>
• Jika berbeda → kondisi perlu dianalisis lebih lanjut.</li>
</ul>
<hr>
<h2 id="penutup">Penutup</h2>
<p>Dengan menggunakan <strong>K_FTL</strong>, Anda dapat membuat monitoring mesin lebih aman, terstruktur, dan human‑friendly. Logika deterministik ini memastikan <strong>mesin pertama yang trip selalu tercatat</strong> dengan tepat, mempermudah troubleshooting dan audit. Logika sederhana seperti ini bisa menjadi pembeda antara sistem yang hanya menunjukkan gejala dan sistem yang benar-benar memberi tahu akar masalah.</p>

{% endraw %}