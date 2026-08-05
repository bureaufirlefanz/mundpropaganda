/**
 * Registriert alle Module; jedes prüft selbst, ob sein Markup auf der Seite
 * existiert — dadurch teilen sich alle Seiten ein Bundle und wir brauchen
 * keine Per-Page-Einstiegspunkte.
 *
 * Bewusst ohne CSS-Importe und ohne Selbststart: die Astro-App bringt ihre
 * Stile in den Komponenten mit und ruft `init` über den Router auf. Der
 * Prototyp lädt stattdessen main.js daneben, das beides ergänzt.
 */
import { ScrollTrigger } from "./lib/gsap.js";
import { warteAufSchrift, SCHRIFT } from "./lib/fonts.js";
import { initScroll, initAnchors } from "./modules/scroll.js";
import { initReveals, initSplitHeadlines } from "./modules/reveal.js";
import { initHighlightMarkerTextReveal } from "./modules/marker.js";
import { initNav } from "./modules/nav.js";
import { initTransitions } from "./modules/transition.js";
import { initHero } from "./modules/hero.js";
import { initServicesPreview } from "./modules/services.js";
import { initStandards } from "./modules/standards.js";
import { initGallery, initMediaParallax } from "./modules/gallery.js";
import { initFacts } from "./modules/facts.js";
import { initTimeline } from "./modules/timeline.js";
import { initRing } from "./modules/ring.js";
import { initStories, initMarquee } from "./modules/stories.js";
import { initToothRings } from "./modules/rings.js";
import { initThread } from "./modules/thread.js";
import { initAccordion, initBeforeAfter, initForm } from "./modules/ui.js";
import { initToc } from "./modules/toc.js";

// Signalisiert dem CSS, dass JS läuft — erst dann werden Reveal-Elemente
// versteckt. Ohne JS bleibt alles sichtbar.
document.documentElement.classList.add("js");

/**
 * Arbeit, die erst zählt, sobald jemand scrollt — und die deshalb nicht in den
 * Auftritt gehört.
 *
 * `requestIdleCallback` reicht dafür nicht: es feuert schon nach wenigen
 * Millisekunden „Ruhe", und ein Stück Arbeit von rund 140 ms überzieht sein
 * Zeitfenster ohnehin. Gemessen lag der Aussetzer damit genau dort, wo die
 * Leiste losfahren soll.
 *
 * Ausgelöst wird beim ersten Scrollen, spätestens nach 2,5 s — bis dahin ist
 * die Choreografie durch. Beides nur einmal.
 */
function wennGescrolltWird(arbeit) {
  let erledigt = false;

  const los = () => {
    if (erledigt) return;
    erledigt = true;
    window.removeEventListener("scroll", los);
    clearTimeout(uhr);
    arbeit();
  };

  const uhr = setTimeout(los, 2500);
  window.addEventListener("scroll", los, { passive: true });
}

export function init() {
  /* Zuerst, was den Auftritt trägt. Alles hier ist billig: ein paar Elemente
     ansprechen, Startwerte setzen, eine Timeline anlegen. */
  initScroll();
  initAnchors();

  initTransitions();
  initNav();
  initHero();

  /* Alles Übrige erst nach dem ersten Bild.
   *
   * Der Grund ist gemessen: dieser zweite Block baut die ScrollTrigger der
   * ganzen Seite auf, zerlegt neun Headlines in Zeilen, verdoppelt den
   * Lauftext, misst die Länge des durchlaufenden Pfades und vermisst am Ende
   * alles neu. Zusammen sind das über eine Sekunde am Stück auf dem
   * Hauptstrang — und solange der belegt ist, zeichnet der Browser nicht und
   * ruft keinen Animationsframe auf. Die Hero-Choreografie stand also fertig
   * bereit und fing trotzdem erst danach an: der erste Frame lag bei 1388 ms,
   * obwohl die Timeline seit 105 ms existierte. Genau das sah man als
   * „die Typo-Animation kommt immer zu spät".
   *
   * Zwei Frames, nicht einer: der erste kehrt zurück, bevor gezeichnet wurde,
   * der zweite liegt sicher dahinter. Zu sehen ist zu diesem Zeitpunkt nur der
   * Hero — alles, was hier später dran ist, steht ohnehin unter der Kante. */
  const nachDemErstenBild = (arbeit) =>
    requestAnimationFrame(() => requestAnimationFrame(arbeit));

  nachDemErstenBild(() => {
    initReveals();
    initSplitHeadlines();
    /* Die Marker-Zeilen sind Mono-Typo und werden ebenfalls ausgemessen. Auf
       den Schnitt warten, nicht auf `document.fonts.ready` — s. lib/fonts.js. */
    warteAufSchrift(SCHRIFT.mono).then(initHighlightMarkerTextReveal);

    initServicesPreview();
    initStandards();
    initGallery(); initRing(); initFacts(); initTimeline();
    initMediaParallax();
    initStories();
    initMarquee();
    initToothRings();

    initAccordion();
    initBeforeAfter();
    initForm();
    initToc();

    wennGescrolltWird(() => {
      /* Der durchlaufende Pfad misst seine Länge Stützstelle für Stützstelle
         im Bildschirmraum aus. Das ist auch nach dem Straffen der teuerste
         Posten des Starts (rund 70 ms fürs Messen, noch einmal so viel für das
         anschließende Vermessen aller Trigger) — und er beginnt erst bei den
         Standards, also weit unter der Kante. Während der Hero-Choreografie
         hat er dort nichts verloren.

         Bis dahin hält ihn das CSS verdeckt; sichtbar wird er, sobald die
         Länge feststeht. */
      initThread();

      // Bilder verändern nach dem Laden die Seitenhöhe — Trigger neu vermessen.
      ScrollTrigger.refresh();

      /* Waren die Bilder zu diesem Zeitpunkt noch nicht durch, verschiebt sich
         die Höhe später noch einmal. Dann ein zweites Mal vermessen — dieses
         Mal ohne Eile, die Choreografie ist längst vorbei. */
      if (document.readyState !== "complete") {
        window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
      }
    });
  });
}
