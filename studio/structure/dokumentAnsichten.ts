import type { DefaultDocumentNodeResolver } from "sanity/structure";
import { WebVorschau } from "./WebVorschau";

/**
 * Welche Reiter ein Dokument bekommt.
 *
 * Einen Vorschaureiter bekommt, was eine eigene URL hat. Team, Stellen und
 * Einstellungen tauchen auf fremden Seiten auf — für sie gäbe es nichts zu
 * zeigen, und ein leerer Vorschaureiter wäre schlimmer als keiner.
 */
const MIT_SEITE = [
  "startseite",
  "leistung",
  "leistungenIndex",
  "praxis",
  "magazinIndex",
  "beitrag",
  "karriere",
  "kontakt",
  "notdienst",
  "pillar",
  "rechtstext",
];

export const dokumentAnsichten: DefaultDocumentNodeResolver = (S, { schemaType }) => {
  if (MIT_SEITE.includes(schemaType)) {
    return S.document().views([
      S.view.form().title("Inhalt"),
      S.view.component(WebVorschau).title("Vorschau"),
    ]);
  }

  return S.document().views([S.view.form()]);
};
