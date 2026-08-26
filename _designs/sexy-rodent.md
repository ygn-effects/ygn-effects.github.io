---
title: Sexy Rodent
layout: design
permalink: /designs/sexy-rodent/
category: Distortion
date: 2023-11-21
excerpt: "Our reference design: a RAT-derived distortion with Sweep control and selectable clipping."

images:
  card: /assets/images/designs/sexy-rodent/card.png
  hero: /assets/images/designs/sexy-rodent/hero.png
  story_1: /assets/images/designs/sexy-rodent/story-1.png
  knobs: /assets/images/designs/sexy-rodent/knobs.png
  internals: /assets/images/designs/sexy-rodent/internals.png
  ioboard: /assets/images/designs/sexy-rodent/ioboard.png

story: |
  <strong>The RAT doesn't really need fixing.</strong>
  </br>
  </br>
  It has been around since the late '70s, gone through plenty of revisions, spawned a whole family of variants and clones and even gets a particularly enthusiastic guest appearance in Blur's <i>Song 2</i> video. We keep coming back to it for a simpler reason: it is an exceptionally useful distortion circuit.
  </br>
  </br>
  A lot of that comes from the way its gain stage handles frequency. The RAT applies considerably more gain to some parts of the signal than others, keeping the low end controlled as the distortion increases. Combined with the Filter control, that gives it a remarkably wide useful range. It can add a little grit and level into an amp, sit comfortably in familiar distortion territory or get considerably less polite without immediately turning the bottom end into soup.
  </br>
  </br>
  Sexy Rodent keeps that basic architecture and makes two of its more interesting areas adjustable:
  </br>
  <strong>Sweep</strong> is a variable implementation of the Ruetz mod, giving control over the frequency response of the op-amp gain stage.
  </br>
  <strong>Clip</strong> selects between silicon, LED and germanium diodes, changing the clipping threshold, output level and compression while leaving the rest of the circuit alone.
  </br>
  </br>
  Those controls cover a fair bit of the RAT family territory in one circuit. Silicon gives the familiar response, LEDs open things up with more headroom and output and germanium takes the circuit in a softer, lower-level and slightly stranger direction. Sweep then lets you decide how much of the lower end gets involved before the signal reaches those clipping diodes.
  </br>
  </br>
  Sexy Rodent also became the <strong>reference design for the YGN Framework</strong>. We used it while developing the enclosure, IO Board, Effect Board format, assembly process and documentation. Starting with a circuit we already knew well gave us a useful baseline while the rest of the system was taking shape.
  </br>
  </br>
  Like the rest of the Framework, the complete design is open source. You can build it as published, buy one already assembled, change the clipping options, alter the Sweep range or use the Effect Board as a starting point for something else.
  </br>
  </br>
  It is a reference design. Messing with it is encouraged.


knobs-image: sexyrodent-knobs.png
knobs:
  - name: Volume
    desc: Sets the output level. The available level varies with the selected clipping mode, with LED clipping leaving considerably more output on tap than silicon or germanium.
  - name: Gain
    desc: |
      Sets the gain of the op-amp stage and covers a wide range, from mild overdrive through distortion and into fuzzier territory. Its response interacts with Sweep, since Sweep changes part of the feedback network that determines the stage's frequency-dependent gain.
      </br>
      </br>
      The clipping mode also has a large effect on the result. Lower-threshold diodes reach clipping earlier, while LEDs allow a larger signal swing before the clipping stage starts limiting it.
  - name: Tone
    desc:  |
      Controls the post-clipping low-pass filter. Turning it clockwise lowers the cutoff frequency and removes progressively more high-frequency content.
  - name: Sweep
    desc: |
      Adjusts the frequency response of the op-amp gain stage using a variable implementation of the Ruetz mod. The stock RAT feedback network contains two frequency-dependent branches. Sweep acts on the higher of the two, built around a 47 Ω resistor and 2.2 µF capacitor, with a corner frequency of roughly 1.5 kHz. The control adds up to approximately 1 kΩ in series with that resistor.
      </br>
      </br>
      Fully counter-clockwise gives the stock 47 Ω value. Turning Sweep clockwise increases the resistance and progressively lowers that corner frequency, reaching roughly 70 Hz at the other end of the control. This allows more low-frequency content into the high-gain region of the circuit.
      </br>
      </br>
      Increasing the resistance also reduces the gain contributed by that branch, so Sweep changes the frequency response and gain structure together. This interaction is a large part of the control's range and is worth exploring alongside Gain.
  - name: Clip
    desc: |
      Selects the clipping diodes between silicon, LED and germanium.
      </br>
      </br>
      Silicon gives the familiar stock-style clipping. LEDs have a higher forward voltage, allowing a larger signal swing before clipping and producing more output with less diode compression. Germanium has the lowest clipping threshold of the three, producing earlier clipping, more compression and a lower output level.
      </br>
      </br>
      Since the op-amp gain stage remains unchanged, the switch gives three different responses from the same underlying circuit.


internals:
  - name: Mellow
    desc: Adds a capacitor at the clipping stage to roll off some of the higher-frequency content generated by the distortion. Enable it for a slightly smoother, less aggressive top end.

ioboard:
  - name: Mode
    desc: Sets the power-on state of the pedal. With the DIP switch set to the ON position, the effect starts active.
  - name: Bright
    desc: Adjusts the brightness of the status LED.

using:
  - name: Boost
    desc: |
      Set Clip to LED, leave Sweep fully counter-clockwise, keep Gain fairly low and set Tone to suit the amp. From there, let Volume do the work.
      </br>
      </br>
      LED clipping leaves plenty of output on tap, so this works well for pushing the front end of an amp and letting its preamp provide most of the distortion. There is still enough gain from the Rodent to add some grit and shape the signal before it gets there.
  - name: Fuzz
    desc: |
      Set Clip to silicon, add a small amount of Sweep, turn Gain all the way up and bring Volume back to unity. Tone is, once again, whatever works with the rest of the rig.
      </br>
      </br>
      The small increase in Sweep brings a little more low end into the gain stage without completely changing the familiar RAT response. With Gain maxed, the result gets rougher and fuzzier while keeping enough of that frequency shaping to stop everything collapsing into mush.
  - name: Stoner rock
    desc: |
      Set Clip to LED, bring Sweep fairly high, use a healthy amount of Gain and keep Volume around unity.
      </br>
      </br>
      The higher Sweep setting lets considerably more low end into the distortion while LED clipping gives the signal more room before the diodes start limiting it. There is no need to max the Gain here. Leaving some headroom keeps the result big without immediately turning it into fuzz.
      </br>
      </br>
      Tone to taste. Obviously.
  - name: Two Rodents
    desc: |
      Sexy Rodent also stacks very well with another Sexy Rodent.
      </br>
      </br>
      A lower-gain, higher-output first stage works particularly well for pushing a second one set for distortion or fuzz. The controls give you enough range to make the two stages do quite different jobs, despite starting from the same circuit.

resources:
  - name: hardware
    url: https://github.com/ygn-effects/effect-sexy-rodent/tree/main/pcb
  - name: firmware
    url: https://github.com/ygn-effects/effect-sexy-rodent/tree/main/firmware
---
