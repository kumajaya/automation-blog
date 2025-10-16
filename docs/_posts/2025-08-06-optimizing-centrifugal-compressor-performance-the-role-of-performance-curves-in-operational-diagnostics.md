---
ghost_uuid: "34cdf281-2df8-499f-a7c3-82ad59790e97"
title: "Optimizing Centrifugal Compressor Performance"
date: "2025-08-06T23:01:25.000+07:00"
slug: "optimizing-centrifugal-compressor-performance-the-role-of-performance-curves-in-operational-diagnostics"
layout: "post"
excerpt: |
  This article presents a diagnostic analysis revealing that a new centrifugal compressor underperforms due to misaligned operation—not equipment fault. Replotting vendor curves highlights excessive flow, inadequate pressure, and motor overload. Targeted corrections improve efficiency and reliability.
image: "/automation-blog/assets/media/34cdf281-2df8-499f-a7c3-82ad59790e97-ZH1120-6_Flow_vs_Pressure_half.png"
image_alt: ""
image_caption: ""
author:
  - "Ketut Kumajaya"
tags:
  - "Centrifugal Compressor"
  - "Performance Curve"
  - "Practical Engineering"
  - "Field Experience"
  - "Measurement Accuracy"
  - "FOSS Workflow"
categories:
  - "centrifugal-compressor"
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
url: "https://automation.samatorgroup.com/blog/optimizing-centrifugal-compressor-performance-the-role-of-performance-curves-in-operational-diagnostics/"
comment_id: "6891e08f547c702feb00b09a"
reading_time: 5
access: true
comments: false
---


<!--kg-card-begin: html-->
<aside class="gh-sidebar">
  <button class="toc-toggle" aria-expanded="false" aria-controls="gh-toc">
    <span class="toc-toggle-icon">☰</span> <b>Table of Contents</b>

  </button>
  <div class="gh-toc js-toc" id="gh-toc"></div>
