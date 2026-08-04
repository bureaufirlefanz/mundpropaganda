import { defineType, defineField } from "sanity";

/**
 * Ein Verweis — überall dort, wo bisher ein roher String stand.
 *
 * Der Gewinn ist nicht Bequemlichkeit, sondern dass ein Link nicht mehr
 * kaputtgehen kann, ohne dass es jemand merkt: Ein interner Verweis zeigt auf
 * ein Dokument, nicht auf einen getippten Pfad. Ändert sich dessen Slug,
 * ändert sich der Link mit. Und ein Pfad, den es nicht gibt, lässt sich gar
 * nicht erst eintragen.
 *
 * Vorher standen im Seitenfuß vier Rechtstext-Links auf `href="#"`, und im
 * Menü zeigten „Team" und „Standorte" auf Sprungmarken, die es nur auf der
 * Startseite gibt — von einer Leistungsseite aus führten sie ins Leere.
 *
 * **Die Sprungmarke gehört zum internen Verweis, nicht daneben.** Ein Ziel
 * plus `#experten` ergibt von der Startseite aus `#experten` und von überall
 * sonst `/#experten`. Genau das war der Fehler vorher: Die Sprungmarke stand
 * allein da und galt damit immer für die Seite, auf der man gerade ist.
 */
export const link = defineType({
  name: "link",
  title: "Verweis",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Beschriftung",
      type: "string",
      validation: (r) => r.required(),
    }),

    defineField({
      name: "art",
      title: "Art",
      type: "string",
      initialValue: "intern",
      options: {
        list: [
          { title: "Seite dieser Website", value: "intern" },
          { title: "Andere Website", value: "extern" },
          { title: "E-Mail an die Praxis", value: "email" },
          { title: "Anruf in der Praxis", value: "telefon" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),

    defineField({
      name: "ziel",
      title: "Seite",
      type: "reference",
      to: [
        { type: "startseite" },
        { type: "leistung" },
        { type: "magazinIndex" },
        { type: "beitrag" },
        { type: "karriere" },
        { type: "rechtstext" },
      ],
      description: "Nur Seiten, die es wirklich gibt - die Liste kommt aus dem Datensatz.",
      hidden: ({ parent }) => parent?.art !== "intern",
      validation: (r) =>
        r.custom((wert, ctx) =>
          (ctx.parent as { art?: string })?.art === "intern" && !wert
            ? "Bitte eine Seite auswählen."
            : true
        ),
    }),

    defineField({
      name: "anker",
      title: "Sprungmarke",
      type: "string",
      description:
        "Springt auf der Zielseite zu einem Abschnitt, z. B. kontakt, standorte, faq oder experten. Ohne Raute. Leer lassen für den Seitenanfang.",
      hidden: ({ parent }) => parent?.art !== "intern",
    }),

    defineField({
      name: "url",
      title: "Adresse",
      type: "url",
      hidden: ({ parent }) => parent?.art !== "extern",
      validation: (r) =>
        r.custom((wert, ctx) =>
          (ctx.parent as { art?: string })?.art === "extern" && !wert
            ? "Bitte eine Adresse eintragen."
            : true
        ),
    }),

    /* E-Mail und Telefon brauchen kein Feld: Beide stehen in den
       Einstellungen, und eine zweite Stelle liefe auseinander. */
  ],

  preview: {
    select: { title: "text", art: "art", ziel: "ziel.titel", url: "url", anker: "anker" },
    prepare: ({ title, art, ziel, url, anker }) => {
      const wohin =
        art === "extern"
          ? url
          : art === "email"
            ? "E-Mail"
            : art === "telefon"
              ? "Telefon"
              : [ziel, anker && `#${anker}`].filter(Boolean).join(" ");
      return { title, subtitle: wohin || "ohne Ziel" };
    },
  },
});
