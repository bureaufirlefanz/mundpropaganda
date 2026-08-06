/**
 * Zeitstrahl: Die Linie zieht sich mit dem Scrollen entlang der Bahn, die
 * Marken springen an, sobald sie erreicht sind.
 *
 * Die gefüllte Linie ist der VOREINGESTELLTE Zustand im CSS — ohne
 * JavaScript und ohne Bewegung steht sie vollständig da. Erst dieses Modul
 * setzt sie zurück und zieht sie beim Scrollen wieder auf. Andersherum
 * gebaut zeigte die Seite ohne Skript eine leere Bahn, und das wäre eine
 * falsche Aussage über den Ablauf.
 *
 * Die Richtung folgt der Anordnung: waagerecht wird in der Breite gezogen,
 * senkrecht in der Höhe. Welche gerade gilt, verrät die gemessene Form der
 * Bahn — nicht ein zweiter Medienabfrage-Wert im Skript, der mit dem CSS
 * auseinanderlaufen könnte.
 */
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap.js";

export function initTimeline() {
  document.querySelectorAll("[data-timeline]").forEach((root) => {
    const fuellung = root.querySelector("[data-timeline-fill]");
    const stages = [...root.querySelectorAll(".s-timeline__etappe")];
    if (!fuellung || !stages.length) return;

    if (prefersReducedMotion) {
      stages.forEach((e) => (e.dataset.erreicht = ""));
      return;
    }

    const bahn = root.querySelector(".s-timeline__bahn");

    /* Beim Aufziehen wandert die Kante über die Marken. Erreicht ist eine
       Marke, sobald die Kante ihre Mitte passiert hat — gemessen an der
       Bahn, nicht an festen Anteilen: bei vier gleich breiten Spalten wäre
       das dasselbe, bei ungleichen nicht. */
    const anteile = () => {
      const b = bahn.getBoundingClientRect();
      const senkrecht = b.height > b.width;
      return stages.map((e) => {
        const p = e.querySelector(".s-timeline__punkt").getBoundingClientRect();
        return senkrecht
          ? (p.top + p.height / 2 - b.top) / b.height
          : (p.left + p.width / 2 - b.left) / b.width;
      });
    };

    let headings = anteile();

    gsap.fromTo(
      fuellung,
      { scaleX: 0, scaleY: 0 },
      {
        /* Beide Achsen setzen: Welche wirkt, entscheidet die Bahn über ihre
           eigene Größe — die waagerechte Bahn ist 2px hoch, die senkrechte
           2px breit. Die jeweils andere Skalierung fällt damit nicht auf. */
        scaleX: 1,
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          end: "bottom 75%",
          scrub: 0.6,
          onRefresh: () => {
            headings = anteile();
          },
          onUpdate: (selbst) => {
            stages.forEach((e, i) => {
              if (selbst.progress >= headings[i]) e.dataset.erreicht = "";
              else delete e.dataset.erreicht;
            });
          },
        },
      }
    );

    /* Nach dem Umbruch voices die Anteile nicht mehr — waagerecht und
       senkrecht liegen die Punkte woanders. ScrollTrigger misst bei
       `refresh` neu, das oben angehängte `onRefresh` zieht die Marken mit. */
    ScrollTrigger.refresh();
  });
}
