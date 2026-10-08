---
title: SpinASM for VS Code
layout: doc
permalink: /docs/vscode-spinasm-extension-usage/
updated: 2026-10-08
topic: Software
excerpt: Write, compile and upload FV-1 effects with SpinASM for VS Code on Windows, macOS and Linux.
tags: [firmware, programming, fv1, spinasm, vscode, eeprom]
toc:
  - label: Introduction
    href: "#intro"
  - label: Install and configure
    href: "#installation"
  - label: Understand the project layout
    href: "#project-layout"
  - label: Work with SpinASM files
    href: "#spn-files"
  - label: Compile programs and EEPROM images
    href: "#compiling"
  - label: Program an EEPROM
    href: "#programming"
  - label: Command reference
    href: "#commands"
  - label: Settings reference
    href: "#settings"
  - label: Troubleshooting
    href: "#troubleshooting"
---

## 1. Introduction {#intro}

This guide covers the software side of the FV-1 platform: writing SpinASM programs, assembling them into EEPROM files and loading them onto a pedal.

**SpinASM for VS Code** is a Visual Studio Code extension for `.spn` source files on Windows, macOS and Linux. It adds syntax highlighting, completion, live diagnostics and resource tracking, and drives the open-source [`asfv1`](https://pypi.org/project/asfv1/) assembler to build your programs.

The workflow has three stages, and you can stop after any of them:

1. **Write** a `.spn` program, with the editor catching mistakes as you type.
2. **Assemble** it into a file for one of the EEPROM's eight program slots, or into a complete EEPROM image.
3. **Program** the EEPROM directly from VS Code with a compatible programmer.

Only the last stage needs hardware, so you can learn the language and build programs with nothing on the bench.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/extension-overview.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/extension-overview.webp"
     alt="VS Code with a SpinASM program open, inline diagnostics and FV-1 bank and resource usage shown in the status bar"
     width="1440" height="1080" %}
</div>

## 2. Install and Configure {#installation}

You need two pieces: the extension for editing, and `asfv1` to turn your source into code the FV-1 can run.

| Item | Needed for |
|------|------------|
| **Visual Studio Code 1.95 or newer** | Running the extension |
| **SpinASM for VS Code** | Editing, compiling and programming |
| **Python 3 and `asfv1`** | Compiling programs and EEPROM images |
| **A compatible programmer** (optional) | Writing the EEPROM from VS Code |

### Install the extension

1. Open the **Extensions** view (`Ctrl+Shift+X`, or `Cmd+Shift+X` on macOS).
2. Search for `@id:ygn-effects.vscode-spinasm` and install **SpinASM for VS Code** from YGN Effects.
3. Open any `.spn` file. The language indicator in the lower-right corner should read **SpinASM**.

A warning that the compiler path isn't configured is expected at this point; you'll set it once `asfv1` is installed.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/extension-install.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/extension-install.webp"
     alt="VS Code Extensions view showing SpinASM for VS Code installed from the YGN Effects publisher"
     width="1024" height="768" %}
</div>

### Install asfv1

`asfv1` is a Python package. Install it for your user account, then check that your terminal can run it.

**Windows** (PowerShell):

