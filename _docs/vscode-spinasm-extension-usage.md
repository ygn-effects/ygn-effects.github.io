---
title: SpinASM for VS Code
layout: doc
permalink: /docs/vscode-spinasm-extension-usage/
updated: 2026-09-04
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

Welcome to the YGN Effects Framework documentation! This guide covers the software side of the FV-1 platform: writing SpinASM programs, assembling them into EEPROM files and loading them onto a pedal.

**SpinASM for VS Code** is a cross-platform Visual Studio Code extension. It understands `.spn` source files and works with the open-source [`asfv1`](https://pypi.org/project/asfv1/) assembler. Together, they provide syntax highlighting, completion, inline diagnostics and live resource tracking while you work on Windows, macOS or Linux. You can use the editing and compiling workflow without programmer hardware.

It helps to think of the workflow as three separate stops. Each program bank corresponds to one of the eight program slots in an FV-1 EEPROM:

1. **Write and inspect a `.spn` program.** Study an existing effect or start a new one. The editor's completion, symbol help and diagnostics help you catch small mistakes before they become compiler errors.
2. **Assemble the program.** Build one bank, every populated bank or a complete raw `output.bin` image. Stop here if you only need files for another tool or manufacturing workflow.
3. **Program an EEPROM.** Use a compatible programmer to upload a compiled program directly from VS Code.

You can stop at any of these points. If you're new to the extension, we'll begin with the editor and project layout, then use a small compile to confirm that `asfv1` is configured before connecting hardware. That separation keeps the software setup easy to test and means you don't need a programmer on the bench just to learn the language.

The overview below shows the pieces working together: a `.spn` file in the editor, live diagnostics and the bank and resource indicators.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/extension-overview.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/extension-overview.webp"
     alt="VS Code with a SpinASM program open, inline diagnostics and FV-1 bank and resource usage shown in the status bar"
     width="1440" height="1080" %}
</div>

## 2. Install and Configure {#installation}

SpinASM for VS Code provides the editing workflow, while [`asfv1`](https://github.com/ndf-zz/asfv1) assembles your `.spn` source into code the FV-1 can run. Install both pieces before you try to compile a program. Direct EEPROM programming is optional and can wait until the software workflow is working.

### What you need

| Item | Required for | Notes |
|------|--------------|-------|
| **Visual Studio Code 1.95 or newer** | Running the extension | The extension supports Windows, macOS and Linux. |
| **SpinASM for VS Code** | Editing, assembling and integrated programming | The extension adds support for `.spn` files. |
| **Python 3 and `asfv1`** | Assembling programs and EEPROM images | Python runs the open-source FV-1 assembler. |
| **Compatible programmer hardware** | Direct EEPROM programming from VS Code | Optional. Editing and assembling work without it. |

### Install the extension

1. **Open** Visual Studio Code.
2. **Open** the Extensions view with `Ctrl+Shift+X` on Windows or Linux, or `Cmd+Shift+X` on macOS.
3. **Search** for `@id:ygn-effects.vscode-spinasm`.
4. **Select** **SpinASM for VS Code** from YGN Effects and **click** **Install**.
5. **Open** any `.spn` file. VS Code should identify its language as **SpinASM** in the lower-right corner of the window.

> **Note:** The extension may warn that its compiler path is not configured. That is expected until you install `asfv1` and complete the final steps in this section.
{: .doc-callout .doc-callout-note}

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/extension-install.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/extension-install.webp"
     alt="VS Code Extensions view showing SpinASM for VS Code installed from the YGN Effects publisher"
     width="1024" height="768" %}
</div>

### Install asfv1

The extension launches `asfv1` as a separate executable, so it needs the complete path to that file. Use the instructions for your operating system, then copy the path for the configuration step below.

#### Windows

1. **Open** PowerShell and **check** for Python:

   ```powershell
   py --version
   ```

