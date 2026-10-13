/**
 * Aligner — third draft, Hannes' answers of 06 and 11.10.2026.
 *
 * Mapping as in `wurzelbehandlung.mjs`. Headline variant A and H3 set 1 are
 * the ones marked "eingesetzt". The document has no "Übergang", so no
 * explainer. s-ba has material, but is not set (see notes).
 */
export default {
  id: "service-aligner",
  type: "service",
  source: "MP_LS_08_Aligner_v3_2026-10-11.docx",

  set: {
    "hero.claim": "Erst merkt es keiner. Dann sieht es jeder.",
    "hero.text":
      "Die Zähne standen schon in der Schulzeit schief, eine Spange kam nicht infrage. Mit Alignern lässt sich das als Erwachsene nachholen: durchsichtige Schienen, die im Alltag kaum auffallen, und am Ende eine gerade Front, die auffällt.",
    "hero.actionLabel": "Jetzt beraten lassen",

    intro: {
      topline: "Schiene für Schiene",
      headline: "Was sind Aligner und wie funktionieren sie?",
      columns: [
        "Du bekommst eine Serie durchsichtiger Schienen, jede minimal anders geformt als die vorherige. Jede sitzt zwei Wochen und schiebt deine Zähne ein kleines Stück weiter. Getragen wird sie möglichst 23 Stunden am Tag: Raus kommt sie zum Essen und zum Zähneputzen.",
        "Wie viele Schienen es werden, entscheidet sich nach dem Scan: Je weiter die Zähne wandern müssen, desto länger die Serie.",
      ],
    },

    benefits: {
      topline: "Nicht für jeden",
      headline: "Für wen eignen sich Aligner?",
      items: [
        {
          _key: "b1",
          _type: "item",
          name: "Engstand, Lücken, schiefe Front",
          text: "Leichte bis mittelgradige Fehlstellungen: Engstand, Lücken, leicht verschobene Frontzähne. Das ist der Bereich, in dem Aligner zuverlässig arbeiten.",
        },
        {
          _key: "b2",
          _type: "item",
          name: "Wo wir abraten",
          text: "Ein massiver Überbiss, ein Kreuzbiss oder ein offener Biss lässt sich mit Alignern nicht beheben. Dann sagen wir dir das und nennen dir eine kieferorthopädische Praxis.",
        },
        {
          _key: "b3",
          _type: "item",
          name: "Warum der Retainer dazugehört",
          text: "Nach der Behandlung brauchst du immer einen Retainer, als Draht oder als Schiene. Ohne ihn wandern die Zähne zurück. Das ist keine Option, sondern Teil der Behandlung.",
        },
      ],
    },

    statement: {
      topline: "Unserem Ruf voraus",
      text: "Die Schienen plant der Hersteller, die Zwischenkontrollen laufen über einen Handyscan, den du selbst machst. Bei uns passiert das, was keine App übernimmt: Wir kleben die Attachments auf, schaffen Platz, wo die Zähne keinen haben, und entscheiden, ob Aligner für deinen Fall überhaupt taugen.",
    },

    steps: {
      title: "Wie läuft die Aligner-Behandlung ab?",
      items: [
        {
          _key: "s1",
          _type: "schritt",
          title: "Scan und Planfreigabe",
          text: "Wir scannen deine Zähne digital. Die Planung macht der Hersteller. Wir gehen sie mit dir durch und geben sie erst frei, wenn sie passt. Am Bildschirm siehst du vorher, was am Ende herauskommt.",
        },
        {
          _key: "s2",
          _type: "schritt",
          title: "Schienen anfertigen",
          text: "Danach wird deine Serie produziert. Ist sie da, besprechen wir den Wechselplan und du startest.",
        },
        {
          _key: "s3",
          _type: "schritt",
          title: "Tragen, wechseln, scannen",
          text: "Alle zwei Wochen nimmst du die nächste Schiene. Zwischendurch scannst du dich selbst mit dem Handy: So sehen wir, ob alles nach Plan läuft. In die Praxis kommst du nur, wenn es nötig ist.",
        },
        {
          _key: "s4",
          _type: "schritt",
          title: "Retainer",
          text: "Zum Schluss bekommst du einen Retainer, damit das Ergebnis bleibt. Draht hinter den Zähnen oder Schiene für die Nacht.",
        },
      ],
    },

    pricingTitle: "Was kostet eine Aligner-Behandlung?",
    pricing: [
      {
        _key: "p1",
        _type: "price",
        name: "Planung mit Intraoralscan",
        price: "ab € 210,–",
      },
      {
        _key: "p2",
        _type: "price",
        name: "Leichte Korrektur, ein Kiefer",
        price: "ab € 2.000,–",
      },
      {
        _key: "p3",
        _type: "price",
        name: "Leichte Korrektur, beide Kiefer",
        price: "ab € 3.000,–",
      },
      {
        _key: "p4",
        _type: "price",
        name: "Mittlere Korrektur, ein Kiefer",
        price: "ab € 3.000,–",
      },
      {
        _key: "p5",
        _type: "price",
        name: "Mittlere Korrektur, beide Kiefer",
        price: "ab € 5.000,–",
      },
      {
        _key: "p6",
        _type: "price",
        name: "Komplexe Korrektur, beide Kiefer",
        price: "ab € 6.000,–",
      },
      { _key: "p7", _type: "price", name: "Retainer", price: "ab € 367,–" },
    ],
    pricingNote:
      "Die gesetzliche Kasse übernimmt bei Erwachsenen keine Aligner. Private Versicherungen beteiligen sich oft. Frag dort vorher nach.",

    features: [
      {
        _key: "f1",
        _type: "featureZeile",
        topline: "Mund auf, Ohren auf",
        title: "Beratung geht vor",
        text: "Zu Beginn hören wir dir erstmal zu: Wie können wir dir helfen, was stört dich, was wünschst du dir? Anschließend suchen wir gemeinsam nach passenden Lösungen und stimmen Materialien sowie Kosten mit dir ab. Am Ende soll dir schließlich nur aus einem Grund der Mund offen bleiben: deinem gesunden, strahlenden Lächeln.",
      },
      {
        _key: "f2",
        _type: "featureZeile",
        topline: "Erst scannen, dann versprechen",
        title: "Unsere Planung",
        text: "Bevor wir über Dauer und Kosten reden, scannen wir. Dann siehst du, was mit Alignern geht, und was nicht.",
      },
      {
        _key: "f3",
        _type: "featureZeile",
        topline: "Keine halben Sachen",
        title: "Haltbarkeit deines Ergebnisses",
        text: "Der Retainer ist kein Zusatzverkauf, sondern der letzte Behandlungsschritt. Ohne ihn war alles davor eine Zwischenlösung.",
      },
    ],

    faq: [
      {
        _key: "q1",
        _type: "questionAnswer",
        question: "Wie lange dauert eine Aligner-Behandlung?",
        answer:
          "Vier bis zwölf Monate, je nachdem, wie weit die Zähne wandern müssen. Nach dem Scan sagen wir dir, womit du rechnen kannst.",
      },
      {
        _key: "q2",
        _type: "questionAnswer",
        question: "Aligner oder feste Zahnspange, was ist besser?",
        answer:
          "Kommt auf die Fehlstellung an. Aligner sind unauffälliger und herausnehmbar, kommen aber bei stärkeren Fehlstellungen an ihre Grenze. Dann ist die feste Spange die ehrlichere Lösung.",
      },
      {
        _key: "q3",
        _type: "questionAnswer",
        question: "Zahlt die Krankenkasse Aligner?",
        answer:
          "Bei Erwachsenen nicht. Private Versicherungen übernehmen häufig einen Teil. Das lohnt sich vorab zu klären.",
      },
      {
        _key: "q4",
        _type: "questionAnswer",
        question: "Was ist der Unterschied zu Invisalign?",
        answer:
          "Invisalign ist ein Markenname unter mehreren Aligner-Systemen. Wir arbeiten mit Airflow Aligner. Das Prinzip ist bei allen dasselbe: durchsichtige Schienen, die die Zähne in kleinen Schritten bewegen.",
      },
      {
        _key: "q5",
        _type: "questionAnswer",
        question: "Gibt es Aligner auch für Kinder und Jugendliche?",
        answer:
          "Bei Jugendlichen ab etwa 14 Jahren machen wir das, allerdings als Privatleistung. Die gesetzliche Kasse zahlt kieferorthopädische Behandlungen nur in einer dafür zugelassenen KFO-Praxis, und die sind wir nicht. Der häufigste Fall bei uns: Die Kasse hat eine Spange abgelehnt, und es soll trotzdem gemacht werden.",
      },
    ],

    seo: {
      _type: "seo",
      title: "Aligner Berlin – unsichtbare Zahnspange / Mundpropaganda",
      description:
        "Aligner in Berlin: unsichtbare Zahnschienen für Erwachsene. Zahnkorrektur mit Scan und 3D-Planung im Prenzlauer Berg. Jetzt Beratungstermin vereinbaren.",
    },
  },

  notes: [
    "Agency: EMS brand release and marketing material for 'Airflow Aligner' still missing, called the only real blocker of this page (brand named in FAQ q4, phone scan described in statement and step 3).",
    "s-ba marked MATERIAL DA, not set: photos of a relative of the practice; needs § 5a UWG disclosure, identical shooting conditions (§ 5 UWG) and written consent per channel. Alt hint delivered: 'Ziehe für das Ergebnis'.",
    "s-stories / s-quote MATERIAL DA (three patients, one of them a minor), no written releases yet. No field anyway.",
    "Benefit b2: dash before 'und nennen dir' removed without replacement; comma or full stop would have broken the sentence.",
    "Feature f2 is titled 'Unsere Planung', while step 1 and the statement say the manufacturer plans. Kept as delivered.",
    "Price note now in pricingNote. Open question to Mara: add the Mediserv instalment hint for amounts from € 2.000?",
    "FAQ q4 names Invisalign (competitor brand, § 6 UWG): legal review requested by the agency.",
    "Statement marked NEU GESCHRIEBEN / BESTÄTIGT; the top box mentions two variants, the document contains only one.",
    "Contact text not imported (no field): 'Komm vorbei, wir schauen dir einmal in den Mund und sagen dir, was mit Alignern ginge, und was nicht.'",
    "Magazine teaser (links to CMD-Behandlung and Bleaching; Bleaching to be swapped for Kinderzahnheilkunde later) has no field.",
    "'Organical' does not occur in web/ or studio/seed (nor elsewhere in the repo); if it is on the existing page it lives in the live dataset or on the old site.",
    "Document URL suggestion /praxisleistungen/kieferorthopaedische-zahnspange/ not followed; slug stays aligner.",
  ],
};
