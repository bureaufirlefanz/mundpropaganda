# Webflow MCP 2.0.1 workflow

Server: `https://mcp.webflow.com/mcp`. Tools are **coarse-grained with an `actions[]` array** —
you call `data_cms_tool` with an action like `create_collection`, not a tool named `create_collection`.
Batch independent actions into one call; they execute sequentially.

---

## 1. Discovery pass — run this before building anything

Never skip. This is what stops you inventing classes and variables.

```
1. webflow_guide_tool                                    once per session, first
2. data_agent_instructions_tool > search_instructions     site Rules override this guideline
3. data_sites_tool > list_sites                           get site_id — never assume it
4. data_variable_tool > get_variable_collections          collection ids + mode ids
5. data_variable_tool > get_variables                     the real token inventory
6. data_style_tool > get_styles                           the real class inventory  ← filter, it's big
7. data_pages_tool > list_pages                           page ids
8. data_cms_tool > get_collection_list                    existing collections
9. data_component_tool > get_all_components               reusable components
```

Then **write down** (in your reasoning, or to the user) which existing utilities and variables you
intend to reuse. If you cannot name the source of a class, you are about to hallucinate it.

`get_styles` returns a lot — use filters/queries rather than pulling everything.

---

## 2. Ordering and dependencies

Hard dependencies — violating these fails or orphans:

```
variable                    →  style that references it
style (create_style)        →  element (set_style)          set_style requires existing names
page (create_page)          →  elements on it
collection                  →  fields                       →  items
component definition        →  instance                     →  prop values
Slot element in definition  →  insert_in_slot
create/update items         →  publish_collection_items     items are created as DRAFTS
create_asset → PUT presigned URL → set_image_asset
```

`get_bindable_sources` must run before `set_settings` with a binding — you need a valid source id.

Reference fields require the target collection to exist, and to be **published** before the
reference resolves via API.

---

## 3. Tool map

| Job | Tool |
|---|---|
| Sites | `data_sites_tool` — `list_sites`, `get_site`, `publish_site` |
| Variables | `data_variable_tool` — `create_color_variable`, `create_size_variable`, `create_number_variable`, `create_percentage_variable`, `create_font_family_variable`, `create_variable_collection`, `create_variable_mode`, `get_variable_collections`, `get_variables`, `rename_variable`, `delete_variable` |
| Styles | `data_style_tool` — `create_style`, `update_style`, `get_styles`, `query_styles`, `rename_style`, `remove_style`, `set_style_variable_mode`, `get_style_variable_modes` |
| Elements (read/edit) | `data_element_tool` — `get_all_elements`, `query_elements`, `set_text`, `set_style`, `set_link`, `set_image_asset`, `set_heading_level`, `set_attributes`, `move_element`, `remove_element`, `set_display_name` |
| Element settings/bindings | `data_element_settings_tool` — `get_bindable_sources`, `get_settings`, `set_settings`, `set_tag`, `set_dom_id`, `set_visibility` |
| Create elements | `data_element_builder > create_element` |
| Bulk markup | `data_whtml_builder > insert_whtml` — **max 5 per call** |
| Components | `data_component_tool`, `data_component_props_tool`, `data_component_variants_tool`, `data_component_builder` |
| Pages | `data_pages_tool` — `list_pages`, `create_page`, `update_page_settings`, `bulk_update_pages`, `create_branch` |
| CMS | `data_cms_tool` |
| Assets | `data_assets_tool`, `get_asset_preview` |
| Custom code | `data_scripts_tool` |
| Site rules for agents | `data_agent_instructions_tool` |

---

## 4. Styles — the Lumos-critical details

**Combo classes:** `create_style` takes `parent_style_name`. A Lumos `is-` class must be created
with its custom class as parent.

**`set_style` replaces the element's entire style list**, and multiple names are treated as combo
classes — so pass the full intended stack in order:

```
set_style(id, ["hero_secondary_title", "u-text-style-h1", "is-centered"])
                custom (first)          utility            combo
```

