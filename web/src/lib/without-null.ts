/**
 * `null` → `undefined`, rekursiv, mit passendem Typ.
 *
 * GROQ liefert für ein Feld, das im Dokument fehlt, ausdrücklich `null`.
 * TypeScript-seitig heißt „fehlt" hier aber `undefined` — alle Verträge in
 * `fixtures.ts` schreiben `feld?: T`. Beides ist für sich richtig; an der
 * Grenze zwischen ihnen muss übersetzt werden.
 *
 * Sichtbar geworden ist der Unterschied erst mit TypeGen (Aufgabe 1 der
 * Umbauliste). Vorher stand an jedem Abruf ein handgeschriebener Typparameter
 * — `fetch<Leistung | null>(…)` — und der behauptete einfach, was die Abfrage
 * liefere. Die Abweichung war die ganze Zeit da, nur unbemerkt: Ein Feld,
 * das im Studio nie gefüllt wurde, kam als `null` an, wo der Baustein
 * `undefined` erwartete, und `?? Vorgabe` griff nicht.
 *
 * Umgesetzt wird an EINER Stelle je Abfrage, direkt hinter `fetch`. Danach
 * gilt im ganzen Rest der Anwendung nur noch `undefined`.
 *
 * Der Typ läuft dieselbe Rekursion wie die Funktion. Dadurch bleibt der
 * Abgleich mit dem Vertrag scharf: Schreibt sich ein Feldname in einer
 * Abfrage falsch, fehlt er im erzeugten Typ, und die Zuweisung an den
 * Vertrag bricht — genau das soll `npm run web:check` fangen.
 */
export type WithoutNull<T> = T extends null
  ? undefined
  : T extends Array<infer U>
    ? Array<WithoutNull<U>>
    : T extends object
      ? { [K in keyof T]: WithoutNull<T[K]> }
      : T;

export function withoutNull<T>(value: T): WithoutNull<T> {
  if (value === null) return undefined as WithoutNull<T>;
  if (Array.isArray(value)) return value.map(withoutNull) as WithoutNull<T>;

  /* Nur einfache Objekte. Datumsangaben und alles mit eigener Klasse bleiben
     unangetastet — sie durchzuiterieren würde sie in leere Hüllen verwandeln. */
  if (
    typeof value === "object" &&
    Object.getPrototypeOf(value) === Object.prototype
  ) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        withoutNull(v),
      ]),
    ) as WithoutNull<T>;
  }

  return value as WithoutNull<T>;
}
