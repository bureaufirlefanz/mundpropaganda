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
  { name: "locations", title: "Standorte" },
  { name: "experts", title: "Team" },
  { name: "stories", title: "Geschichten" },
  { name: "magazine", title: "Magazin" },
  { name: "faq", title: "Fragen" },
  { name: "seo", title: "SEO" },
];

/** Überschrift + Zusatzzeilen, wie sie fast jeder Abschnitt braucht. */
/* Topline und Überschrift tragen ihren Abschnitt — ohne sie beginnt er ohne
   Ansage. Beide sind deshalb Pflicht (Klasse 1). Bis Aufgabe 4 waren sie
   wahlfrei, und ein geleertes Feld fiel still auf den Text im Baustein
   zurück; der Kunde löschte eine Überschrift und sah sie weiter stehen. */
const heading = (group: string, withTopline = true) =>
  [
    withTopline &&
      defineField({
        name: `${group}Topline`,
        title: "Topline",
        type: "string",
        group,
        validation: (r) => r.required(),
      }),
    defineField({
      name: `${group}Title`,
      title: "Überschrift",
      type: "string",
      group,
      validation: (r) => r.required(),
    }),
  ].filter(Boolean) as ReturnType<typeof defineField>[];

export const homepage = defineType({
  name: "homepage",
  title: "Startseite",
  type: "document",
  icon: HomeIcon,
  groups: gruppen,
  fields: [
    /* --- Hero ---------------------------------------------------------- */
    defineField({
      name: "heroLines",
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
    ...heading("split"),
    defineField({
      name: "splitParagraphs",
      title: "Absätze",
      type: "array",
      of: [{ type: "text", rows: 5 }],
      group: "split",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "splitImage",
      title: "Bild",
      type: "picture",
      group: "split",
    }),

    /* --- Leistungen ----------------------------------------------------- */
    defineField({
      name: "servicesTitle",
      title: "Überschrift",
      type: "string",
      description:
        "Die Leistungen selbst kommen aus der Collection „Leistungen“ - hier steht nur der Rahmen.",
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
    ...heading("standards", false),
    defineField({
      name: "standardsItems",
      title: "Punkte",
      type: "array",
      description: "Nummeriert in dieser Reihenfolge. Fünf passen gut.",
      group: "standards",
      of: [
        defineArrayMember({
          type: "object",
          name: "standard",
          fields: [
            defineField({
              name: "name",
              title: "Titel",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
            /* Das Motiv gehört an den PUNKT, nicht an den Abschnitt: Die
               Zahnmaske rechts zeigt zu jedem Punkt ein anderes Bild und
               blendet beim Weiterwandern um.
               Es gab dafür einmal ein einzelnes Feld `standardsBild` am
               Abschnitt. Das konnte der Baustein nicht bedienen — fünf Motive
               lassen sich nicht aus einem Feld speisen, und deshalb tat es
               nichts. Hier hängt es richtig. */
            defineField({
              name: "image",
              title: "Bild in der Zahnmaske",
              type: "picture",
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "text", media: "image" },
          },
        }),
      ],
      /* Klasse 1: Die Punkte SIND der Abschnitt. Ohne sie bliebe eine
         Überschrift über einer leeren Liste stehen. */
      validation: (r) => r.required(),
    }),

    /* --- Standorte ------------------------------------------------------ */
    defineField({
      name: "locationsTitle",
      title: "Überschrift",
      type: "string",
      description:
        "Die Adressen selbst stehen in den Einstellungen - sie gelten auch im Footer.",
      group: "locations",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "locationsImages",
      title: "Bilder im Karussell",
      type: "array",
      description:
        "Die Motive auf dem Ring. Fünf sind ein guter Stand - der Ring füllt sich von selbst auf, bis er rund ist. Ohne eigene Bilder stehen hier die gestalteten Motive.",
      group: "locations",
      of: [
        defineArrayMember({
          type: "object",
          name: "ringBild",
          fields: [
            defineField({
              name: "image",
              title: "Bild",
              type: "picture",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "caption",
              title: "Beschriftung",
              type: "string",
              description:
                "Die Pille im Bild, z. B. der Standortname. Leer lassen für keine.",
            }),
          ],
          preview: {
            select: { title: "caption", media: "image" },
            prepare: ({ title, media }) => ({
              title: title || "ohne Beschriftung",
              media,
            }),
          },
        }),
      ],
    }),

    /* --- Team ----------------------------------------------------------- */
    ...heading("experts", false),
    defineField({
      name: "expertsNames",
      title: "Namenszeile",
      type: "string",
      group: "experts",
      validation: (r) => r.required(),
    }),
    /* Vorher `expertenText`, ein einzelnes Textfeld — und ebenfalls tot: Die
       Seite reichte es nie durch, `Experts.astro` erwartet ZWEI Absätze und
       hatte sie als Vorgabe im Frontmatter stehen. Jetzt als Array wie
       `splitAbsaetze`, damit die gesetzte Zweiteilung des Entwurfs erhalten
       bleibt und die Redaktion sie in der Hand hat. */
    defineField({
      name: "expertsParagraphs",
      title: "Absätze",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      group: "experts",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "expertsImage",
      title: "Bild",
      type: "picture",
      group: "experts",
    }),

    /* --- Geschichten ---------------------------------------------------- */
    /* `storiesItems` lived here until 2026-10-14. The stories are documents
       now (`story`), assignable to services; the homepage shows all of them.
       Only the button under the quotes stays here. */
    defineField({
      name: "storiesAction",
      title: "Button unter den Geschichten",
      type: "link",
      description:
        "Leer lassen, wenn es nichts weiterzulesen gibt - dann steht dort kein Button.",
      group: "stories",
    }),

    /* --- Magazin -------------------------------------------------------- */
    ...heading("magazine"),
    defineField({
      name: "magazineText",
      title: "Zusatzzeile",
      type: "text",
      rows: 3,
      group: "magazine",
      validation: (r) => r.required(),
    }),

    /* --- Fragen --------------------------------------------------------- */
    /* Hidden, not removed: the FAQ head is fixed in `sections/Faq.astro`
       since 2026-09-28. Removing the fields would make the Studio warn about
       the values still stored in the document. */
    defineField({
      name: "faqTitle",
      title: "Überschrift",
      type: "string",
      group: "faq",
      hidden: true,
      description:
        "Wird nicht mehr angezeigt: Das FAQ trägt seit 28.09.2026 überall dieselbe Überschrift.",
    }),
    defineField({
      name: "faqText",
      title: "Zusatzzeile",
      type: "text",
      rows: 2,
      group: "faq",
      hidden: true,
      description:
        "Wird nicht mehr angezeigt: Das FAQ trägt seit 28.09.2026 überall dieselbe Überschrift.",
    }),
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
          name: "questionAnswer",
          fields: [
            defineField({
              name: "question",
              title: "Frage",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "answer",
              title: "Antwort",
              type: "text",
              rows: 4,
            }),
          ],
          preview: { select: { title: "question" } },
        }),
      ],
    }),

    defineField({
      name: "seo",
      title: "Suchmaschine",
      type: "seo",
      group: "seo",
    }),
  ],

  preview: { prepare: () => ({ title: "Startseite", subtitle: "/" }) },
});
