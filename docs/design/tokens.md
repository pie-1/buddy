# Design Language: Pookpit — Your Campus. Unlocked.

> Extracted from `https://www.pookpit.com` on November 1, 2026
> 1642 elements analyzed

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Primary Colors

| Role | Hex | RGB | HSL | Usage Count |
|------|-----|-----|-----|-------------|
| Primary | `#fb923c` | rgb(251, 146, 60) | hsl(27, 96%, 61%) | 94 |
| Secondary | `#ff7c00` | rgb(255, 124, 0) | hsl(29, 100%, 50%) | 4 |
| Accent | `#f5060a` | rgb(245, 6, 10) | hsl(359, 95%, 49%) | 6 |

### Tonal Ramps

Generated in OKLCH from each role colour, so the steps are perceptually even. The site's own colour keeps its position in the ladder.

| Role | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| primary | `#ffe6b7` | `#ffd8a5` | `#ffc58b` | **`#fb923c`** | `#e6832f` | `#c76300` | `#ab4e00` | `#8e3a00` | `#772d00` | `#632200` | `#3b0e00` |
| secondary | `#ffe0af` | `#ffd29c` | `#ffbd80` | `#ff9f56` | **`#ff7c00`** | `#d45500` | `#b84000` | `#992d00` | `#812000` | `#6b1500` | `#400500` |
| accent | `#ffcebb` | `#ffbdaa` | `#ffa591` | `#ff7f6c` | `#ff4b3d` | **`#f5060a`** | `#d30000` | `#b10000` | `#960000` | `#7d0000` | `#4c0000` |
| neutral | `#f5f5fb` | `#e9e9f0` | `#d8d8e0` | `#bfbfc8` | `#9f9fa8` | `#81818a` | **`#71717a`** | `#56565d` | `#46464c` | `#38383e` | `#1e1e22` |

### Semantic Pairs

| Role | Background | Foreground | Contrast | Level |
|------|------------|------------|----------|-------|
| `surface.page` | `#09090b` | `#ffffff` | 19.9:1 | AAA |
| `surface.raised` | `#14121f` | `#ffffff` | 18.49:1 | AAA |
| `action.primary` | `#fb923c` | `#000000` | 9.28:1 | AAA |
| `action.secondary` | `#ff7c00` | `#000000` | 8.14:1 | AAA |
| `action.accent` | `#f5060a` | `#000000` | 4.91:1 | AA |

### Dominance

Share of painted background area — what the page looks like, as opposed to what it declares most often.

- `#ffffff` — 44%
- `#09090b` — 40%
- `#14121f` — 16%
- `#140bec` — 0%
- `#f5060a` — 0%
- `#d4d4d8` — 0%

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#ffffff` | hsl(0, 0%, 100%) | 496 |
| `#000000` | hsl(0, 0%, 0%) | 190 |
| `#71717a` | hsl(240, 4%, 46%) | 33 |
| `#d4d4d8` | hsl(240, 5%, 84%) | 26 |
| `#515b6d` | hsl(219, 15%, 37%) | 22 |
| `#52525b` | hsl(240, 5%, 34%) | 12 |
| `#a1a1aa` | hsl(240, 5%, 65%) | 10 |
| `#9ca3af` | hsl(218, 11%, 65%) | 9 |
| `#3f3f46` | hsl(240, 5%, 26%) | 4 |
| `#09090b` | hsl(240, 10%, 4%) | 2 |
| `#ccc8be` | hsl(43, 12%, 77%) | 2 |

### Background Colors

Used on large-area elements: `#09090b`, `#14121f`, `#fafaf8`, `#ffffff`

### Text Colors

Text color palette: `#000000`, `#fafafa`, `#ffffff`, `#1a1a2e`, `#5d73ff`, `#91a4ff`, `#8d74ff`, `#ff7c00`, `#ff7a24`, `#515b6d`

### Gradients

```css
background-image: linear-gradient(135deg, rgb(79, 70, 229), rgb(99, 102, 241), rgb(139, 92, 246));
```

```css
background-image: linear-gradient(135deg, rgb(79, 70, 229), rgb(99, 102, 241));
```

```css
background-image: radial-gradient(70% 55% at 20% 100%, rgba(79, 70, 229, 0.1), rgba(0, 0, 0, 0) 60%);
```

```css
background-image: linear-gradient(165deg, rgb(28, 26, 40), rgb(22, 20, 31));
```

```css
background-image: radial-gradient(90% 80% at 50% 45%, rgba(0, 0, 0, 0) 60%, rgba(250, 250, 248, 0.65) 100%);
```

```css
background-image: linear-gradient(145deg, rgb(30, 27, 75), rgb(49, 46, 129), rgb(67, 56, 202), rgb(99, 102, 241));
```

```css
background-image: linear-gradient(105deg, rgba(0, 0, 0, 0) 30%, rgba(255, 255, 255, 0.5) 45%, rgba(0, 0, 0, 0) 55%);
```

```css
background-image: radial-gradient(rgba(255, 255, 255, 0.7) 1px, rgba(0, 0, 0, 0) 1px);
```

```css
background-image: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 2px, rgba(255, 255, 255, 0.1) 2px, rgba(255, 255, 255, 0.1) 4px);
```

```css
background-image: linear-gradient(to right, lab(74.0235 8.54138 -41.6075) 0%, lab(76.7419 18.3911 -37.0706) 50%, lab(85.3886 -36.7636 -21.5716) 100%);
```

```css
background-image: linear-gradient(105deg, rgba(139, 92, 246, 0.35), rgba(99, 102, 241, 0.25), rgba(34, 211, 238, 0.3));
```

```css
background-image: linear-gradient(135deg, rgb(129, 140, 248), rgb(192, 132, 252));
```

```css
background-image: linear-gradient(to top, rgba(99, 102, 241, 0.5), rgba(139, 92, 246, 0.8));
```

```css
background-image: linear-gradient(to right, oklab(0.784994 0.00943798 -0.114588 / 0.7) 0%, oklab(0.810996 0.0443742 -0.101714 / 0.7) 100%);
```

```css
background-image: radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(251, 146, 60, 0.06) 40%, rgba(0, 0, 0, 0) 70%);
```

```css
background-image: linear-gradient(rgb(245, 244, 239), rgb(234, 232, 225), rgb(229, 227, 219));
```