2. If the command is missing, **install** Python 3 from [python.org](https://www.python.org/downloads/windows/), then **open** a new PowerShell window.
3. **Install** the assembler:

   ```powershell
   py -m pip install --user asfv1
   ```

4. **Locate** its executable:

   ```powershell
   Get-Command asfv1.exe | Select-Object -ExpandProperty Source
   ```

5. **Copy** the complete path returned by PowerShell. You will add it to VS Code shortly.

> **Tip:** If PowerShell cannot find `asfv1.exe`, read the warning printed by `pip`. It normally names the Python `Scripts` folder that is not on your `PATH`. Open that folder and copy the full path to `asfv1.exe`.
{: .doc-callout .doc-callout-tip}

#### macOS

1. **Open** Terminal and **check** for Python:

   ```sh
   python3 --version
   ```

2. If the command is missing, **install** Python 3 from [python.org](https://www.python.org/downloads/macos/), then **open** a new Terminal window.
3. **Install** the assembler for your user account:

   ```sh
   python3 -m pip install --user asfv1
   ```

4. **Locate** its executable:

   ```sh
   command -v asfv1
   ```

5. **Copy** the complete path returned by the command.

#### Linux

1. **Open** a terminal and **check** that Python 3 and `pip` are available:

   ```sh
   python3 --version
   python3 -m pip --version
   ```

2. If either command is missing, **install** your distribution's Python 3 and `pip` packages. For example, Debian and Ubuntu use `python3` and `python3-pip`.
3. **Install** the assembler for your user account:

   ```sh
   python3 -m pip install --user asfv1
   ```

4. **Locate** its executable:

   ```sh
   command -v asfv1
   ```

5. **Copy** the complete path returned by the command.

> **Tip:** Some current Linux distributions prevent `pip` from changing their managed Python installation. If you see an `externally-managed-environment` error, install [`pipx`](https://pipx.pypa.io/stable/how-to/install-pipx.html) through your package manager, run `pipx install asfv1` and locate the executable again.
{: .doc-callout .doc-callout-tip}

> **Tip:** On macOS or Linux, a successful user installation can still place `asfv1` outside your shell's `PATH`. Run `python3 -m site --user-base` and look for `asfv1` inside that location's `bin` folder. The extension can use the full path even when your terminal cannot find it by name.
{: .doc-callout .doc-callout-tip}

### Configure the compiler path

The extension uses the full executable path you provide instead of relying on your shell's `PATH`. This makes the setting reliable across terminals and operating systems.

1. **Open** VS Code Settings with `Ctrl+,` on Windows or Linux, or `Cmd+,` on macOS.
2. **Search** the Settings view for `SpinASM`.
3. **Paste** the complete `asfv1` executable path into `spinasm.compiler.path`. Enter the path itself without surrounding quotation marks.
4. **Leave** `spinasm.compiler.args` set to its default value of `["-s"]`.
5. **Open** the Command Palette with `Ctrl+Shift+P` on Windows or Linux, or `Cmd+Shift+P` on macOS.
6. **Run** **SpinASM: Show Configuration**.
7. **Confirm** that the message shows the compiler path you entered.

> **Note:** An empty serial port and the default `57600` baud rate are normal when you are not using programmer hardware. You will configure a port only if you follow the integrated programming stage later in this guide.
{: .doc-callout .doc-callout-note}

> **Caution:** Keep the default `-s` compiler argument unless you have a specific reason to change SpinASM literal handling. Removing it can change how `asfv1` interprets the integer literals `1` and `2` in existing SpinASM source.
{: .doc-callout .doc-callout-caution}

The compiler path is now configured. The first real compilation in this guide will confirm that VS Code can launch `asfv1` and create an output file.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/compiler-settings.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/compiler-settings.webp"
     alt="VS Code Settings showing the SpinASM compiler path and default compiler arguments"
     width="1024" height="768" %}
</div>

## 3. Understand the Project Layout {#project-layout}

Before writing a program, give the extension a predictable place to find it. An FV-1 EEPROM provides eight program slots. SpinASM for VS Code maps those slots to folders named `bank_0` through `bank_7`, so the folder chooses the slot and the `.spn` filename can describe the effect.

A typical project looks like this:

```
my-fv1-project/
├── bank_0/
│   └── chorus.spn
├── bank_1/
│   └── delay.spn
├── bank_2/
│   └── reverb.spn
├── bank_3/
├── bank_4/
├── bank_5/
├── bank_6/
├── bank_7/
└── output/
    ├── bank_0.hex
    ├── bank_1.hex
    ├── bank_2.hex
    └── output.bin
```

The `.hex` files are individual bank outputs. The `output.bin` file is the complete 4 KB EEPROM image. The extension creates the `output` folder when needed, and output files appear as you run the corresponding compile commands. An empty `output` folder is normal in a new project.

### Create a new project

The **Create Project** command creates all eight bank folders, the `output` folder and a starter file named `program.spn` in every bank. Each starter file contains a comment identifying its bank and no DSP instructions yet. You can run this command before configuring the compiler because it only creates the project structure.

1. **Create** a dedicated empty folder for your FV-1 project.
2. **Open** that folder in VS Code with **File > Open Folder**.
3. **Open** the Command Palette with `Ctrl+Shift+P` on Windows or Linux, or `Cmd+Shift+P` on macOS.
4. **Run** **SpinASM: Create Project**.
5. **Confirm** that the Explorer now contains `bank_0` through `bank_7` and `output`.
6. **Rename** each `program.spn` file to describe the effect you plan to place in that bank, such as `chorus.spn` or `plate-reverb.spn`.
7. **Delete** the starter `.spn` file from any bank you do not want to populate. You may keep the empty bank folder or remove it.

> **Tip:** Run **Create Project** in a dedicated project folder. The command preserves existing folders and starter files, but a clean folder makes the eight-bank layout much easier to understand.
{: .doc-callout .doc-callout-tip}

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/project-layout.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/project-layout.webp"
     alt="VS Code Explorer showing an FV-1 project with eight bank folders and the output folder"
     width="1024" height="768" %}
</div>

### Open an existing project

You do not need to recreate a project that already follows the bank layout.

1. **Open** the project root in VS Code. Open the folder that contains the `bank_0` through `bank_7` folders, not an individual bank.
2. **Check** that every populated bank contains one `.spn` file.
3. **Open** one of those files. The extension will scan the workspace and show the project state in the status bar.

> **Note:** A manually created project does not need all eight bank folders. Missing folders and folders without a `.spn` file are treated as empty banks. The `output` folder is also optional because the extension creates it when needed.
{: .doc-callout .doc-callout-note}

### Keep no more than one program in each bank

Keep no more than one `.spn` file inside each `bank_N` folder. If a bank contains several, the extension sorts their filenames, selects the first one and reports the others as an ambiguity. This makes the result repeatable, but it may not be the program you intended to build.

> **Note:** Do not use a bank folder as general storage for alternate `.spn` files. Move experiments and previous versions outside `bank_0` through `bank_7`, or change their filename extension, before you compile.
{: .doc-callout .doc-callout-note}

### Read the bank status

The bank indicator gives you a quick view of which programs are ready to compile or upload:

| Symbol | Meaning |
|:---:|---------|
| `-` | The bank is empty. |
| `✗` | A `.spn` file exists but has not been compiled. |
| `✓` | The compiled HEX file is at least as recent as its source. |
| `⚠` | The `.spn` source changed after its last compilation. |

**Click** the indicator or **run** **SpinASM: Show Bank Status** to inspect all eight slots. The detailed view names each source file, identifies stale output and warns when a bank contains extra `.spn` files. Selecting a populated bank opens its source and offers to compile it when its output is missing or stale.

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/bank-status.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/bank-status.webp"
     alt="SpinASM bank status list showing empty, uncompiled, current and stale program banks"
     width="1024" height="768" %}
