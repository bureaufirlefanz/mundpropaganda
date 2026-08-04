import { defineType, defineField, defineArrayMember } from "sanity";
import { HomeIcon } from "@sanity/icons/Home";

/**
 * Die Startseite — jeder Abschnitt einzeln pflegbar.
 *
 * Bewusst KEIN Baukasten: Die Reihenfolge der Startseite ist gestaltet, nicht
 * zusammengesteckt. Stattdessen eine Gruppe je Abschnitt, in derselben
 * Reihenfolge, in der sie auf der Seite stehen — wer im Studio den zweiten
 * Reiter öffnet, sieht den zweiten Abschnitt der Seite.
 *
 * Jedes Feld liegt seit Aufgabe 4 in genau einer von drei Klassen:
 *
 *   1. Trägt die Seite   → `required()`. Der Baustein darf sich auf das Feld
 *                          verlassen; leeren lässt es sich nicht mehr, ohne
 *                          dass das Studio den Publish verweigert.
 *   2. Wahlfrei          → keine Regel. Was fehlt, VERSCHWINDET von der
 *                          Seite. Nichts tritt an seine Stelle.
 *   3. Nie gepflegt      → gar kein Feld. Steht fest im Baustein, und das
 *                          ist ehrlich so.
 *
 * Vorher war alles freiwillig und fiel still auf den Text im Baustein zurück.
 * Das war für einen Prototyp die richtige Abwägung und für einen Kunden der
 * Moment, in dem das CMS sein Vertrauen verliert: Er löscht einen Satz,
 * publiziert, und der Satz steht weiter da.
 *
 * Bilder sind die eine bewusste Ausnahme von Klasse 2. Ein leeres Bildfeld
 * fällt weiter auf das gestaltete Motiv aus der lokalen Bildpipeline zurück,
 * statt den Abschnitt auszublenden — der Kunde hat dieses Foto nie getippt,
 * der Vertrauensbruch, um den es bei Text geht, gilt hier nicht. Ein leeres
 * Bildfeld heißt „noch nicht hochgeladen“, nicht „bewusst gelöscht“.
 */

const gruppen = [
  { name: "hero", title: "Hero", default: true },
  { name: "split", title: "Über uns" },
  { name: "services", title: "Leistungen" },
  { name: "standards", title: "Standards" },
  { name: "standorte", title: "Standorte" },
  { name: "experten", title: "Team" },
  { name: "stories", title: "Geschichten" },
  { name: "magazin", title: "Magazin" },
  { name: "faq", title: "Fragen" },
  { name: "seo", title: "SEO" },
];

/** Überschrift + Zusatzzeilen, wie sie fast jeder Abschnitt braucht. */
/* Topline und Überschrift tragen ihren Abschnitt — ohne sie beginnt er ohne
   Ansage. Beide sind deshalb Pflicht (Klasse 1). Bis Aufgabe 4 waren sie
   wahlfrei, und ein geleertes Feld fiel still auf den Text im Baustein
   zurück; der Kunde löschte eine Überschrift und sah sie weiter stehen. */
const kopf = (gruppe: string, mitTopline = true) =>
  [
    mitTopline &&
      defineField({
        name: `${gruppe}Topline`,
        title: "Topline",
        type: "string",
        group: gruppe,
        validation: (r) => r.required(),
      }),
    defineField({
      name: `${gruppe}Titel`,
      title: "Überschrift",
      type: "string",
      group: gruppe,
      validation: (r) => r.required(),
    }),
  ].filter(Boolean) as ReturnType<typeof defineField>[];

