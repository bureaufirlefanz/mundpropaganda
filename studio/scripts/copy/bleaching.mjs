/**
 * Bleaching, copy draft after Hannes' feedback (agency template
 * "JM_..._nach Hannes Feedback angepasst", draft of 17.09.2026).
 *
 * Mapping as in `wurzelbehandlung.mjs`. The document has no "Übergang"
 * section, so `explainer` is not set. The running text under the price table
 * goes into `pricingNote`.
 */
export default {
  id: "service-bleaching",
  type: "service",
  source: "JM_MP_LS_03_Bleaching_Copy_nach Hannes Feedback angepasst.docx",

  set: {
    "hero.claim": "Probierst du noch, oder strahlst du schon?",
    "hero.text":
      "Bleaching bei Mundpropaganda ist eine professionelle Zahnaufhellung, die wir in Berlin auf zwei Wegen anbieten: mit Fläsh direkt in unserer Praxis oder mit individuell angefertigten Schienen für zuhause. Du überlässt dein Wunschergebnis damit nicht dem Zufall, sondern uns Zahnärzt:innen. Vor jeder Behandlung reinigen wir deine Zähne professionell, damit das Bleaching optimal wirken kann.",
    "hero.actionLabel": "Jetzt sprechen",

    intro: {
      topline: "Schwarz auf weiß",
      headline: "Für wen eignet sich ein Bleaching?",
      columns: [
        "Manchmal ist es zu viel Kaffee, ungünstige Ernährung oder auch die tägliche Zigarette, die deine Zähne nach und nach dunkler wirken lässt.",
        "Wenn bei leichten Verfärbungen eine professionelle Zahnreinigung nicht mehr hilft, können wir mit Bleaching dein Wunschergebnis planen und je nach Ausgangslage ein natürlich strahlendes Lächeln erreichen. Ist Veneers in Berlin die bessere Option für dich, zeigen wir dir auch diese Möglichkeit.",
      ],
    },

    benefits: {
      topline: "Zwei Wege, ein Ziel",
      headline: "Welche Bleaching-Methoden gibt es?",
      items: [
        {
          _key: "b1",
          _type: "item",
          name: "In-Office-Bleaching mit Fläsh",
          text: "In unserer Praxis arbeiten wir mit dem Fläsh-System von Bluedenta. Wir tragen einen Schutz auf dein Zahnfleisch auf, dann das Bleaching-Gel, aktivieren es mit einer Lampe und wiederholen das dreimal. So werden deine Zähne pro Sitzung um bis zu eine Farbstufe heller.",
        },
        {
          _key: "b2",
          _type: "item",
          name: "Home-Bleaching mit individueller Schiene",
          text: "Für zuhause fertigen wir, anders als die Einheitsgrößen aus der Drogerie, individuell angepasste Schienen für dich an. Du trägst sie in den eigenen vier Wänden, wann es dir am besten passt, und hellst deine Zähne so über einen längeren Zeitraum auf.",
        },
      ],
    },

    statement: {
      topline: "Unserem Ruf voraus",
      text: "Strahlende Lächeln sind unsere tägliche Arbeit, deshalb wissen wir, dass du ganz bestimmte Vorstellungen mitbringst. Oft hat das Bleaching auf eigene Faust oder im Kosmetikstudio nicht wie erhofft geklappt. Wir schauen uns deine Zähne und dein Zahnfleisch zuerst professionell an. Das ist für das spätere Ergebnis entscheidend und geht eben nur bei Profis. Dann bekommst du von uns eine ehrliche, realistische Einschätzung.",
    },

    steps: {
      title: "Wie läuft die Behandlung ab?",
      items: [
        {
          _key: "s1",
          _type: "schritt",
          title: "Erster Check",
          text: "Vor jedem Bleaching schauen wir uns deine Ausgangszahnfarbe, deinen Zahnschmelz und dein Zahnfleisch an. Eine professionelle Zahnreinigung gehört immer dazu. Sie kann im selben Termin wie deine erste Sitzung oder ein paar Tage vorher stattfinden.",
        },
        {
          _key: "s2",
          _type: "schritt",
          title: "Bleaching",
          text: "In der Praxis tragen wir das Fläsh-Gel auf und aktivieren es dreimal mit der Lampe. Eine Sitzung dauert etwa 90 Minuten. Willst du mehrere Stufen heller werden, brauchst du meist mehrere Sitzungen im Abstand von ein bis zwei Wochen.",
          duration: "ca. 90 Minuten pro Sitzung",
        },
      ],
    },

    pricingTitle: "Was kostet Bleaching in Berlin?",
    pricing: [
      {
        _key: "p1",
        _type: "price",
        name: "In-Office-Bleaching (Fläsh), pro Sitzung",
        price: "€ 490,–",
      },
      {
        _key: "p2",
        _type: "price",
        name: "Home-Bleaching-Schienen (einmalig)",
        price: "€ 550,– + Material",
      },
      {
        _key: "p3",
        _type: "price",
        name: "Home-Bleaching, pro Anwendung",
        price: "€ 20,–",
      },
    ],
    pricingNote:
      "Bleaching-Kosten in Berlin variieren stark zwischen Anbietern, bei uns sind sie von Anfang an transparent. Die gesetzliche Krankenkasse übernimmt keine Kosten, da Bleaching eine rein ästhetische Leistung ist. Manche private Zusatzversicherungen beteiligen sich anteilig, das lohnt sich vorab bei deiner Versicherung zu checken. Sichtbare Füllungen, Kronen oder Veneers werden beim Bleaching nicht heller, plane den Austausch am besten direkt mit ein.",

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
        topline: "Natürlich weiß",
        title: "Eine Frage der Stufe",
        text: "In der Beratung zeigen wir dir zuerst deine aktuelle Zahnfarbe auf unserer Skala: von Bleach 1, der hellsten Stufe, bis A4. Pro Sitzung wird es realistisch eine Stufe heller. Willst du von einer dunkleren Ausgangsfarbe auf eine hellere Stufe, sagen wir dir ehrlich, wie viele Termine und welches Budget dafür nötig sind.",
      },
      {
        _key: "f3",
        _type: "featureZeile",
        topline: "Keine halben Sachen",
        title: "Haltbarkeit des Farbtons",
        text: "Dein Ergebnis ist bei guter Pflege und regelmäßiger Prophylaxe ein bis drei Jahre sichtbar. Kaffee, Tee, Rotwein und Rauchen verkürzen diese Zeit und eine jährliche Auffrischung lohnt sich deshalb.",
      },
    ],

    faq: [
      {
        _key: "q1",
        _type: "questionAnswer",
        question: "Wie lange hält ein Bleaching?",
        answer:
          "Ein bis drei Jahre, wenn du gut pflegst und regelmäßig zur Prophylaxe gehst. Kaffee, Tee, Rotwein und Rauchen lassen das Ergebnis schneller nachdunkeln, eine jährliche Auffrischung gleicht das meist aus.",
      },
      {
        _key: "q2",
        _type: "questionAnswer",
        question: "Schadet Bleaching dem Zahnschmelz?",
        answer:
          "Bei fachgerechter Anwendung nicht. Wir prüfen erst, ob dein Zahnschmelz mitmacht und dosieren danach. Direkt nach der Behandlung können deine Zähne kurz empfindlicher reagieren, was sich aber innerhalb weniger Tage legt.",
      },
      {
        _key: "q3",
        _type: "questionAnswer",
        question: "Wie weiß werden die Zähne?",
        answer:
          "Das hängt von der Ausgangslage deiner Zahnfarbe ab. Pro Sitzung wird es realistisch eine Stufe heller. Wie viele Stufen für dich möglich und sinnvoll sind, besprechen wir vorher in der Beratung.",
      },
      {
        _key: "q4",
        _type: "questionAnswer",
        question: "Zahlt die Krankenkasse ein Bleaching?",
        answer:
          "Die gesetzliche Krankenkasse übernimmt keine Kosten, da Bleaching eine rein ästhetische Leistung ist. Manche private Zusatzversicherungen beteiligen sich anteilig. Sichtbare Füllungen, Kronen oder Veneers werden beim Bleaching nicht heller, plane den Austausch am besten direkt mit ein.",
      },
      {
        _key: "q5",
        _type: "questionAnswer",
        question: "Wie oft darfst du deine Zähne bleichen?",
        answer:
          "Öfter als nötig solltest du nicht bleichen: Eine jährliche Auffrischung reicht meist aus, um dein Ergebnis zu halten, ohne dabei deinen Zahnschmelz unnötig zu beanspruchen.",
      },
      {
        _key: "q6",
        _type: "questionAnswer",
        question: "Warum Bleaching beim Zahnarzt statt im Kosmetikstudio?",
        answer:
          "Bleaching bei Zahnärzt:innen heißt: Du bekommst vorher eine zahnmedizinische Kontrolle. Diesen Schritt gibt es im Kosmetikstudio meistens nicht, obwohl er entscheidet, ob und wie viel für dich möglich ist.",
      },
    ],

    seo: {
      _type: "seo",
      title: "Bleaching Berlin – Kosten & Ablauf / Mundpropaganda",
      description:
        "Bleaching Berlin: professionelle Zahnaufhellung beim Zahnarzt im Prenzlauer Berg. Schonend, mit transparenten Kosten. Jetzt Beratungstermin vereinbaren.",
    },
  },

  notes: [
    "Intro: the link anchor makes the sentence 'Ist Veneers in Berlin die bessere Option für dich' ungrammatical as plain text; kept verbatim.",
    "Benefits: brand naming 'Fläsh-System von Bluedenta' needs approval per the agency box; the manufacturer writes both names in lowercase; agency question C4 (name Bluedenta or not) unanswered.",
    "Benefits: the box says a softened pain note ('etwas unangenehm', anaesthesia possible) was added, but the text contains none.",
    "Comparison table under the methods (Methode / Dauer / Ergebnis / Preis ab) not imported: no field.",
    "Statement is 69 words against a budget of 55 (marked by the agency).",
    "Steps kicker 'Schritt für Schritt' dropped (no topline). Step 1 duration missing ('Dauer: ???'), not set. Steps describe the in-office route only.",
    "Steps: the source box mentions an added note (new front tooth fillings at the earliest two weeks after the last session) that is not in the text.",
    "Step 1: 'can happen in the same appointment' is the agency's assumption, to be confirmed by Hannes.",
    "Prices: whether the professional cleaning is included is still open (box OFFEN). Hannes quoted ca. 500 for in-office and 500 for the trays; the fee list (490 / 550) was used.",
    "pricingNote and FAQ 4: 'Manche private Zusatzversicherungen beteiligen sich anteilig' awaits Hannes' approval (C11, C12).",
    "Feature 3: whether one to three years also applies to home bleaching is unanswered (C5, C6).",
    "Intro: exclusion criteria (who is not treated) still to be asked from Hannes (box OFFEN).",
    "s-ba OFFEN, no material, not set.",
    "s-stories, s-quote, s-magazine OFFEN. Hannes asks for a table of desired quote topics and interview questions (C7); Mara offers real reviews (C9).",
    "Contact text not imported (no field): 'Noch unsicher, welche Zahnfarbe für dich realistisch ist? Lass uns kurz sprechen.' CTA 'Jetzt sprechen'.",
    "Link anchors (professionelle Zahnreinigung, Veneers in Berlin) stay plain text.",
  ],
};
