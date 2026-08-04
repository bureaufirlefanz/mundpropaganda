/**
 * Entry-Point des Prototyps: globale Stile plus Selbststart.
 *
 * Die Modulliste liegt in init.js, damit die Astro-App daneben dieselbe
 * Initialisierung nutzen kann, ohne die globalen Stylesheets mitzuziehen —
 * dort gehören die Komponentenstile in die Komponenten.
 *
 * Diese Datei gehört zum Prototyp, liegt aber seit A2 hier: `src/js/` ist
 * geschlossen umgezogen. Die Astro-App bindet sie nicht ein — sie nimmt
 * `init.js` direkt. Mit A3 wandert sie zu `prototypen/vite/`, und dann sind
 * auch die beiden Stylesheets unten wieder in Reichweite.
 */
import "../styles/tokens.css";
import "../styles/base.css";
/* Nur der Prototyp benutzt diese beiden — sie sind mit ihm an der Wurzel
   geblieben, während Tokens und Basis-CSS zum Produkt gewandert sind. */
import "../../../src/styles/components.css";
import "../../../src/styles/sections.css";

import { init } from "./init.js";

export { init };

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
