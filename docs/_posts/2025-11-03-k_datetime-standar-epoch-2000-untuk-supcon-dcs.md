---
ghost_uuid: "dd6d7d54-5f73-4373-8511-7593bb191989"
title: "K_DateTime – Standar Epoch 2000 untuk Supcon DCS"
date: "2025-11-03T09:58:46.000+07:00"
slug: "k_datetime-standar-epoch-2000-untuk-supcon-dcs"
layout: "post"
excerpt: |
  Implementasi Function Block dan Function Supcon DCS untuk mengelola timestamp dengan epoch 2000, termasuk structKDateTime untuk mengembalikan seluruh komponen tanggal/jam.
image: "https://images.unsplash.com/photo-1616962430739-97b42c426926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfHxlcG9jaHxlbnwwfHx8fDE3NjIxMzg2Nzl8MA&ixlib=rb-4.1.0&q=80&w=2000"
image_alt: ""
image_caption: "<span style=\"white-space: pre-wrap;\">Photo by </span><a href=\"https://unsplash.com/@omadrigalh?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Orlando Madrigal</span></a><span style=\"white-space: pre-wrap;\"> / </span><a href=\"https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Unsplash</span></a>"
author:
  - "Ketut Kumajaya"
tags:
  - "Distributed Control System"
  - "Measurement Accuracy"
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
url: "https://automation.samatorgroup.com/blog/k_datetime-standar-epoch-2000-untuk-supcon-dcs/"
comment_id: "69080f4a28ca3e05927229ed"
reading_time: 10
access: true
comments: false
---

{% raw %}
<h1 id="kdatetime-%E2%80%93-standar-epoch-2000-untuk-supcon-dcs">K_DateTime – Standar Epoch 2000 untuk Supcon DCS</h1>
<p><em>Ditulis oleh Ketut Kumajaya — 3 November 2025</em></p>
<h2 id="pendahuluan">Pendahuluan</h2>
<p>Dalam sistem SCADA/DCS modern, pengelolaan timestamp sangat penting untuk pencatatan alarm, historikal, dan monitoring performa mesin. Secara umum, timestamp sering disimpan sebagai <strong>epoch</strong> (detik sejak suatu tanggal acuan).</p>
<p>Mayoritas sistem menggunakan <strong>epoch 1970</strong>, tetapi di PLC/DCS dengan tipe <strong>LONG 32-bit</strong>, hal ini memiliki keterbatasan:</p>
<ul>
<li>Nilai maksimum LONG signed: ±2.147.483.647</li>
<li>Jika dihitung detik sejak 1970, akan overflow pada sekitar tahun 2038 (<strong>Y2K38 problem</strong>)</li>
</ul>
<p>Untuk menghindari hal ini, kita dapat menggunakan <strong>epoch 2000</strong> sebagai acuan. Dengan tipe <strong>ULONG 32-bit</strong>, kita bisa mencatat detik positif sampai sekitar <strong>tahun 2136</strong>, cukup untuk kebutuhan jangka panjang.</p>
<h2 id="masalah">Masalah</h2>
<ol>
<li>Function Block hanya bisa mengembalikan satu nilai di Function, sedangkan tanggal terdiri dari enam komponen (Year, Month, Day, Hour, Minute, Second).</li>
<li>Perlu standar yang mudah digunakan untuk logging, historikal, dan alarm timestamp.</li>
</ol>
<h2 id="solusi-function-block-function-untuk-epoch-2000">Solusi: Function Block &amp; Function untuk Epoch 2000</h2>
<p>Beberapa komponen siap pakai dibuat untuk Supcon DCS:</p>
<table>
<thead>
<tr>
<th>Nama</th>
<th>Tipe</th>
<th>Fungsi</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>K_DateToEpoch</code></td>
<td>Function Block</td>
<td>Konversi Year/Month/Day/Hour/Minute/Second → Epoch (ULONG)</td>
</tr>
<tr>
<td><code>K_EpochToDate</code></td>
<td>Function Block</td>
<td>Konversi Epoch → Year/Month/Day/Hour/Minute/Second</td>
</tr>
<tr>
<td><code>K_DateToEpochF</code></td>
<td>Function</td>
<td>Konversi tanggal → Epoch, dikembalikan sebagai <strong>ULONG</strong></td>
</tr>
<tr>
<td><code>K_EpochToDateF</code></td>
<td>Function</td>
<td>Konversi Epoch → tanggal, dikembalikan sebagai <strong>structKDateTime</strong></td>
</tr>
</tbody>
</table>
<h3 id="struct-untuk-function">Struct untuk Function</h3>
<pre><code class="language-pascal">TYPE structKDateTime :
STRUCT
    Year   : INT;
    Month  : INT;
    Day    : INT;
    Hour   : INT;
    Minute : INT;
    Second : INT;
