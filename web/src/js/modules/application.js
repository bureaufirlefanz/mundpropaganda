/**
 * Der Ablauf des Bewerbungsformulars: Schritte, rollenabhängige Fragen und
 * am Ende eine vorbereitete E-Mail.
 *
 * Drei Dinge, die hier leicht schiefgehen und deshalb ausdrücklich gelöst
 * sind:
 *
 * 1. **Versteckte Pflichtfelder.** Im Markup stehen die Fragen ALLER Rollen,
 *    weil die Seite statisch ist und nichts nachladen kann. Ein `required`
 *    in einem ausgeblendeten Block ließe `checkValidity()` fehlschlagen,
 *    ohne dass irgendwo etwas Rotes zu sehen wäre — der Knopf täte dann
 *    einfach nichts. Alles, was nicht zur gewählten Rolle gehört, wird
 *    deshalb `disabled`; abgeschaltete Felder prüft der Browser nicht und
 *    sendet sie nicht.
 *
 * 2. **Der leere Fragenschritt.** Hat eine Stelle keine eigenen Fragen, wird
 *    Schritt 3 für sie übersprungen — vorwärts wie rückwärts. Ein Schritt
 *    mit einer Überschrift und nichts darunter sieht nach einem Fehler aus.
 *
 * 3. **Die Länge der mailto-Adresse.** Browser und Mailprogramme schneiden
 *    irgendwo zwischen 2000 und 8000 Zeichen ab, ohne es zu sagen. Wird es
 *    zu lang, kürzen wir die freie Nachricht und schreiben ausdrücklich in
 *    die Mail, dass sie gekürzt wurde. Stillschweigend die Hälfte einer
 *    Bewerbung zu verlieren, ist der schlechteste aller Ausgänge.
 */

/** Ab hier gilt eine mailto-Adresse als gefährlich lang. */
const MAX_LENGTH = 1900;

