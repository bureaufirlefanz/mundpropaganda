import { defineType, defineField, defineArrayMember } from "sanity";
import { WarningOutlineIcon } from "@sanity/icons/WarningOutline";
import { blockContentMember } from "../objects/rich-text";
import { seoField } from "../objects/seo-field";

/**
 * The emergency page, `/notdienst`.
 *
 * Its own type and not a service, although it sits among the services in the
 * agency's brief. A service page sells a treatment; this page sends people
 * away on purpose: whoever searches at 2 a.m. needs a number that answers now,
 * not a portrait of the practice. The service template has no place for the
 * things that matter here: phone numbers to tap, the official emergency
 * services, a warning that some cases belong in A&E.
 *
 * Until 2026-10-13 `emergency` was a generic single page with the section
 * builder and no route. It never held a document.
 *
 * ── What the page does NOT carry itself ─────────────────────────────────
 *
 * The practice's phone number comes from the settings, like everywhere else.
 * A second copy here would be the one that is still wrong after the number
 * changes, on exactly the page where a wrong number does real harm.
 *
 * The text sections are an array of one kind only. That is not a page
 * builder: every section is the same block (heading, text, optional warning),
 * the array only saves writing out four identical field groups.
 */
export const emergency = defineType({
  name: "emergency",
  title: "Notdienst",
  type: "document",
  icon: WarningOutlineIcon,
  groups: [
    { name: "content", title: "Inhalt", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Überschrift",
      type: "string",
      description:
        "Die Hauptüberschrift der Seite (H1), z. B. „Zahnarzt Notdienst in Berlin: schnelle Hilfe bei Zahnschmerzen“.",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "lead",
      title: "Einstieg",
      type: "text",
      rows: 5,
      description:
        "Steht unter der Überschrift, neben dem Button zum Anrufen. Hier gehört die Nummer hin, vor jeden anderen Text.",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "actionLabel",
      title: "Beschriftung des Buttons",
      type: "string",
      description:
        "Der Button wählt die Praxisnummer aus den Einstellungen. Leer lassen für „Jetzt anrufen“.",
      group: "content",
    }),
    defineField({
      name: "image",
      title: "Bild",
      type: "picture",
      group: "content",
    }),

    defineField({
      name: "sections",
      title: "Abschnitte",
      type: "array",
      group: "content",
      description:
        "Jeder Abschnitt hat eine Überschrift und Text. Telefonnummern als Link mit „tel:“ eintragen, dann lassen sie sich auf dem Handy antippen.",
      of: [
        defineArrayMember({
          type: "object",
          name: "emergencySection",
          fields: [
            defineField({
              name: "headline",
              title: "Überschrift",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "body",
              title: "Text",
              type: "array",
              of: [blockContentMember],
              validation: (r) => r.required(),
            }),
            defineField({
              name: "warning",
              title: "Warnhinweis",
              type: "text",
              rows: 3,
              description:
                "Wahlfrei. Steht abgesetzt unter dem Text, z. B. wann man die 112 rufen soll.",
            }),
          ],
          preview: { select: { title: "headline" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),

    defineField({
      name: "faq",
      title: "Häufige Fragen",
      type: "array",
      group: "content",
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
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "question" } },
        }),
      ],
    }),

    defineField({
      name: "closing",
      title: "Abschluss",
      type: "object",
      group: "content",
      options: { collapsible: true, collapsed: false },
      description:
        "Das Band am Seitenende. Der Button wählt wieder die Praxisnummer. Ohne Überschrift erscheint es nicht.",
      fields: [
        defineField({
          name: "headline",
          title: "Überschrift",
          type: "string",
        }),
        defineField({ name: "text", title: "Text", type: "text", rows: 2 }),
        defineField({
          name: "actionLabel",
          title: "Beschriftung des Buttons",
          type: "string",
          description: "Leer lassen für „Jetzt anrufen“.",
        }),
      ],
    }),

    seoField,
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({
      title: title || "Notdienst",
      subtitle: "/notdienst",
    }),
  },
});