**Longhand only.** `padding-top`, `margin-bottom`, `border-top-width` — never the shorthand.

**Breakpoints:** default is `main`. Per Lumos, do not write `medium` / `small` / `tiny` styles.

**Reuse over create.** Webflow's own guidance: "most users prefer using existing styles. You should
reuse styles if they exist, unless the user explicitly wants new ones." For Lumos this is doubly
true — the utility set is the framework.

---

## 5. Variables — value forms

```
static_value          typed literal            "#ff0000" | { value: 16, unit: "px" }
existing_variable_id  alias to another var     ← use for EVERY semantic/Theme variable
custom_value          raw CSS expression       clamp() | calc() | color-mix() | min() | max()
```

Exactly one per variable. `custom_value` is how Lumos's fluid sizes and `color-mix()` opacity ramps
are expressed — reach for it rather than flattening to a static value.

Modes: `create_variable_mode` on a collection, then `data_style_tool > set_style_variable_mode` to
bind a class to a mode. This is the mechanism behind `u-theme-*` and `u-text-style-*`.

---

## 6. Headless vs Bridge App

**Works headlessly** (Designer closed) — elements, styles, variables, components, props, variants,
CMS, pages, assets, fonts, forms, custom code, sitemap, SEO metadata.

**Requires the MCP Bridge App open in the Designer:**

- `element_snapshot_tool` — visual snapshots (workaround: publish to staging and look at the URL)
- `designer_tool` — current selection, canvas navigation, current page/mode/branch, breakpoints
- `designer_tool > create_page_folder`
- `asset_tool > upload_image_by_url` — uploading an image from a public URL

If a call returns **`ModeForbidden`**, the Designer is in the wrong mode. Canvas changes need
**Build mode**. Ask the user to switch rather than retrying.

Bridge App drops out when Chrome sleeps the tab — tell the user to add `webflow.com` under
`chrome://settings/performance` → "Always keep these sites active".

---

## 7. Limits and failure modes

| Constraint | Value |
|---|---|
| Rate limit | 60 req/min (Starter, Basic) · 120 req/min (Premium+) · `429` + `Retry-After` |
| Site publish | 1 successful publish per minute |
| `data_whtml_builder` | max 5 per call |
| `get_asset_preview` | images only, ≤2 MB |
| `compress_assets` | ≤100 ids, one task per site, **destructive — originals not retained**, no SVG/GIF |
| Workspace | one per authorization; `rm -rf ~/.mcp-auth` to switch |
| Enterprise-gated | `data_enterprise_tool` (301s, robots.txt, activity logs) |
| Analyze add-on gated | `data_analyze_tool` |

Rate limiting is the realistic failure — one build turn can fan out to dozens of calls. Batch actions
into single tool calls rather than looping.

**Not supported at all:** IX3 interactions/animations, Collection List source/filter/sort, binding
conditionals, date/number formatting on bindings, creating localized CMS items, Google/Adobe font
management, field validation via API.

---

## 8. Safety

- Present a changeset and get explicit approval before any write batch
- Never publish without being asked in that turn
- Never change a slug without consent — it breaks the live URL with no automatic redirect
- `remove_element`, `delete_variable`, `delete_asset`, `compress_assets` are irreversible via API
- Use **page branches** (`data_pages_tool > create_branch`) for anything risky on a live site
- Retry once on transient errors, then surface the actual error to the user

---

## 9. Large refactors

Webflow's own guidance: do **10–20 critical styles through MCP**, then generate a batch script
(browser-console JS or Data API TS) for the remaining hundred. MCP is not the right tool for
high-volume style mutation — it will hit rate limits and burn context. Say so rather than grinding.

---

## 10. Persist conventions into the site

`data_agent_instructions_tool` stores markdown **Rules** (always-on) and **Skills** (on-demand)
scoped to the site, and Webflow feeds them to any connected agent automatically.

**After a build, offer to write the project's Lumos conventions into the site as a Rule.** That way
the next agent session — yours, the client's, or a different tool entirely — inherits them without
this file being present.
