---
title: IO Board Firmware Flashing
layout: doc
permalink: /docs/io-board-firmware-flashing/
updated: 2026-08-21
topic: Firmware
excerpt: Flash firmware onto a YGN IO Board using the Small IO Board as a worked example.
tags: [firmware, programming, io-board, updi]
toc:
  - label: Introduction
    href: "#intro"
  - label: Required tools and materials
    href: "#tools"
  - label: Software setup
    href: "#software"
  - label: Preparing the UPDI connection
    href: "#connection"
  - label: Flashing the firmware
    href: "#flashing"
  - label: Testing the board
    href: "#tests"
---

## 1. Introduction {#intro}

Welcome to the YGN Effects Framework documentation! YGN **IO Boards** use a small AVR microcontroller to handle relay switching, LED states and power-on behaviour. Before the board can do any of that, it needs its **firmware**. This guide explains how to load it through the UPDI programming interface.

The **Small IO Board** is the worked example in this guide. Its firmware is built for an ATtiny202 and its `avrdude` command includes configuration values for this board. Other IO Board variants may use different firmware files, pin assignments or programming values, so treat these Small IO Board steps as an example rather than a universal command.

You won’t open an IDE or write a single line of code. Once `avrdude` is installed and the UPDI connection is prepared, one command writes the board configuration and firmware. If you can open a terminal and follow the pin markings, you’re all set.

---

## 2. Required Tools and Materials {#tools}

Gather these items before you start. The two harness options do the same job, so choose the one that suits your build.

| Item | Purpose | YGN Notes |
| --- | --- | --- |
| **Assembled IO Board** | Target board to program. | This guide uses the Small IO Board as its example. Keep the 2×3 programming footprint accessible. |
| **Adafruit UPDI Friend** | Connects your computer to the ATtiny202's UPDI interface. | This guide uses the UPDI Friend with its adjustable 3 V/5 V selector. |
| **2×3 pogo-pin probe** <br>(1.27 mm pitch) | Makes spring-loaded contact with the board's programming footprint. | Use a probe that has a 2×3 connector on its harness side. |
| **UPDI harness** | Connects the UPDI Friend to the pogo probe. | Choose either a 1×3 female-to-2×3 female harness used with the included JST SH-to-male-Dupont lead, or a three-pin female JST PH-to-2×3 female box-header harness with a PH connector soldered to the board. |
| **Red paint marker** | Marks pin 1 on the probe and harness. | Use matching dots so you can check the orientation at a glance. |
| **Computer with `avrdude`** | Runs the programming command. | Software installation is covered in the next section. |

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

## 3. Software Setup {#software}

Only `avrdude` is required for this guide. Install it for your platform, then verify that your terminal can run it before you connect the board.

| Platform | Install hint |
|----------|--------------|
| **Linux** | `sudo apt install avrdude` *(Debian/Ubuntu)*<br>`sudo dnf install avrdude` *(Fedora)*<br>`sudo pacman -S avrdude` *(Arch)* |
| **macOS** | `brew install avrdude` |
| **Windows** | Download a Windows build from the official [AVRDUDE releases](https://github.com/avrdudes/avrdude/releases), extract it and add the folder containing `avrdude.exe` to your `PATH`. |

### Verify the installation

1. **Open** a terminal.
2. **Run** `avrdude -v`.

The command should print the installed version and configuration information. If your terminal cannot find `avrdude`, finish the platform-specific installation or `PATH` setup before continuing.

---

## 4. Preparing the UPDI Connection {#connection}

The Small IO Board exposes its UPDI connection on a 2×3 programming footprint located under the ATtiny202. The board labels this area **ICSP**, but this guide uses it as a UPDI connection.

### Pinout and orientation

The footprint carries three active connections. The other three positions are unused:

<div class="img-grid doc-image-grid cols-2" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/io-board-firmware-flashing/icsp_board_schematic.jpg"
     thumb="/assets/images/docs/io-board-firmware-flashing/thumbs/icsp_board_schematic.webp"
     alt="2×3 UPDI programming footprint on the IO board with pin numbering"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/io-board-firmware-flashing/icsp_board_top.jpg"
     thumb="/assets/images/docs/io-board-firmware-flashing/thumbs/icsp_board_top.webp"
     alt="Small IO Board top view showing the 2×3 programming footprint under the ATtiny202"
     width="1600" height="1200" %}
