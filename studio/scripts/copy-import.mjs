/**
 * Imports the approved agency copy (delivery of 13.10.2026).
 *
 * One file per page under `scripts/copy/`, each exporting:
 *
 *     export default {
 *       id: "service-wurzelbehandlung",   // published document ID
 *       type: "service",
 *       source: "MP_LS_04_Wurzelbehandlung_v3_2026-10-12.docx",
 *       create: { ... },   // only for documents that do not exist yet
 *       set: { ... },      // fields or dot paths, as for client.patch().set()
 *       notes: [ ... ],    // what did not fit the format; printed only
 *     };
 *
 * Modelled on `veneers-content.mjs`: the same three modes, the same dash
 * check. The difference is that this covers a dozen pages at once, so the
 * data sits next to the script instead of inside it.
 *
 * **Usage**
 *
 *     cd studio && DRY=1 npx sanity exec scripts/copy-import.mjs --with-user-token
 *     cd studio && DRAFT=1 npx sanity exec scripts/copy-import.mjs --with-user-token
 *     cd studio && ONLY=service-bleaching DRAFT=1 npx sanity exec scripts/copy-import.mjs --with-user-token
 *
 * `DRY=1` writes nothing. `DRAFT=1` writes into the draft: the state shows up
 * in the Studio as an unpublished change and can be checked in the preview
 * before anyone publishes it. Without either, the copy goes live directly.
 * `ONLY` takes one or more IDs, comma separated.
 *
 * Running it again is harmless.
 */
import { readdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-28" });
const DRY = process.env.DRY === "1";
const DRAFT = process.env.DRAFT === "1";
const ONLY = process.env.ONLY?.split(",").map((s) => s.trim());

const dir = join(dirname(fileURLToPath(import.meta.url)), "copy");

/* --- House rule: no dashes in page copy ----------------------------------
   Same check as in `veneers-content.mjs`. Prices ("450,–") and numeric ranges
   ("8–19 Uhr") are exempt.

   `seo.title` is exempt as well: the SEO agency delivers it finished ("bitte
   nicht neu schreiben"), and the dash in it is a separator like the slash,
   not a dash inside a sentence.

   Square brackets are rejected too. In the agency documents they mark either
   a gap only the practice can fill or the anchor of a link — neither belongs
   on the page as typed. */
const ALLOWED = [/,–/g, /\d\s?[–—]\s?\d/g];

function checkText(value, path = "") {
  if (typeof value === "string") {
    const rest = ALLOWED.reduce((s, form) => s.replace(form, ""), value);
    if (/[—–]/.test(rest))
      throw new Error(`Dash in ${path}: "${value.slice(0, 70)}…"`);
    if (/[[\]]/.test(value))
      throw new Error(`Square bracket in ${path}: "${value.slice(0, 70)}…"`);
    return;
  }
  if (Array.isArray(value))
    return value.forEach((v, i) => checkText(v, `${path}[${i}]`));
  if (value && typeof value === "object")
    return Object.entries(value).forEach(([k, v]) => {
      const p = path ? `${path}.${k}` : k;
      if (p.endsWith("seo.title") || p === "seo.title") return;
      checkText(v, p);
    });
}

async function load() {
  const files = (await readdir(dir)).filter((f) => f.endsWith(".mjs"));
  const pages = [];
  for (const f of files.sort()) {
    const { default: page } = await import(pathToFileURL(join(dir, f)));
    if (ONLY && !ONLY.includes(page.id)) continue;
    pages.push(page);
  }
  return pages;
}

async function write(page) {
  const { id, type, create, set } = page;
  const target = DRAFT ? `drafts.${id}` : id;

  const published = await client.getDocument(id);
  if (!published && !create)
    throw new Error(`${id} does not exist and the file does not create it.`);

  console.log(`\n${id}  ←  ${page.source}`);
  console.log(
    `  ${published ? "exists" : "NEW"} · ${Object.keys(set).length} fields · target ${target}`,
  );
  for (const n of page.notes ?? []) console.log(`  ! ${n}`);

  if (DRY) return;

  /* A draft starts as a copy of the published state, otherwise it would lack
     every field this script does not write. A new document starts from
     `create`. */
  if (published) {
    if (DRAFT) {
      const { _id, _rev, _createdAt, _updatedAt, _system, ...rest } = published;
      await client.createIfNotExists({ ...rest, _id: target, _type: type });
    }
  } else {
    await client.createIfNotExists({ ...create, _id: target, _type: type });
  }

  await client.patch(target).set(set).commit();
  console.log("  ✓ written");
}

const pages = await load();
if (!pages.length) throw new Error("No page selected.");

/* Check everything before writing anything: a dash in the ninth file must not
   leave eight half-imported pages behind. */
for (const p of pages) checkText(p.set, p.id);

for (const p of pages) await write(p);
console.log(
  DRY
    ? "\nDry run. Nothing written."
    : DRAFT
      ? "\nEverything is in the Studio as an unpublished change."
      : "\nPublished.",
);