</div>

## 4. Work with SpinASM Files {#spn-files}

With the workspace mapped, you can work on one `.spn` file without a programmer connected. The extension treats each file as one FV-1 program and adds language-aware help while you type. Use it to study an existing effect, write one from scratch or prepare a small test program before connecting hardware.

### Create or open a program

1. **Choose** the bank that should contain the program.
2. **Open** its existing `.spn` file, or **create** a new file inside that `bank_N` folder.
3. **Give** a new file a descriptive name ending in `.spn`, such as `passthrough.spn`.
4. **Enter** a small program. This example sends the FV-1's left input directly to its left output:

   ```html
   ; Left-channel passthrough
   rdax ADCL, 1.0
   wrax DACL, 0.0
   ```

5. **Save** the file. The bank indicator will show that the new source has not been compiled yet.

> **Note:** The parent `bank_N` folder selects the EEPROM slot. Renaming `passthrough.spn` does not move it to another bank.
{: .doc-callout .doc-callout-note}

### Use completion and snippets

Completion is VS Code's list of inline suggestions. As you type, the extension suggests SpinASM instructions, built-in registers, condition flags and symbols declared in the current file. Each built-in completion includes its instruction signature and a short explanation.

1. **Place** the cursor on a blank line and **start typing** an instruction such as `rdax`.
2. **Select** the matching completion to insert it.
3. **Press** `Tab` to move between the instruction's operand placeholders.

The extension also includes larger snippets for common structures:

| Prefix | Inserts |
|--------|---------|
| `fxstart` | A mono effect skeleton with one-time initialization, ADC input and DAC output. |
| `skprun` | A run-once initialization block using the `RUN` condition. |
| `adcsetup` | A pair of instructions that reads both ADC inputs. |
| `dacwrite` | A pair of instructions that writes both DAC outputs. |
| `allpass` | An all-pass delay section using `RDA` and `WRAP`. |
| `lpf` | A first-order low-pass filter using `RDFX` and `WRAX`. |

> **Tip:** Individual instructions also have snippets. If the completion list does not open automatically, press `Ctrl+Space` on Windows or Linux. On macOS, use the configured **Trigger Suggest** shortcut because `Ctrl+Space` may be reserved for input-source switching.
{: .doc-callout .doc-callout-tip}

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/editor-completion.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/editor-completion.webp"
     alt="SpinASM instruction completion in VS Code showing an instruction signature and description"
     width="1024" height="768" %}
</div>

### Inspect instructions and symbols

You do not have to keep a reference table beside the editor for every small question. `EQU` defines a named constant or register alias, `MEM` reserves a delay-memory block and a label marks a location that another instruction can jump to.

1. **Hover** over a built-in instruction, register or flag to see its signature and purpose.
2. **Hover** over a user-defined `EQU`, `MEM` or jump label to see what kind of symbol it is.
3. **Open** **Go to Definition** on a user-defined symbol with `F12`, or `Ctrl+Click` on Windows and Linux and `Cmd+Click` on macOS.

Go to Definition stays inside the current `.spn` file because each FV-1 program is assembled as a single source file. Built-in instructions and registers have hover documentation but no local definition to open.

### Read live diagnostics

The extension checks the active document shortly after you stop typing and again whenever you save. Problems appear as editor underlines and in VS Code's **Problems** view. These checks do not require programmer hardware.

The live checks cover common mistakes including:

- malformed `EQU` and `MEM` declarations
- duplicate or undefined symbols
- missing instruction operands or commas
- coefficients that are likely outside their valid range
- instruction and delay-memory limits

1. **Hover** over an underlined problem to read its explanation.
2. **Open** the Problems view with `Ctrl+Shift+M` on Windows or Linux, or `Cmd+Shift+M` on macOS, to review every diagnostic in the file.
3. **Select** a problem to jump directly to its source line.
4. **Correct** the source and **save** it to refresh both diagnostics and bank status.

