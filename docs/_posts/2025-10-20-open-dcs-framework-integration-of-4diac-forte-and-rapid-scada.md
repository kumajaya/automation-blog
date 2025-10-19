---
ghost_uuid: "1305768b-be9f-47ef-a687-ff4a5efb126e"
title: "Open DCS Framework: Integration of 4diac FORTE and Rapid SCADA"
date: "2025-10-20T02:35:05.000+07:00"
slug: "open-dcs-framework-integration-of-4diac-forte-and-rapid-scada"
layout: "post"
excerpt: |
  Open DCS Framework: Integration of 4diac FORTE as distributed control logic with Rapid SCADA for supervision, visualization, and historization. An open, modular, and vendor lock-in–free alternative for the future of industrial automation.
image: "https://images.unsplash.com/photo-1652145595413-0a79398e5888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDN8fGNvbnRyb2wlMjByb29tfGVufDB8fHx8MTc2MDg5MTA0OXww&ixlib=rb-4.1.0&q=80&w=2000"
image_alt: ""
image_caption: "<span style=\"white-space: pre-wrap;\">Photo by </span><a href=\"https://unsplash.com/@garnicanetwork?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Ana Garnica</span></a><span style=\"white-space: pre-wrap;\"> / </span><a href=\"https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\"><span style=\"white-space: pre-wrap;\">Unsplash</span></a>"
author:
  - "Ketut Kumajaya"
tags:
  - "Distributed Control System"
  - "Practical Engineering"
  - "Field Experience"
  - "Cost Optimization"
  - "FOSS Workflow"
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
url: "https://automation.samatorgroup.com/blog/open-dcs-framework-integration-of-4diac-forte-and-rapid-scada/"
comment_id: "68f533a18a77df069caabf31"
reading_time: 4
access: true
comments: false
---

