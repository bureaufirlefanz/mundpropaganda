/**
 * Standards-Liste.
 *
 * Drei Verhaltensweisen greifen ineinander:
 *   1. Autoplay läuft von selbst durch die Schritte, ein Fortschrittsbalken
 *      in der aktiven Zeile zeigt die verbleibende Zeit.
 *   2. Hover auf einer Zeile übernimmt sofort und hält das Autoplay an.
 *   3. Verlässt der Zeiger die Liste, läuft es beim aktuellen Schritt weiter.
 *
 * Zum Bild: alle Motive liegen gestapelt in der Zahnmaske. Gewechselt wird
 * per Deckkraft und einem leichten Zoom — kein Nachladen, kein Umbau.
 */
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap.js";

const STEP_DURATION = 4.5;

/* Pro Instanz, nicht einmalig: dieselbe Mechanik trägt auf der Homepage
   die Standards-Liste und auf den Leistungsseiten die Benefits — nur mit
   anderem Erscheinungsbild. */
export function initStandards() {
  document.querySelectorAll("[data-standards]").forEach(setup);
}

function setup(section) {
  const rows = [...section.querySelectorAll("[data-standards-row]")];
  const images = [...section.querySelectorAll("[data-standards-img]")];
  const bars = rows.map((r) => r.querySelector("[data-standards-bar] i"));
  if (!rows.length) return;

  let current = -1;
  let cycle = null;
  let running = false;

  /* --- Zustandswechsel ------------------------------------------------ */
  const show = (index) => {
    if (index === current) return;
    current = index;

    rows.forEach((row, i) => {
      row.dataset.active = String(i === index);
    });

    if (!images.length) return;

    images.forEach((img, i) => {
      const active = i === index;
      gsap.to(img, {
        opacity: active ? 1 : 0,
        scale: active ? 1 : 1.06,
        duration: prefersReducedMotion ? 0 : 1.1,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  };

  /* --- Autoplay --------------------------------------------------------
     Jeder Schritt ist ein eigener Tween auf dem Balken der aktiven Zeile.
     Danach rückt der Index weiter. Rekursiv statt als eine lange Timeline,
     damit Hover jederzeit sauber unterbrechen kann.
     ------------------------------------------------------------------ */
  const runStep = (index) => {
    show(index);
    const bar = bars[index];
    if (!bar) return;

    gsap.set(bars, { scaleX: 0 });
    cycle = gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: STEP_DURATION,
        ease: "none",
        onComplete: () => {
          if (running) runStep((index + 1) % rows.length);
        },
      }
    );
  };

  const start = (from = current < 0 ? 0 : current) => {
    if (running || prefersReducedMotion) {
      show(from);
      return;
    }
    running = true;
    runStep(from);
  };

  const stop = () => {
    running = false;
    cycle?.kill();
  };

  /* --- Hover ----------------------------------------------------------- */
  const list = section.querySelector("[data-standards-list]") ?? section;

  rows.forEach((row, i) => {
    row.addEventListener("pointerenter", () => {
      stop();
      show(i);
      /* Die pinke Linie zeigt AUSSCHLIESSLICH, wie weit der selbstlaufende
         Wechsel gediehen ist. Beim Überfahren steht er still — also gibt es
         auch nichts anzuzeigen, und die normale Trennlinie bleibt stehen.

         Vorher füllte sich der Balken hier auf ganze Breite. Das war
         irreführend: Er sah aus wie ein abgelaufener Fortschritt, obwohl
         gerade gar keiner lief. */
      gsap.set(bars, { scaleX: 0 });
    });

    // Tastatur- und Touch-Bedienung: Fokus bzw. Tippen wählt ebenfalls aus.
    row.addEventListener("focusin", () => {
      stop();
      show(i);
      gsap.set(bars, { scaleX: 0 });
    });
    row.setAttribute("tabindex", "0");
  });

  list.addEventListener("pointerleave", () => start());

  /* --- Nur laufen lassen, wenn die Section sichtbar ist ---------------- */
  ScrollTrigger.create({
    trigger: section,
    start: "top 75%",
    end: "bottom 25%",
    onEnter: () => start(0),
    onEnterBack: () => start(),
    onLeave: stop,
    onLeaveBack: stop,
  });

  show(0);
}
