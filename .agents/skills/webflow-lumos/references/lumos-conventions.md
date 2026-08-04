# Lumos v2 conventions

Anchored to **Lumos v2.2.3** (current as of Aug 2026, confirmed at https://lumos-framework.webflow.io).
Docs: https://lumos.timothyricks.com/ → redirects to the Notion doc set.

> **Version-drift warning.** The public GitHub artifacts (`lumosframework/lumos-v2`) have not changed
> since v2.1.0, and the v2.2.x changelog is published only inside a Notion database and a YouTube
> video — it is not machine-readable. Everything below is the *grammar*, which has been stable across
> v2.0.x–v2.2.x. **The specific class and variable inventory must always come from live discovery,
> never from this file.**
>
> Also install the official Lumos skill: https://github.com/lumosframework/skill — it ships from the
> framework author and will carry details this file cannot.

---

## 1. The three class types

Lumos divides every class into exactly three types. The separator tells you which is which:
**underscore = custom, dash = utility or combo.**

| Type | Prefix | Separator | Position in the stack |
|---|---|---|---|
| **Custom** | none (component name is the prefix) | `_` underscore | **always first** |
| **Utility** | `u-` | `-` dash | stacked on a custom class |
| **Combo** | `is-` | `-` dash | stacked on a custom class |

### Custom classes

Grammar: **`type_variation(optional)_element`**

```
hero_secondary_wrap
hero_secondary_contain
hero_secondary_title
hero_secondary_text
```

Rules (verbatim from the docs):

- Underscores between words, never dashes
- **Never more than 3 underscores**
- **Always the first class applied to an element**
- **`_wrap` marks the start of a new component**
- Every element should have a custom class

Child groups prevent collisions — `.footer_link_wrap` is a child group inside `.footer_wrap`, so both
can have a `_text` child without clashing.

Element names are deliberately reusable across components: `wrap`, `contain`, `layout`, `content`,
`visual`, `title`, `text`. The *prefix* carries the uniqueness, not the element name.

**Documented exceptions** — the only elements allowed without a custom class:

- Slots using `u-display-contents`
- Base components of one or two elements that use only a utility (e.g. the Image component)

### Utility classes

- Start with `u-`
- Dashes between words, never underscores
- Always stacked **on top of** a custom class
- Usable in any section of the site
- **Do not stack more than ~4 utilities.** Prefer putting margin/flex on the custom class.

### Combo classes

- Start with `is-`
- Dashes between words
- Modify one specific custom class — they do **not** apply globally the way utilities do
- **Must be created on top of a component/custom class, never on top of a utility**
- `is-active` is the framework's standard state hook

There is **no documented numeric limit** on `is-` stacking. Do not import Client-First's "max 2
combos" rule — it is not a Lumos rule.

### Not Lumos

`section_`, `padding-global`, `cs-`, `c-`, `container-large`, and `--` double-dash chaining
(`card_title--h2--red`) belong to Client-First or to **Lumos v1**. Nested utility classes were removed
in v2.0.2. If a source shows `u-hflex-*` / `u-vflex-*` or `u-grid-from-large`, it predates v2.0.9 —
those were removed.

---

## 2. Page structure

```
page_wrap                       overflow: clip; min-height: 100svh; display: flex
├── Global Styles               component — CSS shared across all pages
├── Global Guides               optional alignment overlay; auto-hides in preview/published
├── Nav
├── page_main    (Page Slot)    tag: Main, id="main" — for skip-to-main links
│   └── [section components]    client can add/reorder these in Build mode
└── Footer
```

`page_main` is a **Page Slot** so the client can add and reorder sections without a designer.
Preserve that. Do not put the nav or footer inside it.

---

## 3. Variables

### Naming → emitted CSS

Webflow emits variables differently depending on whether they live in the **Default** collection:

| Where | Slash notation | Emitted CSS custom property |
|---|---|---|
| Default collection, in a folder | `site/margin` | `--site--margin` |
| Default collection, root | `grid-breakout` | `--grid-breakout` |
| Named collection | `theme/background` | `--_theme---background` |
| Named collection, nested folder | `theme/selection/background` | `--_theme---selection--background` |

Note the **three hyphens** after a named collection. Verified examples from the shipped Lumos CSS:
`--_theme---background`, `--_theme---text`, `--_theme---selection--background`,
`--_text-style---trim-top`, `--site--column-count`, `--site--column-width`, `--site--margin`,
`--focus--width`, `--grid-breakout`, `--grid-breakout-single`.

### Two-layer token architecture

Lumos separates **primitives** from **semantic aliases**. Respect the split.

| Layer | Lives in | Examples |
|---|---|---|
| **Primitive** | Default collection / Typography collection | `swatch/brand-500`, `swatch/dark-900`, `font-size/*`, `line-height/*`, `letter-spacing/*` |
| **Semantic** | Theme collection / Text Style collection | `theme/background`, `theme/text`, `theme/nav/background`, `text-style/*` |

Set up brand colours as **swatches** first, then point Theme variables at them. Never hardcode a hex
into a Theme variable — alias it.

### Collections in a stock Lumos site

**Default** (swatches, site, space, section-space, max-width, focus, nav, border-width, radius),
**Theme**, **Typography**, **Text Style**, plus **Column Count** and **Alignment**.

> **Do not modify Column Count or Alignment** — they drive utility class internals.
> **Never adjust `site/column-width`** — the docs mark it explicitly do-not-touch.

### Key site variables

| Variable | Meaning |
|---|---|
| `site/viewport-max` | Viewport at which fluid sizes stop scaling up — **90rem** default |
| `site/viewport-min` | Viewport at which fluid sizes stop scaling down — **20rem** default |
| `site/margin` | Outer left/right page gutter |
| `site/gutter` | Default gap between grid columns |
| `site/column-count` | Main design column count — usually 12 |
| `site/column-width` | **Do not adjust** — drives the breakout grid |

Spacing scale is `space/1` … `space/8`, consumed by the spacing utilities.
Section spacing lives in `section-space/`, including `page-top` which reserves room for the nav.
The smallest section spacing exceeds `space/8`.

### Creating variables via MCP

`data_variable_tool` supports three value forms. The third is the one that matters for Lumos:

- `static_value` — a typed literal (`"#ff0000"`, `{ value: 16, unit: "px" }`)
- `existing_variable_id` — **alias to another variable**. This is how you wire semantic → primitive.
  Use it for every Theme variable.
- `custom_value` — an arbitrary CSS expression. **This is how you get Lumos's fluid sizing and
  colour ramps**: `clamp(...)`, `calc(...)`, `color-mix(in srgb, ...)`.

Fluid sizes are normally authored through the **Fluid Builder app**
(https://fluidbuilder.timothyricks.com/). The exact `clamp()` formula it emits is **not published** —
do not reconstruct it from guesswork. Either read an existing fluid variable's value from the site
and follow its shape, or leave fluid sizing to the Fluid Builder and say so.

### When to use a variable

Variable-driven: typography (family, size, weight, letter-spacing, line-height), all colour, page
structure (padding, container max-widths, section spacing), sizing (padding, margin, gaps), layout
(column count, gap, alignment), border radius, border width, state effects.

Left as plain styles: display, width/height, opacity, overflow, layout utilities.

---

## 4. Colour and theming

Theming is **two orthogonal axes**, both driven by classes, both inherited by nesting:

- **Theme** — `u-theme-light`, `u-theme-dark`, `u-theme-brand`
- **Brand** — `u-brand-*`

Any class starting `u-theme-` is collected as a theme; any starting `u-brand-` as a brand. Apply
either to a section, a card, or the page — everything inside responds automatically.

Components ship **Inherit / Light / Dark** variants. The **Inherit variant must have no theme class
applied** so it picks up its context. Preserve this when creating variants.

Since v2.0.7 this is native Webflow **variable modes** — not `data-theme` attributes. If you find
`data-theme`, `data-button-style`, or `data-padding-*` in a site, it predates v2.0.7.

To apply a mode to a style via MCP: `data_style_tool > set_style_variable_mode`
(style_name + variable_collection_id + mode_id). Verify with `get_style_variable_modes`.

---

## 5. Breakpointless — the rule that trips everyone

**Apply no styles to the tablet, mobile-landscape, or mobile-portrait breakpoints.**

Lumos v2 is breakpoint-free. Webflow breakpoints are px-based, so a layout built on them does not
reflow when a user raises their browser font size — text overflows. The accessibility target is:
*when a user doubles their preferred font size, no text should overflow.*

Use instead, in this order:

1. Enable **wrapping** on horizontal flexboxes
2. Use Lumos grids — `u-grid-autofit` (stretch to fill), `u-grid-autofill` (leave empty tracks; right
   choice for filterable lists), or the Grid component
3. Fluid typography via `clamp()`
4. **Avoid all px** — px doesn't scale with user font size; px padding overflows rem containers
5. Responsive variables
6. **Container queries** (`container-type: inline-size`) — Lumos sets these on containers.
   Documented thresholds in the shipped CSS: `threshold-large` 62em, `threshold-medium` 48em,
   `threshold-small` 30em

The only breakpoint-ish escape hatches are the above/below utilities
(`u-grid-above`, `u-grid-below`, `u-order-unset-above/below`, `u-all-unset-above/below`) — and they
name a container threshold, not a device.

**Webflow MCP breakpoint reference** (for the rare justified exception, and for reading existing
styles): `xxl` ≥1920, `xl` ≥1440, `large` ≥1280, `main` all devices, `medium` ≤991, `small` ≤767,
`tiny` ≤478. If you must touch one, go largest → smallest.

---

## 6. Creating a new utility class

Only after discovery proves nothing suitable exists.

1. Create it on an element that has **no other classes**
2. Name it `u-` + the **broadest search term first**, narrowing rightwards — so `u-text-transform-*`
   groups under a `u-text-` search
3. **Add it to the Style Guide page**, or Webflow's unused-class cleanup will delete it
4. **Reorder it in the stylesheet**: utilities must sit **above** custom component classes;
   multi-property utilities above single-property ones. Specificity depends on it.

Style overrides belong on the **custom class**, not the utility. You *may* override a utility
instance when it is stacked on a custom class — it won't leak globally.

Renaming a stacked utility swaps it out while keeping your overrides. Renaming `u-text-style-h2`
to `u-text-style-h3` on an element changes only that element's stack, not the global class.
If Webflow says the name "already exists", rename to a throwaway (`u-`) first, then to the target.

---

## 7. Components

Name from **broadest term first** so search filters usefully: `Section Hero`, `Section Custom`,
`Button Text Link`, `Form Input`, `Global / Content`, `Global / Clickable`.
Typing "Section" surfaces all sections; "Form" surfaces all form parts.

- **Open components** — the Lumos default. Most flexible, use for sections.
- **Closed components** — rigid; required when content or structure must stay identical across pages.

When duplicating a component, **duplicate its custom classes too**, or styles bleed between the
original and the copy.

Unlinking a component instance converts slots → elements and variants → styles. It is lossy.

---

## 8. Attributes: triggers and states

Lumos uses data attributes, not classes, for interaction state:

- `data-state="checked" | "current" | "open" | "expanded" | "external"`
- `data-trigger="hover" | "focus" | "hover-if-clickable" | "mobile" | "preview" | "group" | "hover-other" | "focus-other"`
- `is-active` as the class-based active hook

---

## 9. Tooling worth mentioning to the user

| Tool | What it does |
|---|---|
| Lumos Chrome Extension | Right-arrow in the class field autocompletes the nearest parent component class; px→rem conversion |
| Fluid Builder | Authors the `clamp()` values for fluid size variables |
| Line-Height Trim tool | Generates `font/primary-trim-top` / `-bottom` values per font |
| Official Lumos skill | https://github.com/lumosframework/skill |
| Lumos Figma style guide | Figma Community — mirrors the token structure |