```css
background-image: repeating-linear-gradient(-35deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 6px, rgba(0, 0, 0, 0.5) 6px, rgba(0, 0, 0, 0.5) 7px);
```

```css
background-image: radial-gradient(rgb(139, 105, 20) 0%, rgba(0, 0, 0, 0) 70%);
```

```css
background-image: radial-gradient(circle, rgb(160, 144, 112), rgba(0, 0, 0, 0) 70%);
```

```css
background-image: radial-gradient(circle, rgba(0, 0, 0, 0) 45%, rgba(255, 50, 120, 0.25) 55%, rgba(255, 50, 120, 0.12) 70%, rgba(0, 0, 0, 0) 85%);
```

```css
background-image: radial-gradient(circle, rgba(0, 0, 0, 0) 45%, rgba(0, 200, 255, 0.25) 55%, rgba(0, 200, 255, 0.12) 70%, rgba(0, 0, 0, 0) 85%);
```

```css
background-image: radial-gradient(circle, rgba(0, 0, 0, 0) 48%, rgba(99, 102, 241, 0.08) 58%, rgba(139, 92, 246, 0.12) 68%, rgba(99, 102, 241, 0.04) 80%, rgba(0, 0, 0, 0) 92%);
```

```css
background-image: linear-gradient(rgb(212, 212, 212), rgb(161, 161, 170));
```

```css
background-image: radial-gradient(80% 50% at 50% 0%, rgba(79, 70, 229, 0.07), rgba(0, 0, 0, 0) 60%);
```

```css
background-image: radial-gradient(70% 60% at 30% 50%, rgba(239, 68, 68, 0.11), rgba(0, 0, 0, 0) 65%);
```

```css
background-image: radial-gradient(70% 60% at 70% 50%, rgba(163, 230, 53, 0.11), rgba(0, 0, 0, 0) 65%);
```

```css
background-image: radial-gradient(70% 60% at 30% 50%, rgba(34, 211, 238, 0.11), rgba(0, 0, 0, 0) 65%);
```

```css
background-image: radial-gradient(80% 55% at 50% 100%, rgba(79, 70, 229, 0.06), rgba(0, 0, 0, 0) 60%);
```

```css
background-image: linear-gradient(to top, rgba(251, 146, 60, 0.1), rgba(129, 140, 248, 0.05) 55%, rgba(0, 0, 0, 0));
```

```css
background-image: linear-gradient(105deg, rgb(129, 140, 248), rgb(196, 181, 253) 45%, rgb(251, 146, 60));
```

```css
background-image: linear-gradient(rgb(63, 63, 70), rgb(82, 82, 91));
```

```css
background-image: linear-gradient(90deg, rgb(79, 70, 229), rgb(139, 92, 246), rgb(251, 146, 60));
```

```css
background-image: linear-gradient(165deg, rgb(28, 26, 40), rgb(20, 18, 31));
```

```css
background-image: radial-gradient(75% 50% at 50% 0%, rgba(79, 70, 229, 0.08), rgba(0, 0, 0, 0) 60%);
```

```css
background-image: linear-gradient(145deg, rgb(30, 27, 75), rgb(49, 46, 129) 55%, rgb(67, 56, 202));
```

```css
background-image: linear-gradient(105deg, rgba(0, 0, 0, 0) 30%, rgba(255, 255, 255, 0.6) 45%, rgba(0, 0, 0, 0) 55%);
```

```css
background-image: linear-gradient(rgb(42, 42, 44), rgb(35, 35, 37));
```

```css
background-image: linear-gradient(90deg, rgb(251, 146, 60), rgb(251, 191, 36));
```

```css
background-image: radial-gradient(70% 55% at 50% 100%, rgba(251, 146, 60, 0.07), rgba(0, 0, 0, 0) 60%);
```

```css
background-image: linear-gradient(135deg, rgb(251, 146, 60), rgb(249, 115, 22));
```

```css
background-image: linear-gradient(105deg, rgba(0, 0, 0, 0) 35%, rgba(255, 255, 255, 0.7) 48%, rgba(0, 0, 0, 0) 58%);
```

```css
background-image: radial-gradient(70% 55% at 50% 0%, rgba(79, 70, 229, 0.08), rgba(0, 0, 0, 0) 60%);
```

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#1a1a2e` | text, border, background | 1842 |
| `#ffffff` | text, border, background | 496 |
| `#000000` | text, border, background | 190 |
| `#fb923c` | background, text, border | 94 |
| `#71717a` | border, text | 33 |
| `#91a4ff` | text, border | 32 |
| `#d4d4d8` | background, text, border | 26 |
| `#515b6d` | border, text | 22 |
| `#8d74ff` | text, border | 18 |
| `#52525b` | text, border | 12 |
| `#a1a1aa` | text, border | 10 |
| `#9ca3af` | background, text, border | 9 |
| `#5d73ff` | text, border | 8 |
| `#22d3ee` | background, text, border | 8 |
| `#a3e635` | background, text, border | 8 |
| `#6366f1` | background, text, border | 7 |
| `#14121f` | background | 6 |
| `#f5060a` | text, border, background | 6 |
| `#00a849` | background, border | 6 |
| `#34d399` | text, background, border | 5 |
| `#ff7c00` | text, border | 4 |
| `#ff7a24` | text, border | 4 |
| `#dc2626` | background, border | 4 |
| `#8b5cf6` | background, text, border | 4 |
| `#ef4444` | text, border | 4 |
| `#3f3f46` | text, border | 4 |
| `#4f46e5` | text, background, border | 3 |
| `#fbbf24` | text, background, border | 3 |
| `#09090b` | background | 2 |
| `#c4b5fd` | border | 2 |

## Typography

### Font Families

- **Space Grotesk** — used for all (200 elements)
- **Inter** — used for body (185 elements)
- **Arial** — used for body (30 elements)
- **Times New Roman** — used for all (22 elements)
- **Geist Mono** — used for mono (104 elements)

### Type System

- **Scale ratio** — 1.125 (major second), anchored at 8px · 96% of sizes sit on the ladder
- **Measure** — ~165 characters per line (wide, medium confidence from 3 samples)
- **Fluid type** — none; sizes are fixed per breakpoint

### Named Scale

