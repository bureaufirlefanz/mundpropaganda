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
  name: "einstellungen",
  title: "Einstellungen",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "kontakt", title: "Kontakt", default: true },
    { name: "bewertungen", title: "Bewertungen" },
    { name: "standorte", title: "Standorte" },
    { name: "social", title: "Soziale Netzwerke" },
  ],
  fields: [
    defineField({
      name: "telefon",
      title: "Telefonnummer",
      type: "string",
      description: "Wie sie dastehen soll, z. B. „+49 3051 9999 580“.",
      group: "kontakt",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "E-Mail-Adresse",
      type: "string",
      group: "kontakt",
      validation: (rule) => rule.required().email(),
    }),

    defineField({
      name: "bewertungenAnbieter",
      title: "Quelle",
      type: "string",
      description: "Steht links im Bewertungsbalken, z. B. „Google Reviews“.",
      group: "bewertungen",
      initialValue: "Google Reviews",
    }),
    defineField({
      name: "bewertungenAnzahl",
      title: "Anzahl",
      type: "number",
      group: "bewertungen",
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: "bewertungenSchnitt",
      title: "Durchschnitt",
      type: "number",
      description: "Von 5. Eine Nachkommastelle genügt.",
      group: "bewertungen",
      validation: (rule) => rule.min(0).max(5),
    }),

    defineField({
      name: "standorte",
      title: "Praxen",
      type: "array",
      description:
        "Erscheinen in der Standorte-Section und im Seitenfuß - eine Quelle für beides.",
      group: "standorte",
      /* Klasse 1: Ohne Anschrift ist eine Praxis-Website kaputt, nicht leer.
         Bis Aufgabe 4 fiel eine leere Liste auf zwei Beispieladressen aus dem
         Prototyp zurück — Straßen, die im Studio nirgends standen. */
      validation: (rule) => rule.required().min(1),
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "kuerzel",
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
              name: "strasse",
              title: "Straße und Hausnummer",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "ort",
              title: "Postleitzahl und Ort",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "beschreibung",
              title: "Beschreibung",
              type: "text",
              rows: 3,
              description: "Zwei bis drei Zeilen. Steht unter der Anschrift.",
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "strasse", kuerzel: "kuerzel" },
            prepare: ({ title, subtitle, kuerzel }) => ({
              title: `${kuerzel ? kuerzel + " · " : ""}${title ?? ""}`,
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
