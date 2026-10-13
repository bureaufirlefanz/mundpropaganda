/**
 * Weisheitszahnentfernung: third draft, Hannes' answers of 11 and 12.10.2026.
 *
 * Mapping as in `wurzelbehandlung.mjs`. Headline variant A ("eingesetzt")
 * is the hero claim. The Übergang "Nach der OP" is the explainer.
 */
export default {
  id: "service-weisheitszahnentfernung",
  type: "service",
  source: "MP_LS_06_Weisheitszaehne_v3_2026-10-12.docx",

  set: {
    "hero.claim": "Die OP ist kurz, die Heilung zählt",
    "hero.text":
      "Weisheitszähne rauszunehmen dauert selten lange. Was danach passiert, entscheidet, wie deine Woche aussieht. Deshalb arbeiten wir bei der Weisheitszahn-OP mit deinem eigenen Blut: Es enthält die Signalstoffe, die deine Wundheilung starten. Warum das einen Unterschied macht, erklären wir dir hier.",
    "hero.actionLabel": "Jetzt beraten lassen",

    intro: {
      topline: "Nicht immer, aber oft",
      headline: "Wann müssen Weisheitszähne raus?",
      columns: [
        "Nicht jeder Weisheitszahn muss raus. Wenn er gerade steht, vollständig durchgebrochen ist und du ihn sauber putzen kannst, darf er bleiben.",
        "Raus muss er, wenn er schief liegt und den Nachbarzahn schädigt, wenn sich die Schleimhaut darüber immer wieder entzündet, wenn Karies entsteht, wo keine Bürste hinkommt, oder wenn er im Kiefer stecken bleibt und Druck macht. Was bei dir der Fall ist, sehen wir spätestens auf dem Röntgenbild.",
      ],
    },

    benefits: {
      topline: "Dein eigenes Blut",
      headline: "Schnellere Heilung mit PRF (Eigenbluttherapie)",
      items: [
        {
          _key: "b1",
          _type: "item",
          name: "Was PRF ist",
          text: "PRF steht für Platelet-Rich Fibrin, auf Deutsch plättchenreiches Fibrin. Wir nehmen dir Blut ab, zentrifugieren es und gewinnen daraus den Anteil, in dem die Wachstumsfaktoren deines eigenen Blutes konzentriert sind.",
        },
        {
          _key: "b2",
          _type: "item",
          name: "Warum das die Heilung beschleunigt",
          text: "Dein Körper heilt in Etappen: Erst bildet sich ein Blutgerinnsel als Gerüst, dann wandern Reparaturzellen ein, und erst ab etwa Tag drei bauen sie neues Gewebe auf. Wachstumsfaktoren sind das Signal, das diese Zellen ruft. Mit PRF ist das Signal von Anfang an da: Die Reparatur startet früher.",
        },
      ],
    },

    statement: {
      topline: "Unserem Ruf voraus",
      text: "Wir sind von dem Verfahren so überzeugt und machen so gute Erfahrungen damit, dass wir Zahnentfernungen heute fast ausschließlich mit Eigenbluttherapie durchführen. Weniger Schmerzen, schnellere Wundheilung, weniger Infektionsrisiko. Und besserer Knochenaufbau an der Stelle, wo der Zahn saß.",
    },

    explainer: {
      topline: "Die erste Woche",
      headline: "Nach der OP: Heilung und Verhalten",
      columns: [
        "Plan für eine Woche. Die Schwellung erreicht ihren Höhepunkt meist am zweiten Tag. Kühlen hilft, aber im Takt: In den ersten vier bis fünf Stunden nach der OP 20 Minuten kühlen, dann 60 Minuten Pause, dann wieder 20 Minuten. Den Kühlakku dabei immer in ein Handtuch wickeln, nie direkt auf die Haut. Sonst: hochlagern, ruhig bleiben, kein Sport, kein Alkohol, keine Zigarette, nichts Heißes. Und bitte nicht mit dem Strohhalm trinken: Der Unterdruck kann das Blutgerinnsel lösen, und genau das willst du nicht.",
      ],
    },

    steps: {
      title: "Wie läuft die Weisheitszahn-OP ab?",
      items: [
        {
          _key: "s1",
          _type: "schritt",
          title: "Vorher: Röntgen und Plan",
          text: "Wir schauen auf dem Röntgenbild, wie die Zähne liegen und wo die Nerven verlaufen. Danach besprechen wir, ob einer, zwei oder alle vier rauskommen.",
        },
        {
          _key: "s2",
          _type: "schritt",
          title: "Lokalanästhesie, Lachgas oder Vollnarkose",
          text: "Die meisten Eingriffe laufen unter örtlicher Betäubung. Reicht dir das nicht, empfehlen wir Lachgas. Sag es früh, dann planen wir es ein. Auch Dämmerschlaf oder eine Behandlung in Vollnarkose sind möglich.",
        },
        {
          _key: "s3",
          _type: "schritt",
          title: "Die OP: Blut, Zahn, Naht",
          text: "Wir nehmen dir Blut ab und setzen die Zentrifuge an. Während sie läuft, lösen wir den Zahn. Zum Schluss kommt das PRF in die Wunde und wird vernäht.",
        },
        {
          _key: "s4",
          _type: "schritt",
          title: "Danach: Kontrolle und Fäden",
          text: "Nach etwa einer Woche schauen wir nach und ziehen die Fäden.",
        },
      ],
    },

    pricingTitle: "Was kostet die Weisheitszahn-OP?",
    pricing: [
      {
        _key: "p1",
        _type: "price",
        name: "Entfernung, medizinisch notwendig",
        price: "Kassenleistung",
      },
      {
        _key: "p2",
        _type: "price",
        name: "Eigenbluttherapie (PRF), erster Zahn",
        price: "ab € 190,–",
      },
      {
        _key: "p3",
        _type: "price",
        name: "Eigenbluttherapie (PRF), jeder weitere Zahn",
        price: "ab € 150,–",
      },
      {
        _key: "p4",
        _type: "price",
        name: "Lachgas, erste halbe Stunde",
        price: "ab € 150,–",
      },
      {
        _key: "p5",
        _type: "price",
        name: "Lachgas, jede weitere halbe Stunde",
        price: "ab € 90,–",
      },
      {
        _key: "p6",
        _type: "price",
        name: "Vollnarkose (externes Anästhesieteam)",
        price: "ab € 500,– / Stunde",
      },
    ],
    pricingNote:
      "Die Entfernung selbst übernimmt die gesetzliche Krankenkasse, wenn sie medizinisch notwendig ist. Eigenbluttherapie, Lachgas und Vollnarkose sind Privatleistungen.",

    features: [
      {
        _key: "f1",
        _type: "featureZeile",
        topline: "Mund auf, Ohren auf",
        title: "Beratung geht vor",
        text: "Zu Beginn hören wir dir erstmal zu: Wie können wir dir helfen, was stört dich, was wünschst du dir? Anschließend suchen wir gemeinsam nach passenden Lösungen und stimmen Materialien sowie Kosten mit dir ab. Am Ende soll dir schließlich nur aus einem Grund der Mund offen bleiben: dass du gut durch die Woche danach kommst.",
      },
      {
        _key: "f2",
        _type: "featureZeile",
        topline: "Kein Kompromiss",
        title: "Unser Verfahren",
        text: "Eigenblut ist bei uns nicht der Aufpreis für Anspruchsvolle, sondern der Normalfall. Wir entfernen Zähne fast nur noch so, weil die Woche danach besser verläuft.",
      },
      {
        _key: "f3",
        _type: "featureZeile",
        topline: "Keine halben Sachen",
        title: "Die Woche danach",
        text: "Wir sagen dir vorher, was auf dich zukommt, statt dich hinterher damit allein zu lassen. Bei Fragen rufst du an: Dafür sind wir da.",
      },
    ],

    faq: [
      {
        _key: "q1",
        _type: "questionAnswer",
        question:
          "Wie lange ist man nach der Weisheitszahn-OP krankgeschrieben?",
        answer:
          "Plane eine Woche ein. Wie viele Tage du brauchst, hängt vom Eingriff und von deinem Beruf ab: Wer körperlich arbeitet, braucht länger als wer am Schreibtisch sitzt.",
      },
      {
        _key: "q2",
        _type: "questionAnswer",
        question: "Können alle vier Weisheitszähne auf einmal entfernt werden?",
        answer:
          "Ja, das machen wir meistens so: einmal Ausfallzeit statt viermal. Wenn du lieber seitenweise vorgehen willst, geht das auch.",
      },
      {
        _key: "q3",
        _type: "questionAnswer",
        question: "Wie schlimm ist eine Weisheitszahn-OP wirklich?",
        answer:
          "Meistens harmloser als ihr Ruf. Du spürst Druck, keinen Schmerz. Unangenehm sind eher die Tage danach, und genau die wollen wir mit der Eigenbluttherapie kürzer machen.",
      },
      {
        _key: "q4",
        _type: "questionAnswer",
        question:
          "Zahlt die Krankenkasse die Vollnarkose bei der Weisheitszahn-OP?",
        answer:
          "In der Regel nicht. Die gesetzliche Kasse übernimmt sie nur in begründeten Ausnahmefällen. Lachgas ist die günstigere Alternative und bei Weisheitszähnen ausdrücklich zu empfehlen.",
      },
      {
        _key: "q5",
        _type: "questionAnswer",
        question: "Was ist PRF und was bringt es nach der OP?",
        answer:
          "PRF steht für Platelet-Rich Fibrin, plättchenreiches Fibrin. Wir nehmen dir Blut ab, zentrifugieren es, dann kommt der Anteil mit den Wachstumsfaktoren in die Wunde. Das bringt die Reparatur früher in Gang und unterstützt den Knochenaufbau dort, wo der Zahn saß.",
      },
    ],

    seo: {
      _type: "seo",
      title: "Weisheitszahn-OP Berlin – auch in Vollnarkose",
      description:
        "Weisheitszahn-OP in Berlin: schonende Entfernung, auf Wunsch in Vollnarkose. Erfahrene Chirurgie in der Praxis im Prenzlauer Berg. Jetzt beraten lassen.",
    },
  },

  notes: [
    "Document H1 'Weisheitszahn-OP in Berlin' differs from the current topline 'Weisheitszähne in Berlin'; topline not changed.",
    "Headline variant A is set as hero claim; the choice A/B/C/D is still open with Mara and Flo.",
    "USP H2 'Warum Weisheitszahn-OP bei Mundpropaganda?' dropped: the statement has no headline field.",
    "Steps kicker 'Ein Termin' dropped: steps have no topline.",
    "Explainer 'Nach der OP: Heilung und Verhalten' renders before the steps; the document places it after them.",
    "Step 2: '[Dämmerschlaf oder eine Behandlung in Vollnarkose]' read as a link anchor (no link box says so); brackets dropped. Check it is not a gap.",
    "s-ba GESTRICHEN, not set; the agency asks Mara and Flo to confirm.",
    "s-stories and s-quote: cases can be obtained (Hannes' nephew, 1 to 2 patients). The nephew needs the family tie disclosed (para. 5a UWG).",
    "Magazine teaser has no field: links to Behandlung in Vollnarkose and Professionelle Zahnreinigung.",
    "Contact text not imported (no field), key sentence: 'Wir schauen uns das Röntgenbild an und sagen dir, ob die Zähne wirklich raus müssen.' Its CTA 'Jetzt sprechen' has no field either.",
    "'Jetzt beraten lassen' scrolls to the footer contact.",
    "Feature 'Unser Verfahren' says Eigenblut is 'nicht der Aufpreis', while the price table lists PRF as a private extra from 190 euro.",
    "Fee list still says PRGF; Hannes promised to switch it back to PRF. Check.",
  ],
};