> **Note:** Live diagnostics provide quick feedback before compilation. `asfv1` remains the final authority. When you compile, its warnings and errors are also attached to the relevant `.spn` file and shown in the Problems view.
{: .doc-callout .doc-callout-note}

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/editor-diagnostics.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/editor-diagnostics.webp"
     alt="SpinASM source in VS Code with an inline error and the matching explanation in the Problems view"
     width="1280" height="960" %}
</div>

### Watch FV-1 resource usage

Each FV-1 program has three important resource limits: 32 general-purpose registers, 128 instructions and 32,768 delay-memory samples. The resource indicator updates while you edit the active `.spn` file.

1. **Find** the `R`, `I` and `M` values in the VS Code status bar. They show the number of registers used, the instruction count and approximate delay-memory use. The `M` value is rounded in the status bar.
2. **Click** the resource indicator, or **run** **SpinASM: Show Resource Usage**, to open the detailed view.
3. **Review** the named register aliases, remaining instructions and each `MEM` allocation.
4. **Reduce** or reorganize the program if the indicator enters its warning or critical state.

> **Tip:** The two SpinASM status indicators answer different questions. The eight-bank indicator tracks whether project outputs are current. The resource indicator tracks whether the active source fits inside one FV-1 program slot.
{: .doc-callout .doc-callout-tip}

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/resource-usage.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/resource-usage.webp"
     alt="SpinASM resource usage view showing registers, instructions and delay-memory allocation for the active program"
     width="1024" height="768" %}
</div>

## 5. Compile Programs and EEPROM Images {#compiling}

This is the handoff from readable SpinASM source to files an FV-1 EEPROM can use. Compiling, also called assembling, converts your source into 32-bit FV-1 instructions. You can build one bank, every populated bank or one complete image. No programmer hardware is required for any command in this section.

### Choose the output you need

| Command | Source it builds | Output |
|---------|------------------|--------|
| **SpinASM: Compile current program** | The `.spn` file open in the active editor | `output/bank_N.hex` |
| **SpinASM: Compile Specific Bank...** | One populated bank selected from a list | `output/bank_N.hex` |
| **SpinASM: Compile all programs** | Every populated bank | One `output/bank_N.hex` per populated bank |
| **SpinASM: Compile all programs to .bin** | Every populated bank | `output/output.bin` |

An individual `.hex` file uses the Intel HEX format and includes the address of its EEPROM bank. The combined `output.bin` file is a raw 4 KB image containing all eight slots.

### Compile the current program

Once your source is saved, this is the shortest path from one `.spn` file to a usable bank output.

1. **Open** the `.spn` file you want to build.
2. **Save** your latest changes.
3. **Run** **SpinASM: Compile current program** from the Command Palette, **click** the checkmark button in the editor title or **press** `Ctrl+Alt+B`.
4. **Wait** for the success message.
5. **Find** `bank_N.hex` inside the project's `output` folder, where `N` matches the source file's bank folder.
6. **Confirm** that the bank status changes to `✓`.

> **Tip:** If you are looking at the wrong editor, use **SpinASM: Compile Specific Bank...** and select the intended populated bank. An empty bank has no source to compile.
{: .doc-callout .doc-callout-tip}

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/compile-current.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/compile-current.webp"
     alt="VS Code after compiling the active SpinASM program with its HEX output and current bank status visible"
     width="1280" height="960" %}
</div>

### Compile every populated bank

After one program compiles cleanly, you can rebuild the whole project without opening each source file individually.

1. **Save** all changed `.spn` files.
2. **Open** the Command Palette.
3. **Run** **SpinASM: Compile all programs**.
4. **Wait** while the extension builds the populated banks in order from 0 through 7. Empty banks are skipped.
5. **Inspect** the `output` folder and bank indicator. Each populated bank should have a current `bank_N.hex` file.

If any bank fails, the command stops and reports the compiler error. Fix that source before running the command again.

### Build a complete EEPROM image

Use a combined image when another tool or manufacturing process expects the entire EEPROM as one raw binary file.

1. **Save** every program you want to include.
2. **Open** the Command Palette.
3. **Run** **SpinASM: Compile all programs to .bin**.
4. **Wait** for **Combined EEPROM image written to output.bin!**.
5. **Find** the 4 KB file at `output/output.bin`.

The extension assembles each populated bank into its correct 512-byte slot, then combines all eight slots in bank order. Empty banks are filled with `0x00` bytes.

> **Note:** Building `output.bin` does not create or refresh the individual `bank_N.hex` files. Run **Compile all programs** as well if you need both output formats or want every bank-status symbol to show `✓`.
{: .doc-callout .doc-callout-note}

> **Caution:** A complete `output.bin` represents the whole EEPROM, including empty banks. Writing it with another tool replaces every slot on the device.
{: .doc-callout .doc-callout-caution}

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/combined-image.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/combined-image.webp"
     alt="VS Code Explorer showing individual bank HEX files and the combined 4 KB output.bin EEPROM image"
     width="1280" height="960" %}
</div>

### Read compiler messages

Compiler warnings and errors appear as diagnostics on the source file. When a compile error occurs, the extension automatically reveals the **SpinASM** output channel so you can see the compiler's output.

1. If the channel is not visible, **open** **View > Output**.
2. **Select** **SpinASM** from the output-channel list.
3. **Read** the `asfv1` command, warning or error recorded for the affected bank.
4. **Return** to the underlined source line, **correct** it and **compile** again.

