import { service } from "./service";
import { settings } from "./settings";

import { seo } from "./objects/seo";
import { link } from "./objects/link";
import { picture } from "./objects/picture";
import {
  sectionsArray,
  sectionIntro,
  sectionFacts,
  sectionCompare,
  sectionTimeline,
  sectionVoices,
  sectionStatement,
  sectionSteps,
  sectionPricing,
  sectionFaq,
  sectionContact,
} from "./objects/sections";

import { homepage } from "./documents/homepage";
import {
  servicesIndex,
  magazineIndex,
  contactPage,
} from "./documents/single-pages";
import { careers } from "./documents/careers";
/* Praxis hat einen eigenen Typ, seit sie eine Seite hat: feste Abfolge statt
   Baukasten, wie bei der Karriereseite. */
import { practice } from "./documents/practice";

import { post, pillar, legalPage, person, job } from "./documents/collections";
import { navigation, footer } from "./documents/chrome";

export const schemaTypes = [
  /* Bausteine zuerst — die Dokumente verweisen darauf. Die Reihenfolge ist
     für Sanity egal, für das Lesen nicht. */
  seo,
  picture,
  link,
  sectionIntro,
  sectionFacts,
  sectionCompare,
  sectionTimeline,
  sectionVoices,
  sectionStatement,
  sectionSteps,
  sectionPricing,
  sectionFaq,
  sectionContact,
  sectionsArray,

  /* Einzelseiten */
  homepage,
  servicesIndex,
  practice,
  magazineIndex,
  careers,
  contactPage,
  settings,
  navigation,
  footer,

  /* Sammlungen */
  service,
  post,
  pillar,
  legalPage,
  person,
  job,
];
