import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "a6bjftwf",
    dataset: "production",
  },

  /* TypeGen ist hier bewusst aus.
   *
   * Es erzeugt Typen aus Schema und Abfragen — nur bleibt es dabei in seinem
   * Projektordner: Pfade nach `../web` verwirft es, und von der Wurzel aus
   * findet es keine Projektwurzel. Es liefe also nur mit einer zweiten
   * sanity.cli.ts an der Wurzel oder indem die Abfragen hierher wandern, weg
   * von der Seite, die sie benutzt.
   *
   * Beides kostet mehr, als es bringt: die Typen in web/src/lib/fixtures.ts
   * sind von Hand geschrieben, weil sie doppelt dienen — als Vertrag für die
   * Abfrage und als Form der Beispieldaten, die einspringen, wenn im CMS noch
   * nichts liegt. Erzeugte Typen könnten das zweite nicht. Bei deutlich mehr
   * Collections lohnt die Umstellung; bei einer nicht.
   */
});
