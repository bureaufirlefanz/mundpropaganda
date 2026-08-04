# Webflow CMS — schemas, limits, binding

Limits current as of **August 2026** (post next-gen CMS rollout, 9 Apr 2026, and the May 2026
plan restructure). Anything citing 30 fields, 5 references, 20 collection lists, 2 nested lists,
10 nested items, or the CMS/Business plans is **stale** — those numbers all changed.

---

## 1. Limits you must design against

| | Starter (free) | Premium ($25/mo) | Team | Enterprise |
|---|---|---|---|---|
| Collections | 20 | **40** | 100 | custom |
| CMS items (site-wide) | 50 | **20,000** | — | 1M+ |

| Schema | Non-Enterprise | Enterprise |
|---|---|---|
| Fields per collection | **60** | 100 |
| **Reference + multi-reference fields per collection** | **10** | 20 |

The **10 reference fields** budget runs out long before the 60-field budget. Audit relationships early.

| Rendering (all CMS plans) | Value |
|---|---|
| Collection Lists per page | 40 |
| Nested Collection Lists per page | 10 |
| Items per list without pagination | 100 |
| Items per nested list (per parent item) | 100 |
| Nesting depth | 3 levels |
| Items per paginated page | 1–100 |

Two structural rules that shape architecture:

1. **A nested Collection List must be bound to a multi-reference field on the parent.** You cannot
   nest an arbitrary unrelated collection. The relationship must exist in the schema.
2. **Nested Collection Lists cannot go inside components.** So a card component containing a nested
   tag list is impossible — either the card isn't a component, or the tags aren't nested.

### Field types and their caps

`PlainText` 1MB · `RichText` 1MB (no code blocks via API) · `ImageRef` 4MB · `MultiImage` **25 images**
· `VideoLink` (Embedly providers only, no upload) · `Link` · `Email` · `Phone` · `Number` (16 digits)
· `DateTime` · `Switch` (defaults **No**) · `Color` (supports alpha) · `Option` (**100 options**, 256
chars each) · `File` 4MB · `ItemRef` · `MultiReference`. Name and Slug are automatic, 256 chars each.

**Field types are permanent — they cannot be converted after creation.** Test with sample content first.
**Field validation is not settable via the API** — Designer only.
**All CMS files are public on Webflow's CDN.** No access control. Never put confidential documents in a File field.

---

## 2. Schema design rules

- **Anything you'd filter by, or that deserves its own page, is a Collection** — not an Option field.
  Webflow's own two-question test.
- **Option fields only for closed enums that you alone change** (`draft / review / published`).
  If a collaborator needs to add values, it must be a reference. Options cannot carry metadata,
  cannot have a page, and cannot be converted to a reference later.
- **Never store a list in a plain-text field.** Comma-separated tags kill all dynamic filtering.
- **You cannot sort a Collection List by a field on a referenced collection.** If you need "posts
  sorted by author surname," denormalise the sort key onto the post.
- **Native filtering handles one dimension.** Two-axis facets (Category AND Tag) need Finsweet
  Attributes List Filter or custom JS.
- Add an explicit **`Order` number field** to any collection the client will want to hand-sort.
- Put **helper text on every field.** This is the single highest-leverage thing for client handover.
- Build the Collection page template **before** importing items.

### OG images — the one people miss

The OG image dropdown requires an **Image field** on the collection, and:

- **JPG or PNG only.** WebP and AVIF are not supported for OG.
- **All OG images in a collection must share the same dimensions.**
- Optimal 1200×630.

So budget a **dedicated `OG Image` field** separate from the editorial hero image, or social cards
will silently break. Also note: SEO/OG patterns have **no fallback** — bind them to fields that are
always populated (Name, Excerpt), and only use override fields if editors will reliably fill them.

---

## 3. Reference schemas

Create supporting collections **first** — reference fields need their target to exist.

### Order of creation