export function initApplication() {
  document.querySelectorAll("[data-apply]").forEach((form) => {
    const steps = [...form.querySelectorAll("[data-apply-step]")];
    const markers = [...form.querySelectorAll("[data-apply-marker]")];
    const backButton = form.querySelector("[data-apply-back]");
    const nextButton = form.querySelector("[data-apply-next]");
    const submitWrap = form.querySelector("[data-apply-submit]");
    const submitLink = submitWrap?.querySelector("a");
    if (!steps.length || !nextButton || !submitWrap) return;

    let current = 0;

    const selectedRole = () => form.querySelector('input[name="role"]:checked');

    /** Der Block mit den Fragen zur gewählten Rolle — oder null. */
    const questionsBlock = () => {
      const choice = selectedRole();
      if (!choice) return null;
      return form.querySelector(
        `[data-apply-questions="${CSS.escape(choice.dataset.applyRole)}"]`
      );
    };

    /** Hat die gewählte Rolle überhaupt eigene Fragen? */
    const hasQuestions = () => Boolean(questionsBlock()?.querySelector(".c-field"));

    /**
     * Blendet die Fragen der gewählten Rolle ein und schaltet alle anderen
     * ab. Läuft bei jeder Änderung der Rollenwahl — auch rückwärts, wenn
     * jemand die Wahl noch einmal ändert.
     */
    function updateQuestions() {
      const aktiv = questionsBlock();
      form.querySelectorAll("[data-apply-questions]").forEach((block) => {
        const an = block === aktiv;
        block.hidden = !an;
        block
          .querySelectorAll("input, textarea, select")
          .forEach((field) => (field.disabled = !an));
      });
    }

    /**
     * Zeigt einen Schritt und führt den Fortschritt nach.
     *
     * Der Index wird abgeklemmt, nicht bloß erwartet: Ein Aufruf über das
     * letzte Element hinaus versteckte sonst ALLE Schritte — das Formular
     * stünde leer da, ohne Fehler und ohne Weg zurück. Aufgefallen beim
     * Durchklicken, als der Weiter-Knopf im letzten Schritt noch ein
     * `click()` bekam.
     */
    function show(index) {
      current = Math.min(Math.max(index, 0), steps.length - 1);
      index = current;
      steps.forEach((s, i) => (s.hidden = i !== index));
      markers.forEach((m, i) => {
        m.toggleAttribute("data-reached", i <= index);
        m.toggleAttribute("data-active", i === index);
      });

      backButton.hidden = index === 0;

      const isLast = index === steps.length - 1;
      nextButton.hidden = isLast;
      submitWrap.hidden = !isLast;

      if (isLast) buildMailto();
    }

    /** Prüft nur die sichtbaren Felder des aktuellen Schritts. */
    function stepIsValid() {
      const fields = [
        ...steps[current].querySelectorAll("input, textarea, select"),
      ].filter((f) => !f.disabled);

      let firstInvalid = null;
      fields.forEach((field) => {
        const group = field.closest("[data-field]");
        const invalid = !field.checkValidity();
        if (group) group.dataset.invalid = String(invalid);
        /* Auch am Feld selbst, nicht nur am Rahmen: `data-invalid` steuert
           das CSS, aber ein Vorlesegerät liest es nicht. `aria-invalid` ist
           die Auskunft, die es versteht — ohne sie meldet es ein
           abgelehntes Pflichtfeld als gültig. */
        if (invalid) field.setAttribute("aria-invalid", "true");
        else field.removeAttribute("aria-invalid");
        if (invalid && !firstInvalid) firstInvalid = field;
      });

      /* Die Rollenwahl hat keine `[data-field]`-Hülle, an der ein roter
         Zustand hängen könnte — hier genügt der Fokus auf die erste
         Möglichkeit. */
      if (firstInvalid) {
        firstInvalid.focus();
        return false;
      }
      return true;
    }

    /**
     * Setzt die Mail zusammen. Läuft erst im letzten Schritt, dann aber bei
     * jedem Anzeigen — die freie Nachricht kann sich bis zum Klick noch
     * ändern.
     */
    function buildMailto() {
      const choice = selectedRole();
      if (!choice || !submitLink) return;

      const valueOf = (name) => form.querySelector(`[name="${CSS.escape(name)}"]`)?.value?.trim() ?? "";

      const lines = [
        `Stelle: ${choice.value}`,
        "",
        `Name: ${valueOf("name")}`,
        `E-Mail: ${valueOf("email")}`,
      ];

      const phone = valueOf("phone");
      if (phone) lines.push(`Telefon: ${phone}`);

      /* Die rollenabhängigen Fragen, in der Reihenfolge des Formulars. Nur
         beantwortete — eine leere Frage in der Mail sieht aus, als sei etwas
         verlorengegangen. */
      const block = questionsBlock();
      if (block) {
        const answers = [...block.querySelectorAll("input, textarea, select")]
          .filter((f) => !f.disabled && f.value.trim())
          .map((f) => `${f.name}: ${f.value.trim()}`);
        if (answers.length) lines.push("", ...answers);
      }

      const message = valueOf("message");
      if (message) lines.push("", "Nachricht:", message);

      let text = lines.join("\n");
      const subject = `Bewerbung: ${choice.value}`;
      const address = choice.dataset.applyMail;

      /* Kürzen, wenn es zu lang wird — und es dazuschreiben. Gekürzt wird
         die freie Nachricht, weil sie als Einzige nachträglich in der
         geöffneten Mail ergänzt werden kann. */
      const urlLength = () =>
        `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`
          .length;

      if (urlLength() > MAX_LENGTH && message) {
        const notice = "\n\n[Der Text war zu lang für diese Vorschau und wurde gekürzt. Bitte hier ergänzen.]";
        let truncated = message;
        while (truncated.length > 40 && urlLength() > MAX_LENGTH) {
          truncated = truncated.slice(0, Math.floor(truncated.length * 0.8));
          text = [...lines.slice(0, lines.lastIndexOf(message)), truncated + notice].join("\n");
        }
      }

      submitLink.href = `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    }

    /* --- Verdrahtung ---------------------------------------------------- */

    form.querySelectorAll('input[name="role"]').forEach((r) =>
      r.addEventListener("change", updateQuestions)
    );

    nextButton.addEventListener("click", () => {
      if (!stepIsValid()) return;
      /* Schritt 3 überspringen, wenn die Rolle keine eigenen Fragen hat. */
      const next = current + 1;
      show(next === 2 && !hasQuestions() ? 3 : next);
    });

    backButton.addEventListener("click", () => {
      const previous = current - 1;
      show(previous === 2 && !hasQuestions() ? 1 : Math.max(0, previous));
    });

    /* Der Fehlerzustand verschwindet, sobald jemand korrigiert — dieselbe
       Regel wie im Kontaktformular. */
    form.querySelectorAll("[data-field]").forEach((group) => {
      group.addEventListener("input", (e) => {
        if (group.dataset.invalid === "true") group.dataset.invalid = "false";
        if (e.target.removeAttribute) e.target.removeAttribute("aria-invalid");
      });
    });

    /* Enter im Formular soll weiterblättern und nicht abschicken: Es gibt
       keinen Server, an den etwas ginge, und ein Neuladen verlöre alles. */
    form.addEventListener("submit", (e) => e.preventDefault());
    form.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" || e.target.tagName === "TEXTAREA") return;
      e.preventDefault();
      if (current < steps.length - 1) nextButton.click();
    });

    /* Die Mail kurz vor dem Klick noch einmal bauen: `mousedown` und
       `focus` liegen beide vor dem Aufruf des Links. Ohne das fehlte eine
       Nachricht, die nach dem Anzeigen des letzten Schritts getippt wurde. */
    submitLink?.addEventListener("mousedown", buildMailto);
    submitLink?.addEventListener("focus", buildMailto);

    updateQuestions();
    show(0);
  });
}
