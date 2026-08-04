/**
 * Nur damit `sanity typegen generate` vom Projektstamm aus läuft.
 *
 * TypeGen braucht eine Projektwurzel und erkennt sie an genau dieser Datei.
 * Ohne sie bricht es mit `ProjectRootNotFoundError` ab — auch dann, wenn man
 * ihm über `sanity-typegen.json` alle Pfade ausdrücklich gibt. Gemessen,
 * nicht vermutet: Der Schema-Auszug lief bereits, erst der Typenlauf danach
 * scheiterte.
 *
 * Nötig ist das, weil Schema und Abfragen in verschiedenen Ordnern liegen —
 * das Schema in `studio/`, die Abfragen in `web/src/lib/`, bei der Seite, die
 * sie benutzt. Genau diese Aufteilung soll bleiben.
 *
 * `.js` und ohne `defineCliConfig`: Der Helfer käme aus `sanity/cli`, und das
 * Paket liegt nur im Studio. Von hier aus ist es nicht auflösbar — die Datei
 * scheiterte dann beim Laden statt beim Suchen. Der Helfer prüft ohnehin nur
 * Typen; das Objekt ist dasselbe.
 *
 * Hier steht deshalb NUR das Nötigste. Das echte CLI-Verhalten für das Studio
 * — Dataset-Import, Deploy, Schema-Extrakt — hängt weiterhin an
 * `studio/sanity.cli.ts`; wer dort etwas ändert, muss hier nichts nachziehen.
 */
export default {
  api: {
    projectId: "a6bjftwf",
    dataset: "production",
  },
};
