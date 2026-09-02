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
      name: "kind",
      title: "Art",
      type: "string",
      initialValue: "internal",
      options: {
        list: [
          { title: "Seite dieser Website", value: "internal" },
          { title: "Andere Website", value: "external" },
          { title: "E-Mail an die Praxis", value: "email" },
          { title: "Anruf in der Praxis", value: "phone" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),

    defineField({
      name: "target",
      title: "Seite",
      type: "reference",
      /* Jeder Typ, den `pathFor()` in eine Adresse übersetzen kann, und keiner
         mehr. Fehlt einer hier, ist die Seite im Studio nicht verlinkbar,
         obwohl es sie gibt — genau das war mit „Praxis & Team" der Fall: Die
         Seite stand, der Menüpunkt ließ sich aber nur über eine externe URL
         setzen. Steht einer zu viel hier, führt der Verweis ins Leere. */
      to: [
        { type: "homepage" },
        { type: "service" },
        { type: "practice" },
        { type: "person" },
        { type: "magazineIndex" },
        { type: "post" },
        { type: "careers" },
        { type: "legalPage" },
      ],
      description:
        "Nur Seiten, die es wirklich gibt - die Liste kommt aus dem Datensatz.",
      hidden: ({ parent }) => parent?.kind !== "internal",
      validation: (r) =>
        r.custom((wert, ctx) =>
          (ctx.parent as { kind?: string })?.kind === "internal" && !wert
            ? "Bitte eine Seite auswählen."
            : true,
        ),
    }),

    defineField({
      name: "anchor",
      title: "Sprungmarke",
      type: "string",
      description:
        "Springt auf der Zielseite zu einem Abschnitt, z. B. kontakt, standorte, faq oder experten. Ohne Raute. Leer lassen für den Seitenanfang.",
      hidden: ({ parent }) => parent?.kind !== "internal",
    }),

    defineField({
      name: "url",
      title: "Adresse",
      type: "url",
      hidden: ({ parent }) => parent?.kind !== "external",
      validation: (r) =>
        r.custom((wert, ctx) =>
          (ctx.parent as { kind?: string })?.kind === "external" && !wert
            ? "Bitte eine Adresse eintragen."
            : true,
        ),
    }),

    /* E-Mail und Telefon brauchen kein Feld: Beide stehen in den
       Einstellungen, und eine zweite Stelle liefe auseinander. */
  ],

  preview: {
    select: {
      title: "text",
      kind: "kind",
      target: "target.title",
      url: "url",
      anchor: "anchor",
    },
    prepare: ({ title, kind, target, url, anchor }) => {
      const wohin =
        kind === "external"
          ? url
          : kind === "email"
            ? "E-Mail"
            : kind === "phone"
              ? "Telefon"
              : [target, anchor && `#${anchor}`].filter(Boolean).join(" ");
      return { title, subtitle: wohin || "ohne Ziel" };
    },
  },
});