END_STRUCT
END_TYPE
</code></pre>
<p>Struct ini memungkinkan Function mengembalikan <strong>satu variabel kompleks</strong> berisi semua komponen tanggal/jam.</p>
<h3 id="kdatetoepoch-function-block">K_DateToEpoch (Function Block)</h3>
<pre><code class="language-pascal">(*
    FUNCTION BLOCK : K_DateToEpoch
    Deskripsi   : Mengonversi tanggal &amp; waktu (Y,M,D,H,M,S) menjadi Epoch 2000 (ULONG)
    Input       : Year, Month, Day, Hour, Minute, Second : INT
    Output      : EpochSec : ULONG
    Catatan     : Leap year sudah diperhitungkan. Validasi input termasuk early return.
*)

FUNCTION_BLOCK K_DateToEpoch
VAR_INPUT
    Year, Month, Day, Hour, Minute, Second : INT;
END_VAR
VAR_OUTPUT
    EpochSec : ULONG;
END_VAR
VAR
    DaysSince2000 : ULONG;
    i : INT;
    MonthDays : ARRAY[1..12] OF INT := [31,28,31,30,31,30,31,31,30,31,30,31];
END_VAR

// --- Validasi Input ---
IF Month &lt; 1 OR Month &gt; 12 THEN EpochSec := 0; RETURN; END_IF;
IF Day &lt; 1 OR Day &gt; 31 THEN EpochSec := 0; RETURN; END_IF;
IF Hour &lt; 0 OR Hour &gt; 23 THEN EpochSec := 0; RETURN; END_IF;
IF Minute &lt; 0 OR Minute &gt; 59 THEN EpochSec := 0; RETURN; END_IF;
IF Second &lt; 0 OR Second &gt; 59 THEN EpochSec := 0; RETURN; END_IF;

// --- Hitung Epoch ---
DaysSince2000 := 0;
FOR i := 2000 TO Year-1 DO
    IF (i MOD 4 = 0 AND (i MOD 100 &lt;&gt; 0 OR i MOD 400 = 0)) THEN
        DaysSince2000 := DaysSince2000 + 366;
    ELSE
        DaysSince2000 := DaysSince2000 + 365;
    END_IF;
END_FOR
FOR i := 1 TO Month-1 DO
    DaysSince2000 := DaysSince2000 + MonthDays[i];
END_FOR
IF (Month &gt; 2 AND Year MOD 4=0 AND (Year MOD 100&lt;&gt;0 OR Year MOD 400=0)) THEN
    DaysSince2000 := DaysSince2000 + 1;
END_IF

// --- Validasi Day lebih presisi (opsional) ---
IF Day &gt; MonthDays[Month] + (IF (Month=2 AND Year MOD 4=0 AND (Year MOD 100&lt;&gt;0 OR Year MOD 400=0)) THEN 1 ELSE 0) THEN
    EpochSec := 0;
    RETURN;
END_IF

DaysSince2000 := DaysSince2000 + (Day - 1);

EpochSec := DaysSince2000 * 86400 + Hour * 3600 + Minute * 60 + Second;