```
1. Author · Category · Tag · Department · Location · Service     (supporting)
2. Team Member                                                   (may reference Department)
3. Magazin Post · Review · Open Position                         (reference the above)
```

### Team Member

The base collection — reviews and posts often reference it.

| Field | Type | Notes |
|---|---|---|
| Name | auto | |
| Slug | auto | |
| Role | PlainText | e.g. "Senior Developer" |
| Department | ItemRef → Department | filterable, gets its own page |
| Photo | ImageRef | required |
| Photo (Portrait) | ImageRef | optional second crop |
| Bio | RichText | |
| Short Bio | PlainText | for cards — keeps card height predictable |
| Email | Email | |
| LinkedIn | Link | |
| Order | Number | manual sort |
| Featured | Switch | for a homepage subset |
| Is Active | Switch | **filter on this instead of deleting** — preserves references |
| SEO Title / Meta Description | PlainText | |
| OG Image | ImageRef | JPG/PNG, 1200×630 |

### Magazin (blog)

| Field | Type | Notes |
|---|---|---|
| Name | auto | the post title |
| Slug | auto | |
| Excerpt | PlainText | bind to meta description + card + OG description |
| Content | RichText | |
| Thumbnail | ImageRef | card/list image |
| Hero Image | ImageRef | article header |
| OG Image | ImageRef | JPG/PNG, fixed 1200×630 |
| Author | ItemRef → Team Member | reuse Team Member; don't duplicate an Author collection unless guest authors need different fields |
| Category | ItemRef → Category | single — powers `/magazin/kategorie/x` style filtering |
| Tags | MultiReference → Tag | **required for a nested tag list** |
| Published Date | DateTime | sort key — do not rely on Webflow's created date |
| Reading Time | Number | |
| Featured | Switch | |
| Related Posts | MultiReference → Magazin | optional; otherwise auto-relate by Category |
| SEO Title / Meta Description | PlainText | |

Reference count: 4 of 10. Fine.

**Related posts pattern:** filter a Collection List by `Category is Current Collection item's Category`
**and** `Name is not Current Collection item`. No manual curation needed.

### Reviews / Testimonials

| Field | Type | Notes |
|---|---|---|
| Name | auto | use the reviewer's name |
| Slug | auto | |
| Quote | PlainText (multi-line) | keep plain — rich text in a testimonial slider fights your typography |
| Full Review | RichText | optional long form |
| Rating | Number | 1–5 |
| Reviewer Role | PlainText | |
| Company | PlainText | |
| Company Logo | ImageRef | |
| Reviewer Photo | ImageRef | |
| Source | Option | `Google / Trustpilot / Direct / LinkedIn` — closed enum, fine as an Option |
| Source URL | Link | |
| Related Service | ItemRef → Service | lets you show relevant reviews on service pages |
| Date | DateTime | |
| Featured | Switch | homepage subset |
| Order | Number | |

`Related Service` is what makes reviews reusable — a service page filters reviews to its own.

### Open Positions (Karriere)

| Field | Type | Notes |
|---|---|---|
| Name | auto | job title |
| Slug | auto | |
| Department | ItemRef → Department | |
| Location | ItemRef → Location | separate collection — locations recur and deserve pages |
| Employment Type | Option | `Vollzeit / Teilzeit / Werkstudent / Praktikum / Freelance` |
| Experience Level | Option | `Junior / Mid / Senior / Lead` |
| Short Description | PlainText | card + meta description |
| Description | RichText | |
| Responsibilities | RichText | |
| Requirements | RichText | |
| Benefits | RichText | |
| Salary Range | PlainText | free text — ranges rarely fit a Number |
| Remote | Switch | |
| Application Email | Email | |
| Application URL | Link | for an external ATS |
| Hiring Manager | ItemRef → Team Member | puts a face on the listing |
| Posted Date | DateTime | |
| Closing Date | DateTime | |
| Is Open | Switch | **filter on this** — never delete a filled position; it keeps the URL and any inbound links alive |
| Order | Number | |

