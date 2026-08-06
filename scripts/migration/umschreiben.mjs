/**
 * Schreibt Sanity-Dokumente auf englische Bezeichner um.
 *
 * Wird auf zwei Datenbestände angewandt, mit derselben Zuordnung aus
 * `namen.mjs`: auf den Export des Datensatzes und auf die Seed-Dateien. Zwei
 * getrennte Umschreiber hätten irgendwann zwei Ergebnisse.
 *
 * Drei Dinge wandern:
 *
 *   `_type`   über TYPEN — auch bei inline benannten Objekten in Arrays
 *   `_id`     über IDS bzw. über das Präfix der Sammlung
 *   Feldnamen über FELDER, sofern nicht in GESCHUETZT
 *
 * `_ref` wandert mit `_id` mit. Das ist der Teil, der beim Handanlegen schief
 * geht: Ein Verweis, der auf `leistung-veneers` zeigt, während das Dokument
 * `service-veneers` heißt, bricht nicht beim Import — er wird nur nie
 * aufgelöst, und die betroffene Seite verliert still ihren Inhalt.
 */
import { TYPEN, IDS, FELDER, GESCHUETZT } from "./namen.mjs";

/** Präfixe der Sammlungen: `leistung-veneers` wird `service-veneers`. */
const PRAEFIXE = {
  "leistung-": "service-",
  "beitrag-": "post-",
  "rechtstext-": "legalPage-",
  "stelle-": "job-",
};

/** Systemdokumente von Sanity. Werden nicht angefasst und nicht exportiert. */
export const istSystem = (id) => id?.startsWith("_.") || id?.startsWith("system.");

/** Die neue ID eines Dokuments. Gibt die alte zurück, wenn nichts passt. */
export function neueId(id) {
  if (!id) return id;
  const entwurf = id.startsWith("drafts.");
  const kern = entwurf ? id.slice("drafts.".length) : id;

  let neu = IDS[kern];
  if (!neu) {
    for (const [alt, ersatz] of Object.entries(PRAEFIXE)) {
      if (kern.startsWith(alt)) {
        neu = ersatz + kern.slice(alt.length);
        break;
      }
    }
  }
  if (!neu) neu = kern;
  return entwurf ? `drafts.${neu}` : neu;
}

/** Rekursiv umschreiben. Gibt einen NEUEN Wert zurück, ändert nichts vor Ort. */
export function umschreiben(wert) {
  if (Array.isArray(wert)) return wert.map(umschreiben);
  if (!wert || typeof wert !== "object") return wert;

  const raus = {};
  for (const [schluessel, v] of Object.entries(wert)) {
    /* Systemschlüssel behalten ihren Namen, aber nicht immer ihren Wert. */
    if (schluessel === "_type") {
      raus._type = TYPEN[v] ?? v;
      continue;
    }
    if (schluessel === "_id") {
      raus._id = neueId(v);
      continue;
    }
    if (schluessel === "_ref") {
      raus._ref = neueId(v);
      continue;
    }
    if (schluessel.startsWith("_")) {
      raus[schluessel] = umschreiben(v);
      continue;
    }

    const neu = GESCHUETZT.has(schluessel) ? schluessel : (FELDER[schluessel] ?? schluessel);
    raus[neu] = umschreiben(v);
  }
  return raus;
}

/**
 * Was NACH dem Umschreiben noch deutsch aussieht.
 *
 * Die Prüfung ist grob und soll es sein: Sie schlägt bei allem an, was ein
 * Umlaut, ein „ß" oder eine der häufigen deutschen Endungen trägt. Lieber
 * einmal zu viel hinsehen als ein Feld übersehen, das nur in einem einzigen
 * Dokument vorkommt.
 */
export function verdaechtig(wert, pfad = "", treffer = new Set()) {
  if (Array.isArray(wert)) {
    wert.forEach((v, i) => verdaechtig(v, `${pfad}[${i}]`, treffer));
    return treffer;
  }
  if (!wert || typeof wert !== "object") return treffer;

  for (const [schluessel, v] of Object.entries(wert)) {
    if (!schluessel.startsWith("_") && /[äöüßÄÖÜ]|(titel|zeile|spalte|bild|eintrag|schritt|frage|antwort|zahl|stimme|marke|wert)/i.test(schluessel)) {
      treffer.add(schluessel);
    }
    verdaechtig(v, `${pfad}.${schluessel}`, treffer);
  }
  return treffer;
}
