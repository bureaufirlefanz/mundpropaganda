/**
 * Kleinteilige UI-Interaktionen: Accordion, Before/After-Slider,
 * Formular-Validierung.
 *
 * Bewusst ohne Cursor-Effekte: der Zeiger bleibt der System-Zeiger, und
 * Hover-Reaktionen gehören zum Element (siehe .c-btn und .c-link im CSS),
 * nicht an den Mauszeiger.
 */
import { gsap } from "../lib/gsap.js";

/* --- Accordion ---------------------------------------------------------
   Höhe wird animiert statt auf `auto` gesetzt, damit der Übergang weich
   ist. GSAP rechnet `height: auto` korrekt aus, deshalb kein manuelles
   scrollHeight-Gefummel.
   -------------------------------------------------------------------- */

export function initAccordion() {
  document.querySelectorAll("[data-accordion]").forEach((accordion) => {
    const items = accordion.querySelectorAll("[data-accordion-item]");
    const single = accordion.dataset.accordion === "single";

    items.forEach((item) => {
      const trigger = item.querySelector("[data-accordion-trigger]");
      const panel = item.querySelector("[data-accordion-panel]");
      if (!trigger || !panel) return;

      const startOpen = item.dataset.open === "true";
      gsap.set(panel, { height: startOpen ? "auto" : 0 });
      trigger.setAttribute("aria-expanded", String(startOpen));

      trigger.addEventListener("click", () => {
        const isOpen = item.dataset.open === "true";

        if (single && !isOpen) {
          items.forEach((other) => {
            if (other === item || other.dataset.open !== "true") return;
            other.dataset.open = "false";
            other
              .querySelector("[data-accordion-trigger]")
              ?.setAttribute("aria-expanded", "false");
            gsap.to(other.querySelector("[data-accordion-panel]"), {
              height: 0,
              duration: 0.45,
              ease: "power3.inOut",
            });
          });
        }

        item.dataset.open = String(!isOpen);
        trigger.setAttribute("aria-expanded", String(!isOpen));
        gsap.to(panel, {
          height: isOpen ? 0 : "auto",
          duration: 0.5,
          ease: "power3.inOut",
        });
      });
    });
  });
}

/* --- Before/After-Slider ------------------------------------------------ */

export function initBeforeAfter() {
  document.querySelectorAll("[data-ba]").forEach((frame) => {
    const handle = frame.querySelector("[data-ba-handle]");
    let dragging = false;
    let position = 50; // Prozent, von links

    const apply = () => {
      frame.style.setProperty("--ba-pos", `${position}%`);
      if (!handle) return;
      /* Der Wert muss auch angesagt werden, nicht nur gezeichnet: ohne
         aria-valuenow liest ein Vorlesegerät den Regler als leer vor. */
      handle.setAttribute("aria-valuenow", String(Math.round(position)));
      handle.setAttribute("aria-valuetext", `${Math.round(position)} % after`);
    };

    const setPos = (clientX) => {
      const rect = frame.getBoundingClientRect();
      position = gsap.utils.clamp(0, 100, ((clientX - rect.left) / rect.width) * 100);
      apply();
    };

    frame.addEventListener("pointerdown", (e) => {
      dragging = true;
      frame.setPointerCapture(e.pointerId);
      setPos(e.clientX);
    });

    frame.addEventListener("pointermove", (e) => {
      // Ohne gedrückte Taste folgt der Griff trotzdem — das lädt zum
      // Ausprobieren ein, ohne dass man klicken muss.
      if (dragging || e.pointerType === "mouse") setPos(e.clientX);
    });

    frame.addEventListener("pointerup", (e) => {
      dragging = false;
      frame.releasePointerCapture(e.pointerId);
    });

    /* Tastatur. Der Regler war bisher nur mit dem Zeiger zu bewegen — für
       alle, die keine Maus benutzen, gab es den Vergleich schlicht nicht
       (WCAG 2.1.1). Die Schrittweiten folgen der Gepflogenheit für Regler:
       Pfeiltasten fein, Bild auf/ab grob, Pos1/Ende an den Anschlag. */
    handle?.addEventListener("keydown", (e) => {
      const step = { ArrowLeft: -2, ArrowRight: 2, PageDown: -10, PageUp: 10 }[e.key];
      if (step !== undefined) position = gsap.utils.clamp(0, 100, position + step);
      else if (e.key === "Home") position = 0;
      else if (e.key === "End") position = 100;
      else return;

      e.preventDefault();
      apply();
    });

    apply();
  });
}

/* --- Formular ----------------------------------------------------------
   Reine Client-Validierung — KEIN VERSAND. Das Formular prüft, dankt und
   verschickt nichts; wer es ausfüllt, erreicht niemanden. Der echte Versand
   ist Aufgabe 17 in CMS-UMBAU.md und muss vor dem Livegang gelöst sein.
   (Der Satz, der hier stand — „in Webflow übernimmt das später das native
   Form-Handling" — stammte aus einer Zukunft, die es nicht mehr gibt.)
   -------------------------------------------------------------------- */

export function initForm() {
  document.querySelectorAll("[data-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let firstInvalid = null;

      form.querySelectorAll("[data-field]").forEach((field) => {
        const input = field.querySelector("input, textarea, select");
        if (!input) return;

        const invalid = !input.checkValidity();
        field.dataset.invalid = String(invalid);
        /* Auch am Feld, nicht nur am Rahmen: `data-invalid` steuert das CSS,
           `aria-invalid` ist die Auskunft fürs Vorlesegerät. */
        if (invalid) input.setAttribute("aria-invalid", "true");
        else input.removeAttribute("aria-invalid");
        if (invalid && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        gsap.fromTo(
          firstInvalid,
          { x: -6 },
          { x: 0, duration: 0.5, ease: "elastic.out(1, 0.35)" }
        );
        firstInvalid.querySelector("input, textarea, select")?.focus();
        return;
      }

      const button = form.querySelector('[type="submit"] .c-btn__label');
      if (button) button.textContent = "Danke - wir melden uns";
    });

    // Fehlerzustand verschwindet, sobald der Nutzer korrigiert.
    form.querySelectorAll("[data-field]").forEach((field) => {
      field.addEventListener("input", (e) => {
        if (field.dataset.invalid === "true") field.dataset.invalid = "false";
        if (e.target.removeAttribute) e.target.removeAttribute("aria-invalid");
      });
    });

    // Dateiname in die gestylte Hülle spiegeln.
    form.querySelectorAll("[data-file]").forEach((wrap) => {
      const input = wrap.querySelector('input[type="file"]');
      const label = wrap.querySelector("[data-file-name]");
      if (!input || !label) return;

      const fallback = label.textContent;
      input.addEventListener("change", () => {
        const file = input.files?.[0];
        label.textContent = file ? file.name : fallback;
        wrap.dataset.filled = String(Boolean(file));
      });
    });
  });
}
