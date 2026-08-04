# QA checklist

Run before telling the user a build is done. Report results as a short pass/fail list — not prose.
Anything you could not verify, say so explicitly rather than omitting it.

---

## 1. Class hygiene (Lumos)

Pull `data_style_tool > get_styles` and `data_element_tool > get_all_elements` and check:

- [ ] **Every element has a custom class**, and it is **first** in the stack
      (exceptions: slots using `u-display-contents`; one/two-element base components)
- [ ] No custom class has **more than 3 underscores**
- [ ] No custom class uses dashes; no `u-` or `is-` class uses underscores
- [ ] No element stacks **more than 4 utilities**
- [ ] No `is-` combo sits on top of a utility instead of a custom class
- [ ] **Every `u-` class used actually exists** in `get_styles` output — no invented ones
- [ ] Every **newly created** utility is present on the Style Guide page
      (otherwise Webflow's cleanup deletes it) and ordered **above** custom classes in the stylesheet
- [ ] `_wrap` appears at the start of each component, not mid-tree
- [ ] Duplicated components have duplicated custom classes — no shared classes bleeding styles

## 2. Breakpoints and units

- [ ] **No styles on `medium`, `small`, or `tiny` breakpoints** — Lumos is breakpointless.
      Query styles per breakpoint to confirm. Any hit is a defect unless the user approved it.
- [ ] **No px values** in padding, margin, gap, font-size, border-radius, or border-width
- [ ] Horizontal flex containers that hold variable content have **wrapping enabled**
- [ ] Grids use `u-grid-autofit` / `u-grid-autofill` / the Grid component rather than fixed columns
- [ ] Only **longhand** CSS properties were written

**Manual check to request from the user:** set browser font size to 200% and confirm no text
overflows and no layout breaks. This is Lumos's stated accessibility target and cannot be verified
through MCP.

## 3. Variables

- [ ] No hardcoded hex colours anywhere — all colour flows through Theme variables
- [ ] Theme variables **alias** swatches (`existing_variable_id`), not literal hex values
- [ ] No new variable duplicates an existing one under a different name
- [ ] `site/column-width` untouched; Column Count and Alignment collections unmodified
- [ ] Components have an **Inherit variant with no theme class applied**
- [ ] `u-theme-*` / `u-brand-*` still resolve — spot-check one section in each theme

## 4. CMS

- [ ] Every collection is **within 60 fields and 10 reference/multi-reference fields**
- [ ] No list stored in a plain-text field
- [ ] Option fields only where the value set is closed and editor-managed
- [ ] Every field has **helper text** — check this properly, it's the handover-critical one
- [ ] Every collection that needs manual sorting has an `Order` number field
- [ ] `Is Active` / `Is Open` switches exist where items should be hidden rather than deleted
- [ ] Collection URLs are final — confirm before any content exists
- [ ] Items intended to be live are **published**, not left as drafts

## 5. Bindings

- [ ] **Every Collection List has a source attached** — this is the manual Designer step; verify it
      actually happened rather than assuming
- [ ] Filters and sorts set as specified
- [ ] No unbound placeholder text left in a collection item template
- [ ] Every bound image has **alt text** bound to a field, not left empty or static
- [ ] Empty states exist on every Collection List, with real copy — not "No items found"
- [ ] Pagination set where a list can exceed 100 items

## 6. SEO

- [ ] SEO title and meta description patterns set on every Collection page template
- [ ] Patterns bind to **always-populated** fields — no empty tags when an override is blank
- [ ] OG image field exists, is **JPG/PNG**, and all images in the collection share dimensions
- [ ] SEO titles under ~60 characters
- [ ] Sitemap enabled; utility/thank-you pages excluded from indexing
- [ ] Slugs are final; 301s in place for anything that changed

## 7. Accessibility

- [ ] `page_main` tagged **Main** with `id="main"`, and a skip-to-main link exists
- [ ] Heading levels are sequential — exactly one `h1` per page, no skipped levels
      (`set_heading_level` reports these)
- [ ] All images have alt text; decorative images have it explicitly cleared, not just blank
- [ ] Link text is meaningful — no bare "Mehr" / "Read more" repeated without context
- [ ] Focus styles intact (Lumos ships `--focus--width` / `--focus--offset-*` — confirm nothing
      overrode `outline`)
- [ ] Touch targets ≥44×44px on mobile; body text ≥16px (prevents iOS zoom-on-focus)

## 8. Handover

- [ ] Client can edit every piece of copy and every image without opening the Designer
- [ ] `page_main` is still a **Page Slot** so sections can be added and reordered in Build mode
- [ ] No structural element left where a client edit could break layout
- [ ] Site conventions written into the site as a Rule via `data_agent_instructions_tool`
- [ ] Client roles set correctly — content editors should not have full Designer seats

---

## Report format

```
QA — [site name]

PASS   Class hygiene · Variables · SEO
FAIL   Breakpoints — 3 styles found on `medium` (hero_wrap, card_layout, nav_inner)
MANUAL Collection List "Magazin" source not attached — needs Designer
UNVERIFIED  200% font-size reflow — requires a browser check
```

State failures plainly. Do not soften them, and do not report a manual step as complete.
