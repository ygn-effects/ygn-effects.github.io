---
title: Shining Pig
layout: design
permalink: /designs/shining-pig/
category: Boost
date: 2025-12-23
excerpt: An 18V Power Boost-derived drive built around the clean-to-dirty transition, with a master volume.

images:
  card: /assets/images/designs/shining-pig/card.png
  hero: /assets/images/designs/shining-pig/hero.png
  story_1: /assets/images/designs/shining-pig/story-1.png
  knobs: /assets/images/designs/shining-pig/knobs.png
  ioboard: /assets/images/designs/shining-pig/ioboard.png

story: |
  <strong>There is a spot.</strong>
  </br>
  </br>
  Like a lot of people, we first came across the Colorsound Power Boost through David Gilmour. The original idea made plenty of sense at the time: take an already loud amplifier and hit it with an enormous 18V transistor boost until something gives. Having tried one into a dimed 50W Plexi, we are quite happy leaving the DR103 experiment to somebody else.
  </br>
  </br>
  Shining Pig is our take on the 18V Power Boost circuit, although outright volume is not really the part we find most interesting.
  </br>
  </br>
  There is a narrow region on the Gain control where the transistor stages sit right on the transition between clean and dirty. Set it there and the circuit becomes extremely responsive to the input signal. Softer playing stays largely clean while harder notes push it into distortion, adding a little hair around the signal without completely taking it over.
  </br>
  </br>
  We wanted more control around that transition.
  </br>
  </br>
  The original 10k linear Gain control packs most of its useful range into a very small part of the pot travel. Reducing the value to 1k makes the control considerably easier to use, then the taper decides where that extra resolution goes. A 1k reverse-log pot gives finer control over the more distorted part of the range. We use a 1k linear pot instead, giving us more room around the clean-to-dirty transition while still leaving plenty of gain beyond it.
  </br>
  </br>
  We also added a master Volume control. The original circuit can produce a frankly unreasonable amount of output, particularly when pushed into distortion. Separating gain from final output level means we can sit on that transition without requiring the rest of the rig to participate in a volume experiment.
  </br>
  </br>
  The circuit still runs at 18V, generated from a standard 9V supply by the Framework IO Board. The active Bass and Treble controls are retained too, giving plenty of range to shape what reaches the later transistor stages.
  </br>
  </br>
  The Power Boost has existed in plenty of forms over the years, which makes it a particularly good fit for the YGN Framework. Shining Pig represents the choices we made for the behaviour we wanted. They do not have to be yours.
  </br>
  </br>
  The complete design is open source. Change the gain taper, alter the EQ, build a 9V version, change the transistor biasing or turn it into something else entirely.
  </br>
  </br>
  There are enough Power Boost revisions already. One more will be fine.

knobs:
  - name: Volume
    desc: |
      Sets the final output level.
      </br>
      </br>
      This is a master volume added after the original circuit, allowing Gain and output level to be adjusted independently. The Power Boost can produce a considerable amount of level, so this makes its more distorted settings much easier to use without also hitting whatever comes next quite so hard.
  - name: EQ (Bass / Treble)
    desc: |
      A two-band active EQ based on the Baxandall topology.
      </br>
      </br>
      Both controls can boost or cut broad frequency ranges and their responses overlap through part of the midrange, so they interact more than a typical passive guitar tone control. Small adjustments can have a fairly large effect, particularly once the circuit is being pushed into distortion.
      </br>
      </br>
      Starting with both controls around noon is sensible. What happens after that is between you and your amplifier.
  - name: Gain
    desc: |
      Controls the gain of the transistor stages using a 1k linear pot.
      </br>
      </br>
      The original circuit used a 10k linear control, which concentrates most of the useful change into a very small part of its travel. Reducing the value to 1k spreads that range out considerably.
      </br>
      </br>
      The taper then determines which part of the response gets the most control. A 1k reverse-log pot gives finer adjustment once the circuit is already distorting. We chose 1k linear instead, which leaves the first part of the control fairly quiet but gives much better resolution around the transition from clean to dirty.
      </br>
      </br>
      That transition is where we tend to leave it.


internals:
ioboard:
  - name: Mode
    desc: Sets the power-on state of the pedal. With the DIP switch set to the ON position, the effect starts active.
  - name: Bright
    desc: Adjusts the brightness of the status LED.

using:
  - name: The spot
    desc: |
      This is how we use Shining Pig most of the time.
      </br>
      </br>
      Start with Bass and Treble around noon and bring Gain up slowly until the circuit is just beginning to distort. Set Volume for the level you need, then adjust the EQ to suit the instrument and amp.
      </br>
      </br>
      Around that transition, picking dynamics do most of the work. Play softly and the signal remains largely clean. Dig in and the transistor stages start clipping, adding a little hair around harder notes. There is a fairly small range where this happens, which is exactly why we chose the 1k linear Gain control.
      </br>
      </br>
      Once you find it, moving the Gain control by a surprisingly small amount can make a big difference.
  - name: As a boost
    desc: |
      Keep Gain lower and use Volume to push the next stage.
      </br>
      </br>
      Running at 18V gives the circuit plenty of output before it gets heavily distorted, while the active EQ lets you decide which part of the signal gets pushed harder. Into an already loud valve amp this can become rather effective rather quickly.
      </br>
      </br>
      Use whatever hearing protection seems appropriate for the poor decisions involved.
  - name: Straight into the pickups
    desc: |
      With nothing buffered in front of it, higher Gain settings can push Shining Pig into fuzzier territory with strong interaction from the guitar's volume control.
      </br>
      </br>
      The circuit responds directly to the pickups in this position, which gives those settings much more of the cleanup and feel associated with early transistor fuzz circuits.
      </br>
      </br>
      We rarely use it this way, but it is there if you want it.

resources:
  - name: hardware
    url: https://github.com/ygn-effects/effect-shining-pig/tree/main/pcb
  - name: firmware
    url: https://github.com/ygn-effects/effect-shining-pig/tree/main/firmware
---