1. Check for Python with `py --version`. If the command is missing, install Python 3 from [python.org](https://www.python.org/downloads/windows/) and open a new PowerShell window.
2. Install the assembler:

   ```powershell
   py -m pip install --user asfv1
   ```

3. Check that it runs: `Get-Command asfv1.exe`. If it's found, you're done. If not, `pip` printed a warning naming the Python `Scripts` folder that holds `asfv1.exe`; note that full path for the next step.

**macOS and Linux** (terminal):

1. Check for Python and `pip` with `python3 -m pip --version`. If it's missing, install Python 3 from [python.org](https://www.python.org/downloads/macos/) on macOS, or your distribution's `python3` and `python3-pip` packages on Linux.
2. Install the assembler:

   ```sh
   python3 -m pip install --user asfv1
   ```

3. Check that it runs: `command -v asfv1`. If nothing is printed, it was installed outside your `PATH`: look in the `bin` folder of the location printed by `python3 -m site --user-base` and note the full path to `asfv1`.

> **Tip:** On some Linux distributions `pip` stops with an `externally-managed-environment` error. Install [`pipx`](https://pipx.pypa.io/stable/how-to/install-pipx.html) from your package manager and run `pipx install asfv1` instead.
{: .doc-callout .doc-callout-tip}

### Configure the compiler path

1. Open **Settings** (`Ctrl+,`, or `Cmd+,` on macOS) and search for `SpinASM`.
2. In `spinasm.compiler.path`, enter `asfv1` if your terminal found it by name, or the full path you noted otherwise. Don't add quotation marks, even if the path contains spaces.
3. Leave `spinasm.compiler.args` at its default, `["-s"]`.

The first compile in [section 5](#compiling) confirms that VS Code can launch the assembler.

> **Caution:** The `-s` argument makes `asfv1` read the literals `1` and `2` the way SpinASM does. Removing it changes the meaning of existing SpinASM source, so keep it unless you have a specific reason not to.
{: .doc-callout .doc-callout-caution}

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/compiler-settings.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/compiler-settings.webp"
     alt="VS Code Settings showing the SpinASM compiler path and default compiler arguments"
     width="1024" height="768" %}
</div>

## 3. Understand the Project Layout {#project-layout}

An FV-1 EEPROM holds eight programs. The extension maps those slots to folders named `bank_0` to `bank_7`: the folder decides which slot a program goes into, so the file name is free to describe the effect.

```
my-fv1-project/
├── bank_0/
│   └── chorus.spn
├── bank_1/
│   └── delay.spn
├── bank_2/
│   └── reverb.spn
├── bank_3/ … bank_7/
└── output/
    ├── bank_0.hex
    ├── bank_1.hex
    ├── bank_2.hex
    └── output.bin
```

Compiled files land in `output`: one `bank_N.hex` per program, and `output.bin` when you build a complete EEPROM image. The folder starts empty and fills as you compile.

### Create a new project

1. Open an empty folder in VS Code (**File > Open Folder**).
2. Run **SpinASM: Create Project** from the Command Palette (`Ctrl+Shift+P`, or `Cmd+Shift+P` on macOS).

The command creates the eight bank folders, the `output` folder and a starter `program.spn` in each bank. It doesn't need the compiler, and it leaves existing folders and files alone. Rename each starter file after the effect you plan to put there, and delete it from any bank you want to leave empty.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/project-layout.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/project-layout.webp"
     alt="VS Code Explorer showing an FV-1 project with eight bank folders and the output folder"
     width="1024" height="768" %}
</div>

### Open an existing project

Open the folder that contains the `bank_N` folders, not an individual bank. Missing bank folders, and folders without a `.spn` file, count as empty banks.

### One program per bank

Keep a single `.spn` file in each bank folder. If a bank holds several, the extension builds the first one in alphabetical order and flags the bank as ambiguous, which may not be the program you meant. Keep alternate versions and experiments outside the `bank_N` folders.

### Read the bank status

The status bar shows the state of all eight banks:

| Symbol | Meaning |
|:---:|---------|
| `-` | Empty bank |
| `✗` | Source not compiled yet |
| `✓` | Compiled output is up to date |
| `⚠` | Source changed since the last compile |

Click the indicator (or run **SpinASM: Show Bank Status**) for the detailed list. Selecting a bank opens its source and offers to compile it if its output is missing or out of date.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/bank-status.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/bank-status.webp"
     alt="SpinASM bank status list showing empty, uncompiled, current and stale program banks"
     width="1024" height="768" %}
</div>

## 4. Work with SpinASM Files {#spn-files}

Each `.spn` file is one FV-1 program. Everything in this section works without a compiler or programmer, so it's the place to study existing effects or sketch new ones.

### Create a program

Create a `.spn` file inside the bank folder you want, for example `bank_0/passthrough.spn`, and enter a first program. This one sends the left input straight to the left output:

```html
; Left-channel passthrough
rdax ADCL, 1.0
wrax DACL, 0.0
```

Save it, and the bank indicator shows `✗`: the source exists but hasn't been compiled yet.

