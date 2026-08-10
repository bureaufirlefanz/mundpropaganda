# Mundpropaganda

## What the product is

**Astro + Sanity.** Decided 2026-08-04. Everything else is a prototype.

| Folder | What | Status |
|---|---|---|
| `web/` | Astro — the website | **product** |
| `studio/` | Sanity — the CMS | **product** |
| `prototypen/vite/` | Handlebars build | archive, do not change |
| `prototypen/webflow/` | Lumos reconstruction | prototype, only on request |
| `scripts/` | image pipeline, captures, checks | tooling |

Anyone landing here without knowing the layout: changes to the website belong
in `web/` or `studio/`. Touching anything under `prototypen/` changes nothing
about what ships — and is not expected.

Until stage A2 it was the other way round: `web/` imported tokens, base CSS and
all JavaScript from the prototype, and `web/public` was a symlink into it.
Anyone working "in the prototype" was changing the live website. That trap is
closed.

```bash
npm run web           # Astro, port 4321
npm run studio        # Sanity Studio, port 3333
npm run web:check     # types, smoke test, accessibility
npm run studio:check  # types and schema of the Studio
npm run web:deploy    # build and publish to Netlify
```

`web:check` covers `web/` only. For a long time nothing at all typechecked
`studio/`, and that is not a theoretical gap: it hid nine undefined variables
in `prepare()` bodies — leftovers of the language migration, where the field
was renamed and the line that read it was not. Each one threw the moment its
preview rendered, so the Studio looked broken to whoever opened it while every
website check stayed green. **Run both.**

Further reading: `README.md` · `SANITY.md` · `web/STRUKTUR.md` (structure of
the Astro app, binding) · `CMS-UMBAU.md` (the running rebuild list) ·
`ANLEITUNG.md` (one page for the client)

A `CLAUDE.md` sits in `web/` and `studio/` with what applies there.

## Language

**Code is English, the product is German.** Identifiers, comments and developer
documentation in English. German stays wherever a human reads it inside the
product:

- page copy
- field labels and descriptions in the Studio (`title`, `description`)
- `ANLEITUNG.md`, the client guide
- the URLs — `/karriere`, `/leistungen/veneers`, not `/careers`

The dividing line matters more than it looks. During the migration the list of
reserved URL segments was translated along with the rest; `slugAvailable()`
then protected `/careers` instead of `/karriere`, and a legal page with the
slug "karriere" would have shadowed the careers page. Names that belong to the
audience are not names that belong to the code.

## Ground rules

- **Pages compose, they do not style.** A `<style>` block under `pages/` means
  a building block is missing. See `web/STRUKTUR.md`.
- **One block, one file** — markup and rules together.
- `web/src/styles/tokens.css` is the only source of values. No magic numbers,
  no hex values outside it.
- CSS convention: `s-*` section, `c-*` component, `__element`, `--modifier`.
  No Tailwind, no atomic utilities.
- **No em dashes in text that appears on the page.** A hyphen will do; better
  still, a sentence that needs neither. Ranges ("Mo–Fr", "8–19 Uhr") and prices
  ("450,–") are exempt. This is about the German page copy, not about code.

## Sanity

See `SANITY.md` and the `sanity-best-practices` skill (`.agents/skills/`).
Queries live in `web/src/lib/`.

## Webflow + Lumos

**A prototype. Work on it only when explicitly asked.**

The site *was* once meant to be reconstructed in Webflow; that intention no
longer stands. Everything that would apply if it came back lives in
`prototypen/webflow/` — site ID, Lumos version, the limits of the MCP, and the
mapping of BEM classes onto Lumos.

If it does start up again: **read the `webflow-lumos` skill first**
(`.agents/skills/webflow-lumos/`, linked into `.claude/skills/`), do not work
from memory. Never assume a `site_id`, never invent a `u-` class or a variable
name.

## Project decisions

- **Astro + Sanity is the product** (2026-08-04). Webflow/Lumos and the Vite
  build are prototypes.
- **The CMS rebuild follows `CMS-UMBAU.md`.** Stages A through 3 are done:
  order, safeguards, the Studio tells the truth, Presentation tool, Studio
  polish. All content is editable through the CMS — homepage, services,
  magazine, careers, navigation and footer. Open is stage 4 (operations): the
  webhook and the roles. Both need access outside the repository, see
  "Betrieb" in `SANITY.md`.
- **Code is English since August 2026**, including the content model. The
  mapping used for the migration is kept in `scripts/migration/`.
- **Open Webflow questions** (slug language, filtering, spacing in rem) are in
  `prototypen/webflow/README.md` and are on hold.
