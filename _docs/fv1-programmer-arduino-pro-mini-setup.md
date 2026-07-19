---
title: Arduino Pro Mini FV-1 Programmer Setup
layout: doc
permalink: /docs/fv1-programmer-arduino-pro-mini-setup/
updated: 2026-07-13
topic: Firmware
excerpt: Set up an Arduino Pro Mini 3.3 V as an FV-1 EEPROM programmer for SpinASM in VS Code.
tags: [firmware, programming, fv1, arduino, eeprom]
toc:
  - label: Introduction
    href: "#intro"
  - label: Required hardware
    href: "#hardware"
  - label: Wiring and power
    href: "#wiring"
  - label: Flash the firmware
    href: "#flashing"
  - label: Tests
    href: "#tests"
  - label: Troubleshooting
    href: "#troubleshooting"
---

## 1. Introduction {#intro}

Welcome to the YGN Effects Framework documentation! An **Arduino Pro Mini 3.3 V** is a simple, low-cost way to program the EEPROM on an FV-1 target board from [SpinASM for VS Code](https://github.com/ygn-effects/project-fv1-platform/tree/develop-software/software/vscode-spinasm) in VS Code.

It runs the same programming protocol as the dedicated [FV-1 EEPROM Programmer](/docs/fv1-programmer-flashing-and-setup/), but replaces the custom board with an Arduino Pro Mini and a separate USB-to-serial adapter. Once it is set up, the extension can detect the programmer, write compiled programs to the target EEPROM and read them back to verify every upload.

This guide supports the **3.3 V 8 MHz ATmega328P Arduino Pro Mini** only, as the FV-1 programming connection is a 3.3 V system.

---

## 2. Required Hardware {#hardware}

Gather the following before you start. The USB-to-serial adapter is required because a Pro Mini has no built-in USB interface.

| Item | Purpose | Notes |
|------|---------|-------|
| **Arduino Pro Mini 3.3 V, 8 MHz** | Runs the FV-1 programmer firmware | Use an ATmega328P version. Do not use a 5 V Pro Mini. |
| **USB-to-serial adapter** | Flashes the Pro Mini and connects it to VS Code | It must use 3.3 V logic and expose TX, RX, GND and DTR. |
| **Computer** | Flashes firmware and runs SpinASM in VS Code | See the SpinASM extension README for software installation. |

<div class="img-grid cols-1" markdown="0">
  <img src="/assets/images/docs/fv1-programmer-arduino-pro-mini-setup/required-hardware.jpg"
       alt="Arduino Pro Mini, 3.3 V USB-to-serial adapter, jumper wires and an FV-1 target board laid out for programming" class="doc-img">
</div>

---

## 3. Wiring and Power {#wiring}

The Pro Mini has two jobs in this guide, and each job has its own wiring and power source. **Flash** its firmware with the USB-to-serial adapter first. Then **disconnect** the adapter's 3.3 V power connection and let the powered target board supply the Pro Mini while you program its EEPROM.

> **Note:** The Pro Mini, target programming header and EEPROM are 3.3 V only. Check the adapter's logic-voltage setting before you connect it. Do not use its 5 V output or connect 5 V serial logic to any part of this setup.

### Wiring for firmware flashing

1. **Set** the USB-to-serial adapter to 3.3 V. This is usually a small jumper that you **move** to the 3.3 V pins, or a switch that you **set** to 3.3 V.

   <div class="img-grid cols-1" markdown="0">
     <img src="/assets/images/docs/fv1-programmer-arduino-pro-mini-setup/adapter-3v3-setting.jpg"
          alt="USB-to-serial adapter jumper set to the 3.3 V logic-voltage position" class="doc-img">
   </div>

2. **Connect** the adapter to the Pro Mini as follows:

   | USB-to-serial adapter | Arduino Pro Mini |
   |-----------------------|------------------|
   | 3.3 V | VCC |
   | GND | GND |
   | TX | RXI |
   | RX | TXO |
   | DTR | GRN / RESET |

3. **Leave** the FV-1 target board disconnected while you flash the Pro Mini firmware.

### Wiring for EEPROM programming

1. **Disconnect** the adapter's 3.3 V and RESET wires from the Pro Mini after flashing. Keep its GND, TX and RX connections in place so VS Code can communicate with the programmer.
2. **Connect** the Pro Mini to the FV-1 target board's dedicated programming header by signal name:

   | Arduino Pro Mini | Target programming header |
   |------------------|---------------------------|
   | A4 / SDA | SDA |
   | A5 / SCL | SCL |
   | D9 | FV-1 RESET |
   | VCC | 3.3 V |
   | GND | GND |

3. **Power on** the target board. It now supplies the Pro Mini and the EEPROM.

> **Note:** Do not let the USB-to-serial adapter and target board power the Pro Mini at the same time. Disconnect the adapter's 3.3 V wire before you power the target board.

<div class="img-grid cols-1" markdown="0">
  <img src="/assets/images/docs/fv1-programmer-arduino-pro-mini-setup/eeprom-programming-wiring.jpg"
       alt="Arduino Pro Mini wired to an FV-1 target board programming header with the target board supplying 3.3 V power" class="doc-img">
</div>

---

## 4. Flash the Programmer Firmware {#flashing}

With the adapter wired to the Pro Mini and set to 3.3 V, you can load the pre-built programmer firmware. This is a one-time setup step.

### Install avrdude

Only `avrdude` is required to flash the firmware.

| Platform | Install hint | Test it |
|----------|--------------|---------|
| **Linux** | `sudo apt install avrdude` *(Debian/Ubuntu)*<br>`sudo dnf install avrdude` *(Fedora)*<br>`sudo pacman -S avrdude` *(Arch)* | `avrdude -v` should print version information. |
| **macOS** | `brew install avrdude` | Run `avrdude -v`. |
| **Windows** | Download the ZIP from the project's GitHub Releases page, extract it and add the folder to your `PATH`. | Open Windows Terminal and run `avrdude -v`. |

### Locate the firmware

The pre-built firmware is provided in the FV-1 programmer repository at: `firmware/_output/pro-mini-firmware.hex`

**Open** a terminal in that `_output` folder before you run the flash command.

### Run the flash command

1. **Connect** the USB-to-serial adapter to the Pro Mini as shown in the previous section.
2. **Plug** the adapter into your computer.
3. **Identify** its serial port. It is commonly a `COM` port on Windows, `/dev/cu.*` on macOS or `/dev/ttyUSB*` on Linux.
4. **Run** the command below, replacing `<serial-port>` with that port name:

```sh
avrdude -p atmega328p -c arduino -P <serial-port> -b 57600 \
  -U flash:w:./pro-mini-firmware.hex:i
```

<div class="img-grid cols-1" markdown="0">
  <img src="/assets/images/docs/fv1-programmer-arduino-pro-mini-setup/firmware-flashing-wiring.jpg"
       alt="3.3 V USB-to-serial adapter wired to an Arduino Pro Mini while the programmer firmware is flashed" class="doc-img">
</div>

A successful run will output:

```
Reading 5428 bytes for flash from input file pro-mini-firmware.hex
Writing 5428 bytes to flash
Writing | ################################################## | 100% 2.66 s
Reading | ################################################## | 100% 2.31 s
5428 bytes of flash verified

Avrdude done.  Thank you.
```

> **Tip:** If `avrdude` cannot open the serial port on Linux, your user account may need access to the `dialout` group or an appropriate udev rule. Check your distribution's documentation for the right approach.

---

## 5. Tests {#tests}

With the firmware flashed, you are ready to test the complete programming path from [SpinASM for VS Code](https://github.com/ygn-effects/project-fv1-platform/tree/develop-software/software/vscode-spinasm) to the target EEPROM.

### Connect the programmer to the target board

1. **Disconnect** the USB-to-serial adapter's 3.3 V wire from the Pro Mini if it is still connected from flashing.
2. **Connect** the Pro Mini to the target board's programming header: A4 to SDA, A5 to SCL, D9 to FV-1 RESET, VCC to 3.3 V and GND to GND.
3. **Connect** the adapter's GND, TX and RX wires to the Pro Mini, then **plug** the adapter into your computer.
4. **Power on** the FV-1 target board. It supplies the Pro Mini and the target EEPROM.

> **Note:** Do not use the adapter's 3.3 V output while the target board is powered. The adapter provides serial communication only during this test.

<div class="img-grid cols-1" markdown="0">
  <img src="/assets/images/docs/fv1-programmer-arduino-pro-mini-setup/test-programmer-connected.jpg"
       alt="Arduino Pro Mini connected to the FV-1 target board programming header with a USB-to-serial adapter connected for communication" class="doc-img">
</div>

### Run auto-detect and check the hardware

1. **Open** your FV-1 project in VS Code with SpinASM for VS Code installed.
2. **Open** the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and run **SpinASM: Auto-Detect Programmer**.
3. **Confirm** that the extension finds the USB-to-serial adapter and selects its serial port.
4. **Run** **SpinASM: Check Hardware Connection** to confirm the compiler, programmer and target EEPROM can communicate.

<div class="img-grid cols-1" markdown="0">
  <img src="/assets/images/docs/fv1-programmer-arduino-pro-mini-setup/test-autodetect.jpg"
       alt="VS Code Command Palette showing the SpinASM Auto-Detect Programmer command" class="doc-img">
</div>

### Compile, upload and verify a program

1. **Open** a sample `.spn` program in your FV-1 project.
2. **Run** **SpinASM: Compile & Upload current program** from the Command Palette or editor title.
3. **Wait** for the upload to complete. SpinASM reads the EEPROM back automatically and compares it with the compiled program.
4. **Confirm** that VS Code reports a successful upload and verification.

> **Tip:** If the test fails, **check** that the target board is powered, the adapter's 3.3 V wire is disconnected and every SDA, SCL, reset and ground connection is firm.

---

## 6. Troubleshooting {#troubleshooting}

### avrdude cannot flash the Pro Mini

**`avrdude` reports a timeout, sync error or cannot open the serial port**

**Check** that you selected the adapter's serial port and that it is not open in another application. **Confirm** that the adapter is set to 3.3 V and that TX connects to RXI, RX connects to TXO, GND connects to GND and DTR connects to GRN / RESET. If your adapter does not reset the Pro Mini automatically, **press** the reset button immediately before you run the command.

### SpinASM cannot detect the programmer

**SpinASM: Auto-Detect Programmer does not find the Pro Mini**

**Confirm** that the target board is powered. During normal programming, the adapter's 3.3 V wire must be disconnected but its GND, TX and RX wires must remain connected. **Check** the TX and RX crossover connections, then run **SpinASM: Select Serial Port...** to choose the adapter manually. On Linux, your user account may need access to the `dialout` group or an appropriate udev rule.

### Hardware check cannot reach the EEPROM

**SpinASM: Check Hardware Connection reports that the EEPROM is unavailable**

**Check** the target board's power first. Then **inspect** every connection between the Pro Mini and programming header: A4 to SDA, A5 to SCL, D9 to FV-1 RESET, VCC to 3.3 V and GND to GND. Keep the wires short and make sure no 5 V supply or logic level reaches the target board.

### Upload or read-back verification fails

**SpinASM uploads a program but reports a verification mismatch**

**Power-cycle** the target board, then **check** the SDA, SCL and ground wires for loose connections. **Run** **SpinASM: Check Hardware Connection** again before retrying the upload. A successful upload is always read back and compared with the compiled program, so do not treat a verification mismatch as a successful programming result.
