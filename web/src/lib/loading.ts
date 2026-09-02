/**
 * Was passiert, wenn das CMS nicht antwortet.
 *
 * **Der Fall, der das nötig gemacht hat.** Jede Ladefunktion unter `lib/`
 * endete auf `.catch(() => [])` oder `.catch(() => undefined)`. Für ein
 * fehlendes Feld ist das genau richtig und ausdrücklich so entschieden: Ein
 * leerer Abschnitt verschwindet, statt sich mit eingebautem Text zu füllen
 * (Aufgabe 4 in `CMS-UMBAU.md`).
 *
 * Ein abgebrochener Netzwerkaufruf sieht an dieser Stelle aber genauso aus
 * wie ein leeres Feld. Fällt die API während eines Deploys aus, liefert
 * `loadServiceList()` eine leere Liste — und daraus entsteht ein Build ohne
 * eine einzige Leistungsseite, mit leerem Menü und leerem Fuß. Der Build
 * meldet keinen Fehler, Netlify veröffentlicht ihn, und die Website ist weg.
 * Niemand erfährt davon, bis jemand sie aufruft.
 *
 * Deshalb hier die Trennung, die es vorher nicht gab:
 *
 *   kein Dokument, leeres Feld  →  leer weitergeben, der Abschnitt entfällt
 *   Abfrage gescheitert         →  im Build abbrechen, lokal nur warnen
 *
 * Lokal wird nur gewarnt, weil man ohne Netz an der Seite arbeiten können
 * soll. Der Unterschied hängt an `import.meta.env.PROD` und damit am
 * Build-Befehl, nicht an einer eigenen Variablen, die jemand vergessen kann.
 */

/**
 * Rückfallwert für eine gescheiterte Abfrage — im Build ein Abbruch.
 *
 * `what` steht in der Fehlermeldung und ist das, was fehlt, aus Sicht der
 * Website: „die Einstellungen", „die Leistungsliste". Wer den Build rot
 * werden sieht, soll ohne Umweg wissen, welche Seite jetzt unvollständig
 * wäre.
 */
export function fallbackFor<T>(what: string, value: T): (error: unknown) => T {
  return (error: unknown) => {
    if (import.meta.env.PROD) {
      throw new Error(
        `Sanity hat ${what} nicht geliefert. Der Build bricht ab, statt eine Seite ` +
          `ohne diesen Inhalt zu veröffentlichen.`,
        { cause: error },
      );
    }
    console.warn(
      `[cms] ${what}: Abfrage gescheitert, es wird leer weitergearbeitet.`,
      error,
    );
    return value;
  };
}
