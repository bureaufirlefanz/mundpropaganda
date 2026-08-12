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
const MAX_LAENGE = 1900;

export function initApplication() {
  document.querySelectorAll("[data-apply]").forEach((formular) => {
    const schritte = [...formular.querySelectorAll("[data-apply-schritt]")];
    const marken = [...formular.querySelectorAll("[data-apply-marke]")];
    const zurueck = formular.querySelector("[data-apply-zurueck]");
    const weiter = formular.querySelector("[data-apply-weiter]");
    const absenden = formular.querySelector("[data-apply-absenden]");
    const absendenLink = absenden?.querySelector("a");
    if (!schritte.length || !weiter || !absenden) return;

    let aktuell = 0;

    const gewaehlt = () => formular.querySelector('input[name="rolle"]:checked');

    /** Der Block mit den Fragen zur gewählten Rolle — oder null. */
    const fragenBlock = () => {
      const wahl = gewaehlt();
      if (!wahl) return null;
      return formular.querySelector(
        `[data-apply-fragen="${CSS.escape(wahl.dataset.applyRolle)}"]`
      );
    };

    /** Hat die gewählte Rolle überhaupt eigene Fragen? */
    const hatFragen = () => Boolean(fragenBlock()?.querySelector(".c-field"));

    /**
     * Blendet die Fragen der gewählten Rolle ein und schaltet alle anderen
     * ab. Läuft bei jeder Änderung der Rollenwahl — auch rückwärts, wenn
     * jemand die Wahl noch einmal ändert.
     */
    function fragenAktualisieren() {
      const aktiv = fragenBlock();
      formular.querySelectorAll("[data-apply-fragen]").forEach((block) => {
        const an = block === aktiv;
        block.hidden = !an;
        block
          .querySelectorAll("input, textarea, select")
          .forEach((feld) => (feld.disabled = !an));
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
    function zeige(index) {
      aktuell = Math.min(Math.max(index, 0), schritte.length - 1);
      index = aktuell;
      schritte.forEach((s, i) => (s.hidden = i !== index));
      marken.forEach((m, i) => {
        m.toggleAttribute("data-erreicht", i <= index);
        m.toggleAttribute("data-aktiv", i === index);
      });

      zurueck.hidden = index === 0;

      const letzter = index === schritte.length - 1;
      weiter.hidden = letzter;
      absenden.hidden = !letzter;

      if (letzter) mailtoBauen();
    }

    /** Prüft nur die sichtbaren Felder des aktuellen Schritts. */
    function schrittGueltig() {
      const felder = [
        ...schritte[aktuell].querySelectorAll("input, textarea, select"),
      ].filter((f) => !f.disabled);

      let ersterFehler = null;
      felder.forEach((feld) => {
        const gruppe = feld.closest("[data-field]");
        const schlecht = !feld.checkValidity();
        if (gruppe) gruppe.dataset.invalid = String(schlecht);
        /* Auch am Feld selbst, nicht nur am Rahmen: `data-invalid` steuert
           das CSS, aber ein Vorlesegerät liest es nicht. `aria-invalid` ist
           die Auskunft, die es versteht — ohne sie meldet es ein
           abgelehntes Pflichtfeld als gültig. */
        if (schlecht) feld.setAttribute("aria-invalid", "true");
        else feld.removeAttribute("aria-invalid");
        if (schlecht && !ersterFehler) ersterFehler = feld;
      });

      /* Die Rollenwahl hat keine `[data-field]`-Hülle, an der ein roter
         Zustand hängen könnte — hier genügt der Fokus auf die erste
         Möglichkeit. */
      if (ersterFehler) {
        ersterFehler.focus();
        return false;
      }
      return true;
    }

    /**
     * Setzt die Mail zusammen. Läuft erst im letzten Schritt, dann aber bei
     * jedem Anzeigen — die freie Nachricht kann sich bis zum Klick noch
     * ändern.
     */
    function mailtoBauen() {
      const wahl = gewaehlt();
      if (!wahl || !absendenLink) return;

      const wert = (name) => formular.querySelector(`[name="${CSS.escape(name)}"]`)?.value?.trim() ?? "";

      const zeilen = [
        `Stelle: ${wahl.value}`,
        "",
        `Name: ${wert("name")}`,
        `E-Mail: ${wert("email")}`,
      ];

      const telefon = wert("telefon");
      if (telefon) zeilen.push(`Telefon: ${telefon}`);

      /* Die rollenabhängigen Fragen, in der Reihenfolge des Formulars. Nur
         beantwortete — eine leere Frage in der Mail sieht aus, als sei etwas
         verlorengegangen. */
      const block = fragenBlock();
      if (block) {
        const antworten = [...block.querySelectorAll("input, textarea, select")]
          .filter((f) => !f.disabled && f.value.trim())
          .map((f) => `${f.name}: ${f.value.trim()}`);
        if (antworten.length) zeilen.push("", ...antworten);
      }

      const nachricht = wert("nachricht");
      if (nachricht) zeilen.push("", "Nachricht:", nachricht);

      let text = zeilen.join("\n");
      const betreff = `Bewerbung: ${wahl.value}`;
      const adresse = wahl.dataset.applyMail;

      /* Kürzen, wenn es zu lang wird — und es dazuschreiben. Gekürzt wird
         die freie Nachricht, weil sie als Einzige nachträglich in der
         geöffneten Mail ergänzt werden kann. */
      const laenge = () =>
        `mailto:${adresse}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(text)}`
          .length;

      if (laenge() > MAX_LAENGE && nachricht) {
        const hinweis = "\n\n[Der Text war zu lang für diese Vorschau und wurde gekürzt. Bitte hier ergänzen.]";
        let gekuerzt = nachricht;
        while (gekuerzt.length > 40 && laenge() > MAX_LAENGE) {
          gekuerzt = gekuerzt.slice(0, Math.floor(gekuerzt.length * 0.8));
          text = [...zeilen.slice(0, zeilen.lastIndexOf(nachricht)), gekuerzt + hinweis].join("\n");
        }
      }

      absendenLink.href = `mailto:${adresse}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(text)}`;
    }

    /* --- Verdrahtung ---------------------------------------------------- */

    formular.querySelectorAll('input[name="rolle"]').forEach((r) =>
      r.addEventListener("change", fragenAktualisieren)
    );

    weiter.addEventListener("click", () => {
      if (!schrittGueltig()) return;
      /* Schritt 3 überspringen, wenn die Rolle keine eigenen Fragen hat. */
      const naechster = aktuell + 1;
      zeige(naechster === 2 && !hatFragen() ? 3 : naechster);
    });

    zurueck.addEventListener("click", () => {
      const vorheriger = aktuell - 1;
      zeige(vorheriger === 2 && !hatFragen() ? 1 : Math.max(0, vorheriger));
    });

    /* Der Fehlerzustand verschwindet, sobald jemand korrigiert — dieselbe
       Regel wie im Kontaktformular. */
    formular.querySelectorAll("[data-field]").forEach((gruppe) => {
      gruppe.addEventListener("input", (e) => {
        if (gruppe.dataset.invalid === "true") gruppe.dataset.invalid = "false";
        if (e.target.removeAttribute) e.target.removeAttribute("aria-invalid");
      });
    });

    /* Enter im Formular soll weiterblättern und nicht abschicken: Es gibt
       keinen Server, an den etwas ginge, und ein Neuladen verlöre alles. */
    formular.addEventListener("submit", (e) => e.preventDefault());
    formular.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" || e.target.tagName === "TEXTAREA") return;
      e.preventDefault();
      if (aktuell < schritte.length - 1) weiter.click();
    });

    /* Die Mail kurz vor dem Klick noch einmal bauen: `mousedown` und
       `focus` liegen beide vor dem Aufruf des Links. Ohne das fehlte eine
       Nachricht, die nach dem Anzeigen des letzten Schritts getippt wurde. */
    absendenLink?.addEventListener("mousedown", mailtoBauen);
    absendenLink?.addEventListener("focus", mailtoBauen);

    fragenAktualisieren();
    zeige(0);
  });
}
