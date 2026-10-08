---
title: SMD PCB Assembly
layout: doc
permalink: /docs/smd-pcb-assembly/
updated: 2026-10-08
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

Welcome to the YGN Effects Framework documentation. This guide walks you through populating a pedal's printed circuit board (PCB) with its surface-mount components, using the **Small IO Board** as the example. It's a small, quick build, and every YGN PCB is assembled with exactly the same technique.

### A note on SMT

If you've only worked with through-hole parts, tiny Surface-Mount Technology (SMT) components can look intimidating. We use **hot plate reflow soldering**, which makes them much easier than they look: you apply solder paste through a stencil, place the parts on the paste and let a hot plate melt everything at once.

The process is forgiving. As the solder melts, its surface tension pulls slightly misplaced parts onto their pads, so your placement only needs to be close. We chose SMT for the Framework because it allows simpler, cleaner circuit routing, and the result is a professional-looking board that needs no cleaning and can be reworked later with a hot-air station.

## 2. Required Tools and Materials {#tools}

  - **A YGN Effects PCB.**
  - **Solder paste stencil:** a thin sheet with openings matching the board's pads. Have one fabricated from the board's Gerber files, or mill your own following the [CNC Stencil Milling guide](/docs/cnc-stencil-milling/).
  - **Solder paste:** we recommend **Chipquik SMD291SNL50T3**. It keeps for a long time (even past its expiration date), doesn't need refrigerating and is truly "no-clean".
  - **Squeegee:** anything flat and firm. An old credit card works well.
  - **Stencil holder:** our 3D-printed jig keeps the stencil aligned with the board. Build one with the [Stencil Holder Assembly guide](/docs/tool-stencil-holder-assembly/).
  - **Tweezers:** ideally a few sizes. Small pointed tips suit 0603 resistors and capacitors; larger ones are easier with ICs. Finding the pair you like takes some trial and error.
  - **Reflow hot plate:** heats the board to melt the solder. Many commercial and DIY versions are available.
  - **Isopropyl alcohol (IPA) and paper towels:** for cleaning the board, stencil and squeegee.

<div class="img-grid doc-image-grid cols-2" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/board-assembly-smd/tools-stencil-holder.webp"
     thumb="/assets/images/docs/board-assembly-smd/thumbs/tools-stencil-holder.webp"
     alt="PCB and stencil seated in the YGN Stencil Holder jig"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/board-assembly-smd/tools-hot-plate.jpg"
     thumb="/assets/images/docs/board-assembly-smd/thumbs/tools-hot-plate.webp"
     alt="Reflow hot plate used to heat the board during soldering"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/board-assembly-smd/tools-stencil.jpg"
     thumb="/assets/images/docs/board-assembly-smd/thumbs/tools-stencil.webp"
     alt="Solder paste stencil for the PCB"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/board-assembly-smd/tools-paste-squeegee-tweezers.jpg"
     thumb="/assets/images/docs/board-assembly-smd/thumbs/tools-paste-squeegee-tweezers.webp"
     alt="Solder paste, squeegee and tweezers laid out together"
     width="1600" height="1200" %}
</div>

## 3. Applying the Solder Paste {#paste}

Paste application decides how the rest of the build goes: an even deposit on every pad gives good joints, while too little or too much causes most reflow problems. Take your time here.

1. **Clean the board and stencil.** Wipe both with IPA and a paper towel. Removing oils and dust helps the paste stick only where it should.
2. **Prepare the paste.** Stir it thoroughly to recombine the metal particles and flux, then use a toothpick or small spatula to spread a thick line of paste along one edge of the squeegee.
3. **Fill the openings.** Press the squeegee flat against the stencil and drag it across the openings. Then make a pass with the squeegee held at 45° to scrape the excess back onto it. Repeat a few times until every opening is filled.
4. **Make a final pass.** One last clean pass at 45° removes as much excess from the stencil surface as possible.
5. **Save the excess.** Scrape the leftover paste off the squeegee and back into the jar.
6. **Remove the stencil.** Lift it straight up in one smooth motion; any sideways slide smears the paste. With the [Stencil Holder](/docs/tool-stencil-holder-assembly/), opening the holder pops the stencil cleanly off the board for you.
7. **Clean your tools.** Wipe the stencil and squeegee with IPA straight away. Dried paste is much harder to remove.
8. **Inspect the deposit.** Every pad should carry a uniform grey layer of paste.

