/**
 * Wurzelbehandlung — third draft, Hannes' answers of 11 and 12.10.2026.
 *
 * Mapping from the agency modules onto the service schema, used by every
 * file in this folder:
 *
 *   s-hero          topline stays (it is the document's H1 wording),
 *                   Markenzeile → hero.claim, body → hero.text,
 *                   CTA → hero.actionLabel
 *   s-intro         Kicker → topline, H2 → headline, body split into the
 *                   two columns at a change of thought
 *   s-benefits      Kicker → topline, H2 → headline, H3 + body → items
 *   USP-Claim       Kicker → statement.topline, body → statement.text
 *                   (the H2 has no field)
 *   Übergang        → explainer, one column
 *   s-steps         H2 → steps.title, H3 + body → items
 *   s-prices        H2 → pricingTitle, rows → pricing, prices written the
 *                   way the Veneers page writes them ("ab € 790,–"), the
 *                   paragraph under the table → pricingNote
 *   section--flush  → features, Kicker → topline, H2 → title
 *   FAQ             numbering removed
 *   Meta            → seo
 *
 * Dashes are replaced by a colon, comma or full stop; link anchors in square
 * brackets lose the brackets (the text fields cannot carry links).
 */
export default {
  id: "service-wurzelbehandlung",
  type: "service",
  source: "MP_LS_04_Wurzelbehandlung_v3_2026-10-12.docx",

  set: {
    "hero.claim": "Dein Zahn bleibt dein Zahn",
    "hero.text":
      "Ein Zahn, der wehtut, ist noch lange kein verlorener Zahn. Bei einer Wurzelbehandlung in Berlin arbeiten wir unter dem Zeiss Extaro 300, einem Mikroskop, das Kanäle sichtbar macht, die dünner sind als ein Haar. Was wir sehen, müssen wir nicht raten.",
    "hero.actionLabel": "Jetzt anrufen",

    intro: {
      topline: "Wenn der Nerv aufgibt",
      headline: "Wann ist eine Wurzelbehandlung nötig?",
      columns: [
        "Erst reagiert er auf Heißes. Dann auf Kaltes. Irgendwann pocht er nachts, und du liegst wach und googelst.",
        "Was dann passiert ist: Karies oder ein Riss haben den Nerv erreicht, und das Gewebe im Zahninneren entzündet sich. Von allein hört das nicht auf. Eine Wurzelbehandlung räumt den Nerv aus und verschließt den Kanal. Der Zahn bleibt. Ohne sie bliebe nur, ihn zu ziehen.",
      ],
    },

    benefits: {
      topline: "Licht an",
      headline: "Wurzelkanalbehandlung unter dem Mikroskop",
      items: [
        {
          _key: "b1",
          _type: "item",
          name: "Mehr sehen",
          text: "Ein Wurzelkanal ist kein Röhrchen, sondern ein Wurzelsystem: verzweigt, gebogen, teils haarfein. Unter dem Mikroskop werden Seitenkanäle sichtbar, die sonst durchrutschen. Bleibt einer unbehandelt, überleben dort Bakterien, und die Entzündung kehrt zurück.",
        },
        {
          _key: "b2",
          _type: "item",
          name: "Weniger wegnehmen",
          text: "Wer genau sieht, muss weniger raten. Wir tragen nur so viel Zahnsubstanz ab, wie nötig ist, um an den Kanal zu kommen. Was stehen bleibt, trägt den Zahn später.",
        },
        {
          _key: "b3",
          _type: "item",
          name: "Sicherer verschließen",
          text: "Am Ende zählt eine Sache: Ist der Kanal dicht? Wir messen elektrometrisch, spülen mit Ultraschall und kontrollieren unter Sicht, nicht nach Gefühl.",
        },
      ],
    },

    statement: {
      topline: "Unserem Ruf voraus",
      text: "Ein Dentalmikroskop kostet Zeit, Geld und Übung. Wir arbeiten trotzdem damit, weil man den Unterschied nicht sieht, sondern erst Jahre später merkt. Mit dem Zeiss Extaro erreichen wir eine sehr hohe Erfolgsrate. Die Endodontie machen bei uns Sarah Hartmann und Johanna Seer.",
    },

    explainer: {
      topline: "Die ehrliche Antwort",
      headline: "Tut eine Wurzelbehandlung weh?",
      columns: [
        "Der Weg zu uns tut meistens mehr weh als die Behandlung. Der Zahn wird betäubt, bevor wir anfangen: Du spürst Druck, keinen Schmerz. Der schlechte Ruf stammt aus einer Zeit ohne Mikroskop und ohne moderne Betäubung. Danach kann der Zahn drücken, meist ein bis zwei Tage. Und wenn dir schon beim Lesen mulmig wird: Sag es uns vorher. Wir können auch in Narkose oder mit Lachgas behandeln.",
      ],
    },

    steps: {
      title: "Wie läuft die Behandlung ab?",
      items: [
        {
          _key: "s1",
          _type: "schritt",
          title: "Erster Termin: Druck raus",
          text: "Betäuben, öffnen, das entzündete Gewebe entfernen. Der pochende Druck ist danach sofort weg. Das ist der Teil, den niemand erwartet.",
        },
        {
          _key: "s2",
          _type: "schritt",
          title: "Unter dem Mikroskop: Jeder Kanal einzeln",
          text: "Jeder Kanal wird unter Sicht gereinigt und vermessen. Frontzähne haben meist einen, Backenzähne bis zu vier. Bei vier Kanälen dauert das bis zu 90 Minuten, bei weniger entsprechend kürzer.",
        },
        {
          _key: "s3",
          _type: "schritt",
          title: "Dazwischen: Eine Einlage arbeitet",
          text: "Der Zahn bekommt ein Medikament und einen dichten provisorischen Verschluss. Die Entzündung klingt ab, bevor wir zumachen.",
        },
        {
          _key: "s4",
          _type: "schritt",
          title: "Zweiter Termin: Dicht gemacht",
          text: "Ist der Kanal entzündungsfrei, füllen wir ihn vollständig und verschließen den Zahn. Danach reden wir über eine Teilkrone: stabil ist der Zahn, elastisch nicht mehr.",
        },
      ],
    },

    pricingTitle: "Was kostet die Wurzelbehandlung?",
    pricing: [
      {
        _key: "p1",
        _type: "price",
        name: "Unter dem Mikroskop, 1 Kanal",
        price: "ab € 790,–",
      },
      {
        _key: "p2",
        _type: "price",
        name: "Unter dem Mikroskop, 2 Kanäle",
        price: "ab € 990,–",
      },
      {
        _key: "p3",
        _type: "price",
        name: "Unter dem Mikroskop, 3 Kanäle",
        price: "ab € 1.290,–",
      },
      {
        _key: "p4",
        _type: "price",
        name: "Unter dem Mikroskop, 4 Kanäle",
        price: "ab € 1.490,–",
      },
      {
        _key: "p5",
        _type: "price",
        name: "Präendodontischer Aufbau",
        price: "ab € 230,–",
      },
    ],
    pricingNote:
      "Die Behandlung unter dem Mikroskop ist eine Privatleistung. Bei klaren Erfolgsaussichten trägt die gesetzliche Kasse die Grundbehandlung; private Zusatzversicherungen übernehmen oft mehr.",

    features: [
      {
        _key: "f1",
        _type: "featureZeile",
        topline: "Mund auf, Ohren auf",
        title: "Beratung geht vor",
        text: "Zu Beginn hören wir dir erstmal zu: Wie können wir dir helfen, was stört dich, was wünschst du dir? Anschließend suchen wir gemeinsam nach passenden Lösungen und stimmen Materialien sowie Kosten mit dir ab. Am Ende soll dir schließlich nur aus einem Grund der Mund offen bleiben: dass dein Zahn bleibt.",
      },
      {
        _key: "f2",
        _type: "featureZeile",
        topline: "Sehen statt schätzen",
        title: "Unser Mikroskop",
        text: "Steht fest, dass wir den Zahn erhalten können, arbeiten wir unter dem Zeiss Extaro 300, nicht nach Erfahrungswert, sondern nach dem, was wir tatsächlich sehen.",
      },
      {
        _key: "f3",
        _type: "featureZeile",
        topline: "Keine halben Sachen",
        title: "Haltbarkeit deines Zahns",
        text: "Ein dicht verschlossener Wurzelkanal hält viele Jahre. Damit der Zahn nicht bricht, besprechen wir danach eine Teilkrone. Halbe Arbeit wäre hier die teuerste Variante.",
      },
    ],

    faq: [
      {
        _key: "q1",
        _type: "questionAnswer",
        question: "Wie lange hält ein wurzelbehandelter Zahn?",
        answer:
          "Bei dichtem Verschluss und stabiler Versorgung viele Jahre. Wichtiger als das Alter des Zahns ist, wie gut der Kanal verschlossen wurde.",
      },
      {
        _key: "q2",
        _type: "questionAnswer",
        question: "Braucht der Zahn nach der Wurzelbehandlung eine Krone?",
        answer:
          "Häufig ja. Ein wurzelbehandelter Zahn ist spröder als ein lebender und bricht leichter. Wir entscheiden das, sobald der Kanal dicht ist.",
      },
      {
        _key: "q3",
        _type: "questionAnswer",
        question: "Ist Ziehen eine Alternative zur Wurzelbehandlung?",
        answer:
          "Ja. Meistens die teurere. Eine Lücke bleibt keine Lücke: Der Nachbarzahn kippt, der Gegenzahn wächst nach. Was du beim Ziehen sparst, zahlst du beim Implantat mit Zinsen.",
      },
      {
        _key: "q4",
        _type: "questionAnswer",
        question: "Wie viele Sitzungen braucht eine Wurzelbehandlung?",
        answer:
          "In der Regel zwei, mit etwa einer Woche Abstand. Dazwischen arbeitet eine medikamentöse Einlage im Zahn, damit die Entzündung abklingt.",
      },
      {
        _key: "q5",
        _type: "questionAnswer",
        question: "Wie lange halten Schmerzen nach der Wurzelbehandlung an?",
        answer:
          "Sehr unterschiedlich: von gar nicht über ein bis zwei Tage, selten bis zu einer Woche. Wird es stärker statt schwächer, ruf an. Das ist keine Geduldsfrage.",
      },
      {
        _key: "q6",
        _type: "questionAnswer",
        question: "Zahlt die Krankenkasse die Wurzelbehandlung?",
        answer:
          "Bei klaren Erfolgsaussichten trägt die gesetzliche Kasse die Grundbehandlung. Längenmessung und Ultraschallspülung sind Privatleistungen, die private Zusatzversicherungen oft übernehmen.",
      },
    ],

    seo: {
      _type: "seo",
      title: "Wurzelbehandlung Berlin – Endodontie / Mundpropaganda",
      description:
        "Wurzelbehandlung Berlin: moderne Endodontie zum Zahnerhalt, präzise und möglichst schmerzfrei. Zahnarztpraxis im Prenzlauer Berg. Jetzt Termin vereinbaren.",
    },
  },

  notes: [
    "USP H2 'Warum Wurzelbehandlung bei Mundpropaganda?' dropped: the statement has no headline field.",
    "Steps kicker 'Zwei Termine, eine Woche dazwischen' dropped: steps have no topline. The cards are numbered 1 to 4, the agency asks that they do not read as four appointments.",
    "Explainer 'Tut eine Wurzelbehandlung weh?' renders before the steps; the document places it after them.",
    "Contact text not imported (no field), including the strongest line of the page: daily slots for acute pain.",
    "s-ba marked STREICHEN, not set. s-stories and s-quote OPEN, no material. Magazine teaser has no field; the existing post 'Wurzelbehandlung ohne Angst' already shows.",
    "Internal links (Narkose, Implantat, Notdienst) stay plain text; the third mandatory link (Zahnersatz) is still open with the SEO agency.",
    "'Jetzt anrufen' scrolls to the footer contact; it does not dial.",
  ],
};