### Completion and snippets

As you type, the extension suggests instructions, registers, condition flags and the symbols declared in the current file, each with its signature and a short description. Pick a suggestion, then press `Tab` to move between its operands. If the list doesn't open on its own, press `Ctrl+Space` (on macOS, use your **Trigger Suggest** shortcut, as `Ctrl+Space` often switches input source).

Every instruction has a snippet, and a few larger ones cover common structures:

| Prefix | Inserts |
|--------|---------|
| `fxstart` | A mono effect skeleton with one-time initialisation, ADC input and DAC output |
| `skprun` | A run-once initialisation block using the `RUN` condition |
| `adcsetup` | Reads of both ADC inputs |
| `dacwrite` | Writes to both DAC outputs |
| `allpass` | An all-pass delay section using `RDA` and `WRAP` |
| `lpf` | A first-order low-pass filter using `RDFX` and `WRAX` |

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/editor-completion.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/editor-completion.webp"
     alt="SpinASM instruction completion in VS Code showing an instruction signature and description"
     width="1024" height="768" %}
</div>

### Inspect instructions and symbols

Hover over an instruction, register or flag to see its signature and purpose. Hovering also works on your own symbols: `EQU` constants and register aliases, `MEM` delay-memory blocks and jump labels. Press `F12` (or `Ctrl+Click`, `Cmd+Click` on macOS) on one of them to jump to its definition in the same file.

### Live diagnostics

The extension checks the file shortly after you stop typing and every time you save. Problems are underlined in the editor and listed in the **Problems** view (`Ctrl+Shift+M`, or `Cmd+Shift+M` on macOS), where selecting one jumps to its line. The checks catch:

- malformed `EQU` and `MEM` declarations
- unknown instructions, and duplicate or undefined symbols
- missing operands or commas
- coefficients outside their valid range
- programs over the instruction or delay-memory limits

These checks give you quick feedback, but `asfv1` has the final word: its warnings and errors appear in the same Problems view when you compile.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/editor-diagnostics.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/editor-diagnostics.webp"
     alt="SpinASM source in VS Code with an inline error and the matching explanation in the Problems view"
     width="1280" height="960" %}
</div>

### Watch resource usage

An FV-1 program has three hard limits: 32 registers, 128 instructions and 32,768 samples of delay memory. The `R`, `I` and `M` values in the status bar track them for the file you're editing (`M` is rounded), and turn to a warning or critical state as you approach a limit. Click them (or run **SpinASM: Show Resource Usage**) to see every register alias, the remaining instructions and each `MEM` block.

Note that this indicator answers a different question from the bank indicator: it tells you whether the current program *fits*, while the bank indicator tells you whether the project's outputs are up to date.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/resource-usage.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/resource-usage.webp"
     alt="SpinASM resource usage view showing registers, instructions and delay-memory allocation for the active program"
     width="1024" height="768" %}
</div>

## 5. Compile Programs and EEPROM Images {#compiling}

Compiling (or assembling) turns your source into the 32-bit instructions the FV-1 runs. There are two kinds of output:

- **`bank_N.hex`**: one program in Intel HEX format, addressed to its slot. This is what the programmer uploads.
- **`output.bin`**: a raw 4 KB image of the whole EEPROM, for other programming tools or manufacturing.

Save your changes before compiling: the extension refuses to build a program whose editor has unsaved changes, so it never compiles a version you aren't looking at.

### Compile the current program

1. Open the `.spn` file and save it.
2. Run **SpinASM: Compile current program**, click the checkmark button in the editor title or press `Ctrl+Alt+B`.

When the success message appears, `output/bank_N.hex` exists and the bank indicator shows `✓`. If the compile fails, the **SpinASM** output channel opens with `asfv1`'s message, and the error is also underlined in the source.

> **Tip:** Keep the SpinASM output channel (**View > Output**, then **SpinASM**) open while you're learning. Seeing which line produces which `asfv1` message teaches you the assembler's rules quickly.
{: .doc-callout .doc-callout-tip}

