---
title: Arduino Pro Mini FV-1 Programmer Setup
layout: doc
permalink: /docs/fv1-programmer-arduino-pro-mini-setup/
updated: 2026-09-06
topic: Firmware
excerpt: Set up a 3.3 V Arduino Pro Mini to program FV-1 EEPROMs with SpinASM for VS Code.
tags: [firmware, programming, fv1, arduino, eeprom]
toc:
  - label: Introduction
    href: "#intro"
  - label: Required hardware
    href: "#hardware"
  - label: Wiring for flashing
    href: "#wiring"
  - label: Flash the firmware
    href: "#flashing"
  - label: Connect and test
    href: "#tests"
  - label: Troubleshooting
    href: "#troubleshooting"
---

## 1. Introduction {#intro}

Welcome to the YGN Effects Framework documentation! This guide will help you turn an **Arduino Pro Mini 3.3 V, 8 MHz with an ATmega328P** into an FV-1 EEPROM programmer. Once configured, it connects your FV-1 target board to [SpinASM for VS Code](/docs/vscode-spinasm-extension-usage/), letting you write compiled DSP programs to the EEPROM that stores your pedal’s programs.

This is an alternative to the dedicated [FV-1 EEPROM Programmer](/docs/fv1-programmer-flashing-and-setup/). Both use the same programming protocol and work with the same extension commands. Here, the Pro Mini runs the programmer firmware and a separate USB-to-serial adapter provides the connection to your computer.

We’ll first use the adapter to power the Pro Mini and load its firmware. Then we’ll change a few connections so the target board supplies power while the adapter handles communication. You don’t need to write any Arduino code: we’ll use a pre-built firmware file and finish with an upload and read-back check to confirm the complete setup works.

> **Note:** This guide supports only the 3.3 V, 8 MHz ATmega328P Pro Mini. The FV-1 programming connection uses 3.3 V power and logic, so do not substitute a 5 V board or adapter logic output.
{: .doc-callout .doc-callout-note}

---

## 2. Required Hardware {#hardware}

Gather the items below before you start. The Pro Mini has no built-in USB interface, so the USB-to-serial adapter is needed both to load its firmware and to communicate with SpinASM afterward.

| Item | Purpose | Notes |
|------|---------|-------|
| **Arduino Pro Mini 3.3 V, 8 MHz** | Runs the FV-1 programmer firmware | Use the ATmega328P version. |
| **USB-to-serial adapter** | Powers the Pro Mini during flashing and connects it to your computer | It must provide 3.3 V power and 3.3 V serial logic, with TX, RX, GND and DTR connections. |
| **Jumper wires** | Connect the adapter, Pro Mini and target board | Choose connector ends that match your boards’ headers. We’ll wire each connection by signal name. |
| **FV-1 target board and its power supply** | Provides the EEPROM to program and powers the Pro Mini during normal use | Use its dedicated programming header with SDA, SCL, FV-1 RESET, 3.3 V and GND. |
| **Computer** | Runs `avrdude` for firmware flashing and SpinASM for EEPROM programming | We’ll cover `avrdude` below. Follow the [SpinASM for VS Code guide](/docs/vscode-spinasm-extension-usage/) for extension installation and project setup. |

Before connecting anything, identify the power and signal labels on both the adapter and Pro Mini. Having those labels visible will make the next section much easier to follow.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-arduino-pro-mini-setup/required-hardware.jpg"
     thumb="/assets/images/docs/fv1-programmer-arduino-pro-mini-setup/thumbs/required-hardware.webp"
     alt="Arduino Pro Mini, 3.3 V USB-to-serial adapter, jumper wires and an FV-1 target board laid out for programming"
     width="1600" height="1200" %}
</div>

---

## 3. Wiring for Firmware Flashing {#wiring}

We’ll start by connecting only the USB-to-serial adapter and Pro Mini. During flashing, the adapter supplies power and carries the firmware from your computer to the Pro Mini. Leave the FV-1 target board disconnected until the firmware has been loaded.