END_FUNCTION_BLOCK
</code></pre>
<h3 id="kepochtodate-function-block">K_EpochToDate (Function Block)</h3>
<pre><code class="language-pascal">(*
    FUNCTION BLOCK : K_EpochToDate
    Deskripsi   : Mengonversi Epoch 2000 (ULONG) menjadi tanggal &amp; waktu (Y,M,D,H,M,S)
    Input       : EpochSec : ULONG
    Output      : Year, Month, Day, Hour, Minute, Second : INT
    Catatan     : Epoch &gt; 4294967295 dianggap invalid. Leap year sudah diperhitungkan.
*)

FUNCTION_BLOCK K_EpochToDate
VAR_INPUT
    EpochSec : ULONG;
END_VAR
VAR_OUTPUT
    Year, Month, Day, Hour, Minute, Second : INT;
END_VAR
VAR
    Days, RemSec : ULONG;
    i : INT;
    MonthDays : ARRAY[1..12] OF INT := [31,28,31,30,31,30,31,31,30,31,30,31];
END_VAR

// --- Validasi Input ---
IF EpochSec &gt; 4294967295 THEN
    Year := 0; Month := 0; Day := 0;
    Hour := 0; Minute := 0; Second := 0;
    RETURN;
END_IF;

// --- Hitung tanggal/waktu ---
Days := EpochSec / 86400;
RemSec := EpochSec MOD 86400;

Hour := RemSec / 3600;
Minute := (RemSec MOD 3600) / 60;
Second := RemSec MOD 60;

Year := 2000;
WHILE TRUE DO
    IF (Year MOD 4=0 AND (Year MOD 100&lt;&gt;0 OR Year MOD 400=0)) THEN
        i := 366;
    ELSE
        i := 365;
    END_IF;
    IF Days &gt;= i THEN
        Days := Days - i;
        Year := Year + 1;
    ELSE
        EXIT;
    END_IF;
END_WHILE

Month := 1;
FOR i := 1 TO 12 DO
    IF (Month = 2 AND Year MOD 4=0 AND (Year MOD 100&lt;&gt;0 OR Year MOD 400=0)) THEN
        IF Days &gt;= 29 THEN
            Days := Days - 29;
            Month := Month + 1;
        ELSE
            EXIT;
        END_IF;
    ELSE
        IF Days &gt;= MonthDays[i] THEN
            Days := Days - MonthDays[i];
            Month := Month + 1;
        ELSE
            EXIT;
        END_IF;
    END_IF;
END_FOR

Day := Days + 1;

END_FUNCTION_BLOCK
</code></pre>
<details>
<summary><strong>Klik untuk Lihat Implementasi Inline Function</strong></summary>
<h3 id="kdatetoepochf-function">K_DateToEpochF (Function)</h3>
<pre><code class="language-pascal">(*
    FUNCTION : K_DateToEpochF
    Deskripsi   : Mengonversi tanggal &amp; waktu (Y,M,D,H,M,S) menjadi Epoch 2000 (ULONG)
    Input       : Year, Month, Day, Hour, Minute, Second : INT
    Return      : EpochSec : ULONG
    Catatan     : Sama seperti K_DateToEpoch, tapi dikemas sebagai inline Function.
*)

FUNCTION K_DateToEpochF : ULONG
VAR_INPUT
    Year, Month, Day, Hour, Minute, Second : INT;
END_VAR
VAR
    DaysSince2000 : ULONG;
    i : INT;
    MonthDays : ARRAY[1..12] OF INT := [31,28,31,30,31,30,31,31,30,31,30,31];
END_VAR

// --- Validasi Input ---
IF Month &lt; 1 OR Month &gt; 12 THEN K_DateToEpochF := 0; RETURN; END_IF;
IF Day &lt; 1 OR Day &gt; 31 THEN K_DateToEpochF := 0; RETURN; END_IF;
IF Hour &lt; 0 OR Hour &gt; 23 THEN K_DateToEpochF := 0; RETURN; END_IF;
IF Minute &lt; 0 OR Minute &gt; 59 THEN K_DateToEpochF := 0; RETURN; END_IF;
IF Second &lt; 0 OR Second &gt; 59 THEN K_DateToEpochF := 0; RETURN; END_IF;

