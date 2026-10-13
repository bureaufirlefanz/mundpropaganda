/**
 * Zahnarzt für Angstpatienten — third draft, Hannes' answers of 11.10.2026.
 *
 * Mapping as in `wurzelbehandlung.mjs`. The text under the price table goes
 * into `pricingNote`.
 *
 * New service: there is no published document yet, so `create` carries the
 * base fields. Publishing it adds the page to the navigation menu (column
 * "Behandlung"), the link list under the services table and the footer.
 */
export default {
  id: "service-angstpatienten",
  type: "service",
  source: "MP_LS_10_Angstpatienten_v3_2026-10-11.docx",

  create: {
    title: "Zahnarzt für Angstpatienten",
    slug: { _type: "slug", current: "angstpatienten" },
    topline: "Zahnarzt für Angstpatienten in Berlin",
    shortName: "Angstpatienten",
    placement: "liste",
    group: "behandlung",
    orderRank: "0|10002g:",
  },

  set: {
    "hero.claim": "Beim ersten Termin wird nicht behandelt",
    "hero.text":
      "Viele kommen zu uns, nachdem sie es jahrelang aufgeschoben haben. Der erste Termin ist deshalb nur ein Gespräch: Wir schauen, mehr nicht. Was danach kommt, entscheidest du: örtliche Betäubung, Lachgas, Dämmerschlaf oder eine Behandlung in Vollnarkose.",
    "hero.actionLabel": "Schreib uns",

    intro: {
      topline: "Du bist damit nicht allein",
      headline: "Zahnarztangst ist keine Einbildung",
      columns: [
        "Viele schieben Zahnarzttermine so lange auf, bis Schmerzen keine Wahl mehr lassen. Bis dahin ist aus einer kleinen Behandlung oft eine große geworden, und die Angst hat recht behalten.",
        "Genau diesen Kreis wollen wir unterbrechen. Nicht mit gutem Zureden, sondern mit einem Ablauf, bei dem du jederzeit weißt, was als Nächstes passiert. Und mit Verfahren, die dir die Behandlung abnehmen, wenn Reden nicht reicht.",
      ],
    },

    benefits: {
      topline: "Vielleicht gar keins",
      headline: "Lachgas oder Vollnarkose: was passt zu dir?",
      items: [
        {
          _key: "b1",
          _type: "item",
          name: "Lachgas",
          text: "Du bleibst wach, die Anspannung fällt ab. Wirkt nach Minuten und ist genauso schnell wieder draußen: Du kannst sofort wieder Auto fahren. Für die meisten reicht das.",
        },
        {
          _key: "b2",
          _type: "item",
          name: "Dämmerschlaf",
          text: "Mit Dormicum dämmerst du weg. Du wirst überwacht und brauchst jemanden, der dich abholt.",
        },
        {
          _key: "b3",
          _type: "item",
          name: "Vollnarkose",
          text: "Du schläfst vollständig. Die Narkose übernimmt ein externes Anästhesieteam, und zwar nur am Standort Prenzlauer Allee.",
        },
      ],
    },

    statement: {
      topline: "Unserem Ruf voraus",
      text: "Beim ersten Termin wird nicht behandelt. Wir schauen, hören zu und erklären, was möglich ist. Danach führen wir dich langsam heran, in dem Tempo, das du vorgibst, und mit dem Verfahren, das du willst, nicht dem, das schneller geht.",
    },

    explainer: {
      topline: "Nicht die Behandlung entscheidet, sondern du",
      headline: "Für wen ist eine Behandlung in Vollnarkose geeignet?",
      columns: [
        "Grundsätzlich lässt sich in Vollnarkose alles machen: von der Zahnreinigung über die Wurzelkanalbehandlung und das Ziehen eines Zahns bis zum Implantat. Die Frage ist also nicht, ob deine Behandlung dafür geeignet ist, sondern ob du sie anders schaffst. Wir behandeln ab zwölf Jahren in Vollnarkose und besprechen vorher in Ruhe, was ansteht. Wenn eine mildere Variante reicht, sagen wir dir das.",
      ],
    },

    steps: {
      title: "Wie läuft die Behandlung ab?",
      items: [
        {
          _key: "s1",
          _type: "schritt",
          title: "Erster Termin: nur schauen",
          text: "Kein Bohrer, keine Spritze. Wir sehen uns an, was ansteht, und besprechen, wie wir vorgehen können.",
        },
        {
          _key: "s2",
          _type: "schritt",
          title: "Verfahren wählen",
          text: "Gemeinsam entscheiden wir, ob örtliche Betäubung reicht oder ob Lachgas, Dämmerschlaf oder Vollnarkose dazukommen.",
        },
        {
          _key: "s3",
          _type: "schritt",
          title: "Behandlung",
          text: "Bei Lachgas und Dämmerschlaf behandeln wir in der Praxis. Für die Vollnarkose kommt das Anästhesieteam dazu, am Standort Prenzlauer Allee.",
        },
        {
          _key: "s4",
          _type: "schritt",
          title: "Danach",
          text: "Nach Lachgas kannst du direkt gehen und auch selbst fahren. Nach Dämmerschlaf und Vollnarkose holt dich jemand ab. Nach einer Narkose sehen wir dich meist am nächsten Tag noch einmal kurz. Ob das nötig ist, entscheiden wir von Fall zu Fall.",
        },
      ],
    },

    pricingTitle: "Was kostet eine Narkosebehandlung?",
    pricing: [
      {
        _key: "p1",
        _type: "price",
        name: "Lachgas, erste halbe Stunde",
        price: "ab € 150,–",
      },
      {
        _key: "p2",
        _type: "price",
        name: "Lachgas, jede weitere halbe Stunde",
        price: "ab € 90,–",
      },
      {
        _key: "p3",
        _type: "price",
        name: "Lachgas-Maske, einmalig",
        price: "ab € 20,–",
      },
      {
        _key: "p4",
        _type: "price",
        name: "Vollnarkose (externes Anästhesieteam)",
        price: "ab € 500,– / Stunde",
      },
    ],
    pricingNote:
      "Die Vollnarkose übernimmt die gesetzliche Kasse in der Regel nicht.",

    features: [
      {
        _key: "f1",
        _type: "featureZeile",
        topline: "Mund auf, Ohren auf",
        title: "Beratung geht vor",
        text: "Zu Beginn hören wir dir erstmal zu: Wie können wir dir helfen, was stört dich, was wünschst du dir? Anschließend suchen wir gemeinsam nach passenden Lösungen und stimmen Materialien sowie Kosten mit dir ab. Am Ende soll dir schließlich nur aus einem Grund der Mund offen bleiben: weil du dich wieder hintraust.",
      },
      {
        _key: "f2",
        _type: "featureZeile",
        topline: "Kein Tempo von außen",
        title: "Unser Vorgehen",
        text: "Wir führen dich langsam heran, Schritt für Schritt. Wenn ein Termin nur daraus besteht, dass du dich an den Stuhl gewöhnst, ist das ein Termin, der gezählt hat.",
      },
      {
        _key: "f3",
        _type: "featureZeile",
        topline: "Keine halben Sachen",
        title: "Was danach bleibt",
        text: "Ziel ist nicht die eine Behandlung, sondern dass du wiederkommst, irgendwann auch ohne Lachgas.",
      },
    ],

    faq: [
      {
        _key: "q1",
        _type: "questionAnswer",
        question: "Ist eine Vollnarkose beim Zahnarzt gefährlich?",
        answer:
          "Die Narkose übernimmt ein eigenes Anästhesieteam, das dich durchgehend überwacht. Vorher klären wir deine Vorerkrankungen und Medikamente ab: Genau dafür ist das Vorgespräch da.",
      },
      {
        _key: "q2",
        _type: "questionAnswer",
        question: "Zahlt die Krankenkasse die Narkosebehandlung?",
        answer:
          "In der Regel nicht. Die gesetzliche Kasse übernimmt die Vollnarkose nur in begründeten Ausnahmefällen, Lachgas ist die günstigere Alternative. Die Narkose rechnet das Anästhesieteam direkt mit dir ab: Ratenzahlung ist dort nicht möglich.",
      },
      {
        _key: "q3",
        _type: "questionAnswer",
        question:
          "Kann ich nach einer Behandlung mit Lachgas selbst nach Hause fahren?",
        answer:
          "Ja. Lachgas ist sofort wieder aus dem Körper, du bist direkt danach wieder fahrtüchtig. Nach Dämmerschlaf und Vollnarkose brauchst du jemanden, der dich abholt.",
      },
      {
        _key: "q4",
        _type: "questionAnswer",
        question: "Können alle Behandlungen in Vollnarkose gemacht werden?",
        answer:
          "Ja, grundsätzlich jede, von der Zahnreinigung über die Wurzelkanalbehandlung bis zum Implantat. Sinnvoll ist es vor allem, wenn mehrere Eingriffe zusammenkommen: Dann wird aus vielen Terminen einer.",
      },
      {
        _key: "q5",
        _type: "questionAnswer",
        question: "Wie fühlt sich eine Behandlung mit Lachgas an?",
        answer:
          "Warm und leicht. Du bekommst alles mit und kannst sprechen, aber es ist dir weniger wichtig. Viele beschreiben es als das erste Mal, dass sie im Behandlungsstuhl entspannt waren.",
      },
    ],

    seo: {
      _type: "seo",
      title: "Zahnarzt für Angstpatienten Berlin / Mundpropaganda",
    },
  },

  notes: [
    "NEW service: publishing adds it to the navigation menu (Behandlung), the link list under the services table and the footer. Rank 0|10002g: puts it last in the list, while Hannes wants the page prominent.",
    "Title, topline, shortName and slug chosen here, not by the agency. The document's own URL suggestion /praxisleistungen/narkosebehandlung-angstpatienten/ is the old scheme; the old page (205 clicks Jan to May) needs a redirect to /leistungen/angstpatienten.",
    "Hero headline variant A ('Beim ersten Termin wird nicht behandelt') is marked as used; the choice between A, B, C, D is still open with Mara + Flo.",
    "Benefits intro paragraph not imported (no field): 'Der Normalfall ist die örtliche Betäubung — oft reicht die. Und manchmal ist weniger zu tun als befürchtet. Was du brauchst, entscheiden wir gemeinsam.' Without it the kicker 'Vielleicht gar keins' has no reference.",
    "USP H2 'Warum Angstpatient:innen zu Mundpropaganda kommen' dropped: the statement has no headline field.",
    "Explainer 'Für wen ist eine Behandlung in Vollnarkose geeignet?' renders after the statement; the document places it before it.",
    "Steps kicker 'Dein Tempo' dropped: steps have no topline.",
    "Price notes element (VORSCHLAG, not approved) not imported: mask sentence plus Mediserv instalments, with the explicit exclusion of the anaesthesia. If it is ever added, the exclusion must come with it.",
    "seo.description is not in the document ('liegt im Brief vor', SEO brief 07). Left empty.",
    "s-ba not in the document. s-stories and s-quote OFFEN: no approved patient material. No field.",
    "Magazine teaser has no field: links to Weisheitszahn-OP and Unser Team.",
    "Contact text not imported (no field): 'Du musst nicht anrufen. Schreib uns', the callback CTA the brief asks for. Hero button 'Schreib uns' scrolls to the footer contact.",
  ],
};
