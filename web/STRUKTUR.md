# Structure of the Astro app

## Folders

```
src/
├── layouts/Base.astro          document frame: head, Nav, Backdrop, scripts
├── components/
│   ├── ui/                     reusable, page-independent
│   │   Button · Picture · CmsImage · Reviews · Icons · Nav · Footer
│   │   Panel · Accordion · Backdrop · Transition · Filter
│   │   TableOfContents · TextHeading · PostCard · ImageRing
│   │   Thread · ToothLines · ToothRings
│   └── sections/               one page section, one building block
│       Hero · ServiceHero · Split · Intro · Statement · Services
│       Standards · Gallery · Experts · Stories · Magazine
│       Benefits · BeforeAfter · Steps · Prices · Features
│       PostList · Faq · Contact
├── templates/                  the composition per page type — Home,
│                               Service, Magazine, Post, Careers, LegalPage
├── lib/                        data access and queries
└── styles/shared.css           see below
```

`templates/` is deliberately not called `pages/`: Astro owns that name for
routes, and two folders with the same name side by side are exactly the
confusion this split is meant to prevent.

## One block, one file

A block brings its markup **and** its rules. Whoever includes it gets both;
whoever changes it changes it everywhere. That is the whole mechanism — no
registration, no separate style import.

From that follows the binding rule: **pages compose, they do not style.** A
file under `pages/` fetches data, picks blocks and passes props through. A
`<style>` block there is the sign that a building block is missing: its markup
could not be reused elsewhere without copying the CSS along with it.

Since task 5 this goes one step further: a file under `pages/` loads data and
calls a **template** from `templates/`, nothing more. The three product routes
come to 62 lines together, most of it comment.

The reason is the preview: it has to render exactly what the real page renders.
Two compositions meant to show the same thing are guaranteed to drift — and
unnoticed, because you only ever look at one of them.

Under `templates/` a `<style>` block is allowed: what sits there is the markup
of ONE composition and not of a block — the speculative-application box on the
careers page, for instance. Under `pages/` it stays the sign that something is
missing.

Two things that easily go wrong here:

- **Foreign markup needs `:global()`** — see below. A block must not reach into
  another block's internals without spelling it out.
- **Types do not belong in frontmatter.** An `.astro` file can only export
  itself. Shared shapes (`Question`, `Step`, `Price`, `Entry`) therefore live
  in `lib/shapes.ts` and are imported from there. What only one block needs
  stays with it — `Story` in `Stories`, `FeatureRow` in `Features`. Until task 4
  all four lived in `lib/fixtures.ts`; that file also carried the sample data
  and went away when the data moved into the CMS.

## Style layers

Responsibility is layered, not mixed:

1. **`src/styles/tokens.css`** — the only fixed values in the project. Colours,
   type scale, spacing, radii, motion sizes.
2. **`src/styles/base.css`** — fonts, reset, typography helpers, layout
   primitives (`.container`, `.grid`, `.section`, `.media`) and the motion base
   (`[data-reveal]`, marker rules, the mask that gives descenders room).
3. **`src/styles/shared.css`** — what more than one block spells out and none
   owns alone: `.c-topline` and the slider controls shared by Gallery and
   Magazine. Deliberately short. If the file grows, that is the sign the block
   should become its own component.
4. **Component styles** — in the `<style>` block of the respective `.astro`
   file. Astro scopes them automatically, which stops a section from slipping
   its rules to another.

`components.css` and `sections.css` from the prototype are **not** included
here. They had grown to 1056 and 2311 lines in which every section could
override every other — several bugs came out of exactly that, among them the
opaque background on `.section` that painted over the grain. Their rules now
sit next to the markup they concern.

Rule: a component defines **no** colour or spacing values of its own. It only
reaches for tokens. If a value is not available as a token, that is where it
belongs — not in the component.

### Two traps when scoping

Astro appends its scope attribute to **every** part of a selector: `.a .b`
becomes `.a[data-astro-cid-x] .b[data-astro-cid-x]`. From that follows:

- **Foreign markup needs `:global()`.** An `<img>` from `Picture.astro` or a
  `.c-btn` from `Button.astro` does not carry the *including* file's attribute.
  `.s-split__media img` therefore matches nothing —
  `.s-split__media :global(img)` matches. The same holds for everything the
  modules create at runtime: `.highlight-marker-line` (marker.js), the slider
  dots (gallery.js), the lines produced by SplitText.
- **A bare `.js` does not work.** Only parts naming `html` or `body` are exempt
  from scoping. `.js .s-hero__tooth` would become `.js[data-astro-cid-x] …` and
  never match `<html>` — the tooth would stay invisible forever. Hence
  `html.js .s-hero__tooth`.

Both are silent failures: there is no warning, the rule simply does not apply.

### Initial states belong in CSS, not in GSAP

Anything that should only appear once animated has to be hidden **in the first
frame already**. A `gsap.set` inside a module is too late for that: the bundle
is a module script, so it runs after the document is parsed, and `init` also
hangs off `astro:page-load`. The stylesheet is long since in place — the
browser has finished painting the page.

So: **the hidden initial state lives in CSS and hangs off `html.js`; the module
releases it.** Affected today are `[data-reveal]`, `[data-reveal-child]`,
`[data-split]` (all in `base.css`) plus `.s-hero__word`, `.s-hero__foot`,
`.s-hero__scroll`, `.s-hero__tooth` and `.c-nav__inner` in their components.

