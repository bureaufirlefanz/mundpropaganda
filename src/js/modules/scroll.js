/**
 * Smooth-Scroll via Lenis, an GSAPs Ticker gekoppelt.
 *
 * Wichtig: Lenis darf NICHT seinen eigenen requestAnimationFrame-Loop
 * fahren, sonst laufen zwei Loops gegeneinander und ScrollTrigger liest
 * veraltete Positionen. Deshalb hängen wir Lenis in gsap.ticker.
 */
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap.js";

let lenis = null;

export function initScroll() {
  if (prefersReducedMotion) return null;

  // ?nosmooth schaltet Lenis ab. Nötig für visuelle Regressionstests und
  // beim Nachstellen von Bugs, die nur mit nativem Scrollen auftreten.
  if (new URLSearchParams(location.search).has("nosmooth")) return null;

  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    // Touch bleibt nativ: erzwungenes Smooth-Scrolling auf Mobile fühlt
    // sich träge an und kostet Scroll-Performance.
    syncTouch: false,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Lenis überschreibt native Scroll-Positionen in seinem RAF-Loop.
  // Programmatisches Springen (Tests, Devtools, Deep-Links) muss deshalb
  // über die Instanz laufen — hier zugänglich gemacht.
  if (import.meta.env.DEV) window.__lenis = lenis;

  return lenis;
}

export function getLenis() {
  return lenis;
}

/** Anker-Links weich anfahren. */
export function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -100 });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  });
}