// --- Hitung Epoch ---
DaysSince2000 := 0;
FOR i := 2000 TO Year-1 DO
    IF (i MOD 4 = 0 AND (i MOD 100 &lt;&gt; 0 OR i MOD 400 = 0)) THEN
        DaysSince2000 := DaysSince2000 + 366;
    ELSE
        DaysSince2000 := DaysSince2000 + 365;
    END_IF;
END_FOR
FOR i := 1 TO Month-1 DO
    DaysSince2000 := DaysSince2000 + MonthDays[i];
END_FOR
IF (Month &gt; 2 AND Year MOD 4=0 AND (Year MOD 100&lt;&gt;0 OR Year MOD 400=0)) THEN
    DaysSince2000 := DaysSince2000 + 1;
END_IF

// --- Validasi Day lebih presisi (opsional) ---
IF Day &gt; MonthDays[Month] + (IF (Month=2 AND Year MOD 4=0 AND (Year MOD 100&lt;&gt;0 OR Year MOD 400=0)) THEN 1 ELSE 0) THEN
    K_DateToEpochF := 0;
    RETURN;
END_IF

DaysSince2000 := DaysSince2000 + (Day - 1);

K_DateToEpochF := DaysSince2000 * 86400 + Hour * 3600 + Minute * 60 + Second;

END_FUNCTION
</code></pre>
<hr>
<h3 id="kepochtodatef-function">K_EpochToDateF (Function)</h3>
<pre><code class="language-pascal">(*
    FUNCTION : K_EpochToDateF
    Deskripsi   : Mengonversi Epoch 2000 (ULONG) menjadi tanggal &amp; waktu (structKDateTime)
    Input       : EpochSec : ULONG
    Return      : structKDateTime {Year, Month, Day, Hour, Minute, Second}
    Catatan     : Sama seperti K_EpochToDate, tapi dikemas sebagai inline Function.
*)

FUNCTION K_EpochToDateF : structKDateTime
VAR_INPUT
    EpochSec : ULONG;
END_VAR
VAR
    Days, RemSec : ULONG;
    i : INT;
    MonthDays : ARRAY[1..12] OF INT := [31,28,31,30,31,30,31,31,30,31,30,31];
    Result : structKDateTime;
END_VAR

// --- Validasi Input ---
IF EpochSec &gt; 4294967295 THEN
    Result.Year := 0; Result.Month := 0; Result.Day := 0;
    Result.Hour := 0; Result.Minute := 0; Result.Second := 0;
    K_EpochToDateF := Result;
    RETURN;
END_IF;

// --- Hitung tanggal/waktu ---
Days := EpochSec / 86400;
RemSec := EpochSec MOD 86400;

Result.Hour := RemSec / 3600;
Result.Minute := (RemSec MOD 3600) / 60;
Result.Second := RemSec MOD 60;

Result.Year := 2000;
WHILE TRUE DO
    IF (Result.Year MOD 4=0 AND (Result.Year MOD 100&lt;&gt;0 OR Result.Year MOD 400=0)) THEN
        i := 366;
    ELSE
        i := 365;
    END_IF;
    IF Days &gt;= i THEN
        Days := Days - i;
        Result.Year := Result.Year + 1;
    ELSE
        EXIT;
    END_IF;
END_WHILE

Result.Month := 1;
FOR i := 1 TO 12 DO
    IF (Result.Month = 2 AND Result.Year MOD 4=0 AND (Result.Year MOD 100&lt;&gt;0 OR Result.Year MOD 400=0)) THEN
        IF Days &gt;= 29 THEN
            Days := Days - 29;
            Result.Month := Result.Month + 1;
        ELSE
            EXIT;
        END_IF;
    ELSE
        IF Days &gt;= MonthDays[i] THEN
            Days := Days - MonthDays[i];
            Result.Month := Result.Month + 1;
        ELSE
            EXIT;
        END_IF;
    END_IF;
END_FOR

Result.Day := Days + 1;

