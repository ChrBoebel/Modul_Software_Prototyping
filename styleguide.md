# Stadtwerke Konstanz Styleguide (Strict & Comprehensive)

Based on deep analysis of `https://www.stadtwerke-konstanz.de/styleguide/`

## 1. Colors (Farben)

### Primary Colors
- **Red (Main Brand Color)**: `rgb(226, 0, 26)` / `#E2001A`
- **White**: `rgb(255, 255, 255)` / `#FFFFFF`
- **Black**: `rgb(0, 0, 0)` / `#000000`

### Secondary & Semantic Palette
- **Blue (Accent)**: `#2358A1` (Stadtwerke Blue)
- **Backgrounds**: `#F6F6F6` (Light Gray Sections), `#FFFFFF` (Cards)
- **Success**: `#10b981` (Standard Green)
- **Warning**: `#f59e0b` (Standard Amber)
- **Error**: `#dc2626` (Red equivalent)

## 2. Typography (Schriftformate)
**Font Family**: `Germalt`, `Arial`, sans-serif.
*Implementation Note*: Use `Outfit` as the closest geometric sans-serif substitute.

| Type | Size (px) | Weight | Color | Line Height |
| :--- | :--- | :--- | :--- | :--- |
| **H1** | 40px | 900 (Black) | Black / White | 1.2 |
| **H2** | 24px | 700 (Bold) | Black / White | 1.25 |
| **H3** | 18px | 700 (Bold) | Black / White | 1.3 |
| **Body** | 16px | 300 (Light) | Black (`rgb(0,0,0)`) | 1.5 |
| **Link** | 16px | 700 (Bold) | `var(--primary)` | Normal |

## 3. UI Components (Elemente)

### Buttons
- **Primary Button**:
    - Bg: `#E2001A` | Text: White
    - Weight: `700`
    - Padding: `12px 24px`
    - Radius: `4px` or `8px` (Standardized to match Input radius logic)
- **Secondary Button**:
    - Bg: White | Text: Black | Border: `#E2e8f0`

### Inputs & Forms
- **Radius**: `12px` (Strictly observed).
- **Label**: Font Weight 600, Text Color Primary.
- **Border**: `#cbd5e1` (Slate 300).
- **Focus**: Ring `3px` with `var(--primary-light)`.

### Cards & Containers
- **Card Radius**: `12px`
- **Card Shadow**: `0 1px 3px rgba(0,0,0,0.1)` (Subtle)
- **Background**: White `#FFFFFF`

### Tables (Tabellen)
- **Header**: Bg `#F8FAFC`, Text `#64748B`, UpperCase, Weight 600.
- **Cells**: Padding `16px`, Border Bottom `1px solid #E2E8F0`.
- **Hover**: Row background `#F8FAFC`.

## 4. Spacing & Grid
- **Global Radius**: `--radius-lg: 12px`.
- **Section Padding**: `2rem` (32px) to `4rem` (64px).
- **Grid Gap**: `1.5rem` (24px).

## Implementation Rules
1. **Font**: `Outfit` (Weights: 300, 700, 900).
2. **Colors**: NO Hex codes in components. Use `var(--swk-red)`, `var(--swk-blue)`.
3. **Icons**: Lucide Icons, stroke width 1.5 or 2, colored `var(--primary)` or `var(--text-secondary)`.
