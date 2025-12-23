---
title: Sexy Rodent
layout: effect
permalink: /effects/sexy-rodent/
category: Distortion
date: 2023-11-21
excerpt: A hot-rodded Rat with LED/Si/Ge clipping and wide-range Sweep control.

images:
  card: /assets/images/effects/sexy-rodent/card.png
  hero: /assets/images/effects/sexy-rodent/hero.png
  story_1: /assets/images/effects/sexy-rodent/story-1.png
  knobs: /assets/images/effects/sexy-rodent/knobs.png
  internals: /assets/images/effects/sexy-rodent/internals.png
  ioboard: /assets/images/effects/sexy-rodent/ioboard.png

story: |
  <strong>Let’s be real: you don’t need another history lesson on the Rat.</strong><br><br>

  You know the sound. It’s the "happy accident" of the late 70s: a circuit that generated distortion not just by using clipping diodes, but by pushing an op-amp so hard it physically couldn't slew fast enough to keep up. That specific, primitive failure mode is what gives this circuit its legendary "yeowl." It’s dirty, it’s aggressive, and it’s perfect.<br><br>

  <strong>So why build another one?</strong> <br><br>

  Because as good as the original is, it has limits. The Sexy Rodent is our attempt to take that classic topology and uncage it. We kept the core "slewing" gain stage that defines the sound, but ripped out the restrictions.<br><br>

  The stock circuit is notorious for strangling your low end. We fixed that with the Sweep control (a fully variable implementation of the classic "Ruetz" mod). This lets you alter the frequency response of the gain stage directly, moving from the tight, mid-focused bite of the 80s to a massive, blown-out fuzz tone that shakes the floor.<br><br>

  We also wanted texture options without the hassle. The Clip switch lets you toggle between the classic Silicon crunch, the compressed, spongy feel of Germanium, or the loud, open roar of LEDs.<br><br>

  <strong>The Open-Source Philosophy</strong><br><br>

  Like everything at YGN, the Sexy Rodent is built on our Open Source Framework. This pedal is actually the "Reference Build" of the Framework, assembled by us to show exactly what the platform is capable of. We make these because we love the sound, but we also build them to show you what you can achieve. Whether you buy this pedal or download the files to make your own, the goal is the same: make it loud, and make it yours.

knobs-image: sexyrodent-knobs.png
knobs:
  - name: Volume
    desc: Adjusts the output volume of the effect.
  - name: Gain
    desc: Sets the amount of distortion. The range of this control is pretty wide, it covers ground from mild overdrive to straight-up fuzz. This is also dependent on the selected clipping option.
  - name: Tone
    desc: Adjusts the cut-off frequency. Turning this knob clockwise will filter more higher frequencies out.
  - name: Sweep
    desc: Adjusts the frequency response of the op-amp gain stage. Turning this knob clockwise will allow more low end to be clipped. Fully counter-clockwise is equivalent to the stock  value.
  - name: Clip
    desc: Selects the clipping mode between LED, silicon and germanium diodes. Each will have their own threshold and will give a different character to the distortion.


internals:
  - name: Mellow
    desc: Setting this on will tame the beast a little. It will filter some higher frequencies out at the clipping stage resulting in a slightly less aggressive, smoother sound.

ioboard:
  - name: Mode
    desc: This jumper allows you to set the power-on state of the pedal. With the jumper present it will stay off and without the jumper it will switch on upon powering.
  - name: Bright
    desc: This trimpot allows you to set the brightness of the status LED.

tips:
  - name: Clipping vs. Headroom
    desc: |
      Think of the Clip switch as an adjustable ceiling.
      <ul>
        <li>
          <strong>Germanium diodes</strong> have the lowest ceiling. They compress early, giving you rich saturation and a lower output volume. It typically won't push your amp very hard.
        </li>
        <li>
          <strong>LEDs</strong> on the other hand have a very high ceiling. They allow for huge signal swings before clipping. Use this mode if you want to use the pedal as a dirty boost to drive your tube amp's preamp into natural saturation.
        </li>
        <li>
          <strong>Silicon diodes</strong> sit in the middle ground, though still on the lower side of the headroom ceiling. This is the diode flavor found in most stock RATs.
        </li>
      </ul>
      This selection of clipping diodes is based on various iterations of the effect over the years and gives the Sexy Rodent a lot of versatility, allowing it to slot naturally into most rigs.
  - name: Dialing in the "Sweep"
    desc: |
      The <strong>Sweep</strong> control is interactive. As you turn it up (clockwise) to add bass, you are also increasing the overall gain of the op-amp. You might find that as you increase the Sweep, you need to back off the <strong>Tone</strong> knob slightly to keep the definition, or lower the <strong>Gain</strong> knob to maintain clarity. This is of course also dependent on the clipping mode used.
  - name: Stacking Strategy
    desc: |
      The Sexy Rodent plays well with others.
      <ul>
        <li>
          <strong>Tighten the lows:</strong> Put a mid-hump drive (like a Tube Screamer or Klon-style circuit) before the Rodent. This cuts the bass before it hits the distortion stage, keeping things tight even with the Gain cranked.
        </li>
        <li>
          <strong>The Doom Stack:</strong> Run the Rodent into a mid-scooped fuzz (like a Big Muff). Use the Rodent's mid-focus to punch through the mix, adding a gnarly texture to the smooth wall of fuzz.
        </li>
      </ul>
      The Rodent also stacks very well with itself. With one set as a dirty boost and one set as an overdrive or a distortion, it might be all you need!

resources:
  - name: hardware
    url: https://github.com/ygn-effects/effect-sexy-rodent/tree/main/pcb
  - name: firmware
    url: https://github.com/ygn-effects/effect-sexy-rodent/tree/main/firmware
---
