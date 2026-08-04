import type { DefaultDocumentNodeResolver } from "sanity/structure";
import { WebVorschau } from "./WebVorschau";

/**
 * Welche Reiter ein Dokument bekommt.
 *
 * Einen Vorschaureiter bekommt, was eine eigene URL hat. Team, Stellen und
 * Einstellungen tauchen auf fremden Seiten auf — für sie gäbe es nichts zu
 * zeigen, und ein leerer Vorschaureiter wäre schlimmer als keiner.
 *
 * Die Liste ist mit Aufgabe 3 von elf auf drei geschrumpft. Die übrigen acht
 * Typen zeigten auf Seiten, die es nicht gibt: Der Reiter öffnete sich, und
 * darin stand eine 404. Sie kommen zurück, sobald ihre Route steht — die
 * Bedingung steht in `structure/index.ts` unter OHNE_ROUTE.
 */
const MIT_SEITE = ["startseite", "leistung", "karriere"];

export const dokumentAnsichten: DefaultDocumentNodeResolver = (S, { schemaType }) => {
  if (MIT_SEITE.includes(schemaType)) {
    return S.document().views([
      S.view.form().title("Inhalt"),
      S.view.component(WebVorschau).title("Vorschau"),
    ]);
  }

  return S.document().views([S.view.form()]);
};
