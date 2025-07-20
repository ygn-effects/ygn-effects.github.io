---
title: IO Board Firmware Flashing
layout: doc
permalink: /docs/io-board-firmware-flashing/
updated: 2025-07-18
topic: Firmware
excerpt: Flashing of the ATTiny micro controller present on the IO Board for bypass operations.
tags: [firmware, pcb, programming]
toc:
  - label: Introduction
    href: "#intro"
  - label: Required tools
    href: "#setup"
  - label: Setup
    href: "#setup"
  - label: Flashing
    href: "#flashing"
  - label: Tests
    href: "#test"
---

## 1. Introduction {#intro}

Every **YGN IO board** carries a tiny AVR brain (ATTiny 202) that takes care of relay switching, LED states, and power-on state.
All that silicon needs is the right **firmware**—and loading it is easier than soldering a jack.

### No coding, just one command
You won’t open an IDE or write a single line of C++. Instead, you’ll use **`avrdude`**, the rock-solid command-line utility that ships with most AVR toolchains. One copy-and-paste command will:

1. Configure the chip’s fuses (clock, brown-out, etc.).
2. Flash the supplied .hex file.
3. Verify the upload.

If you can open a terminal and press **Enter**, you’re golden.

### What you’ll learn

- How to grab the correct firmware bundle for your pedal.
- Connecting the pogo-pin probe to the board’s ICSP pads.
- Running a single `avrdude` line that sets fuses **and** flashes firmware in ~10 s.
- Basic troubleshooting if the upload is interrupted.

By the end, your IO board will be talking, switching, and blinking exactly as the design intended—without ever opening an IDE.

---

### 2. Tools & Adapters {#tools}

Below is a quick‑glance checklist of everything you’ll need:

| Item | Purpose | YGN Notes |
| --- | --- | --- |
| **Serial-UPDI interface** | Bridges your computer’s USB port to the ATTiny 202’s UPDI programming pin. | We use the *Adafruit UPDI Friend* but any serial UPDI interface will work. |
| **3 × 2 pogo-pin probe** <br>(1.27 mm pitch) | Spring-loaded test fixture that presses onto the board’s ICSP pads. | They come in a variety of shapes and forms, pick whatever is easy for you to handle and that comes with some kind of header attached. |

> **Tip:** If you already own a generic USB-to-TTL adapter, you can use it instead. You'll find the wiring information [here](https://github.com/SpenceKonde/AVR-Guidance/blob/master/UPDI/jtag2updi.md).

---

## 3. Setting-Up the Toolchain {#setup}

### Software

Only `avrdude` is required, it is generally available with most distributions package manager.

| Platform | Install hint | Test it |
|----------|--------------|---------|
| **Linux** | `sudo apt install avrdude`   *(Debian/Ubuntu)*<br>`sudo dnf install avrdude`   *(Fedora)*<br>`sudo pacman -S avrdude`   *(Arch)* | `avrdude -v` should print version info. |
| **macOS** | `brew install avrdude` | Same `avrdude -v` sanity-check. |
| **Windows** | Download the ZIP from the project’s **GitHub Releases** page → extract → add the folder to your **PATH** (so `avrdude.exe` runs from any prompt). | Open *Windows Terminal* and run `avrdude -v`. |

### Hardware

##### 1.27 mm pogo-pin footprint

The ICSP pins are located right under the ATTiny, the pinout is as follows:

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/io-board-firmware-flashing/icsp_board_top.png" alt="" class="doc-img">
  <img src="/assets/images/docs/io-board-firmware-flashing/icsp_board_top.webp" alt="" class="doc-img quart">
</div>

| Pin # | Function | Notes |
|:---:|---------|-------|
| **1** | GND | Thru-hole, also serves as *alignment post* |
| **2** | GND | — |
| **3** | **PA0 / UPDI** | One-wire data line |
| **4** | GND | — |
| **5** | +5 V | Target power from programmer (optional) |
| **6** | GND | Thru-hole, *alignment post* |

> **Tip:** Pins 1 & 6 are plated holes—your pogo probe’s guide posts snap into them and keep everything square while you press.

##### Wiring to the UPDI Friend

The UPDI Friend should be wired this way:

| UPDI Friend pin | Probe pad |
|-----------------|-----------|
| **GND** | 1, 2, 4 **or** 6 (any ground) |
| **UPDI (D)** | **3** |
| **5 V OUT** | **5** (optional) |

---

