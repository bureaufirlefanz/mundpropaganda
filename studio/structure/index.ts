import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { CogIcon } from "@sanity/icons/Cog";
import { TagsIcon } from "@sanity/icons/Tags";
import { HomeIcon } from "@sanity/icons/Home";
import { CaseIcon } from "@sanity/icons/Case";
import { UserIcon } from "@sanity/icons/User";
import { UsersIcon } from "@sanity/icons/Users";
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
 * Dokumenttypen („ein Dokument vom Typ careers“). Deshalb steht oben die
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
export const SINGLETONS = [
  "homepage",
  "practice",
  "magazineIndex",
  "careers",
  "settings",
  "navigation",
  "footer",
];

/**
 * Einzeldokumente ohne Seite. Sie stehen weiterhin in den Vorlagen-Sperren
 * und in dieser Liste, damit niemand sie versehentlich über die generische
 * Auflistung wieder hereinholt — sichtbar sind sie nicht.
 */
export const UNROUTED = ["servicesIndex", "contactPage", "emergency", "pillar"];

/** Typen mit eigenem, ausgeschriebenem Eintrag — nicht noch einmal generisch. */
const EXPLICIT = [
  ...SINGLETONS,
  ...UNROUTED,
  "service",
  "post",
  "person",
  "job",
  "legalPage",
];

function singleton(
  S: StructureBuilder,
  type: string,
  title: string,
  icon: ComponentType,
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(type).title(title));
}

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Mundpropaganda")
    .items([
      /* --- Die Seiten, in der Reihenfolge der Navigation --------------- */
      singleton(S, "homepage", "Startseite", HomeIcon),

      /* Nur die Leistungen selbst, ohne Übersichtsseite: `/leistungen` gibt
         es nicht, `/leistungen/<slug>` schon. */
      orderableDocumentListDeskItem({
        type: "service",
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
      /* Praxis und Team: erst die Seite, darunter die Personen. Beide waren
         bis hierher ausgeblendet — `practice` hatte keine Route, und das
         Team stand nur als Kurzprofil auf anderen Seiten. Jetzt gibt es
         /praxis und /praxis/<slug>. */
      singleton(S, "practice", "Praxis", UsersIcon),
      orderableDocumentListDeskItem({
        type: "person",
        title: "Team",
        icon: UserIcon,
        S,
        context,
      }),

      singleton(S, "magazineIndex", "Magazin", DocumentsIcon),
      S.documentTypeListItem("post").title("Beiträge").icon(DocumentTextIcon),

      singleton(S, "careers", "Karriere", CaseIcon),

      S.divider(),

      /* --- Bausteine, die auf mehreren Seiten auftauchen ---------------- */
      orderableDocumentListDeskItem({
        type: "job",
        title: "Stellen",
        icon: CaseIcon,
        S,
        context,
      }),

      S.divider(),

      /* Der Rahmen: was auf jeder Seite gleich ist. Unter den Seiten, weil
         man ihn seltener anfasst — aber auffindbar unter dem Namen, unter dem
         man ihn sucht. Bis Aufgabe 8 stand beides fest im Markup. */
      singleton(S, "navigation", "Navigation", MenuIcon),
      singleton(S, "footer", "Footer", StackCompactIcon),
      singleton(S, "settings", "Einstellungen", CogIcon),

      /* Rechtstexte. Standen bis hierher in UNROUTED — nicht weil sie
         niemand braucht, sondern weil es `/impressum` nicht gab und die Zeile
         im Seitenfuß deshalb leer blieb. Mit der Route `/[slug]` ist beides
         aufgelöst. Ganz unten, weil man sie einmal schreibt und dann jahrelang
         nicht mehr anfasst. */
      S.documentTypeListItem("legalPage")
        .title("Rechtstexte")
        .icon(DocumentTextIcon),

      /* Was künftig dazukommt, erscheint hier von selbst — ohne dass jemand
         diese Datei anfassen muss. Erst wenn ein Typ eine eigene Ordnung
         braucht, bekommt er oben einen ausgeschriebenen Eintrag. */
      ...S.documentTypeListItems().filter(
        (entry) => !EXPLICIT.includes(entry.getId() as string),
      ),
    ]);