</div>

| Footprint pin | Function | Harness connection |
|:---:|---------|-------|
| **1** | NC | Leave unconnected |
| **2** | **PA0 / UPDI** | **UPDI** |
| **3** | NC | Leave unconnected |
| **4** | **+5 V** | **PWR** |
| **5** | NC | Leave unconnected |
| **6** | **GND** | **GND** |

1. **Find** the pin 1 marking on the board footprint. It is clearly visible beside the connector pattern.
2. **Mark** pin 1 on the pogo probe with a small red paint dot.
3. **Mark** the pin 1 side of the 2×3 harness connector with the same red dot.
4. **Align** the two red dots before you connect the probe to the board.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/io-board-firmware-flashing/orientation-pogo-probe.jpg"
     thumb="/assets/images/docs/io-board-firmware-flashing/thumbs/orientation-pogo-probe.webp"
     alt="2×3 pogo-pin probe and harness connector with matching red pin 1 paint dots"
     width="1600" height="1200" %}
</div>

> **Note:** The unused positions make an accidental reverse connection non-destructive. It will not create a working UPDI connection, so still align the red marks before powering the programmer.
{: .doc-callout .doc-callout-note}

### Choosing a harness

Both harness options carry the same three connections: **UPDI**, **PWR** and **GND**. Choose the option that best suits the UPDI Friend you have.

#### Option A: Use the included JST SH lead

The UPDI Friend includes a pre-wired JST SH lead that ends in male Dupont pins. Make a 1×3 female-to-2×3 female adapter to connect that lead to the pogo probe.

1. **Assemble** the 1×3 female and 2×3 female 2.54 mm housings with three conductors according to the pinout table above.
2. **Leave** positions 1, 3 and 5 of the 2×3 housing empty. Only positions 2, 4 and 6 connect to the board.
3. **Mark** the pin 1 side of both housings with a red paint dot.
4. **Plug** the male Dupont pins from the included JST SH lead into the 1×3 female housing.
5. **Plug** the 2×3 female housing onto the pogo probe's 2×3 header.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/io-board-firmware-flashing/harness-sh-adapter.jpg"
     thumb="/assets/images/docs/io-board-firmware-flashing/thumbs/harness-sh-adapter.webp"
     alt="1×3 female to 2×3 female adapter connected to the UPDI Friend's JST SH-to-male-Dupont lead"
     width="1600" height="1200" %}
</div>

#### Option B: Add a JST PH connector

At YGN, JST PH is our go-to connector, so if you have already assembled one of our boards you may have a few spares in your parts bin. The UPDI Friend has exposed **UPDI**, **PWR** and **GND** pads beside its included JST SH connector. You can solder a JST PH header to those pads and make a matching three-wire harness.

> **Tip:** The exposed solder pads are spaced at 2.54 mm. A JST PH connector uses 2.0 mm spacing, so it needs a little gentle “convincing” to sit properly on the pads. That is fine for this connection as long as the connector is aligned and soldered securely.
{: .doc-callout .doc-callout-tip}

> **Note:** A JST XH connector can also be fitted to these exposed pads. Remove the original JST SH connector first, though, since the SH and XH connectors will not fit side by side.
{: .doc-callout .doc-callout-note}

1. **Solder** a three-pin JST PH header to the exposed **UPDI**, **PWR** and **GND** pads on the UPDI Friend.
2. **Assemble** a three-pin female JST PH-to-2×3 female box-header harness according to the pinout table above.
3. **Leave** positions 1, 3 and 5 of the 2×3 housing empty.
4. **Mark** the pin 1 side of both housings with a red paint dot.
5. **Plug** the female PH connector onto the new board-mounted PH header.
6. **Plug** the 2×3 female box header onto the pogo probe.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/io-board-firmware-flashing/harness-ph-adapter.jpg"
     thumb="/assets/images/docs/io-board-firmware-flashing/thumbs/harness-ph-adapter.webp"
     alt="JST PH connector soldered to the UPDI Friend with a female PH-to-2×3 harness attached"
     width="1600" height="1200" %}
