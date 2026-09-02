/**
 * Zentrale GSAP-Instanz. Plugins werden genau einmal registriert, alle
 * Module importieren von hier — sonst registriert jedes Modul erneut und
 * wir bezahlen das mit Bundle-Größe und doppelten Tickern.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* Defaults, die zur Motion-Sprache aus tokens.css passen. */
gsap.defaults({ ease: "power3.out", duration: 0.9 });

/* ScrollTrigger soll bei Resize nicht auf jeden Mobile-URL-Bar-Pixel
   reagieren — das verursacht sonst Layout-Sprünge auf iOS. */
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Ob jemand weniger Bewegung möchte.
 *
 * `let` und nicht `const`: ES-Module geben eine lebende Bindung weiter, die
 * 22 Stellen, die diesen Wert lesen, sehen also den aktuellen. Vorher wurde
 * er genau einmal beim Import gelesen — wer die Einstellung im Betriebssystem
 * umstellte, bekam bis zum nächsten vollständigen Neuladen weiter volle
 * Bewegung, und beim Router-Wechsel wird nicht neu geladen.
 *
 * Der Listener bleibt bewusst über den Seitenwechsel hinweg bestehen und
 * hängt deshalb NICHT am Abbruchsignal aus `lifecycle.js`: Er gehört zum
 * Modul und nicht zur Seite, es gibt genau einen, und er hält nichts fest,
 * was aufgeräumt werden müsste.
 */
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
export let prefersReducedMotion = motionQuery.matches;
motionQuery.addEventListener("change", (e) => {
  prefersReducedMotion = e.matches;
});

/* Griff für die Konsole und die Prüfskripte — wie window.__lenis in
   modules/scroll.js. Nur im Entwicklungsmodus, damit nichts davon in der
   Auslieferung landet. */
if (import.meta.env.DEV) {
  window.__gsap = gsap;
  window.__st = ScrollTrigger;
}

/**
 * Alle ScrollTrigger neu vermessen — aber gebündelt.
 *
 * `ScrollTrigger.refresh()` misst JEDEN Trigger der Seite neu. Beim Start
 * riefen es drei Module hintereinander: der Hero am Ende seiner Choreografie,
 * die Reveals nachdem die Schrift da war und ihre Headlines umgebrochen
 * hatte, und der Zeitstrahl je Vorkommen. Auf der Startseite waren das drei
 * vollständige Durchläufe innerhalb weniger hundert Millisekunden, von denen
 * nur der letzte zählte.
 *
 * Die nachlaufende Bündelung fasst alle Aufrufe innerhalb von 120 ms zu
 * einem zusammen. Wer nach einem Umbruch neu vermessen lassen will, ruft
 * weiterhin einfach auf; wer es zufällig gleichzeitig tut, kostet nichts
 * extra.
 *
 * Der Preis sind bis zu 120 ms Verzögerung. Das ist verschmerzbar: Jeder
 * Trigger misst sich beim Anlegen selbst, `refresh()` korrigiert nur — und
 * bis dahin hat sich am Layout nichts geändert, was nicht auch vorher schon
 * galt.
 */
let refreshTimer = null;
export function refreshTriggers(delay = 120) {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    refreshTimer = null;
    ScrollTrigger.refresh();
  }, delay);
}

export { gsap, ScrollTrigger, SplitText };
