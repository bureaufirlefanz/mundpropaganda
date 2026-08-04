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

export const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* Griff für die Konsole und die Prüfskripte — wie window.__lenis in
   modules/scroll.js. Nur im Entwicklungsmodus, damit nichts davon in der
   Auslieferung landet. */
if (import.meta.env.DEV) {
  window.__gsap = gsap;
  window.__st = ScrollTrigger;
}

export { gsap, ScrollTrigger, SplitText };
