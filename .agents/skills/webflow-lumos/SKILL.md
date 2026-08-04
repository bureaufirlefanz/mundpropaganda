---
name: webflow-lumos
description: Build and edit Webflow sites using the Lumos framework (Timothy Ricks) via the Webflow MCP server. Use when working on a Webflow site that uses Lumos class naming (u- utilities, is- combos, underscore custom classes), when creating Webflow CMS collections and Collection Lists, when creating Webflow variables/styles/components through MCP, or when the user mentions Lumos, Webflow MCP, or a Webflow build. Covers class naming rules, variable conventions, MCP call ordering, CMS schema design, and a pre-handover QA checklist.
---

# Webflow + Lumos build guideline

You are building inside a **Lumos v2** Webflow site through the **Webflow MCP server (v2.0.1)**.
Lumos is a class-naming and design-token framework. Webflow MCP is the API surface.
Getting either wrong produces a site that looks fine and is unmaintainable.

## Prime directive: discover, never assume

**Lumos ships a large predefined set of utility classes and variables that changes between versions.**
This document encodes the *grammar and rules*, deliberately **not** a frozen class list — a hardcoded
list goes stale and causes you to invent classes that don't exist.

Before creating **any** style or variable, run the discovery pass in
`references/mcp-workflow.md` §1. Then obey this rule:

> **Never invent a `u-` class or a variable name. Read what exists, reuse it.
> Only create new ones when discovery proves nothing suitable exists, and then follow the naming grammar exactly.**

If you catch yourself writing a `u-` class name you have not seen in `get_styles` output, stop.
That is the single most common failure mode — the official Lumos skill has an open bug report for
exactly this (hallucinated `.nav_wrap` when the real classes were `.nav_component` /
`.nav_desktop_wrap` / `.nav_mobile_wrap`).

## The five non-negotiables

1. **Call `webflow_guide_tool` once at session start**, before any other Webflow tool. Then call
   `data_agent_instructions_tool > search_instructions` for the site — site-specific Rules override
   this document.
2. **Custom class first, always.** Every element gets a custom class (underscores) as its *first*
   class. Utilities (`u-`) and combos (`is-`) stack on top. Never a utility alone as the base.
3. **Longhand CSS properties only.** `padding-top`, never `padding`. Webflow's own guidance and
   required for predictable style merging.
4. **No px. No tablet/mobile breakpoint styles.** Lumos v2 is breakpointless — rem, `clamp()`,
   container queries, and wrapping flex/grid do the work. See `references/lumos-conventions.md` §5.
5. **Never publish, never change a slug, never delete** without explicit user confirmation in that
   turn. Compression, `remove_element`, and `delete_variable` are irreversible via the API.

## Build order

Dependencies are real — later steps fail or produce orphans if earlier ones are skipped.

```
0. webflow_guide_tool  →  data_agent_instructions_tool.search_instructions
1. DISCOVER    list_sites → get_variable_collections → get_variables → get_styles → list_pages
2. VARIABLES   create/extend tokens (primitives first, then semantic)      [data_variable_tool]
3. STYLES      create classes that consume those variables                 [data_style_tool]
4. CMS         create_collection → fields → items                          [data_cms_tool]
5. STRUCTURE   pages → elements → components                               [data_element_builder,
                                                                            data_component_tool]
6. BIND        element settings → CMS fields                               [data_element_settings_tool]
7. QA          references/qa-checklist.md
```

A variable must exist before a style can reference it. A style must exist before
`set_style` can apply it. A collection and its fields must exist before items.
A component definition must exist before an instance.

## The one thing MCP cannot do

**MCP cannot set a Collection List's source, filter, or sort.** It can create the element shell and
bind the *inner* elements to fields, but attaching the collection to the list is a **manual Designer
step**. Plan for a human handoff there. Do not claim a Collection List is wired when it isn't.
Full detail and the handoff script: `references/cms-collections.md` §4.

Also unavailable: interactions/animations (IX3), conditional-visibility binding settings,
date/number formatting on bindings, and creating localized CMS items.

## References

Read the relevant file before acting — do not work from memory.

| File | Read it when |
|---|---|
| `references/lumos-conventions.md` | Naming any class, creating any variable, styling anything |
| `references/mcp-workflow.md` | Any MCP call — ordering, discovery, batching, error handling |
| `references/cms-collections.md` | Any CMS work — schemas for reviews/blog/team/careers, limits, binding |
| `references/qa-checklist.md` | Before telling the user the build is done |

## Reporting

Summary first. State what you changed, what needs a manual Designer step, and what you did not
verify. Full detail only on request. Never report a step as complete when it ended at the
Collection List handoff.
