/**
 * Entry-Point des Prototyps: globale Stile plus Selbststart.
 *
 * Die Modulliste liegt in init.js, damit die Astro-App daneben dieselbe
 * Initialisierung nutzen kann, ohne die globalen Stylesheets mitzuziehen —
 * dort gehören die Komponentenstile in die Komponenten.
 */
import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/components.css";
import "../styles/sections.css";

import { init } from "./init.js";

export { init };

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
