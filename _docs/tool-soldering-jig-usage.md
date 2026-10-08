---
title: Soldering Jig Usage
layout: doc
permalink: /docs/tool-soldering-jig-usage/
updated: 2026-10-08
topic: Tools
excerpt: 3D-printed jigs that hold pots, switches and connectors square to the board while you hand-solder them.
tags: [3d-printing, tools, assembly, soldering]
toc:
  - label: Introduction
    href: "#intro"
  - label: Choosing your jig
    href: "#variants"
  - label: Required materials
    href: "#materials"
  - label: 3D Printing
    href: "#printing"
  - label: Using the jig
    href: "#usage"
---

## 1. Introduction {#intro}

The soldering jigs are part of the Framework's assembly tools, alongside the [Stencil Holder](/docs/tool-stencil-holder-assembly/). They're 3D-printed holders that keep a board's through-hole parts (pots, switches, jacks and connectors) straight and at the right height while you hand-solder them.

You'll use one after [SMD assembly](/docs/smd-pcb-assembly/), once the surface-mount parts are reflowed and only the through-hole parts are left. Those are the parts that show on the finished pedal: a pot soldered slightly crooked won't line up with its enclosure hole, and a connector leaning off its footprint is hard to miss. In the jig, each part sits in a pocket cut to its shape, so it can only go in straight.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/soldering-jig/misaligned-example.jpg"
     thumb="/assets/images/docs/soldering-jig/thumbs/misaligned-example.webp"
     alt="Hand-soldered board with a crooked pot, the kind of mistake the jig prevents"
     width="1600" height="1200" %}
</div>

## 2. Choosing Your Jig {#variants}

Each jig fits one board and one side of it: **top** and **bottom** are the sides of the board the parts sit on, and a board with parts on both sides uses two jigs. On the jigs that mix pots and a toggle switch, the letters give the switch position in the two rows of three controls: **BL** bottom left, **BC** bottom centre and **BR** bottom right.

| Board | Side | Holds | File |
|---|---|---|---|
| Small effect board | Top | JST PH connectors | `soldering-jig-effect-small-top-connectors.step` |
| Small effect board | Bottom | 4 pots | `soldering-jig-effect-small-bottom-4-pots.step` |
| Small effect board | Bottom | 6 pots | `soldering-jig-effect-small-bottom-6-pots.step` |
| Small effect board | Bottom | 3 pots, SPST toggle switch (BL) | `soldering-jig-effect-small-bottom-3-pots-bl-switch-spst.step` |
| Small effect board | Bottom | 3 pots, DPDT toggle switch (BR) | `soldering-jig-effect-small-bottom-3-pots-br-switch-dpdt.step` |
| Small effect board | Bottom | 4 pots, SPST toggle switch (BC) | `soldering-jig-effect-small-bottom-4-pots-bc-switch-spst.step` |
| Small IO Board | Top | JST PH connector, 3368P trimmer, 1-way DIP switch | `soldering-jig-io-board-small-top.step` |
| Small IO Board | Bottom | Input and output jacks, JST PH connector | `soldering-jig-io-board-small-bottom.step` |
| FV-1 Programmer | Top | USB-A connector, JST PH connector | `soldering-jig-spinasm-programmer-top.step` |

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/soldering-jig/jig-variants.jpg"
     thumb="/assets/images/docs/soldering-jig/thumbs/jig-variants.webp"
     alt="Top and bottom jigs for a small effect board side by side, the connector jig next to a pot jig"
     width="1600" height="1200" %}
</div>

## 3. Required Tools and Materials {#materials}

- **A 3D printer** that can print ABS, ASA or PC.
- **ABS, ASA or PC filament.** Heat runs down the leads and through the board into the jig while you solder, and PLA or PETG soften enough at those temperatures to deform.
- **The jig's `.step` file**, from the [`stl/` folder](https://github.com/ygn-effects/tool-various/tree/main/soldering-jig/stl) of the repository.
- **A small vise or clamp** to hold the jig steady and leave both hands free.
- **A soldering iron and solder.**
- **A plastic spudger** to lift the board off the jig at the release tabs.
- **Your PCB**, with its SMD parts already reflowed, and the through-hole parts the jig holds.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/soldering-jig/jig-with-components.jpg"
     thumb="/assets/images/docs/soldering-jig/thumbs/jig-with-components.webp"
     alt="Printed jig next to its PCB and the components it holds"
     width="1600" height="1200" %}