{% raw %}
<p><em>Written by Ketut Kumajaya — October 2025</em></p>
<h2 id="introduction">Introduction</h2>
<p>In the process industry, traditional control systems often rely on <strong>closed DCS</strong> that are expensive and lack flexibility. The <em>Open DCS Framework</em> emerges as an <strong>open, modular, and distributed alternative</strong>, leveraging <strong>4diac FORTE</strong> as the logic execution layer and <strong>Rapid SCADA</strong> as the supervisory and visualization layer.</p>
<hr>
<h2 id="background">Background</h2>
<p>Conventional DCS systems are indeed reliable, but they have limitations:</p>
<ul>
<li>Dependence on specific vendors (<em>vendor lock-in</em>).</li>
<li>Some vendors impose additional license fees for logic modifications or development.</li>
<li>Difficult to integrate with modern platforms such as <strong>IIoT</strong> and <strong>data analytics</strong>.</li>
</ul>
<p><strong>IEC 61499</strong> introduces a new paradigm: function block–based, event-driven, and distributed control. <strong>4diac FORTE</strong> is an open implementation of this standard, enabling a <strong>lightweight, portable runtime</strong> capable of communicating through protocols such as <strong>OPC UA, OPC DA, MQTT, Modbus TCP/RTU</strong>.</p>
<p>On the other hand, <strong>Rapid SCADA</strong> provides supervisory capabilities, visualization, data historization, alarm/event management, and scripting, but <strong>lacks deterministic control execution</strong>. Integrating the two enables the creation of a <strong>complete open DCS</strong>.</p>
<hr>
<h2 id="open-dcs-framework-concept">Open DCS Framework Concept</h2>
<h3 id="architecture">Architecture</h3>
<table>
<thead>
<tr>
<th><strong>Open DCS Layer</strong></th>
<th><strong>Function</strong></th>
<th><strong>Component</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>Supervision / HMI</td>
<td>Process visualization, historization, alarms/events</td>
<td><strong>Rapid SCADA</strong></td>
</tr>
<tr>
<td>Control Execution</td>
<td>Distributed control logic</td>
<td><strong>4diac FORTE</strong></td>
</tr>
<tr>
<td>Communication</td>
<td>Data exchange between nodes, system integration</td>
<td><strong>OPC UA / OPC DA / Modbus TCP/RTU / MQTT</strong></td>
</tr>
<tr>
<td>Input/Output Layer</td>
<td>Sensors, actuators, RTUs, PLCs</td>
<td><strong>Moxa ioLogik E2200 / Advantech ADAM-5000 series</strong></td>
</tr>
</tbody>
</table>
<p>Within this Open DCS framework:</p>
<ul>
<li><strong>Rapid SCADA</strong> serves as the operator interface and supervisory hub, including visualization, alarms, and historization.</li>
<li><strong>4diac FORTE</strong> executes distributed control logic on control nodes.</li>
<li><strong>OPC UA / OPC DA / Modbus TCP/RTU / MQTT</strong> bridge real-time communication between supervision, control, and field devices.</li>
<li><strong>Input/Output Layer</strong> consists of sensors, actuators, and industrial I/O devices such as Moxa ioLogik E2200 or Advantech ADAM-5000 series. These I/O devices support Modbus TCP/RTU protocols and digital/analog signal interfaces.</li>
</ul>
<h3 id="interaction-mechanism">Interaction Mechanism</h3>
<ol>
<li><strong>4diac FORTE</strong> control nodes execute function blocks according to the process.</li>
<li>Rapid SCADA, as an <strong>OPC UA / OPC DA client</strong>, reads and writes data, sending operator commands.</li>
<li>Process changes by FORTE are published to Rapid SCADA for visualization and historization.</li>
<li>Operators monitor performance, alarms, and trends via Rapid SCADA, while FORTE handles <strong>deterministic control logic</strong>.</li>
</ol>
<hr>
<h2 id="implementation">Implementation</h2>
<p>As an initial step, a simple architecture example:</p>
<ul>
<li><strong>Control Node</strong>: industrial SBC or Raspberry Pi running 4diac FORTE with PID and sequential logic. <em>Estimated initial cost: IDR 2–5 million for a basic setup, including Raspberry Pi 5.</em></li>
<li><strong>Supervision Node</strong>: Linux/Windows server running Rapid SCADA with dashboards displaying pressure, flow, and valve positions.</li>
<li><strong>Field I/O</strong>: <strong>Modbus TCP/RTU</strong> devices such as <strong>Moxa ioLogik E2200 series</strong> or <strong>Advantech ADAM-5000 series</strong> for interfacing 4–20 mA sensors and digital actuators. PLCs can be used for critical control execution in compliance with SIL standards.</li>
<li><strong>Connection</strong>: communication between FORTE and Rapid SCADA using real-time OPC UA server-client, <em>with native support in Rapid SCADA v6.x for efficient data subscriptions.</em></li>
</ul>
<hr>
<h2 id="architecture-diagram">Architecture Diagram</h2>
<figure style="display: flex; flex-direction: column; align-items: center; margin: 20px 0;">
  <div class="mermaid" style="max-width:480px;">
    %%{init: {'themeVariables': { 'fontSize': '16px', 'primaryColor': '#e8f0fe', 'edgeLabelBackground':'#ffffff'}}}%%
    flowchart TB
        subgraph Supervision ["Supervision Layer"]
            SCADA[Rapid SCADA]:::scada
        end
        subgraph Communication ["Communication Layer"]
            OPCUA[OPC UA / OPC DA<br>Modbus TCP/RTU<br>MQTT]:::comm
        end
        subgraph Control ["Control Execution"]
            FORTE[4diac FORTE]:::forte
        end
        subgraph Field ["Input/Output Layer"]
            IO["ioLogik E2200<br>ADAM-5000<br>PLCs for SIL"]:::io
        end
        SCADA -.-&gt;|Command| OPCUA
        OPCUA -.-&gt;|Command| FORTE
        FORTE -.-&gt;|Actuation| IO
        IO --&gt;|Sensor Feedback| FORTE
        FORTE --&gt;|Process Status| OPCUA
        OPCUA --&gt;|Data Historization| SCADA
        classDef forte fill:#f9f,stroke:#333,stroke-width:2px,color:#000;
        classDef scada fill:#9cf,stroke:#333,stroke-width:2px,color:#000;
        classDef comm fill:#fc9,stroke:#333,stroke-width:2px,color:#000;
        classDef io fill:#cfc,stroke:#333,stroke-width:2px,color:#000;
        linkStyle 0 stroke:#e33,stroke-width:2px,stroke-dasharray: 5 5
        linkStyle 1 stroke:#e33,stroke-width:2px,stroke-dasharray: 5 5
        linkStyle 2 stroke:#e33,stroke-width:2px,stroke-dasharray: 5 5
        linkStyle 3 stroke:#3a3,stroke-width:2px
        linkStyle 4 stroke:#3a3,stroke-width:2px
        linkStyle 5 stroke:#3a3,stroke-width:2px
  </div>
  <figcaption style="text-align:center; font-size:13px; color:#555;">
    Integration of Rapid SCADA, 4diac FORTE, and Field I/O Devices, with PLCs for SIL application
  </figcaption>
