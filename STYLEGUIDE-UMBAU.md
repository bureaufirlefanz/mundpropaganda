# Styleguide rebuild — tokens, roles, surfaces

Branch `tokens-roles`, started 2026-09-27. This file lists **every visible
change** the rebuild made, what was deliberately left alone, and what is still
open. If something looks off on a page, look it up here first.

## The short version

- `tokens.css` has three layers now: **base values → roles → surfaces**.
- The title steps are named after their job (`--fs-title-page` …
  `--fs-title-xs`) instead of an HTML level. Two sizes (36 and 28px) and
  the `--fs-h3` alias went away.
- Components use **text styles** (`font: var(--font-section-title)`),
  **colour roles on a surface** (`data-surface="dark"` + `--c-text-muted`) and
  **flow spacing** instead of writing values out.
- The **homepage is pixel-identical**: `npm run web:styles` reports zero
  differences on `/` at 1440, 834 and 390px, after every step.
- `npm run check:css` now fails on unset custom properties and on any file
  that gains a literal value (a ratchet, see below).

| Measure                                         | Before | After |
| ----------------------------------------------- | -----: | ----: |
| Font-size steps (distinct values)               |     22 |    20 |
| `color-mix()` outside tokens.css                |     41 |     8 |
| Literal line-heights in components              |     54 |     8 |
| Literal px values in components (ratchet count) |    215 |   162 |
| Files with any literal value                    |     62 |    53 |
| Uses of a `--font-*` text style                 |      0 |    67 |
| Places that set `data-surface`                  |      1 |    21 |
| `var()` reads of a property that is set nowhere |      2 |     0 |

The remaining literals are mostly on the homepage (frozen, see below) or are
one-offs that did not earn a token. Each file's count is recorded in
`scripts/css-baseline.json` and can only go down.

## How to review

```bash
npm run web                     # main checkout, port 4321 — the old state
# in the fork folder Mundpropaganda-Tokens:
npx astro dev --port 4331       # or the "astro-fork" entry in .claude/launch.json
```

Compare page by page at http://localhost:4321 and http://localhost:4331.
The styleguide is at `/design/styleguide`, the catalogue at
`/design/komponenten`.

To see the computed-style diff yourself:

```bash
npm run web:build && node scripts/preview.mjs 4342 &
MP_BASE=http://localhost:4342 MP_SUMMARY=1 npm run web:styles -- vergleichen
```

The snapshot of the state before the rebuild is in `.shots/styles-baseline/`
(copy it over `.shots/styles/` to compare against it again).

---

## 1. Token changes

### Renamed (no visual change)

| Old                     | New               | Value at 1728 |
| ----------------------- | ----------------- | ------------: |
| `--fs-h1`               | `--fs-title-page` |            70 |
| `--fs-h1-sm`            | `--fs-title-xl`   |            64 |
| `--fs-h1-xs`            | `--fs-title-lg`   |            55 |
| `--fs-h2-lg`            | `--fs-title-md`   |            48 |
| `--fs-h2`               | `--fs-title`      |            40 |
| `--fs-h3` (alias of h2) | `--fs-title`      |            40 |
| `--fs-h4`               | `--fs-title-sm`   |            32 |
| `--fs-h5`               | `--fs-title-xs`   |            24 |

The old names survive at the bottom of `tokens.css` **only** for the archived
prototype in `prototypen/vite`, which imports that file. `check:css` rejects
them anywhere in `web/`.

### Merged (visible, subpages only) ⚑

| Removed step      | Now                | Where it shows                                                                       |
| ----------------- | ------------------ | ------------------------------------------------------------------------------------ |
| `--fs-h2-sm` 36px | `--fs-title` 40    | Intro titles (service, pillar, practice, careers), Statement (service)               |
| `--fs-h4-sm` 28px | `--fs-title-sm` 32 | Benefits items (service), Values items (practice), Timeline stages (careers), Person |

The 48px step was going to merge into 55px too, but `Panel` uses it **on the
homepage**, so it stays as `--fs-title-md`. `Features` shares it — a subpage
moving onto a homepage value, which is the direction this file is about.

### New base values

`--fw-light|regular|medium` · `--lh-headline` 1.05 (a homepage value: Panel,
Standards) · `--lh-compact` 1.3 (absorbs 1.25, 1.3, 1.35) · `--measure-narrow|
medium|text|long` · `--icon-sm|md|lg` · `--control-lg` · `--focus-width` ·
`--focus-offset`.