export const startseite = defineType({
  name: "startseite",
  title: "Startseite",
  type: "document",
  icon: HomeIcon,
  groups: gruppen,
  fields: [
    /* --- Hero ---------------------------------------------------------- */
    defineField({
      name: "heroZeilen",
      title: "Meta-Zeilen",
      type: "array",
      of: [{ type: "text", rows: 3 }],
      description:
        "Die beiden kleinen Blöcke links und rechts unter der Wortmarke. Zeilenumbrüche bleiben erhalten. Genau zwei Einträge.",
      group: "hero",
      /* Beide Regeln in EINEM Ausdruck. Sie standen als zwei `validation`-Keys
         am selben Feld — im Objektliteral gewinnt der letzte, und `max(2)` war
         damit still weg. Eine dritte Meta-Zeile hätte das Hero-Raster
         gesprengt, ohne dass das Studio gemuckt hätte. */
      validation: (r) => r.required().max(2),
    }),

    /* --- Über uns ------------------------------------------------------- */
    ...kopf("split"),
    defineField({
      name: "splitAbsaetze",
      title: "Absätze",
      type: "array",
      of: [{ type: "text", rows: 5 }],
      group: "split",
      validation: (r) => r.required(),
    }),
    defineField({ name: "splitBild", title: "Bild", type: "bild", group: "split" }),

    /* --- Leistungen ----------------------------------------------------- */
    defineField({
      name: "servicesTitel",
      title: "Überschrift",
      type: "string",
      description: "Die Leistungen selbst kommen aus der Collection „Leistungen“ - hier steht nur der Rahmen.",
      group: "services",
      validation: (r) => r.required(),
    }),
    /* `servicesZusatz` stand hier bis Aufgabe 4 — „Weitere Verweise“, ein
       Array aus Text und rohem Zielpfad. Es hat nie etwas bewirkt: Die
       kleineren Links unter der Tabelle kommen aus der Leistungen-Collection,
       nämlich aus allem mit `platzierung: "liste"`. Der Kunde konnte das Feld
       pflegen und sah auf der Seite nichts.
       Nicht angeschlossen, sondern entfernt: Die Collection ist die bessere
       Quelle — ein Verweis dorthin kann keinen Pfad vertippen und bricht nicht,
       wenn sich ein Slug ändert. Damit erledigt sich auch der Hinweis auf
       `servicesZusatz.ziel` in Aufgabe 11 der Umbauliste. */

    /* --- Standards ------------------------------------------------------ */
    ...kopf("standards", false),
    defineField({
      name: "standardsEintraege",
      title: "Punkte",
      type: "array",
      description: "Nummeriert in dieser Reihenfolge. Fünf passen gut.",
      group: "standards",
      of: [
        defineArrayMember({
          type: "object",
          name: "standard",
          fields: [
            defineField({ name: "name", title: "Titel", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
            /* Das Motiv gehört an den PUNKT, nicht an den Abschnitt: Die
               Zahnmaske rechts zeigt zu jedem Punkt ein anderes Bild und
               blendet beim Weiterwandern um.
               Es gab dafür einmal ein einzelnes Feld `standardsBild` am
               Abschnitt. Das konnte der Baustein nicht bedienen — fünf Motive
               lassen sich nicht aus einem Feld speisen, und deshalb tat es
               nichts. Hier hängt es richtig. */
            defineField({ name: "bild", title: "Bild in der Zahnmaske", type: "bild" }),
          ],
          preview: { select: { title: "name", subtitle: "text", media: "bild" } },
        }),
      ],
      /* Klasse 1: Die Punkte SIND der Abschnitt. Ohne sie bliebe eine
         Überschrift über einer leeren Liste stehen. */
      validation: (r) => r.required(),
    }),

    /* --- Standorte ------------------------------------------------------ */
    defineField({
      name: "standorteTitel",
      title: "Überschrift",
      type: "string",
      description: "Die Adressen selbst stehen in den Einstellungen - sie gelten auch im Seitenfuß.",
      group: "standorte",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "standorteBilder",
      title: "Bilder im Karussell",
      type: "array",
      description:
        "Die Motive auf dem Ring. Fünf sind ein guter Stand - der Ring füllt sich von selbst auf, bis er rund ist. Ohne eigene Bilder stehen hier die gestalteten Motive.",
      group: "standorte",
      of: [
        defineArrayMember({
          type: "object",
          name: "ringBild",
          fields: [
            defineField({ name: "bild", title: "Bild", type: "bild", validation: (r) => r.required() }),
            defineField({
              name: "beschriftung",
              title: "Beschriftung",
              type: "string",
              description: "Die Pille im Bild, z. B. der Standortname. Leer lassen für keine.",
            }),
          ],
          preview: {
            select: { title: "beschriftung", media: "bild" },
            prepare: ({ title, media }) => ({ title: title || "ohne Beschriftung", media }),
          },
        }),
      ],
    }),

    /* --- Team ----------------------------------------------------------- */
    ...kopf("experten", false),
    defineField({ name: "expertenNamen", title: "Namenszeile", type: "string", group: "experten", validation: (r) => r.required() }),
    /* Vorher `expertenText`, ein einzelnes Textfeld — und ebenfalls tot: Die
       Seite reichte es nie durch, `Experts.astro` erwartet ZWEI Absätze und
       hatte sie als Vorgabe im Frontmatter stehen. Jetzt als Array wie
       `splitAbsaetze`, damit die gesetzte Zweiteilung des Entwurfs erhalten
       bleibt und die Redaktion sie in der Hand hat. */
    defineField({
      name: "expertenAbsaetze",
      title: "Absätze",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      group: "experten",
      validation: (r) => r.required(),
    }),
    defineField({ name: "expertenBild", title: "Bild", type: "bild", group: "experten" }),

    /* --- Geschichten ---------------------------------------------------- */
    defineField({
      name: "storiesEintraege",
      title: "Geschichten",
      type: "array",
      description: "Bild, Name und Zitat gehören zusammen - sie wechseln gemeinsam.",
      group: "stories",
      of: [
        defineArrayMember({
          type: "object",
          name: "story",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "bild", title: "Bild", type: "bild" }),
            defineField({ name: "zitat", title: "Zitat", type: "text", rows: 6 }),
          ],
          preview: { select: { title: "name", subtitle: "zitat", media: "bild" } },
        }),
      ],
      /* Klasse 1. Der Abschnitt ist ein Kartenfächer mit gekoppeltem
         Zitatband — ohne Einträge bleibt ein leerer Fächer über einem leeren
         Zitat stehen. Dieselben Geschichten stehen auch auf den
         Leistungsseiten; sie werden EINMAL hier gepflegt. */
      validation: (r) => r.required(),
    }),
    /* Klasse 2. Unter dem Zitat stand ein Knopf „Ganze Story lesen" mit
       `href="#"` — er sah aus wie ein Angebot und ließ den Browser nach oben
       springen. Es gibt keine ganze Story: Die Stimmen sind Zitate, keine
       Beiträge. Wohin der Knopf führt, entscheidet jetzt die Redaktion; ohne
       Verweis erscheint er nicht. */
    defineField({
      name: "storiesAktion",
      title: "Knopf unter den Geschichten",
      type: "link",
      description: "Leer lassen, wenn es nichts weiterzulesen gibt - dann steht dort kein Knopf.",
      group: "stories",
    }),

    /* --- Magazin -------------------------------------------------------- */
    ...kopf("magazin"),
    defineField({ name: "magazinText", title: "Zusatzzeile", type: "text", rows: 3, group: "magazin", validation: (r) => r.required() }),

    /* --- Fragen --------------------------------------------------------- */
    defineField({ name: "faqTitel", title: "Überschrift", type: "string", group: "faq", validation: (r) => r.required() }),
    /* Klasse 2: Die Zusatzzeile unter der Überschrift darf fehlen. Dann steht
       sie nicht da — `Panel.astro` rendert den Absatz nur, wenn Text kommt.
       Kein Ersatztext. */
    defineField({ name: "faqText", title: "Zusatzzeile", type: "text", rows: 2, group: "faq" }),
    defineField({
      name: "faq",
      title: "Fragen",
      type: "array",
      group: "faq",
      /* Klasse 1: Die sechs Fragen standen bis Aufgabe 4 fest in
         `index.astro`. Ein FAQ-Panel ohne Fragen ist eine leere Zusage. */
      validation: (r) => r.required(),
      of: [
        defineArrayMember({
          type: "object",
          name: "frageAntwort",
          fields: [
            defineField({ name: "frage", title: "Frage", type: "string", validation: (r) => r.required() }),
            defineField({ name: "antwort", title: "Antwort", type: "text", rows: 4 }),
          ],
          preview: { select: { title: "frage" } },
        }),
      ],
    }),

    defineField({ name: "seo", title: "Suchmaschine", type: "seo", group: "seo" }),
  ],

  preview: { prepare: () => ({ title: "Startseite", subtitle: "/" }) },
});
