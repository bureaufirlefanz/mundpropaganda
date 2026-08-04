import type { Bildquelle } from "./bilder";

/**
 * Beispieldaten in exakt der Form, die die GROQ-Abfrage liefert.
 *
 * Bei den Bildern ist das nur fast wahr: aus dem CMS kommt ein Objekt mit
 * Beschnitt und Bildmittelpunkt, hier stehen Pfade auf lokale Motive. Beides
 * nimmt CmsImage.astro an — deshalb `Bildquelle`.
 */
export interface Eintrag { name: string; text: string; bild: Bildquelle }
/* Die Antwort ist freiwillig — im Studio ist nur die Frage Pflicht. Ein
   Pflichtfeld hier hieße, dass eine halb gepflegte Frage die Seite bricht. */
export interface Frage { frage: string; antwort?: string }
export interface Preis { name: string; preis: string }
export interface Schritt { titel: string; text: string }
export interface FeatureZeile {
  topline: string;
  titel: string;
  text: string;
  /** Name aus der Bildpipeline (public/img), ohne Größe und Endung. */
  bild: string;
  alt?: string;
}

/**
 * Die Typen liegen hier und nicht in den Komponenten: eine .astro-Datei kann
 * nur sich selbst exportieren, keine Typen daneben.
 */
export interface Leistung {
  titel: string;
  seoBeschreibung?: string;
  topline: string;
  hero: { text: string; bild: Bildquelle; alt?: string };
  intro: { topline: string; headline: string; spalten: string[] };
  benefits: { topline: string; headline: string; eintraege: Eintrag[] };
  preise: Preis[];
  faq: Frage[];

  /* Abschnitte, die das Inhaltsmodell noch nicht kennt. Sie stehen deshalb als
     Beispieldaten hier, und die Datenschicht setzt sie ein, wenn das CMS sie
     nicht liefert — sonst wäre die Seite mit einem gepflegten Dokument
     plötzlich halb leer. Wächst das Schema, greifen dieselben Felder. */
  statement?: { topline: string; text: string };
  schritte?: { titel: string; eintraege: Schritt[] };
  features?: FeatureZeile[];
  vorherNachher?: { topline: string; vorher: string; nachher: string };
}