### New roles

- **Colour:** `--c-line-strong` (3.3:1), `--c-tint-brand`, `--c-focus`,
  `--c-on-dark*`, `--c-on-brand-muted`, `--c-on-taupe-muted`, `--c-on-card*`,
  `--c-placeholder`, `--c-glass`.
- **Text styles:** `--font-title-page`, `--font-headline-xl`,
  `--font-headline`, `--font-headline-md`, `--font-section-title`,
  `--font-card-title`, `--font-lead`, `--font-body`, `--font-body-long`,
  `--font-small`, `--font-topline`, `--font-label`, each with its tracking.
- **Spacing:** `--page-top`, `--page-top-sm`, `--hero-offset`.

### Surfaces

`data-surface="dark|brand|taupe|card"` redefines `--c-text`, `--c-text-muted`,
`--c-line`, `--c-line-strong` and `--c-focus` for everything inside. Set on:
Footer, NavPromo, Split panel, Stories quote band (homepage, all value-
identical), Benefits, Contents panel, SourceNote, Values, Reasons number,
Location map, Post tag (dark) · Steps, Prices, Contact file face, Voices card,
Post title card (card) · Person fallback image (brand) · Stories quote (taupe).

---

## 2. Visible changes, by component ⚑

Everything below is on subpages. Sizes are at a 1728px window unless noted.

### Type

- **Intro** `.s-intro__title` — 36 → 40px, line-height 1.25 → 1.15.
- **Statement** `.s-statement` — 36 → 40px, line-height 1.25 → 1.15.
- **Benefits** `.s-benefits__name` — 28 → 32px, line-height 1.2 → 1.15,
  tracking 0 → −0.01em.
- **Values** `.s-values__item-title` — 28 → 32px, line-height 1.2 → 1.15.
- **Timeline** `.s-timeline__stage-title` — 28 → 32px. The number circle is
  em-based and grows with it (≈ 48 → 54px).
- **Person** `.s-person__name` — line-height 1.02 → 1.05, tracking −0.03em →
  −0.02em (now the page-title style).
- **Steps** `.s-steps__title` — line-height 1.02 → 1.05.
- **LegalPage** body text — line-height 1.65 → 1.6.
- Line-height snaps: 1.35/1.25 → 1.3 (Prices facts, Story label, Team member
  name and role, Location name, Post facts and author role, AuthorNote,
  TableOfContents links, Prose h3) · 1.4 → 1.45 (Perks, Voices quote, Person
  role, Contents caption, SourceNote title, PostImage caption, form hint) ·
  1.55 → 1.5 (Jobs, Team, Values, Locations, SourceNote body, Prices note,
  Compare note).
- **Mono uppercase labels all track at 0.08em** (was 0.04, 0.06 or 0.1):
  ServiceHero topline, Steps duration, Prices tag/from/unit, SourceNote title,
  AuthorNote label, TableOfContents heading, Team "mehr", Location load
  button, Post fact labels, 404 label. Compare values 0.03 → 0.04em.

### Colour

- **SectionDock** active number — dark 70 % → 90 % on pink (3.17 → 4.61:1,
  now passes AA).
- **Compare** "nicht enthalten" icon — dark 55 % → 62 % (2.82 → 3.3:1, now
  passes 1.4.11). Zebra rows 4 % → 8 % (darker).
- **Values** copy on the dark band — two mixed tones (72 %/68 %) → one muted
  role (65 %, 4.56:1). Dividers 26 % → 22 %.
- **Benefits** "mehr" text on dark — 70 % → 65 %.
- **Steps** card text 80 % → 72 %, duration 70 % → 72 %.
- **Voices** role and "seit" 70 % → 72 %; divider line 15 % → 28 % (stronger).
- **Prices** fact labels 62 % → 72 %.
- **Strong lines on dark** (Benefits control borders, Location map button)
  45 % / 40 % → 47 %: 45 % measured 2.996:1, just under 1.4.11's 3:1.
- **Filter** tags on mobile: border 20 % → 28 %; dropdown shadow → `--shadow-panel`.
- **Jobs** badge tint 10 % → 8 %; **PillarHero** image ground 12 % → 8 %;
  **Application** selected role 14 % → 16 %.

### Spacing