<div class="img-grid doc-image-grid cols-2" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/compile-current.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/compile-current.webp"
     alt="VS Code after compiling the active SpinASM program with its HEX output and current bank status visible"
     width="1280" height="960" %}
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/compile-error.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/compile-error.webp"
     alt="Compiler output in the SpinASM output channel showing up on compile error"
     width="1280" height="960" %}
</div>

### Compile the whole project

Run **SpinASM: Compile all programs** to build every populated bank in order, skipping empty ones. It stops at the first bank that fails, so fix that source and run it again.

### Build a complete EEPROM image

Run **SpinASM: Compile all programs to .bin** when another tool needs the whole EEPROM as one file. The extension compiles each populated bank into its 512-byte slot, fills empty slots with `0x00` and writes the 4 KB result to `output/output.bin`. It doesn't create or refresh the individual `.hex` files.

> **Caution:** `output.bin` covers all eight slots, empty ones included. Writing it with another tool replaces every program on the EEPROM.
{: .doc-callout .doc-callout-caution}

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/combined-image.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/combined-image.webp"
     alt="VS Code Explorer showing individual bank HEX files and the combined 4 KB output.bin EEPROM image"
     width="1280" height="960" %}
</div>

## 6. Program an EEPROM {#programming}

With a program compiling cleanly, you can write it to the EEPROM on your target board straight from VS Code. Two programmer designs are supported, and both use the same commands:

- the **YGN FV-1 EEPROM Programmer**: see [FV-1 Programmer Flashing and Setup](/docs/fv1-programmer-flashing-and-setup/)
- a **3.3 V Arduino Pro Mini** with a USB-to-serial adapter: see [Arduino Pro Mini FV-1 Programmer Setup](/docs/fv1-programmer-arduino-pro-mini-setup/)

Finish your programmer's setup guide first; it covers the wiring and power. This section covers the VS Code side.

### Connect and check the hardware

1. Connect the programmer to the target board as its setup guide shows, and power the board. Both programmers run from the target's 3.3 V supply.
2. Connect the programmer to your computer and open your project in VS Code.
3. Run **SpinASM: Auto-Detect Programmer**. It probes your serial ports and saves the first one that answers. If it finds nothing, or you have several serial devices connected, use **SpinASM: Select Serial Port...** instead.
4. Run **SpinASM: Check Hardware Connection**. It checks the whole chain (compiler, programmer and EEPROM) and reports **Compiler and Programmer are connected and ready!** when everything answers.

The serial port is saved as a machine setting, so it stays out of your project files.

> **Caution:** Keep 5 V power and 5 V serial logic away from the programming connection. The EEPROM, the programming header and the Arduino Pro Mini all work at 3.3 V.
{: .doc-callout .doc-callout-caution}

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/programmer-autodetect.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/programmer-autodetect.webp"
     alt="VS Code reporting that SpinASM automatically detected and configured an FV-1 programmer serial port"
     width="1024" height="768" %}
</div>

### Compile, upload and verify one bank

For everyday work, use **Compile & Upload current program**: it rebuilds the source, writes only that program's 512-byte slot and checks the result.

1. Open the `.spn` file and save it.
2. Run **SpinASM: Compile & Upload current program**, click the lightning-bolt button in the editor title or press `Ctrl+Alt+U`.
3. Keep the board powered and connected until the success message appears.

After writing, the extension reads the 512 bytes back and compares them with the compiled program, so a success message means the data on the EEPROM is verified. The other seven slots are left untouched, which lets you iterate on one effect without rebuilding the rest.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/upload-verified.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/upload-verified.webp"
     alt="VS Code reporting a successful SpinASM compile, EEPROM upload and read-back verification"
     width="1024" height="768" %}
</div>

### Other banks and upload-only commands

**Compile & Upload Specific Bank...** lets you pick a bank without opening its source, and **Compile & Upload all programs** rebuilds, writes and verifies every populated bank. Empty banks are skipped, so their contents on the EEPROM stay as they were.

The **Upload** commands skip compiling and send the existing `.hex` files. Before uploading, they check each bank's output: if it's missing or older than its source, you're offered **Compile & Upload** instead (or **Upload Anyway**, when an older output exists and you really want the previous version).

