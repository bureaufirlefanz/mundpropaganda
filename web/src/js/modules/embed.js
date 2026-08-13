/**
 * Fremde Inhalte, die erst auf Klick geladen werden — Videos und Karten.
 *
 * Der ganze Zweck ist, dass VORHER nichts passiert: keine Anfrage an
 * YouTube oder OpenStreetMap, keine Kennung, kein Einwilligungsbanner nötig.
 * Bis zum Klick steht dort ein Standbild mit einem Knopf; die Adresse liegt
 * im Attribut `data-embed`, das `<iframe>` entsteht erst hier.
 *
 * Ein Modul für beide Fälle und nicht zwei: Der Unterschied zwischen einem
 * eingebetteten Video und einer eingebetteten Karte ist die Adresse, sonst
 * nichts. Zwei Dateien, die dasselbe tun, laufen früher oder später
 * auseinander — und dann lädt eine von beiden doch zu früh.
 *
 * Das ist dieselbe Überlegung wie bei Plausible in den Einstellungen: Was
 * ohne Einwilligung keine Daten überträgt, braucht auch keine.
 */
export function initEmbeds() {
  document.querySelectorAll("[data-embed]").forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        const url = button.dataset.embed;
        if (!url) return;

        const frame = document.createElement("iframe");
        frame.src = url;
        frame.title = button.getAttribute("aria-label") || "Eingebetteter Inhalt";
        frame.loading = "lazy";
        frame.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        frame.allowFullscreen = true;

        /* Der Knopf wird zur Hülle des iframes: Er trägt bereits Rundung,
           Seitenverhältnis und Überlauf. Ein neues Element daneben müsste
           dieselben Regeln noch einmal führen.

           `disabled` statt `replaceWith`: Das Element bleibt im
           Dokumentfluss, die Höhe springt also nicht. Ohne die Abschaltung
           bliebe eine Schaltfläche mit einem Video darin — mit der Tastatur
           erreichbar, aber ohne Wirkung. */
        button.replaceChildren(frame);
        button.disabled = true;
        button.style.cursor = "default";
        button.removeAttribute("data-embed");
      },
      { once: true }
    );
  });
}
