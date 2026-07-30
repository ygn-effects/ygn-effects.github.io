---
title: FV-1 Programmer Flashing and Setup
layout: doc
permalink: /docs/fv1-programmer-flashing-and-setup/
updated: 2026-07-27
topic: Firmware
excerpt: Flashing the ATmega328PB firmware and configuring the FT230X on the FV-1 EEPROM programmer.
tags: [firmware, programming, fv1, avr, ftdi]
toc:
  - label: Introduction
    href: "#intro"
  - label: Programmer assembly
    href: "#assembly"
  - label: Required tools
    href: "#tools"
  - label: The SOIC clip
    href: "#soic-clip"
  - label: Flashing the ATmega328PB
    href: "#flashing"
  - label: Setting up the FT230X
    href: "#ft230x"
  - label: Tests
    href: "#tests"
---

## 1. Introduction {#intro}

Welcome to the YGN Effects Framework documentation! The **FV-1 EEPROM Programmer** connects an FV-1 target board to [SpinASM for VS Code](/docs/vscode-spinasm-extension-usage/). Once configured, it can write compiled DSP programs directly to the EEPROM in your pedal without removing the chip or transferring it to a standalone EEPROM writer.

Before using the programmer for the first time, complete two one-time setup steps:

1. **Flash the ATmega328PB.** This microcontroller runs the programming logic.
2. **Configure the FT230X.** This USB-to-serial bridge has programmable CBUS pins that must be configured for the programmer hardware.

You can complete these steps in either order. Neither step requires you to open an IDE or write any code. Once both are complete, a quick end-to-end test will confirm that the programmer is ready to use.

---

## 2. Programmer Assembly {#assembly}

Before jumping into flashing and configuration, assemble the programmer PCB by following the [SMD PCB Assembly](/docs/smd-pcb-assembly/) guide. Use the YGN [stencil holder](/docs/tool-stencil-holder-assembly/) for accurate paste application and the [soldering jig](/docs/tool-soldering-jig-usage/) to keep the through-hole components steady while you solder them.

The programmer was designed before we had access to a 3D printer, so its home is an **LK-USB07 ABS enclosure** rather than one of our printed cases. You can usually find one by searching for `LK-USB07` on Chinese online marketplaces such as AliExpress or Banggood.

<div class="img-grid doc-image-grid cols-2" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-flashing-and-setup/lk-usb07-enclosure.jpg"
     thumb="/assets/images/docs/fv1-programmer-flashing-and-setup/thumbs/lk-usb07-enclosure.webp"
     alt="LK-USB07 ABS enclosure for the FV-1 programmer"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-flashing-and-setup/assembly-complete.jpg"
     thumb="/assets/images/docs/fv1-programmer-flashing-and-setup/thumbs/assembly-complete.webp"
     alt="Completed FV-1 programmer assembled inside the LK-USB07 enclosure"
     width="1600" height="1200" %}
</div>

---

## 3. Required Tools {#tools}

Gather the following tools before starting. You will also need a way to power the programmer while flashing the ATmega328PB and configuring the FT230X.

| Item | Purpose | Notes |
|------|---------|-------|
| **AVRISP MK2** | Flashes the ATmega328PB firmware | This guide uses an AVRISP MK2. Other `avrdude`-compatible AVR ISP programmers may work, but their wiring and command options can differ. |
| **SOIC8 test clip** | Makes contact with the programmer PCB's SOICBite footprint | Use a standard SOIC8 test clip with a 2×4 connector. |
| **Clip-to-ISP wiring** | Connects the clip's 2×4 connector to the AVRISP MK2's 2×3 connector | Use eight individual male-to-male jumper wires bundled with a zip tie, or make a 2×4-to-2×3 harness with properly crimped male terminals. Only six wires carry signals. |
| **3.3 V power source** | Powers the programmer during setup | Use a powered FV-1 target board or a bench power supply connected to the programmer's 3.3 V and GND pins. |
| **Computer** | Runs `avrdude` and the FT230X configuration tool | Windows, macOS and Linux are supported. FT_PROG is available for Windows, while `ftdi_eeprom` is covered for Linux and macOS in this guide. |

