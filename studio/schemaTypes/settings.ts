import { defineType, defineField } from "sanity";
import { CogIcon } from "@sanity/icons/Cog";

/**
 * Die Angaben, die auf jeder Seite gleich sind: Website, Kontakt, Standorte,
 * soziale Netzwerke, Bewertungen, Suchmaschine.
 *
 * Ein Einzeldokument, kein Sammeltyp — es gibt genau eine Praxis. Erzwungen
 * wird das nicht im Schema (die Option dafür gibt es nicht), sondern in der
 * Studio-Struktur: dort hängt es an einer festen ID und taucht nirgends als
 * Liste auf, in der man ein zweites anlegen könnte.
 *
 * Die Gruppe „Website" ist der Ersatz für das, was anderswo Site Settings
 * heißt. Sie steht zuerst, weil sie das ganze Haus betrifft und nicht einen
 * Raum darin.
 */
export const einstellungen = defineType({
  name: "settings",
  title: "Einstellungen",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "site", title: "Website", default: true },
    { name: "contact", title: "Kontakt" },
    { name: "locations", title: "Standorte" },
    { name: "reviews", title: "Bewertungen" },
    { name: "social", title: "Soziale Netzwerke" },
    { name: "seo", title: "Suchmaschine" },
  ],
  fields: [
    /* --- Website ---------------------------------------------------------
       Was den Browser-Tab und die Vorschau beim Teilen bestimmt. Bis hierher
       stand beides fest in `web/src/layouts/Base.astro`. */

    defineField({
      name: "siteName",
      title: "Name der Website",
      type: "string",
      description:
        "Steht hinter jedem Seitentitel im Browser-Tab und als Absender, wenn jemand einen Link teilt.",
      group: "site",
      initialValue: "Mundpropaganda",
      validation: (rule) => rule.required(),
    }),

    /* Ein rohes `image` und nicht der `picture`-Typ — dieselbe Begründung wie
       beim Teilen-Motiv in `objects/seo.ts`: Ein Favicon wird nie vorgelesen,
       ein Alternativtext hätte dort niemanden, der ihn hört. */
    defineField({
      name: "favicon",
      title: "Symbol im Browser-Tab",
      type: "image",
      description:
        "Quadratisch, mindestens 512 × 512 px. Leer lassen: dann steht dort die Wortmarke der Praxis.",
      group: "site",
    }),

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

            /* Für die Karte auf der Praxisseite. Als zwei Zahlen und nicht
               als `geopoint`: Der eingebaute Typ bringt eine Kartenauswahl
               mit, die eine Google-Maps-Kennung braucht — die haben wir
               nicht, und für zwei Praxen, die sich nie bewegen, wäre sie
               auch übertrieben. Die Werte holt man aus der Adresszeile einer
               beliebigen Karte.

               Beide leer: Der Standort erscheint als Karte ohne Stecknadel,
               die Anschrift steht trotzdem da. Kein erfundener Punkt - eine
               falsche Stecknadel schickt jemanden an die falsche Tür. */
            defineField({
              name: "latitude",
              title: "Breitengrad",
              type: "number",
              description: "z. B. 52.5386. Die erste der beiden Zahlen.",
              validation: (rule) => rule.min(-90).max(90),
            }),
            defineField({
              name: "longitude",
              title: "Längengrad",
              type: "number",
              description: "z. B. 13.4241. Die zweite der beiden Zahlen.",
              validation: (rule) => rule.min(-180).max(180),
            }),

            /* Klasse 2: Wer keine Zeiten pflegt, bekommt keine erfundenen.
               Der Block im Footer entfällt dann an diesem Standort ganz —
               „Öffnungszeiten: keine Angabe" wäre schlechter als nichts.

               Zwei Felder je Zeile statt einer freien Zeichenkette, weil die
               Zeiten im Footer in zwei Spalten stehen und rechtsbündig
               ausgerichtet werden. Aus „Mo–Do 8–19 Uhr" ließe sich das nur
               raten. */
            defineField({
              name: "hours",
              title: "Öffnungszeiten",
              type: "array",
              description:
                "Je Zeile ein Zeitraum. Leer lassen: dann stehen an diesem Standort keine Zeiten.",
              of: [
                {
                  type: "object",
                  name: "openingHours",
                  fields: [
                    defineField({
                      name: "days",
                      title: "Tage",
                      type: "string",
                      description: "z. B. „Mo–Do“ oder „Sa“.",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "time",
                      title: "Zeit",
                      type: "string",
                      description: "z. B. „8–19 Uhr“ oder „nach Vereinbarung“.",
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: {
                    select: { days: "days", time: "time" },
                    prepare: ({ days, time }) => ({ title: days, subtitle: time }),
                  },
                },
              ],
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

    /* --- Suchmaschine ----------------------------------------------------
       Gilt für die ganze Website. Was eine einzelne Seite betrifft, steht im
       SEO-Feld dieser Seite; hier steht nur, was überall gilt oder wofür sie
       einspringt. */

    defineField({
      name: "searchEngines",
      title: "Von Suchmaschinen finden lassen",
      type: "boolean",
      description:
        "Aus, solange die Seite ein Prototyp ist: Adressen, Preise und Stellenanzeigen sind echt genug, um Schaden anzurichten, und eine zweite Fassung im Index macht der späteren echten Seite Konkurrenz. Der Schalter setzt robots.txt, die Kopfzeile X-Robots-Tag und das noindex auf jeder Seite zugleich.",
      group: "seo",
      initialValue: false,
    }),

    defineField({
      name: "defaultDescription",
      title: "Beschreibung als Rückfall",
      type: "text",
      rows: 3,
      description:
        "Springt ein, wenn eine Seite keine eigene Beschreibung im SEO-Feld hat. 120–155 Zeichen.",
      group: "seo",
      validation: (rule) => rule.max(170).warning("Über 170 Zeichen wird meist abgeschnitten."),
    }),

    defineField({
      name: "shareImage",
      title: "Teilen-Bild als Rückfall",
      type: "image",
      options: { hotspot: true },
      description:
        "Erscheint in Messengern und sozialen Netzwerken, wenn die geteilte Seite kein eigenes Motiv hat. Querformat, mindestens 1200 × 630 px.",
      group: "seo",
    }),

    defineField({
      name: "googleVerification",
      title: "Google-Bestätigungscode",
      type: "string",
      description:
        "Aus der Google Search Console, Methode „HTML-Tag“. Nur der Wert des content-Attributs, nicht die ganze Zeile. Beweist Google, dass die Seite uns gehört.",
      group: "seo",
    }),

    /* Plausible und nicht Google Analytics, und das ist keine Vorliebe:
       Plausible setzt keine Cookies und speichert nichts Personenbezogenes,
       braucht also kein Einwilligungsbanner. Google Analytics braucht eines,
       und die Seite hat keines. Ein Feld dafür wäre ein Versprechen, das
       rechtlich nicht eingelöst ist — sobald ein Banner steht, kommt es
       dazu. */
    defineField({
      name: "plausibleDomain",
      title: "Plausible-Domain",
      type: "string",
      description:
        "Die Domain, wie sie im Plausible-Konto steht, z. B. „mundpropaganda.de“. Leer lassen: dann wird nichts gemessen und kein fremdes Skript geladen. Plausible setzt keine Cookies und braucht daher kein Einwilligungsbanner.",
      group: "seo",
    }),
  ],

  // Ein Einzeldokument braucht keinen Titel aus den Daten.
  preview: {
    prepare: () => ({
      title: "Einstellungen",
      subtitle: "Website, Kontakt, Standorte, Suchmaschine",
    }),
  },
});