Compile, upload and hardware commands run one at a time. If you start one while another is running, it waits for the first to finish.

## 7. Command Reference {#commands}

Type `SpinASM` in the Command Palette to list the commands. Current-program commands appear only while a `.spn` editor is active.

### Project and status

| Command | What it does |
|---------|--------------|
| **Create Project** | Adds `bank_0` to `bank_7`, a starter `program.spn` in each and `output` to the open folder. Keeps existing files. |
| **Show Bank Status** | Lists the eight banks with their state, including ambiguous banks. Selecting one opens its source and offers to compile it. |
| **Show Resource Usage** | Registers, instructions and delay memory used by the active `.spn` file. |
| **Show Configuration** | Shows the compiler path, serial port and baud rate, with a button to open the settings. Doesn't test them. |
| **Check Hardware Connection** | Tests the compiler, the programmer's response and the EEPROM. Needs the hardware connected. |

### Programmer selection

| Command | What it does |
|---------|--------------|
| **Auto-Detect Programmer** | Probes the serial ports at the configured baud rate and saves the first one that answers. Doesn't check the EEPROM. |
| **Select Serial Port...** | Lists serial ports with their manufacturer and USB IDs, and saves your choice. Doesn't test it. |

### Compile

| Command | Output |
|---------|--------|
| **Compile current program** | `bank_N.hex` for the active or selected file |
| **Compile Specific Bank...** | `bank_N.hex` for the bank you pick |
| **Compile all programs** | `bank_N.hex` for every populated bank; stops at the first failure |
| **Compile all programs to .bin** | `output.bin` only, with empty slots filled with `0x00` |

### Upload

All uploads write the selected 512-byte slots and verify them by read-back. Empty banks are skipped.

| Command | What it does |
|---------|--------------|
| **Compile & Upload current program** | Rebuilds and uploads the active or selected program |
| **Compile & Upload Specific Bank...** | Rebuilds and uploads the bank you pick |
| **Compile & Upload all programs** | Rebuilds and uploads every populated bank |
| **Upload current program** | Uploads the existing `.hex`; offers to compile it first if it's missing or out of date |
| **Upload Specific Bank...** | Same, for the bank you pick |
| **Upload all programs** | Same, for every populated bank |

### Buttons, menus and shortcuts

| Where | Actions |
|-------|---------|
| Editor title | Compile current program, Compile & Upload current program |
| Editor and Explorer context menus on a `.spn` file | Compile, Compile & Upload, Upload current program |
| Bank status indicator | Show Bank Status |
| Resource indicator | Show Resource Usage |
| `Ctrl+Alt+B` | Compile current program |
| `Ctrl+Alt+U` | Compile & Upload current program |

Menu actions apply to the file you clicked; Command Palette and shortcut actions apply to the active editor.

## 8. Settings Reference {#settings}

Search for `SpinASM` in **Settings** to see all seven options. Set the compiler path and serial port at the **User** level, as they belong to the machine rather than the project.

<div class="table-responsive" markdown="1">

| Setting | Default | What it changes |
|---------|---------|-----------------|
| `spinasm.compiler.path` | Empty | The `asfv1` command: a bare name found on your `PATH`, such as `asfv1`, or a full path. No quotation marks. Needed to compile, not to upload existing output. |
| `spinasm.compiler.args` | `["-s"]` | Arguments passed to `asfv1` before the file names. `-s` gives SpinASM-compatible handling of the literals `1` and `2`. |
| `spinasm.programmer.serialPort` | Empty | Port used for uploads and hardware checks, for example `COM3`, `/dev/cu.usbserial-*` or `/dev/ttyUSB0`. Set by auto-detect or manual selection. |
| `spinasm.programmer.baudRate` | `57600` | Serial speed. Must match the programmer firmware; leave it at `57600` with the supplied firmware. |
| `spinasm.editor.compileOnSave` | `false` | Compiles a bank's `.hex` whenever you save its source in the editor. Doesn't build `output.bin` or upload. |
| `spinasm.statusBar.enabled` | `true` | Shows the eight-bank indicator. The resource indicator stays visible either way. |
| `spinasm.logging.verbose` | `false` | Adds every serial message to the SpinASM output channel. Turn it on only while diagnosing programmer problems. |

