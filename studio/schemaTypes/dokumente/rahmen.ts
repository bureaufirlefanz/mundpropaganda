import { defineType, defineField, defineArrayMember } from "sanity";
import { MenuIcon } from "@sanity/icons/Menu";
import { StackCompactIcon } from "@sanity/icons/StackCompact";

/**
 * Navigation und Seitenfuß — der Rahmen, der auf jeder Seite gleich ist.
 *
 * Beide hingen bis hierher fest im Markup. Das war datentechnisch sparsam und
 * für den Kunden unauffindbar: Wer das Hauptmenü umsortieren will, sucht es
 * unter „Navigation", nicht in einer Astro-Datei.
 *
 * **Die Leistungsspalten stehen bewusst nicht hier.** Sie kommen aus der
 * Leistungen-Collection, aus `gruppe` und `platzierung`. Eine zweite Liste
 * daneben wäre die vierte Stelle, an der dieselben elf Namen stehen — genau
 * das hat die Collection abgeschafft. Was hier steht, sind die Spalten, die
 * es zusätzlich gibt.
 */

/** Eine Spalte im Menü oder im Fuß: Überschrift plus Verweise. */
const spalte = defineArrayMember({
  type: "object",
  name: "spalte",
  fields: [
    defineField({ name: "titel", title: "Überschrift", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "links",
      title: "Verweise",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: {
    select: { title: "titel", links: "links" },
    prepare: ({ title, links }) => ({
      title,
      subtitle: `${links?.length ?? 0} Verweise`,
    }),
  },
});

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  icon: MenuIcon,
  fields: [
    defineField({
      name: "hauptmenue",
      title: "Hauptmenü",
      type: "array",
      description:
        "Die Einträge in der Leiste oben. Der erste öffnet das große Menü mit den Leistungen.",
      of: [defineArrayMember({ type: "link" })],
      validation: (r) => r.required().min(1),
    }),

    defineField({
      name: "menueSpalten",
      title: "Zusätzliche Spalten im großen Menü",
      type: "array",
      description:
        "Stehen rechts neben den Leistungsspalten. Die Leistungen selbst kommen aus der Collection und lassen sich hier nicht eintragen - sie werden über „Spalte im Menü“ an der Leistung gesteuert.",
      of: [spalte],
    }),

    defineField({
      name: "aktion",
      title: "Knopf in der Leiste",
      type: "link",
      description: "Der pinke Knopf rechts oben.",
      validation: (r) => r.required(),
    }),
  ],

  preview: { prepare: () => ({ title: "Navigation", subtitle: "Leiste und großes Menü" }) },
});

export const footer = defineType({
  name: "footer",
  title: "Seitenfuß",
  type: "document",
  icon: StackCompactIcon,
  fields: [
    defineField({
      name: "leistungenTitel",
      title: "Überschrift über den Leistungen",
      type: "string",
      description: "Die Leistungen darunter kommen aus der Collection.",
      validation: (r) => r.required(),
    }),

    defineField({
      name: "spalten",
      title: "Weitere Spalten",
      type: "array",
      of: [spalte],
    }),

    defineField({
      name: "aktion",
      title: "Knopf",
      type: "link",
      validation: (r) => r.required(),
    }),

    defineField({
      name: "rechtliches",
      title: "Rechtliches",
      type: "array",
      description:
        "Die kleine Zeile ganz unten. Verweist auf die Rechtstexte - solange es die noch nicht gibt, bleibt die Zeile leer statt auf „#“ zu zeigen.",
      of: [defineArrayMember({ type: "link" })],
    }),

    defineField({
      name: "copyright",
      title: "Zeile neben der Jahreszahl",
      type: "string",
      description: "Die Jahreszahl setzt die Seite selbst - sie ist immer das laufende Jahr.",
    }),
  ],

  preview: { prepare: () => ({ title: "Seitenfuß", subtitle: "Spalten und Rechtliches" }) },
});
