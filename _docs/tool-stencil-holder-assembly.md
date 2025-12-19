---
title: Stencil Holder Assembly
layout: doc
permalink: /docs/tool-stencil-holder-assembly/
updated: 2025-12-18
topic: Tools
excerpt: 3D-printed jig for precise PCB and stencil alignment during solder paste application.
tags: [3d-printing, tools, assembly, smd]
toc:
  - label: Introduction
    href: "#intro"
  - label: Why this tool
    href: "#why"
  - label: Required materials
    href: "#materials"
  - label: 3D Printing
    href: "#printing"
  - label: Assembly
    href: "#assembly"
---

## 1. Introduction {#intro}

The **YGN Stencil Holder** is a 3D-printable jig that provides precise, repeatable alignment between a PCB and its solder paste stencil. This tool is essential for the paste application step in the [SMD PCB Assembly](/docs/smd-pcb-assembly/) process, where even slight misalignment can result in bridged pads or incomplete paste deposits.

### What You'll Build

A two-piece hinged holder that:
- Locks the PCB in a precision-machined pocket
- Clamps the stencil using alignment holes
- Opens like a book for quick PCB changes
- Requires minimal hardware (hinges, screws, nuts)

The holder is sized specifically for YGN Framework boards, ensuring a perfect fit with zero play or movement during paste application.

---

## 2. Why This Tool Matters {#why}

### The Problem with DIY Stenciling

In industrial manufacturing, solder paste is applied with automated paste printers—fast, precise, but prohibitively expensive for hobbyists. Common DIY alternatives include:

- **Taping unframed stencils** to the workbench - Prone to shifting during squeegee passes
- **Commercial stencil frames** with generic jigs - Expensive and often poorly aligned
- **Bare-handed alignment** - Difficult to hold steady while applying paste

Even a 0.5mm misalignment on 0603 components can cause bridging or incomplete joints. When you're working with dozens of tiny pads, precision matters.

### The YGN Solution

The stencil holder solves this by:

| Feature | Benefit |
|---------|---------|
| **Precision PCB pocket** | Board locks into place with no lateral movement |
| **Four-point stencil registration** | Alignment holes ensure repeatable positioning every time |
| **Hinged design** | Quick PCB swaps without disturbing stencil alignment |
| **Low cost** | Uses very few filament and cheap hardware |

Once assembled, you'll achieve industrial-level paste placement accuracy with hobbyist tools.

---

## 3. Required Materials {#materials}

### Hardware Components

| Item | Quantity | Notes |
|------|----------|-------|
| **44×32mm hinges** | 2 | Standard door hinges from hardware store |
| **M3×4mm countersunk screws** | 6 | For top piece |
| **M3×8mm countersunk screws** | 6 | For bottom piece |
| **M3 hex nuts** | 12 | Standard height (2.4mm) |

> **Tip:** Most hardware stores carry these hinges in packs. Look in the cabinet hardware section, not door hardware—you want the small decorative hinges.

### 3D Printing Materials

- **Filament:** PLA or PETG

---

## 4. 3D Printing {#printing}

### Downloading the Files

Get the STL files from the [GitHub repository](https://github.com/ygn-effects/tool-stencil-holder):
- `stencil-holder-small-bottom.stl` - Base with PCB pocket
- `stencil-holder-small-top.stl` - Frame with stencil clamp

> **Note:** Choose the appropriate size for your PCB (small, medium, or large). For IO boards, use the `-io-board-` variants.

### Print Settings

#### Top Piece
```
Orientation: Flat on largest face (hinge mounting side down)
Supports: None required
Layer height: 0.2mm
Infill: 20%
Perimeters: 3
```

The top piece is designed to print support-free. The countersunk screw holes are angled to print cleanly without bridging issues.

#### Bottom Piece
```
Orientation: Flat on largest face
Supports: Required for nut traps and rubber feet recesses
Layer height: 0.2mm
Infill: 20%
Perimeters: 3
Print time: ~2.5 hours
```

**Support placement:**
- Enable supports for the hexagonal nut traps (underside)
- Enable supports for the circular rubber feet recesses
- Use "support on build plate only" setting

> **Tip:** If your printer has good bridging (e.g., well-tuned Prusa or Bambu), you may be able to print without supports. Test with a single piece first.

### Post-Processing

1. Remove supports carefully with flush cutters
2. Clean out nut trap pockets with a small file or deburring tool
3. Test-fit M3 nuts—they should drop in but not rattle loose
4. Optional: Light sanding (220 grit) on the PCB pocket edges for smooth insertion

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/stencil-holder/printed-parts.jpg" alt="Printed top and bottom pieces" class="doc-img">
  <img src="/assets/images/docs/stencil-holder/nut-trap-detail.jpg" alt="Hexagonal nut trap detail" class="doc-img">
</div>

---

## 5. Assembly {#assembly}

Assembly takes about 10 minutes and requires only a small Phillips screwdriver.

### Step 1: Install Hex Nuts

Insert M3 nuts into all hexagonal traps:
- **Top piece:** 6 nut traps (3 per hinge mount)
- **Bottom piece:** 6 nut traps (3 per hinge mount)

The nuts should press-fit into the traps. If they're too loose, a tiny drop of CA glue will secure them (optional).

### Step 2: Position Hinges

Place both hinges on the **bottom piece** first:
- Align the hinge barrel with the edge of the base
- The hinge leaves should sit flat against the mounting bosses
- Spacing: hinges should be evenly distributed along the top edge

### Step 3: Attach Hinges to Bottom

Using **6× M3×8mm screws**, secure the hinges to the bottom piece:
- Start all screws finger-tight before fully tightening
- Use 4 screws per hinge (the two center holes on each hinge leaf)
- Tighten firmly but don't overtighten—you'll strip the plastic threads

> **Note:** The hinges have 6 holes each, but 4 screws per hinge is more than adequate for the light clamping forces involved.

### Step 4: Attach Top Piece

With the hinges mounted to the base, position the **top piece**:
- Open the hinges to 180°
- Align the top piece's mounting bosses with the hinge holes
- Secure with **6× M3×4mm screws**

The shorter screws are used here because the top piece has thinner mounting bosses.

### Step 5: Function Check

Test the hinge action:
- The top should open smoothly to 180°
- When closed, both pieces should sit flush
- There should be minimal play at the hinge pivot

If the hinges bind, loosen the screws slightly. If there's too much play, ensure all nuts are fully seated in their traps.

<div class="img-grid cols-2" markdown="0">
  <img src="/assets/images/docs/stencil-holder/assembly-hardware.jpg" alt="All required hardware laid out" class="doc-img">
  <img src="/assets/images/docs/stencil-holder/hinge-mounting.jpg" alt="Hinges mounted to base" class="doc-img">
  <img src="/assets/images/docs/stencil-holder/assembled-open.jpg" alt="Assembled holder in open position" class="doc-img">
  <img src="/assets/images/docs/stencil-holder/assembled-closed.jpg" alt="Assembled holder closed" class="doc-img">
</div>

---

## Next Steps

With your stencil holder assembled, you're ready to tackle the paste application step with confidence. Continue to the full [SMD PCB Assembly Guide](/docs/smd-pcb-assembly/) to see how this tool fits into the complete board assembly workflow.

If you encounter any issues or have suggestions for improvements, please [open an issue](https://github.com/ygn-effects/tool-stencil-holder/issues) on GitHub.
