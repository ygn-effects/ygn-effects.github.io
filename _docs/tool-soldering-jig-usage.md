---
title: Soldering Jig Usage
layout: doc
permalink: /docs/tool-soldering-jig-usage/
updated: 2026-06-24
topic: Tools
excerpt: 3D-printed jigs that align pots, switches and connectors for perfectly positioned hand-soldering on all our boards.
tags: [3d-printing, tools, assembly, soldering]
toc:
  - label: Introduction
    href: "#intro"
  - label: Required materials
    href: "#materials"
  - label: 3D Printing
    href: "#printing"
  - label: Using the Jig
    href: "#usage"
---

## Introduction {#intro}

Welcome to the YGN Effects Framework documentation! These soldering jigs are simple 3D-printed alignment holders for hand-soldering the off-board components on your pedal: potentiometers, footswitches, JST PH connectors and most of the through hole parts.

A pot that doesn't line up with its enclosure hole or a connector sitting crooked on the board is one of the most common and most avoidable blemishes on a hand-built pedal. The jig fixes both. Pop your parts into it, drop the PCB on top and solder: everything lands exactly where it's supposed to, every time.

There's a jig variant for each board family in the Framework. Each one is shaped to hold the specific components for that board. Check the [soldering jig repository](https://github.com/ygn-effects/tool-various/tree/main/soldering-jig) for the full lineup and to grab the `.step` file that matches what you're building.

<div class="img-grid doc-image-grid cols-2" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/soldering-jig/misaligned-example.jpg"
     thumb="/assets/images/docs/soldering-jig/thumbs/misaligned-example.webp"
     alt="Hand-soldered board with a crooked pot, the kind of mistake the jig prevents"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/soldering-jig/jig-variants.jpg"
     thumb="/assets/images/docs/soldering-jig/thumbs/jig-variants.webp"
     alt="Two jig variants side by side, for an effect board and an IO board"
     width="1600" height="1200" %}
</div>

## Required materials {#materials}

- **A 3D printer** capable of printing engineering-grade filament.
- **ABS, ASA, or PC filament.** Don't print these in PLA or PETG as both have a low heat-deflection temperature and will warp or deform under the heat conducted through component leads and the board itself, which spikes further on a ground pin pulling heat from a whole copper plane. The CAD builds in heat relief cutouts around the hottest spots to minimize contact, but the jig still takes real, repeated heat, so it needs a filament that can shrug it off.
- **The `.step` file for your board**, from the [stl/](https://github.com/ygn-effects/tool-various/tree/main/soldering-jig/stl) folder of the repository.
- **A small vise or clamp.** You'll hold the jig in it while you solder, so it stays put and your hands stay free.
- **The pots, switches, or JST PH connectors and the PCB** you're about to solder.

<div class="img-grid doc-image-grid cols-2" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/soldering-jig/jig-with-components.jpg"
     thumb="/assets/images/docs/soldering-jig/thumbs/jig-with-components.webp"
     alt="Printed jig next to its PCB and the components it holds"
     width="1600" height="1200" %}
</div>

## 3D Printing {#printing}

These jigs print clean and simple:

- **Supports:** none needed, on any of the jigs.
- **Walls/perimeters:** 4.
- **Top/bottom layers:** 6.
- **Infill:** 25% or higher.

> **Note:** The extra walls, top/bottom layers and infill aren't about print quality, they're about durability. The jig spends its working life clamped in a vise and absorbing the heat from the soldering action going on around it, build after build. A thin-walled, low-infill print will eventually crack under that combination of clamping pressure and repeated heat. Printing it sturdy from the start saves you from reprinting it down the line.
{: .doc-callout .doc-callout-note}

> **Note:** ABS, ASA, and PC are all prone to shrinkage as they cool, and the pockets that hold your pots, switches, and connectors are cut to tight tolerances. Make sure your slicer profile accounts for the X/Y shrinkage of your specific filament, or those pockets can end up undersized.
{: .doc-callout .doc-callout-note}

<div class="img-grid doc-image-grid cols-2" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/soldering-jig/heat-relief-detail.jpg"
     thumb="/assets/images/docs/soldering-jig/thumbs/heat-relief-detail.webp"
     alt="Close-up of the heat relief cutouts near the iron contact points"
     width="1600" height="1200" %}
</div>

## Using the Jig {#usage}

1. **Pick the jig** that matches your board and its components, and print it using the settings above.
2. **Clamp the jig** in a small vise so it stays steady while you work.
3. **Seat your pots, switches, or JST PH connectors** into the jig.
4. **Place your PCB on top.**
5. **Solder.**
6. **Unclamp the jig and lift the board off.** Everything comes off perfectly aligned, no rework needed.

<div class="img-grid doc-image-grid cols-2" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/soldering-jig/jig-clamped.jpg"
     thumb="/assets/images/docs/soldering-jig/thumbs/jig-clamped.webp"
     alt="Jig clamped in a small vise"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/soldering-jig/components-seated.jpg"
     thumb="/assets/images/docs/soldering-jig/thumbs/components-seated.webp"
     alt="Pots and switches seated in the jig"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/soldering-jig/pcb-placed.jpg"
     thumb="/assets/images/docs/soldering-jig/thumbs/pcb-placed.webp"
     alt="PCB placed on top of the seated components"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/soldering-jig/soldering-in-progress.jpg"
     thumb="/assets/images/docs/soldering-jig/thumbs/soldering-in-progress.webp"
     alt="Soldering a component while the jig is clamped"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/soldering-jig/final-result.jpg"
     thumb="/assets/images/docs/soldering-jig/thumbs/final-result.webp"
     alt="Finished board with all components perfectly aligned"
     width="1600" height="1200" %}
</div>

> **Tip:** If your board has both a top and a bottom jig, solder the top side first and the bottom side last, that order is consistent across every board in the Framework. Seat and solder the top jig's components, then move the board to the bottom jig for the rest.
{: .doc-callout .doc-callout-tip}
