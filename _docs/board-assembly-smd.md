---
title: SMD PCB Assembly
layout: doc
permalink: /docs/smd-pcb-assembly/
updated: 2025-07-02
topic: PCB
excerpt: Assembly of a SMD PCB. Paste application to components placement and reflow.
tags: [soldering, smd, stencil, pcb]
toc:
  - label: Introduction
    href: "#intro"
  - label: Required tools
    href: "#tools"
  - label: Paste application
    href: "#paste"
  - label: Components placement
    href: "#components"
  - label: Board reflow
    href: "#reflow"
  - label: Tests
    href: "#tests"
---
## 1. Introduction {#intro}

Welcome to the **YGN Framework** PCB‑assembly guide! In this section we’ll take a hobbyist‑friendly, step‑by‑step walk through turning a blank printed‑circuit board into a fully populated, electrically verified module ready to drop into your pedal enclosure.

### Scope & Audience
- **Who**: Makers, tinkerers, and boutique‑pedal enthusiasts who are comfortable with basic soldering but may be new to surface‑mount (SMT) work or reflow ovens.
- **What**: The procedure is *identical* across all YGN board sizes. To keep things quick and visual, we’ll demonstrate every step on a **small IO board**—the fastest variant to assemble—then note any size‑specific call‑outs along the way.

### SMT: Easier Than It Looks — and Why We Love It

Surface-mount technology (SMT) can feel intimidating when you first see 0603 capacitors the size of a grain of pepper—but in practice it streamlines both **assembly** *and* **PCB design**:

| Why it’s simpler in the workshop | Why it’s tidier on the board |
| --- | --- |
| **One-step soldering** – Dab paste through a stencil, place all parts, then reflow once. No repeated heat cycles or board-flipping. | **More routing room** – Tiny footprints free up copper real-estate, so traces run direct and ground planes stay solid—great for low-noise audio. |
| **Fast rework** – A quick blast of hot-air lifts most SMD parts cleanly; no solder-pump gymnastics. | **Shorter signal paths** – Components sit closer together, cutting parasitic inductance/capacitance that can dull high-end frequencies. |
| **Fewer mechanical stresses** – No long leads acting as heat-sinks; joints cool evenly, so thermal-shock cracks are rare. | **Easier layer management** – Low-profile parts often let you keep all routing on one side and pour a continuous ground on the other. |
| **Cleaner finish** – Excess paste is minimal and flux residue wipes off quickly—your board looks almost factory-made. | **Consistent part libraries** – Standard SMD packages mean well-vetted footprints in every open-source CAD tool. |

In short, once you’ve tried SMT you’ll wonder why you ever drilled hundreds of tiny holes. The **YGN Framework** leans on these advantages so hobbyists can get professional-grade results with nothing more exotic than a $40 hot plate and a steady hand.

### What You’ll Learn
- **Reading YGN documentation**: BOM sheets, placement diagrams and open‑source CAD files.
- **Preparing the board**: Stencil/jig setup and paste application best practices.
- **Populating components**: Manual placement of the components.
- **Soldering/Reflow**: Using a hot plate to reflow the board and thru hole components hand soldering.
- **Inspection & Rework**: Visual QA checklist, common faults (bridging, tombstoning), and quick‑fix methods.
- **Electrical test**: Power‑on checks and continuity tests.

By the end, you’ll have a proven workflow you can replicate on medium and large YGN boards—or any other DIY pedal PCB.

### What’s Next

Next, we’ll dive into the tools, equipment, and consumables you’ll want on your bench before you squeeze out the first bead of solder‑paste—from the open‑source stencil jig to flux types and tweezers.

---

## 2. Tools & Consumables {#tools}

Below is a quick‑glance checklist of everything you’ll want within arm’s reach before the paste hits the pads:

| Item | Purpose | YGN Notes |
| --- | --- | --- |
| **Blank PCB** | The canvas that holds your circuit. | This document applies to any typoe or size. |
| **Stencil** | Deposits controlled volumes of solder‑paste in one shot. | Make your own or have it fabbed. Gerber files are included in every effect or project repo. |
| **Solder paste** | Mix of solder balls and flux to join the SMD components to the board.| We use Chip Quik SMD291SNL50T3. No refrigeration required, works even months past its printed expiry and doesn't require cleanup. |
| **Paste squeegee** | Spreads paste evenly across stencil apertures. | Any flexible plastic card works; keep one edge crisp and clean. |
| **Stencil‑holder jig** | Locks PCB and stencil in perfect registration. | Use our 3D‑printed frame sized for YGN boards with alignment pins. |
| **Tweezers** | Precise pickup & placement of components. | Fine‑point for 0603 passives; wider or angled for ICs. Personal preference matters—experiment! |
| **Reflow hot plate** | Brings the whole board through the reflow curve evenly. | We use a budget 200 × 200 mm digital plate. Open‑source PID mods abound if you want upgrades. |

Optional nice‑to‑haves

- Flux pen for touch‑ups
- Magnifier or USB microscope for inspection
- Anti‑static mat / wrist strap in very dry climates
- Digital multimeter for power‑on checks
- Kapton tape to mask through‑hole pads before paste

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/board-assembly-smd/tools-stencil-holder.webp" alt="" class="doc-img quart">
  <img src="/assets/images/docs/board-assembly-smd/tools-stencil-holder.webp" alt="" class="doc-img quart">
  <img src="/assets/images/docs/board-assembly-smd/tools-stencil-holder.webp" alt="" class="doc-img quart">
</div>


---

## 3. Paste application {#paste}

1. Secure the PCB in a jig or spare panel frame.  
2. Align the stencil:  
   ```text
   Top copper → stencil mark “TC04”

1. Secure the PCB in a jig or spare panel frame.  
2. Align the stencil:  
   ```text
   Top copper → stencil mark “TC04”

1. Secure the PCB in a jig or spare panel frame.  
2. Align the stencil:  
   ```text
   Top copper → stencil mark “TC04”

1. Secure the PCB in a jig or spare panel frame.  
2. Align the stencil:  
   ```text
   Top copper → stencil mark “TC04”

1. Secure the PCB in a jig or spare panel frame.  
2. Align the stencil:  
   ```text
   Top copper → stencil mark “TC04”

1. Secure the PCB in a jig or spare panel frame.  
2. Align the stencil:  
   ```text
   Top copper → stencil mark “TC04”

1. Secure the PCB in a jig or spare panel frame.  
2. Align the stencil:  
   ```text
   Top copper → stencil mark “TC04”