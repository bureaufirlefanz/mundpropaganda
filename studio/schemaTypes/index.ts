import { leistung } from "./service";
import { einstellungen } from "./settings";

import { seo } from "./objects/seo";
import { link } from "./objects/link";
import { bild } from "./objects/picture";
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
} from "./objects/sections";

import { startseite } from "./documents/homepage";
import {
  leistungenIndex,
  magazinIndex,
  kontakt,
  notdienst,
} from "./documents/single-pages";
import { karriere } from "./documents/careers";
/* Praxis hat einen eigenen Typ, seit sie eine Seite hat: feste Abfolge statt
   Baukasten, wie bei der Karriereseite. */
import { praxis } from "./documents/practice";

import { beitrag, pillar, rechtstext, person, stelle } from "./documents/collections";
import { navigation, footer } from "./documents/chrome";

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