<div class="img-grid doc-image-grid cols-2" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-flashing-and-setup/tools-avrisp.jpg"
     thumb="/assets/images/docs/fv1-programmer-flashing-and-setup/thumbs/tools-avrisp.webp"
     alt="AVRISP MK2 USB programmer"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-flashing-and-setup/tools-soic-clip.jpg"
     thumb="/assets/images/docs/fv1-programmer-flashing-and-setup/thumbs/tools-soic-clip.webp"
     alt="SOIC8 test clip with 2×4 Dupont header"
     width="1600" height="1200" %}
</div>

---

## 4. The SOIC Clip {#soic-clip}

The programmer PCB uses a **SOICBite footprint** for the ATmega328PB programming connection. This compact connector comes from the open-source [SOICbite](https://github.com/SimonMerrett/SOICbite) project and works with an inexpensive SOIC8 test clip, so the PCB does not need a permanent programming header.

Although the footprint resembles the pins of a SOIC8 chip, its signal arrangement is specific to the SOICBite connection. Follow the orientation and wiring shown below rather than treating it as a standard chip pinout.

### Adjusting the clip

A stock SOIC8 clip may not close tightly enough because the SOICBite pads are closer together than the pins on a real chip. With the clip disconnected, **bend** the contacts on both jaws slightly inward. Work a little at a time and keep both rows even.

**Test-fit** the clip on the footprint. The jaws should close completely with every contact sitting over its pad. If the clip feels loose or rocks on the board, **adjust** the contacts a little further and try again.

> **Caution:** Bend the contacts gently. Bending them too far can weaken or misalign them.
{: .doc-callout .doc-callout-caution}

> **Tip:** Once adjusted, keep this clip for SOICBite connections. You should not need to reshape it again.
{: .doc-callout .doc-callout-tip}

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-flashing-and-setup/clip-adjusted-contacts.jpg"
     thumb="/assets/images/docs/fv1-programmer-flashing-and-setup/thumbs/clip-adjusted-contacts.webp"
     alt="SOIC8 test clip with contacts bent inward to close on the SOICBite footprint"
     width="1600" height="1200" %}
</div>

### Clip orientation

The clip is not keyed, so check its orientation every time you attach it. On the PCB, pin 1 is leftmost on the component side. Most clip cables identify pin 1 with a coloured wire, usually red.

**Position** the pin 1 side of the clip on the top, component side of the PCB. **Align** clip pin 1 with footprint pin 1, then **press** the clip down until both jaws grip the pads evenly.

> **Caution:** Confirm the orientation before applying power. A reversed clip can place power on the wrong pins and damage the hardware.
{: .doc-callout .doc-callout-caution}

> **Tip:** Mark the pin 1 side of the clip with a paint marker or a small piece of tape so you can identify it at a glance.
{: .doc-callout .doc-callout-tip}

<div class="img-grid doc-image-grid cols-2" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-flashing-and-setup/soic-pin1-marking.jpg"
     thumb="/assets/images/docs/fv1-programmer-flashing-and-setup/thumbs/soic-pin1-marking.webp"
     alt="SOICBite footprint on the programmer PCB with pin 1 marker highlighted"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-flashing-and-setup/soic-clip-seated.jpg"
     thumb="/assets/images/docs/fv1-programmer-flashing-and-setup/thumbs/soic-clip-seated.webp"
     alt="SOIC8 clip correctly seated on the SOICBite footprint"
     width="1600" height="1200" %}
</div>

### Wiring to the AVRISP MK2

The clip's 2×4 connector exposes eight positions, but only six carry signals. Connect those signals to the AVRISP MK2's 2×3 ISP connector using either of the methods below.

<div class="img-grid doc-image-grid cols-2" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-flashing-and-setup/clip-pinout.jpg"
     thumb="/assets/images/docs/fv1-programmer-flashing-and-setup/thumbs/clip-pinout.webp"
     alt="SOIC8 clip 2x4 header with pins numbered 1 to 8"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-flashing-and-setup/box-header-pinout.jpg"
     thumb="/assets/images/docs/fv1-programmer-flashing-and-setup/thumbs/box-header-pinout.webp"
     alt="2x4 box header connector pinout mapped to the clip's pin numbers"
     width="1600" height="1200" %}
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-flashing-and-setup/avr-isp-pinout.jpg"
     thumb="/assets/images/docs/fv1-programmer-flashing-and-setup/thumbs/avr-isp-pinout.webp"
     alt="Standard 6-pin AVR ISP header pinout with pin 1 marked"
     width="1600" height="1200" %}
</div>

