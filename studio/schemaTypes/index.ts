import { leistung } from "./leistung";
import { einstellungen } from "./einstellungen";

import { seo } from "./objekte/seo";
import { bild } from "./objekte/bild";
import {
  abschnitte,
  abschnittIntro,
  abschnittFacts,
  abschnittCompare,
  abschnittTimeline,
  abschnittVoices,
  abschnittStatement,
  abschnittSchritte,
  abschnittPreise,
  abschnittFaq,
  abschnittKontakt,
} from "./objekte/abschnitte";

import { startseite } from "./dokumente/startseite";
import {
  leistungenIndex,
  praxis,
  magazinIndex,
  karriere,
  kontakt,
  notdienst,
} from "./dokumente/einzelseiten";

import { beitrag, pillar, rechtstext, person, stelle } from "./dokumente/sammlungen";

export const schemaTypes = [
  /* Bausteine zuerst — die Dokumente verweisen darauf. Die Reihenfolge ist
     für Sanity egal, für das Lesen nicht. */
  seo,
  bild,
  abschnittIntro,
  abschnittFacts,
  abschnittCompare,
  abschnittTimeline,
  abschnittVoices,
  abschnittStatement,
  abschnittSchritte,
  abschnittPreise,
  abschnittFaq,
  abschnittKontakt,
  abschnitte,

  /* Einzelseiten */
  startseite,
  leistungenIndex,
  praxis,
  magazinIndex,
  karriere,
  kontakt,
  notdienst,
  einstellungen,

  /* Sammlungen */
  leistung,
  beitrag,
  pillar,
  rechtstext,
  person,
  stelle,
];