</div>

## 4. 3D Printing {#printing}

The jig is clamped in a vise and heated build after build, so the walls, layers and infill are set for strength rather than looks.

| Setting | Value |
|---|---|
| Orientation | Flat on its full bottom face |
| Supports | None |
| Walls (perimeters) | 4 |
| Top and bottom layers | 6 |
| Infill | 25% or more |
| Brim | Recommended for ABS, ASA and PC, which tend to lift at the corners |
| Seam position | Outside the component pockets |
| X/Y shrinkage compensation | Set for your filament |

> **Note:** The component pockets are cut to tight tolerances. ABS, ASA and PC shrink as they cool, so without X/Y compensation the pockets print undersized, and a seam inside a pocket leaves a ridge that narrows it further.
{: .doc-callout .doc-callout-note}

<div class="img-grid doc-image-grid cols-2" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/soldering-jig/slicer-perimeters-infill.png"
     thumb="/assets/images/docs/soldering-jig/thumbs/slicer-perimeters-infill.webp"
     alt="Slicer preview cut through the jig, showing the four perimeters, solid top and bottom layers and the infill"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/soldering-jig/slicer-seam-placement.png"
     thumb="/assets/images/docs/soldering-jig/thumbs/slicer-seam-placement.webp"
     alt="Slicer preview of a component pocket with the seam placed on the jig's outer wall, clear of the pocket"
     width="1600" height="1200" %}
</div>

## 5. Using the Jig {#usage}

If your board has two jigs, solder the top side first. The small parts are always on the top side and the big pots and switches on the bottom, so doing the top first keeps the tall parts out of your way.

1. **Clamp** the jig in the vise with its pockets facing up.
2. **Seat** each part in its pocket, legs pointing up. The pot pockets have a notch for the pot's anti-rotation tab, so turn each pot until the tab drops into the notch and the pot sits fully down.
3. **Lower** the PCB over the legs, with the side the parts belong on facing the jig. Once every leg finds its hole, the board drops down all at once and sits flush on the jig. If it rocks or sits high, a leg is bent or a part isn't fully seated: lift the board off and check.
4. **Solder** every pin. Ground pins take a little longer, as the copper plane pulls heat away from the joint.
5. **Unclamp** the jig, then slide the spudger under the board at one of the release tabs and lever it gently up. Every part should sit square and flush against the board.
6. **Move** to the bottom jig if your board has one, and repeat from step 1 with the bottom-side parts.

> **Note:** The jig takes the heat of normal through-hole soldering, ground pins included. Heat that overcooks a joint will mark the jig too, but ABS, ASA and PC are forgiving and an occasional slip won't ruin it.
{: .doc-callout .doc-callout-note}

<div class="img-grid doc-image-grid cols-2" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/soldering-jig/jig-clamped.jpg"
     thumb="/assets/images/docs/soldering-jig/thumbs/jig-clamped.webp"
     alt="Jig clamped in a small vise with its pockets facing up"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/soldering-jig/components-seated.jpg"
     thumb="/assets/images/docs/soldering-jig/thumbs/components-seated.webp"
     alt="Pots seated in the bottom jig with their anti-rotation tabs in the pocket notches"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/soldering-jig/pcb-placed.jpg"
     thumb="/assets/images/docs/soldering-jig/thumbs/pcb-placed.webp"
     alt="PCB sitting flush on the jig over the legs of the seated parts"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/soldering-jig/soldering-in-progress.jpg"
     thumb="/assets/images/docs/soldering-jig/thumbs/soldering-in-progress.webp"
     alt="Soldering the pot legs with the board on the clamped jig"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/soldering-jig/release-tabs.jpg"
     thumb="/assets/images/docs/soldering-jig/thumbs/release-tabs.webp"
     alt="Plastic spudger slid under the board at a release tab, lifting it off the jig"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/soldering-jig/final-result.jpg"
     thumb="/assets/images/docs/soldering-jig/thumbs/final-result.webp"
     alt="Finished board with every pot and connector square and flush against the PCB"
     width="1600" height="1200" %}
</div>

Once every through-hole part is soldered, power the board up and check its [test points](/docs/smd-pcb-assembly/#tests).
