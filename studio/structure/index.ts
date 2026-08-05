import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { CogIcon } from "@sanity/icons/Cog";
import { TagsIcon } from "@sanity/icons/Tags";
import { HomeIcon } from "@sanity/icons/Home";
import { CaseIcon } from "@sanity/icons/Case";
import { UserIcon } from "@sanity/icons/User";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { MenuIcon } from "@sanity/icons/Menu";
import { StackCompactIcon } from "@sanity/icons/StackCompact";
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
 * ── Was hier NICHT steht, und warum ──────────────────────────────────────
 *
 * Praxis & Team, Magazin (Übersicht und Beiträge), Kontakt, Notdienst, die
 * Leistungs-Übersicht, Pillar Pages und die Rechtstexte sind bewusst
 * ausgeblendet: **Diese Seiten gibt es auf der Website nicht.** Wer sie hier
 * pflegt und publiziert, sieht das Ergebnis nirgends — und glaubt danach
 * keinem anderen Feld mehr.
 *
 * Die Schemadateien bleiben liegen, sie sind fertig. Zurück kommt ein Typ,
 * sobald seine Route steht; `npm run web:check` meldet unter „Routen-Deckung“
 * genau diese Liste, bis das geschehen ist.
 *
 * Reihenfolge beim Zurückholen: erst die Route in `web/src/pages/` bauen,
 * dann hier eintragen. Andersherum entsteht wieder die Lücke, die diese
 * Aufgabe geschlossen hat.
 */

/**
 * Typen, die es genau einmal gibt. Sie hängen an einer festen ID (gleich dem
 * Typnamen) und werden unten aus der generischen Liste herausgefiltert —
 * sonst stünden sie zweimal da, einmal als Seite und einmal als Sammlung, in
 * der man ein zweites anlegen könnte.
 */
export const EINZELDOKUMENTE = ["startseite", "magazinIndex", "karriere", "einstellungen", "navigation", "footer"];

/**
 * Einzeldokumente ohne Seite. Sie stehen weiterhin in den Vorlagen-Sperren
 * und in dieser Liste, damit niemand sie versehentlich über die generische
 * Auflistung wieder hereinholt — sichtbar sind sie nicht.
 */
export const OHNE_ROUTE = [
  "leistungenIndex",
  "praxis",
  "kontakt",
  "notdienst",
  "pillar",
  "rechtstext",
];

/** Typen mit eigenem, ausgeschriebenem Eintrag — nicht noch einmal generisch. */
const AUSGESCHRIEBEN = [...EINZELDOKUMENTE, ...OHNE_ROUTE, "leistung", "beitrag", "person", "stelle"];

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

      /* Nur die Leistungen selbst, ohne Übersichtsseite: `/leistungen` gibt
         es nicht, `/leistungen/<slug>` schon. */
      orderableDocumentListDeskItem({
        type: "leistung",
        title: "Leistungen",
        icon: TagsIcon,
        S,
        context,
      }),

      /* Das Magazin: erst die Übersichtsseite, darunter die Beiträge. In
         dieser Reihenfolge, weil /magazin die Beiträge trägt und nicht
         umgekehrt. Beide waren bis hierher ausgeblendet — der Typ `beitrag`
         hatte keine Route, und die vier Beiträge standen fest im Markup des
         Karussells. Jetzt gibt es /magazin und /magazin/<slug>. */
      einzeldokument(S, "magazinIndex", "Magazin", DocumentsIcon),
      S.documentTypeListItem("beitrag").title("Beiträge").icon(DocumentTextIcon),

      einzeldokument(S, "karriere", "Karriere", CaseIcon),

      S.divider(),

      /* --- Bausteine, die auf mehreren Seiten auftauchen ---------------- */
      S.documentTypeListItem("person").title("Team").icon(UserIcon),
      orderableDocumentListDeskItem({
        type: "stelle",
        title: "Stellen",
        icon: CaseIcon,
        S,
        context,
      }),

      S.divider(),

      /* Der Rahmen: was auf jeder Seite gleich ist. Unter den Seiten, weil
         man ihn seltener anfasst — aber auffindbar unter dem Namen, unter dem
         man ihn sucht. Bis Aufgabe 8 stand beides fest im Markup. */
      einzeldokument(S, "navigation", "Navigation", MenuIcon),
      einzeldokument(S, "footer", "Seitenfuß", StackCompactIcon),
      einzeldokument(S, "einstellungen", "Einstellungen", CogIcon),

      /* Was künftig dazukommt, erscheint hier von selbst — ohne dass jemand
         diese Datei anfassen muss. Erst wenn ein Typ eine eigene Ordnung
         braucht, bekommt er oben einen ausgeschriebenen Eintrag. */
      ...S.documentTypeListItems().filter(
        (eintrag) => !AUSGESCHRIEBEN.includes(eintrag.getId() as string)
      ),
    ]);
