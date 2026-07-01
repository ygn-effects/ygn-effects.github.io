---
title: FV-1 Programmer Flashing and Setup
layout: doc
permalink: /docs/fv1-programmer-flashing-and-setup/
updated: 2026-06-30
topic: Firmware
excerpt: Flashing the ATmega328PB firmware and configuring the FT230X on the FV-1 EEPROM programmer.
tags: [firmware, programming, fv1, avr, ftdi]
toc:
  - label: Introduction
    href: "#intro"
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

Welcome to the YGN Effects Framework documentation! The **FV-1 EEPROM Programmer** is a compact tool that sits at the heart of the FV-1 platform: it lets you flash custom DSP effects directly onto your pedal's EEPROM chip right from VS Code via the [vscode-spinasm](https://github.com/yann-ygn/vscode-spinasm) extension, with no chip removal and no external programmer needed once it's set up.

Before it can do any of that, the programmer itself needs two one-time setup steps:

- **Flashing the ATmega328PB:** the onboard microcontroller that drives the programming logic.
- **Configuring the FT230X:** the USB-to-serial bridge whose programmable CBUS pins need to be set correctly for the programmer to communicate with your computer.

These two steps are independent and can be done in any order. Neither requires you to open an IDE or write any code. Let's get set up.

---

## 2. Required Tools {#tools}

| Item | Purpose | Notes |
|------|---------|-------|
| **AVRISP MK2** | ISP programmer for flashing the ATmega328PB | Any AVR ISP programmer compatible with `avrdude` will work. |
| **SOIC8 clip** | Makes contact with the programmer PCB's SOICBite footprint | Any standard SOIC8 test clip with a 2×4 Dupont header. |
| **Computer** | Runs `avrdude` and the FT230X configuration tool | Windows, macOS or Linux all work. FT_PROG (GUI) is Windows-only; `ftdi_eeprom` works on all platforms. |

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/fv1-programmer-flashing-and-setup/tools-avrisp.jpg"
       alt="AVRISP MK2 USB programmer" class="doc-img">
  <img src="/assets/images/docs/fv1-programmer-flashing-and-setup/tools-soic-clip.jpg"
       alt="SOIC8 test clip with 2×4 Dupont header" class="doc-img">
</div>

---

## 3. The SOIC Clip {#soic-clip}

The programmer PCB exposes a **SOICBite footprint**: a set of pads laid out to match the legs of a standard SOIC8 chip. An SOIC8 test clip grips these pads and gives you a reliable connection without soldering anything extra.

### Clip orientation

SOIC clips are not keyed, so you need to orient them correctly before attaching. **Pin 1** of the footprint is marked with a small dot or triangle on the PCB silkscreen. **Pin 1 of the clip** is typically indicated by a marking on the clip body or a coloured wire on the cable.

**Align pin 1 of the clip with pin 1 of the footprint**, then press the clip down until it grips the row of pads on both sides.

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/fv1-programmer-flashing-and-setup/soic-pin1-marking.jpg"
       alt="SOICBite footprint on the programmer PCB with pin 1 marker highlighted" class="doc-img">
  <img src="/assets/images/docs/fv1-programmer-flashing-and-setup/soic-clip-seated.jpg"
       alt="SOIC8 clip correctly seated on the SOICBite footprint" class="doc-img">
</div>

### Wiring to the AVRISP MK2

The clip's 2×4 header exposes eight pins. Connect them to the AVRISP MK2's standard 6-pin ISP header as follows:

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

<div class="img-grid cols-1" markdown="0">
  <img src="/assets/images/docs/fv1-programmer-flashing-and-setup/soic-wiring.jpg"
       alt="SOIC clip header wired to the AVRISP MK2 6-pin ISP connector" class="doc-img">
</div>

---

## 4. Flashing the ATmega328PB {#flashing}

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

1. **Clip** the SOIC8 clip onto the SOICBite footprint as described in the previous section.
2. **Plug** the AVRISP MK2 into your computer.
3. **Run** the command below from the `_output` folder:

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

## 5. Setting Up the FT230X {#ft230x}

The **FT230X** is the USB-to-serial bridge on the programmer. Its four CBUS pins are configurable and need to be set once so the programmer can signal TX and RX activity and detect VBUS correctly.

The target configuration is:

| CBUS pin | Function |
|:---:|---------|
| **CBUS0** | `TXLED` |
| **CBUS1** | `TRISTATE` |
| **CBUS2** | `VBUS_SENSE` |
| **CBUS3** | `RXLED` |

**Plug the programmer into your computer via USB** before proceeding.

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

## 6. Tests {#tests}

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