</aside>
<!--kg-card-end: html-->
<div class="kg-card kg-audio-card"><img src="" alt="audio-thumbnail" class="kg-audio-thumbnail kg-audio-hide"><div class="kg-audio-thumbnail placeholder"><svg width="24" height="24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 15.33a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-2.25.75a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM15 13.83a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-2.25.75a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M14.486 6.81A2.25 2.25 0 0 1 17.25 9v5.579a.75.75 0 0 1-1.5 0v-5.58a.75.75 0 0 0-.932-.727.755.755 0 0 1-.059.013l-4.465.744a.75.75 0 0 0-.544.72v6.33a.75.75 0 0 1-1.5 0v-6.33a2.25 2.25 0 0 1 1.763-2.194l4.473-.746Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M3 1.5a.75.75 0 0 0-.75.75v19.5a.75.75 0 0 0 .75.75h18a.75.75 0 0 0 .75-.75V5.133a.75.75 0 0 0-.225-.535l-.002-.002-3-2.883A.75.75 0 0 0 18 1.5H3ZM1.409.659A2.25 2.25 0 0 1 3 0h15a2.25 2.25 0 0 1 1.568.637l.003.002 3 2.883a2.25 2.25 0 0 1 .679 1.61V21.75A2.25 2.25 0 0 1 21 24H3a2.25 2.25 0 0 1-2.25-2.25V2.25c0-.597.237-1.169.659-1.591Z"></path></svg></div><div class="kg-audio-player-container"><audio src="https://automation.samatorgroup.com/blog/content/media/2025/08/optimizing-centrifugal-compressor-performance_en_US.mp3" preload="metadata"></audio><div class="kg-audio-title">Optimizing Centrifugal Compressor Performance</div><div class="kg-audio-player"><button class="kg-audio-play-icon" aria-label="Play audio"><svg viewBox="0 0 24 24"><path d="M23.14 10.608 2.253.164A1.559 1.559 0 0 0 0 1.557v20.887a1.558 1.558 0 0 0 2.253 1.392L23.14 13.393a1.557 1.557 0 0 0 0-2.785Z"></path></svg></button><button class="kg-audio-pause-icon kg-audio-hide" aria-label="Pause audio"><svg viewBox="0 0 24 24"><rect x="3" y="1" width="7" height="22" rx="1.5" ry="1.5"></rect><rect x="14" y="1" width="7" height="22" rx="1.5" ry="1.5"></rect></svg></button><span class="kg-audio-current-time">0:00</span><div class="kg-audio-time">/<span class="kg-audio-duration">750.552</span></div><input type="range" class="kg-audio-seek-slider" max="100" value="0"><button class="kg-audio-playback-rate" aria-label="Adjust playback speed">1×</button><button class="kg-audio-unmute-icon" aria-label="Unmute"><svg viewBox="0 0 24 24"><path d="M15.189 2.021a9.728 9.728 0 0 0-7.924 4.85.249.249 0 0 1-.221.133H5.25a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h1.794a.249.249 0 0 1 .221.133 9.73 9.73 0 0 0 7.924 4.85h.06a1 1 0 0 0 1-1V3.02a1 1 0 0 0-1.06-.998Z"></path></svg></button><button class="kg-audio-mute-icon kg-audio-hide" aria-label="Mute"><svg viewBox="0 0 24 24"><path d="M16.177 4.3a.248.248 0 0 0 .073-.176v-1.1a1 1 0 0 0-1.061-1 9.728 9.728 0 0 0-7.924 4.85.249.249 0 0 1-.221.133H5.25a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h.114a.251.251 0 0 0 .177-.073ZM23.707 1.706A1 1 0 0 0 22.293.292l-22 22a1 1 0 0 0 0 1.414l.009.009a1 1 0 0 0 1.405-.009l6.63-6.631A.251.251 0 0 1 8.515 17a.245.245 0 0 1 .177.075 10.081 10.081 0 0 0 6.5 2.92 1 1 0 0 0 1.061-1V9.266a.247.247 0 0 1 .073-.176Z"></path></svg></button><input type="range" class="kg-audio-volume-slider" max="100" value="100"></div></div></div><h2 id="the-role-of-performance-curves-in-operational-diagnostics">The Role of Performance Curves in Operational Diagnostics</h2>
<p><em>Written by Ketut Kumajaya | August 6, 2025</em></p>
<h2 id="introduction">Introduction</h2>
<p>Centrifugal compressors are widely utilized in industrial processes, such as air separation units (ASUs), for their ability to deliver continuous airflow with relatively high efficiency. However, even when new and compliant with design specifications, compressors can fail to meet expected discharge pressure or flow rates, leading to inefficiencies, increased energy costs, and potential downstream disruptions.</p>
<p>This article, based on a real-world case study, examines how performance curves serve as a critical diagnostic tool to evaluate operational performance, identify misalignments, and guide corrective actions.</p>
<hr>
<h2 id="case-study-compressor-failing-to-meet-target-pressure">Case Study: Compressor Failing to Meet Target Pressure</h2>
<p>In an ASU, a newly installed three-stage centrifugal compressor was designed to deliver a flow rate of 12,767 Nm³/h, a discharge pressure of 680 kPa abs, and a shaft power of 1,090 kW. The compressor was powered by a 1,120 kW motor with 95.9% efficiency, providing an actual shaft power of 1,074.1 kW. Despite being new, field observations revealed that:</p>
<ul>
<li>Inlet Guide Vanes (IGV) were fully open at 100% to maximize flow capacity.</li>
<li>Discharge pressure consistently fell short of the target, achieving only 601.3 kPa abs.</li>
<li>Flow rate reached 12,958 Nm³/h, exceeding design specifications.</li>
<li>Motor current readings were inconsistent: 77 A at the local panel versus 97 A at the main panel.</li>
</ul>
<p>IGVs are adjustable vanes that regulate inlet air to the impeller, controlling compressor capacity and influencing flow and pressure characteristics. The discrepancies prompted a critical question: Was the compressor defective, or were operational parameters misaligned with system requirements?</p>
<hr>
<h2 id="approach-re-evaluating-performance-curves">Approach: Re-evaluating Performance Curves</h2>
<p>To address this, we digitized the vendor’s performance curves using WebPlotDigitizer and visualized them with Python, mapping flow rate (Nm³/h) against discharge pressure (kPa abs) and shaft power (kW) for IGV settings of 20%, 40%, 60%, 80%, and 100%. The objectives were:</p>
<ul>
<li>Determine the actual operating condition relative to the design point.</li>
<li>Assess whether the compressor operated within the optimal efficiency zone.</li>
<li>Identify potential overcapacity or misalignment with process needs.</li>
<li>Verify whether excessive IGV opening contributes to underperformance.</li>
<li>Pinpoint risk levels tied to motor loading and zone deviation.</li>
</ul>
<hr>
<h2 id="findings-from-performance-curves">Findings from Performance Curves</h2>
<p>The re-plotted performance curves provided critical insights:</p>
<ul>
<li><strong>IGV 100%</strong>: At 601.3 kPa abs, the flow rate reached 12,958 Nm³/h, to the right of the design point (12,767 Nm³/h, 680 kPa abs), indicating excessive flow but insufficient pressure. Power consumption reached 1,084.38 kW, exceeding the motor’s actual shaft power of 1,074.1 kW.</li>
<li><strong>IGV 80%</strong>: At 640.65 kPa abs, the flow rate was 12,416 Nm³/h, slightly below design but sufficient for process needs, with power consumption at 1,035.4 kW, safely within motor specifications.</li>
<li><strong>Operational Efficiency</strong>: The compressor operated within its performance envelope but outside the optimal efficiency zone, leading to high power consumption and reduced pressure output.</li>
<li><strong>Motor Load</strong>: Operating at 100% IGV risked motor overload, while 80% IGV offered a safer, more efficient operating condition.</li>
<li><strong>Control Issues</strong>: Inconsistent current readings suggested potential sensor inaccuracies or control logic errors, potentially contributing to overly aggressive IGV settings.</li>
</ul>
<h3 id="flow-vs-discharge-pressure">Flow vs. Discharge Pressure</h3>
<figure style="text-align: center;">
  <img src="/automation-blog/assets/media/34cdf281-2df8-499f-a7c3-82ad59790e97-Flow_vs_Pressure.svg" alt="ZH1120-6_Flow_vs_Pressure">
  <figcaption><strong>Figure 1.</strong> Flow vs. Discharge Pressure</figcaption>