K_EpochToDateF := Result;

END_FUNCTION
</code></pre>
</details>
<hr>
<h2 id="tabel-validasi">Tabel Validasi</h2>
<p>Tabel berikut menunjukkan hasil validasi <strong>K_DateTime</strong> untuk berbagai kasus input, mulai dari tanggal normal, leap year, hingga input invalid. Kolom <em>Actual Output</em> menampilkan hasil simulasi, dan kolom <em>Status</em> menunjukkan apakah hasil sesuai dengan ekspektasi.</p>
<table>
<thead>
<tr>
<th style="text-align:left">Test Case</th>
<th style="text-align:left">Input</th>
<th style="text-align:left">Expected Output</th>
<th style="text-align:left">Actual Output (Simulasi)</th>
<th style="text-align:left">Status</th>
<th style="text-align:left">Catatan</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left"><strong>Contoh Hari Ini</strong></td>
<td style="text-align:left">2025-11-03 08:30:00</td>
<td style="text-align:left">Epoch: 815473800</td>
<td style="text-align:left">815473800<br>Balik: 2025-11-03 08:30:00</td>
<td style="text-align:left">✅ Pass</td>
<td style="text-align:left">Round-trip perfect.</td>
</tr>
<tr>
<td style="text-align:left"><strong>Leap Year (2000)</strong></td>
<td style="text-align:left">2000-02-29 00:00:00</td>
<td style="text-align:left">Epoch: 5097600</td>
<td style="text-align:left">5097600<br>Balik: 2000-02-29 00:00:00</td>
<td style="text-align:left">✅ Pass</td>
<td style="text-align:left">Leap day ditangani benar (+1 hari).</td>
</tr>
<tr>
<td style="text-align:left"><strong>Non-Leap Feb</strong></td>
<td style="text-align:left">2025-02-28 23:59:59</td>
<td style="text-align:left">Epoch: 794102399</td>
<td style="text-align:left">794102399<br>Balik: 2025-02-28 23:59:59</td>
<td style="text-align:left">✅ Pass</td>
<td style="text-align:left">Hitungan detik dari 1 Jan 2000 sesuai, round-trip valid.</td>
</tr>
<tr>
<td style="text-align:left"><strong>Invalid Month</strong></td>
<td style="text-align:left">2025-13-03 08:30:00</td>
<td style="text-align:left">Epoch: 0 (validasi)</td>
<td style="text-align:left">0<br>Balik: 2000-01-01 00:00:00</td>
<td style="text-align:left">✅ Pass</td>
<td style="text-align:left">Validasi early return bekerja.</td>
</tr>
<tr>
<td style="text-align:left"><strong>Invalid Day (31 Apr)</strong></td>
<td style="text-align:left">2025-04-31 08:30:00</td>
<td style="text-align:left">Epoch: 0 (validasi)</td>
<td style="text-align:left">0<br>Balik: 2000-01-01 00:00:00</td>
<td style="text-align:left">✅ Pass</td>
<td style="text-align:left">Presisi validasi cegah April 31 (max 30).</td>
</tr>
<tr>
<td style="text-align:left"><strong>Invalid Day (Feb 30)</strong></td>
<td style="text-align:left">2024-02-30 12:00:00</td>
<td style="text-align:left">Epoch: 0 (validasi, leap year)</td>
<td style="text-align:left">0<br>Balik: 2000-01-01 00:00:00</td>
<td style="text-align:left">✅ Pass</td>
<td style="text-align:left">2024 leap (max 29), validasi + leap adjust tangkap ini.</td>
</tr>
<tr>
<td style="text-align:left"><strong>Invalid Time (Hour)</strong></td>
<td style="text-align:left">2025-11-03 25:00:00</td>
<td style="text-align:left">Epoch: 0</td>
<td style="text-align:left">0<br>Balik: 2000-01-01 00:00:00</td>
<td style="text-align:left">✅ Pass</td>
<td style="text-align:left">Jam &gt;23 ditolak.</td>
</tr>
<tr>
<td style="text-align:left"><strong>Epoch 0</strong></td>
<td style="text-align:left">Epoch: 0</td>
<td style="text-align:left">Date: 2000-01-01 00:00:00</td>
<td style="text-align:left">{2000,1,1,0,0,0}</td>
<td style="text-align:left">✅ Pass</td>
<td style="text-align:left">Baseline acuan benar.</td>
</tr>
<tr>
<td style="text-align:left"><strong>Max ULONG</strong></td>
<td style="text-align:left">Epoch: 4294967295</td>
<td style="text-align:left">~2136-02-07 06:28:15</td>
<td style="text-align:left">{2136,2,7,6,28,15}</td>
<td style="text-align:left">✅ Pass</td>
<td style="text-align:left">Batas 32-bit tepat (tidak overflow loop).</td>
</tr>
<tr>
<td style="text-align:left"><strong>Overflow Check</strong></td>
<td style="text-align:left">Epoch: 4294967296</td>
<td style="text-align:left">{0,0,0,0,0,0}</td>
<td style="text-align:left">{0,0,0,0,0,0}</td>
<td style="text-align:left">✅ Pass</td>
<td style="text-align:left">Guard &gt;2^32-1 mencegah loop infinite.</td>
</tr>
</tbody>
</table>
<details>
<summary><strong>Klik untuk Lihat Script Validasi</strong></summary>
<pre><code class="language-python">import pandas as pd
from datetime import datetime, timezone

