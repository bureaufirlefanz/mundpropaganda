/**
 * Zahnersatz / Prothetik — third draft, Hannes' answers of 11 and 12.10.2026.
 *
 * Mapping as in `wurzelbehandlung.mjs`. The text under the price table goes
 * into `pricingNote`.
 */
export default {
  id: "service-zahnersatz-prothetik",
  type: "service",
  source: "MP_LS_09_Zahnersatz_v3_2026-10-12.docx",

  set: {
    "hero.claim": "Gefertigt, wo behandelt wird",
    "hero.text":
      "Kronen, Brücken und Prothesen entstehen bei uns im eigenen Praxislabor, ein paar Meter von deinem Behandlungsstuhl entfernt. Passt etwas nicht, geht es nicht in den Versand, sondern durch eine Tür. Das spart Wochen und erspart dir Termine.",
    "hero.actionLabel": "Jetzt beraten lassen",

    intro: {
      topline: "Erst die Frage, dann die Lösung",
      headline: "Wann ist Zahnersatz nötig?",
      columns: [
        "Ein Zahn ist nicht mehr zu retten, eine alte Krone hält nicht mehr, oder es fehlen gleich mehrere.",
        "Zahnersatz schließt die Lücke, und tut dabei mehr, als sie zu füllen: Er hält die Nachbarzähne an ihrem Platz, verteilt die Kaukraft und sorgt dafür, dass dein Gesicht seine Form behält. Welche Lösung für dich passt, hängt davon ab, wie viele Zähne fehlen und was der Knochen darunter noch trägt.",
      ],
    },

    benefits: {
      topline: "Acht Wege, ein Ziel",
      headline: "Kronen, Brücken, Prothesen: welche Lösung passt?",
      items: [
        {
          _key: "b1",
          _type: "item",
          name: "Festsitzend",
          text: "Inlays und Teilkronen ersetzen einen Teil des Zahns, Kronen den ganzen sichtbaren Teil, Veneers die Vorderseite. Fehlt ein Zahn ganz, kommt eine Brücke oder ein Implantat infrage. Für die Monate, in denen ein Implantat einheilt, gibt es Langzeitprovisorien.",
        },
        {
          _key: "b2",
          _type: "item",
          name: "Herausnehmbar",
          text: "Teil- und Vollprothesen, Teleskop- und Stegprothesen: für größere Lücken oder wenn wenig eigener Zahn übrig ist. Teleskoparbeiten sitzen fester, als viele erwarten.",
        },
      ],
    },

    statement: {
      topline: "Unserem Ruf voraus",
      text: "Alexander baut Kronen, Brücken und Implantatprothetik. Sebastian Krzizek ist Zahntechnikermeister und schichtet die Keramik von Hand. Beide sehen deine Zähne nicht nur als Scan: Farbe, Form und Biss werden direkt angepasst, statt über Versandwege beschrieben.",
    },

    steps: {
      title: "Wie läuft die Versorgung ab?",
      items: [
        {
          _key: "s1",
          _type: "schritt",
          title: "Befund und Plan",
          text: "Wir schauen, was noch trägt, und besprechen die Möglichkeiten samt Kosten. Den Heil- und Kostenplan reichst du bei deiner Kasse ein.",
        },
        {
          _key: "s2",
          _type: "schritt",
          title: "Abformung digital",
          text: "Wir scannen statt abzuformen. Der Scan geht direkt ins Labor nebenan.",
        },
        {
          _key: "s3",
          _type: "schritt",
          title: "Anfertigung im Haus",
          text: "Unsere Zahntechniker bauen deinen Zahnersatz. Bei Kronen, Brücken und Implantatkronen sind das in der Regel zwei Termine, bei Prothesen und Teleskoparbeiten vier bis fünf.",
        },
        {
          _key: "s4",
          _type: "schritt",
          title: "Einsetzen und nachjustieren",
          text: "Wir setzen ein, prüfen den Biss und korrigieren, bis nichts mehr drückt. Kurze Wege heißt: Nachbessern kostet dich keine Woche.",
        },
      ],
    },

    pricingTitle: "Was kostet Zahnersatz?",
    pricing: [
      { _key: "p1", _type: "price", name: "Krone", price: "ab € 1.200,–" },
      { _key: "p2", _type: "price", name: "Teilkrone", price: "ab € 1.300,–" },
      {
        _key: "p3",
        _type: "price",
        name: "Implantatgetragene Krone",
        price: "ab € 1.400,–",
      },
      {
        _key: "p4",
        _type: "price",
        name: "Brücke mit zwei Pfeilern",
        price: "ab € 2.000,–",
      },
      {
        _key: "p5",
        _type: "price",
        name: "Teleskop auf natürlichem Zahn",
        price: "ab € 1.500,– / Teleskop",
      },
      {
        _key: "p6",
        _type: "price",
        name: "Teleskop auf Implantat",
        price: "ab € 1.800,– / Teleskop",
      },
      {
        _key: "p7",
        _type: "price",
        name: "Totale Prothese, ein Kiefer",
        price: "ab € 600,–",
      },
      {
        _key: "p8",
        _type: "price",
        name: "Langzeitprovisorium (Clearsplint)",
        price: "ab € 500,–",
      },
    ],
    pricingNote:
      "Die gesetzliche Kasse zahlt einen Festzuschuss auf die Regelversorgung. Alles darüber trägst du selbst.",

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
        topline: "Präzision statt Kopie",
        title: "Unser Praxislabor",
        text: "Was bei uns entsteht, entsteht unter demselben Dach. Kurze Wege heißen weniger Wartezeit und die Möglichkeit, direkt nachzubessern.",
      },
      {
        _key: "f3",
        _type: "featureZeile",
        topline: "Keine halben Sachen",
        title: "Haltbarkeit deines Zahnersatzes",
        text: "Guter Zahnersatz hält viele Jahre, wenn das Fundament stimmt. Einige brauchen vorher eine Parodontitis-Behandlung.",
      },
    ],

    faq: [
      {
        _key: "q1",
        _type: "questionAnswer",
        question: "Wie lange hält eine Zahnkrone?",
        answer:
          "Bei guter Pflege viele Jahre. Entscheidend ist weniger das Material als der Zahn darunter und wie sauber der Rand sitzt.",
      },
      {
        _key: "q2",
        _type: "questionAnswer",
        question: "Was zahlt die Krankenkasse beim Zahnersatz?",
        answer:
          "Einen Festzuschuss auf die Regelversorgung, mindestens 60 Prozent. Mit lückenlosem Bonusheft bis 65 Prozent, nach zehn Jahren bis 75. Alles darüber trägst du selbst.",
      },
      {
        _key: "q3",
        _type: "questionAnswer",
        question: "Kann Zahnersatz repariert werden?",
        answer:
          "Oft ja. Eine abgeplatzte Verblendung oder eine gelöste Krone lässt sich meistens richten, und weil das Labor im Haus ist, geht das schneller als über den Versandweg.",
      },
      {
        _key: "q4",
        _type: "questionAnswer",
        question: "Krone, Brücke oder Implantat: was ist besser?",
        answer:
          "Solange genug eigener Zahn da ist, ist die Krone die sparsamste Lösung. Fehlt ein Zahn ganz, lässt ein Implantat die Nachbarzähne unangetastet, eine Brücke braucht sie als Pfeiler.",
      },
      {
        _key: "q5",
        _type: "questionAnswer",
        question: "Wie lange dauert es bis zum fertigen Zahnersatz?",
        answer:
          "Bei Kronen, Brücken und Implantatkronen meist zwei Termine. Prothesen und Teleskoparbeiten brauchen vier bis fünf.",
      },
    ],

    seo: {
      _type: "seo",
      title: "Zahnersatz Berlin – aus eigenem Praxislabor",
      description:
        "Zahnersatz Berlin: Kronen, Brücken und Prothesen aus dem eigenen Praxislabor im Prenzlauer Berg. Kurze Wege, hohe Qualität. Jetzt Beratungstermin vereinbaren.",
    },
  },

  notes: [
    "Document H1 is 'Zahnersatz in Berlin'; the current topline is 'Zahnersatz / Prothetik in Berlin'. Not changed.",
    "Hero headline variant A ('Gefertigt, wo behandelt wird') is marked as used; the choice between A, B, C is still open with Mara + Flo.",
    "Intro H2 'Wann ist Zahnersatz nötig?' is not in SEO brief 17; the agency wants Mara + Flo + Summer Days to confirm it.",
    "Benefits has two groups (Festsitzend, Herausnehmbar) instead of one H3 per treatment as the brief asks; to be agreed with Summer Days.",
    "USP H2 'Das eigene Praxislabor: warum das den Unterschied macht' dropped: the statement has no headline field.",
    "Statement names 'Alexander' without a surname; Sebastian Krzizek in full.",
    "Steps kicker 'Zwei bis fünf Termine' dropped: steps have no topline.",
    "Financing element (VORSCHLAG, not approved) not imported: 'Bei positiver Bonität ist Ratenzahlung über unseren Partner Mediserv Bank möglich — sechs Raten zinsfrei, Laufzeiten bis 56 Monate.'",
    "s-ba OFFEN, not set: no approved images.",
    "s-stories and s-quote: material exists (two patients) but written consent is still missing. No field.",
    "Magazine teaser has no field: links to Zahnimplantate and Unser Praxislabor (target to change to /praxis/#praxislabor).",
    "Contact text not imported (no field): 'Bring den Kostenvoranschlag mit', the strongest CTA for this audience.",
    "Link anchors Veneers, Implantat, Parodontitis-Behandlung stay plain text (the document has no explicit linking box; read as anchors).",
    "seo.title has no '/ Mundpropaganda' suffix, unlike the other delivered titles.",
  ],
};
