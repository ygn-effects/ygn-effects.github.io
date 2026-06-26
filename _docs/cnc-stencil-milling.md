---
title: Stencil Milling
layout: doc
permalink: /docs/cnc-stencil-milling/
updated: 2026-06-26
topic: CNC
excerpt: Milling a kapton solder paste stencil on a CNC router. From stock preparation to cleanup and inspection.
tags: [cnc, stencil, kapton, smd]
toc:
  - label: Introduction
    href: "#intro"
  - label: Required tools & materials
    href: "#tools"
  - label: Preparing the stock
    href: "#stock"
  - label: Fixing to the bed
    href: "#fixing"
  - label: Cleanup & inspection
    href: "#cleanup"
---

## 1. Introduction {#intro}

Welcome to the YGN Effects Framework documentation! This guide will walk you through milling your own solder paste stencil on a CNC router, a thin kapton sheet with precisely cut apertures that let you deposit solder paste on exactly the right pads of your PCB, every time.

### What is a solder paste stencil?

A solder paste stencil is a thin, flat sheet of material with openings (apertures) cut to match the solder pads of a specific PCB. You lay it over the board, spread solder paste across it with a squeegee and lift it off: the paste falls through the apertures and lands on the pads in exactly the right quantity and position. It is the first step in the SMT assembly process and getting it right makes everything that follows dramatically easier.

Professionally manufactured stencils are laser-cut from stainless steel. For the YGN Framework, we mill ours from polyimide (kapton) sheet on a CNC router. The result is not quite as sharp as a laser-cut steel stencil, but it is more than good enough for our board geometries, and you can produce one in-house in under an hour for almost no cost.

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/cnc-stencil-milling/intro-stencil-pcb.jpg"
       alt="Kapton stencil laid over a PCB, showing how the apertures align with the solder pads" class="doc-img">
</div>

### Where this fits in the Framework

This guide sits at the start of the SMT assembly chain:

**Mill the stencil** (this guide) → [Mount it in the stencil holder](/docs/tool-stencil-holder-assembly/) → [Apply paste & reflow](/docs/smd-pcb-assembly/)

Before you can mill a stencil, you also need a properly surfaced spoilboard. If you haven't made one yet, start with the [Spoilboard Fabrication](/docs/spoilboard-fabrication/) guide.

### A note on preparation

CNC machining is an unforgiving process. Once you press Start, the machine executes the G-code exactly as written. It has no awareness of a misplaced sheet, a wrong zero or a holder that isn't quite seated. Every mistake that could happen will happen at full speed with a spinning tool.

The good news: preparation eliminates almost every failure mode. If the stock is flat, the holder is seated correctly and the origin is set right the machine will do its job perfectly. The sections that follow are designed with that in mind so take your time on setup and the milling run itself will be the easy part.

### A note on software

In each effect repository, you will find the FreeCAD files used to generate the toolpaths for stencil milling (in pcb/stencil). We also provide ready-to-use GRBL G-code files. However, these were generated for our specific setup: a stock 3018-PRO CNC with a **0.1mm tip, 10° V-bit**.

> **Note:** The G-code files in each repository were generated for our specific setup. If your machine or bit differs, open the FreeCAD file and adjust the CAM jobs and toolpaths to match your parameters before running. A detailed guide on how to do this is on the way in a future revision.

## 2. Required Tools & Materials {#tools}

### The Stock: Polyimide Sheet