> **Caution:** Do not use an upload-only command after a failed compile. The extension removes an existing `bank_N.hex` before starting a fresh compile, so wait for a successful output before uploading.
{: .doc-callout .doc-callout-caution}

> **Tip:** Keep the SpinASM output channel open while learning how source changes map to `asfv1` messages.
{: .doc-callout .doc-callout-tip}

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/compile-error.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/compile-error.webp"
     alt="Compiler output in the SpinASM output channel showing up on compile error"
     width="1280" height="960" %}
</div>

## 6. Program an EEPROM {#programming}

Once a program compiles cleanly, you can program a target EEPROM directly from VS Code with a compatible programmer. This section covers the two integrated programmer designs supported by SpinASM. Both use the same commands and provide automatic read-back verification.

### Choose a programming method

Choose the hardware that matches your build:

| Method | Additional hardware | What it writes | Verification |
|--------|----------------------|----------------|--------------|
| **YGN FV-1 EEPROM Programmer** | Dedicated YGN programmer connected to the target board | One selected bank or every populated bank | Automatic read-back comparison |
| **Arduino Pro Mini 3.3 V** | 3.3 V Arduino Pro Mini and USB-to-serial adapter | One selected bank or every populated bank | Automatic read-back comparison |

Complete the setup guide for your hardware before continuing:

- [FV-1 Programmer Flashing and Setup](/docs/fv1-programmer-flashing-and-setup/)
- [Arduino Pro Mini FV-1 Programmer Setup](/docs/fv1-programmer-arduino-pro-mini-setup/)

The rest of this section covers the shared VS Code workflow. The physical wiring and power arrangement belong to each programmer's setup guide.

### Connect an integrated programmer

1. **Connect** the programmer to the target board exactly as shown in its setup guide.
2. **Power on** the target board. Both supported designs rely on the target's 3.3 V supply during normal EEPROM programming.
3. **Connect** the programmer or USB-to-serial adapter to your computer.
4. **Open** the FV-1 project in VS Code.

> **Caution:** Keep 5 V power and 5 V serial logic away from the FV-1 programming connection. The target EEPROM, programming header and Arduino Pro Mini workflow operate at 3.3 V.
{: .doc-callout .doc-callout-caution}

### Detect and check the hardware

1. **Open** the Command Palette.
2. **Run** **SpinASM: Auto-Detect Programmer**.
3. **Confirm** that the extension reports the detected serial port.
4. If detection fails, **run** **SpinASM: Select Serial Port...** and **choose** the programmer manually.
5. **Run** **SpinASM: Check Hardware Connection**.
6. **Confirm** that VS Code reports the compiler and programmer are connected and ready.

The hardware check validates three parts of the chain: the configured `asfv1` executable, the programmer's serial response and communication with the target EEPROM. The selected serial port is stored as a machine-level VS Code setting so it is not committed with your project.

> **Tip:** Run **SpinASM: Show Configuration** at any time to review the compiler path, serial port and baud rate together.
{: .doc-callout .doc-callout-tip}

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/programmer-autodetect.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/programmer-autodetect.webp"
     alt="VS Code reporting that SpinASM automatically detected and configured an FV-1 programmer serial port"
     width="1024" height="768" %}
</div>

### Compile, upload and verify one bank

The safest everyday command is **Compile & Upload current program**. It rebuilds the source first, writes only that program's 512-byte bank and verifies the result.

1. **Open** the `.spn` file you want to test.
2. **Save** your latest changes.
3. **Run** **SpinASM: Compile & Upload current program** from the Command Palette, **click** the lightning-bolt button in the editor title or **press** `Ctrl+Alt+U`.
4. **Keep** the target powered and connected while the operation runs.
5. **Wait** for the success message.

After writing the bank, the extension reads all 512 bytes back from the EEPROM and compares them with the compiled program. It reports an error if any byte differs, so a successful message confirms both the write and read-back verification.

> **Note:** Programming one bank leaves the other seven EEPROM slots unchanged. This is useful while developing an effect because you can update one program without rebuilding the complete EEPROM image.
{: .doc-callout .doc-callout-note}

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/upload-verified.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/upload-verified.webp"
     alt="VS Code reporting a successful SpinASM compile, EEPROM upload and read-back verification"
     width="1024" height="768" %}
</div>

### Program a selected bank or all populated banks

1. **Run** **SpinASM: Compile & Upload Specific Bank...** when you want to choose a populated bank without opening its source first.
2. **Run** **SpinASM: Compile & Upload all programs** when you want to rebuild, write and verify every populated bank in order.
3. **Wait** for the final message to report how many banks completed.

Empty banks are skipped, so **Compile & Upload all programs** does not erase their existing EEPROM contents.

Upload-only commands skip compilation and use the existing `bank_N.hex` files:

- **SpinASM: Upload current program**
- **SpinASM: Upload Specific Bank...**
- **SpinASM: Upload all programs**

> **Caution:** Use an upload-only command only when you intentionally want the last compiled output. It does not rebuild changed source. If you are unsure, use the matching **Compile & Upload** command.
{: .doc-callout .doc-callout-caution}

