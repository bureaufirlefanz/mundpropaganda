/**
 * Highlight-Marker-Reveal (Osmo).
 *
 * Jede Zeile wird von einem farbigen Balken verdeckt, der zur Seite
 * wegskaliert und den Text freigibt — wie ein Textmarker, der rückwärts
 * läuft. Passt zur Marke, weil die Magazin-Section dieselbe Geste als
 * ruhendes Gestaltungsmittel verwendet.
 *
 * Übernommen wie geliefert; angepasst sind nur die Modul-Importe und die
 * Farbtabelle, die jetzt auf die Marken-Token zeigt.
 *
 * Steuerung über Attribute:
 *   data-highlight-marker-reveal      aktiviert
 *   data-marker-direction             left | right | up | down
 *   data-marker-theme                 brand | white | --var | Farbwert
 *   data-marker-scroll-start          ScrollTrigger-Startwert
 *   data-marker-stagger               Versatz je Zeile in Millisekunden
 *   data-marker-stagger-start="end"   Reihenfolge von unten nach oben
 *   data-marker-delay                 Vorlauf in Sekunden (Ergänzung)
 */
import { gsap, ScrollTrigger, SplitText } from "../lib/gsap.js";

export function initHighlightMarkerTextReveal() {
  const defaults = {
    direction: "right",
    theme: "brand",
    scrollStart: "top 90%",
    staggerStart: "start",
    stagger: 100,
    barDuration: 0.6,
    barEase: "power3.inOut",
  };

  const colorMap = {
    brand: "#ff84c8",
    dark: "#403229",
    white: "#ffffff",
  };

  const directionMap = {
    right: { prop: "scaleX", origin: "right center" },
    left: { prop: "scaleX", origin: "left center" },
    up: { prop: "scaleY", origin: "center top" },
    down: { prop: "scaleY", origin: "center bottom" },
  };

  function resolveColor(value) {
    if (colorMap[value]) return colorMap[value];
    if (value.startsWith("--")) {
      return getComputedStyle(document.body).getPropertyValue(value).trim() || value;
    }
    return value;
  }

  function createBar(color, origin) {
    const bar = document.createElement("div");
    bar.className = "highlight-marker-bar";
    Object.assign(bar.style, {
      backgroundColor: color,
      transformOrigin: origin,
    });
    return bar;
  }

  function cleanupElement(el) {
    if (!el._highlightMarkerReveal) return;
    el._highlightMarkerReveal.timeline?.kill();
    el._highlightMarkerReveal.scrollTrigger?.kill();
    el._highlightMarkerReveal.split?.revert();
    el.querySelectorAll(".highlight-marker-bar").forEach((bar) => bar.remove());
    delete el._highlightMarkerReveal;
  }

  let reduceMotion = false;

  gsap.matchMedia().add({ reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
    reduceMotion = context.conditions.reduce;
  });

  // Reduced motion: no animation at all
  if (reduceMotion) {
    document.querySelectorAll("[data-highlight-marker-reveal]").forEach((el) => {
      gsap.set(el, { autoAlpha: 1 });
    });
    return;
  }

  // Cleanup previous instances
  document.querySelectorAll("[data-highlight-marker-reveal]").forEach(cleanupElement);

  const elements = document.querySelectorAll("[data-highlight-marker-reveal]");
  if (!elements.length) return;

  elements.forEach((el) => {
    const direction = el.getAttribute("data-marker-direction") || defaults.direction;
    const theme = el.getAttribute("data-marker-theme") || defaults.theme;
    const scrollStart = el.getAttribute("data-marker-scroll-start") || defaults.scrollStart;
    const staggerStart = el.getAttribute("data-marker-stagger-start") || defaults.staggerStart;
    const staggerOffset =
      (parseFloat(el.getAttribute("data-marker-stagger")) || defaults.stagger) / 1000;
    // Ergänzung: Vorlauf in Sekunden. Im Hero laufen die Balken sonst
    // gleichzeitig mit der Wortmarke los und nehmen ihr die Aufmerksamkeit.
    const startDelay = parseFloat(el.getAttribute("data-marker-delay")) || 0;

    const color = resolveColor(theme);
    const dirConfig = directionMap[direction] || directionMap.right;

    el._highlightMarkerReveal = {};

    const split = SplitText.create(el, {
      type: "lines",
      linesClass: "highlight-marker-line",
      autoSplit: true,
      onSplit(self) {
        const instance = el._highlightMarkerReveal;

        // Teardown previous build
        instance.timeline?.kill();
        instance.scrollTrigger?.kill();
        el.querySelectorAll(".highlight-marker-bar").forEach((bar) => bar.remove());

        // Build bars and timeline
        const lines = self.lines;
        const tl = gsap.timeline({ paused: true });

        lines.forEach((line, i) => {
          gsap.set(line, { position: "relative", overflow: "hidden" });

          const bar = createBar(color, dirConfig.origin);
          line.appendChild(bar);

          const staggerIndex = staggerStart === "end" ? lines.length - 1 - i : i;

          tl.to(
            bar,
            {
              [dirConfig.prop]: 0,
              duration: defaults.barDuration,
              ease: defaults.barEase,
            },
            staggerIndex * staggerOffset
          );
        });

        /* Freigegeben wird erst beim Start der Bewegung, nicht schon beim
           Aufteilen: sonst stehen die Balken bis zum Auslöser sichtbar da —
           bei einem Vorlauf sekundenlang. */
        const st = ScrollTrigger.create({
          trigger: el,
          start: scrollStart,
          once: true,
          onEnter: () =>
            gsap.delayedCall(startDelay, () => {
              gsap.set(el, { autoAlpha: 1 });
              tl.play();
            }),
        });

        instance.timeline = tl;
        instance.scrollTrigger = st;
      },
    });

    el._highlightMarkerReveal.split = split;
  });
}
