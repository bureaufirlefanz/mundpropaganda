import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { CogIcon } from "@sanity/icons/Cog";
import { TagsIcon } from "@sanity/icons/Tags";
import { HomeIcon } from "@sanity/icons/Home";
import { UsersIcon } from "@sanity/icons/Users";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { BlockContentIcon } from "@sanity/icons/BlockContent";
import { CaseIcon } from "@sanity/icons/Case";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { WarningOutlineIcon } from "@sanity/icons/WarningOutline";
import { UserIcon } from "@sanity/icons/User";
import { FolderIcon } from "@sanity/icons/Folder";
import type { ComponentType } from "react";

/**
 * Die Seitenleiste des Studios — gebaut wie die Sitemap, nicht wie die
 * Datenbank.
 *
 * Wer hier etwas sucht, denkt in Seiten („die Karriereseite“), nicht in
 * Dokumenttypen („ein Dokument vom Typ karriere“). Deshalb steht oben die
 * Seitenstruktur in der Reihenfolge der Navigation, darunter erst, was keine
 * eigene Seite ist: Team, Stellen, Einstellungen.
 *
 * Die Rechtstexte liegen in einem eigenen Ordner statt in der Seitenliste.
 * Sie gehören zur Website, aber niemand pflegt sie wöchentlich — im ersten
 * Block stünden sie nur im Weg.
 */

/**
 * Typen, die es genau einmal gibt. Sie hängen an einer festen ID (gleich dem
 * Typnamen) und werden unten aus der generischen Liste herausgefiltert —
 * sonst stünden sie zweimal da, einmal als Seite und einmal als Sammlung, in
 * der man ein zweites anlegen könnte.
 */
export const EINZELDOKUMENTE = [
  "startseite",
  "leistungenIndex",
  "praxis",
  "magazinIndex",
  "karriere",
  "kontakt",
  "notdienst",
  "einstellungen",
];

/** Typen mit eigenem, ausgeschriebenem Eintrag — nicht noch einmal generisch. */
const AUSGESCHRIEBEN = [
  ...EINZELDOKUMENTE,
  "leistung",
  "beitrag",
  "pillar",
  "rechtstext",
  "person",
  "stelle",
];

function einzeldokument(
  S: StructureBuilder,
  typ: string,
  titel: string,
  icon: ComponentType
) {
  return S.listItem()
    .title(titel)
    .icon(icon)
    .child(S.document().schemaType(typ).documentId(typ).title(titel));
}

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Mundpropaganda")
    .items([
      /* --- Die Seiten, in der Reihenfolge der Navigation --------------- */
      einzeldokument(S, "startseite", "Startseite", HomeIcon),

      /* Übersicht und Einzelseiten der Leistungen liegen zusammen — sie
         gehören inhaltlich zusammen, und getrennt sucht man die Übersicht
         zwischen den Leistungen. */
      S.listItem()
        .title("Leistungen")
        .icon(TagsIcon)
        .child(
          S.list()
            .title("Leistungen")
            .items([
              einzeldokument(S, "leistungenIndex", "Übersichtsseite", TagsIcon),
              S.divider(),
              orderableDocumentListDeskItem({
                type: "leistung",
                title: "Alle Leistungen",
                icon: TagsIcon,
                S,
                context,
              }),
            ])
        ),

      einzeldokument(S, "praxis", "Praxis & Team", UsersIcon),

      S.listItem()
        .title("Magazin")
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title("Magazin")
            .items([
              einzeldokument(S, "magazinIndex", "Übersichtsseite", DocumentsIcon),
              S.divider(),
              S.documentTypeListItem("beitrag").title("Alle Beiträge"),
            ])
        ),

      einzeldokument(S, "karriere", "Karriere", CaseIcon),
      einzeldokument(S, "kontakt", "Kontakt", EnvelopeIcon),
      einzeldokument(S, "notdienst", "Notdienst", WarningOutlineIcon),

      S.documentTypeListItem("pillar").title("Pillar Pages").icon(BlockContentIcon),

      S.divider(),

      /* --- Bausteine, die auf mehreren Seiten auftauchen ---------------- */
      S.documentTypeListItem("person").title("Team").icon(UserIcon),
      S.documentTypeListItem("stelle").title("Stellen").icon(CaseIcon),

      S.divider(),

      /* --- Selten angefasst -------------------------------------------- */
      S.listItem()
        .title("Rechtliches")
        .icon(FolderIcon)
        .child(S.documentTypeList("rechtstext").title("Rechtstexte")),

      einzeldokument(S, "einstellungen", "Einstellungen", CogIcon),

      /* Was künftig dazukommt, erscheint hier von selbst — ohne dass jemand
         diese Datei anfassen muss. Erst wenn ein Typ eine eigene Ordnung
         braucht, bekommt er oben einen ausgeschriebenen Eintrag. */
      ...S.documentTypeListItems().filter(
        (eintrag) => !AUSGESCHRIEBEN.includes(eintrag.getId() as string)
      ),
    ]);
