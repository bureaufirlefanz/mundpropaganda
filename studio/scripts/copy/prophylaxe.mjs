/**
 * Prophylaxe: third draft, Hannes' answers of 11 and 12.10.2026.
 *
 * Mapping as in `wurzelbehandlung.mjs`. Headline variant A ("eingesetzt")
 * is the hero claim. No Übergang on this page, so no explainer.
 */
export default {
  id: "service-prophylaxe",
  type: "service",
  source: "MP_LS_05_Prophylaxe_v3_2026-10-12.docx",

  set: {
    "hero.claim": "Wir fangen an, bevor etwas anfängt",
    "hero.text":
      "Die meiste Zahnmedizin repariert. Die professionelle Zahnreinigung setzt vorher an: Sie entfernt regelmäßig das, woraus sonst Karies und Parodontitis entstehen. Wir arbeiten nach dem GBT-Konzept mit dem Airflow Prophylaxis Master von EMS: erst sichtbar machen, dann gezielt reinigen.",
    "hero.actionLabel": "Jetzt online buchen",

    intro: {
      topline: "Was die Bürste nicht schafft",
      headline: "Warum professionelle Zahnreinigung?",
      columns: [
        "Karies und Parodontitis fangen nicht plötzlich an. Sie fangen dort an, wo die Bürste nicht hinkommt: zwischen den Zähnen, unter dem Zahnfleischrand, in den Grübchen der Backenzähne.",
        "Was sich da bildet, ist kein Dreck, sondern ein Biofilm: eine organisierte Bakterienschicht, die sich nicht wegwischen lässt. Sie ist unsichtbar, und deshalb merkst du sie erst, wenn das Zahnfleisch blutet. Genau dafür gibt es die Prophylaxe: Wir holen den Biofilm regelmäßig runter, bevor daraus eine Behandlung wird.",
      ],
    },

    benefits: {
      topline: "Sauber ist nicht gleich sauber",
      headline: "Prophylaxe als Konzept",
      items: [
        {
          _key: "b1",
          _type: "item",
          name: "GBT: erst sehen, dann reinigen",
          text: "Wir färben deine Beläge ein. Plötzlich siehst du selbst, wo du nicht hinkommst. Gereinigt wird dann gezielt mit Pulverstrahl und Ultraschall, nicht pauschal über alles.",
        },
        {
          _key: "b2",
          _type: "item",
          name: "Ein Team, das nichts anderes macht",
          text: "Tetiana, Victor und Kristin sind GBT-zertifiziert und machen in deinem Termin ausschließlich das. Du wirst nicht zwischen zwei Behandlungen durchgeschoben.",
        },
        {
          _key: "b3",
          _type: "item",
          name: "Dein Intervall, nicht der Kalender",
          text: "Wie oft du kommen solltest, entscheidet dein Zahnfleisch, nicht ein Standardrhythmus. Bei den meisten sind es zwei Termine im Jahr. Bei empfindlichem Zahnfleisch vier.",
        },
      ],
    },

    statement: {
      topline: "Unserem Ruf voraus",
      text: "Prophylaxe macht bei uns niemand nebenbei. Isabel Heß ist Dentalhygienikerin, das ganze Team ist GBT-zertifiziert, und dein Termin wird nicht gekürzt, wenn weniger zu tun ist: Unsere Mitarbeiter:innen sind ausdrücklich so angewiesen. Die Zeit geht dann in Kontrolle und Beratung.",
    },

    steps: {
      title: "Wie läuft die Zahnreinigung ab?",
      items: [
        {
          _key: "s1",
          _type: "schritt",
          title: "Anschauen und anfärben",
          text: "Erst schauen wir uns Zähne und Zahnfleisch an und fragen, was sich verändert hat. Dann färben wir ein. Ab da ist die Diskussion, ob du gut putzt, beendet.",
        },
        {
          _key: "s2",
          _type: "schritt",
          title: "Reinigen mit Airflow und Ultraschall",
          text: "Der Pulverstrahl löst weiche Beläge und Verfärbungen, der Ultraschall den harten Zahnstein. Deutlich angenehmer als das Kratzen mit Handinstrumenten, an das du dich vielleicht erinnerst.",
        },
        {
          _key: "s3",
          _type: "schritt",
          title: "Schützen",
          text: "Zum Schluss glätten wir die Flächen und tragen Fluorid auf. Auf glatten Oberflächen hat Biofilm es schwerer.",
        },
        {
          _key: "s4",
          _type: "schritt",
          title: "Dein nächster Termin",
          text: "Bevor du gehst, legen wir fest, wann du wiederkommst. Drei, vier oder sechs Monate, je nachdem, was wir heute gesehen haben.",
        },
      ],
    },

    pricingTitle: "Was kostet die Zahnreinigung in Berlin?",
    pricing: [
      {
        _key: "p1",
        _type: "price",
        name: "Professionelle Zahnreinigung",
        price: "ab € 160,– / Termin",
      },
      {
        _key: "p2",
        _type: "price",
        name: "Kürzerer Termin bei wenigen Zähnen",
        price: "ab € 80,–",
      },
    ],
    pricingNote:
      "Wer wenige Zähne hat, braucht oft keine ganze Stunde: Dann buchst du eine halbe und zahlst die Hälfte. Die gesetzliche Kasse übernimmt die Zahnreinigung nicht als Regelleistung, viele Kassen erstatten aber einen Teil über Bonusprogramme.",

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
        topline: "Präzision statt Routine",
        title: "Unsere Zeit",
        text: "Wir planen deinen Termin voll ein, auch wenn wenig zu tun ist. Was nicht fürs Reinigen draufgeht, geht in Kontrolle und Beratung, nicht in den nächsten Patienten.",
      },
      {
        _key: "f3",
        _type: "featureZeile",
        topline: "Keine halben Sachen",
        title: "Haltbarkeit deines Ergebnisses",
        text: "Eine Zahnreinigung wirkt nur so lange wie deine Pflege zuhause. Deshalb zeigen wir dir am Ende, welche Stelle du regelmäßig verpasst: mit deiner eigenen Bürste, nicht theoretisch.",
      },
    ],

    faq: [
      {
        _key: "q1",
        _type: "questionAnswer",
        question: "Wie oft sollte man eine PZR machen?",
        answer:
          "Für die meisten zweimal im Jahr. Wer zu Zahnfleischentzündungen neigt, raucht oder Implantate hat, kommt besser alle drei bis vier Monate.",
      },
      {
        _key: "q2",
        _type: "questionAnswer",
        question: "Tut die Zahnreinigung weh?",
        answer:
          "Normalerweise nicht. Bei freiliegenden Zahnhälsen oder entzündetem Zahnfleisch kann es ziehen. Sag es früh, dann arbeiten wir mit einer Oberflächenbetäubung oder, wenn nötig, einer richtigen Anästhesie.",
      },
      {
        _key: "q3",
        _type: "questionAnswer",
        question: "Zahlt die Krankenkasse die Zahnreinigung?",
        answer:
          "Als Regelleistung nicht. Viele Kassen erstatten aber einen Teil über Bonusprogramme oder freiwillige Zusatzleistungen. Fragen lohnt sich, bevor du kommst.",
      },
      {
        _key: "q4",
        _type: "questionAnswer",
        question: "Wie lange dauert eine Zahnreinigung?",
        answer:
          "Bis zu einer Stunde, und wir planen sie voll ein, auch wenn wenig zu tun ist. Wer wenige Zähne hat, braucht manchmal nur eine halbe Stunde: Dann buchst du auch nur eine halbe.",
      },
      {
        _key: "q5",
        _type: "questionAnswer",
        question:
          "Was darf man nach der Zahnreinigung nicht essen oder trinken?",
        answer:
          "Eine Stunde nichts stark Färbendes: Kaffee, Rotwein, Tee, Curry, Beeren. Die Zähne sind direkt nach der Reinigung kurz aufnahmefähiger, ausgerechnet dann, wenn du dich am saubersten fühlst.",
      },
    ],

    seo: {
      _type: "seo",
      title: "Zahnreinigung Berlin – Prophylaxe / Mundpropaganda",
      description:
        "Zahnreinigung Berlin: professionelle Prophylaxe in der nachhaltigen Zahnarztpraxis im Prenzlauer Berg. Termine bis 20 Uhr. Jetzt online Termin buchen.",
    },
  },

  notes: [
    "BLOCKER: the brand names EMS / Airflow need Mara's approval before publishing (agency calls it the only real blocker). They are in hero.text and in the title of step 2. Import as draft only until approved.",
    "Document H1 'Professionelle Zahnreinigung in Berlin' differs from the current topline 'Prophylaxe in Berlin'; topline not changed.",
    "Headline variant A is set as hero claim; the choice A/B/C is still open with Mara and Flo.",
    "USP H2 'Warum Prophylaxe bei Mundpropaganda?' dropped: the statement has no headline field.",
    "Steps kicker 'Bis zu einer Stunde' and the line 'Dauer gesamt: bis zu einer Stunde' dropped: steps have no topline and no total duration field.",
    "s-ba not set: copy exists ('Zahnreinigung vorher / nachher', alt hint 'Ziehe für das Ergebnis'), the agency says the slider works here, but practice photos are missing.",
    "s-stories and s-quote OPEN; the agency says real reviews exist (35 mentions) and only need written consent.",
    "Magazine teaser has no field: links to Bleaching and Parodontitis-Behandlung; the third mandatory link (Kinderzahnheilkunde) waits for that page.",
    "Contact text not imported (no field), key sentence: last appointment starts at 19:45, and 'Wir fragen nicht, wie lange es her ist.'",
    "'Jetzt online buchen' scrolls to the footer contact; it does not open an online booking.",
    "Prices: planned increase from 160 to 190 euro end of Q1 2027; both rows change then. The copywriter sheet still says 190 and needs correcting.",
    "Agency suggests a legal read of the HWG wording together with the prices (not legal advice).",
  ],
};
