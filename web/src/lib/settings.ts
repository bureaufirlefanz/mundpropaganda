import { sanityClient } from "sanity:client";
import { withoutNull } from "./without-null";
import { EINSTELLUNGEN_QUERY } from "./queries";

/**
 * Die Angaben, die auf jeder Seite gleich sind. Ein Einzeldokument im Studio.
 *
 * Bis Aufgabe 4 stand hier ein vollständiger Beispielstand aus dem Prototyp,
 * und jedes leere Feld fiel darauf zurück. Das ist abgeschafft: Die Telefon-
 * nummer, die auf der Seite steht, ist die, die im Studio steht — sonst
 * telefoniert der Kunde einer Nummer hinterher, die er dort nirgends findet.
 *
 * Die Klassen wie bei der Startseite:
 *
 *   Klasse 1  phone, email, locations — im Schema Pflicht. Ohne Anschrift
 *             und Rufnummer ist eine Praxis-Website kaputt, nicht leer.
 *   Klasse 2  Bewertungen und Profile. Was nicht gepflegt ist, verschwindet:
 *             der Balken ganz, ein Profil einzeln. Eine Praxis ohne
 *             Bewertungen soll nicht „0 Bewertungen, 0,0 von 5" anzeigen.
 */

export interface Social {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

/**
 * Ein Standort. Das Kürzel ist die große Konturzahl auf der Startseite
 * („P25"), es steckt zugleich die Hausnummer — daher stammt die Adresse.
 */
export interface Standort {
  shortCode: string;
  name: string;
  street: string;
  city: string;
  /* Klasse 2: Im Schema steht keine Pflichtregel. Fehlt der Text, steht unter
     der Anschrift nichts — es tritt keiner an seine Stelle. */
  description?: string;
}

/**
 * Der Bewertungsbalken. Als EIN wahlfreies Objekt und nicht als drei einzelne
 * Felder: Der Balken braucht Quelle, Anzahl und Schnitt zusammen. Läge jedes
 * für sich vor, ließe sich ein halber Balken bauen — „Google Reviews, 0
 * Bewertungen" ist schlechter als gar keiner.
 */
export interface Bewertungen {
  anbieter: string;
  anzahl: number;
  schnitt: number;
}

export interface Settings {
  phone: string;
  email: string;
  locations: Standort[];
  bewertungen?: Bewertungen;
  social: Social;
  /* Der Kontaktbereich steht auf mehreren Seiten und ist überall derselbe —
     deshalb hier und nicht je Seite. */
  contactTitle: string;
  contactText?: string;
}

/* Einmal je Build. Rahmen und Hero questions dasselbe Dokument ab. */
let cached: Promise<Settings> | null = null;

export function loadSettings(): Promise<Settings> {
  cached ??= sanityClient
    .fetch(EINSTELLUNGEN_QUERY)
    .then(withoutNull)
    .then((d) => ({
      /* Klasse 1, notfalls leer. Das Schema verlangt die drei, aber der Build
         liest ein Dataset und kein Studio — ein Import oder ein von Hand
         gelöschtes Feld kommt an der Pflichtregel vorbei. Dann steht die
         Stelle leer, und die Bausteine blenden sie aus. Ein Ersatzwert wäre
         hier besonders teuer: Eine erfundene Rufnummer sieht richtig aus. */
      phone: d?.phone || "",
      email: d?.email || "",
      locations: d?.locations ?? [],
      contactTitle: d?.contactTitle || "",
      contactText: d?.contactText || undefined,

      /* Klasse 2, alles oder nichts. `!= null` und nicht `||`: Ein Schnitt von
         0 ist ein gepflegter Wert und keine Lücke. */
      bewertungen:
        d?.reviewsProvider && d?.reviewsCount != null && d?.reviewsAverage != null
          ? {
              anbieter: d.reviewsProvider,
              anzahl: d.reviewsCount,
              schnitt: d.reviewsAverage,
            }
          : undefined,

      /* Klasse 2 je Profil. Ein Symbol ohne Ziel führt nirgends hin und sieht
         trotzdem nach Angebot aus — Footer.astro filtert leere heraus. */
      social: d?.social ?? {},
    }))
    /* Kein Rückfall mehr im Fehlerfall. Ist das CMS nicht erreichbar, soll der
       Build eine sichtbar leere Seite ergeben und nicht eine, die mit alten
       Daten aus dem Prototyp vollständig aussieht. */
    .catch(() => ({ phone: "", email: "", locations: [], social: {}, contactTitle: "" }));

  return cached;
}

/** „5,0 von 5" — deutsches Dezimalkomma, immer eine Nachkommastelle. */
export const schnittText = (value: number) =>
  `${value.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} von 5`;

/** Telefonnummer als wählbarer Link: alles außer Ziffern und führendem Plus. */
export const telLink = (nummer: string) => `tel:${nummer.replace(/(?!^\+)[^\d]/g, "")}`;