| Role | Size | Weight | Line Height | Tracking |
|------|------|--------|-------------|----------|
| `display` | 340px / 21.25rem | 800 | 340px | normal |
| `title-1` | 281.6px / 17.6rem | 900 | 281.6px | normal |
| `h3` | 140.8px / 8.8rem | 900 | 140.8px | -3.52px |
| `body` | 102.4px / 6.4rem | 800 | 102.4px | -2.048px |
| `body-sm` | 96px / 6rem | 800 | 144px | -2px |
| `micro` | 76.8px / 4.8rem | 800 | 72.96px | -1.92px |
| `sm-3` | 72px / 4.5rem | 900 | 72px | normal |
| `sm-4` | 64px / 4rem | 700 | 70.4px | -0.4px |
| `h2` | 60px / 3.75rem | 700 | 60px | -1.5px |
| `sm-5` | 57.6px / 3.6rem | 800 | 57.6px | -1.44px |
| `sm-6` | 48px / 3rem | 700 | 48px | -1.2px |
| `sm-7` | 36px / 2.25rem | 700 | 40px | -0.9px |
| `h1` | 35.2px / 2.2rem | 800 | 35.2px | -0.88px |
| `sm-8` | 33.6px / 2.1rem | 800 | 50.4px | -0.84px |
| `sm-9` | 30px / 1.875rem | 700 | 36px | -0.75px |

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 340px | 21.25rem | 800 | 340px | normal | span |
| 281.6px | 17.6rem | 900 | 281.6px | normal | span |
| 140.8px | 8.8rem | 900 | 140.8px | -3.52px | h3 |
| 102.4px | 6.4rem | 800 | 102.4px | -2.048px | span |
| 96px | 6rem | 800 | 144px | -2px | text |
| 76.8px | 4.8rem | 800 | 72.96px | -1.92px | h3, span |
| 72px | 4.5rem | 900 | 72px | normal | span |
| 64px | 4rem | 700 | 70.4px | -0.4px | span |
| 60px | 3.75rem | 700 | 60px | -1.5px | h2, span |
| 57.6px | 3.6rem | 800 | 57.6px | -1.44px | span |
| 48px | 3rem | 700 | 48px | -1.2px | h2, span, svg, path |
| 36px | 2.25rem | 700 | 40px | -0.9px | span |
| 35.2px | 2.2rem | 800 | 35.2px | -0.88px | span, h1, svg, path |
| 33.6px | 2.1rem | 800 | 50.4px | -0.84px | p |
| 30px | 1.875rem | 700 | 36px | -0.75px | a, span, img, h3 |

### Heading Scale

```css
h3 { font-size: 140.8px; font-weight: 900; line-height: 140.8px; }
h3 { font-size: 76.8px; font-weight: 800; line-height: 72.96px; }
h2 { font-size: 60px; font-weight: 700; line-height: 60px; }
h2 { font-size: 48px; font-weight: 700; line-height: 48px; }
h1 { font-size: 35.2px; font-weight: 800; line-height: 35.2px; }
h3 { font-size: 30px; font-weight: 700; line-height: 36px; }
h3 { font-size: 18px; font-weight: 800; line-height: 18px; }
h3 { font-size: 16px; font-weight: 400; line-height: 24px; }
```

### Body Text

```css
body { font-size: 102.4px; font-weight: 800; line-height: 102.4px; }
```

### Font Weights in Use

`400` (1223x), `700` (192x), `800` (170x), `600` (23x), `500` (23x), `900` (11x)

## Spacing

**Base unit:** 2px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-1 | 1px | 0.0625rem |
| spacing-56 | 56px | 3.5rem |
| spacing-64 | 64px | 4rem |
| spacing-71 | 71px | 4.4375rem |
| spacing-80 | 80px | 5rem |
| spacing-96 | 96px | 6rem |
| spacing-104 | 104px | 6.5rem |
| spacing-112 | 112px | 7rem |
| spacing-121 | 121px | 7.5625rem |
| spacing-160 | 160px | 10rem |
| spacing-168 | 168px | 10.5rem |
| spacing-232 | 232px | 14.5rem |
| spacing-265 | 265px | 16.5625rem |
| spacing-370 | 370px | 23.125rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| sm | 4px | 11 |
| md | 8px | 8 |
| lg | 12px | 19 |
| lg | 16px | 31 |
| xl | 24px | 9 |
| full | 28px | 3 |

## Elevation

6 levels from 16 raw shadows · neutral tint

**xs** — blur 14px, y 0px, used 2× · tinted (hue 258°)
```css
box-shadow: rgba(139, 92, 246, 0.35) 0px 0px 14px 0px;
```

**sm** — blur 18px, y 6px, used 3× · tinted (hue 239°)
```css
box-shadow: rgba(99, 102, 241, 0.45) 0px 6px 18px 0px;
```

**md** — blur 30px, y 0px, used 1×
```css
box-shadow: color(srgb 0.388235 0.4 0.945098 / 0.25) 0px 0px 30px 0px;
```

**lg** — blur 32px, y 8px, used 7× · 2 layers
```css
box-shadow: rgba(0, 0, 0, 0.14) 0px 8px 32px 0px, rgba(0, 0, 0, 0.06) 0px 2px 8px 0px;
```

**xl** — blur 50px, y 20px, used 6×
```css
box-shadow: rgba(0, 0, 0, 0.25) 0px 20px 50px 0px;
```

**2xl** — blur 60px, y 30px, used 1× · 2 layers
```css
box-shadow: color(srgb 0.388235 0.4 0.945098 / 0.16) 0px 0px 55px 0px, rgba(0, 0, 0, 0.35) 0px 30px 60px 0px;
```

## Inset Shadows

```css
box-shadow: rgba(0, 0, 0, 0.1) 0px 12px 35px 0px, rgba(0, 0, 0, 0.04) 0px 2px 6px 0px, rgba(255, 255, 255, 0.6) 0px 1px 0px 0px inset;
```

```css
box-shadow: rgba(0, 0, 0, 0.5) 0px 30px 80px 0px, rgba(239, 68, 68, 0.12) 0px 0px 70px 0px, rgba(255, 255, 255, 0.06) 0px 1px 0px 0px inset;
```

```css
box-shadow: rgba(0, 0, 0, 0.5) 0px 30px 80px 0px, rgba(163, 230, 53, 0.12) 0px 0px 70px 0px, rgba(255, 255, 255, 0.06) 0px 1px 0px 0px inset;
```

```css
box-shadow: rgba(0, 0, 0, 0.5) 0px 30px 80px 0px, rgba(34, 211, 238, 0.12) 0px 0px 70px 0px, rgba(255, 255, 255, 0.06) 0px 1px 0px 0px inset;
```

