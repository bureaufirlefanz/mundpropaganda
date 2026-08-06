# Importing the starting content

Six files, because several import modes are needed. They are **the source** —
they were generated once by `erzeuge.mjs`, which read the defaults out of the
building blocks. Those defaults are gone since task 4, the script no longer
runs and only sits here as a record.

Import — this writes real documents into the dataset:

```bash
cd studio
npx sanity dataset import seed/pages.ndjson    --dataset production --replace
npx sanity dataset import seed/careers.ndjson  --dataset production --replace
npx sanity dataset import seed/services.ndjson --dataset production --missing
npx sanity dataset import seed/magazine.ndjson --dataset production --missing
npx sanity dataset import seed/legal.ndjson    --dataset production --missing
npx sanity dataset import seed/chrome.ndjson   --dataset production --replace
```

**Order matters.** `chrome.ndjson` references the homepage, the magazine, the
careers page and the three legal pages — so those have to go in first;
`magazine.ndjson` references services. Sanity validates references on import
and aborts with `references non-existent document` when the target is missing.
Single pages first, then the collections, the frame last.

## Why they are split

| File | Contents | Import | Reason |
|---|---|---|---|
| `services.ndjson` | 11 services, base data only | `--missing` | `service-veneers` is fully edited. `--replace` would overwrite its content with title and slug, without asking. |
| `magazine.ndjson` | magazine intro and 6 posts | `--missing` | Once someone edits a post, a re-import should not reset it. |
| `legal.ndjson` | imprint, privacy, accessibility | `--missing` | Once someone completes the legally binding details, a re-import must not put "Noch zu ergänzen" back. |
| `careers.ndjson` | careers page and 4 jobs | `--replace` | The page is a singleton; the jobs should hold exactly this state as long as nobody has edited them. |
| `chrome.ndjson` | navigation and footer | `--replace` | Two singletons that should hold exactly this state. |
| `pages.ndjson` | settings, homepage | `--replace` | Both should hold exactly this state. |

The IDs are fixed (`service-<slug>`, `settings`, `homepage`), so the operation
is repeatable. Without fixed IDs Sanity would assign random ones and every
second import would create everything a second time.

## What is in them

**Services** — title, short name, slug, topline, placement, group, short code
and order. Text, pricing and images stay empty; the client maintains those in
the Studio.

**Settings** — phone, email, review figures, profiles, both addresses.

**Careers** — intro, attitude, four figures, ten comparison rows, three voices,
four stages of the application process and six questions. Plus four jobs as
their own documents, each with duties, profile and an "active" flag. All of it
used to live in `web/src/lib/careers.ts`.

**Homepage** — every field with the text the page shows: hero lines, split,
services title, the five standards, locations title, experts with both
paragraphs, the five stories, magazine and the six FAQ entries.

**Legal pages** — imprint, privacy policy and accessibility statement,
structured and filled with the practice's data as far as it is known. Where a
legally binding detail is missing, it says "Noch zu ergänzen" rather than
inventing one. An imprint that looks complete and carries the wrong names is
the most dangerous kind of placeholder.

The privacy policy records that the site sets no cookies requiring consent: no
analytics, no ad networks, no third-party fonts, no embedded maps. That is
measured, not asserted — there is not a single foreign host in the built HTML.
Which is also why there is no "cookie settings" entry in the footer: it would
open an empty panel.

Images and SEO are not carried by the seed — the client maintains those. An
empty image field falls back to the designed motif, an empty SEO field to the
page title.

## Why the seed carries content now

Until task 4 it was empty apart from the identifiers, on the grounds that
anything in it would be a copy of the text in the building blocks, and the copy
goes stale. That held as long as the built-in text carried the page.

With task 4 the CMS carries it. That inverts the situation — the seed is no
longer the second copy but the relocation of the first. After that there is no
second place it could diverge from.

It was generated from the source files, not retyped. A retyped seed would
contain exactly one typo, and nobody would find it: it would look like an
editorial decision.

## The proof

After importing, the page reads from the CMS instead of from code. If the seed
is faithful, nothing about the result may change:

```bash
npm run web:build && npm run web:preview
npm run web:styles -- vergleichen      # in a second terminal
```

Measured at the time of import: 3918 elements across three breakpoints, no
deviation.

## A special case: Veneers

`service-veneers` is the only fully edited service and is **not** in
`services.ndjson` — that file carries base data only and is imported with
`--missing`, so it never touches the document.

Task 4 added four sections that were built but missing from the schema:
before/after, statement, process and the image/text rows. They lived as sample
data in `web/src/lib/fixtures.ts`, and the data layer inserted the same ones for
**every** service — which is why the bleaching page said "In four steps to new
veneers".

That content was moved into the Veneers document once. It relocated rather than
being retyped, and `fixtures.ts` is gone.

## The 2026 language migration

Type names, document IDs and field names in these files are English, like the
rest of the code. The mapping is in `scripts/migration/names.mjs`; the same
rewriter was applied to the dataset and to these files, which is the only
reason the two still agree.

What stays German: the content itself, and the labels in the Studio.