1. **Disconnect** the adapter from USB before making or changing any connections.
2. **Set** the adapter to 3.3 V according to its documentation. Confirm that both its power output and serial logic use 3.3 V.

   > **Caution:** A jumper marked “3.3 V” may select only the adapter’s power output. Check that its TX signal also uses 3.3 V logic before connecting it to the Pro Mini.
   {: .doc-callout .doc-callout-caution}

   <div class="img-grid doc-image-grid cols-1" markdown="0">
     {% include doc-image.html
        full="/assets/images/docs/fv1-programmer-arduino-pro-mini-setup/adapter-3v3-setting.jpg"
        thumb="/assets/images/docs/fv1-programmer-arduino-pro-mini-setup/thumbs/adapter-3v3-setting.webp"
        alt="USB-to-serial adapter jumper set to the 3.3 V logic-voltage position"
        width="1600" height="1200" %}
   </div>

3. **Connect** the adapter to the Pro Mini using the table below. TX means transmit and RX means receive, so each device’s TX connects to the other device’s RX.

   | USB-to-serial adapter | Arduino Pro Mini |
   |-----------------------|------------------|
   | 3.3 V | VCC |
   | GND | GND |
   | TX | RXI |
   | RX | TXO |
   | DTR | DTR programming-header pin, marked GRN on some boards |

   The DTR connection lets the flashing tool reset the Pro Mini automatically to start the upload. On the standard Pro Mini, this header pin connects to reset through an onboard capacitor. Use that programming-header connection, rather than a direct RST or RESET pin.

4. **Check** each connection against the table, especially VCC, GND and the TX/RX crossover. Connect the regulated 3.3 V supply to **VCC**, not RAW.

With the wiring checked, leave USB disconnected for now. Next, we’ll prepare the flashing tool and firmware file before powering the Pro Mini.

---

## 4. Flash the Programmer Firmware {#flashing}

With the wiring ready, we can load the firmware that turns the Pro Mini into an FV-1 programmer. This is a one-time setup step: you won’t need to repeat it when changing your pedal’s DSP programs.

This method uses the Pro Mini’s existing Arduino bootloader, the small program that accepts firmware over its serial connection.

### Install avrdude

We’ll use `avrdude` to write the pre-built firmware. You don’t need the Arduino IDE or a compiler for this step.