</figure>
<p><strong>Figure 1</strong>: Line chart showing inlet flow (Nm³/h) vs. discharge pressure (kPa abs) for IGV settings of 20%, 40%, 60%, 80%, and 100%. The actual operating point at 100% IGV (12,958 Nm³/h, 601.3 kPa abs) is marked with a red dot, 80% IGV (12,416 Nm³/h, 640.65 kPa abs) with a blue dot, and the design point (12,767 Nm³/h, 680 kPa abs) with a black dot. Distinct colors represent each IGV setting, with black markers for operating and design points.</p>
<p>This comparison clarified that the 100% IGV setting produced excessive flow without sufficient pressure—suggesting the system may be overdriving the compressor without realizing pressure gains.</p>
<h3 id="flow-vs-shaft-power">Flow vs. Shaft Power</h3>
<figure style="text-align: center;">
  <img src="/automation-blog/assets/media/34cdf281-2df8-499f-a7c3-82ad59790e97-Flow_vs_Power.svg" alt="ZH1120-6 Flow vs Shaft Power">
  <figcaption><strong>Figure 2.</strong> Flow vs. Shaft Power</figcaption>
</figure>
<p><strong>Figure 2</strong>: Line chart showing inlet flow (Nm³/h) vs. shaft power (kW) for IGV settings of 20%, 40%, 60%, 80%, and 100%. The actual operating point at 100% IGV (12,958 Nm³/h, 1,084.38 kW) is marked with a red dot, 80% IGV (12,416 Nm³/h, 1,035.4 kW) with a blue dot, and the design point (12,767 Nm³/h, 1,090 kW) with a black dot. Distinct colors represent each IGV setting, with black markers for operating and design points.</p>
<p>While flow exceeds specification at full IGV opening, the resulting power demand places unnecessary stress on the motor, yet fails to achieve target discharge pressure—revealing a control strategy misaligned with system needs.</p>
<hr>
<h2 id="understanding-the-optimal-performance-zone">Understanding the Optimal Performance Zone</h2>
<p>Performance curves illustrate the relationship between flow, discharge pressure, and shaft power across various IGV settings. The optimal zone, centered around the design point, maximizes efficiency by achieving target pressure with minimal power consumption. Operating too far to the right (high flow, low pressure) results in:</p>
<ul>
<li>Increased power consumption disproportionate to pressure gains.</li>
<li>Higher risk of surge or stonewall conditions, leading to compressor instability.</li>
<li>Potential disruptions to downstream processes due to insufficient pressure.</li>
<li>Reduced motor lifespan from continuous high-load operation.</li>
</ul>
<p>Aligning operations with the optimal zone is critical for efficiency and equipment longevity.</p>
<hr>
<h2 id="key-lessons">Key Lessons</h2>
<p>This case study underscores that compressor underperformance does not necessarily indicate equipment failure. Performance curves are a powerful diagnostic tool for:</p>
<ul>
<li>Verifying whether control systems (e.g., IGV settings) are properly configured.</li>
<li>Aligning operational targets with the optimal performance zone.</li>
<li>Avoiding energy waste from inefficient operation.</li>
<li>Protecting motor lifespan by preventing overload.</li>
</ul>
<p>Operators, engineers, and commissioning teams can use curve analytics to improve reliability and interpret control behavior with greater clarity.</p>
<hr>
<h2 id="recommendations">Recommendations</h2>
<p>To optimize compressor performance and align with process requirements, we propose the following actions:</p>
<ol>
<li><strong>Validate Motor Current Sensors</strong>: Cross-check local (77 A) and main panel (97 A) readings to ensure accurate control data, addressing potential sensor inaccuracies.</li>
<li><strong>Refine IGV Control Logic</strong>: Adjust the control system to prevent overly aggressive IGV opening during load build-up, possibly due to erroneous current data.</li>
<li><strong>Test Restricted IGV Settings</strong>: Conduct trials at 85–90% IGV to evaluate improvements in discharge pressure while maintaining sufficient flow.</li>
<li><strong>Evaluate Air Intake System</strong>: Inspect cone filters and suction pipeline layouts for restrictions affecting inlet pressure.</li>
<li><strong>Check Downstream System</strong>: Confirm adequate system backpressure exists to maintain target discharge pressure.</li>
<li><strong>Align with Process Requirements</strong>: Regularly compare operating conditions with the actual process-required point (12,416 Nm³/h, 640.6 kPa abs, 1,035.4 kW) to optimize efficiency and extend motor lifespan.</li>
<li><strong>Implement Real-Time Monitoring</strong> (optional): Deploy IoT-based systems to track flow, pressure, and power in real-time.</li>
</ol>
<hr>
<h2 id="conclusion">Conclusion</h2>
<p>Performance curves are indispensable for diagnosing centrifugal compressor issues and ensuring operational excellence. This real-world case study demonstrates that underperformance often stems from operational misalignment rather than equipment defects. By leveraging performance curves to validate operational settings, refine controls, and monitor performance, operators can achieve target pressure, reduce energy costs, and enhance equipment reliability, ultimately improving process efficiency in industrial applications.</p>
<hr>
<p><em><strong>Acknowledgments</strong></em>: This article is based on a real-world case study by Ketut Kumajaya at an air separation unit operated in East Java, Indonesia. Adapted for publication to highlight the diagnostic value of performance curves in compressor optimization. Annotated scripts and datasets for reproduction are available upon request.</p>
<div class="kg-card kg-file-card"><a class="kg-file-card-container" href="https://automation.samatorgroup.com/blog/content/files/2025/08/Optimizing_Centrifugal_Compressor_Performance.pdf" title="Download" download=""><div class="kg-file-card-contents"><div class="kg-file-card-title">Optimizing Centrifugal Compressor Performance</div><div class="kg-file-card-caption">The Role of Performance Curves in Operational Diagnostics</div><div class="kg-file-card-metadata"><div class="kg-file-card-filename">Optimizing_Centrifugal_Compressor_Performance.pdf</div><div class="kg-file-card-filesize">137 KB</div></div></div><div class="kg-file-card-icon"><svg viewBox="0 0 24 24"><defs><style>.a{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}</style></defs><title>download-circle</title><polyline class="a" points="8.25 14.25 12 18 15.75 14.25"></polyline><line class="a" x1="12" y1="6.75" x2="12" y2="18"></line><circle class="a" cx="12" cy="12" r="11.25"></circle></svg></div></a></div>
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
