---
title: FV-1 Programmer Flashing and Setup
layout: doc
permalink: /docs/fv1-programmer-flashing-and-setup/
updated: 2026-07-01
topic: Firmware
excerpt: Flashing the ATmega328PB firmware and configuring the FT230X on the FV-1 EEPROM programmer.
tags: [firmware, programming, fv1, avr, ftdi]
toc:
  - label: Introduction
    href: "#intro"
  - label: Assembly
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

Welcome to the YGN Effects Framework documentation! The **FV-1 EEPROM Programmer** is a compact tool that sits at the heart of the FV-1 platform: it lets you flash custom DSP effects directly onto your pedal's EEPROM chip right from VS Code via the [vscode-spinasm](https://github.com/ygn-effects/project-fv1-platform/tree/main/software/spinasm) extension, with no chip removal and no external programmer needed once it's set up.

Before it can do any of that, the programmer itself needs two one-time setup steps:

- **Flashing the ATmega328PB:** the onboard microcontroller that drives the programming logic.
- **Configuring the FT230X:** the USB-to-serial bridge whose programmable CBUS pins need to be set correctly for the programmer to communicate with your computer.

These two steps are independent and can be done in any order. Neither requires you to open an IDE or write any code. Let's get set up.

---

## 2. Assembly {#assembly}

Before flashing and configuring anything, a quick word on physically building the programmer.

Populating the PCB follows the same process as our [SMD PCB Assembly](/docs/smd-pcb-assembly/) guide: paste, place, reflow. As with every board in the Framework, we provide a stencil and [stencil holder](/docs/tool-stencil-holder-assembly/) for accurate paste application, and a [soldering jig](/docs/tool-soldering-jig-usage/) to keep the through hole (TH) components perfectly aligned while you hand-solder them.

The programmer's PCB was designed before we had access to a 3D printer, so instead of a printed enclosure, it's meant to be assembled inside an **LK-USB07** enclosure: a small extruded aluminium USB stick style case that's readily available on your favourite far east import site.

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/fv1-programmer-flashing-and-setup/lk-usb07-enclosure.jpg"
       alt="LK-USB07 extruded aluminium enclosure" class="doc-img">
  <img src="/assets/images/docs/fv1-programmer-flashing-and-setup/assembly-complete.jpg"
       alt="Completed FV-1 programmer assembled inside the LK-USB07 enclosure" class="doc-img">
</div>

---

## 3. Required Tools {#tools}

| Item | Purpose | Notes |
|------|---------|-------|
| **AVRISP MK2** | ISP programmer for flashing the ATmega328PB | Any AVR ISP programmer compatible with `avrdude` will work. |
| **SOIC8 test clamp** | Makes contact with the programmer PCB's SOICBite footprint | Any standard SOIC8 test clip with a 2×4 Dupont or box header. |
| **Computer** | Runs `avrdude` and the FT230X configuration tool | Windows, macOS or Linux all work. FT_PROG (GUI) is Windows-only; `ftdi_eeprom` works on all platforms. |

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/fv1-programmer-flashing-and-setup/tools-avrisp.jpg"
       alt="AVRISP MK2 USB programmer" class="doc-img">
  <img src="/assets/images/docs/fv1-programmer-flashing-and-setup/tools-soic-clip.jpg"
       alt="SOIC8 test clip with 2×4 Dupont header" class="doc-img">
</div>

---

## 4. The SOIC Clip {#soic-clip}