</div>

### Check the voltage and connection

1. **Set** the UPDI Friend's voltage selector to **5 V** before powering it on.
2. **Check** that the selector is visibly in the **5 V** position.
3. **Use** a multimeter to confirm continuity from **UPDI** to pogo position **2**, **PWR** to position **4** and **GND** to position **6**.
4. **Check** that **PWR** and **GND** are not shorted together.
5. **Connect** the selected harness to the UPDI Friend and the pogo probe.

> **Caution:** Do not power the UPDI Friend until the voltage selector, connector orientation and harness continuity have all been checked.
{: .doc-callout .doc-callout-caution}

<div class="img-grid doc-image-grid cols-2" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/io-board-firmware-flashing/setup-updi-voltage.jpg"
     thumb="/assets/images/docs/io-board-firmware-flashing/thumbs/setup-updi-voltage.webp"
     alt="Adafruit UPDI Friend voltage selector set to 5 V"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/io-board-firmware-flashing/setup-updi-wired.jpg"
     thumb="/assets/images/docs/io-board-firmware-flashing/thumbs/setup-updi-wired.webp"
     alt="UPDI Friend connected to the pogo probe through the harness with the pin 1 marks visible"
     width="1600" height="1200" %}
</div>

---

## 5. Flashing the Firmware {#flashing}

With the toolchain in place and the probe wired up, you're ready to flash. The command below is for the Small IO Board: it configures the ATtiny202 and writes its firmware in one pass. Other IO Board variants may require a different firmware file, device name or configuration command.

### Locating the firmware

The Small IO Board's `firmware.hex` file is in the `_output` folder of its firmware directory:

```
small/firmware/small-standard-firmware/_output/firmware.hex
```

**Open a terminal** and navigate to that `_output` folder. The flash command references the file as `./firmware.hex`, so your working directory needs to be there. For another IO Board variant, use the firmware output folder and command values provided for that variant.

### Finding your serial port

The port name depends on your operating system. After the connection checks are complete, **plug** the UPDI Friend into your computer, then identify it:

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

The command sets all required fuses and flashes the firmware in one pass. You will see avrdude reporting each write and verify operation as it goes. A successful run looks like:

```
Processing -U wdtcfg:w:0x00:m
Reading 1 byte for fuse0/wdtcfg from input file 0x00
Writing 1 byte (0x00) to fuse0/wdtcfg, 1 byte written, 1 verified

Processing -U bodcfg:w:0x00:m
Reading 1 byte for fuse1/bodcfg from input file 0x00
Writing 1 byte (0x00) to fuse1/bodcfg, 1 byte written, 1 verified

Processing -U osccfg:w:0x01:m
Reading 1 byte for fuse2/osccfg from input file 0x01
Writing 1 byte (0x01) to fuse2/osccfg, 1 byte written, 1 verified

Processing -U tcd0cfg:w:0x00:m
Reading 1 byte for fuse4/tcd0cfg from input file 0x00
Writing 1 byte (0x00) to fuse4/tcd0cfg, 1 byte written, 1 verified

Processing -U syscfg0:w:0xC4:m
Reading 1 byte for fuse5/syscfg0 from input file 0xC4
Writing 1 byte (0xC4) to fuse5/syscfg0, 1 byte written, 1 verified

Processing -U syscfg1:w:0x06:m
Reading 1 byte for fuse6/syscfg1 from input file 0x06
Writing 1 byte (0x06) to fuse6/syscfg1, 1 byte written, 1 verified

Processing -U append:w:0x00:m
Reading 1 byte for fuse7/append from input file 0x00
Writing 1 byte (0x00) to fuse7/append, 1 byte written, 1 verified

Processing -U bootend:w:0x00:m
Reading 1 byte for fuse8/bootend from input file 0x00
Writing 1 byte (0x00) to fuse8/bootend, 1 byte written, 1 verified

Processing -U flash:w:./firmware.hex:i
Reading 1435 bytes for flash from input file firmware.hex
Writing 1435 bytes to flash
Writing | ################################################## | 100% 1.42 s 
Reading | ################################################## | 100% 0.50 s 
1435 bytes of flash verified

Avrdude done.  Thank you.
```