| Platform | Installation |
|----------|--------------|
| **Linux** | `sudo apt install avrdude` on Debian/Ubuntu, `sudo dnf install avrdude` on Fedora or `sudo pacman -S avrdude` on Arch. |
| **macOS** | With Homebrew installed, run `brew install avrdude`. |
| **Windows** | Download the Windows package from the [AVRDUDE Releases page](https://github.com/avrdudes/avrdude/releases), extract it and add the folder containing `avrdude.exe` to your `PATH`. |

Open a new terminal and run `avrdude` without arguments. It should display its command-line options. If the command isn’t found, check the installation and `PATH` before continuing. [AVRDUDE installation and usage](https://github.com/avrdudes/avrdude#readme)

### Locate the firmware

The pre-built firmware is provided in the FV-1 platform repository at:

```text
firmware/_output/pro-mini-firmware.hex
```

Download **`pro-mini-firmware.hex`** from the repository’s `main` branch, or locate it in your local checkout. Open a terminal in the folder containing that file. If you downloaded it separately, that can simply be your download folder.

### Run the flash command

1. **Confirm** that the FV-1 target board is still disconnected and the adapter is wired as shown in the previous section.
2. **Plug** the USB-to-serial adapter into your computer. It now powers the Pro Mini.
3. **Identify** the adapter’s serial port. It is commonly `COM3` or another numbered COM port on Windows, `/dev/cu.*` on macOS or `/dev/ttyUSB*` on Linux. Close any serial monitor or other application using that port.
4. **Run** the following command as a single line, replacing `<serial-port>` with the actual port name:

   ```sh
   avrdude -p atmega328p -c arduino -P <serial-port> -b 57600 -U flash:w:./pro-mini-firmware.hex:i
   ```

   For example, on Windows, replace `-P <serial-port>` with `-P COM3` if the adapter appears as COM3.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-arduino-pro-mini-setup/firmware-flashing-wiring.jpg"
     thumb="/assets/images/docs/fv1-programmer-arduino-pro-mini-setup/thumbs/firmware-flashing-wiring.webp"
     alt="3.3 V USB-to-serial adapter wired to an Arduino Pro Mini while the programmer firmware is flashed"
     width="1600" height="1200" %}
</div>

### Confirm the result

`avrdude` writes the firmware, then reads it back to verify that it matches the file. Let both stages finish before disconnecting anything.

A successful run will include output similar to:

```text
Reading 5428 bytes for flash from input file pro-mini-firmware.hex
Writing 5428 bytes to flash
Writing | ################################################## | 100% 2.66 s
Reading | ################################################## | 100% 2.31 s
5428 bytes of flash verified

Avrdude done.  Thank you.
```

The byte count and timings may differ between firmware builds. Look for the message confirming that the flash was **verified**, with no errors.

> **Tip:** If flashing fails, start with the `avrdude` checks in [Troubleshooting](#troubleshooting). A port-access error and a communication timeout need different checks, so keep the error message handy.
{: .doc-callout .doc-callout-tip}

Once verification succeeds, **disconnect** the adapter from USB. The Pro Mini now has its programmer firmware, and we’re ready to change the wiring for the target EEPROM.

---

## 5. Connect and Test the Programmer {#tests}

With the firmware flashed, we’re ready to connect the Pro Mini to the FV-1 target board. From this point on, the target board supplies power to the Pro Mini and EEPROM. The USB-to-serial adapter handles communication with your computer.

### Change over to target-board power

1. **Disconnect** the adapter from USB and **switch off** the target board before changing any wiring.
2. **Disconnect** the adapter’s 3.3 V and DTR wires from the Pro Mini. Keep GND, TX and RX connected as before.

   Removing the adapter’s power connection keeps the two power sources separate. Removing DTR prevents the adapter from resetting the Pro Mini when software opens the serial port.

3. **Connect** the Pro Mini to the target board’s dedicated programming header by signal name:

   | Arduino Pro Mini | Target programming header |
   |------------------|---------------------------|
   | A4 / SDA | SDA |
   | A5 / SCL | SCL |
   | D9 | FV-1 RESET |
   | VCC | 3.3 V |
   | GND | GND |

   The FV-1 RESET connection comes from **D9** on the Pro Mini. It is separate from the Pro Mini’s own reset connection used during firmware flashing.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-arduino-pro-mini-setup/eeprom-programming-wiring.jpg"
     thumb="/assets/images/docs/fv1-programmer-arduino-pro-mini-setup/thumbs/eeprom-programming-wiring.webp"
     alt="Arduino Pro Mini wired to an FV-1 target board programming header with the target board supplying 3.3 V power"
     width="1600" height="1200" %}
</div>

> **Caution:** Leave the adapter’s 3.3 V power wire disconnected during EEPROM programming. Do not connect both power sources to the Pro Mini at the same time.
{: .doc-callout .doc-callout-caution}

### Power up the complete setup

1. **Check** the target connections against the table and confirm that the adapter connects only to GND, RXI and TXO on the Pro Mini.
2. **Power on** the target board. It now supplies the Pro Mini and target EEPROM.
3. **Plug** the USB-to-serial adapter into your computer.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-arduino-pro-mini-setup/test-programmer-connected.jpg"
     thumb="/assets/images/docs/fv1-programmer-arduino-pro-mini-setup/thumbs/test-programmer-connected.webp"
     alt="Arduino Pro Mini connected to the FV-1 target board programming header with a USB-to-serial adapter connected for communication"
     width="1600" height="1200" %}
</div>

### Continue in SpinASM for VS Code

Follow the [Program an EEPROM](/docs/vscode-spinasm-extension-usage/#programming) section of the SpinASM for VS Code guide. Both this Pro Mini setup and the dedicated FV-1 programmer use that same workflow.

Start with auto-detection and the hardware-connection check, then compile and upload a program. Detection confirms that the extension can find the programmer; a successful upload and read-back verification confirms that the complete path to the EEPROM works.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/fv1-programmer-arduino-pro-mini-setup/test-autodetect.jpg"
     thumb="/assets/images/docs/fv1-programmer-arduino-pro-mini-setup/thumbs/test-autodetect.webp"
     alt="VS Code Command Palette showing the SpinASM Auto-Detect Programmer command"
     width="1600" height="1200" %}