Separate `Responsibilities` / `Requirements` / `Benefits` rather than one blob — it forces
consistent job posts and lets you style each block differently.

### Supporting collections

**Category · Tag · Department · Location · Service** — each: Name, Slug, Description (PlainText),
optional Image, optional Colour (for tag chips), Order, plus SEO fields if it gets a page.
Keep them small. Their value is filterability and having a page, not fields.

---

## 4. Collection Lists — what MCP can and cannot do

**This is the hard boundary. Read it before promising anything.**

| Task | MCP |
|---|---|
| Create the Collection List element shell | ✅ |
| **Set the list's collection source** | ❌ **Designer only** |
| **Set filter / sort** | ❌ **Designer only** |
| Bind inner elements (heading, image, link) to fields | ✅ `get_bindable_sources` → `set_settings` |
| Conditional visibility settings | ❌ |
| Date / number formatting on a binding | ❌ |
| Create localized CMS items | ❌ (read/update existing only) |

### The working sequence

```
1.  data_cms_tool > create_collection, then the field actions
2.  data_element_builder — create the Collection List shell and the card markup inside it
3.  ⏸  HAND OFF: user opens the Designer, selects the Collection List,
       sets Source → Collection, then Filter and Sort
4.  data_element_settings_tool > get_bindable_sources on each inner element
5.  data_element_settings_tool > set_settings — bind text, images, links
6.  data_cms_tool > create_collection_items  (created as DRAFTS)
7.  data_cms_tool > publish_collection_items
```

Steps 4–5 **cannot run before step 3** — bindable sources don't exist until the list has a source.
When you reach step 3, stop and tell the user exactly which list needs which collection attached.

---

## 5. Native gaps and the standard fixes

| Need | Native | Fix |
|---|---|---|
| >100 items on one page | ❌ | Pagination (Prev/Next only), or Finsweet **List Load** |
| Numbered pagination | ❌ | Finsweet List Load |
| Load more / infinite scroll | ❌ | Finsweet List Load |
| Runtime / faceted filtering | ❌ | Finsweet **List Filter** |
| Two-dimension filters | ❌ | Finsweet List Filter |
| Sort by a referenced field | ❌ | Denormalise the sort key |
| Multiple templates per collection | ❌ | Switch/Option + conditional visibility, or split collections |
| Category segment in the URL | ❌ | Only one dynamic segment per URL; use CMS folders for a static prefix |

Finsweet Attributes is on **v2** (v1 is discontinued) and remains the standard in 2026.
Note List Load **caches fetched documents by default** — set `fs-list-cache="false"` if you're
updating items via the Data API, or you'll serve stale content.

Next-gen CMS has largely removed the need for **List Nest** — 3 levels × 10 lists × 100 items is
native and renders server-side, which is better for SEO. Don't reach for List Nest by habit.

### Site search caveats

Requires Premium+. **Only the first pagination page of a Collection List is indexed**, and randomized
lists and components are not indexed at all. Individual CMS items cannot be excluded from search.

---

## 6. Slugs and SEO

- URL structure is fixed: `/{collection-url}/{item-slug}`. Lock the collection URL in **before**
  content entry — changing it breaks every live URL.
- Slugs: lowercase, digits, hyphens. Uppercase is lowercased, umlauts transliterate (ü→u), specials
  stripped. Unique per collection, 256 chars.
- **Changing a slug breaks the old URL immediately with no automatic redirect.** Add a 301 in
  Site settings → Redirects. For German sites, decide up front whether slugs carry umlauts —
  transliteration is silent and surprises people later.
- Per-item SEO: Page settings → SEO settings → "Add field" to build a pattern like `{Name} | Firma`.
  Keep titles under 60 chars.
- Sitemap regenerates on publish. Exclusion is **page-level only** — you cannot exclude a single
  CMS item. All-or-nothing per collection unless you supply a custom sitemap.xml.