## 7. Command Reference {#commands}

Use this section when you know what you want to do and need the exact SpinASM command. **Open** the Command Palette and **type** `SpinASM` to see the available commands.

Commands that act on the current program appear only while a `.spn` editor is active. Project commands require an open workspace folder. Configuration and programmer-selection commands can run from any editor.

### Project and status commands

| Command | What it does |
|---------|--------------|
| **SpinASM: Create Project** | Adds `bank_0` through `bank_7`, a starter `program.spn` in each bank and the `output` folder to the open workspace. Existing folders and starter files are preserved. It does not require or test the compiler. |
| **SpinASM: Show Bank Status** | Lists all eight banks for the active workspace folder. It shows empty, uncompiled, current, stale and ambiguous states. Selecting a populated bank opens its source and offers compile actions when needed. |
| **SpinASM: Show Resource Usage** | Shows register, instruction and delay-memory use for the active `.spn` file. It does not analyze the other banks. |
| **SpinASM: Show Configuration** | Displays the current compiler path, serial port and baud rate. Its **Open Settings** button opens the SpinASM settings view. It reports configured values but does not test them. |
| **SpinASM: Check Hardware Connection** | Checks that the compiler path is executable, opens the configured serial port, confirms that a compatible programmer responds and confirms that the target EEPROM is ready. Programmer hardware is required. |

### Programmer selection commands

| Command | What it does |
|---------|--------------|
| **SpinASM: Auto-Detect Programmer** | Lists the computer's serial ports and probes them at the configured baud rate until a compatible YGN protocol response is found. It stores the first responding port but does not check EEPROM readiness. Run **Check Hardware Connection** afterwards for the complete test. |
| **SpinASM: Select Serial Port...** | Lists detected serial ports with any available manufacturer, USB vendor ID and product ID. Your selection is stored globally on that machine. The command selects a port but does not test the programmer. |

### Compile commands

| Command | What it does |
|---------|--------------|
| **SpinASM: Compile current program** | Finds the bank of the active or selected `.spn` file, runs `asfv1` and replaces that bank's `output/bank_N.hex`. No programmer is used. |
| **SpinASM: Compile Specific Bank...** | Prompts for bank 0 through 7, then builds that bank's `.spn` file into `bank_N.hex`. Selecting an empty bank produces an error because there is no source. |
| **SpinASM: Compile all programs** | Builds a separate `bank_N.hex` for every populated bank in numeric order. Empty banks are skipped. The operation stops if one bank fails. |
| **SpinASM: Compile all programs to .bin** | Compiles the populated banks to temporary binary data and combines them into the 4 KB `output/output.bin`. Empty slots are filled with `0x00`. It does not create or refresh `bank_N.hex`. |

### Upload-only commands

Every upload-only command uses existing HEX output, writes each selected 512-byte bank and performs read-back verification. It does not rebuild changed source.

| Command | What it does |
|---------|--------------|
| **SpinASM: Upload current program** | Uploads the existing `bank_N.hex` associated with the active or selected `.spn` file. It fails if that output does not exist. |
| **SpinASM: Upload Specific Bank...** | Prompts for one bank and uploads its existing `bank_N.hex`. It does not check whether the source is newer than the output. |
| **SpinASM: Upload all programs** | Uploads existing HEX output for every populated bank in numeric order. Empty banks are skipped and left unchanged on the EEPROM. A missing output or failed verification stops the operation. |

### Compile and upload commands

These commands run the matching compile operation first, then write and verify the resulting bank or banks. They are the safest choices during normal development.

| Command | What it does |
|---------|--------------|
| **SpinASM: Compile & Upload current program** | Rebuilds the active or selected program, uploads its bank and verifies all 512 bytes. |
| **SpinASM: Compile & Upload Specific Bank...** | Prompts for one bank, rebuilds its source, uploads it and verifies all 512 bytes. |
| **SpinASM: Compile & Upload all programs** | Rebuilds, uploads and verifies every populated bank in numeric order. Empty banks are skipped and left unchanged. |

### Buttons, menus and shortcuts

The most common current-program commands are also available closer to the source file:

| Location | Available actions |
|----------|-------------------|
| **Editor title** | Compile current program, Compile & Upload current program |
| **Editor context menu** | Compile current program, Compile & Upload current program, Upload current program |
| **Explorer `.spn` context menu** | Compile current program, Compile & Upload current program, Upload current program |
| **Bank status indicator** | Show Bank Status |
| **Resource status indicator** | Show Resource Usage |
| `Ctrl+Alt+B` | Compile current program |
| `Ctrl+Alt+U` | Compile & Upload current program |

> **Tip:** Editor and Explorer actions operate on the file where you invoked them. Command Palette actions for the current program use the active editor. This distinction is useful when several `.spn` files are open in split editors.
{: .doc-callout .doc-callout-tip}

## 8. Settings Reference {#settings}

SpinASM's settings control the assembler, integrated programmer and editor feedback. **Open** Settings and **search** for `SpinASM` to see all seven options.

Compiler paths and serial-port names belong to the machine running VS Code. The baud rate must match the firmware running on the connected programmer. Prefer the **User** setting level for machine-specific hardware values. Store editing preferences globally or with a workspace when a project needs consistent behavior.

<div class="table-responsive" markdown="1">

