/**
 * Entry-Point des Prototyps: globale Stile plus Selbststart.
 *
 * Vier Stylesheets aus zwei Richtungen, und die Richtung ist die Aussage:
 * Tokens, Basis-CSS und die Modulliste gehören dem Produkt und werden von
 * dort geliehen; components.css und sections.css benutzt nur dieser Prototyp
 * und liegen deshalb bei ihm.
 *
 * Vor A2 war es umgekehrt — die Astro-App holte ihr Fundament hier ab. Das
 * hieß: wer am „Prototyp" arbeitete, änderte die ausgelieferte Website.
 */
import "../../../../web/src/styles/tokens.css";
import "../../../../web/src/styles/base.css";
import "../styles/components.css";
import "../styles/sections.css";

import { init } from "../../../../web/src/js/init.js";

export { init };

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