```css
box-shadow: rgba(79, 70, 229, 0.4) 0px 30px 70px 0px, rgba(139, 92, 246, 0.12) 0px 0px 120px 0px, rgba(255, 255, 255, 0.1) 0px 1px 0px 0px inset;
```

## CSS Custom Properties

### Colors

```css
--bg-void: #09090b;
--bg-ink: #14121f;
--bg-surface: #ffffff0a;
--bg-surface-hover: #ffffff12;
--border-glow: #ffffff14;
--border-glow-hover: #ffffff24;
--text-primary: #fafafa;
--text-secondary: #a1a1aa;
--text-muted: #52525b;
--accent-brand: #4f46e5;
--accent-electric: #6366f1;
--accent-electric-hover: #818cf8;
--accent-violet: #8b5cf6;
--accent-cyan: #22d3ee;
--accent-peach: #fb923c;
--accent-acid: #a3e635;
--accent-fomo: #facc15;
--accent-rebel: #ef4444;
--color-zinc-100: lab(96.1634% .0993311 -.364041);
--color-amber-400: lab(80.1641% 16.6016 99.2089);
--tw-ring-shadow: 0 0 #0000;
--color-zinc-200: lab(90.6853% .399232 -1.45452);
--color-indigo-400: lab(59.866% 22.4834 -64.4485);
--color-cyan-400: lab(76.6045% -40.9406 -29.6231);
--color-emerald-300: lab(83.9203% -48.7124 13.8849);
--color-pink-300: lab(77.8308% 38.525 -10.5394);
--color-pink-500: lab(56.9303% 76.8162 -8.07021);
--color-violet-600: lab(41.088% 68.9966 -91.995);
--color-orange-600: lab(57.1026% 64.2584 89.8886);
--color-cyan-300: lab(85.3886% -36.7636 -21.5716);
--color-orange-200: lab(88.4871% 9.94918 28.8378);
--color-pink-400: lab(64.5597% 64.3615 -12.7988);
--color-indigo-300: lab(74.0235% 8.54138 -41.6075);
--tw-inset-ring-shadow: 0 0 #0000;
--color-red-200: lab(86.017% 19.8815 7.75869);
--color-gray-300: lab(85.1236% -.612259 -3.7138);
--color-cyan-200: lab(91.0821% -24.0435 -12.8306);
--color-amber-300: lab(86.4156% 6.13147 78.3961);
--color-gray-500: lab(47.7841% -.393182 -10.0268);
--color-zinc-50: lab(98.26% 0 0);
--color-green-500: lab(70.5521% -66.5147 45.8073);
--color-emerald-600: lab(55.0481% -49.9246 15.93);
--color-violet-400: lab(62.8239% 34.9159 -60.0512);
--tw-ring-offset-color: #fff;
--color-red-400: lab(63.7053% 60.745 31.3109);
--color-white: #fff;
--color-gray-400: lab(65.9269% -.832707 -8.17473);
--color-indigo-50: lab(95.4818% .411302 -6.78529);
--color-lime-300: lab(89.9218% -35.6546 68.5254);
--color-red-500: lab(55.4814% 75.0732 48.8528);
--tw-ring-offset-width: 0px;
--color-zinc-300: lab(84.9837% .601262 -2.17986);
--color-zinc-700: lab(26.8019% 1.35387 -4.68303);
--color-indigo-600: lab(38.4009% 52.6132 -92.3857);
--color-lime-500: lab(75.3197% -46.6547 86.1778);
--color-pink-100: lab(93.5864% 9.01193 -3.15079);
--color-orange-300: lab(80.8059% 21.7313 50.4455);
--tw-ring-offset-shadow: 0 0 #0000;
--color-green-600: lab(59.0978% -58.6621 41.2579);
--color-violet-300: lab(76.7419% 18.3911 -37.0706);
--color-zinc-500: lab(47.8878% 1.65477 -5.77283);
--color-red-300: lab(76.5514% 36.422 15.5335);
--color-sky-300: lab(80.3307% -20.2945 -31.385);
--color-cyan-500: lab(67.805% -35.3952 -30.2018);
--color-zinc-800: lab(15.7305% .613764 -2.16959);
--color-orange-500: lab(64.272% 57.1788 90.3583);
--color-emerald-900: lab(28.8637% -26.9249 5.45986);
--color-sky-400: lab(70.687% -23.6078 -45.9483);
--color-orange-400: lab(70.0429% 42.5156 75.8207);
--color-violet-100: lab(93.0838% 4.35197 -9.88284);
--color-green-400: lab(78.503% -64.9265 39.7492);
--color-indigo-200: lab(84.4329% 3.18977 -23.9688);
--color-emerald-500: lab(66.9756% -58.27 19.5419);
--color-zinc-400: lab(65.6464% 1.53497 -5.42429);
--color-zinc-600: lab(35.1166% 1.78212 -6.1173);
--color-indigo-500: lab(48.295% 38.3129 -81.9673);
--color-gray-600: lab(35.6337% -1.58697 -10.8425);
--tw-border-style: solid;
--color-cyan-900: lab(30.372% -13.1853 -18.7887);
--color-lime-400: lab(83.7876% -45.0447 88.4738);
--color-indigo-700: lab(32.4486% 49.2217 -84.6695);
--color-black: #000;
--color-red-950: lab(13.003% 29.04 16.7519);
--color-emerald-400: lab(75.0771% -60.7313 19.4147);
--color-indigo-900: lab(23.3911% 24.6978 -50.4718);
--color-indigo-100: lab(91.6577% 1.04591 -12.7199);
--color-violet-50: lab(96.2416% 2.28849 -5.51657);
```

### Spacing

```css
--font-space-grotesk: "Space Grotesk", "Space Grotesk Fallback";
--spacing: .25rem;
--tw-space-y-reverse: 0;
```

### Typography

