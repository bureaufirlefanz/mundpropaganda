import { defineType, defineField } from "sanity";

/**
 * Bild mit Alternativtext.
 *
 * Ein nacktes `image`-Feld hätte keinen — und ohne Alternativtext ist ein
 * Bild für Vorlesegeräte nicht vorhanden (WCAG 1.1.1). Deshalb dieser Typ
 * überall dort, wo ein Motiv Inhalt trägt.
 *
 * Das Feld ist bewusst nicht erzwungen: Rein schmückende Bilder BRAUCHEN
 * einen leeren Alternativtext, sonst liest ein Vorlesegerät den Dateinamen
 * vor. Der Haken darunter macht diese Entscheidung sichtbar, statt sie dem
 * Zufall zu überlassen.
 */
export const bild = defineType({
  name: "bild",
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
      hidden: ({ parent }) => parent?.schmuck === true,
    }),
    defineField({
      name: "schmuck",
      title: "Rein dekorativ",
      type: "boolean",
      description:
        "Ankreuzen, wenn das Bild nichts erklärt. Es wird dann für Vorlesegeräte ausgeblendet, statt mit einem Notbehelf beschrieben zu werden.",
      initialValue: false,
    }),
  ],
});
