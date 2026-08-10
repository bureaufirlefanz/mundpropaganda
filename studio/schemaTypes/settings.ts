import { defineType, defineField } from "sanity";
import { CogIcon } from "@sanity/icons/Cog";

/**
 * Die Angaben, die auf jeder Seite gleich sind: Kontakt, soziale Netzwerke,
 * Bewertungen.
 *
 * Ein Einzeldokument, kein Sammeltyp — es gibt genau eine Praxis. Erzwungen
 * wird das nicht im Schema (die Option dafür gibt es nicht), sondern in der
 * Studio-Struktur: dort hängt es an einer festen ID und taucht nirgends als
 * Liste auf, in der man ein zweites anlegen könnte.
 */
export const einstellungen = defineType({
  name: "settings",
  title: "Einstellungen",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "contact", title: "Kontakt", default: true },
    { name: "reviews", title: "Bewertungen" },
    { name: "locations", title: "Standorte" },
    { name: "social", title: "Soziale Netzwerke" },
  ],
  fields: [
    defineField({
      name: "phone",
      title: "Telefonnummer",
      type: "string",
      description: "Wie sie dastehen soll, z. B. „+49 3051 9999 580“.",
      group: "contact",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "E-Mail-Adresse",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required().email(),
    }),

    /* Der Kontaktbereich steht auf mehreren Seiten und ist überall derselbe.
       Deshalb hier und nicht je Seite: Ein zweites Feld je Leistungsseite
       liefe auseinander, und niemand pflegt elf Mal denselben Satz.
       Die Auswahlliste im Formular kommt aus der Leistungen-Collection und
       braucht kein eigenes Feld — sie war bis dahin ein fest verdrahtetes
       Array aus fünf Namen, das mit der Collection nichts zu tun hatte. */
    defineField({
      name: "contactTitle",
      title: "Überschrift im Kontaktbereich",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contactText",
      title: "Einstieg im Kontaktbereich",
      type: "text",
      rows: 3,
      description: "Steht unter der Überschrift, links neben dem Formular.",
      group: "contact",
    }),

    defineField({
      name: "reviewsProvider",
      title: "Quelle",
      type: "string",
      description: "Steht links im Bewertungsbalken, z. B. „Google Reviews“.",
      group: "reviews",
      initialValue: "Google Reviews",
    }),
    defineField({
      name: "reviewsCount",
      title: "Anzahl",
      type: "number",
      group: "reviews",
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: "reviewsAverage",
      title: "Durchschnitt",
      type: "number",
      description: "Von 5. Eine Nachkommastelle genügt.",
      group: "reviews",
      validation: (rule) => rule.min(0).max(5),
    }),

    defineField({
      name: "locations",
      title: "Praxen",
      type: "array",
      description:
        "Erscheinen in der Standorte-Section und im Footer - eine Quelle für beides.",
      group: "locations",
      /* Klasse 1: Ohne Anschrift ist eine Praxis-Website kaputt, nicht leer.
         Bis Aufgabe 4 fiel eine leere Liste auf zwei Beispieladressen aus dem
         Prototyp zurück — Straßen, die im Studio nirgends standen. */
      validation: (rule) => rule.required().min(1),
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "shortCode",
              title: "Kürzel",
              type: "string",
              description:
                "Die große Konturzahl auf der Startseite, z. B. „P25“. Kurz halten - drei Zeichen füllen die Spalte.",
              validation: (rule) => rule.required().max(4),
            }),
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "street",
              title: "Straße und Hausnummer",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "city",
              title: "Postleitzahl und Ort",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Beschreibung",
              type: "text",
              rows: 3,
              description: "Zwei bis drei Zeilen. Steht unter der Anschrift.",
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "street", shortCode: "shortCode" },
            prepare: ({ title, subtitle, shortCode }) => ({
              title: `${shortCode ? shortCode + " · " : ""}${title ?? ""}`,
              subtitle,
            }),
          },
        },
      ],
    }),

    defineField({
      name: "social",
      title: "Profile",
      type: "object",
      description: "Leer lassen, was es nicht gibt - dann entfällt das Symbol.",
      group: "social",
      options: { columns: 2 },
      fields: [
        defineField({ name: "facebook", title: "Facebook", type: "url" }),
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
        defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
      ],
    }),
  ],

  // Ein Einzeldokument braucht keinen Titel aus den Daten.
  preview: {
    prepare: () => ({ title: "Einstellungen", subtitle: "Kontakt, Bewertungen, Profile" }),
  },
});