The programmer PCB exposes a **SOICBite footprint**. Despite the name, these pads are not a copy of a chip's actual pins: it's a compact layout purpose-built for test clip contact, borrowed from the open-source [SOICbite](https://github.com/SimonMerrett/SOICbite) project, a cheap, small alternative to a Tag-Connect. An SOIC8 test clip grips these pads and gives you a reliable connection without soldering anything extra.

### Adjusting the clip

Because the SOICBite pads are more closely spaced than a real chip's body, a stock SOIC8 test clip usually won't close tightly enough on its own to make good contact. **Bend the clip's contacts slightly inward** so the jaws can close all the way onto the footprint. This is a one-time adjustment: once it's done, the clip stays ready for the SOICBite pattern. See the [SOICbite repo](https://github.com/SimonMerrett/SOICbite) for the how-to on making this adjustment.

> **Tip:** Test the fit on the footprint before you rely on it for flashing. If the jaws don't close fully or feel loose, bend the contacts a little further and try again.

<div class="img-grid cols-1" markdown="0">
  <img src="/assets/images/docs/fv1-programmer-flashing-and-setup/clip-adjusted-contacts.jpg"
       alt="SOIC8 test clip with contacts bent inward to close on the SOICBite footprint" class="doc-img">
</div>

### Clip orientation

SOIC clips are not keyed, so you need to orient them correctly before attaching. **Pin 1** of the footprint is marked with a small dot on the PCB silkscreen. On most SOIC8 clips, **pin 1 is indicated by a coloured wire** in the cable, usually red.

The pin 1 side of the clip **goes on the top side (component side) of the PCB**.

**Align pin 1 of the clip with pin 1 of the footprint**, then press the clip down until it grips the row of pads on both sides.

> **Tip:** It's easy to lose track of which side of the clip is pin 1, especially once it's flipped around in your hands. **Mark that side** with a dab of paint marker or a strip of tape so you can identify it at a glance.

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/fv1-programmer-flashing-and-setup/soic-pin1-marking.jpg"
       alt="SOICBite footprint on the programmer PCB with pin 1 marker highlighted" class="doc-img">
  <img src="/assets/images/docs/fv1-programmer-flashing-and-setup/soic-clip-seated.jpg"
       alt="SOIC8 clip correctly seated on the SOICBite footprint" class="doc-img">
</div>

### Wiring to the AVRISP MK2

The clip's 2×4 header exposes eight pins.

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/fv1-programmer-flashing-and-setup/clip-pinout.jpg"
       alt="SOIC8 clip 2x4 header with pins numbered 1 to 8" class="doc-img">
  <img src="/assets/images/docs/fv1-programmer-flashing-and-setup/box-header-pinout.jpg"
       alt="2x4 box header connector pinout mapped to the clip's pin numbers" class="doc-img">
</div>

Connect them to the AVRISP MK2's standard 6-pin ISP header as follows:

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

> **Note:** Pins 4 and 6 on the clip are not connected. You only need to wire the six active signals.

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/fv1-programmer-flashing-and-setup/avr-isp-pinout.jpg"
       alt="Standard 6-pin AVR ISP header pinout with pin 1 marked" class="doc-img">
  <img src="/assets/images/docs/fv1-programmer-flashing-and-setup/wiring-connected.jpg"
       alt="SOIC clip header wired to the AVRISP MK2 6-pin ISP connector" class="doc-img">
</div>

---

## 5. Flashing the ATmega328PB {#flashing}

### Software

Only `avrdude` is required.

| Platform | Install hint | Test it |
|----------|------------|---------|
| **Linux** | `sudo apt install avrdude` *(Debian/Ubuntu)*<br>`sudo dnf install avrdude` *(Fedora)*<br>`sudo pacman -S avrdude` *(Arch)* | `avrdude -v` should print version info. |
| **macOS** | `brew install avrdude` | Same `avrdude -v` sanity-check. |
| **Windows** | Download the ZIP from the project's **GitHub Releases** page, extract it, and add the folder to your **PATH**. | Open *Windows Terminal* and run `avrdude -v`. |

### Locating the firmware

The pre-built firmware lives in the programmer's repository at:

```
firmware/_output/firmware.hex
```

**Open a terminal** and navigate to that `_output` folder before running the command below.

### Running the flash command

The AVRISP MK2 is accessed directly over USB, so no serial port identification is needed.

> **Caution:** The AVRISP MK2 does not supply power. The ATmega328PB is powered by the target board, so the programmer must be **connected to your pedal's FV-1 target board** (and the board powered on) before you can flash it. See *Connecting the programmer to the target board* in the Tests section below for the header pinout.

1. **Clip** the SOIC8 clip onto the SOICBite footprint as described in the previous section.
2. **Connect** the programmer to your pedal's FV-1 target board via the dedicated header, then **power on** the target board.
3. **Plug** the AVRISP MK2 into your computer.
4. **Run** the command below from the `_output` folder:

```sh
avrdude -p atmega328pb -c stk500v2 -P usb \
  -U lfuse:w:0xFF:m -U hfuse:w:0xD7:m -U efuse:w:0xF5:m \
  -U flash:w:./firmware.hex:i
```

> **Note:** On Linux, you may need to add `-C /etc/avrdude.conf` right after `avrdude` if the command reports a missing configuration file. On macOS and Windows this is not needed.

> **Note:** On Linux, accessing the AVRISP MK2 over USB may require adding your user to the `plugdev` group or setting up a udev rule. Check your distribution's documentation for the right approach.

A successful run ends with:

```
avrdude done.  Thank you.
```

### Troubleshooting

**`avrdude: usbdev_open(): did not find any USB device "usb"`**

The AVRISP MK2 is not being seen over USB. On Linux, add your user to the `plugdev` group or set up a udev rule. On Windows, make sure the Jungo driver is installed (it ships with Atmel Studio / Microchip Studio).

**`avrdude OS error: file ./firmware.hex is not readable: No such file or directory`**

Make sure your terminal is in the `_output` folder before running the command.

**avrdude times out or reports "initialization failed"**

Check that the clip is making firm, even contact with all pads on both sides of the footprint, and that pin 1 is correctly aligned.

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

> **Caution:** Like the ATmega328PB, the FT230X is powered by the target board, not by USB. The programmer must be **connected to your pedal's FV-1 target board** (and the board powered on) before you can configure its EEPROM. See *Connecting the programmer to the target board* in the Tests section below for the header pinout.

1. **Connect** the programmer to your pedal's FV-1 target board via the dedicated header, then **power on** the target board.
2. **Plug** the programmer into your computer via USB.

### Option A: FT_PROG (Windows)

[FT_PROG](https://ftdichip.com/utilities/#ft_prog) is FTDI's free Windows GUI tool for programming FT device EEPROMs.

1. **Download and install** FT_PROG from the FTDI website.
2. **Open** FT_PROG. It will scan and list connected FTDI devices automatically.
3. **Select** your FT230X device from the device tree.
4. **Navigate** to the *Hardware Specific → CBUS Pins* section in the tree.
5. **Set** each CBUS pin to its target function using the dropdown menus.

<div class="img-grid cols-1" markdown="0">
  <img src="/assets/images/docs/fv1-programmer-flashing-and-setup/ft-prog-cbus.jpg"
       alt="FT_PROG showing the CBUS Pins section with CBUS0 to CBUS3 set to their target functions" class="doc-img">
</div>

6. **Click** *Devices → Program* (or press **Ctrl+P**) to write the configuration to the chip.

### Option B: ftdi_eeprom (Linux / macOS)

`ftdi_eeprom` is a command-line tool included in the `libftdi` package.

| Platform | Install hint |
|----------|------------|
| **Linux** | `sudo apt install ftdi-eeprom` *(Debian/Ubuntu)*<br>`sudo dnf install libftdi-devel` *(Fedora)* |
| **macOS** | `brew install libftdi` |

Create a configuration file named `ft230x.conf` with the following content:

```ini
vendor_id=0x0403
product_id=0x6015
max_power=100

cbus0=TXLED
cbus1=TRISTATE
cbus2=VBUS_SENSE
cbus3=RXLED
```

> **Note:** A ready-to-use `ft230x.conf` file is included in the programmer's repository.

Then **run**:

```sh
ftdi_eeprom --flash-eeprom ft230x.conf
```

A successful run will confirm the EEPROM was written without errors.

---

## 7. Tests {#tests}

With both setup steps complete, this is the quick end-to-end check to confirm your programmer is working correctly.

### Connecting the programmer to the target board

**Connect** the programmer to your pedal's FV-1 board using the dedicated header. The pinout is shown below.

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/fv1-programmer-flashing-and-setup/test-connection-pinout.png"
       alt="Schematic showing the programmer header pinout and its connection to the FV-1 target board" class="doc-img">
  <img src="/assets/images/docs/fv1-programmer-flashing-and-setup/test-connection-photo.jpg"
       alt="Programmer connected to the FV-1 target board via the programming header" class="doc-img">
</div>

### Running the auto-detect

1. **Power on** the target board.
2. **Connect** the programmer to your computer via USB.
3. **Open** VS Code with the [vscode-spinasm](https://github.com/yann-ygn/vscode-spinasm) extension installed.
4. **Open** the command palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run **SpinASM: Auto-Detect Programmer**.

<div class="img-grid cols-1" markdown="0">
  <img src="/assets/images/docs/fv1-programmer-flashing-and-setup/test-autodetect.jpg"
       alt="VS Code command palette showing the SpinASM Auto-Detect Programmer command" class="doc-img">
</div>

The extension will scan available serial ports and identify the programmer. Once detected, **flash a sample program** to confirm the full chain is working end to end.

> **Tip:** If the auto-detect doesn't find the programmer, check that the FT230X CBUS pins are configured correctly and that the USB connection is solid. On Linux, you may also need to add your user to the `dialout` group for serial port access.
