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

- **Magnifier or USB microscope**: for inspection, also useful to check the polarity on tiny diodes.
- **Digital multimeter**: for power‑on checks.
- **Isopropyl alcohol and paper towel**: solder paste can be messy.

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/board-assembly-smd/tools-stencil-holder.webp" alt="" class="doc-img quart">
  <img src="/assets/images/docs/board-assembly-smd/tools-stencil-holder.webp" alt="" class="doc-img quart">
  <img src="/assets/images/docs/board-assembly-smd/tools-stencil-holder.webp" alt="" class="doc-img quart">
</div>

---

## 3. Paste Application {#paste}

Laying down perfect, even pads of solder paste is critical for them to wick up into smooth fillets during reflow.

1. **Prep & Clean**
  - Secure the PCB in the jig. Ensure it sits flush with no wobble.
  - Dampen a lint‑free wipe with IPA and **wipe both the board copper and the underside of the stencil** to remove fingerprints and dust. Allow to air‑dry (≈30 s).
  - Stir the paste thoroughly for 2-3 minutes. It tends to dry up a bit when not refrigerated.

2. **Load the Squeegee**
  - Scoop a pea‑sized blob of SMD291SNL50T3 and **smear it evenly along one edge of your credit card**—use a toothpick to get a continuous bead.

3. **Fill the Apertures**
  - Holding the card **flat against the stencil**, slide it across the apertures with firm, even pressure. This forces paste into every cavity.
  - Lift the card, **tilt it to ≈45° and slide it** along the same path. Excess paste jumps back onto the card edge.
  - **Repeat flat‑then‑45° passes** 2–3 × until you see paste flush with the stencil surface and very little residue on top.

4. **Recover & Tidy**
  - Make one final **45° cleaning pass** to leave only a whisper‑thin film on the stencil.
  - Scrape excess paste from the card back into the jar and close the lid.

5. **Stencil Release**
  - Gripping the stencil by its frame, **snap it upward in a single, quick “book‑opening” motion**—the hinge on the jig helps lift vertically first, then away. Aim for a smooth, decisive pop to avoid smearing.

6. **Clean‑Up**
  - Swab the stencil and card with fresh IPA; dry with paper towel. Store the stencil flat.

7. **Inspect & Re‑do if Needed**
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

---

## 5. Board reflow {#reflow}

Before we melt any metal, a quick primer: a standard reflow profile has **three main phases**—**Ramp-Up → Soak → Reflow**.
Following the Chip Quik **SMD291SNL** curve for the first two phases lets the flux do its job; the last phase is mostly visual because our benchtop hot-plate can’t quite hit the datasheet’s 249 °C peak, especially that quickly.

![Chip Quik recommended Sn-Pb profile](ae7da0c2-3f2f-431f-9bb5-0c6a7c5026e6.png)

| Stage | Target Temp & Time | What’s happening |
|-------|-------------------|------------------|
| **Ramp-Up** | Room → 150 °C ≈ 90 s | Gentle warm-up drives off solvents without spatter. |
| **Soak / Activation** | 150 → 180 °C ≈ 90 s | Flux activates, oxides dissolve, paste dulls and begins to “wet.” |
| **Reflow (Liquidus)** | ≥ 217 °C for ≤ 30 s; practical peak ≈ 245 °C | Solder liquefies; surface tension pulls parts into perfect alignment. |

> **Tip:** Most hobby hot-plates top out at ~245 °C. That’s fine: once every pad flashes from matte grey to mirror-bright, you’re done. Trust your eyes more than the display.

### Gear & Prep
- **Board lifter:** Flat or duck-bill tweezers let you pinch the PCB edge without crushing parts. Rehearse the pickup while everything’s cold.
- **Cooling pad:** A piece of copper or thick aluminum sinks heat fast so components don’t “tombstone” while cooling.
- **Landing zone:** Keep a clear, clutter-free spot to drop the hot board—liquid solder is slippery!

### Step-by-Step

1. **Place the board**
  - Center it on the hot-plate, parts face up.
2. **Pre-heat – 150 °C / ≈ 90 s**
  - Dial the plate to 150 °C. Paste softens but stays grey.
3. **Soak – 180 °C / ≈ 90 s**
  - Bump to 180 °C. You’ll see a wisp of smoke as flux activates.
4. **Reflow – 250 °C set-point**
  - Crank to 250 °C; surface thermocouples usually read 240–245 °C. Watch: joints turn shiny in rapid succession. The **largest pads** (usually electrolytics) are your tell—once they’ve flowed, **kill the heat**.
5. **Lift & cool**
  - In one smooth, hinge-like motion, slide tweezers under a corner, lift straight up, and place the board on the copper slab to cool. Avoid tilting—liquid solder will let parts skate.

### Inspecting the Joints

A proper SMT fillet forms a smooth, concave meniscus that wets both the **land** and the **component termination**:

![Good SMT fillet](93a9a325-5d6f-498d-891a-882cace96903.gif)

Look for:

* **Smooth, concave meniscus**. A dull, grainy surface hints at a cold joint.
* **Even height** on both sides of each passive. One tall / one thin leg signals tombstoning risk.
* **No bridging** between adjacent leads.

If you spot a bridge or an incompletely-wetted pad, don’t panic—add a touch of flux and hit it with a quick hot-air pass.

---

## 6. Power-On & Functional Tests {#tests}

Once the through-hole parts are soldered and the board has cooled, it’s time to **prove the build**.
Every YGN PCB ships with clearly labeled **TP\_x** markers in the silkscreen *and* a companion **_test-points.pdf_** inside the repo’s *fabrication-output* folder (right next to the mechanical-layer drawing). The PDF lists each point’s nominal voltage or waveform so you can tick them off one by one.

### Pre-Power Sanity Checks

| Check | How | Pass / Fail |
|-------|-----|-------------|
| **Supply rail ≠ GND** | DMM in continuity mode between V\+ and GND. | **Open** (no beep) |
| **No solder bridges** | 10× loupe or USB microscope around IC pins & switch lugs. | No unintended shorts |
| **Polarity parts installed correctly** | Visual: electrolytics, diodes, IC notch/dot. | Orientation matches overlay |

### Initial Power-On

1. **Bench supply** → current-limit to ~50 mA.
2. Clip the **– lead** to any of the **untented edge-vias**—they’re tied to the internal ground-plane and make a rock-solid COM anchor.
3. Apply the rated voltage (e.g., +9 V).
4. Verify inrush current stays below the limit.

### Probe the Test Points

Some examples :

| TP label | Expected | Notes |
|----------|----------|-------|
| **TP\_5V** | 4.85 – 5.10 V | LDO output; should be steady within ±2 %. |
| **TP\_VB** | ≈ ½ VCC (bias) | Audio mid-rail; tolerance ±100 mV. |
| **TP\_IN** | Bypass cap-coupled | Inject 100 mVrms, 1 kHz and scope for clean sine. |
| *(etc.)* | *see repo PDF* |  |

### Signal & Functional Tests
1. **Audio pass-through:** Feed a guitar-level sine and listen/ scope the output—no crackles or dropouts.
2. **Control sweep:** Rotate each pot / flip each switch while watching the output amplitude/frequency response.
3. **LED & relay check:** Confirm status LED toggles and relay clicks (if fitted) on effect/bypass change.

---

🎉 **If every TP lands inside its spec and the audio test sounds clean—you’re done!**