# Simulasi MonthDays array dari ST
MONTH_DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]  # Index 0 unused

def is_leap_year(year):
    """Simulasi aturan leap year Gregorian dari ST."""
    return (year % 4 == 0 and (year % 100 != 0 or year % 400 == 0))

def date_to_epoch2000(year, month, day, hour, minute, second):
    """
    Simulasi K_DateToEpochF / K_DateToEpoch.
    Return: epoch_sec (int) atau 0 jika invalid.
    """
    # Validasi input (sama seperti ST)
    if not (1 &lt;= month &lt;= 12):
        return 0
    if not (1 &lt;= day &lt;= 31):
        return 0
    if not (0 &lt;= hour &lt;= 23):
        return 0
    if not (0 &lt;= minute &lt;= 59):
        return 0
    if not (0 &lt;= second &lt;= 59):
        return 0

    # Validasi day presisi (opsional, seperti update ST)
    max_days = MONTH_DAYS[month]
    if month == 2 and is_leap_year(year):
        max_days += 1
    if day &gt; max_days:
        return 0

    # Hitung days since 2000
    days_since_2000 = 0
    # Loop tahun 2000 to year-1
    for i in range(2000, year):
        days_since_2000 += 366 if is_leap_year(i) else 365
    # Loop bulan 1 to month-1
    for i in range(1, month):
        days_since_2000 += MONTH_DAYS[i]
    # Leap day adjustment jika month &gt;2 dan leap
    if month &gt; 2 and is_leap_year(year):
        days_since_2000 += 1
    # + (day - 1)
    days_since_2000 += (day - 1)

    # Epoch sec
    epoch_sec = days_since_2000 * 86400 + hour * 3600 + minute * 60 + second
    return epoch_sec

def epoch_to_date2000(epoch_sec):
    """
    Simulasi K_EpochToDateF / K_EpochToDate.
    Return: dict {'year': int, 'month': int, 'day': int, 'hour': int, 'minute': int, 'second': int}
    atau {'year': 0, ...} jika invalid.
    """
    # Validasi input (ULONG max ~4.29e9)
    if epoch_sec &gt; 4294967295:
        return {'year': 0, 'month': 0, 'day': 0, 'hour': 0, 'minute': 0, 'second': 0}

    # Hitung days dan rem sec
    days = epoch_sec // 86400
    rem_sec = epoch_sec % 86400

    hour = rem_sec // 3600
    minute = (rem_sec % 3600) // 60
    second = rem_sec % 60

    # Loop tahun dari 2000
    year = 2000
    while True:
        days_in_year = 366 if is_leap_year(year) else 365
        if days &gt;= days_in_year:
            days -= days_in_year
            year += 1
        else:
            break

    # Loop bulan
    month = 1
    for i in range(1, 13):
        days_in_month = MONTH_DAYS[i]
        if i == 2 and is_leap_year(year):
            days_in_month = 29
        if days &gt;= days_in_month:
            days -= days_in_month
            month += 1
        else:
            break

    day = days + 1

    return {'year': year, 'month': month, 'day': day, 'hour': hour, 'minute': minute, 'second': second}

