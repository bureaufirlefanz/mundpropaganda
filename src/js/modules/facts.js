/**
 * Zahlen, die beim Hereinscrollen hochzählen.
 *
 * Der Zielwert steht im Markup (`data-zaehler`) und ist auch der Text, der
 * ohne JavaScript dasteht. Das Modul setzt ihn kurz auf null und zählt
 * hinauf — geht dabei etwas schief, steht am Ende trotzdem die richtige Zahl
 * da, weil sie aus demselben Attribut kommt.
 *
 * Ohne Bewegung wird nicht gezählt: eine Zahl, die vor den Augen hochläuft,
 * ist genau die Art Bewegung, die `prefers-reduced-motion` meint.
 */
import { gsap, prefersReducedMotion } from "../lib/gsap.js";

export function initFacts() {
  if (prefersReducedMotion) return;

  gsap.utils.toArray("[data-zaehler]").forEach((el) => {
    const ziel = Number(el.dataset.zaehler);
    if (!Number.isFinite(ziel)) return;

    /* Ein Zwischenwert im Objekt, nicht am Element: GSAP kann keinen
       Textknoten interpolieren. Gerundet wird erst beim Schreiben. */
    const stand = { wert: 0 };

    /* Nur auf null setzen, was noch unterhalb des Sichtfelds steht. Eine
       Zahl, die beim Laden schon im Bild ist, würde sonst erst auf null
       springen und dann hochlaufen — der Sprung wäre auffälliger als das
       Zählen. Sie bleibt einfach stehen. */
    const nochNichtImBild = el.getBoundingClientRect().top > window.innerHeight;
    if (nochNichtImBild) el.textContent = "0";

    gsap.to(stand, {
      wert: ziel,
      duration: 1.4,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = String(Math.round(stand.wert));
      },
      /* Auf den Endwert festnageln: bei einer abgebrochenen Animation bliebe
         sonst die zuletzt gerundete Zahl stehen, und die kann daneben liegen. */
      onComplete: () => {
        el.textContent = String(ziel);
      },
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    });
  });
}