Polyimide, sold under the well-known brand name **Kapton**, is our preferred material for CNC-milled solder paste stencils. It is dimensionally stable (it doesn't stretch, creep or or tear under squeegee pressure), and is heat-resistant enough to hold a clean edge during the milling process. It is also inexpensive and easy to find online in sheet form.

For stencil use, you want a plain, unsupported polyimide sheet. No adhesive backing, no reinforcement.

#### Thickness

Thickness is the one specification that directly affects paste deposit quality. For our board geometries, **0.1mm to 0.125mm** is the right range. The difference between the two is negligible in practice, so buy whichever is more readily available. Both will give you a clean, consistent deposit on pads down to 0603 and the IC footprints we use in the Framework.

Avoid going thicker than that. At **0.2mm**, the paste column sitting in each aperture becomes tall enough that it won't release cleanly onto the pad and you end up with excess paste that spreads under the stencil as you lift it. On fine-pitch IC footprints in particular, this is a reliable recipe for bridges.

> **Note:** "Kapton" is a DuPont brand name. Generic polyimide sheet from other suppliers works just as well. What you are looking for on supplier listings is simply **polyimide film**, in the appropriate thickness, without adhesive.

#### Mylar as an alternative

Mylar (or biaxially-oriented PET film) is another solid choice and is often easier to find locally. It cuts relatively cleanly, is perfectly flat, and produces good stencils. The practical difference is longevity: polyimide is significantly more resistant to tearing at the aperture edges, especially after repeated squeegee passes and cleaning cycles. If you plan to use the stencil for a single board run, either material works fine. If you want a stencil that holds up over many builds, polyimide is the better investment.

### The Trimmed Spoilboard

Milling a thin polyimide sheet demands an absolutely flat, stable surface underneath it. Even a fraction of a millimetre of bow or tilt across the work area will cause the V-bit to cut too deep in some spots and not deep enough in others, resulting in apertures that are either blown out or not fully cleared.

This is why we use a **trimmed spoilboard**: a piece of HDF that has been surfaced on the CNC itself, making its top face perfectly parallel to the machine's gantry. The kapton sheet sits on top of it, sandwiched flat between the spoilboard and the 3D-printed holder, with no air gaps and no flex.

If you don't have a trimmed spoilboard yet, build one first, it is a prerequisite for this process. See the [Spoilboard Fabrication](/docs/spoilboard-fabrication/) guide.

### The Endmill

This is the most consequential choice in the whole setup, so it is worth understanding what is actually happening at the cutting edge.

#### Pocket vs. profile: two ways to clear an aperture

There are two fundamentally different CAM strategies for cutting a stencil aperture, and they lead to very different tooling requirements.

**Pocketing** uses a small flat endmill, typically 0.2 to 0.4mm depending on the size of your pads, making multiple overlapping passes to clear the full area of each aperture. Done well, it can produce the cleanest, most uniform deposits: the floor of the aperture is flat, and the walls are vertical. The catch is that it requires a tiny, fragile flat endmill running accurately at very low stepover values. On a well-tuned, rigid machine with good runout specs, it is achievable. On an entry-level hobby CNC, the deflection and runout tolerances make it extremely difficult to execute consistently without breaking bits or producing ragged results. It is not the recommended approach for the 3018 class of machines.

**Profiling** takes a different approach: the tool makes a single pass around the perimeter of each aperture, cutting just the outline and letting the centre piece fall away. It is faster, uses a single pass, and is far more forgiving of the slight inaccuracies present in hobby-grade machines. The trade-off is that the aperture walls will have a slight bevel rather than being perfectly vertical, but in practice, this has no meaningful effect on paste deposit quality at our pad geometries.

For profiling, you need a **fine-tipped engraving bit**, and the most common type for this application is the **V-bit**.

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/cnc-stencil-milling/cam-strategy-pocketing.png"
       alt="FreeCAD CAM view showing a pocketing strategy: multiple overlapping passes covering the full aperture area" class="doc-img">
  <img src="/assets/images/docs/cnc-stencil-milling/cam-strategy-profiling.png"
       alt="FreeCAD CAM view showing a profiling strategy: a single pass tracing the perimeter of each aperture" class="doc-img">
</div>

#### V-bits: what to look for

A V-bit is a conical engraving cutter. Its cutting geometry is defined by two numbers: the **included angle** (how wide the cone is) and the **tip diameter** (how fine the point is). For stencil milling, both matter.

The tip diameter controls how closely the tool can follow the edge of a small pad without the body of the bit overlapping into adjacent apertures. A finer tip (0.1mm is ideal) gives you the precision to handle even small 0603 pads cleanly. A larger tip will work for bigger geometries but will leave excess material in the corners of tightly-spaced pads.

The included angle affects how the walls of the aperture are cut. A narrower angle (10°) keeps the cut very close to vertical even at shallow depths, which is what you want for a thin stencil. A wider angle (20°, 30°, 60°) buries the shoulders of the bit faster and produces a more bevelled wall.

For our setup, we use a **0.1mm tip, 10° V-bit**. This combination threads the needle: fine enough to profile small pads accurately, narrow enough to stay nearly vertical through the full depth of the sheet.

> **Note:** Inexpensive V-bits from your favourite far-east import site work perfectly well for this application. The specs to prioritise are a stated tip diameter of 0.1mm and an included angle of 10°. We have had the best results with 3-edge "pyramid" cutters (also listed as 3-flute engraving bits): the extra flute produces a cleaner cut and the geometry holds up well over multiple stencil runs.

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/cnc-stencil-milling/endmill-selection.jpg"
       alt="Selection of 3-edge pyramid V-bits used for stencil milling, laid out on a flat surface" class="doc-img">
  <img src="/assets/images/docs/cnc-stencil-milling/endmill-tip.jpg"
       alt="Close-up of a 3-edge pyramid V-bit tip showing the 0.1mm point and three cutting edges" class="doc-img">
</div>

### Everything Else

- **3D-printed CNC holder:** The custom fixture that sandwiches the kapton sheet against the spoilboard and registers it on the machine bed. Print your own from the [tool-cnc-supports](https://github.com/ygn-effects/tool-cnc-supports) repository.
- **Blue painter's tape:** The foundation of the workholding setup. Applied to both the spoilboard and the kapton sheet.
- **White PVA glue:** Elmer's, Cléopâtre or any equivalent. Applied between the two tape surfaces to bond the kapton firmly to the spoilboard during the job. Holds like a clamp, releases cleanly.
- **A brayer roller:** A small rubber roller for pressing the kapton perfectly flat against the spoilboard after gluing, eliminating any air pockets.
- **T-nuts and screws:** Used to secure the 3D-printed holder to the machine bed's T-slots. For a stock 3018 you want 30-series M5 nuts and M5x20mm screws.
- **3000-grit wet/dry sandpaper:** For the post-milling cleanup pass. Use it wet.
- **A scalpel:** For manually completing any aperture the CNC did not fully clear.
- **A Dremel with a 403, 404 or 405 soft brush attachment:** For clearing and smoothing apertures, especially in tighter areas where the scalpel alone is awkward.
- **Isopropyl Alcohol (IPA) and paper towels:** For cleaning the finished stencil.

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/cnc-stencil-milling/tools-overview.jpg"
       alt="Full setup laid out: polyimide sheet, spoilboard, 3D-printed holder, V-bit, Dremel with abrasive points, scalpel, and sandpaper" class="doc-img">
</div>

## 3. Preparing the Stock {#stock}

Polyimide sheet is almost always sold in rolls rather than flat sheets. This is worth knowing before you order: what arrives is a tightly wound coil and the material will have absorbed that shape. Left to its own devices, a freshly cut piece will curl back toward the roll making it awkward to position and difficult to clamp flat. You can work with curled kapton, but it is genuinely annoying. The right move is to cut it to size and then flatten it, and the whole process only takes a few minutes of hands-on time.

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/cnc-stencil-milling/stock-coiled.jpg"
       alt="Freshly cut kapton sheet curling back on itself, showing the roll memory from the coil" class="doc-img">
  <img src="/assets/images/docs/cnc-stencil-milling/stock-flat-result.jpg"
       alt="Flattened kapton sheet lying perfectly flat after heat treatment" class="doc-img">
</div>

### Cutting to size

**Cut** a length from the roll that matches your spoilboard footprint, leaving a couple of millimetres of clearance on each side. The sheet does not need to be precise here, it just needs to sit within the spoilboard boundary so nothing overhangs.

A pair of scissors or a utility knife against a straightedge both work fine. Cut a few sheets at once: they are cheap, and having spares means you can go straight into a second run without stopping to prep more stock.

### Heat-flattening

The most reliable way to remove roll memory from kapton is heat and pressure applied together. The combination relaxes the material's internal stresses and lets it set flat permanently.

Our setup uses two lava rock slabs as the outer layers of the stack, with the kapton sandwiched between two aluminium sheets in the middle. The mass of the slabs distributes heat evenly across the entire surface and provides all the pressure you need — no clamps required.

1. **Assemble the stack.** **Lay** a lava rock slab on your hot plate. **Place** an aluminium sheet on top, then your kapton sheets, then another aluminium sheet, then the second lava rock slab.
2. **Heat to 200°C for 30 minutes.** **Set** the hot plate to 200°C and **leave** the stack for 30 minutes.
3. **Let it cool before disassembling.** **Do not** lift the slabs while the stack is still hot. Let it cool to room temperature first. The kapton needs to set in its new flat state, not spring back while still warm.

Once the stack is cool, the sheets should be completely flat and stay that way.

> **Note:** If you don't have a hot plate or lava rock slabs, a kitchen oven works fine as an alternative. Sandwich the kapton between two aluminium sheets, clamp the stack firmly with binder clips and place it on a baking tray at 200°C for 30 minutes. The result is the same; the lava rock setup just produces more consistent pressure and heat distribution.

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/cnc-stencil-milling/stock-flattening-stack.jpg"
       alt="Kapton sheets sandwiched between aluminium sheets and lava rock slabs on a hot plate, ready for heat treatment" class="doc-img">
</div>

## 4. Fixing to the Bed {#fixing}

With your kapton sheet flat and cut to size, the next step is to build the full assembly: kapton bonded to the spoilboard, holder on top and mount it on the machine. This is done off the machine first, then placed as a unit.

### Bonding the Kapton to the Spoilboard

The blue tape and white glue method gives you a bond that is strong enough to hold the sheet completely still during milling, and clean enough to release without tearing or leaving residue.

1. **Mark the center of the kapton sheet.** Before you apply any tape or glue, **find** the center of the sheet and **mark** it on the top face with a fine permanent marker. This mark is your job origin: the point you will jog the spindle to when zeroing your machine. It is much easier to do this now than after the sheet is bonded and mounted on the machine.
2. **Apply blue tape to both surfaces.** **Stick** a layer of blue painter's tape to the top surface of the spoilboard, covering the area where the kapton will sit. **Stick** a layer to the bottom face of the kapton sheet as well. **Press** both layers down firmly so there are no bubbles or lifted edges. Apply the strips side by side, as close as possible without overlapping: an overlap raises a ridge that stops the kapton lying flat, and any gap exposes the bare spoilboard surface to glue, which is hard to clean and will degrade the board over time.
3. **Apply a thin layer of white glue to one taped surface.** A thin, even coat on the spoilboard tape is enough, you don't need much. **Spread** it across the surface with a finger or a piece of card.
4. **Lay the kapton onto the spoilboard.** **Place** the kapton tape-side-down onto the spoilboard, keeping it within the spoilboard boundary on all sides.
5. **Roll it flat with the brayer.** Starting from the centre and working outward, **roll** the brayer firmly across the kapton in overlapping passes. The goal is zero air pockets between the two tape surfaces. Any trapped air is a potential lifting point during the job.
6. **Let the glue set.** Give it a few minutes before moving on. The glue doesn't need to be fully cured, but the bond should feel firm when you press gently on the kapton. Once it does, **give it one more pass with the brayer** to make sure nothing has lifted as the glue dried.

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/cnc-stencil-milling/assembly-bonded.jpg"
       alt="Kapton sheet bonded to the spoilboard with blue tape and white glue, rolled flat" class="doc-img">
</div>

### Mounting on the Machine Bed

7. **Place the 3D-printed holder on top of the kapton** and **move the full assembly to the machine.**
8. **Position the assembly on the CNC bed.** Like the spoilboard itself, the holder must always go in the **same position** on the bed as it was surfaced in that exact spot, and that is the only position where the top face is guaranteed to be flat relative to the gantry. Use your marked reference lines to position it correctly.
9. **Secure the holder to the bed with T-nuts and screws.** **Drop** T-nuts into the bed's T-slot tracks, aligning them under the holder's 8 countersunk holes. **Thread** a screw through each hole into its T-nut and **tighten** evenly, working around the frame rather than fully tightening one side at a time. The holder should be completely immobile when done.
10. **Set the job origin.** **Jog** the spindle to the center mark you made on the kapton and **zero** the X and Y axes. Then **zero** Z on the **top surface of the kapton**, this is the reference the toolpaths were generated from. Getting Z wrong is the single most common cause of a ruined stencil: too high and the apertures won't clear; too low and you'll cut through into the spoilboard.

> **Caution:** Double-check the origin before pressing Start. Walk through the X, Y, and Z positions against your NC file. Once the job starts, there is no recovery from a wrong zero.

With everything verified, run your job. The machine will profile each aperture in a single pass, the whole run should take only a few minutes.

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/cnc-stencil-milling/assembly-on-bed.jpg"
       alt="Full assembly, spoilboard, kapton and holder, mounted and clamped on the CNC bed with the origin set" class="doc-img">
</div>

## 5. Cleanup & Inspection {#cleanup}

### Releasing the Stencil

The first step off the machine is also your first quality check.

1. **Remove the holder** and **peel the kapton sheet off the spoilboard tape.** The cut-out slugs (the small pieces of kapton that were cleared from each aperture) should remain stuck to the tape below and separate cleanly as you lift the sheet. A stencil that peels off easily with clean, open apertures is a good sign the job went well.
2. **Check for any uncleared apertures.** If a slug didn't separate fully, it will still be sitting in its opening, attached by a thin uncut sliver. **Work** it free with the scalpel using a gentle lifting motion. This is normal on the occasional aperture and nothing to worry about.

<div class="img-grid cols-1" markdown="0">
  <img src="/assets/images/docs/cnc-stencil-milling/stencil-released.jpg"
       alt="Kapton stencil peeled off the spoilboard tape, with aperture slugs remaining on the tape below" class="doc-img">
</div>

### Cleaning Up the Edges

Some burring along the aperture edges is expected and normal: the V-bit leaves a slight raised lip as it profiles each opening. A few passes of cleanup bring it down to a perfectly smooth finish.

3. **Wet-sand both sides with 3000-grit paper.** **Dampen** your sandpaper and **make** a few light passes across the full surface of the stencil, then **flip** it and repeat on the other side. The wet paper keeps the kapton flat and prevents the fine dust from clogging the abrasive. This takes down the bulk of the burring and keeps the surface level.
4. **Finish with the Dremel.** Fit a soft felt attachment (403, 404, or 405) and **run** it lightly along the aperture edges. The felt conforms to the opening geometry and smooths the remaining burrs without removing material from the flat face of the stencil. **Work** both sides.

The goal is a surface that feels uniformly smooth under your fingertip. No raised edges, no snags.

> **Tip:** Alternate between the sandpaper and the Dremel as needed. The sandpaper keeps things flat; the Dremel gets into the edges. A couple of passes with each is usually all it takes.

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/cnc-stencil-milling/stencil-cleanup.jpg"
       alt="Stencil being wet-sanded with 3000-grit paper on a flat surface" class="doc-img">
</div>

### Inspection

5. **Hold the stencil up to a light source.** Every aperture should be a clean, open window. Look for any that are partially blocked, have a thin film of kapton still across them, or show significant tearing at the edges.
6. **Run a fingernail lightly across the surface.** You should feel nothing: no snags, no raised lips around the openings. If you feel a burr, go back for another pass of sandpaper or Dremel.

A stencil that passes both checks is ready to use. **Clean** it with IPA and a paper towel before mounting it in the stencil holder for paste application.

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/cnc-stencil-milling/stencil-finished.jpg"
       alt="Finished kapton stencil held up to light, showing clean open apertures" class="doc-img">
</div>