# Test Cases
test_cases = [
    ("Contoh Hari Ini", "date", (2025, 11, 3, 8, 30, 0), "Epoch: 815473800", "✅ Pass", "Round-trip perfect.", "2025-11-03 08:30:00"),
    ("Leap Year (2000)", "date", (2000, 2, 29, 0, 0, 0), "Epoch: 5097600", "✅ Pass", "Leap day ditangani benar (+1 hari).", "2000-02-29 00:00:00"),
    ("Non-Leap Feb", "date", (2025, 2, 28, 23, 59, 59), "Epoch: 794102399", "✅ Pass", "Hitungan detik dari 1 Jan 2000 sesuai, round-trip valid.", "2025-02-28 23:59:59"),
    ("Invalid Month", "date", (2025, 13, 3, 8, 30, 0), "Epoch: 0 (validasi)", "✅ Pass", "Validasi early return bekerja.", "2000-01-01 00:00:00"),
    ("Invalid Day (31 Apr)", "date", (2025, 4, 31, 8, 30, 0), "Epoch: 0 (validasi)", "✅ Pass", "Presisi validasi cegah April 31 (max 30).", "2000-01-01 00:00:00"),
    ("Invalid Day (Feb 30)", "date", (2024, 2, 30, 12, 0, 0), "Epoch: 0 (validasi, leap year)", "✅ Pass", "2024 leap (max 29), validasi + leap adjust tangkap ini.", "2000-01-01 00:00:00"),
    ("Invalid Time (Hour)", "date", (2025, 11, 3, 25, 0, 0), "Epoch: 0", "✅ Pass", "Jam &gt;23 ditolak.", "2000-01-01 00:00:00"),
    ("Epoch 0", "epoch", 0, "Date: 2000-01-01 00:00:00", "✅ Pass", "Baseline acuan benar.", "{2000,1,1,0,0,0}"),
    ("Max ULONG", "epoch", 4294967295, "~2136-02-07 06:28:15", "✅ Pass", "Batas 32-bit tepat (tidak overflow loop).", "{2136,2,7,6,28,15}"),
    ("Overflow Check", "epoch", 4294967296, "{0,0,0,0,0,0}", "✅ Pass", "Guard &gt;2^32-1 mencegah loop infinite.", "{0,0,0,0,0,0}"),
]

# Jalankan simulasi dan kumpulkan hasil
data = []
for name, input_type, input_val, expected_str, status, catatan, balik_str in test_cases:
    if input_type == "date":
        actual_epoch = date_to_epoch2000(*input_val)
        round_trip = epoch_to_date2000(actual_epoch)
        if actual_epoch == 0:
            balik_formatted = "2000-01-01 00:00:00"
        else:
            balik_formatted = f"{round_trip['year']}-{round_trip['month']:02d}-{round_trip['day']:02d} {round_trip['hour']:02d}:{round_trip['minute']:02d}:{round_trip['second']:02d}"
        actual_output = f"{actual_epoch}&lt;br&gt;Balik: {balik_formatted}"
        rt_match = (balik_formatted == balik_str)
        expected_val = int(expected_str.split(': ')[-1].split(' ')[0])
        is_pass = (actual_epoch == expected_val and rt_match)
        final_status = "✅ Pass" if is_pass else "❌ Fail"
        catatan_final = catatan if is_pass else f"FAIL: Epoch mismatch (Expected: {expected_val}, Actual: {actual_epoch})"
        data.append({
            'Test Case': name,
            'Input': f"{input_val[0]}-{input_val[1]:02d}-{input_val[2]:02d} {input_val[3]:02d}:{input_val[4]:02d}:{input_val[5]:02d}",
            'Expected Output': expected_str,
            'Actual Output (Simulasi)': actual_output,
            'Status': final_status,
            'Catatan': catatan_final
        })
    else:  # epoch
        actual_date = epoch_to_date2000(input_val)
        actual_str = f"{{{actual_date['year']},{actual_date['month']},{actual_date['day']},{actual_date['hour']},{actual_date['minute']},{actual_date['second']}}}"
        is_pass = (actual_str == balik_str)
        final_status = "✅ Pass" if is_pass else "❌ Fail"
        catatan_final = catatan if is_pass else f"FAIL: Date mismatch (Expected: {balik_str}, Actual: {actual_str})"
        data.append({
            'Test Case': name,
            'Input': f"Epoch: {input_val}",
            'Expected Output': expected_str,
            'Actual Output (Simulasi)': actual_str,
            'Status': final_status,
            'Catatan': catatan_final
        })

