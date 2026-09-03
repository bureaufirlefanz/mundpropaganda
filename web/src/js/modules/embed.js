/**
 * Fremde Inhalte, die erst auf Klick geladen werden — Videos und Karten.
 *
 * Der ganze Zweck ist, dass VORHER nichts passiert: keine Anfrage an
 * YouTube oder OpenStreetMap, keine Kennung, kein Einwilligungsbanner nötig.
 * Bis zum Klick steht dort ein Standbild mit einem Button; die Adresse liegt
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
        frame.title =
          button.getAttribute("aria-label") || "Eingebetteter Inhalt";
        frame.loading = "lazy";
        frame.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        frame.allowFullscreen = true;

        /* Aus dem Button wird ein Rahmen.

           Vorher blieb der `<button>` stehen, bekam das iframe als Kind und
           `disabled`. Zwei Dinge stimmten daran nicht: Ein `<button>` darf
           keinen eigenständig bedienbaren Inhalt enthalten, und in Firefox
           schluckt ein abgeschalteter Button die Zeigerereignisse seiner
           Kinder — das Video war da und ließ sich nicht bedienen.

           Der Ersatz übernimmt Klasse und Astro-Kennung des Buttons: Rundung,
           Seitenverhältnis und Überlauf hängen daran, und die
           Bereichskennung (`data-astro-cid-…`) entscheidet, ob die
           komponenteneigenen Regeln überhaupt greifen. Ein von Hand
           geschriebenes `class="s-video__frame"` bliebe ohne Wirkung.

           `data-reveal` wird bewusst NICHT übernommen: Die Einblendung ist
           längst gelaufen, und ein neues Element mit diesem Attribut wäre
           per CSS auf Deckkraft null gesetzt — von einem Modul, das es nicht
           mehr anfasst. Das Video wäre unsichtbar. */
        const rahmen = document.createElement("div");
        for (const attribut of button.attributes) {
          if (
            attribut.name === "class" ||
            attribut.name.startsWith("data-astro-cid-")
          ) {
            rahmen.setAttribute(attribut.name, attribut.value);
          }
        }
        rahmen.append(frame);
        button.replaceWith(rahmen);
      },
      { once: true },
    );
  });
}