```css
--text-hero: clamp(3rem, 8vw, 7rem);
--text-display: clamp(2rem, 5vw, 4rem);
--text-title: clamp(1.25rem, 3vw, 1.75rem);
--text-body: 1rem;
--text-caption: .875rem;
--text-2xl: 1.5rem;
--text-7xl: 4.5rem;
--text-lg: 1.125rem;
--font-body: "Inter", "Inter Fallback";
--text-5xl--line-height: 1;
--text-base--line-height: calc(1.5 / 1);
--tracking-wider: .05em;
--text-lg--line-height: calc(1.75 / 1.125);
--font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
--font-weight-bold: 700;
--text-6xl: 3.75rem;
--text-xs--line-height: calc(1 / .75);
--default-font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
--font-geist-mono: "Geist Mono", "Geist Mono Fallback";
--font-inter: "Inter", "Inter Fallback";
--text-7xl--line-height: 1;
--text-xl: 1.25rem;
--leading-relaxed: 1.625;
--leading-snug: 1.375;
--font-weight-black: 900;
--text-2xl--line-height: calc(2 / 1.5);
--tracking-wide: .025em;
--text-xl--line-height: calc(1.75 / 1.25);
--font-weight-semibold: 600;
--text-sm: .875rem;
--leading-tight: 1.25;
--font-weight-extrabold: 800;
--text-4xl: 2.25rem;
--tracking-normal: 0em;
--text-sm--line-height: calc(1.25 / .875);
--text-3xl--line-height: calc(2.25 / 1.875);
--text-5xl: 3rem;
--text-3xl: 1.875rem;
--text-xs: .75rem;
--tracking-widest: .1em;
--font-weight-medium: 500;
--text-6xl--line-height: 1;
--text-4xl--line-height: calc(2.5 / 2.25);
--text-base: 1rem;
--default-mono-font-family: "Geist Mono", "Geist Mono Fallback";
--tracking-tight: -.025em;
```

### Shadows

```css
--tw-inset-shadow-alpha: 100%;
--tw-drop-shadow-alpha: 100%;
--tw-inset-shadow: 0 0 #0000;
--tw-shadow-alpha: 100%;
--tw-shadow: 0 0 #0000;
```

### Radii

```css
--radius-sm: .25rem;
--radius-2xl: 1rem;
--radius-md: .375rem;
--radius-lg: .5rem;
--radius-3xl: 1.5rem;
--radius-xl: .75rem;
```

### Other

```css
--lightningcss-light: initial;
--lightningcss-dark: ;
--glow-blue: #6366f166;
--glow-violet: #8b5cf666;
--glow-cyan: #22d3ee4d;
--container-md: 28rem;
--tw-outline-style: solid;
--animate-ping: ping 1s cubic-bezier(0, 0, .2, 1) infinite;
--tw-gradient-from: rgba(0, 0, 0, 0);
--tw-gradient-to: rgba(0, 0, 0, 0);
--blur-3xl: 64px;
--tw-scale-z: 1;
--container-sm: 24rem;
--tw-gradient-via-position: 50%;
--container-lg: 32rem;
--tw-gradient-to-position: 100%;
--default-transition-duration: .15s;
--animate-pulse: pulse 2s cubic-bezier(.4, 0, .6, 1) infinite;
--tw-gradient-from-position: 0%;
--ease-in-out: cubic-bezier(.4, 0, .2, 1);
--default-transition-timing-function: cubic-bezier(.4, 0, .2, 1);
--container-5xl: 64rem;
--tw-translate-z: 0;
--tw-gradient-via: rgba(0, 0, 0, 0);
--tw-scale-y: 1;
--container-6xl: 72rem;
--container-3xl: 48rem;
--tw-translate-y: 0;
--blur-md: 12px;
--ease-out: cubic-bezier(0, 0, .2, 1);
--animate-spin: spin 1s linear infinite;
--container-4xl: 56rem;
--tw-divide-y-reverse: 0;
--container-2xl: 42rem;
--tw-translate-x: 0;
--tw-scale-x: 1;
--animate-bounce: bounce 1s infinite;
--container-xl: 36rem;
--blur-sm: 8px;
```

### Semantic

```css
--color-green-500: lab(70.5521% -66.5147 45.8073);
--color-green-600: lab(59.0978% -58.6621 41.2579);
--color-green-400: lab(78.503% -64.9265 39.7492);
--color-amber-400: lab(80.1641% 16.6016 99.2089);
--color-amber-300: lab(86.4156% 6.13147 78.3961);
--color-red-200: lab(86.017% 19.8815 7.75869);
--color-red-400: lab(63.7053% 60.745 31.3109);
--color-red-500: lab(55.4814% 75.0732 48.8528);
--color-red-300: lab(76.5514% 36.422 15.5335);
--color-red-950: lab(13.003% 29.04 16.7519);
--glow-blue: #6366f166;
```

## Transitions & Animations

**Easing functions:** `cubic-bezier(0.4, 0, 0.2, 1)`, `cubic-bezier(0, 0, 0.2, 1)`

**Durations:** `0.5s`, `0.2s`, `0.15s`, `0.3s`, `0.45s`

### Common Transitions

```css
transition: all;
transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), outline-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), text-decoration-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), fill 0.2s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.2s cubic-bezier(0.4, 0, 0.2, 1), --tw-gradient-from 0.2s cubic-bezier(0.4, 0, 0.2, 1), --tw-gradient-via 0.2s cubic-bezier(0.4, 0, 0.2, 1), --tw-gradient-to 0.2s cubic-bezier(0.4, 0, 0.2, 1);
transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
transition: color 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), outline-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), text-decoration-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), fill 0.15s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.15s cubic-bezier(0.4, 0, 0.2, 1), --tw-gradient-from 0.15s cubic-bezier(0.4, 0, 0.2, 1), --tw-gradient-via 0.15s cubic-bezier(0.4, 0, 0.2, 1), --tw-gradient-to 0.15s cubic-bezier(0.4, 0, 0.2, 1);
transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), outline-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), text-decoration-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), fill 0.3s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s cubic-bezier(0.4, 0, 0.2, 1), --tw-gradient-from 0.3s cubic-bezier(0.4, 0, 0.2, 1), --tw-gradient-via 0.3s cubic-bezier(0.4, 0, 0.2, 1), --tw-gradient-to 0.3s cubic-bezier(0.4, 0, 0.2, 1);
transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
transition: 0.3s cubic-bezier(0, 0, 0.2, 1);
transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), translate 0.15s cubic-bezier(0.4, 0, 0.2, 1), scale 0.15s cubic-bezier(0.4, 0, 0.2, 1), rotate 0.15s cubic-bezier(0.4, 0, 0.2, 1);
transition: border-color 0.45s, box-shadow 0.45s, transform 0.45s;
```