export const beispielLeistung: Leistung = {
  titel: "Veneers",
  topline: "Veneers in Berlin",
  hero: {
    text: "Unser Schwerpunkt sind Veneers und Keramikimplantate. Beides Behandlungen, die wir täglich machen und in denen wir richtig gut sind.",
    bild: "/img/portrait-hero-1600.webp",
    alt: "Patientin lächelt nach der Behandlung",
  },
  intro: {
    topline: "Was Veneers leisten",
    headline: "Kleine Korrektur, großer Unterschied",
    spalten: [
      "Manchmal sorgen schon kleine Details dafür, dass man sich mit seinem Lächeln nicht rundum wohlfühlt. Verfärbungen, leichte Fehlstellungen oder eine ungleichmäßige Zahnform können den Gesamteindruck trüben, auch wenn die Zähne eigentlich gesund sind. In solchen Fällen bieten Veneers eine schonende und ästhetisch überzeugende Lösung.",
      "Je nach Veneer-Art entstehen diese entweder in unserem Praxislabor im Prenzlauer Berg oder in Zusammenarbeit mit spezialisierten Partnerlaboren. Wir passen jeden Zahnersatz millimetergenau an Ihre Zahnform, Ihren Hautton und Ihre persönlichen Wünsche an.",
    ],
  },
  /* Vorteile, nicht Bauarten. Die Einträge beantworten „was habe ich davon",
     nicht „welche Sorten gibt es" — die Sorten stehen in den Kosten und in
     den Feature-Zeilen. */
  benefits: {
    topline: "Vorteile",
    headline: "Was Veneers Ihnen bringen",
    eintraege: [
      { name: "Maximaler Zahnerhalt", bild: "/img/treatment-01-1600.webp",
        text: "Wir tragen nur so viel Substanz ab, wie für Passform und Ästhetik nötig ist - bei Non-Prep-Veneers gar nichts. Was einmal weg ist, kommt nicht wieder; deshalb ist Zurückhaltung hier kein Sparen, sondern Handwerk." },
      { name: "Ergebnis vorher sehen", bild: "/img/lab-veneers-1024.webp",
        text: "Aus dem Intraoralscan entsteht ein Mock-up zum Probetragen. Sie beurteilen Form und Farbe im Spiegel, im Tageslicht und auf Fotos, bevor ein Zahn berührt wird." },
      { name: "Farbe, die bleibt", bild: "/img/teeth-macro-1024.webp",
        text: "Keramik nimmt keine Verfärbungen an - Kaffee, Tee und Rotwein ändern daran nichts. Die Zielfarbe legen wir vorher gemeinsam fest, denn nachbleichen lässt sie sich nicht." },
    ],
  },
  preise: [
    { name: "Komposit-Veneers", preis: "€ 450,– / Zahn" },
    { name: "Keramikveneers", preis: "€ 890,– / Zahn" },
    { name: "Non-Prep-Veneers", preis: "€ 950,– / Zahn" },
    { name: "Digitale Planung", preis: "€ 190,– pauschal" },
  ],
  faq: [
    {
      frage: "Was sind Veneers?",
      antwort:
        "Veneers sind hauchdünne Verblendschalen aus Keramik oder Komposit, die dauerhaft auf die sichtbare Zahnoberfläche aufgeklebt werden. Sie dienen dazu, Form, Farbe oder Stellung der Zähne optisch zu korrigieren - ohne große Eingriffe und bei maximaler Schonung der Zahnhartsubstanz.",
    },
    {
      frage: "Wie läuft eine Behandlung mit Veneers ab?",
      antwort:
        "In vier Terminen: Beratung mit Analyse, digitales Mock-up zum Probetragen, Fertigung im Labor und schließlich das Einsetzen. Zwischen Abformung und Einsetzen liegen je nach Veneer-Art zehn bis vierzehn Tage.",
    },
    {
      frage: "Wie lange halten Veneers?",
      antwort:
        "Keramik-Veneers halten bei guter Pflege fünfzehn Jahre und länger, oft ein Leben lang. Entscheidend sind Mundhygiene, regelmäßige Prophylaxe und der Verzicht auf nächtliches Knirschen - dafür gibt es bei Bedarf eine Schiene.",
    },
    {
      frage: "Was muss ich bei Veneers beachten?",
      antwort:
        "Wenig. Keine harten Gegenstände öffnen, keine Nägel kauen, sonst normal essen und putzen. Bleaching wirkt auf Keramik nicht - deshalb bestimmen wir die Zielfarbe vor der Fertigung.",
    },
    {
      frage: "Welche Veneers gibt es?",
      antwort:
        "Composite-Veneers werden direkt am Stuhl modelliert, Keramik-Veneers im Labor geschichtet, Non-Prep-Veneers kommen ganz ohne Beschleifen aus. Welche Variante passt, zeigt sich in der Analyse - nicht am Preis.",
    },
    {
      frage: "Warum sind Veneers in der Türkei so viel günstiger?",
      antwort:
        "Weil dort häufig Kronen statt Veneers gesetzt werden, wofür deutlich mehr Zahnsubstanz abgetragen wird. Der Preisunterschied entsteht am Zahn, nicht am Wechselkurs. Nachbesserungen und Folgekosten fallen dann hier an.",
    },
  ],

  vorherNachher: {
    topline: "Vorher & Nachher",
    vorher: "teeth-macro",
    nachher: "teeth-macro-after",
  },

  statement: {
    topline: "Zahnerhalt",
    text: "Wir tragen nur so viel Zahnhartsubstanz ab, wie für Passform und Ästhetik unbedingt nötig ist. Durch präzise digitale Planung und die Zusammenarbeit mit unserem Praxislabor entstehen natürliche Ergebnisse bei maximalem Zahnerhalt. Bei guter Pflege können unsere Veneers ein Leben lang halten.",
  },

  schritte: {
    titel: "In vier Schritten zu neuen Veneers",
    eintraege: [
      {
        titel: "Vorbereitung und Beratung.",
        text: "Wir besprechen Ihre Wünsche, prüfen Zahn- und Zahnfleischzustand, analysieren Form, Farbe und Stellung und nehmen Fotos auf. Vor der Behandlung erfolgt eine professionelle Zahnreinigung.",
      },
      {
        titel: "Digitales Mock-up.",
        text: "Aus dem Intraoralscan entsteht ein Entwurf, den Sie vorab im Mund tragen können. Erst wenn das Ergebnis überzeugt, gehen wir weiter - vorher wird kein Zahn berührt.",
      },
      {
        titel: "Fertigung im Labor.",
        text: "Unsere Zahntechnikerinnen schichten jedes Veneer einzeln auf. Farbe und Transluzenz werden am Behandlungsstuhl abgestimmt, nicht nach Farbring aus dem Katalog.",
      },
      {
        titel: "Einsetzen und Nachsorge.",
        text: "Die Veneers werden adhäsiv befestigt und final poliert. Nach zwei Wochen sehen wir uns wieder, danach genügt die reguläre Prophylaxe.",
      },
    ],
  },

  features: [
    {
      topline: "Schritt 01",
      titel: "Vorbereitung und Beratung",
      text: "Wir nehmen uns eine volle Stunde. Erst danach reden wir über Material und Preis - nicht umgekehrt. Wer nach dem Gespräch merkt, dass Veneers nicht die richtige Antwort sind, bekommt das auch so gesagt.",
      bild: "treatment-02",
      alt: "Beratungsgespräch",
    },
    {
      topline: "Schritt 02",
      titel: "Mock-up",
      text: "Ein Entwurf zum Probetragen, direkt auf den unbehandelten Zähnen. Sie sehen das Ergebnis im Spiegel, im Tageslicht und auf Fotos, bevor irgendetwas endgültig ist.",
      bild: "lab-veneers",
      alt: "Veneers im Praxislabor",
    },
    {
      topline: "Schritt 03",
      titel: "Einsetzung Veneers",
      text: "Adhäsiv befestigt, Rand für Rand poliert. Der Termin dauert länger als anderswo, weil wir jede Kante einzeln kontrollieren. Das merkt man später an der Zunge.",
      bild: "treatment-03",
      alt: "Einsetzen der Veneers",
    },
  ],
};
