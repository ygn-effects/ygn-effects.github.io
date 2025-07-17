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
    href: "#placement"
  - label: Board reflow
    href: "#reflow"
  - label: Tests
    href: "#tests"
---
## 1. Introduction {#intro}

Welcome to the **YGN Framework** PCB‑assembly guide! In this section we’ll take a hobbyist‑friendly, step‑by‑step walk through turning a blank printed‑circuit board into a fully populated, electrically verified module ready to drop into your pedal enclosure.

### Scope & Audience
- **Who**: Makers, tinkerers, and boutique‑pedal enthusiasts who are comfortable with basic soldering but may be new to surface‑mount (SMT) work or the reflow process.
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

---

## 2. Tools & Consumables {#tools}

Below is a quick‑glance checklist of everything you’ll want within arm’s reach before the paste hits the pads:

| Item | Purpose | YGN Notes |
| --- | --- | --- |
| **Blank PCB** | The canvas that holds your circuit. | This document applies to any typoe or size. |
| **Stencil** | Deposits controlled volumes of solder‑paste in one shot. | Make your own or have it fabbed. Gerber files are included in every effect or project repo. |
| **Solder paste** | Mix of solder balls and flux to join the SMD components to the board.| We use Chip Quik SMD291SNL50T3. No refrigeration required, works even months past its printed expiry and doesn't require cleanup. |
| **Paste squeegee** | Spreads paste evenly across stencil apertures. | Any flexible plastic card works; keep one edge crisp and clean. |
| **Stencil‑holder jig** | Locks PCB and stencil in perfect registration. | Use our 3D‑printed holders for all YGN boards sizes with alignment pins. |
| **Tweezers** | Precise pickup & placement of components. | Fine‑point for 0603 passives; wider or angled for ICs. Personal preference matters—experiment! |
| **Reflow hot plate** | Brings the whole board through the reflow curve evenly. | We use a stock budget 200 × 200 mm digital plate. Open‑source PID mods or alternatives abound if you want upgrades. |

Optional nice‑to‑haves

- Magnifier or USB microscope for inspection
- Digital multimeter for power‑on checks
- Isopropyl alcohol and paper towel. Solder paste can be messy.

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/board-assembly-smd/tools-stencil-holder.webp" alt="" class="doc-img quart">
  <img src="/assets/images/docs/board-assembly-smd/tools-stencil-holder.webp" alt="" class="doc-img quart">
  <img src="/assets/images/docs/board-assembly-smd/tools-stencil-holder.webp" alt="" class="doc-img quart">
</div>

---

## 3. Paste Application {#paste}

Laying down perfect, even pads of solder paste is critical for them to wick up into smooth fillets during reflow.

### Prep & Clean
  - Secure the PCB in the jig. Ensure it sits flush with no wobble.
  - Dampen a lint‑free wipe with IPA and **wipe both the board copper and the underside of the stencil** to remove fingerprints and dust. Allow to air‑dry (≈30 s).

### Load the Squeegee
  - Scoop a pea‑sized blob of SMD291SNL50T3 and **smear it evenly along one edge of your credit card**—use a toothpick to get a continuous bead.

### Fill the Apertures
  - Holding the card **flat against the stencil**, slide it across the apertures with firm, even pressure. This forces paste into every cavity.
  - Lift the card, **tilt it to ≈45° and slide it** along the same path. Excess paste jumps back onto the card edge.
  - **Repeat flat‑then‑45° passes** 2–3 × until you see paste flush with the stencil surface and very little residue on top.

### Recover & Tidy
  - Make one final **45° cleaning pass** to leave only a whisper‑thin film on the stencil.
  - Scrape excess paste from the card back into the jar and close the lid.

### Stencil Release
  - Gripping the stencil by its frame, **snap it upward in a single, quick “book‑opening” motion**—the hinge on the jig helps lift vertically first, then away. Aim for a smooth, decisive pop to avoid smearing.

### Clean‑Up
  - Swab the stencil and card with fresh IPA; dry with paper towel. Store the stencil flat.

### Inspect & Re‑do if Needed
  - Hold the board under strong light or a microscope. **Every pad should have a neat, mesas‑flat deposit**—no bald spots, bridges, or smears.
  - If you spot voids or over‑paste, it is possible to drop the stencil back into the jig and repeat the flat‑plus‑45° routine. Again, just aim for a smooth, precise and decisive pop on/off motion to avoid smearing.

> **Tip:** Work briskly but not frantically—the Chip Quik paste’s long open‑time means it won’t dry out mid‑session.

---

## 4. Component Placement {#placement}

Placing parts is mostly zen‑like repetition—but good **prep** separates a 15‑minute breeze from a 45‑minute slog.

### Prep & Organization

| Task | Why it matters | YGN Tips |
| --- | --- | --- |
| **Sort & store components** | Cut‑tape strips slide everywhere, waste bench space, and love to flip upside‑down. | We use **AideTek BOX‑ALL** organizers—one each for 0603‑1206 passives, electrolytics, ICs, etc. Any lidded SMD tray or bin works; the key is **one value per cell** so you can grab parts blindfolded. |
| **Choose your reference** | Reading the tiny silkscreen is slow, and overlay labels are not always placed ideally. | In every YGN repo you’ll find a *mechanical‑layer* PDF—just outlines and designators. Print or view it full‑screen and annotate values with a pen or tablet. Faster than cross‑checking the BOM every part. |
| **Fresh, sharp tweezers** | 0603 parts weigh milligrams; burrs or dried flux on the tips will make them stick or spring away. | Keep medium‑fine (​\#​3‑5) for 0603/0805 and a wider‑jaw pair for SOIC/QFN. Wipe with IPA before each session. |

### Placement Workflow

1. **Start small, work up in size**
   - 0603 resistors first: pick one value, place *all* of that value, then move to the next.
   - Repeat for 0603 capacitors, then 0805 and 1206 parts.
   - Move on to semi-conductors, diodes then transistors and ICs.
   - Leave tall parts like electrolytic caps, relays and pin headers until last so they don’t shadow smaller footprints.
2. **Don’t chase micron accuracy**
   - Surface tension during reflow will pull most passives into perfect alignment. Aim to centre the part roughly within its pads; ±0.2 mm is plenty.
3. **Tack tricky ICs**
   - Lightly press a corner of an SOIC/QFN into the paste so it “sticks,” then align opposite corner. You can nudge parts with tweezers while the paste is still soft.
4. **Quick visual pass**
   - Before reflow, scan for tombstoned resistors or upside‑down diodes (use board overlay arrows). Fix now while paste is still wet.

> **Tip:** If you drop a component into the wrong footprint, lift it straight up with tweezers—no sideways drag—or use a bit of Kapton tape to peel it off without smearing adjacent pads.

> **Tip:** SMT is surprisingly forgiving. Worried that your 0603s aren’t pixel‑perfect? Relax—the reflow process will pull most parts into place as long as the paste was spread cleanly. Even fine‑pitch MSOP/TSSOP ICs tolerate slight offset or skew. So focus on consistent paste volume and you’ll be amazed how “self‑correcting” the process is.