| Clip pin | Signal | AVRISP MK2 pin |
|:---:|--------|:---:|
| **1** | RST | **5** |
| **2** | 3.3 V | **2** |
| **3** | SCK | **3** |
| **4** | NC | |
| **5** | MISO | **1** |
| **6** | NC | |
| **7** | MOSI | **4** |
| **8** | GND | **6** |

> **Note:** Positions 4 and 6 on the clip connector are not connected.
{: .doc-callout .doc-callout-note}

#### Option A: Individual jumper wires

Use eight male-to-male jumper wires at the clip end. Filling all eight positions allows the zip tie to hold the individual connector housings together as a stable 2×4 block. Only six wires continue to the AVRISP MK2.

1. **Arrange** all eight jumper wires in the correct 2×4 pattern at the clip connector.
2. **Identify** the wires in clip positions 4 and 6. These positions are not connected to the AVRISP MK2.
3. **Cut** the unused AVRISP ends from those two wires, then **insulate** each cut end with heat-shrink tubing.
4. **Connect** the remaining six wires to the AVRISP MK2 according to the wiring table.
5. **Secure** the eight connector housings together near the clip end with a small zip tie.
6. **Mark** pin 1 at both ends so the harness can be reconnected without tracing every wire.

> **Caution:** Make sure the cut wires in positions 4 and 6 are fully insulated. They act only as spacers in the clip-side bundle and must not contact the AVRISP MK2 or exposed metal.
{: .doc-callout .doc-callout-caution}

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-flashing-and-setup/wiring-zip-tied.jpg"
     thumb="/assets/images/docs/fv1-programmer-flashing-and-setup/thumbs/wiring-zip-tied.webp"
     alt="Eight-wire clip bundle with two insulated ends and six wires zip-tied at both ends"
     width="1600" height="1200" %}
</div>

#### Option B: Crimped adapter harness

1. **Cut** six wires to the same length.
2. **Crimp** a male terminal onto both ends of each wire.
3. **Insert** one end into a 2×4 housing and the other into a 2×3 housing according to the wiring table.
4. **Leave** positions 4 and 6 of the 2×4 housing empty.
5. **Check** every connection with a multimeter before connecting the harness to the programmer.

> **Caution:** Connector housings are easy to view from the wrong side. Confirm the pin numbering and check continuity before applying power.
{: .doc-callout .doc-callout-caution}

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-flashing-and-setup/wiring-crimped-harness.jpg"
     thumb="/assets/images/docs/fv1-programmer-flashing-and-setup/thumbs/wiring-crimped-harness.webp"
     alt="Eight-wire crimped harness to six-wire crimped harness adapter"
     width="1600" height="1200" %}
</div>

The adapter can then be used to connect the clip to the AVR ISP.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-flashing-and-setup/wiring-connected.jpg"
     thumb="/assets/images/docs/fv1-programmer-flashing-and-setup/thumbs/wiring-connected.webp"
     alt="Eight-wire clip bundle with two insulated ends and six wires connected to the AVRISP MK2"
     width="1600" height="1200" %}
</div>

---

## 5. Flashing the ATmega328PB {#flashing}

### Software

Only `avrdude` is required. After installing it, **open** a terminal and **run** `avrdude -v` to confirm that the command is available.

