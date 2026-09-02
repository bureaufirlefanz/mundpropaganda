import { defineType, defineField } from "sanity";

/**
 * Bild mit Alternativtext.
 *
 * Ein nacktes `image`-Feld hätte keinen — und ohne Alternativtext ist ein
 * Bild für Vorlesegeräte nicht vorhanden (WCAG 1.1.1). Deshalb dieser Typ
 * überall dort, wo ein Motiv Inhalt trägt.
 *
 * Der Alternativtext ist nicht schlicht `required`: Rein schmückende Bilder
 * BRAUCHEN einen leeren, sonst liest ein Vorlesegerät den Dateinamen vor.
 * Verlangt wird deshalb eine Entscheidung — Text oder Haken —, und zwar von
 * der Regel weiter unten.
 *
 * **Was hier kaputt war.** `hidden` las `parent?.schmuck`; das Feld daneben
 * heißt seit der Sprachmigration `decorative`. Der Haken blendete den
 * Alternativtext also nie aus, und weil es außerdem keine Regel gab, die ihn
 * verlangte, war die Zusage dieses Typs faktisch nichts wert: Ein Bild ohne
 * Alternativtext und ohne Haken ließ sich veröffentlichen, und niemand
 * erfuhr davon. Genau die Sorte lautloser Abweichung, gegen die es diesen Typ
 * gibt.
 */
export const picture = defineType({
  name: "picture",
  title: "Bild",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternativtext",
      type: "string",
      description:
        "Was auf dem Bild zu sehen ist, in einem Satz. Nicht „Foto von …“ - das sagt das Vorlesegerät selbst.",
      hidden: ({ parent }) => parent?.decorative === true,
      /* Die Regel hängt am Alternativtext und nicht am Bild: Sie soll erst
         greifen, wenn überhaupt ein Bild hochgeladen ist. Ein leeres Bildfeld
         ist ein leerer Abschnitt und kein Fehler.

         `context.parent` ist hier das Bildobjekt selbst — Asset, Haken und
         dieses Feld. Ohne Asset gibt es nichts zu beschreiben. */
      validation: (r) =>
        r.custom((alt, context) => {
          const parent = context.parent as
            { asset?: { _ref?: string }; decorative?: boolean } | undefined;
          if (!parent?.asset?._ref) return true;
          if (parent.decorative === true) return true;
          if (typeof alt === "string" && alt.trim()) return true;
          return "Bitte beschreiben, was zu sehen ist - oder unten „Rein dekorativ“ ankreuzen.";
        }),
    }),
    defineField({
      name: "decorative",
      title: "Rein dekorativ",
      type: "boolean",
      description:
        "Ankreuzen, wenn das Bild nichts erklärt. Es wird dann für Vorlesegeräte ausgeblendet, statt mit einem Notbehelf beschrieben zu werden.",
      initialValue: false,
    }),
  ],
});