> **Tip:** If some pads look thin or you see paste bridging two pads, put the board back in the jig, lay the stencil on top (it snaps back into the same position) and repeat the application.
{: .doc-callout .doc-callout-tip}

<div class="img-grid doc-image-grid cols-2" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/board-assembly-smd/stencil-lift-off.jpg"
     thumb="/assets/images/docs/board-assembly-smd/thumbs/stencil-lift-off.webp"
     alt="Stencil being lifted straight off the PCB after paste application"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/board-assembly-smd/paste-applied.jpg"
     thumb="/assets/images/docs/board-assembly-smd/thumbs/paste-applied.webp"
     alt="PCB with uniform gray solder paste deposits on every pad"
     width="1600" height="1200" %}
</div>

## 4. Placing the Components {#placement}

With the paste down, each component goes onto its pads. A little organisation first makes this much faster.

### Preparation

1. **Organise your components.** Picking parts out of cut tape is slow and fiddly, so store them in a sorted system. We use **AideTek BOX-ALL** organisers, with separate boxes for resistors, capacitors and ICs.

    <div class="img-grid doc-image-grid cols-2" markdown="0">
      {% include doc-image.html
         full="/assets/images/docs/board-assembly-smd/components-storage-boxes.jpg"
         thumb="/assets/images/docs/board-assembly-smd/thumbs/components-storage-boxes.webp"
         alt="BOX-ALL component storage boxes with all compartment lids closed"
         width="1600" height="1200" %}
      {% include doc-image.html
         full="/assets/images/docs/board-assembly-smd/components-storage-lid-open.jpg"
         thumb="/assets/images/docs/board-assembly-smd/thumbs/components-storage-lid-open.webp"
         alt="Close-up of an open compartment lid showing components inside"
         width="1600" height="1200" %}
    </div>

2. **Map what goes where.** The silkscreen is hard to read at this scale, so open the **mechanical layer** file from the effect's repository alongside the Bill of Materials (BOM). It shows only the component outlines and their designators.
    > **Tip:** Print the mechanical layer and write the component values next to each outline. It becomes a placement map for the whole build.
    {: .doc-callout .doc-callout-tip}
3. **Clean your tweezers.** The tips must be clean, sharp and aligned. A 0603 part is light enough to stick to any residue or slip out of bent tips.

### Placement

Don't aim for perfect alignment: reflow pulls most parts into place, so getting each one reasonably centred on its pads is enough. Work from the smallest parts to the largest, so the tall ones never get in the way of your tweezers:

1. **0603 resistors.** Pick one value (for example 10kΩ), place every resistor of that value, then move to the next value.
2. **0603 capacitors,** the same way.
3. **Larger passives** (0805, 1206).
4. **Diodes and transistors,** from smallest to largest. Check each one's orientation against the map.
5. **Integrated circuits (ICs),** again checking orientation.
6. **Bulky parts** such as electrolytic capacitors and relays.

<div class="img-grid doc-image-grid cols-2" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/board-assembly-smd/tweezers-placing-component.jpg"
     thumb="/assets/images/docs/board-assembly-smd/thumbs/tweezers-placing-component.webp"
     alt="Tweezers placing a small SMD component onto its pads"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/board-assembly-smd/components-placed.jpg"
     thumb="/assets/images/docs/board-assembly-smd/thumbs/components-placed.webp"
     alt="Fully populated PCB with all SMD components placed, ready for reflow"
     width="1600" height="1200" %}
