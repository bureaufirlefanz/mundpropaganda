/**
 * CMD-Behandlung — fourth draft, Hannes' answers of 11 and 12.10.2026.
 *
 * Mapping as in `wurzelbehandlung.mjs`. Specific to this page: the document
 * runs intro, "Was ist CMD?", diagnosis steps, USP, treatment benefits,
 * "Zähneknirschen", prices. The template renders intro, benefits, statement,
 * explainer, steps, prices, so treatment now comes before diagnosis. The
 * first "Übergang" is the explainer; the second has no place (see notes).
 * The Botox module is GESPERRT and not imported.
 */
export default {
  id: "service-cmd-behandlung",
  type: "service",
  source: "MP_LS_07_CMD_v4_2026-10-12.docx",

  set: {
    "hero.claim": "Wenn bisher niemand etwas gefunden hat",
    "hero.text":
      "Kieferschmerzen, Knacken beim Kauen, Kopfschmerzen ohne Befund: CMD wird oft spät erkannt, weil die Beschwerden selten dort auftauchen, wo die Ursache liegt. Wir vermessen dein Kiefergelenk elektronisch mit dem Zebris JMA: 45 bis 60 Minuten, komplett schmerzfrei.",
    "hero.actionLabel": "Jetzt Termin buchen",

    intro: {
      topline: "Mehr als der Kiefer",
      headline: "Symptome: Woran erkennst du eine CMD?",
      columns: [
        "CMD zeigt sich selten nur am Kiefer. Typisch sind Schmerzen auf einer oder beiden Seiten, eine eingeschränkte Mundöffnung und Knacken beim Kauen.",
        "Dazu kommen oft Spannungskopfschmerzen, Migräne mit Aura, Verspannungen in Nacken und Schultern, Schwindel, Tinnitus oder Ohrenschmerzen. Wenn du davon mehrere kennst und dein Befund beim Hausarzt unauffällig war, lohnt sich ein Blick auf den Kiefer.",
      ],
    },

    benefits: {
      topline: "Selten nur eine Sache",
      headline:
        "Behandlung: von der Aufbissschiene bis zur Therapie-Koordination",
      items: [
        {
          _key: "b1",
          _type: "item",
          name: "Aufbissschiene",
          text: "Die Schiene entkoppelt Ober- und Unterkiefer und nimmt Druck aus dem Gelenk. Wir designen sie digital nach deinem Scan und fertigen sie im eigenen Praxislabor.",
        },
        {
          _key: "b2",
          _type: "item",
          name: "Physiotherapie und Ko-Behandler",
          text: "Oft braucht der Kiefer Unterstützung von außen. Wir arbeiten mit Physiotherapie, Osteopathie und, wo nötig, HNO oder Orthopädie zusammen.",
        },
        {
          _key: "b3",
          _type: "item",
          name: "Was die Kasse zahlt",
          text: "Bei der Schiene beteiligt sich die gesetzliche Kasse. Den Rest trägst du selbst oder deine Zahnzusatzversicherung. Die Zahlen stehen unten.",
        },
      ],
    },

    statement: {
      topline: "Unserem Ruf voraus",
      text: "Viele CMD-Diagnosen beruhen auf Tasten und Erfahrung. Wir messen zusätzlich elektronisch: Der Zebris JMA zeichnet auf, wie sich dein Kiefergelenk wirklich bewegt. Die Schienen entstehen danach digital designt in unserem eigenen Praxislabor, nicht als Standardgröße.",
    },

    explainer: {
      topline: "Ein System, kein Gelenk",
      headline: "Was ist CMD und wie entsteht sie?",
      columns: [
        "CMD steht für Craniomandibuläre Dysfunktion: Kiefergelenk, Kaumuskulatur und Zahnkontakte arbeiten nicht mehr sauber zusammen. Auslöser ist häufig Zähneknirschen, eine Volkskrankheit, die oft mit Stress zu tun hat. Auch Fehlstellungen, alte Füllungen mit zu hohem Kontakt oder Haltungsprobleme spielen mit hinein. Weil mehrere Faktoren zusammenkommen, reicht es selten, nur einen davon zu behandeln.",
      ],
    },

    steps: {
      title: "Diagnose: die Funktionsanalyse",
      items: [
        {
          _key: "s1",
          _type: "schritt",
          title: "Anamnese und Tasten",
          text: "Wir fragen nach Schmerzen, Schlaf, Stress und Vorbehandlungen und tasten Kiefergelenk und Kaumuskulatur ab. Schon das grenzt vieles ein.",
        },
        {
          _key: "s2",
          _type: "schritt",
          title: "Elektronische Vermessung mit dem Zebris JMA",
          text: "Du bekommst einen leichten Messbogen auf den Nasenrücken, ein Sensor wird an den Zähnen befestigt. Dann bewegst du den Kiefer, und wir zeichnen auf, was das Gelenk tatsächlich macht. Das dauert 45 bis 60 Minuten und tut nicht weh.",
        },
        {
          _key: "s3",
          _type: "schritt",
          title: "Intraoralscan",
          text: "Deine Zähne werden digital abgeformt, ohne Abdrucklöffel. Aus Scan und Messdaten entsteht dein individuelles Bewegungsmodell.",
        },
        {
          _key: "s4",
          _type: "schritt",
          title: "Befund besprechen",
          text: "Wir zeigen dir die Aufzeichnung und erklären, was wir sehen. Daraus wird der Behandlungsplan, nicht umgekehrt.",
        },
      ],
    },

    pricingTitle: "Was kostet eine CMD-Behandlung?",
    pricing: [
      {
        _key: "p1",
        _type: "price",
        name: "Aufbissschiene ohne Vermessung, dein Anteil",
        price: "ab € 200,–",
      },
      {
        _key: "p2",
        _type: "price",
        name: "Aufbissschiene ohne Vermessung, gesamt",
        price: "ab € 520,–",
      },
      {
        _key: "p3",
        _type: "price",
        name: "Zebris-Schiene mit Vermessung, dein Anteil",
        price: "ab € 1.000,–",
      },
      {
        _key: "p4",
        _type: "price",
        name: "Zebris-Schiene mit Vermessung, gesamt",
        price: "ab € 1.320,–",
      },
      {
        _key: "p5",
        _type: "price",
        name: "Zuschuss der gesetzlichen Kasse, beide Varianten",
        price: "€ 320,–",
      },
    ],
    pricingNote:
      "Es gibt zwei Stufen, und der Unterschied ist die Vermessung. Sie wird nicht getrennt berechnet. Eine Zahnzusatzversicherung übernimmt den Eigenanteil meistens.",

    features: [
      {
        _key: "f1",
        _type: "featureZeile",
        topline: "Mund auf, Ohren auf",
        title: "Beratung geht vor",
        text: "Zu Beginn hören wir dir erstmal zu: Wie können wir dir helfen, was stört dich, was wünschst du dir? Anschließend suchen wir gemeinsam nach passenden Lösungen und stimmen Materialien sowie Kosten mit dir ab. Am Ende soll dir schließlich nur aus einem Grund der Mund offen bleiben: weil er endlich wieder schmerzfrei aufgeht.",
      },
      {
        _key: "f2",
        _type: "featureZeile",
        topline: "Messen statt vermuten",
        title: "Unsere Diagnostik",
        text: "Bevor wir über eine Schiene reden, zeichnen wir auf, wie dein Kiefer sich bewegt. Was wir dir danach zeigen, ist deine Messung, keine Erfahrungswerte von jemand anderem.",
      },
      {
        _key: "f3",
        _type: "featureZeile",
        topline: "Keine halben Sachen",
        title: "Wir koordinieren mit",
        text: "CMD hört selten am Kiefer auf. Gehört Physiotherapie dazu, organisieren wir das mit, statt dich weiterzuschicken.",
      },
    ],

    faq: [
      {
        _key: "q1",
        _type: "questionAnswer",
        question: "Können Kiefergelenkschmerzen von selbst verschwinden?",
        answer:
          "Manchmal ja, vor allem wenn eine akute Belastungsphase vorbei ist. Kommen sie wieder oder bleiben sie länger als ein paar Wochen, solltest du sie abklären lassen.",
      },
      {
        _key: "q2",
        _type: "questionAnswer",
        question: "Welcher Arzt hilft bei Kiefergelenkschmerzen?",
        answer:
          "Der Einstieg ist meist die Zahnarztpraxis, weil Kiefergelenk und Zahnkontakte zusammengehören. Von dort koordinieren wir, wenn Physiotherapie, HNO oder Orthopädie dazugehören.",
      },
      {
        _key: "q3",
        _type: "questionAnswer",
        question: "Hilft eine Aufbissschiene gegen Zähneknirschen?",
        answer:
          "Sie hält das Knirschen nicht auf, schützt aber Zähne und Gelenk vor der Kraft. Viele schlafen damit außerdem ruhiger.",
      },
      {
        _key: "q4",
        _type: "questionAnswer",
        question: "Kann CMD Kopfschmerzen und Tinnitus verursachen?",
        answer:
          "Beides kann mit einer CMD zusammenhängen: Kiefergelenk und Ohr liegen dicht beieinander, und die Kaumuskulatur zieht bis in den Kopf. Anderes ausschließen lässt sich trotzdem nur durch Abklärung.",
      },
      {
        _key: "q5",
        _type: "questionAnswer",
        question: "Was kostet eine Knirscherschiene?",
        answer:
          "Das hängt davon ab, ob vorher vermessen wird. Ohne Kiefergelenkvermessung zahlst du ab 200 Euro selbst, mit Vermessung ab 1.000 Euro. Die Kasse gibt in beiden Fällen 320 Euro dazu. Eine Zahnzusatzversicherung übernimmt den Eigenanteil meistens.",
      },
    ],

    seo: {
      _type: "seo",
      title: "CMD-Behandlung Berlin – Hilfe bei Kiefergelenkschmerzen",
      description:
        "Kiefergelenkschmerzen? CMD-Behandlung beim Zahnarzt in Berlin: Diagnose, Aufbissschiene und koordinierte Therapie im Prenzlauer Berg. Jetzt Termin buchen.",
    },
  },

  notes: [
    "Existing title (hero heading) reads 'CMD mit Botoxbehandlung und elektronischer Kiefergelenksvermessung' in the seed. The document forbids advertising Botox before the training on 28.11.2026 (HWG). Title not touched here; it needs changing by hand.",
    "Botox module (GESPERRT, release from 29.11.2026 at the earliest) not imported. No field for a switchable module; costs and repeat interval are open.",
    "Order changed by the template: the document puts diagnosis (steps) before treatment (benefits) and the USP; the page renders benefits, statement, explainer, then steps.",
    "Second 'Übergang' not imported (only one explainer): Kicker 'Nachts, unbemerkt', H2 'Zähneknirschen und die Knirscherschiene', text 'Die meisten merken es nicht selbst: Partner:innen hören es, oder wir sehen die abgeriebenen Flächen. Knirschen ist eine Volkskrankheit und hat oft mit Stress zu tun. Eine Knirscherschiene stoppt das Knirschen nicht, aber sie fängt die Kraft ab, bevor sie deine Zähne und dein Gelenk trifft.' It carries the keyword 'knirscherschiene berlin' in an H2, required by the SEO brief.",
    "Steps kicker '45 bis 60 Minuten' dropped (no field). The duration stays inside step 2's text, as delivered, not in 'duration'.",
    "Co-treaters (Physiotherapie, Osteopathie, HNO, Orthopädie) in benefit b2, feature f3 and FAQ q2 are not confirmed by Hannes; Kerrin is researching. The agency calls the general wording usable.",
    "FAQ q5 keeps prices as running prose ('ab 200 Euro'), not in table notation.",
    "seo.title has no '/ Mundpropaganda' suffix, unlike the other pages; kept as delivered.",
    "Contact text not imported (no field): 'Bring mit, was du hast: Befunde, Aufnahmen, Notizen. Wir fangen mit Messen an, nicht mit Vermuten.'",
    "s-stories and s-quote OFFEN, no material. Magazine teaser (links to Aligner and Professionelle Zahnreinigung) has no field.",
    "Document URL suggestion /praxisleistungen/kiefergelenkschmerzen-cmd/ not followed; slug stays cmd-behandlung.",
  ],
};