- **CareersHero, Person** — page start `section-space + 96px` →
  `--page-top` (+80): both start 16px higher.
- **ServiceHero** — top offset min 100 → 96px (`--hero-offset`).
- **PillarHero** — panel top padding 60 → 69px, title margin ≈ 35 → 52px
  (onto `--flow-md` / `--flow-sm`); on mobile 40 → 32px.
- **Contents** (pillar) — section padding 64–80 → `--section-space-sm`
  (48–84), panel padding 78/65 → 86/69, column gap 104 → 86, image overhang
  −59/−78 → −69/−86.
- **SectionHeading** gap 60 → 69px · **Intro** centred columns gap 85 → 72px
  · **CtaBand** foot margin below 1000px 40 → 32–40px · **CareersHero**
  media margin onto `--flow-xl` · **Post** body/contents gap ≈ 100 → 125px
  at 1440.

### Measures

42/44 → 46ch (ServiceHero body, Benefits "mehr", Features body, Location
text) · 40 → 46ch (Intro copy, Reasons text) · 32 → 34ch (CtaBand text) ·
38 → 34ch (Values item text) · 52/56/58/62 → 60ch (Story, Careers,
Application, Jobs, Values, Team, Locations, Magazine intro, Person, Prose) ·
76 → 68ch (Compare note).

### Fixes

- **Wide images in posts** now reach across the margin column (`100cqi`).
  They read `var(--rand-breite, 0px)` before, a property nothing set, so
  "wide" was exactly as wide as "column". `PostImage` `sizes` updated to
  match.
- **Focus ring** comes from the surface. Dark on dark is gone in the footer,
  SourceNote, Contents and Benefits. Footer and NavPromo are homepage blocks:
  their ring is now light, and the footer's is drawn outside instead of inset
  (visible only while tabbing). Contents and BeforeAfter rings 1 → 2px. The
  Location map button keeps a dark ring on purpose: its ring sits outside
  the dark button, on the grey page.
- `marker.js` resolves its colours from tokens instead of a hand-typed copy
  of the palette (same colours).

---

### Styleguide and catalogue

- **`/design/styleguide`** is rebuilt around the three layers: base values,
  roles (a specimen for every `--font-*` style, colour roles with measured
  contrast), surfaces (one tile per `data-surface` with text, muted text,
  lines and a visible focus ring, contrast computed from tokens.css) and the
  small building blocks. It reads `tokens.css` at build time, and every token
  shows where it is used, counted from the source — the hand-written
  "Galeriekopf, Geschichte" notes are gone. Tokens nothing uses are flagged
  at the top: today `--fs-display` (Hero writes its own ramps) and `--sp-16`.
- **`/design/komponenten`** now shows the four page heroes (Hero,
  ServiceHero with and without claim, CareersHero, PillarHero) on framed
  stages, plus Intro `bleed` and Benefits `footnote`. The stages are
  `aria-hidden` and `inert` — pictures of a page head, not part of the
  catalogue's outline; `scripts/lib/wcag.mjs` now skips headings there.
  Iframes were not an option: `_headers` sends `X-Frame-Options: DENY`.
- **`scripts/bausteine.mjs`** scans `layouts/` too, so Nav, Footer, Backdrop,
  Icons, Transition and StructuredData are no longer listed as unused.

### Review round 2026-09-28

- **FAQ head is the same everywhere:** topline "FAQ", title "Häufige
  Fragen", and one generic line: "Kurze Antworten auf das, was wir am
  häufigsten gefragt werden. Ist deine Frage nicht dabei, sprich uns
  einfach an." It replaces "Häufige Fragen zu …" (service, pillar), "Fragen
  zur Bewerbung" (careers) and, **on the homepage**, the line "Nichts dabei?
  Schreiben Sie uns - wir antworten in der Regel am selben Werktag." — a
  deliberate homepage change, one line longer. The Studio fields `faqTitle`
  and `faqText` (homepage, careers) are hidden, not deleted. On the pillar
  page the numbered heading "Häufige Fragen zu Veneers" still sits above the
  panel, so the words appear twice there.
- **Magazine article** — the "Weitere Beiträge" block ended with 0px above
  the footer. It now closes with `--section-space`, like every other page.
