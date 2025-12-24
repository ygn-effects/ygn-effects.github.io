---
title: Shining Pig
layout: effect
permalink: /effects/shining-pig/
category: Boost
date: 2025-12-23
excerpt: A civilized 18V Powerboost with Master Volume and refined gain taper.

images:
  card: /assets/images/effects/shining-pig/card.png
  hero: /assets/images/effects/shining-pig/hero.png
  story_1: /assets/images/effects/shining-pig/story-1.png
  knobs: /assets/images/effects/shining-pig/knobs.png
  internals: /assets/images/effects/shining-pig/internals.png
  ioboard: /assets/images/effects/shining-pig/ioboard.png

story: |
  <strong>A primitive circuit with civilized manners.</strong><br><br>

  The Shining Pig is our take on the legendary Colorsound Powerboost, the monster that defined the sound of 70s psych rock.<br><br>

  The original circuit is famous for two things: incredible, high-headroom dynamics and being absolutely deafening. It had no master volume, meaning you had to shake the walls just to get the transistors to crackle. It was a crude but brilliant design for a time when PA systems were weak and amplifiers needed to be punished.<br><br>

  <strong>We kept the brilliance and fixed the usability.</strong><br><br>

  The Shining Pig runs on an internal 18V rail (generated from a standard 9V supply via our IO board's charge pump), preserving that percussive, high-voltage "thump" that makes the original so addictive. But we added a Master Volume, so you can finally get that cooking transistor sound at bedroom levels.<br><br>

  We also swapped the stock gain control for a different taper that creates a usable "Goldilocks" zone. Instead of an on/off switch for fuzz, you get a wide sweep of "hair", that magical texture where the signal is still mostly clean but also harmonically rich, responding instantly to your pick attack.<br><br>

  <strong>The Gateway Build</strong><br><br>

  For builders, this is the perfect entry point into the YGN Framework. The circuit is simple but sensitive, allowing you to figure out the importance of biasing and power rails. And because the PCB is a straightforward layout, you aren't locked in: swap a few values and add a few traces to convert it to the 9V Overdriver spec, or keep it 18V for the full experience.

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
    url: https://github.com/ygn-effects/effect-shining-pig/tree/main/pcb
  - name: firmware
    url: https://github.com/ygn-effects/effect-shining-pig/tree/main/firmware
---