# Optional: Cross-check
print("\n=== CROSS-CHECK DENGAN DATETIME LIBRARY ===")
for name, input_type, input_val, _, _, _, _ in test_cases:
    if input_type == "date" and name not in ["Invalid Month", "Invalid Day (31 Apr)", "Invalid Day (Feb 30)", "Invalid Time (Hour)"]:
        dt = datetime(input_val[0], input_val[1], input_val[2], input_val[3], input_val[4], input_val[5], tzinfo=timezone.utc)
        epoch_std = int(dt.timestamp()) - int(datetime(2000, 1, 1, tzinfo=timezone.utc).timestamp())
        print(f"{name}: Simulasi={date_to_epoch2000(*input_val)}, Std={epoch_std} → Match: {date_to_epoch2000(*input_val) == epoch_std}")

# Simpan hasil ke markdown
print("\n=== SIMPAN  HASIL KE MARKDOWN ===")
df = pd.DataFrame(data)
df.to_markdown('tabel_validasi.md', index=False)
print("Data validasi disimpan ke 'tabel_validasi.md'.")

</code></pre>
</details>
<hr>
<h2 id="panduan-implementasi">Panduan Implementasi</h2>
<ol>
<li>Masukkan semua kode ke proyek Supcon DCS.</li>
<li>Gunakan <strong>ULONG</strong> untuk menyimpan Epoch 2000.</li>
<li>Untuk Function, gunakan <strong>structKDateTime</strong> agar semua komponen tanggal tersedia.</li>
<li>FB bisa digunakan untuk historikal, Function untuk kalkulasi inline.</li>
<li>Praktik terbaik: selalu gunakan <strong>epoch 2000</strong> untuk sistem jangka panjang.</li>
</ol>
<hr>
<h2 id="contoh-penggunaan">Contoh Penggunaan</h2>
<pre><code class="language-pascal">VAR
    MyEpoch : ULONG;
    MyDate  : structKDateTime;
END_VAR

MyEpoch := K_DateToEpochF(2025,11,3,8,30,0);
MyDate := K_EpochToDateF(MyEpoch);
</code></pre>
<p>Hasil:</p>
<ul>
<li><code>MyEpoch</code> → 815473800</li>
<li><code>MyDate</code> → {Year=2025, Month=11, Day=3, Hour=8, Minute=30, Second=0}</li>
</ul>
<hr>
<h2 id="kesimpulan">Kesimpulan</h2>
<ul>
<li><strong>Epoch 2000</strong> aman untuk PLC/DCS 32-bit dan menghindari overflow.</li>
<li>Kombinasi <strong>Function Block dan Function</strong> memungkinkan fleksibilitas: historikal maupun kalkulasi inline.</li>
<li>Dengan <strong>structKDateTime</strong>, Function dapat mengembalikan seluruh komponen tanggal sekaligus.</li>
<li>Standar ini memudahkan integrasi timestamp di SCADA/DCS modern.</li>
</ul>

{% endraw %}