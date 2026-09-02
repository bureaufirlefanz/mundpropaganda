/**
 * Kleinteilige UI-Interaktionen: Accordion, Before/After-Slider,
 * Formular-Validierung.
 *
 * Bewusst ohne Cursor-Effekte: der Zeiger bleibt der System-Zeiger, und
 * Hover-Reaktionen gehören zum Element (siehe .c-btn und .c-link im CSS),
 * nicht an den Mauszeiger.
 */
import { gsap, prefersReducedMotion } from "../lib/gsap.js";

/* Ohne Bewegung sofort statt gar nicht: Aufklappen und Fehlerhinweis sind
   Bedienung, kein Schmuck. Null Sekunden setzt den Endzustand, nur ohne den
   Weg dorthin. */
const dauer = (wert) => (prefersReducedMotion ? 0 : wert);

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

      /* `inert` auf dem zugeklappten Panel.
       *
       * `height: 0` mit `overflow: hidden` versteckt den Inhalt für das Auge,
       * nimmt ihn aber NICHT aus dem Tabulatorlauf. Auf der Karriereseite lief
       * der Fokus dadurch in jedes zugeklappte Stellenpanel und landete auf
       * „Auf diese Stelle bewerben" — einem Knopf, den niemand sehen konnte.
       * Gemessen im Tastaturlauf: fünf solcher Stationen hintereinander.
       *
       * `inert` und nicht `hidden`: `hidden` setzt `display: none`, und dann
       * gibt es keine Höhe mehr zu animieren — das Auf- und Zuklappen
       * springt. `inert` lässt die Darstellung in Ruhe und nimmt nur die
       * Bedienbarkeit weg, also genau das, was hier zu viel war. */
      panel.inert = !startOpen;

      trigger.addEventListener("click", () => {
        const isOpen = item.dataset.open === "true";

        if (single && !isOpen) {
          items.forEach((other) => {
            if (other === item || other.dataset.open !== "true") return;
            other.dataset.open = "false";
            other
              .querySelector("[data-accordion-trigger]")
              ?.setAttribute("aria-expanded", "false");
            const anderes = other.querySelector("[data-accordion-panel]");
            /* Sofort sperren, nicht erst nach der Bewegung: Wer währenddessen
               Tab drückt, käme sonst noch in ein Panel, das gerade zugeht. */
            if (anderes) anderes.inert = true;
            gsap.to(anderes, {
              height: 0,
              duration: dauer(0.45),
              ease: "power3.inOut",
            });
          });
        }

        item.dataset.open = String(!isOpen);
        trigger.setAttribute("aria-expanded", String(!isOpen));
        /* Beim Aufklappen sofort freigeben, beim Zuklappen sofort sperren.
           In beiden Richtungen gilt: erst die Bedienbarkeit, dann die
           Bewegung — sonst hängt der Tabulatorlauf eine halbe Sekunde
           hinter dem her, was zu sehen ist. */
        panel.inert = isOpen;
        gsap.to(panel, {
          height: isOpen ? 0 : "auto",
          duration: dauer(0.5),
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
      handle.setAttribute(
        "aria-valuetext",
        `${Math.round(position)} % nachher`,
      );
    };

    const setPos = (clientX) => {
      const rect = frame.getBoundingClientRect();
      position = gsap.utils.clamp(
        0,
        100,
        ((clientX - rect.left) / rect.width) * 100,
      );
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
      const step = { ArrowLeft: -2, ArrowRight: 2, PageDown: -10, PageUp: 10 }[
        e.key
      ];
      if (step !== undefined)
        position = gsap.utils.clamp(0, 100, position + step);
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

/**
 * Der Grund im Klartext (WCAG 2.2, 3.3.1 Error Identification und 3.3.3 Error
 * Suggestion).
 *
 * Aus dem ValidityState und nicht als Text an jedem Feld: Der Browser weiß
 * bereits, WAS nicht stimmt — fehlender Pflichtwert, falsches Format, zu kurz.
 * Diese Unterscheidung hier einmal in Worte zu fassen ist verlässlicher, als
 * sie an fünfzehn Feldern zu wiederholen und beim sechzehnten zu vergessen.
 *
 * Jede Meldung nennt auch, was zu tun ist. „Ungültige Eingabe" erfüllt 3.3.1,
 * aber nicht 3.3.3 — der Hinweis muss auf die Lösung zeigen.
 *
 * Exportiert, weil das Bewerbungsformular (`modules/application.js`) dieselben
 * Felder mit denselben Regeln prüft. Zwei Fassungen desselben Satzes liefen
 * beim nächsten Feinschliff auseinander.
 */
export function errorText(input) {
  const v = input.validity;
  const art = (input.type || "").toLowerCase();

  if (v.valueMissing) {
    if (art === "checkbox") return "Bitte setze den Haken, um fortzufahren.";
    if (art === "radio") return "Bitte wähle eine der Möglichkeiten aus.";
    if (input.tagName === "SELECT")
      return "Bitte wähle einen Eintrag aus der Liste.";
    return "Bitte fülle dieses Feld aus.";
  }
  if (v.typeMismatch) {
    if (art === "email")
      return "Bitte gib eine E-Mail-Adresse mit @ an, etwa name@beispiel.de.";
    if (art === "tel")
      return "Bitte gib eine Telefonnummer an, nur Ziffern und Leerzeichen.";
    if (art === "url")
      return "Bitte gib eine vollständige Adresse an, beginnend mit https://.";
    return "Bitte prüfe das Format dieser Eingabe.";
  }
  if (v.tooShort) return `Bitte gib mindestens ${input.minLength} Zeichen ein.`;
  if (v.tooLong) return `Bitte kürze auf höchstens ${input.maxLength} Zeichen.`;
  if (v.rangeUnderflow) return `Bitte wähle einen Wert ab ${input.min}.`;
  if (v.rangeOverflow)
    return `Bitte wähle einen Wert bis höchstens ${input.max}.`;
  if (v.stepMismatch) return "Bitte wähle einen der zulässigen Schritte.";
  if (v.patternMismatch) return "Bitte halte dich an das vorgegebene Format.";
  return "Bitte prüfe diese Eingabe.";
}

/**
 * Meldung setzen oder räumen — und die Verknüpfung gleich mit.
 *
 * `aria-describedby` ist der Faden zwischen Feld und Grund. Ohne ihn liest ein
 * Vorlesegerät zwar „ungültig" (aus `aria-invalid`), findet den danebenstehenden
 * Satz aber nicht: Er gehört zu keinem Feld, er steht nur zufällig in der Nähe.
 *
 * Beim Räumen wird der Faden wieder gelöst statt auf eine leere Meldung zu
 * zeigen — eine Beschreibung, die ins Leere greift, ist schlechter als keine.
 */
export function setMessage(field, input, text) {
  const el = field.querySelector(".c-field__message");
  if (!el) return;

  if (text) {
    el.textContent = text;
    el.hidden = false;
    if (el.id) input.setAttribute("aria-describedby", el.id);
  } else {
    el.textContent = "";
    el.hidden = true;
    if (el.id && input.getAttribute("aria-describedby") === el.id) {
      input.removeAttribute("aria-describedby");
    }
  }
}

/**
 * Absenden an Netlify Forms.
 *
 * Netlify nimmt die Einsendung an jedem Pfad der Website entgegen; entscheidend
 * ist das Feld `form-name`, das im Markup steht. Gesendet wird als
 * `FormData` und nicht als kodierte Zeichenkette, weil zwei Felder Dateien
 * tragen — anders käme nur der Dateiname an.
 *
 * Der Rückgabewert ist die Meldung für die Statuszeile, nicht `true`/`false`:
 * Was schiefging, muss dort stehen, wo jemand es liest.
 *
 * **Kein „Danke" ohne Antwort vom Server.** Genau das war der Fehler, den
 * diese Funktion ablöst: Die alte Fassung schrieb die Bestätigung direkt nach
 * der Prüfung hin, ohne je etwas verschickt zu haben.
 */
async function sende(form) {
  const antwort = await fetch(form.getAttribute("action") || "/", {
    method: "POST",
    body: new FormData(form),
  });
  if (!antwort.ok) throw new Error(`Netlify antwortete mit ${antwort.status}`);
}

/** Was zu tun ist, wenn der Versand nicht geklappt hat. */
function ersatzweg(form) {
  const adresse = form.dataset.formFallback;
  return adresse
    ? `Das Absenden hat nicht geklappt. Bitte schreib uns an ${adresse} oder ruf an.`
    : "Das Absenden hat nicht geklappt. Bitte ruf uns an oder versuch es später noch einmal.";
}

export function initForm() {
  document.querySelectorAll("[data-form]").forEach((form) => {
    const status = form.querySelector("[data-form-status]");

    /* Die Browserprüfung erst hier abschalten, nicht im Markup.
       Stünde `novalidate` am Formular, prüfte ohne JavaScript niemand — der
       Browser nicht, weil abgeschaltet, und das Modul nicht, weil es nicht
       läuft. Netlify nähme dann leere Pflichtfelder entgegen. */
    form.noValidate = true;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let firstInvalid = null;
      let anzahl = 0;

      form.querySelectorAll("[data-field]").forEach((field) => {
        const input = field.querySelector("input, textarea, select");
        if (!input) return;

        const invalid = !input.checkValidity();
        field.dataset.invalid = String(invalid);
        /* Auch am Feld, nicht nur am Rahmen: `data-invalid` steuert das CSS,
           `aria-invalid` ist die Auskunft fürs Vorlesegerät. */
        if (invalid) input.setAttribute("aria-invalid", "true");
        else input.removeAttribute("aria-invalid");
        setMessage(field, input, invalid ? errorText(input) : "");
        if (invalid) anzahl++;
        if (invalid && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        /* Die Zusammenfassung wird angesagt, das einzelne Feld nicht: Der
           Fokus springt gleich dorthin, und `aria-describedby` liefert den
           Grund dann von selbst. Beides zugleich läse denselben Satz zweimal. */
        if (status) {
          status.textContent =
            anzahl === 1
              ? "Ein Feld braucht noch eine Angabe. Der Fokus steht darauf."
              : `${anzahl} Felder brauchen noch eine Angabe. Der Fokus steht auf dem ersten.`;
        }
        gsap.fromTo(
          firstInvalid,
          { x: -6 },
          /* Das Rütteln am ersten ungültigen Feld ist der Hinweis „hier".
             Ohne Bewegung übernimmt das der Fokussprung, den die Zeile
             darunter ohnehin macht — plus die Meldung am Feld. */
          { x: 0, duration: dauer(0.5), ease: "elastic.out(1, 0.35)" },
        );
        firstInvalid.querySelector("input, textarea, select")?.focus();
        return;
      }

      const button = form.querySelector('[type="submit"]');
      const label = button?.querySelector(".c-btn__label");
      const beschriftung = label?.textContent;

      /* Sperren, solange gesendet wird: Ein zweiter Klick schickte dieselbe
         Anfrage ein zweites Mal, und die Praxis sähe zwei Einsendungen. */
      if (button) button.disabled = true;
      if (label) label.textContent = "Wird gesendet";
      /* WCAG 2.2, 4.1.3: Die geänderte Aufschrift des Knopfes ist eine
         Änderung im Dokument, keine Meldung. Ohne diese Zeile erfährt niemand
         davon, der nicht gerade hinsieht. */
      if (status) status.textContent = "Deine Anfrage wird gesendet.";

      try {
        await sende(form);
        form.reset();
        /* `form.reset()` leert das Dateifeld, lässt die gestylte Hülle
           daneben aber auf dem Dateinamen stehen. */
        form.querySelectorAll("[data-file-name]").forEach((el) => {
          if (el.dataset.fileFallback) el.textContent = el.dataset.fileFallback;
        });
        form.querySelectorAll("[data-file]").forEach((wrap) => {
          wrap.dataset.filled = "false";
        });
        if (label) label.textContent = "Danke - wir melden uns";
        if (status) {
          status.textContent =
            "Danke, deine Anfrage ist eingegangen. Wir melden uns in Kürze.";
        }
      } catch {
        /* Der Knopf wird wieder freigegeben: Der Versuch soll wiederholbar
           sein. Nur die Aufschrift bleibt nicht auf „Wird gesendet" stehen. */
        if (button) button.disabled = false;
        if (label && beschriftung) label.textContent = beschriftung;
        if (status) status.textContent = ersatzweg(form);
      }
    });

    // Fehlerzustand verschwindet, sobald der Nutzer korrigiert.
    form.querySelectorAll("[data-field]").forEach((field) => {
      const raeumen = (e) => {
        if (field.dataset.invalid === "true") field.dataset.invalid = "false";
        const input = e.target;
        if (input.removeAttribute) input.removeAttribute("aria-invalid");
        setMessage(field, input, "");
      };
      field.addEventListener("input", raeumen);
      /* `change` zusätzlich: Ein Häkchen und eine Auswahlliste lösen kein
         `input` in jedem Browser aus, die Meldung bliebe dort stehen,
         nachdem sie erledigt ist. */
      field.addEventListener("change", raeumen);
    });

    // Dateiname in die gestylte Hülle spiegeln.
    form.querySelectorAll("[data-file]").forEach((wrap) => {
      const input = wrap.querySelector('input[type="file"]');
      const label = wrap.querySelector("[data-file-name]");
      if (!input || !label) return;

      /* Die ursprüngliche Aufschrift („Foto auswählen") kommt ans Element und
         nicht in eine Closure: `form.reset()` nach dem Absenden leert das
         Feld, und wer die Aufschrift zurücksetzen will, muss von außen an sie
         herankommen. */
      label.dataset.fileFallback ??= label.textContent;

      input.addEventListener("change", () => {
        const file = input.files?.[0];
        label.textContent = file ? file.name : label.dataset.fileFallback;
        wrap.dataset.filled = String(Boolean(file));
      });
    });
  });
}