### Keyframe Animations

**svg-draw**
```css
@keyframes svg-draw {
  100% { stroke-dashoffset: 0; }
}
```

**login-dot-blink**
```css
@keyframes login-dot-blink {
  0%, 25% { opacity: 0; }
  50%, 100% { opacity: 1; }
}
```

**ft-pop**
```css
@keyframes ft-pop {
  0% { transform: scale(0.82) rotate(-8deg); }
  60% { transform: scale(1.16) rotate(4deg); }
  100% { transform: scale(1) rotate(0deg); }
}
```

**wash-pulse**
```css
@keyframes wash-pulse {
  0% { opacity: 0.65; }
  100% { opacity: 1; }
}
```

**marquee**
```css
@keyframes marquee {
  0% { transform: translate(0px); }
  100% { transform: translate(-50%); }
}
```

**shimmer**
```css
@keyframes shimmer {
  0% { transform: translate(-100%) rotate(105deg); }
  50% { transform: translate(100%) rotate(105deg); }
  100% { transform: translate(-100%) rotate(105deg); }
}
```

**waveform**
```css
@keyframes waveform {
  0% { opacity: 0.4; height: 3px; }
  100% { opacity: 1; height: 20px; }
}
```

**ambientOrbA**
```css
@keyframes ambientOrbA {
  0%, 100% { transform: translate(0px) scale(1); }
  25% { transform: translate(8vw, 12vh) scale(1.08); }
  50% { transform: translate(3vw, 20vh) scale(0.95); }
  75% { transform: translate(-5vw, 8vh) scale(1.04); }
}
```

**ambientOrbB**
```css
@keyframes ambientOrbB {
  0%, 100% { transform: translate(0px) scale(1); }
  25% { transform: translate(-10vw, -8vh) scale(1.06); }
  50% { transform: translate(-5vw, -15vh) scale(0.92); }
  75% { transform: translate(6vw, -5vh) scale(1.03); }
}
```

**ambientOrbC**
```css
@keyframes ambientOrbC {
  0%, 100% { transform: translate(0px) scale(1); }
  33% { transform: translate(6vw, -10vh) scale(1.1); }
  66% { transform: translate(-8vw, 6vh) scale(0.9); }
}
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Buttons (3 instances)

```css
.buttons {
  background-color: rgba(255, 255, 255, 0.06);
  color: rgb(255, 255, 255);
  font-size: 14px;
  font-weight: 700;
  padding-top: 14px;
  padding-right: 32px;
  border-radius: 12px;
}
```

### Cards (23 instances)

```css
.cards {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 20px 50px 0px;
  padding-top: 24px;
  padding-right: 24px;
}
```

### Inputs (2 instances)

```css
.inputs {
  background-color: oklab(0.999994 0.0000455678 0.0000200868 / 0.05);
  color: lab(96.1634 0.0993311 -0.364041);
  border-color: rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  font-size: 14px;
  padding-top: 14px;
  padding-right: 20px;
}
```

### Links (52 instances)

```css
.links {
  color: rgb(250, 250, 250);
  font-size: 16px;
  font-weight: 400;
}
```

### Navigation (4 instances)

```css
.navigation {
  color: rgb(250, 250, 250);
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  position: static;
}
```

### Footer (1 instances)

```css
.footer {
  color: rgb(26, 26, 46);
  padding-top: 0px;
  padding-bottom: 0px;
  font-size: 16px;
}
```

### Badges (24 instances)

```css
.badges {
  background-color: oklab(0.999994 0.0000455678 0.0000200868 / 0.04);
  color: lab(47.8878 1.65477 -5.77283);
  font-size: 12px;
  font-weight: 500;
  padding-top: 6px;
  padding-right: 12px;
  border-radius: 3.35544e+07px;
}
```

### ProgressBars (6 instances)

```css
.progressBars {
  color: rgb(26, 26, 46);
  border-radius: 3.35544e+07px;
  font-size: 16px;
}
```

## Component Clusters

Reusable component instances grouped by DOM structure and style similarity:

### Button — 2 instances, 1 variant

**Variant 1** (2 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(255, 255, 255);
  padding: 14px 32px 14px 32px;
  border-radius: 8px;
  border: 0px solid rgb(255, 255, 255);
  font-size: 14px;
  font-weight: 700;
```

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(255, 255, 255, 0.06);
  color: rgb(250, 250, 250);
  padding: 0px 0px 0px 0px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 16px;
  font-weight: 400;
```

### Card — 4 instances, 1 variant

**Variant 1** (4 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(26, 26, 46);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px solid rgb(26, 26, 46);
  font-size: 16px;
  font-weight: 400;
```

### Card — 8 instances, 1 variant

