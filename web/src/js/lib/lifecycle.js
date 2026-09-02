/**
 * Was beim Seitenwechsel wieder abgeräumt werden muss.
 *
 * ── Warum es das braucht ─────────────────────────────────────────────────
 *
 * Der Router tauscht nur den Inhalt aus. `init()` läuft danach erneut, und
 * jedes Modul hängt seine Listener ein zweites Mal an — an `document`, an
 * `window` und an den GSAP-Ticker, die den Austausch alle überleben.
 * Abgeräumt wurden bisher nur die ScrollTrigger.
 *
 * Der teuerste Fall war der Smooth-Scroll: `initScroll()` legt bei jedem
 * Aufruf eine neue Lenis-Instanz an, meldet sie am Ticker an und hängt in
 * ihrem Konstruktor `pointerdown`, `touchmove`, `scroll`, `resize` und
 * `click` ans Fenster. Nach fünf Seitenwechseln schrieben fünf Instanzen die
 * Scrollposition, jede pro Bild. Dazu kamen ein `pointermove` für den Hero,
 * ein Ticker für das Kartendeck, `refreshInit` in der Galerie und
 * Dokument-Listener in Navigation, Filter und Leistungsvorschau — alle
 * weiterhin auf Elemente gerichtet, die es nicht mehr gibt.
 *
 * ── Wie es benutzt wird ──────────────────────────────────────────────────
 *
 * Für Listener der Signalweg — ein Abbruch nimmt sie alle auf einmal weg:
 *
 *     document.addEventListener("keydown", handler, { signal: pageSignal() });
 *
 * Für alles, was kein Listener ist, eine Aufräumfunktion:
 *
 *     onTeardown(() => lenis.destroy());
 *
 * `pageSignal()` wird beim Registrieren aufgerufen, nicht vorher gemerkt:
 * `teardown()` legt einen frischen Controller an, und ein festgehaltenes
 * Signal wäre danach für immer abgebrochen.
 */

let controller = new AbortController();
const jobs = [];

/** Für `addEventListener`: `{ signal: pageSignal() }`. */
export const pageSignal = () => controller.signal;

/** Alles, was kein Listener ist. Läuft genau einmal und dann nicht mehr. */
export function onTeardown(fn) {
  jobs.push(fn);
}

/**
 * Vor dem Austausch aufrufen. Danach ist der Zustand so, als hätte `init()`
 * nie gelaufen — der nächste Aufruf fängt sauber an.
 *
 * Ein Fehler in einer Aufräumfunktion darf die übrigen nicht aufhalten: Was
 * hier hängenbleibt, wäre genau das Leck, das die Funktion verhindern soll.
 */
export function teardown() {
  controller.abort();
  controller = new AbortController();

  for (const fn of jobs.splice(0)) {
    try {
      fn();
    } catch (fehler) {
      console.warn("[teardown] Aufräumen fehlgeschlagen", fehler);
    }
  }
}
