# Mundpropaganda

Website for a dental practice in Berlin Prenzlauer Berg. **Astro + Sanity** —
statically built, content from the CMS.

```
web/                Astro — the website           product
studio/             Sanity — the CMS              product
prototypen/vite/    Handlebars build              archive
prototypen/webflow/ Lumos reconstruction          dormant
scripts/            image pipeline, captures, checks
```

## Getting started

```bash
npm install
npm run web        # Astro on :4321
npm run studio     # Sanity Studio on :3333
```

Both run in the foreground, so use two terminals.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run web` | dev server for the website, :4321 |
| `npm run web:build` | production build into `web/dist/` |
| `npm run web:preview` | serve the build, :4322 |
| `npm run web:check` | types, smoke test across three breakpoints, accessibility |
| `npm run web:styles` | computed-style diff against a saved baseline |
| `npm run web:deploy` | build and publish to Netlify |
| `npm run studio` | Sanity Studio, :3333 |
| `npm run images` | source images → responsive WebP/AVIF into `web/public/img/` |
| `npm run intro` · `takt` · `erstbild` | tools for the loading animation |
| `npm run proto:dev` · `proto:build` | the frozen Vite build, :5173 |

## Where things live

| File | Contents |
| --- | --- |
| `CLAUDE.md` | product vs. prototype, ground rules |
| `CMS-UMBAU.md` | the running rebuild list, by stage |
| `SANITY.md` | studio, collections, how content reaches the page |
| `web/STRUKTUR.md` | structure of the Astro app — binding |
| `web/CLAUDE.md` · `studio/CLAUDE.md` | what applies inside each folder |
| `ANLEITUNG.md` | one page for the client — **stays German**, they read it |

## Language

**Code is English, the product is German.** Identifiers, comments and the
developer documentation are English. What a human reads inside the product
stays German: page copy, the field labels and descriptions in the Studio, the
client guide — and the URLs. `/karriere`, not `/careers`.

The content model followed the code in August 2026: document types, fixed IDs
and 117 field names were translated, and the dataset was migrated with them.
The mapping is kept in `scripts/migration/` as a record of what moved where.

## Publishing

<https://mundpropaganda-prototyp.netlify.app> — blocked from search engines
(`robots.txt` plus `X-Robots-Tag`), not password protected.

Content is fetched from Sanity **at build time**. A change in the Studio
appears only after a rebuild; the webhook that triggers it automatically is
task 14 in `CMS-UMBAU.md`.