| Setting | Default | What it changes |
|---------|---------|-----------------|
| `spinasm.compiler.path` | Empty | Full path to the `asfv1` executable. Every compile command needs this path. Enter the executable path without quotation marks, even when the path contains spaces. |
| `spinasm.compiler.args` | `["-s"]` | Arguments inserted before the bank, input and output arguments on every `asfv1` invocation. The default `-s` enables SpinASM-compatible handling of the integer literals `1` and `2`. |
| `spinasm.programmer.serialPort` | Empty | Serial port used by integrated upload and hardware-check commands. Auto-detect and manual selection save this value as a global machine setting. |
| `spinasm.programmer.baudRate` | `57600` | Speed used for auto-detection and all YGN programmer communication. It must match the firmware running on the programmer. |
| `spinasm.editor.compileOnSave` | `false` | Compiles a saved `.spn` file into its individual `bank_N.hex` when it belongs to a project bank. It does not build `output.bin` or upload anything. |
| `spinasm.statusBar.enabled` | `true` | Shows or hides the eight-bank compilation summary. It does not hide the separate resource-usage indicator for the active `.spn` file. |
| `spinasm.logging.verbose` | `false` | Adds debug-level details to the SpinASM output channel, including individual programmer messages. Enable it only while diagnosing serial communication. |

</div>

<div class="img-grid doc-image-grid cols-1" markdown="0">
  {% include doc-image.html
     full="/assets/images/docs/vscode-spinasm-extension-usage/all-settings.jpg"
     thumb="/assets/images/docs/vscode-spinasm-extension-usage/thumbs/all-settings.webp"
     alt="VS Code Settings filtered to SpinASM and showing all compiler, programmer, editor, status-bar and logging options"
     width="1280" height="960" %}
</div>

### Compiler settings

These settings affect every compile command, so confirm them before troubleshooting source code.

1. **Set** `spinasm.compiler.path` to the complete executable path found during installation.
2. **Keep** `spinasm.compiler.args` at `["-s"]` for normal SpinASM source.
3. **Run** **SpinASM: Show Configuration** to confirm the stored path.
4. **Compile** one program to prove that the executable can run.

> **Note:** **Show Configuration** displays the saved path but does not verify whether the file exists or is executable. A compile command or **Check Hardware Connection** performs that validation.
{: .doc-callout .doc-callout-note}

### Programmer settings

These settings matter only when using direct VS Code programming. The serial port is normally easier to set through **Auto-Detect Programmer** or **Select Serial Port...** than by typing it yourself. Typical names include `COM3` on Windows, `/dev/cu.usbserial-*` on macOS and `/dev/ttyUSB0` on Linux, but the correct value depends on the connected adapter and operating system.

1. **Leave** the baud rate at `57600` when using the supplied YGN programmer firmware.
2. **Run** auto-detect after connecting and powering the programmer.
3. **Use** manual port selection when several serial devices are connected or auto-detect cannot identify the correct one.
4. **Run** the hardware check before your first upload.

> **Caution:** Changing the baud rate in VS Code does not change the programmer firmware. A mismatch prevents the two sides from communicating.
{: .doc-callout .doc-callout-caution}

### Editing and display settings

Compile on save is convenient once a project builds cleanly, but it changes what happens after every save.

1. **Enable** `spinasm.editor.compileOnSave` if you want each saved bank to refresh its HEX output automatically.
2. **Watch** the Problems view and SpinASM output channel for compiler errors after saving.
3. **Keep** it disabled when you prefer to separate editing from deliberate builds.

The status-bar setting controls only the bank summary. Leave it enabled for normal eight-bank projects, or disable it when the summary is distracting during batch preparation. Resource usage remains visible while a `.spn` file is active.

### Verbose logging

Normal logging records high-level project, compiler and programmer activity. Verbose logging adds low-level serial messages that are useful when detection, timeouts or verification fail.

1. **Enable** `spinasm.logging.verbose`.
2. **Reproduce** the programmer problem once.
3. **Open** **View > Output** and **select** **SpinASM**.
4. **Save** the relevant log details before closing VS Code if you need them for a bug report.
5. **Disable** verbose logging after troubleshooting so routine output stays readable.

## 9. Troubleshooting {#troubleshooting}

Start with the exact message shown by VS Code. After a compile error, the **SpinASM** output channel opens automatically. For other operations, **open** **View > Output** and **select** **SpinASM** to see the complete operation log. Compiler problems also appear in the **Problems** view beside the relevant source line.

### The extension does not recognize a file

**The editor has no SpinASM highlighting, completion or status indicators**

1. **Confirm** that the filename ends in `.spn`.
2. **Check** the language indicator in the lower-right corner of VS Code.
3. If it shows another language, **click** it and **select** **SpinASM**.
4. **Confirm** that SpinASM for VS Code is installed and enabled in the current VS Code profile.
5. For project commands, **open** the project root that contains your `bank_N` folders rather than opening one file by itself.

### The compiler path is missing or invalid

**`Compiler path is not set in Settings` or `Compiler path invalid or not executable`**