**Variant 1** (8 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(26, 26, 46);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px solid rgb(26, 26, 46);
  font-size: 16px;
  font-weight: 400;
```

### Card — 2 instances, 1 variant

**Variant 1** (2 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(26, 26, 46);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px solid rgb(26, 26, 46);
  font-size: 16px;
  font-weight: 400;
```

### Card — 7 instances, 1 variant

**Variant 1** (7 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(26, 26, 46);
  padding: 36px 36px 36px 36px;
  border-radius: 24px;
  border: 1px solid color(srgb 0.388235 0.4 0.945098 / 0.55);
  font-size: 16px;
  font-weight: 400;
```

### Input — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: oklab(0.999994 0.0000455678 0.0000200868 / 0.05);
  color: lab(96.1634 0.0993311 -0.364041);
  padding: 14px 20px 14px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 14px;
  font-weight: 400;
```

## Layout System

**8 grid containers** and **263 flex containers** detected.

### The System

- **Content column** — 1152px wide, 24px gutters (2% edge density)
  - Width ladder: 576px · 672px · 768px · 896px · 1152px · 1280px
- **Column system** — 2 columns
- **Section rhythm** — 80px vertical padding (ladder: 32px · 48px · 80px · 112px · 128px)
- **Gap scale** — 1px · 4px · 6px · 8px · 10px · 12px · 14px · 16px
- **Fluid layout** — 2 clamp/viewport declarations

```css
.w-\[min\(80vw\,520px\)\] { width: min(80vw, 520px); }
.w-\[min\(86vw\,440px\)\] { width: min(86vw, 440px); }
```

### Container Widths

| Max Width | Padding |
|-----------|---------|
| 1152px | 24px |
| 1280px | 0px |
| 896px | 0px |
| 768px | 0px |

### Grid Column Patterns

| Columns | Usage Count |
|---------|-------------|
| 2-column | 4x |
| 3-column | 4x |

### Grid Templates

```css
grid-template-columns: 370.656px 370.672px 370.656px;
gap: 20px;
grid-template-columns: 579.594px 428.406px;
gap: normal 96px;
grid-template-columns: 626.656px 501.344px;
gap: 24px;
grid-template-columns: 626.656px 501.344px;
gap: 24px;
grid-template-columns: 626.656px 501.344px;
gap: 24px;
```

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| column/nowrap | 39x |
| row/nowrap | 211x |
| row/wrap | 13x |

**Gap values:** `normal 96px`, `1px`, `2px`, `4px`, `6px`, `8px`, `8px 20px`, `10px`, `12px`, `12px 24px`, `14px`, `16px`, `20px`, `24px`, `32px`, `40px`

## Responsive Design

### Viewport Snapshots

| Viewport | Body Font | Nav Visible | Max Columns | Hamburger | Page Height |
|----------|-----------|-------------|-------------|-----------|-------------|
| mobile (375px) | 16px | Yes | 1 | Yes | 15232px |
| tablet (768px) | 16px | Yes | 3 | Yes | 19369px |
| desktop (1280px) | 16px | Yes | 3 | Yes | 16584px |
| wide (1920px) | 16px | Yes | 3 | Yes | 19695px |

### Breakpoint Changes

**375px → 768px** (mobile → tablet):
- H1 size: `22.4px` → `26.88px`
- Max grid columns: `1` → `3`
- Page height: `15232px` → `19369px`

**768px → 1280px** (tablet → desktop):
- H1 size: `26.88px` → `35.2px`
- Page height: `19369px` → `16584px`

**1280px → 1920px** (desktop → wide):
- Page height: `16584px` → `19695px`

## Interaction States

### Button States

**"Enter Pookpit"**
```css
/* Hover */
scale: none → 1.00671;
```
```css
/* Focus */
outline: rgb(255, 255, 255) none 3px → rgb(208, 208, 208) auto 2px;
scale: none → 1.04604;
```

**""**
```css
/* Focus */
outline: rgb(250, 250, 250) none 3px → rgb(230, 230, 230) auto 2px;
```

**"Lock my spot"**
```css
/* Hover */
box-shadow: none → rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, oklab(0.705008 0.143597 0.157306 / 0.172414) 0px 8.62068px 12.931px -2.5862px, oklab(0.705008 0.143597 0.157306 / 0.172414) 0px 3.44827px 5.17241px -3.44827px;
```
```css
/* Focus */
box-shadow: none → rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, oklab(0.705008 0.143597 0.157306 / 0.2) 0px 10px 15px -3px, oklab(0.705008 0.143597 0.157306 / 0.2) 0px 4px 6px -4px;
```

### Link Hover

```css
scale: none → 1.00536;
```

### Input Focus

```css
outline: lab(96.1634 0.0993311 -0.364041) none 3px → rgb(23, 23, 23) none 1px;
```

## Accessibility (WCAG 2.1)

**Overall Score: 100%** — 0 passing, 0 failing color pairs

## Design System Score

**Overall: 78/100 (Grade: C)**

| Category | Score |
|----------|-------|
| Color Discipline | 80/100 |
| Typography Consistency | 40/100 |
| Spacing System | 85/100 |
| Shadow Consistency | 78/100 |
| Border Radius Consistency | 90/100 |
| Accessibility | 100/100 |
| CSS Tokenization | 100/100 |

**Strengths:** Well-defined spacing scale, Consistent border radii, Strong accessibility compliance, Good CSS variable tokenization

**Issues:**
- 5 font families — consider limiting to 2 (heading + body)
- 28 distinct font sizes — consider a tighter type scale
- 793 duplicate CSS declarations

## Gradients

**42 unique gradients** detected.

| Type | Direction | Stops | Classification |
|------|-----------|-------|----------------|
| linear | 135deg | 3 | bold |
| linear | 135deg | 2 | brand |
| radial | — | 3 | bold |
| linear | 165deg | 2 | brand |
| radial | — | 3 | bold |
| linear | 145deg | 4 | bold |
| linear | 105deg | 3 | bold |
| radial | — | 2 | brand |
| repeating-linear | 0deg | 4 | bold |
| linear | to right | 3 | bold |
| linear | 105deg | 3 | bold |
| linear | 135deg | 2 | brand |
| linear | to top | 2 | brand |
| linear | to right | 2 | brand |
| radial | circle | 3 | bold |

```css
background: linear-gradient(135deg, rgb(79, 70, 229), rgb(99, 102, 241), rgb(139, 92, 246));
background: linear-gradient(135deg, rgb(79, 70, 229), rgb(99, 102, 241));
background: radial-gradient(70% 55% at 20% 100%, rgba(79, 70, 229, 0.1), rgba(0, 0, 0, 0) 60%);
background: linear-gradient(165deg, rgb(28, 26, 40), rgb(22, 20, 31));
background: radial-gradient(90% 80% at 50% 45%, rgba(0, 0, 0, 0) 60%, rgba(250, 250, 248, 0.65) 100%);
```

## Z-Index Map

**15 unique z-index values** across 2 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| sticky | 10,50 | div.h.e.r.o.-.c.a.r.d.-.r.i.g. .a.b.s.o.l.u.t.e. .i.n.s.e.t.-.0. .z.-.1.0, div.i.d.-.c.a.r.d.-.c.o.n.t.a.i.n.e.r. .a.b.s.o.l.u.t.e. .i.n.s.e.t.-.0. .z.-.1.0, div.r.e.v.e.a.l.-.f.x. .a.b.s.o.l.u.t.e. .i.n.s.e.t.-.0. .z.-.1.0. .f.l.e.x. .i.t.e.m.s.-.c.e.n.t.e.r. .j.u.s.t.i.f.y.-.c.e.n.t.e.r |
| base | -1,8 | div.f.i.x.e.d. .i.n.s.e.t.-.0. .p.o.i.n.t.e.r.-.e.v.e.n.t.s.-.n.o.n.e, div.a.b.s.o.l.u.t.e. .i.n.s.e.t.-.0. .z.-.0. .f.l.e.x. .i.t.e.m.s.-.c.e.n.t.e.r. .j.u.s.t.i.f.y.-.c.e.n.t.e.r, div.w.-.3.6. .m.d.:.w.-.4.4. .h.-.4.8. .m.d.:.h.-.5.6. .r.e.l.a.t.i.v.e. .-.m.x.-.3. .s.h.r.i.n.k.-.0. .m.d.:.-.m.x.-.4 |

## SVG Icons

**8 unique SVG icons** detected. Dominant style: **outlined**.

| Size Class | Count |
|------------|-------|
| xs | 2 |
| sm | 2 |
| lg | 1 |
| xl | 3 |

**Icon colors:** `currentColor`, `#FB923C`, `#EF4444`, `#6366F1`, `#4F46E5`

## Font Files

| Family | Source | Weights | Styles |
|--------|--------|---------|--------|
| Inter | self-hosted | 100 900 | normal |
| Geist Mono | self-hosted | 100 900 | normal |
| Space Grotesk | self-hosted | 300 700 | normal |

## Image Style Patterns

| Pattern | Count | Key Styles |
|---------|-------|------------|
| thumbnail | 2 | objectFit: fill, borderRadius: 0px, shape: square |

**Aspect ratios:** 4:3 (2x)

## Motion Language

**Feel:** mixed · **Scroll-linked:** yes

### Duration Tokens

| name | value | ms |
|---|---|---|
| `xs` | `150ms` | 150 |
| `sm` | `200ms` | 200 |
| `md` | `300ms` | 300 |
| `lg` | `450ms` | 450 |

### Easing Families

- **custom** (121 uses) — `cubic-bezier(0.4, 0, 0.2, 1)`
- **ease-out** (13 uses) — `cubic-bezier(0, 0, 0.2, 1)`

### Keyframes In Use

| name | kind | properties | uses |
|---|---|---|---|
| `svg-draw` | custom | stroke-dashoffset | 1 |
| `ft-pop` | rotate | transform | 1 |
| `wash-pulse` | fade | opacity | 3 |
| `marquee` | slide | transform | 2 |
| `shimmer` | slide | transform | 2 |
| `waveform` | fade | opacity, height | 64 |
| `ping` | reveal | opacity, transform | 9 |
| `bounce` | slide-y | animation-timing-function, transform | 1 |

## Component Anatomy

### card — 21 instances

**Slots:** media
**Sizes:** md · xl

### button — 3 instances

**Slots:** label
**Sizes:** lg · xl

## Brand Voice

**Tone:** friendly · **Pronoun:** we→you · **Headings:** Title Case (tight)

### Top CTA Verbs

- **enter** (1)
- **lock** (1)

### Button Copy Patterns

- "enter pookpit" (1×)
- "lock my spot" (1×)

### Sample Headings

> Arjun Mehta
> Your Campus. Unlocked.
> Campus life is broken.
> “BRO TRUST ME.”
“SEND ADVANCE.”
“LAST PRICE.”
> ALL THE CHATS.
NONE OF THE PLANS.
CLASSIC.
> WHO’S UP?
…
EXACTLY.
> POOKPIT
> Arjun Mehta
> Student Life, Unified.
> Campus Buy & Sell

## Page Intent

**Type:** `landing` (confidence 0.59)
**Description:** The strictly verified, private network for your university. Buy, sell, collaborate, and never miss out again.

Alternates: legal (0.4)

## Section Roles

Reading order (top→bottom): nav → nav → testimonial → nav → nav → testimonial → testimonial → testimonial → testimonial → testimonial → content → footer

| # | Role | Heading | Confidence |
|---|------|---------|------------|
| 0 | nav | — | 0.9 |
| 1 | nav | — | 0.9 |
| 2 | nav | — | 0.9 |
| 3 | nav | — | 0.9 |
| 4 | testimonial | Arjun Mehta | 0.8 |
| 5 | testimonial | Campus life is broken. | 0.8 |
| 6 | testimonial | POOKPIT | 0.8 |
| 7 | testimonial | Student Life, Unified. | 0.8 |
| 8 | testimonial | Where we’re live. | 0.8 |
| 9 | testimonial | Your campus isn’t on the map? Put it there. | 0.8 |
| 10 | content | WHAT’S UP ON SOCIALS | 0.3 |
| 11 | footer | YOURCAMPUS.
UNLOCKED. | 0.95 |

## Material Language

**Label:** `skeuomorphic` (confidence 0.35)

| Metric | Value |
|--------|-------|
| Avg saturation | 0.525 |
| Shadow profile | soft |
| Avg shadow blur | 0px |
| Max radius | 28px |
| backdrop-filter in use | no |
| Gradients | 42 |

## Imagery Style

**Label:** `icon-only` (confidence 0.6)
**Counts:** total 2, svg 0, icon 3, screenshot-like 0, photo-like 0
**Dominant aspect:** square-ish
**Radius profile on images:** square

## Component Library

**Detected:** `tailwindcss` (confidence 0.851)

Evidence:
- tailwind-like class density 81%

## Component Screenshots

13 retina crops written to `screenshots/`. Index: `*-screenshots.json`.

| Cluster | Variant | Size (px) | File |
|---------|---------|-----------|------|
| button--default--lg | 0 | 198 × 48 | `screenshots/button-default-lg-0.png` |
| button--default--xl | 0 | 52 × 52 | `screenshots/button-default-xl-0.png` |
| button--default--xl | 1 | 147 × 50 | `screenshots/button-default-xl-1.png` |
| card--default | 0 | 1280 × 800 | `screenshots/card-default-0.png` |
| card--default | 1 | 1280 × 800 | `screenshots/card-default-1.png` |
| card--default | 2 | 280 × 26 | `screenshots/card-default-2.png` |
| card--default--md | 0 | 530 × 469 | `screenshots/card-default-md-0.png` |
| card--default--md | 1 | 520 × 460 | `screenshots/card-default-md-1.png` |
| card--default--md | 2 | 520 × 460 | `screenshots/card-default-md-2.png` |
| card--default--xl | 0 | 371 × 226 | `screenshots/card-default-xl-0.png` |
| card--default--xl | 1 | 371 × 226 | `screenshots/card-default-xl-1.png` |
| card--default--xl | 2 | 371 × 226 | `screenshots/card-default-xl-2.png` |
| input--outline--xl | 0 | 417 × 50 | `screenshots/input-outline-xl-0.png` |

Full-page: `screenshots/full-page.png`

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `Space Grotesk` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
