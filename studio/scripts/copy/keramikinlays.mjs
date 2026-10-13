/**
 * Keramikinlays, copy review after Hannes' feedback (agency template
 * "JM_..._nach Hannes Feedback angepasst", draft of 14.09.2026).
 *
 * Mapping as in `wurzelbehandlung.mjs`. The "Übergang" H2 "Alte
 * Amalgamfüllungen ersetzen" is the one explainer. The document has no
 * meta box, so `seo` is not set.
 */
export default {
  id: "service-keramikinlays",
  type: "service",
  source: "JM_MP_LS_02_Keramikinlays_Copy_nach Hannes Feedback angepasst.docx",

  set: {
    "hero.claim": "Sitzt die Füllung, stimmt das Labor",
    "hero.text":
      "Keramikinlays sind zahnfarbene Füllungen aus Keramik, die wir in unserem hauseigenen Praxislabor in Berlin mit Zeit und Präzision individuell für dich herstellen und anpassen. Statt Arbeiten unter Zeitdruck entstehen so natürliche Ergebnisse, die fest im Zahn sitzen und nur in ihrer Qualität Farbe bekennen.",
    "hero.actionLabel": "Jetzt Gespräch buchen",

    intro: {
      topline: "Einmal zu, Thema durch",
      headline: "Wann ist ein Keramikinlay die richtige Lösung?",
      columns: [
        "Die alte Füllung bricht schon wieder heraus, das dunkle Amalgam blitzt beim Lachen durch und du hast die Nase voll. Für kleine Defekte ist eine normale Kunststofffüllung eine gute Wahl.",
        "Wird der Defekt im Seitenzahn größer, ist ein Keramikinlay oft die bessere Lösung: Es hält deutlich länger, schließt präzise mit deinem Zahn ab und sitzt sauber am Nachbarzahn. Dazu ist Keramik besonders gut verträglich. Ist dein Zahn nicht stark genug, können wir über eine Krone oder Teilkrone sprechen. Individuell angepasst, sehen deine Inlays deinen Zähnen zum Verwechseln ähnlich.",
      ],
    },

    benefits: {
      topline: "Zeig Zähne",
      headline: "Zahnfarbene Füllung oder Inlay: Was passt wann?",
      items: [
        {
          _key: "b1",
          _type: "item",
          name: "Kompositfüllung",
          text: "Kleine, einflächige Defekte lassen sich meist mit einer weißen Komposit- oder Kunststofffüllung behandeln, die wir direkt im Mund modellieren. Besonders im Frontzahnbereich und bei Absplitterungen ist es eine schnelle und kostengünstige Variante, die bei guter Pflege bis zu sieben Jahre halten kann.",
        },
        {
          _key: "b2",
          _type: "item",
          name: "Keramikinlay",
          text: "Sobald das Inlay eine größere Fläche betrifft, empfehlen wir im Seitenzahnbereich meist eine Zahnfüllung aus Keramik statt Kunststoff. Es braucht eine gewisse Mindestschichtstärke und überzeugt dort, wo es am meisten zählt: der Haltbarkeit. Keramik kann 15 bis 20 Jahre, oft ein Leben lang, halten. Dazu kommen ein präziser Sitz mit mehr Kaukomfort, die zahnähnliche Farbe, bessere Biokompatibilität und weniger Angriffsfläche für Bakterien. Dein Keramikinlay fertigen wir passgenau in unserem Praxislabor an.",
        },
      ],
    },

    statement: {
      topline: "Unserem Ruf voraus",
      text: "Dein Inlay entsteht nicht zwischen zwei Stühlen, sondern bei uns im Haus aus Material, das wir selbst geprüft haben. Deine Zahnfläche wird digital per Intraoralscan vermessen und dein Inlay anschließend mit Zeit und Präzision von unseren Zahntechniker:innen angefertigt. Im Prenzlauer Berg liegt die Ruhe in der Qualität.",
    },

    explainer: {
      topline: "Tschüss Quecksilber",
      headline: "Alte Amalgamfüllungen ersetzen",
      columns: [
        "Amalgam springt ins Auge: Es ist dunkel, metallisch und seit dem 1. Januar 2025 in der EU für neue Füllungen verboten. Dass das Material zu einem Teil aus Quecksilber ist, stört viele unserer Patient:innen zusätzlich. Wir entfernen alte Amalgamfüllungen deshalb besonders schonend und ersetzen sie durch ein Keramikinlay, das alles andere als von gestern ist: individuell angepasst, zahnfarben und mit guter Biokompatibilität.",
      ],
    },

    steps: {
      title: "So läuft deine Behandlung ab",
      items: [
        {
          _key: "s1",
          _type: "schritt",
          title: "Erster Termin: Auf den Zahn fühlen",
          text: "Wir lernen uns kennen, nehmen deinen Befund auf und machen ein Röntgenbild. Danach besprechen wir gemeinsam, welche Lösung für deinen Zahn am besten passt.",
        },
        {
          _key: "s2",
          _type: "schritt",
          title: "Zweiter Termin: Scan statt Abdrucklöffel",
          text: "Wir entfernen die Karies, bringen deinen Zahn in Form und vermessen ihn digital per Intraoralscan, ganz ohne Abdrucklöffel. Bis dein Inlay fertig ist, schützt ein Provisorium deinen Zahn.",
        },
        {
          _key: "s3",
          _type: "schritt",
          title: "Dazwischen: Gut Ding braucht Labor",
          text: "Nun fertigen unsere Zahntechniker:innen dein Keramikinlay in unserem Praxislabor an, ganz in Ruhe und bis ins letzte Detail. Ein Inlay am selben Tag machen wir nur in Ausnahmefällen, etwa vor einer wichtigen Reise oder wenn du extra für deinen Termin nach Berlin kommst.",
        },
        {
          _key: "s4",
          _type: "schritt",
          title: "Dritter Termin: Wie angegossen",
          text: "Wir setzen dein Keramikinlay ein, kontrollieren den Sitz und passen bei Bedarf letzte Details an. Dank der Präzisionsarbeit aus unserem Labor sitzt es ab jetzt wie angegossen.",
        },
      ],
    },

    pricingTitle: "Was kostet ein Keramikinlay?",
    pricing: [
      { _key: "p1", _type: "price", name: "1-flächig", price: "€ 950,–" },
      { _key: "p2", _type: "price", name: "2-flächig", price: "€ 1.000,–" },
      { _key: "p3", _type: "price", name: "3-flächig", price: "€ 1.050,–" },
      { _key: "p4", _type: "price", name: "4-flächig", price: "€ 1.100,–" },
    ],

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
        text: "Steht das Inlay für deine Zähne fest, geht es für dich erstmal nach Hause und für uns in unser eigenes Praxislabor: Unsere Zahntechniker:innen fertigen es bewusst nicht am selben Tag an, da wir so eine Qualität erreichen, die unter Zeitdruck kaum möglich ist. Viele Praxen werben mit sofortigen „Chairside“-Inlays, haben dafür aber oft gar kein eigenes Labor. Wir machen es in echten Ausnahmefällen.",
      },
      {
        _key: "f3",
        _type: "featureZeile",
        topline: "Keine halben Sachen",
        title: "Haltbarkeit deines Keramikinlays",
        text: "Deine neue Füllung wird sich festhalten: Bei guter Pflege hält ein Keramikinlay 15 bis 20 Jahre, oft sogar ein Leben lang, eine Kompositfüllung meist 5 bis 7 Jahre. Beide Varianten sind Lösungen, bei denen wir für dich gerne aufs Ganze gehen.",
      },
    ],

    faq: [
      {
        _key: "q1",
        _type: "questionAnswer",
        question: "Wie lange hält ein Keramikinlay?",
        answer:
          "Bei guter Pflege hält ein Keramikinlay 15 bis 20 Jahre, oft sogar ein Leben lang, und muss im Vergleich zu einer Kompositfüllung nicht alle 5 bis 7 Jahre erneuert werden.",
      },
      {
        _key: "q2",
        _type: "questionAnswer",
        question: "Inlay oder Krone, was ist der Unterschied?",
        answer:
          "Ein Inlay ersetzt den beschädigten Teil deines noch starken Zahns, während eine Krone ihn komplett bedeckt. Wir setzen erst dann eine Krone oder Teilkrone ein, wenn nicht genug gesunde Zahnsubstanz für ein Inlay übrig ist.",
      },
      {
        _key: "q3",
        _type: "questionAnswer",
        question: "Zahlt die Krankenkasse ein Keramikinlay?",
        answer:
          "Der Kassenanteil ist gering und liegt meist zwischen 30 und 50 Euro. Die Kosten für das Keramikinlay selbst trägst du in der Regel privat.",
      },
      {
        _key: "q4",
        _type: "questionAnswer",
        question: "Ist ein Keramikinlay besser als eine normale Füllung?",
        answer:
          "Das hängt vom Defekt ab. Bei kleinen Defekten reicht oft eine Kompositfüllung. Bei größeren Flächen empfehlen wir eine Keramikfüllung, unter anderem wegen der deutlich längeren Haltbarkeit und natürlicher Ergebnisse.",
      },
      {
        _key: "q5",
        _type: "questionAnswer",
        question: "Wie viele Termine brauche ich?",
        answer:
          "In der Regel planen wir drei Termine: einen fürs Kennenlernen, einen für die Vorbereitung deines Zahns samt digitalem Scan und einen fürs Einsetzen. Dazwischen fertigen wir dein Inlay in Ruhe und mit viel Präzision im eigenen Labor an.",
      },
      {
        _key: "q6",
        _type: "questionAnswer",
        question: "Kannst du Amalgam einfach durch Keramik ersetzen lassen?",
        answer:
          "Ja, das machen wir häufig. Wir entfernen die alte Amalgamfüllung schonend und ersetzen sie durch ein zahnfarbenes Keramikinlay, das wir passend für deine Zähne selbst herstellen.",
      },
    ],
  },

  notes: [
    "Several module headers say OFFEN while the overview says ENTWURF (Übergang, USP, steps, prices, FAQ); all carry finished text and were imported.",
    "H1 alternative from the SEO agency not used: 'Keramikinlays in Berlin: zahnfarbene Füllung aus dem eigenen Labor'. Overview and focus keyword use the singular 'Keramikinlay'.",
    "Intro kicker variant 'Kleiner Defekt, großer Halt' not used.",
    "Step 4 heading fixed: 'Zweiter Termin: Wie angegossen' -> 'Dritter Termin: Wie angegossen' (three appointments per Hannes, C17).",
    "Step durations missing ('Dauer: ???'), still to be asked from Hannes; duration not set.",
    "Feature 2: closing quote around Chairside corrected to German quotes.",
    "Feature 3: dash before 'eine Kompositfüllung meist 5 bis 7 Jahre' replaced by a comma.",
    "Prices taken from the fee list; agency asks for approval (C19), no answer in the document. Prices have no 'ab'. Row names '1-flächig' etc. are the kind of term Hannes says lay readers do not understand.",
    "'oft ein Leben lang' appears in benefits, feature 3 and FAQ 1; Hannes wrote 'mitunter ein Leben lang' (C8). Agency asks for one bundled approval.",
    "Statement claims materials 'die wir selbst geprüft haben'; agency question C16 (is there an actual testing process?) is unanswered.",
    "Feature 2 compares with other practices ('haben dafür aber oft gar kein eigenes Labor').",
    "Explainer: SEO brief says the old Amalgam page 301s to this section; the protective removal protocol was cut and is still to be asked from Hannes (C13).",
    "s-ba OFFEN, not set. Agency suggests Amalgam vs. Keramik on the same tooth, placed right after the Amalgam section (C15).",
    "No meta title/description in this document; seo not set.",
    "Contact text not imported (no field): 'Noch unsicher, ob Keramikinlays deine Lösung sind? Lass uns einfach sprechen.' CTA 'Jetzt sprechen!'.",
    "Link anchors (Krone oder Teilkrone, unserem Praxislabor) stay plain text.",
  ],
};