</div>

## 5. The Reflow Process {#reflow}

Reflow melts the paste and turns the loose parts into one soldered circuit.

### The reflow profile

Solder paste manufacturers publish a **reflow profile**: a graph of the temperature the board should follow over time. It has three stages:

1. **Ramp-up (pre-heat):** the temperature rises slowly to activate the flux, which cleans the metal surfaces of the pads and leads.
2. **Soak:** the temperature holds steady so the flux can work and the whole board reaches an even temperature.
3. **Reflow:** the temperature rises quickly past the solder's melting point, and the solder flows to form the joints.

We follow the profile for the first two stages. Most hobby hot plates can't match the steep final curve, so for reflow we go by what the solder looks like instead.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/board-assembly-smd/reflow-profile-smd291.png"
     thumb="/assets/images/docs/board-assembly-smd/thumbs/reflow-profile-smd291.webp"
     alt="Reflow profile graph for Chipquik SMD291SNL50T3 solder paste with the ramp-up, soak and reflow stages highlighted"
     width="1600" height="1200" %}
</div>

### Reflowing the board

1. **Plan the landing.** Before heating anything, decide how you'll take the board off the plate: flat pliers or sturdy tweezers, and a heat-resistant surface such as scrap wood or a copper sheet for it to cool on. Rehearse the move once. The solder is still liquid when you lift the board, so a jolt can knock parts off their pads.
2. **Place the board** in the centre of the cold hot plate.
3. **Ramp up.** Set the plate to **150°C**, start a timer and wait about 90 seconds.
4. **Soak.** Raise the setting to **180°C** and wait another 90 seconds. The paste turns from dull grey to a slightly wet, shiny look, and you may see a little smoke as the flux activates. Both are normal.
5. **Reflow.** Turn the plate to its maximum setting (for example **250°C**) and watch the board. Past about 240°C the paste turns into shiny liquid silver, pad by pad. Wait until every pad has changed; the large pads under electrolytic capacitors melt last. Then lift the board off smoothly and set it on your cooling surface.
6. **Inspect the joints.** Let the board cool completely (at least 5 to 10 minutes), then look at the joints, with a magnifier if you have one.

> **Tip:** A good SMT joint, called a **fillet**, is shiny and curves inward where the solder has wicked up from the pad onto the component's lead. Also look for bridges (solder joining two pads that should be separate) and pads that didn't solder.
{: .doc-callout .doc-callout-tip}

<div class="img-grid doc-image-grid cols-2" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/board-assembly-smd/reflow-melting.jpg"
     thumb="/assets/images/docs/board-assembly-smd/thumbs/reflow-melting.webp"
     alt="Solder paste turning shiny and liquid on the hot plate during reflow"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/board-assembly-smd/solder-joints-fillet.jpg"
     thumb="/assets/images/docs/board-assembly-smd/thumbs/solder-joints-fillet.webp"
     alt="Close-up of finished SMD solder joints showing a clean, concave fillet"
     width="1600" height="1200" %}
</div>

## 6. Testing Your Board {#tests}

Once the through-hole parts (headers and connectors) are soldered, power up the board and check its voltages against the documentation.

1. **Find the test points.** They're labelled on the silkscreen (for example "TP1", "TP2").
2. **Look up the expected values** in the **Test Points document**, in the fabrication output folder of the effect's repository. It lists each test point with its expected voltage or behaviour.
3. **Measure.** Power the board and touch your multimeter's black COM probe to any of the exposed vias (the small copper holes) along the board's edges: they all connect to ground. Touch the red probe to each test point and compare the reading with the document. If every value matches, the board is ready for your pedal.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/board-assembly-smd/test-points-probe.jpg"
     thumb="/assets/images/docs/board-assembly-smd/thumbs/test-points-probe.webp"
     alt="Multimeter probe touching a labeled test point on the finished board"
     width="1600" height="1200" %}
</div>
