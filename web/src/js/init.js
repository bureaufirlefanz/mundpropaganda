/**
 * Registriert alle Module; jedes prüft selbst, ob sein Markup auf der Seite
 * existiert — dadurch teilen sich alle Seiten ein Bundle und wir brauchen
 * keine Per-Page-Einstiegspunkte.
 *
 * Bewusst ohne CSS-Importe und ohne Selbststart: die Astro-App bringt ihre
 * Stile in den Komponenten mit und ruft `init` über den Router auf. Der
 * Prototyp lädt stattdessen main.js daneben, das beides ergänzt.
 */
import { refreshTriggers } from "./lib/gsap.js";
import { waitForFonts, FONTS } from "./lib/fonts.js";
import { initScroll, initAnchors } from "./modules/scroll.js";
import { initReveals, initSplitHeadlines } from "./modules/reveal.js";
import { initHighlightMarkerTextReveal } from "./modules/marker.js";
import { initNav } from "./modules/nav.js";
import { initHero } from "./modules/hero.js";
import { initHeroZoom } from "./modules/hero-zoom.js";
import { initServicesPreview } from "./modules/services.js";
import { initStandards } from "./modules/standards.js";
import { initGallery, initMediaParallax } from "./modules/gallery.js";
import { initFacts } from "./modules/facts.js";
import { initTimeline } from "./modules/timeline.js";
import { initRing } from "./modules/ring.js";
import { initStories } from "./modules/stories.js";
import { initToothRings } from "./modules/rings.js";
import { initThread } from "./modules/thread.js";
import { initAccordion, initBeforeAfter, initForm } from "./modules/ui.js";
import { initToc } from "./modules/toc.js";
import { initFilter } from "./modules/filter.js";
import { initSectionDock } from "./modules/section-dock.js";
import { initEmbeds } from "./modules/embed.js";
import { initApplication } from "./modules/application.js";

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
function whenScrolled(work) {
  let done = false;

  const start = () => {
    if (done) return;
    done = true;
    window.removeEventListener("scroll", start);
    clearTimeout(timer);
    work();
  };

  const timer = setTimeout(start, 2500);
  window.addEventListener("scroll", start, { passive: true });
}

export function init() {
  /* Zuerst, was den Auftritt trägt. Alles hier ist billig: ein paar Elemente
     ansprechen, Startwerte setzen, eine Timeline anlegen. */
  initScroll();
  initAnchors();

  /* Kein `initTransitions()` mehr: Das Modul war der Seitenwechsel aus der
     Vor-Router-Zeit und suchte `[data-transition-wrap]` — Markup, das es
     seit Astros ClientRouter nirgends mehr gibt. Den Wechsel trägt
     Transition.astro mit eigenem Inline-Skript. */
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
  const afterFirstPaint = (work) =>
    requestAnimationFrame(() => requestAnimationFrame(work));

  afterFirstPaint(() => {
    initReveals();
    initSplitHeadlines();
    /* Die Marker-Zeilen sind Mono-Typo und werden ebenfalls ausgemessen. Auf
       den Schnitt warten, nicht auf `document.fonts.ready` — s. lib/fonts.js. */
    waitForFonts(FONTS.mono).then(initHighlightMarkerTextReveal);

    initServicesPreview();
    initStandards();
    initGallery();
    initRing();
    initFacts();
    initTimeline();
    initMediaParallax();
    initStories();
    initToothRings();

    initHeroZoom();
    initAccordion();
    initBeforeAfter();
    initForm();
    initToc();
    initFilter();
    initSectionDock();
    initEmbeds();
    initApplication();

    /* Der durchlaufende Pfad misst seine Länge Stützstelle für Stützstelle im
       Bildschirmraum aus — der teuerste Posten des Starts.
     *
     * Er hing bis hierher am ERSTEN Scrollen, zusammen mit `ScrollTrigger
     * .refresh()`. Gemessen war das eine zusammenhängende Aufgabe von 142 ms
     * auf dem Hauptstrang, ausgelöst in dem Moment, in dem jemand losscrollt.
     * Genau dann sieht man sie auch: Der erste Radschub bleibt hängen, danach
     * läuft alles mit 120 fps. Das war das Ruckeln.
     *
     * Jetzt hängt er an seinem eigenen Abschnitt. Der Faden beginnt bei den
     * Standards, also weit unter der Kante — bis dorthin zu scrollen dauert
     * mehrere Sekunden, und in dieser Zeit ist der Hauptstrang frei. Die
     * Messung passiert damit, während niemand auf sie wartet.
     *
     * `rootMargin: 200%` startet sie rund zwei Bildschirmhöhen vorher: früh
     * genug, dass die Länge feststeht, bevor der Faden ins Bild kommt (bis
     * dahin hält ihn das CSS verdeckt), spät genug, dass sie nicht mehr mit
     * dem Auftritt konkurriert. */
    const faden = document.querySelector("[data-thread]");
    if (faden && "IntersectionObserver" in window) {
      const beobachter = new IntersectionObserver(
        (eintraege, selbst) => {
          if (!eintraege.some((e) => e.isIntersecting)) return;
          selbst.disconnect();
          initThread();
        },
        { rootMargin: "200% 0px" },
      );
      beobachter.observe(faden);
    } else if (faden) {
      /* Ohne Beobachter der alte Weg — lieber eine lange Aufgabe als ein
         Faden, der nie erscheint. */
      whenScrolled(initThread);
    }

    whenScrolled(() => {
      // Bilder verändern nach dem Laden die Seitenhöhe — Trigger neu vermessen.
      refreshTriggers();

      /* Waren die Bilder zu diesem Zeitpunkt noch nicht durch, verschiebt sich
         die Höhe später noch einmal. Dann ein zweites Mal vermessen — dieses
         Mal ohne Eile, die Choreografie ist längst vorbei. */
      if (document.readyState !== "complete") {
        window.addEventListener("load", () => refreshTriggers(), {
          once: true,
        });
      }
    });
  });
}