| Platform | Install |
|----------|---------|
| **Linux** | `sudo apt install avrdude` *(Debian/Ubuntu)*<br>`sudo dnf install avrdude` *(Fedora)*<br>`sudo pacman -S avrdude` *(Arch)* |
| **macOS** | `brew install avrdude` |
| **Windows** | Download a Windows build from the official [AVRDUDE releases](https://github.com/avrdudes/avrdude/releases), extract it and add the folder containing `avrdude.exe` to your **PATH**. |

### Locating the firmware

The pre-built firmware is available in the FV-1 platform repository at [`firmware/_output/vscode-spinasm-firmware.hex`](https://github.com/ygn-effects/project-fv1-platform/blob/main/firmware/_output/vscode-spinasm-firmware.hex).

**Download** that file or **clone** the repository, then **open** a terminal in the folder containing `vscode-spinasm-firmware.hex`.

### Running the flash command

The AVRISP MK2 is accessed directly over USB, so no serial port identification is needed.

> **Note:** The AVRISP MK2 does not power the programmer. Before flashing, supply **3.3 V** from either a powered FV-1 target board or a bench power supply connected to the programmer's 3.3 V and GND pins. If you use a bench supply, confirm the voltage and polarity before switching it on.
{: .doc-callout .doc-callout-note}

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-flashing-and-setup/programmer-powered-on.jpg"
     thumb="/assets/images/docs/fv1-programmer-flashing-and-setup/thumbs/programmer-powered-on.webp"
     alt="Eight-wire clip bundle with two insulated ends and six wires connected to the AVRISP MK2"
     width="1600" height="1200" %}
</div>

1. **Switch off** the 3.3 V power source and **unplug** the AVRISP MK2 from USB.
2. **Attach** the SOIC8 clip to the SOICBite footprint as described in the previous section.
3. **Connect** the programmer to a powered FV-1 target board, or **connect** a bench power supply to its 3.3 V and GND pins.
4. If you are using a bench supply, **confirm** its voltage and polarity.
5. **Switch on** the 3.3 V power source.
6. **Plug** the AVRISP MK2 into your computer.
7. **Run** the following command from the folder containing the firmware file:

    ```sh
    avrdude -p atmega328pb -c stk500v2 -P usb \
      -U lfuse:w:0xFF:m -U hfuse:w:0xD7:m -U efuse:w:0xF5:m \
      -U flash:w:./vscode-spinasm-firmware.hex:i
    ```

    > **Caution:** These fuse values are specific to the FV-1 programmer hardware. Do not use them when flashing an unrelated ATmega328PB board.
    {: .doc-callout .doc-callout-caution}

8. After the flash completes, **unplug** the AVRISP MK2 and **switch off** the 3.3 V power source before removing the clip.

> **Note:** On Linux, direct USB access to the AVRISP MK2 may require a udev rule or membership in an appropriate device-access group. Check your distribution's documentation if `avrdude` cannot open the programmer.
{: .doc-callout .doc-callout-note}

A successful run finishes without errors and reports that each fuse and the firmware were written and verified. The exact byte count and timing may change between firmware builds.

```
Processing -U lfuse:w:0xFF:m
Reading 1 byte for lfuse from input file 0xFF
Writing 1 byte (0xFF) to lfuse, 1 byte written, 1 verified

Processing -U hfuse:w:0xD7:m
Reading 1 byte for hfuse from input file 0xD7
Writing 1 byte (0xD7) to hfuse, 1 byte written, 1 verified

Processing -U efuse:w:0xF5:m
Reading 1 byte for efuse from input file 0xF5
Writing 1 byte (0xF5) to efuse, 1 byte written, 1 verified

Processing -U flash:w:./vscode-spinasm-firmware.hex:i
Reading 6148 bytes for flash from input file vscode-spinasm-firmware.hex
Writing 6148 bytes to flash
Writing | ################################################## | 100% 1.88 s
Reading | ################################################## | 100% 1.81 s
6148 bytes of flash verified

Avrdude done.  Thank you.
```

### Troubleshooting

**`avrdude: usbdev_open(): did not find any USB device "usb"`**

The AVRISP MK2 is not being detected. On Linux, check your udev rules and device permissions. On Windows, confirm that the installed USB driver is compatible with your `avrdude` package.

**`avrdude OS error: file ./vscode-spinasm-firmware.hex is not readable: No such file or directory`**

Make sure your terminal is in the folder containing `vscode-spinasm-firmware.hex`, then run the command again.

**`avrdude times out or reports "initialization failed"`**

Check that the programmer has 3.3 V power, the clip is oriented correctly and every contact sits firmly on its pad. Then check the clip-to-ISP harness against the wiring table.

---

## 6. Setting Up the FT230X {#ft230x}

The **FT230X** is the USB-to-serial bridge on the programmer. Its four CBUS pins are configurable and need to be set once so the programmer can signal TX and RX activity and detect VBUS correctly.

The target configuration is:

| CBUS pin | Function |
|:---:|---------|
| **CBUS0** | `TXLED` |
| **CBUS1** | `TRISTATE` |
| **CBUS2** | `VBUS_SENSE` |
| **CBUS3** | `RXLED` |

> **Note:** USB does not power the FT230X on this programmer. Supply **3.3 V** from either a powered FV-1 target board or a bench power supply connected to the programmer's 3.3 V and GND pins. If you use a bench supply, confirm the voltage and polarity before switching it on.
{: .doc-callout .doc-callout-note}

1. **Switch off** the 3.3 V power source.
2. **Connect** the programmer to a powered FV-1 target board, or **connect** a bench power supply to its 3.3 V and GND pins.
3. If you are using a bench supply, **confirm** its voltage and polarity.
4. **Switch on** the 3.3 V power source.
5. **Connect** the programmer to your computer via USB.

### Option A: FT_PROG (Windows)

[FT_PROG](https://ftdichip.com/utilities/#ft_prog) is FTDI's free Windows GUI tool for programming FT device EEPROMs.

1. **Download and install** FT_PROG from the FTDI website.
2. **Open** FT_PROG.
3. **Select** *Devices → Scan and Parse* to find the connected FT230X.
4. **Select** the FT230X in the device tree.
5. **Navigate** to *Hardware Specific → CBUS Pins*.
6. **Set** CBUS0 through CBUS3 to the values shown above.
7. **Select** *Devices → Program*, then **confirm** the device programming operation.
8. When programming finishes, **disconnect** USB and **switch off** the 3.3 V power source.
9. **Reconnect** power and USB so the FT230X starts with its new configuration.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-flashing-and-setup/ft-prog-cbus.jpg"
     alt="FT_PROG showing the CBUS Pins section with CBUS0 to CBUS3 set to their target functions" %}
</div>

### Option B: ftdi_eeprom (Linux / macOS)

`ftdi_eeprom` is a command-line tool included in the `libftdi` package.

| Platform | Install hint |
|----------|------------|
| **Linux** | `sudo apt install ftdi-eeprom` *(Debian/Ubuntu)*<br>`sudo dnf install libftdi-devel` *(Fedora)* |
| **macOS** | `brew install libftdi` |

A ready-to-use [`vscode-spinasm-ftdi.conf`](https://github.com/ygn-effects/project-fv1-platform/blob/main/firmware/_output/vscode-spinasm-ftdi.conf) file is available in `firmware/_output/`. **Download** that file, or **create** one with the following content:

```ini
vendor_id="0x0403"
product_id="0x6015"

manufacturer="YGN"
product="vscode-spinasm programmer v1.0"
serial="001"
use_serial=true

max_power=0
self_powered=true
remote_wakeup=false

cbusx0=TXLED
cbusx1=TRISTATE
cbusx2=VBUS_SENSE
cbusx3=RXLED
```

> **Caution:** Disconnect any other FTDI devices before continuing so you do not program the wrong device.
{: .doc-callout .doc-callout-caution}

1. **Open** a terminal in the folder containing `vscode-spinasm-ftdi.conf`.
2. **Run**:

    ```sh
    ftdi_eeprom --flash-eeprom vscode-spinasm-ftdi.conf
    ```
    > **Note:** On Linux, direct serial access to the FT230X may require a udev rule or membership in an appropriate device-access group. Check your distribution's documentation if `ftdi_eeprom` cannot open the serial port.
    {: .doc-callout .doc-callout-note}

3. **Confirm** that the command finishes without errors.

```
FTDI eeprom generator v0.17
(c) Intra2net AG and the libftdi developers <opensource@intra2net.com>
FTDI read eeprom: 0
EEPROM size: 256
Used eeprom space: 240 bytes
FTDI write eeprom: 0
Writing to file: eeprom.bin
FTDI close: 0
```

4. **Disconnect** USB and **switch off** the 3.3 V power source.
5. **Reconnect** power and USB so the FT230X starts with its new configuration.

---

## 7. Tests {#tests}

With the firmware flashed and the FT230X configured, connect the programmer to an FV-1 target board before continuing to the complete SpinASM workflow.

### Connect the programmer to the target board

1. **Switch off** the target board and **disconnect** the programmer from USB.
2. **Disconnect** the bench power supply if it is still attached from the setup process.
3. **Connect** the programmer to the target board's programming header. Match SDA, SCL, FV-1 RESET, 3.3 V and GND as shown below.
4. **Power on** the target board. It now supplies the programmer and target EEPROM.
5. **Connect** the programmer to your computer via USB.

<div class="img-grid doc-image-grid cols-2" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-flashing-and-setup/test-connection-pinout.png"
     alt="Schematic showing the programmer header pinout and its connection to the FV-1 target board" %}
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-flashing-and-setup/test-connection-photo.jpg"
     alt="Programmer connected to the FV-1 target board via the programming header" %}
</div>

### Continue in SpinASM for VS Code

Follow the [Program an EEPROM](/docs/vscode-spinasm-extension-usage/#programming) section of the SpinASM for VS Code guide. Start with its hardware-detection check, then compile and upload a program. A successful upload and read-back verification confirms that the complete programming chain is working.
