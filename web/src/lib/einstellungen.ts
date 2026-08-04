import { sanityClient } from "sanity:client";
import { ohneNull } from "./ohne-null";
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
 *   Klasse 1  telefon, email, standorte — im Schema Pflicht. Ohne Anschrift
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
  kuerzel: string;
  name: string;
  strasse: string;
  ort: string;
  /* Klasse 2: Im Schema steht keine Pflichtregel. Fehlt der Text, steht unter
     der Anschrift nichts — es tritt keiner an seine Stelle. */
  beschreibung?: string;
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

export interface Einstellungen {
  telefon: string;
  email: string;
  standorte: Standort[];
  bewertungen?: Bewertungen;
  social: Social;
}

/* Einmal je Build. Rahmen und Hero fragen dasselbe Dokument ab. */
let gemerkt: Promise<Einstellungen> | null = null;

export function ladeEinstellungen(): Promise<Einstellungen> {
  gemerkt ??= sanityClient
    .fetch(EINSTELLUNGEN_QUERY)
    .then(ohneNull)
    .then((d) => ({
      /* Klasse 1, notfalls leer. Das Schema verlangt die drei, aber der Build
         liest ein Dataset und kein Studio — ein Import oder ein von Hand
         gelöschtes Feld kommt an der Pflichtregel vorbei. Dann steht die
         Stelle leer, und die Bausteine blenden sie aus. Ein Ersatzwert wäre
         hier besonders teuer: Eine erfundene Rufnummer sieht richtig aus. */
      telefon: d?.telefon || "",
      email: d?.email || "",
      standorte: d?.standorte ?? [],

      /* Klasse 2, alles oder nichts. `!= null` und nicht `||`: Ein Schnitt von
         0 ist ein gepflegter Wert und keine Lücke. */
      bewertungen:
        d?.bewertungenAnbieter && d?.bewertungenAnzahl != null && d?.bewertungenSchnitt != null
          ? {
              anbieter: d.bewertungenAnbieter,
              anzahl: d.bewertungenAnzahl,
              schnitt: d.bewertungenSchnitt,
            }
          : undefined,

      /* Klasse 2 je Profil. Ein Symbol ohne Ziel führt nirgends hin und sieht
         trotzdem nach Angebot aus — Footer.astro filtert leere heraus. */
      social: d?.social ?? {},
    }))
    /* Kein Rückfall mehr im Fehlerfall. Ist das CMS nicht erreichbar, soll der
       Build eine sichtbar leere Seite ergeben und nicht eine, die mit alten
       Daten aus dem Prototyp vollständig aussieht. */
    .catch(() => ({ telefon: "", email: "", standorte: [], social: {} }));

  return gemerkt;
}

/** „5,0 von 5" — deutsches Dezimalkomma, immer eine Nachkommastelle. */
export const schnittText = (wert: number) =>
  `${wert.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} von 5`;

/** Telefonnummer als wählbarer Link: alles außer Ziffern und führendem Plus. */
export const telLink = (nummer: string) => `tel:${nummer.replace(/(?!^\+)[^\d]/g, "")}`;