</div>

Once the upload passes verification, your programmer is ready to use. Keep this wiring arrangement for future EEPROM uploads.

> **Tip:** If a check fails, use the matching entry in [Troubleshooting](#troubleshooting) below. Disconnect USB and switch off the target board before adjusting any wires.
{: .doc-callout .doc-callout-tip}

---

## 6. Troubleshooting {#troubleshooting}

If something doesn’t work, start with the message reported by `avrdude` or SpinASM. It helps identify whether the problem is reaching the serial port, communicating with the Pro Mini or accessing the target EEPROM.

> **Caution:** Disconnect USB and switch off the target board before changing any wiring. When retrying, use the power arrangement for that stage: adapter power for firmware flashing, target-board power for EEPROM programming.
{: .doc-callout .doc-callout-caution}

### avrdude cannot open the serial port

Check that the port name in the command matches your USB-to-serial adapter. Close any serial monitor or other application that might have the port open, then retry.

On Linux, a permission error may mean your account needs access to the serial device through the appropriate group or udev rule. Follow your distribution’s instructions for serial-port access.

### avrdude reports a timeout or sync error

The flashing tool is not getting the expected response from the Pro Mini’s bootloader.

1. **Disconnect** the adapter from USB.
2. **Check** the flashing connections: adapter 3.3 V to VCC, GND to GND, TX to RXI, RX to TXO and DTR to the Pro Mini’s DTR programming-header pin.
3. **Confirm** that the target board is disconnected, then **reconnect** USB and retry the command.

This procedure assumes the Pro Mini still has its Arduino bootloader and uses the expected 57600 baud upload speed. If the wiring is correct but flashing still fails, check the board supplier’s bootloader information before changing command settings.

### avrdude cannot find the firmware file

Check that your terminal is open in the folder containing `pro-mini-firmware.hex` and that the filename matches the command exactly.

The `./` in `./pro-mini-firmware.hex` means “in the current folder.” If you downloaded the file separately, you can run the command from that download folder.

### SpinASM cannot detect the programmer

Confirm that the target board is powered. During EEPROM programming, it supplies the Pro Mini; the USB adapter alone no longer powers it.

With USB disconnected and the target board switched off, **check** that the adapter’s GND, TX and RX connections remain in place, with TX connected to RXI and RX connected to TXO. Its 3.3 V and DTR wires must both be disconnected.

**Power on** the target board, **reconnect** USB and retry auto-detection. You can also run **SpinASM: Select Serial Port...** to choose the adapter manually, then run **SpinASM: Check Hardware Connection** to test communication. Selecting a port manually does not itself confirm that the programmer responds.

### Hardware check cannot reach the EEPROM

If SpinASM reports that the EEPROM is not ready, check the target board’s power first.

**Disconnect** USB and **switch off** the target board, then **inspect** the programming-header connections: A4 to SDA, A5 to SCL, D9 to FV-1 RESET, VCC to 3.3 V and GND to GND. Keep the wires short and check for loose contacts.

**Power on** the target board, **reconnect** USB and run the hardware check again.

> **Note:** The hardware check also checks the compiler. If the error names the compiler rather than the programmer or EEPROM, follow the [SpinASM for VS Code guide](/docs/vscode-spinasm-extension-usage/) to check the software setup.
{: .doc-callout .doc-callout-note}

### Upload read-back verification fails

A verification mismatch means the data read from the EEPROM does not match the compiled program. Don’t treat that upload as successful.

1. **Disconnect** USB and **switch off** the target board.
2. **Check** the SDA, SCL, FV-1 RESET and ground connections for loose contacts. Confirm that the adapter’s power and DTR wires remain disconnected.
3. **Power on** the target board and **reconnect** USB.
4. Run **SpinASM: Check Hardware Connection**, then retry the upload if the check passes.

If verification still fails, keep the exact error and the SpinASM output log so there’s a clear record of where the operation stopped.
