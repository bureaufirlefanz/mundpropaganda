import { leistung } from "./leistung";
import { einstellungen } from "./einstellungen";

import { seo } from "./objekte/seo";
import { link } from "./objekte/link";
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
  kontakt,
  notdienst,
} from "./dokumente/einzelseiten";
import { karriere } from "./dokumente/karriere";

import { beitrag, pillar, rechtstext, person, stelle } from "./dokumente/sammlungen";
import { navigation, footer } from "./dokumente/rahmen";

export const schemaTypes = [
  /* Bausteine zuerst — die Dokumente verweisen darauf. Die Reihenfolge ist
     für Sanity egal, für das Lesen nicht. */
  seo,
  bild,
  link,
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
  navigation,
  footer,

  /* Sammlungen */
  leistung,
  beitrag,
  pillar,
  rechtstext,
  person,
  stelle,
];
