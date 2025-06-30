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
  I could bore you to death with an history lesson on the Rat, its many incarnations and all its legendary users but, for that, there’s Wikipedia. Instead, you’ll find below an excerpt from Art Thompson’s book “The Stompbox: (…)” that can be found on pages 125-126. The quoted text is from Scott Burnham, designer of the Rat:<br>

  <blockquote class="quote">
    I was dabbling in modifying pedals, trying to come up with something of my own because I didn’t really like anything that was out there. I liked bits and pieces of different things. The idea for the Rat was to have an input buffer first, then an op-amp to crank it way up. The signal would then be rammed across a couple of parallel diodes that clipped the hell of out it, then sent it through a FET to smooth things out.<br><br>
    I had the basic circuit roughed together and i’d found an op-amp I liked, the LM308N, which was an instrumentation amp used for seismic and medical sensors. I was experimenting with an EQ boost for this op-amp in order to pre-boost the treble so I could use just a passive tone control to cut back the highs. I was bypassing the voltage divider that sets the gain I picked up a resistor, looked at it and thought to myself, “Yellow, violet, brown - thats 470ohm.” I plugged it in expecting to get about 50dB of gain, but when I picked up my strat and hit a string , it went wooooo. I thought, “Holy shit, this is cool. What did I do?”<br><br>
    I looked real closely and realised that I’d plugged a 47ohm resistor instead of a 470ohm resistor. That meant it had somewhere around 70db of gain, which, according to it’s spec sheet was impossible from that op-amp. Trying to set the gain on this thing I had stumbled across a combination of resistors that produced this really weird high-frequency shelving boost that the op-amp couldn’t possibly sustain. It didn’t have enough slew rate to produce that much gain at those frequencies so it drove the op-amp into incredible slewing distortion. This usually is very bad, but in this case it gave the Rat it’s yeowl - I’ve never heard any other stompbox make that sound.”
  </blockquote>

  And, well, that’s about it really. From this happy accident in the late 70’s to countless use in many legendary records to appearing in Blur’s “Song 2” video and thru the many different versions of the design, it’s still rocking 40 years later. That’s as classic as it gets for an effect pedal.
  The Sexy Rodent is built on this legacy, staying true to the original circuit’s topology while picking options from the various embodiment the pedal had and incorporating popular mods. The Sexy Rodent is designed to unleash the full potential of this awesome effect.
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
  - name: Gain and clipping
    desc: |
      Think of the clipping selector as an amplitude limiter, that's all it does really. The lower the clipping threshold (in that order Ge < Si < LED), the more compressed the signal becomes while also lowering the output volume.<br>
      Now let's say i'm playing a high headroom clean amp i would go for a lower threshold (Ge or Si) to get all that saturated goodness out of the pedal. On the other hand, with a dirty or slightly broken up amp i could go with the highest clipping threshold (LED) to get a better dynamic response out of my playing, raise the output volume and drive my pre-amp tubes harder. In that case the pedal would add its character to the amp of my choice.
  - name: Frequency response
    desc: |
      Pretty basically, the stock Rat frequency response is very much "Tube Screamer like", emphasizing the mids while severely cutting the lows and giving you some control over the highs. The Sexy Rodent goes a bit farther than that.<br>
      The Tone knob on the Sexy Rodent is similar to the Rat's : it's a backward guitar tone control. It will filter out more and more highs as it goes clockwise, nothing magic about it. It's a set to taste thing.<br>
      The Sweep control is more interesting, unlike a basic tone control, it will work by changing the frequency response of the gain stage. As i mentioned the stock circuit favors the mids and highs while severely cutting the lower frequencies, the Sweep control allows you to change that behavior and bring more bass in.
  - name: Stacking
    desc: |
      Hell yeah, the Sexy Rodent loves stacking! Put a mid-hump pedal (Tube Screamer, Blues Breaker...) in front of it to tighten up that low end even more. Stack it into some kind of MIAB to add its signature to your sound, use it as an overdrive in front a mid-scooped Fuzz (any kind of Big Muff)... The possibilities are endless!
---
