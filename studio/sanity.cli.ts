import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "a6bjftwf",
    dataset: "production",
  },

  /* TypeGen läuft — seit Aufgabe 1 der Umbauliste, gesteuert über
   * `sanity-typegen.json` im Projektstamm und `npm run types`.
   *
   * Hier stand die Begründung, warum es aus sei: Es bleibe in seinem
   * Projektordner, verwerfe Pfade nach `../web` und finde von der Wurzel aus
   * keine Projektwurzel. Das beschrieb ein lösbares Problem — man muss ihm
   * die Pfade nur ausdrücklich geben.
   *
   * Der zweite Teil der alten Begründung ist mit Aufgabe 4 ohnehin
   * hinfällig: Die Typen lägen von Hand in `web/src/lib/fixtures.ts`, weil
   * sie doppelt dienten, als Vertrag UND als Form der Beispieldaten. Diese
   * Doppelrolle gibt es nicht mehr — der Inhalt liegt im CMS, die Datei ist
   * gelöscht, und der Vertrag kommt aus der Abfrage.
   */
});
