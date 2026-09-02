import { sanityClient } from "sanity:client";
import { withoutNull } from "./without-null";
import { HOMEPAGE_QUERY } from "./queries";
import type { ImageSource } from "./images";
import type { LinkValue } from "./navigation";
import { fallbackFor } from "./loading";

/**
 * Die Inhalte der Startseite aus dem CMS.
 *
 * Bis Aufgabe 4 war hier alles wahlfrei, und was fehlte, ließen die Bausteine
 * durch ihre eigenen Vorgaben ersetzen. Das ist abgeschafft: Ein Feld, das die
 * Redaktion leert, VERSCHWINDET von der Seite. Nichts tritt an seine Stelle.
 *
 * Die Klassifizierung steht in diesem Vertrag und ist an ihm ablesbar:
 *
 *   `feld: T`   Klasse 1 — trägt die Seite. Im Schema `required()`, das Studio
 *               verweigert den Publish ohne. Der Baustein darf sich darauf
 *               verlassen und hat keine Vorgabe mehr.
 *   `feld?: T`  Klasse 2 — wahlfrei. Fehlt es, blendet der Baustein die Stelle
 *               aus. Kein Ersatz.
 *
 * Klasse 3 kommt hier nicht vor: Was nie gepflegt wird, hat gar kein Feld und
 * steht fest im Baustein.
 *
 * Bilder sind die bewusste Ausnahme in Klasse 2. Sie fallen weiter auf das
 * gestaltete Motiv aus der lokalen Bildpipeline zurück, statt den Abschnitt
 * auszublenden — der Kunde hat dieses Foto nie getippt. Ein leeres Bildfeld
 * heißt „noch nicht hochgeladen“, nicht „bewusst gelöscht“.
 */

export interface HomepageContent {
  heroLines: string[];

  splitTopline: string;
  splitTitle: string;
  splitParagraphs: string[];
  splitImage?: ImageSource;

  servicesTitle: string;

  standardsTitle: string;
  /* Das Motiv hängt am Punkt: Die Zahnmaske zeigt zu jedem Punkt ein anderes
     Bild und blendet beim Weiterwandern um. */
  standardsItems: { name: string; text?: string; image?: ImageSource }[];

  locationsTitle: string;
  locationsImages?: { image: ImageSource; caption?: string }[];

  expertsTitle: string;
  expertsNames: string;
  expertsParagraphs: string[];
  expertsImage?: ImageSource;

  storiesItems: { name: string; image?: ImageSource; quote?: string }[];
  /* Der Knopf unter dem Zitat. Ohne Verweis steht dort keiner — vorher stand
     dort einer mit `href="#"`. Die Form kommt aus lib/navigation.ts. */
  storiesAction?: LinkValue;

  magazineTopline: string;
  magazineTitle: string;
  magazineText: string;

  faqTitle: string;
  faqText?: string;
  faq: { question: string; answer?: string }[];

  /**
   * Suchmaschinen- und Teilen-Angaben. Kein sichtbarer Seiteninhalt, deshalb
   * gilt die Regel der Aufgabe hier nicht: Ein Dokument ohne `<title>` ist
   * kaputt, nicht leer. Fehlt der Titel, nimmt die Seite ihren eigenen — genau
   * das sagt das Schema dem Kunden auch zu.
   */
  seo?: {
    title?: string;
    description?: string;
    noIndex?: boolean;
    image?: ImageSource;
  };
}

/* Die Felder der Klasse 1, aufgeteilt nach ihrer leeren Form. Diese beiden
   Listen sind die einzige Stelle, an der die Zusage „das Feld ist da“
   eingelöst wird — der Rest der Anwendung liest sie am Vertrag oben ab.

   Warum überhaupt auffüllen, wo das Schema `required()` sagt: Sanity kann den
   Publish verweigern, aber der Build liest ein Dataset, nicht das Studio. Ein
   vor der Regel angelegtes Dokument, ein Import, ein von Hand gelöschtes Feld
   — in all diesen Fällen fehlt der Wert trotzdem. Dann steht die Stelle LEER
   da. Genau das ist der Sinn der Aufgabe: sichtbar nichts, statt eines
   Satzes, den niemand mehr im Studio findet. */
const REQUIRED_TEXT = [
  "splitTopline",
  "splitTitle",
  "servicesTitle",
  "standardsTitle",
  "locationsTitle",
  "expertsTitle",
  "expertsNames",
  "magazineTopline",
  "magazineTitle",
  "magazineText",
  "faqTitle",
] as const;

const REQUIRED_LIST = [
  "heroLines",
  "splitParagraphs",
  "standardsItems",
  "expertsParagraphs",
  "storiesItems",
  "faq",
] as const;

/* Einmal je Build. Die Seite besteht aus einem Dutzend Bausteinen, die alle
   aus demselben Dokument lesen — ohne das Merken wäre es ein Dutzend
   Abfragen für eine Antwort. */
let cached: Promise<HomepageContent> | null = null;

export function loadHomepage(): Promise<HomepageContent> {
  cached ??= sanityClient
    .fetch(HOMEPAGE_QUERY)
    .then(withoutNull)
    .then((d) => fillRequired(saeubere(d ?? {})))
    .catch(fallbackFor("die Startseite", fillRequired({})));

  return cached;
}

/**
 * Leere Zeichenketten und leere Listen wie fehlende Felder behandeln.
 *
 * Ein Feld, das im Studio angefasst und wieder geleert wurde, kommt als `""`
 * an und nicht als `undefined`. Ohne diese Reinigung wäre der Unterschied
 * zwischen „nie gepflegt“ und „bewusst geleert“ im Frontend sichtbar, obwohl
 * er für die Seite keiner ist.
 */
function saeubere(d: object): Record<string, unknown> {
  const raus: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(d as Record<string, unknown>)) {
    if (v === null || v === undefined || v === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    raus[k] = v;
  }
  return raus;
}

/** Die Zusage der Klasse 1 einlösen: Das Feld ist da — notfalls leer. */
function fillRequired(d: Record<string, unknown>): HomepageContent {
  for (const k of REQUIRED_TEXT) d[k] ??= "";
  for (const k of REQUIRED_LIST) d[k] ??= [];
  return d as unknown as HomepageContent;
}