</div>

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/all-settings.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/all-settings.webp"
     alt="VS Code Settings filtered to SpinASM and showing all compiler, programmer, editor, status-bar and logging options"
     width="1280" height="960" %}
</div>

> **Caution:** Changing the baud rate in VS Code doesn't change the programmer's firmware. If the two don't match, they can't communicate.
{: .doc-callout .doc-callout-caution}

## 9. Troubleshooting {#troubleshooting}

Start from the exact message VS Code shows. The **SpinASM** output channel (**View > Output**, then **SpinASM**) has the full log of every operation.

### The file isn't recognised as SpinASM

**No highlighting, completion or status indicators.** Check that the file name ends in `.spn` and that the language indicator in the lower-right corner reads **SpinASM** (click it to change it). For project commands, open the folder containing the `bank_N` folders, not a single file.

### Compiler not set or not found

**`Compiler path is not set in Settings`** or **`Compiler "…" not found or not executable`.** Run `Get-Command asfv1.exe` (Windows) or `command -v asfv1` (macOS and Linux). If it prints a path, put `asfv1` or that path in `spinasm.compiler.path`. If it prints nothing, find the executable as described in [Install asfv1](#installation) and enter its full path.

### Unsaved changes

**`… has unsaved changes. Save it before compiling.`** Save the file (or **File > Save All**) and run the command again.

### The file isn't a project program

**`Current file is not a valid project program`** or **`Program at index N does not exist`.** The file must sit in a folder named exactly `bank_0` to `bank_7` (lower case matters on Linux), directly inside the folder open in VS Code.

### The wrong file builds

**Bank Status reports a bank as ambiguous.** The bank holds more than one `.spn` file, and the extension builds the first alphabetically. Move the extra files out of the bank folder.

### An upload finds no output

**`No output file found for bank N`** or **`Unable to open file`.** The bank's `.hex` is missing or unreadable. Use the matching **Compile & Upload** command, which builds a fresh output before uploading.

### Compilation fails

**`Compilation failed for program N`.** Select the error in the **Problems** view to jump to the line, and read the full `asfv1` message in the output channel. Typical causes are an undefined symbol, a malformed operand, a missing comma or a program over the FV-1's limits. A failed compile is never a programmer problem, so fix it before touching the hardware.

### No programmer detected

**`No serial ports detected`, `Could not auto-detect programmer`** or **`Programmer did not respond`.**

- Check that the target board is powered; the programmer runs from its 3.3 V supply.
- Use a USB cable that carries data, not a charge-only cable.
- Close serial terminals and flashing tools that may hold the port open.
- Check that `spinasm.programmer.baudRate` is `57600` with the supplied firmware.
- On Linux, your account may need access to serial devices, usually through the `dialout` group or a udev rule. Sign out and back in after changing groups.

### The EEPROM doesn't respond

**`EEPROM is not ready`** or **`EEPROM isn't responding`.** The programmer answers but can't reach the EEPROM. Keep the board powered, check the SDA, SCL, FV-1 RESET, 3.3 V and GND connections, make sure no 5 V source is connected and secure or shorten loose jumper wires. Then run **Check Hardware Connection** again.

### Verification fails

**`Data verification failed`.** At least one byte read back differs from what was written, so treat the bank as not programmed. Power-cycle the board, check the SDA, SCL and ground connections and the stability of the board's power, then run **Check Hardware Connection** and the **Compile & Upload** command again. If it keeps failing, inspect the EEPROM and the target board.

### Reporting a bug

If a problem persists, open an issue in the [YGN FV-1 platform repository](https://github.com/ygn-effects/project-fv1-platform/issues) with:

- your operating system, VS Code version and extension version
- the command you ran and the exact error message
- the relevant SpinASM output, captured with `spinasm.logging.verbose` enabled if the problem involves the programmer (check it for paths or port names you'd rather not share)
- the source needed to reproduce the problem
