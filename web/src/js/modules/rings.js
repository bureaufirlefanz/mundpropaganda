/**
 * Die konzentrischen Zahn-Konturen.
 *
 * Beim Eintreten laufen die Ringe von innen nach außen auf — wie eine
 * Welle, die vom Zahn ausgeht. Danach atmet die Gruppe leicht weiter,
 * damit die Section beim Lesen nicht tot wirkt.
 */
import { gsap, prefersReducedMotion } from "../lib/gsap.js";

export function initToothRings() {
  const svgs = document.querySelectorAll("[data-tooth-rings]");
  if (!svgs.length) return;

  svgs.forEach((svg) => {
    const rings = svg.querySelectorAll(".tooth-ring");
    if (!rings.length) return;

    // Zielwert deckungsgleich mit der CSS-Vorgabe, sonst überschreibt die
    // Animation die weiche Anmutung.
    const REST_OPACITY = 0.55;

    if (prefersReducedMotion) {
      gsap.set(rings, { opacity: REST_OPACITY });
      return;
    }

    // Von innen nach außen: letzter Ring ist der kleinste.
    const inToOut = [...rings].reverse();

    gsap.fromTo(
      inToOut,
      { opacity: 0, scale: 0.94, transformOrigin: "50% 50%" },
      {
        opacity: REST_OPACITY,
        scale: 1,
        duration: 1.4,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: svg.closest("section") ?? svg,
          start: "top 70%",
          once: true,
        },
      }
    );
  });
}