### Troubleshooting

**`avrdude OS error: cannot open port /dev/ttyUSB0: Permission denied`**

Your user account doesn't have access to the serial port. On Linux, this typically means you need special permissions or a udev rule. Check your distribution's documentation for the right approach.

**`avrdude OS error: file ./firmware.hex is not readable: No such file or directory`**

The command can't find the firmware file. Make sure your terminal is in the `_output` folder before running the command.

**`avrdude times out or reports "initialization failed"`**

Check that the probe is making firm, even contact across all six pads. Keep gentle, steady downward pressure throughout the process.

---

## 6. Testing the Flash {#tests}

The relay click is a useful board-only sanity check, but it does not test the complete IO path. For a full test, connect an effect board to the IO Board. The effect board carries the footswitch and status LED that the firmware controls.

### Basic IO Board check

1. **Set** the DIP switch on the IO board to the **ON** position.
2. **Power** the IO Board through its normal supply connection.
3. **Listen** for a single audible click from the relay as the board initialises.

The click confirms the firmware is running and reading the DIP switch correctly. With the DIP switch in the **OFF** position, the board powers up in bypass mode and the relay will not click on start-up. Both behaviours are correct.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/io-board-firmware-flashing/dip-switch-on.jpg"
     thumb="/assets/images/docs/io-board-firmware-flashing/thumbs/dip-switch-on.webp"
     alt="DIP switch on the IO Board set to the ON position"
     width="1600" height="1200" %}
</div>

> **Note:** This basic check does not verify the footswitch, LED or the connection between the IO Board and effect board. Use the complete test below when you have an effect board available.
{: .doc-callout .doc-callout-note}

### Complete functional test

1. **Disconnect** the UPDI Friend from the IO Board.
2. **Connect** an assembled effect board, including its footswitch and status LED, to the IO Board.
3. **Set** the IO Board DIP switch to the **ON** position.
4. **Power** the pedal through its normal power input.
5. **Press** the footswitch and verify that the relay clicks and the LED changes state. **Press** it again and confirm that the relay and LED return to their previous states.
6. **Power-cycle** the pedal with the DIP switch in the **OFF** position and confirm that it starts in bypass mode.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/io-board-firmware-flashing/test-effect-board-connected.jpg"
     thumb="/assets/images/docs/io-board-firmware-flashing/thumbs/test-effect-board-connected.webp"
     alt="IO Board connected to an effect board with the footswitch and status LED plugged in and the LED lit"
     width="1600" height="1200" %}
</div>

If the relay or LED does not respond as expected, first confirm that the flash completed without errors. Then check the effect-board connector, footswitch wiring, LED wiring and solder joints around the relay.

### Optional production test fixture

For repeated builds, make a removable test harness that plugs into the IO Board's normal effect-board connector and provides a footswitch and LED. Nothing else is required for this fixture. It is especially useful for larger production runs, while an assembled effect board is usually the simplest option for a one-off build.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/io-board-firmware-flashing/test-fixture-connected.jpg"
     thumb="/assets/images/docs/io-board-firmware-flashing/thumbs/test-fixture-connected.webp"
     alt="Production test harness with its footswitch and LED plugged into the IO Board"
     width="1600" height="1200" %}
</div>

The test harness wiring is intentionally simple:

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/io-board-firmware-flashing/test-fixture-wiring.jpg"
     thumb="/assets/images/docs/io-board-firmware-flashing/thumbs/test-fixture-wiring.webp"
     alt="Wiring diagram for the IO Board test harness with a footswitch and LED"
     width="1600" height="1200" %}
</div>

| Pin | Usage |
|----------|--------------|
| **1** | Footswitch |
| **2** | Footswitch |
| **3** | LED Anode |
| **4** | LED Cathode |

Once the appropriate test passes, the IO Board is programmed and ready to install in the build.
