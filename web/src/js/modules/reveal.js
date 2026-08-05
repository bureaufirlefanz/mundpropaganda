/**
 * Scroll-Reveals.
 *
 * Markup steuert alles über Data-Attribute, damit sich neue Sections ohne
 * JS-Änderung animieren lassen:
 *   data-reveal="up|fade|left|right|clip|scale"
 *   data-reveal-delay="0.1"
 *   data-reveal-stagger  auf einem Container: Kinder gestaffelt
 *   data-split="lines|words|chars"  für Headlines
 *
 * Gestaltungsprinzip: lange Dauer, weiches Auslaufen, kein Überschwingen.
 * Die Bewegung soll auffallen, während sie läuft, und nicht danach.
 */
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "../lib/gsap.js";
import { warteAufSchrift, SCHRIFT } from "../lib/fonts.js";

/* Gemeinsame Kurve für alle Reveals: sehr langes Auslaufen, kein Bounce.
   Das ist der Unterschied zwischen "animiert" und "elegant". */
const EASE = "expo.out";

const VARIANTS = {
  up: { y: 56, opacity: 0 },
  fade: { opacity: 0 },
  left: { xPercent: -14, opacity: 0 },
  right: { xPercent: 14, opacity: 0 },
  scale: { scale: 0.96, opacity: 0, transformOrigin: "center center" },
  clip: { clipPath: "inset(0 0 100% 0)", opacity: 1 },
};

const REST = {
  y: 0,
  xPercent: 0,
  opacity: 1,
  scale: 1,
  clipPath: "inset(0 0 0% 0)",
};

export function initReveals() {
  if (prefersReducedMotion) {
    gsap.set("[data-reveal]", { clearProps: "all", opacity: 1 });
    return;
  }

  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    // Kinder eines Stagger-Containers werden dort behandelt.
    if (el.hasAttribute("data-reveal-child")) return;

    const variant = VARIANTS[el.dataset.reveal] ?? VARIANTS.up;

    /* Mit data-reveal-trigger hängt das Element am Auslöser eines
       Vorfahren statt an sich selbst. Nötig, wenn mehrere Elemente
       gemeinsam auftreten sollen, aber unterschiedlich weit oben stehen —
       sonst löst jedes für sich aus und die Bewegung zerfällt. */
    const scope = el.dataset.revealTrigger;
    const trigger = scope ? el.closest(scope) ?? el : el;

    gsap.fromTo(el, variant, {
      ...REST,
      duration: 1.6,
      delay: parseFloat(el.dataset.revealDelay ?? 0),
      ease: EASE,
      scrollTrigger: { trigger, start: "top 90%", once: true },
      onComplete: () => gsap.set(el, { clearProps: "will-change,clip-path" }),
    });
  });

  gsap.utils.toArray("[data-reveal-stagger]").forEach((container) => {
    const children = container.querySelectorAll("[data-reveal-child]");
    if (!children.length) return;

    const variant = VARIANTS[container.dataset.revealVariant] ?? VARIANTS.up;

    gsap.fromTo(children, variant, {
      ...REST,
      duration: 1.5,
      stagger: parseFloat(container.dataset.revealStagger) || 0.1,
      ease: EASE,
      scrollTrigger: { trigger: container, start: "top 88%", once: true },
    });
  });
}

/**
 * Headline-Reveals mit SplitText.
 *
 * Zeilen fahren hinter einer Maske hoch — nichts weiter. Keine Drehung,
 * kein Versatz: bei großen Graden liest sich jede zusätzliche Bewegung
 * sofort als Verzerrung.
 */
export function initSplitHeadlines() {
  const targets = gsap.utils.toArray("[data-split]");
  if (!targets.length) return;

  if (prefersReducedMotion) {
    gsap.set(targets, { visibility: "visible" });
    return;
  }

  /* Erst nach dem Laden der Schrift splitten, sonst brechen die Zeilen falsch
     um. Gewartet wird auf die Schnitte der Display-Typo, nicht auf
     `document.fonts.ready` — die Begründung steht in lib/fonts.js. */
  warteAufSchrift(SCHRIFT.sans).then(() => {
    targets.forEach((el) => {
      const type = el.dataset.split || "lines";
      const isChars = type === "chars";
      const isWords = type === "words";

      /* autoSplit statt eigener Revert-Logik: SplitText teilt bei Resize
         und Font-Wechsel selbst neu auf und ruft onSplit erneut. Der
         zurückgegebene Tween wird dabei sauber verworfen und neu angelegt.

         Vorher stand hier ein `refreshInit`-Handler, der den Split
         zurücknahm — beim ersten ScrollTrigger.refresh() war die Aufteilung
         damit weg und die Animation lief nie. */
      SplitText.create(el, {
        type: isChars ? "lines,chars" : isWords ? "lines,words" : "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { visibility: "visible" });

          const items = isChars ? self.chars : isWords ? self.words : self.lines;

          return gsap.from(items, {
            /* 130 statt 100: Der Maskenkasten in base.css trägt unten
               0.24em Polster, damit Unterlängen nicht abgeschnitten werden.
               Bei `yPercent: 100` steht die Zeile genau an seiner alten
               Unterkante und ihre Oberkante ragte sichtbar ins Polster.
               Der Überschuss schadet nicht — die Zeile legt lediglich einen
               etwas längeren Weg zurück. */
            yPercent: 130,
            duration: isChars ? 1.6 : 1.9,
            ease: EASE,
            stagger: isChars ? 0.035 : 0.13,
            delay: parseFloat(el.dataset.splitDelay ?? 0),
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        },
      });
    });

    ScrollTrigger.refresh();
  });
}