Two things are easy to miss:

- **The `js` class must be set synchronously in the `<head>`**, not by
  `init.js`. On a page transition the router also takes over the attributes of
  the incoming `<html>` element and throws them away in the process —
  `Base.astro` restores them in `astro:after-swap`.
- **Whoever hides must release.** If an element gets stuck, you only see it in
  the case you are not currently testing: on a page without a hero, or with
  "reduce motion". `npm run web:check` covers both.

The bug this rule came out of: on a first visit the browser does not paint text
while the font is loading — that hid the problem completely. With a warm cache
the block is gone, and the headline stood there in full immediately.

### The entrance comes first, the rest after

`init()` runs in three phases (`src/js/init.js`):

1. **Immediately** — what carries the entrance: scroll, navigation, hero. All
   cheap.
2. **After the first frame** (two nested `requestAnimationFrame`) — reveals,
   headlines, the interactive sections. Around 10 ms in total.
3. **On first scroll**, at the latest after 2.5 s — the running path and the
   re-measuring of all triggers. Around 140 ms in total.

The reason for the staging: while the main thread is busy the browser does not
paint and calls no animation frame. The hero timeline can be fully set up and
still stand still — measured, the first painted frame landed at 1388 ms, though
the timeline had existed since 105 ms. That is exactly what you see as "the
animation does not fire": you catch it only once it is half over, and with
`expo.out` 46 % of the distance is behind you after 10 % of the runtime — the
bar is practically standing still by then.

By far the most expensive item was `initThread`: the table mapping height onto
stroke length was built from 900 sample points, each with a
`getPointAtLength()` and a `matrixTransform()` — and twice over, because
`ScrollTrigger.refresh()` triggered `onRefresh` again at the end.

| | before | after |
| --- | --- | --- |
| `initThread` | 772 ms | 68 ms |
| `ScrollTrigger.refresh` | 256 ms | 69 ms |
| everything else | ~11 ms | ~11 ms |

Fixed by three things: 240 instead of 900 sample points (the viewBox does not
resolve any finer), reading the screen mapping once instead of creating a new
`SVGPoint` per sample, and removing the duplicate measurement.

Wordmark in motion, measured with `npm run takt`:

| | before | after |
| --- | --- | --- |
| first visit | 1600 ms | 191 ms |
| reload, warm cache | 1415 ms | 104 ms |

Anyone adding a new block hangs it in phase 2 — unless it visibly belongs to
the entrance (phase 1) or costs double-digit milliseconds and is only needed on
scroll (phase 3). That is safe because every block has its hidden initial state
in CSS (see above): a few frames earlier or later changes nothing on screen.

**`requestIdleCallback` is the wrong choice here** and was an intermediate step
that did not hold: it fires "idle" after a few milliseconds, and a 140 ms block
overruns its window anyway — the stall landed precisely where the bar is meant
to start moving.

Related but its own trap: **`document.fonts.ready` is the wrong marker, and so
is `document.fonts.load()`** if you call it too late — both wait for the
*entire* collection to finish. What is wanted is `document.fonts.check()`: "can
I measure with this cut right now?". Measured, the wordmark font was ready
after 92 ms while `load()` only resolved after 872 ms. The full reasoning is in
`src/js/lib/fonts.js`.

### What is still coupled

`base.css` names a few section classes in one collective rule
(`.s-split__media`, `.s-experts__media`, `.s-gallery__item`, …) to give them
their own compositing layer. The rule stays there because `base.css` is shared
with the prototype. It is harmless — it only sets `transform: translateZ(0)` —
but it is the last remnant of section knowledge in the global layer.

## Checks

```bash
npm run web:check    # types + smoke test across three breakpoints (needs dev server)
npm run web:styles   # computed-style diff against a saved baseline (needs build)
npm run erstbild     # shows the first frame, before the modules run (needs build)
npm run intro        # flipbook of the loading animation (needs build)
npm run takt         # what happens when during load (needs build)
```

`web:check` also verifies two things that are easy to break silently: that
every document type in the Studio has a route, and that **every image address
in the built HTML points at a file that exists**. The second one came out of a
real bug — a `srcset` offered a width the pipeline had never produced, the
browser picked exactly that candidate on wide screens, got a 404 and showed
nothing.

`web:styles` records the computed values and position of every element in the
document and compares them against an earlier state — meant for CSS rework
where the result is not supposed to change. It measures without JavaScript
against the build; otherwise GSAP's inline styles and the moment the modules
happened to run mix into the comparison.

## Animations

Unchanged: the modules in `../src/js/` are driven through `data-` attributes. A
component brings its attribute, the module finds it. No framework, no
hydration, no lifecycles.

`../src/js/init.js` holds the module list; `main.js` next to it adds the global
stylesheets and the self-start for the prototype. The Astro app includes
`init.js` and calls it again on every `astro:page-load` — after a page
transition every module has to start over.

Binding, as laid down in the styleguide:

- `data-split="lines"` — headlines and display type only
- `data-reveal="up"` — body text, cards, lists
- `data-reveal="left|right"` — surfaces and images only
- `data-highlight-marker-reveal` — the meta lines in the hero, nothing else