1. **Run** `Get-Command asfv1.exe` in PowerShell on Windows, or `command -v asfv1` on macOS and Linux.
2. **Copy** the complete executable path returned by the command.
3. **Open** the SpinASM settings and **paste** that path into `spinasm.compiler.path` without quotation marks.
4. **Run** **SpinASM: Show Configuration** and **confirm** the stored path.
5. **Compile** the current program again.

If the location command returns nothing, return to the platform steps in [Install and Configure](#installation). A successful installation may place `asfv1` outside your shell's `PATH`. Follow the corresponding tip to locate its `Scripts` or `bin` folder before reinstalling it.

### The current file is not a project program

**`Current file is not a valid project program` or `Program at index N does not exist`**

1. **Confirm** that the `.spn` file is inside a folder named exactly `bank_0` through `bank_7`.
2. **Confirm** that the bank folder sits directly inside the open workspace root.
3. **Remove** extra `.spn` files from that bank so only the intended program remains.
4. **Run** **SpinASM: Show Bank Status** and **select** the program from the list.
5. **Run** the compile command again from the opened source.

On Linux, folder names are case-sensitive. Use `bank_0`, not `Bank_0` or `BANK_0`.

### A bank is ambiguous or the wrong file builds

**Bank Status reports extra `.spn` files in one bank**

The extension sorts the filenames and uses the first candidate so its choice is repeatable. It still reports the bank as ambiguous because that choice may not match your intent.

1. **Open** **SpinASM: Show Bank Status** and **identify** the ignored filenames.
2. **Move** alternate sources outside every `bank_N` folder, or **change** their extension while they are inactive.
3. **Leave** one `.spn` file in the bank.
4. **Compile** it again and **confirm** that the ambiguity warning disappears.

### Compilation fails

**`Compilation failed for program N` or an `asfv1` error appears**

1. **Open** the Problems view and **select** the compiler diagnostic.
2. **Open** **View > Output** and **select** **SpinASM** for the original `asfv1` message.
3. **Check** the named line for an undefined symbol, malformed operand, missing comma or exceeded FV-1 limit.
4. **Keep** `spinasm.compiler.args` set to `["-s"]` unless the source intentionally requires different literal handling.
5. **Correct** the source, **save** it and **compile** again.

> **Tip:** A failed compile is not a programmer problem. Resolve it before connecting hardware or trying an upload command.
{: .doc-callout .doc-callout-tip}

### An upload cannot find its output

**`No output file found for bank N` or `Unable to open file`**

1. **Check** Bank Status for `✗` or `⚠` on the affected bank.
2. **Run** **SpinASM: Compile current program** to create a fresh `bank_N.hex`.
3. **Confirm** that the file appears inside `output`.
4. **Retry** the upload, or use **Compile & Upload current program** to perform both operations together.

### No programmer is detected

**`No serial ports detected`, `Could not auto-detect programmer` or `Programmer did not respond`**

1. **Confirm** that the target board is powered. The supported integrated programmers rely on its 3.3 V supply during normal use.
2. **Check** the USB cable and **confirm** that it carries data, not power only.
3. **Close** serial terminals, flashing tools or other programs that may have the port open.
4. **Leave** `spinasm.programmer.baudRate` at `57600` when using the supplied firmware.
5. **Run** **SpinASM: Select Serial Port...** and **choose** the port manually.
6. **Run** **SpinASM: Check Hardware Connection**.

On Linux, your account may need permission to access the serial device through a group such as `dialout` or through an appropriate udev rule. Follow your distribution's documentation, then sign out and back in if you changed group membership.

### The programmer responds but the EEPROM does not

**`EEPROM is not ready` or `EEPROM isn't responding`**

1. **Keep** the target board powered.
2. **Inspect** the programming connection by signal name: SDA, SCL, FV-1 RESET, 3.3 V and GND.
3. **Confirm** that no 5 V supply or serial logic is connected.
4. **Secure** loose jumper wires and **shorten** excessively long wires where practical.
5. **Review** the setup guide for the [YGN FV-1 EEPROM Programmer](/docs/fv1-programmer-flashing-and-setup/) or [Arduino Pro Mini programmer](/docs/fv1-programmer-arduino-pro-mini-setup/).
6. **Run** the hardware check again before uploading.

### Read-back verification fails

**`Data verification failed` after an upload**

Do not treat a verification mismatch as a successful write. The extension read the bank back and found at least one byte that differed.

1. **Power-cycle** the target board.
2. **Check** the SDA, SCL and ground connections for movement or poor contact.
3. **Confirm** that target power remains stable throughout the upload.
4. **Run** **SpinASM: Check Hardware Connection**.
5. **Run** the matching **Compile & Upload** command again.
6. If the mismatch repeats, **inspect** the EEPROM, programmer connection and target-board hardware before continuing.

### Collect useful information for a bug report

If the problem persists, collect enough context to reproduce it before opening an issue.

1. **Record** your operating system, VS Code version and SpinASM for VS Code version.
2. **Record** the exact command and error message.
3. **Enable** verbose logging only if the problem involves programmer communication.
4. **Reproduce** the failure once and **copy** the relevant SpinASM output.
5. **Review** compiler paths and serial-port names before sharing the log if they reveal information you prefer to keep private.
6. **Open** an issue in the [YGN FV-1 platform repository](https://github.com/ygn-effects/project-fv1-platform/issues) with the source needed to reproduce the problem.
