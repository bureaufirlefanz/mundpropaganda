/**
 * Veneers, copy review after Hannes' feedback (agency template
 * "JM_..._nach Hannes Feedback angepasst").
 *
 * Veneers is already live (see `scripts/veneers-content.mjs`). This file only
 * sets what differs between the new document and the published state, using
 * key paths so uploaded images on benefits, steps and features survive.
 * `pricing` and `faq` are replaced whole (no images); the FAQ keeps its keys,
 * `f4` was reserved for "Tut die Behandlung weh?".
 */
export default {
  id: "service-veneers",
  type: "service",
  source: "JM_MP_LS_01_Veneers_Copy_nach Hannes Feedback angepasst.docx",

  set: {
    "hero.text":
      "Veneers sind hauchdünne Keramik- oder Kompositschalen, mit denen wir in Berlin täglich natürlich-strahlende Lächeln schaffen. Jede Korrektur stimmen wir genau auf dich ab und achten dabei auf den Erhalt deiner gesunden Zahnhartsubstanz. Hannes und Kerrin, unsere Spezialist:innen, lernst du schon im ersten Gespräch kennen.",

    "intro.topline": "Kleine Lücke, große Wirkung",
    "intro.headline": "Für wen eignen sich Veneers?",
    "intro.columns": [
      "Oft ist es nur eine leichte Verfärbung, Zahnform oder Lücke, die dich beim Lachen zögern oder auf Fotos die Lippen zusammenkneifen lässt. Und das, obwohl deine Zähne völlig gesund sind.",
      "Wir nehmen das ernst und wollen dir beides zurückgeben: Veneers können kleine Unstimmigkeiten ohne große Eingriffe ausgleichen und dich wieder befreit lachen lassen, ohne dabei gesunde Substanz zu riskieren. Als Expert:innen raten wir aber auch mal ehrlich davon ab, wenn eine andere Lösung besser zu dir passt oder eine simple Farbkorrektur mit Bleaching in Berlin reicht.",
    ],

    "benefits.headline": "Welche Arten von Veneers gibt es?",
    'benefits.items[_key=="e1"].text':
      "Die gebräuchlichste Verblendschale, aus lichtdurchlässiger Keramik gefertigt. Sie bricht das Licht wie ein echter Zahn und lässt sich kaum vom Original unterscheiden. Ideal bei stärkeren Verfärbungen oder größeren Formkorrekturen und bei guter Pflege besonders langlebig.",
    'benefits.items[_key=="e2"].text':
      "Wir arbeiten mit der F.I.T.-Injektionstechnik: Aus dem digitalen Modell deines Wunschlächelns entsteht eine transparente Form, in die wir das Komposit präzise einbringen, gleichmäßiger als freihändiges Modellieren. Nach dem Planungstermin (Scan) erfolgt das Einsetzen dann in einer Sitzung.",
    'benefits.items[_key=="e3"].text':
      "Diese Keramikschalen sind nur 0,2 bis 0,3 Millimeter dünn und kommen meist ohne oder mit minimaler Bearbeitung durch Polieren oder Glätten von Kanten aus. Ideal, wenn ohnehin Platz vorhanden ist, etwa bei kleinen Zähnen oder Lücken. Da die Indikation eng ist, prüfen wir vorab, ob deine Zähne dafür optimal sind.",

    "explainer.topline": "Unser Wort steht",
    "explainer.headline": "Abgeschliffene Zähne? Nicht bei uns",

    "steps.title": "Wie läuft die Behandlung ab?",
    'steps.items[_key=="schritt-0"].title': "Vorbereitung: Abdruck war gestern",
    'steps.items[_key=="schritt-1"].title': "Mock-up: Probelächeln für später",
    'steps.items[_key=="schritt-2"].title': "Präparation: Feinschliff mit Maß",
    'steps.items[_key=="schritt-2"].text':
      "Nun bereiten wir deine Zähne schonend vor, idealerweise nach einer professionellen Zahnreinigung. Dafür wird die Oberfläche, außer bei Non-Prep-Veneers, minimal beschliffen.",
    'steps.items[_key=="schritt-3"].title': "Einsetzen: Natürlich Zähne zeigen",
    'steps.items[_key=="schritt-3"].text':
      "Deine im Labor maßgefertigten Veneers werden präzise eingesetzt und final angepasst. Passt etwas noch nicht, gibt es weitere Einproben. Passt alles, kommst du eine Woche später zur 30-minütigen Nachsorge.",

    pricing: [
      {
        _key: "p1",
        _type: "price",
        name: "Komposit-Veneer",
        price: "ab € 450,– / Zahn",
      },
      {
        _key: "p2",
        _type: "price",
        name: "Keramikveneer",
        price: "ab € 1.500,– / Zahn",
      },
    ],

    'features[_key=="feature-0"].title': "Beratung geht vor",
    'features[_key=="feature-0"].text':
      "Zu Beginn hören wir dir erstmal zu: Wie können wir dir helfen, was stört dich, was wünschst du dir? Anschließend suchen wir gemeinsam nach passenden Lösungen und stimmen Materialien sowie Kosten mit dir ab. Beim Ergebnis soll dir ja schon der Mund offen bleiben, aber eben nur, weil du nicht mehr aufhören kannst zu strahlen.",
    'features[_key=="feature-1"].text':
      "Sobald Art, Form und Ton feststehen, geht es an die Präzisionsarbeit im Labor. Als Zahnärzt:innen arbeiten wir mit Mikrometern, einem Tausendstel Millimeter, dünner als ein menschliches Haar. Um deine Veneers bis ins letzte Detail abzustimmen, stellen wir sie in unserem eigenen Praxislabor im Prenzlauer Berg her oder arbeiten mit spezialisierten Partnerlaboren zusammen. Wer nach deinem Lächeln fragt, wird keine Kopie bekommen.",
    'features[_key=="feature-2"].topline': "Keine halben Sachen",
    'features[_key=="feature-2"].title': "Haltbarkeit deiner Veneers",
    'features[_key=="feature-2"].text':
      "Dein neues Strahlen kann sich jetzt festhalten: Bei guter Pflege halten Komposit-Veneers rund fünf bis sieben Jahre und Keramikveneers oft ein Leben lang. Beide Varianten sind Lösungen, bei denen wir für dich gerne aufs Ganze gehen.",

    faq: [
      {
        _key: "f1",
        _type: "questionAnswer",
        question: "Was zahlt die Krankenkasse bei Veneers?",
        answer:
          "Die gesetzliche Krankenkasse übernimmt keine Kosten, da Veneers eine rein ästhetische Leistung sind. Manche privaten Zusatzversicherungen beteiligen sich anteilig. Am besten checkst du das vorab mit deiner Versicherung.",
      },
      {
        _key: "f2",
        _type: "questionAnswer",
        question: "Wie lange halten Veneers?",
        answer:
          "Bei guter Pflege können Keramikveneers oft ein Leben lang halten, während Komposit-Veneers das meist 5 bis 7 Jahre tun. In jedem Fall eine Entscheidung, von der du lange profitieren wirst.",
      },
      {
        _key: "f3",
        _type: "questionAnswer",
        question: "Wie viele Termine brauche ich für Veneers?",
        answer:
          "Wir planen vier Termine plus Nachsorge für dich ein: Kennenlernen, Mock-up-Anprobe, Präparation und Einsetzen. Die Dauer hängt jeweils von Art und Menge deiner Veneers ab. Wir nehmen uns die Zeit, die du brauchst.",
      },
      {
        _key: "f4",
        _type: "questionAnswer",
        question: "Tut die Behandlung weh?",
        answer:
          "Das ist sehr individuell und wird immer zu Beginn mit dir abgeklärt. Non-Prep-Veneers setzen wir meistens ohne Betäubung ein, da hier keine Schmerzen zu erwarten sind. Werden deine Zähne minimal vorbereitet, empfehlen wir eine lokale Anästhesie. Mit dem Provisorium und nach dem Einsetzen hilft ein leichtes Schmerzmittel wie Ibuprofen über die ersten empfindlichen Tage.",
      },
      {
        _key: "f5",
        _type: "questionAnswer",
        question: "Kann ich das Ergebnis vorher sehen?",
        answer:
          "Ja, und zwar schon bevor es losgeht. Mit einem Mock-up siehst du Form, Farbe und Ausdruck deines neuen Lächelns und kannst es vorab testen. Erst wenn alles passt, beginnt die tatsächliche Anfertigung.",
      },
      {
        _key: "f6",
        _type: "questionAnswer",
        question: "Woran erkenne ich eine gute Praxis für Veneers in Berlin?",
        answer:
          "Eine gute Praxis für Veneers in Berlin zeigt dir dein Ergebnis vorab, schont deine Zahnsubstanz und sagt dir ehrlich, wenn eine andere Lösung besser passt. Ein eigenes Praxislabor ist dabei ein starkes Qualitätsmerkmal.",
      },
    ],
  },

  notes: [
    "Unchanged and not set: hero claim and button label, benefits topline and item names, statement, explainer text, steps texts 0 and 1, all step durations, pricingTitle, feature 0 and 1 toplines, feature 1 title, FAQ 1, 3, 5, 6 (FAQ is replaced whole only to add f4 and update f2).",
    "steps.title follows the mapping (H2 instead of the kicker 'Alle guten Dinge sind vier', which the live page used); drop the line to keep the kicker.",
    "Benefits item 1: stray 'sind' removed ('... größeren Formkorrekturen und sind bei guter Pflege ...').",
    "Benefits are marked OFFEN for length (150 against 95 words); taken as before, precision over word count.",
    "Pricing reduced to two rows on Hannes' request (C13): Non-Prep, Mock-up and Digitale Planung removed. The pillar page content may still list them. Module header OFFEN, overview ENTWURF.",
    "FAQ 4 'Tut die Behandlung weh?' added under the reserved key f4. Marked 'Vorschlag nach Hannes Feedback'; the agency asked Hannes to check (C19), no answer in the document. Names a drug (Ibuprofen).",
    "Step 4 duration repeats the 30 minutes now in the text; the agency suggests dropping it (C12). Live duration kept.",
    "Intro kicker variant 'Minimaler Eingriff, maximale Wirkung' not used.",
    "Hero button: alternative 'Lass uns sprechen' not used.",
    "Cross-link sentence under the benefits differs from web/src/content/service-crosslinks.ts (repository, not CMS).",
    "beforeAfter not touched: live topline 'Vorher vs. Nachher', the document has H2 'Veneers vorher / nachher' and the slider hint 'Ziehe fürs Ergebnis'.",
    "No meta box in this document; seo not set.",
    "Contact text not imported (no field): 'Noch unsicher, welche Veneer-Art zu dir passt? Lass uns einfach sprechen.' CTA 'Jetzt sprechen!'.",
    "Link anchors (Bleaching in Berlin, professionellen Zahnreinigung, unserem eigenen Praxislabor) stay plain text.",
  ],
};
