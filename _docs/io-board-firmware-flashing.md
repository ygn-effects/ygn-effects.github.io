---
title: IO Board Firmware Flashing
layout: doc
permalink: /docs/io-board-firmware-flashing/
updated: 2026-06-30
topic: Firmware
excerpt: Flashing of the ATTiny micro controller present on the IO Board for bypass operations.
tags: [firmware, pcb, programming]
toc:
  - label: Introduction
    href: "#intro"
  - label: Required tools
    href: "#tools"
  - label: Setup
    href: "#setup"
  - label: Flashing
    href: "#flashing"
  - label: Tests
    href: "#test"
---

## 1. Introduction {#intro}

Welcome to the YGN Effects Framework documentation! Every **YGN IO board** carries a small AVR microcontroller (the ATTiny 202) that handles relay switching, LED states and power-on behaviour. Before the board can do any of that, it needs its **firmware**. This guide walks you through loading it.

You won’t open an IDE or write a single line of code. One copy-and-paste `avrdude` command sets the chip’s fuses and flashes the firmware in about ten seconds. If you can open a terminal, you’re all set.

---

## 2. Required Tools {#tools}

Below is a quick-glance checklist of everything you’ll need:

| Item | Purpose | YGN Notes |
| --- | --- | --- |
| **Serial-UPDI interface** | Bridges your computer’s USB port to the ATTiny 202’s UPDI programming pin. | We use the *Adafruit UPDI Friend* but any serial UPDI interface will work. |
| **3 × 2 pogo-pin probe** <br>(1.27 mm pitch) | Spring-loaded test fixture that presses onto the board’s ICSP pads. | They come in a variety of shapes and forms, pick whatever is easy for you to handle and that comes with some kind of header attached. |

> **Tip:** If you already own a generic USB-to-TTL adapter, you can use it instead. You'll find the wiring information [here](https://github.com/SpenceKonde/AVR-Guidance/blob/master/UPDI/jtag2updi.md).
{: .doc-callout .doc-callout-tip}

<div class="img-grid doc-image-grid cols-2" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/io-board-firmware-flashing/tools-updi-friend.jpg"
     thumb="/assets/images/docs/io-board-firmware-flashing/thumbs/tools-updi-friend.webp"
     alt="Adafruit UPDI Friend USB serial adapter"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/io-board-firmware-flashing/tools-pogo-probe.jpg"
     thumb="/assets/images/docs/io-board-firmware-flashing/thumbs/tools-pogo-probe.webp"
     alt="3×2 pogo-pin probe with 1.27 mm pitch"
     width="1600" height="1200" %}
</div>

---

## 3. Setting-Up the Toolchain {#setup}

### Software

Only `avrdude` is required. It is available through most distribution package managers.

| Platform | Install hint | Test it |
|----------|--------------|---------|
| **Linux** | `sudo apt install avrdude`   *(Debian/Ubuntu)*<br>`sudo dnf install avrdude`   *(Fedora)*<br>`sudo pacman -S avrdude`   *(Arch)* | `avrdude -v` should print version info. |
| **macOS** | `brew install avrdude` | Same `avrdude -v` sanity-check. |
| **Windows** | Download the ZIP from the project’s **GitHub Releases** page → extract → add the folder to your **PATH** (so `avrdude.exe` runs from any prompt). | Open *Windows Terminal* and run `avrdude -v`. |

### 1.27 mm pogo-pin footprint

The ICSP pins are located right under the ATTiny. The pinout is as follows:

<div class="img-grid doc-image-grid cols-2" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/io-board-firmware-flashing/icsp_board_schematic.png"
     thumb="/assets/images/docs/io-board-firmware-flashing/thumbs/icsp_board_schematic.webp"
     alt="ICSP pad layout diagram on the IO board with pin numbering"
     width="800" height="766" %}
  {% include doc-image.html
     full="/assets/images/docs/io-board-firmware-flashing/icsp_board_top.webp"
     thumb="/assets/images/docs/io-board-firmware-flashing/thumbs/icsp_board_top.webp"
     alt="IO board top view showing the ICSP pad location under the ATTiny"
     width="1600" height="1603" %}
</div>

| Pin # | Function | Notes |
|:---:|---------|-------|
| **1** | NC | |
| **2** | **PA0 / UPDI** | One-wire data line |
| **3** | NC | |
| **4** | **+5 V** | Target power from programmer |
| **5** | NC | |
| **6** | **GND** | Target power from programmer |

> **Tip:** Pins 2, 4 & 6 are plated holes. Your pogo probe’s guide posts snap into them and keep everything square while you press.
{: .doc-callout .doc-callout-tip}

### Wiring to the UPDI Friend

The UPDI Friend should be wired this way:

