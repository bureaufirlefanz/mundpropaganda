# web/ — the website

**Product.** What changes here goes live.

Astro 5, static. The build emits finished HTML files that Netlify serves as
files. One exception: `/preview/*` is server-rendered, because it has to show
drafts — `output: "static"` still holds, and `prerender = false` sits on that
one route.

```bash
npm run dev      # port 4321
npm run build
npm run check    # astro check
```

From the project root: `npm run web`, `npm run web:build`, `npm run web:check`.

## Self-contained

Since A2 the foundation lives here, not in the prototype:

```
src/styles/    tokens.css · base.css · shared.css
src/js/        init.js · lib/ · modules/
public/        a real folder, not a symlink
```

**Nothing in `src/` imports from a folder above `web/`.** If a `../../../`
ever shows up, that is a regression behind A2 and not a detail: this exact
direction is what made a change "in the prototype" hit the shipped site.

The other way round is allowed and intended — `prototypen/vite/` borrows
tokens, base CSS and the module list from here.

## Folders

```
src/pages/        routes. Load data, call a template.
src/templates/    the composition of a page type
src/components/   sections/ and ui/
src/lib/          data layer: queries, loaders, types
src/js/           init.js plus modules/
```

`templates/` is deliberately not called `pages/` — Astro owns that name for
routes, and two folders with the same name side by side are exactly the
confusion this split is meant to prevent.

## Before building a component

`BAUSTEINE.md` next door lists every component, template and layout — grouped
by job, with what each one does, its props, where it is used, and whether it
appears in the catalogue at `/design/komponenten`.

**Read it before writing a new component.** Two components for the same job
drift apart at the next round of polish, and the site then looks different in
two places. Regenerate it with `npm run bausteine`; it is produced from the
files, never maintained by hand.

## The binding part

`STRUKTUR.md` next door is not garnish, it is the house rules: style layers,
the two traps when scoping (`:global()`, `html.js`), why hidden initial states
belong in CSS and not in GSAP, and which of the three phases a new module
starts in.

The short version, the part needed most often:

- **Pages compose, they do not style.** A `<style>` block under `pages/` means
  a building block is missing.
- **Foreign markup needs `:global()`.** Astro appends its scope attribute to
  every part of a selector; an `<img>` coming out of `Picture.astro` does not
  carry it.
- **`html.js`, never a bare `.js`.** Otherwise it becomes
  `.js[data-astro-cid-…]` and never matches `<html>`.
- **No colour or spacing values in components.** Tokens only. If one is
  missing, it belongs in `tokens.css`.

## Language

Identifiers and comments in English. German stays in what the visitor reads —
page copy — and in the URLs. See the root `CLAUDE.md`.

## Content

Comes from Sanity at build time (`src/lib/`). A change in the Studio only
appears after a new build — until task 14 in `CMS-UMBAU.md` sets up the
webhook, that means `npm run web:deploy`.

How far the migration has come and what is next is in `../CMS-UMBAU.md`. Where
`../SANITY.md` contradicts it, the list wins.
