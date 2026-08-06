/**
 * Der Kategoriefilter auf der Magazin-Übersicht.
 *
 * Filtert im Browser statt über die Adresse: Sechs Beiträge liegen ohnehin
 * schon alle auf der Seite, ein Seitenwechsel je Kategorie lüde dieselben
 * Karten noch einmal.
 *
 * Die Auswahl landet trotzdem in der Adresse (`?category=vorsorge`). Ohne
 * das ist eine gefilterte Ansicht nicht teilbar und beim Zurückkommen aus
 * einem Beitrag wieder weg — beides fällt genau dann auf, wenn man den Filter
 * benutzt hat, weil man etwas Bestimmtes suchte.
 */
import { gsap, prefersReducedMotion } from "../lib/gsap.js";

export function initFilter() {
  const box = document.querySelector("[data-filter]");
  if (!box) return;

  const knopf = box.querySelector("[data-filter-knopf]");
  const panel = box.querySelector("#filter-optionen");
  const punkt = box.querySelector("[data-filter-punkt]");
  const optionen = [...box.querySelectorAll("[data-filter-value]")];
  const karten = [...document.querySelectorAll("[data-category]")];
  if (!knopf || !panel || !karten.length) return;

  /* --- Auf- und Zuklappen ------------------------------------------------ */

  const tags = [...panel.querySelectorAll("[data-filter-value]")];

  /**
   * Auf- und Zuklappen.
   *
   * `hidden` bleibt die Wahrheit für Vorlesegeräte und den Tabulatorlauf; die
   * Bewegung liegt darüber. Beim Schließen wird es erst am Ende gesetzt,
   * sonst verschwände das Panel, bevor es sich bewegt hat.
   *
   * Die Tags laufen von rechts heraus, in der Richtung, in der sie stehen —
   * also vom Knopf weg. Rückwärts gestaffelt, damit das erste, das
   * auftaucht, das dem Knopf nächste ist.
   */
  function klappe(auf) {
    knopf.setAttribute("aria-expanded", String(auf));

    if (auf) {
      panel.hidden = false;
      if (!prefersReducedMotion) {
        gsap.fromTo(
          tags,
          { opacity: 0, x: 18 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: "power3.out",
            stagger: { each: 0.045, from: "end" },
            overwrite: true,
          }
        );
      }
      tags[0]?.focus();
      return;
    }

    if (prefersReducedMotion) {
      panel.hidden = true;
      return;
    }

    gsap.to(tags, {
      opacity: 0,
      x: 12,
      duration: 0.2,
      ease: "power2.in",
      stagger: { each: 0.02, from: "start" },
      overwrite: true,
      onComplete: () => {
        panel.hidden = true;
      },
    });
  }

  knopf.addEventListener("click", () => {
    klappe(knopf.getAttribute("aria-expanded") !== "true");
  });

  /* Klick daneben und Escape schließen. Ohne beides bleibt das Panel offen
     stehen, während man schon wieder liest. */
  document.addEventListener("click", (e) => {
    if (!box.contains(e.target)) klappe(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || knopf.getAttribute("aria-expanded") !== "true") return;
    klappe(false);
    knopf.focus();
  });

  /* --- Filtern ----------------------------------------------------------- */

  function wende(value, { animieren = true } = {}) {
    for (const karte of karten) {
      const passt = !value || karte.dataset.category === value;

      /* `hidden` und nicht nur Deckkraft: Eine ausgeblendete Karte darf weder
         im Tabulatorlauf noch in der Vorleseordnung stehen bleiben. */
      if (!animieren || prefersReducedMotion) {
        karte.hidden = !passt;
        gsap.set(karte, { opacity: passt ? 1 : 0, y: 0 });
        continue;
      }

      if (passt) {
        karte.hidden = false;
        gsap.fromTo(
          karte,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", overwrite: true }
        );
      } else {
        gsap.to(karte, {
          opacity: 0,
          y: 8,
          duration: 0.25,
          ease: "power2.in",
          overwrite: true,
          onComplete: () => {
            karte.hidden = true;
          },
        });
      }
    }

    for (const o of optionen) {
      o.setAttribute("aria-pressed", String((o.dataset.filterValue || "") === (value || "")));
    }

    if (punkt) punkt.hidden = !value;
  }

  for (const o of optionen) {
    o.addEventListener("click", () => {
      const value = o.dataset.filterValue || "";
      wende(value);
      klappe(false);
      knopf.focus();

      /* `replaceState`, nicht `pushState`: Sonst sammelt der Zurück-Knopf
         jede einzelne Filterauswahl, und wer dreimal geklickt hat, muss
         dreimal zurück, um die Seite zu verlassen. */
      const url = new URL(location.href);
      if (value) url.searchParams.set("category", value);
      else url.searchParams.delete("category");
      history.replaceState(null, "", url);
    });
  }

  /* Der Zustand aus der Adresse, falls jemand einen gefilterten Link öffnet.
     Ohne Animation — beim ersten Bild soll nichts eingeblendet werden, was
     ohnehin schon dasteht. */
  const start = new URL(location.href).searchParams.get("category");
  if (start && optionen.some((o) => o.dataset.filterValue === start)) {
    wende(start, { animieren: false });
  }
}