| UPDI Friend pin | Probe pad |
|-----------------|-----------|
| **GND** | **6** |
| **UPDI (D)** | **2** |
| **5 V OUT** | **4** (optional) |

> **Note:** The UPDI Friend supplies power to the ATTiny through the **5 V OUT** connection. Your target board does not need to be powered up or connected to anything else during flashing.
{: .doc-callout .doc-callout-note}

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/io-board-firmware-flashing/setup-updi-wired.jpg"
     thumb="/assets/images/docs/io-board-firmware-flashing/thumbs/setup-updi-wired.webp"
     alt="UPDI Friend wired to the pogo-pin probe with GND, UPDI and 5V connections visible"
     width="1600" height="1200" %}
</div>

---

## 4. Flashing the Firmware {#flashing}

With the toolchain in place and the probe wired up, you're ready to flash.

### Locating the firmware

The `firmware.hex` file lives in the `_output` folder of the firmware directory for your pedal. For the Small IO Board it is at:

```
small/firmware/small-standard-firmware/_output/firmware.hex
```

**Open a terminal** and navigate to that `_output` folder. The flash command references the file as `./firmware.hex`, so your working directory needs to be there.

### Finding your serial port

The port name depends on your operating system. Plug in the UPDI Friend, then identify it:

| Platform | Typical port | How to find it |
|----------|-------------|----------------|
| **Linux** | `/dev/ttyUSB0` or `/dev/ttyACM0` | Run `ls /dev/tty*` before and after plugging in. The new entry is your port. |
| **macOS** | `/dev/tty.usbserial-XXXX` | Same trick: `ls /dev/tty.*` after plugging in. |
| **Windows** | `COM3` (or similar) | Open *Device Manager → Ports (COM & LPT)* after plugging in. |

> **Note:** On Linux, your user account may need special permissions or a udev rule to access the serial port. Check your distribution's documentation for the right approach.
{: .doc-callout .doc-callout-note}

### Running the command

1. **Press** the pogo-pin probe firmly onto the ICSP pads.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/io-board-firmware-flashing/probe-connected.jpg"
     thumb="/assets/images/docs/io-board-firmware-flashing/thumbs/probe-connected.webp"
     alt="Pogo-pin probe pressed onto the ICSP pads on the IO board"
     width="1600" height="1200" %}
</div>

2. **Run** the command below, replacing `/dev/ttyUSB0` with your actual port:

```sh
avrdude -c serialupdi -p t202 -P /dev/ttyUSB0 -b 57600 \
  -U wdtcfg:w:0x00:m \
  -U bodcfg:w:0x00:m \
  -U osccfg:w:0x01:m \
  -U tcd0cfg:w:0x00:m \
  -U syscfg0:w:0xC4:m \
  -U syscfg1:w:0x06:m \
  -U append:w:0x00:m \
  -U bootend:w:0x00:m \
  -U flash:w:./firmware.hex:i
```

> **Note:** On Linux, add `-C /etc/avrdude.conf` right after `avrdude` if the command reports a missing configuration file. On macOS and Windows this flag is not needed.
{: .doc-callout .doc-callout-note}

The command sets all required fuses and flashes the firmware in one pass. You will see avrdude reporting each write and verify operation as it goes. A successful run ends with:

```
avrdude done.  Thank you.
```

### Troubleshooting

**`avrdude OS error: cannot open port /dev/ttyUSB0: Permission denied`**


Your user account doesn't have access to the serial port. On Linux, this typically means you need special permissions or a udev rule. Check your distribution's documentation for the right approach.

**`avrdude OS error: file ./firmware.hex is not readable: No such file or directory`**

The command can't find the firmware file. Make sure your terminal is in the `_output` folder before running the command.

**avrdude times out or reports "initialization failed"**

Check that the probe is making firm, even contact across all six pads. Keep gentle, steady downward pressure throughout the process.

---

## 5. Testing the Flash {#test}

One quick check confirms everything went as planned.

1. **Set** the DIP switch on the IO board to the **ON** position.
2. **Power** the board.
3. **Listen** for a single audible click from the relay as the board initialises.

The click confirms the firmware is running and reading the DIP switch correctly: the board is powering up in its active state as instructed.

> **Note:** With the DIP switch in the **OFF** position, the board powers up in bypass mode and the relay will not click on start-up. Both behaviours are correct. The switch simply sets the power-on default for the finished pedal.
{: .doc-callout .doc-callout-note}

If you hear no click with the switch set to ON, go back and confirm the flash completed without errors, then check your solder joints on the relay footprint.

That's it. Your IO board is programmed and ready to be installed in your build.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/io-board-firmware-flashing/dip-switch-on.jpg"
     thumb="/assets/images/docs/io-board-firmware-flashing/thumbs/dip-switch-on.webp"
     alt="DIP switch on the IO board set to the ON position"
     width="1600" height="1200" %}
</div>

