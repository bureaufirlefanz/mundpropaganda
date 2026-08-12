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
  document.querySelectorAll("[data-embed]").forEach((knopf) => {
    knopf.addEventListener(
      "click",
      () => {
        const adresse = knopf.dataset.embed;
        if (!adresse) return;

        const rahmen = document.createElement("iframe");
        rahmen.src = adresse;
        rahmen.title = knopf.getAttribute("aria-label") || "Eingebetteter Inhalt";
        rahmen.loading = "lazy";
        rahmen.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        rahmen.allowFullscreen = true;

        /* Der Knopf wird zur Hülle des iframes: Er trägt bereits Rundung,
           Seitenverhältnis und Überlauf. Ein neues Element daneben müsste
           dieselben Regeln noch einmal führen.

           `disabled` statt `replaceWith`: Das Element bleibt im
           Dokumentfluss, die Höhe springt also nicht. Ohne die Abschaltung
           bliebe eine Schaltfläche mit einem Video darin — mit der Tastatur
           erreichbar, aber ohne Wirkung. */
        knopf.replaceChildren(rahmen);
        knopf.disabled = true;
        knopf.style.cursor = "default";
        knopf.removeAttribute("data-embed");
      },
      { once: true }
    );
  });
}
