# studio/ — the CMS

**Product.** What changes in the schema here changes what the client sees and
can edit.

Sanity 6, standalone — not embedded in the Astro app.
Project `a6bjftwf`, dataset `production`.

```bash
npm run dev      # port 3333
npm run check    # tsc --noEmit && sanity schema validate
```

From the project root: `npm run studio` and `npm run studio:check`.

**Run `check` before every commit that touches this folder.** `sanity schema
validate` alone is not enough — it validates the *shape* of the schema and
passes happily while a `prepare()` body reads a variable that does not exist.
Only `tsc` sees that. Until this script existed, `studio/` had no typecheck at
all and carried nine such crashes.

## The principle

**The Studio must not promise more than the website delivers.** A field the
client fills in whose effect they never see costs the trust in every other
field. Two rules follow, spelled out in tasks 3 and 4 of `../CMS-UMBAU.md`:

- **No document type in the sidebar without a route.** Whoever edits and
  publishes "Praxis & Team" must be able to open the result.
- **No silent fallback to built-in text.** An emptied field disappears from the
  page, it is not substituted. Every field belongs to exactly one of three
  classes: carries the page (`required`), optional (the section hides), or no
  field at all.

## Layout

```
sanity.config.ts       tools, schema, templates
sanity.cli.ts          project and dataset for the CLI
schemaTypes/           the content models
  documents/           one file per group of document types
  objects/             reusable objects (picture, link, seo, sections)
structure/index.ts     the sidebar
structure/locations.ts where a document appears on the site
lib/paths.ts           the single source for URLs
seed/                  starting content to import
```

`lib/paths.ts` matters more than it looks: `pathFor()` is the **one** place a
URL is built. Preview, locations and the route check in `scripts/check-web.mjs`
all read from there. A second place that builds URLs is guaranteed to drift.

## Language

**Identifiers English, labels German.** Type names, field names and comments
are English. `title` and `description` on a field are what the client reads in
the form and stay German.

The same applies to the URLs in `lib/paths.ts`: the type is `service`, its
directory is `leistungen`. During the migration that distinction was lost once
and `slugAvailable()` began protecting `/careers` instead of `/karriere` — a
legal page slugged "karriere" would have shadowed the careers page.

Two names in the content model are not ours and must not be translated:
everything Portable Text owns (`children`, `marks`, `markDefs`, `style`,
`listItem`, `level`) and everything Sanity owns (`asset`, `hotspot`, `crop`,
`orderRank`). Documents whose keys were translated anyway stop rendering, and
the error only shows up in the Studio, not on import.

`image` is a reserved type name in Sanity. Our image object is therefore called
`picture`, while the *field* inside it is `image`.

The migration also reached `package-lock.json`, and that one hid the longest:
`orte` → `locations` fired inside the word supp**orte**d and left the
dependency `is-unicode-supp**locations**d`. npm cannot resolve a package that
does not exist, so it silently kept the stale copy already in `node_modules`
— until the next `npm install` pruned it and `sanity` died with
`MODULE_NOT_FOUND`. A lockfile is generated, never read by a human, and
therefore the worst possible place for a blind search-and-replace. If one ever
looks wrong again, the cheap test is whether each package name matches the
filename in its own `resolved` URL.

## Singleton documents

There is no schema option for it — it is enforced through a fixed ID in
`structure/index.ts` **and** by leaving the type out of the templates. Without
the second part the menu offers "New settings", and two of those quietly make
the site point at the wrong one.

## What will not become a page builder

The homepage has fixed, named fields (`heroLines`, `splitTitle`,
`standardsItems`) — not an array of interchangeable blocks. That is a decision,
not an unfinished state: a builder in which every section can turn into every
other produces pages that look like nothing. The free builder stays confined to
pillar pages.