- **Minimum reading size 14px** (rule written at `--fs-label-lg`). Raised:
  careers form step names 12 → 16px and their digits 10.8 → 14px, Jobs
  number digits 12 → 14px, Voices role and "seit" 12 → 14px, person page
  "Team" back link 12 → 14px, post author role 12 → 14px, section dock
  digits 12 → 14px, Timeline digits on phones 13.6 → 14px. Still 12px by
  design: mono uppercase micro labels (tags, meta, toc heading, price
  "ab" / "/ Zahn", footer and menu labels on the homepage).

- **Location ring** (homepage and `/praxis`): the two badges "Prenzlauer
  Allee" and "Christburger Straße" on the reception photos are gone — a
  deliberate homepage change. The alt texts now name the location instead.
  Images uploaded in the Studio would still show their caption.

## 3. The homepage

Untouched visually, verified with the computed-style diff. The homepage
files did get **value-identical** refactors, so the system is the same
everywhere: renamed tokens, `--fw-*`, `--font-section-title` (Split,
Gallery, Magazine), `--font-headline-xl` (Experts), `--font-headline-md`
(Panel), `--font-topline` (`.c-topline`), surfaces with the exact old
colours, `--c-glass` (Nav), icon and control sizes.

Where a homepage literal has no identical token it stays literal (Reviews
glass 70 %, Gallery 80 %, Accordion text 78 %, Services 82 %, Hero's display
ramps). They sit under the ratchet.

---

## 4. Open — needs a decision ⚑

These would change the homepage or are design questions, so they were not
done:

1. **`--lh-heading` 1.1 vs `--lh-title` 1.15.** Merging moves every heading by
   1–3px, homepage included. Still open from 2026-09-02.
2. **Muted text over the grain** measures ≈ 4.4:1 (AA needs 4.5). Raising
   `--c-text-muted` to 78 % fixes it and darkens muted text on the homepage.
3. **`--fs-display-lg` at 360px** is smaller than `--fs-display-md` (48 vs
   64px); **`--fs-display-sm`** (24px) is smaller than `--fs-title-page`
   (40px). Both are used by the homepage magazine section.
4. **Stories counter** sits visually on the taupe band at 75 % (4.0:1).
   Homepage.
5. **Mega-menu hover** is pink text on the glass bar (2.0:1). Homepage.
6. **Form field edges** are 1.32:1 against the page (WCAG 1.4.11). Needs a
   visible border — a design change on Contact and Application.
7. **Two article heading styles:** Post h2 is medium + 1.15, LegalPage h2
   medium + 1.2, neither matches `--font-section-title` (regular). Candidate
   for an `--font-article-heading` role.
8. **`.s-values__title`** is the only medium-weight section title.
9. **404** has its own title style (page size, regular weight), starts at
   `nav-height + flow-lg` instead of `--page-top`, and keeps a `<style>`
   block under `pages/` (house-rule breach, a `NotFound` section is missing).
10. **`--post-surface-top`**: PostCard reads it with a fallback so the
    magazine overview can lower the text surface — nothing sets it. Listed as
    a documented hook in `check-css.mjs`.
11. **Sans text with `--fw-light`** (Voices role, Jobs subtitle, Compare
    values) renders at 400, no light sans is loaded. Probably meant to be mono.
12. **ServiceHero topline and Intro lead** never get their own size: a
    `.s-shero__body p` / `.s-intro p` rule outranks them. Pre-existing.
13. **`Locations.astro`** may be unused (Practice renders Gallery).

## 5. Kept literals — token candidates

Not added, to keep the system small. If a second or third place needs one,
add it then:

- a flow step 40–80px (Post ×3) and 64–80px (Person ×3)
- `--inset-panel` `clamp(…, 6.9vw, 120px)` (PillarHero, CtaBand)
- `--control-md` 40 / `--control` 44 (Jobs, Filter, Nav), avatar 56
- `--number-sm` 28 / `--number-lg` 40 for `.c-number`
- `--icon-xs` 14 (BeforeAfter, Contact, Reviews)
- a 4px step (underline offsets, focus room, ≈ 10×) and focus offsets 3/4/6px
- the CareersHero arch radii

## 6. The ratchet

`npm run check:css` counts, per file: clamp() with literals, px values,
number line-heights, length tracking, non-token font sizes and colour
functions. The ceiling per file is in `scripts/css-baseline.json`. Going
below is fine (`npm run check:css -- --update` lowers it); going above
fails. A new literal is therefore always a conscious commit.