</figure>
<hr>
<h2 id="benefits-and-challenges">Benefits and Challenges</h2>
<p><strong>Benefits</strong></p>
<ul>
<li>Free from licensing and vendor lock-in.</li>
<li>High flexibility and modularity.</li>
<li>Transparent control logic.</li>
<li>Interoperability with <strong>IIoT</strong> systems and modern data analytics.</li>
</ul>
<p><strong>Challenges</strong></p>
<ul>
<li>Large-scale implementation standardization is still evolving.</li>
<li>Cybersecurity requires serious attention.</li>
<li>A new mindset is needed: from fixed cycles (<em>cyclic</em>) to event-driven.</li>
<li>Documentation, deployment, and maintenance become the user’s responsibility.</li>
<li>Community contributions are crucial—for example, <a href="https://github.com/eclipse-4diac/4diac-forte/commits/develop?author=kumajaya&ref=automation.samatorgroup.com" target="_blank">several improvements</a> to ensure portability to edge devices such as Raspberry Pi or Siemens IoT.</li>
</ul>
<h3 id="notes-on-critical-control">Notes on Critical Control</h3>
<p>The Open DCS Framework based on 4diac FORTE and Rapid SCADA is ideal for regular process control, monitoring, and alarm/event handling.</p>
<p>However, for <strong>critical applications</strong>, such as safety interlocks, emergency shutdowns, or control with very tight cycle times, <strong>industrial PLCs</strong> are still recommended as the primary deterministic execution layer.</p>
<p>In this scenario:</p>
<ul>
<li><strong>FORTE</strong> acts as a supervisory or secondary controller.</li>
<li><strong>PLC</strong> handles critical logic requiring high determinism.</li>
<li>System integration can be achieved via <strong>OPC UA or Modbus</strong>, ensuring real-time communication.</li>
</ul>
<blockquote>
<p><em>SIL (Safety Integrity Level) indicates the reliability level of a system in preventing hazards; critical applications such as emergency shutdowns typically require PLCs that comply with a specific SIL.</em></p>
</blockquote>
<hr>
<h2 id="reflection-and-development-direction">Reflection and Development Direction</h2>
<p>The <em>Open DCS Framework</em> is not merely a technological combination but a <strong>paradigm shift</strong>.</p>
<p>Next steps:</p>
<ul>
<li>Develop Rapid SCADA – 4diac FORTE project templates for common control (<em>flow</em>, level, <em>pressure</em>, <em>temperature</em>).</li>
<li>Build <strong>reusable</strong>, community-driven function block libraries. <em>Leverage recent contributions in Modbus/OPC UA for robustness.</em></li>
<li>Establish deployment, monitoring, and auto-scaling mechanisms.</li>
<li>Enhance cybersecurity and integrate real-time technologies such as <strong>TSN</strong>.</li>
</ul>
<hr>
<h2 id="conclusion">Conclusion</h2>
<p>This framework demonstrates that the future of industrial control can be <strong>open, distributed, and collaborative</strong>. With FORTE as the executor and Rapid SCADA as the supervisory layer, a DCS system that is <strong>transparent, flexible, and sustainable</strong> can be realized.</p>
<blockquote>
<p><em>“Perhaps the future of industrial automation does not belong to a single vendor — but to those who dare to open it.”</em></p>
</blockquote>

{% endraw %}