/**
 * Notdienst — third draft, Hannes' answers of 11.10.2026.
 *
 * A service like the others since 2026-10-14 (`service`, slug `notdienst`,
 * menu column "Behandlung", linked under the services table). From
 * 2026-10-13 it had its own page type with Portable Text sections; Flo
 * wanted the service layout and the place in the menu, so the text now
 * fills the service's blocks. What that costs, so nobody wonders later:
 * the service blocks are plain text, so the KZV and Charité links and the
 * tappable numbers inside the text are plain words and digits now. The
 * hero button still dials (`hero.actionLink`), and phones link digits on
 * their own.
 *
 * Mapping:
 *
 *   H1                      → topline ("Zahnarzt Notdienst in Berlin"),
 *                             title "Notdienst", claim the second half
 *   Markenzeile + Hero      → hero.text
 *   H2 1 "Akute Zahnschmerzen" → intro (two columns)
 *   "Und einmal deutlich: … 112" → statement
 *   H2 2 "Nachts und am Wochenende" → benefits (one item per H3)
 *   H2 3 "Was du bis zum Termin tun kannst" → steps (one card per H3)
 *   H2 4 "Kosten"           → explainer, button dials
 *   FAQ                     → faq
 *   Abschluss               → dropped: the service page ends on the FAQ,
 *                             and the number stands in the hero and the foot
 */
export default {
  id: "service-notdienst",
  type: "service",
  source: "MP_LS_13_Notdienst_v3_2026-10-12.docx",

  create: {
    title: "Notdienst",
    slug: { _type: "slug", current: "notdienst" },
    topline: "Zahnarzt Notdienst in Berlin",
    shortName: "Notdienst",
    placement: "liste",
    group: "behandlung",
    orderRank: "0|10002h:",
  },

  set: {
    "hero.claim": "Schnelle Hilfe bei Zahnschmerzen",
    "hero.text":
      "Wenn es jetzt wehtut, hilft dir kein Ratgeber. Deshalb zuerst das Wichtigste: Ruf uns an unter 030 5199 99580. Montag bis Donnerstag von 8 bis 20 Uhr, freitags von 8 bis 14:30 Uhr nehmen wir ab. Wenn du Schmerzen hast, sag das gleich am Telefon. Für Schmerzfälle halten wir jeden Tag Zeit frei. Das ist keine Kulanz, sondern so eingeplant. Außerhalb dieser Zeiten bist du bei uns falsch, aber nicht verloren. Weiter unten steht, wen du nachts, am Wochenende und an Feiertagen erreichst.",
    "hero.actionLabel": "Jetzt anrufen",
    "hero.actionLink": "tel:+493051999580",

    intro: {
      topline: "Akute Zahnschmerzen?",
      headline: "Ruf uns an",
      columns: [
        "Wir sind an beiden Standorten im Prenzlauer Berg erreichbar, in der Christburger Straße 37 und in der Prenzlauer Allee 25. Montags bis donnerstags bis 20 Uhr. Das ist später, als die meisten Praxen in Berlin geöffnet haben, und der Grund, warum sich viele Notfälle bei uns noch am selben Tag lösen lassen. Der letzte Termin beginnt um 19:45.",
        "Wann du nicht warten solltest: Manches kann bis morgen warten, manches nicht. Ruf sofort an, wenn ein Zahn pocht oder nachts wehtut, wenn dein Zahnfleisch oder deine Wange geschwollen ist, wenn ein Zahn abgebrochen oder ganz herausgeschlagen wurde, wenn eine Krone oder Füllung verloren gegangen ist oder wenn es nach einer Behandlung stärker blutet, als du erwartet hättest.",
      ],
    },

    statement: {
      topline: "Und einmal deutlich",
      text: "Wenn zu einer Schwellung Fieber, Schluckbeschwerden oder Atemnot kommen, oder wenn die Schwellung bis zum Auge reicht, ist das kein Fall für den zahnärztlichen Notdienst. Fahr in die nächste Notaufnahme oder ruf die 112. Eine Entzündung, die sich ausbreitet, kann gefährlich werden, und dann zählt nicht der Zahn, sondern die Zeit.",
    },

    benefits: {
      topline: "Nachts und am Wochenende",
      headline: "Wen du erreichst, wenn wir nicht da sind",
      items: [
        {
          _key: "b1",
          _type: "item",
          name: "Die zentrale Nummer",
          text: "Nach 20 Uhr, an Wochenenden und an Feiertagen sind wir nicht besetzt. Berlin hat dafür einen organisierten zahnärztlichen Notdienst. Unter 030 89004-333 erfährst du, welche Praxis gerade Dienst hat. Die Kassenzahnärztliche Vereinigung Berlin teilt ihn nach Bezirken ein: an Samstagen, Sonntagen und Feiertagen vormittags von 9 bis 12 Uhr und nachmittags von 15 bis 18 Uhr.",
        },
        {
          _key: "b2",
          _type: "item",
          name: "Wir sind selbst im Wochenenddienst",
          text: "Wenn du am Wochenende die Notdienstnummer anrufst, kann es gut sein, dass du bei uns landest. Wir nehmen am organisierten Notdienst der Kassenzahnärztlichen Vereinigung teil. Dafür werden wir eingeteilt, und an diesen Samstagen und Sonntagen sind wir da. Welche Praxis an einem bestimmten Tag Dienst hat, sagt dir die zentrale Nummer.",
        },
        {
          _key: "b3",
          _type: "item",
          name: "Nachts und in den Randzeiten",
          text: "Außerhalb dieser Fenster hilft die zahnärztliche Rettungsstelle der Charité in der Aßmannshauser Straße 4–6 in Wilmersdorf weiter. Sie ist werktags abends, samstags bis in die Nacht und sonntags tagsüber besetzt. Die aktuellen Zeiten stehen auf der Seite der KZV Berlin. Bitte dort nachsehen, bevor du losfährst.",
        },
        {
          _key: "b4",
          _type: "item",
          name: "Unsicher, ob es zahnärztlich ist?",
          text: "Dann hilft der ärztliche Bereitschaftsdienst unter 116 117 bei der Einordnung.",
        },
      ],
    },

    steps: {
      title: "Was du bis zum Termin tun kannst",
      items: [
        {
          _key: "s1",
          _type: "schritt",
          title: "Ein Zahn ist ganz herausgeschlagen",
          text: "Hier zählen Minuten. Fass den Zahn nur an der Krone an, nie an der Wurzel, und putz ihn nicht sauber: Die Zellen an der Wurzeloberfläche entscheiden darüber, ob er wieder anwächst. Am besten legst du ihn in eine Zahnrettungsbox aus der Apotheke. Hast du keine, tut es H-Milch, notfalls auch deine eigene Wangentasche. Nicht in Wasser legen. Und dann so schnell wie möglich zu uns oder in den Notdienst. Ist es ein Milchzahn, ruf uns zuerst an, bevor du etwas unternimmst. Für Kinder mit Schmerzen haben wir immer Zeit.",
        },
        {
          _key: "s2",
          _type: "schritt",
          title: "Ein Zahn ist abgebrochen",
          text: "Heb das Bruchstück auf und bring es mit, auch wenn es klein ist. Oft lässt es sich wieder ankleben. Spül den Mund mit lauwarmem Wasser und kühle von außen, wenn etwas geschwollen ist.",
        },
        {
          _key: "s3",
          _type: "schritt",
          title: "Krone oder Füllung ist herausgefallen",
          text: "Kein Notfall, aber auch nichts, was wochenlang warten sollte. Bewahre die Krone auf und bring sie mit. Klebe sie bitte nicht selbst fest: Sekundenkleber macht den Zahn unbrauchbar für das, was wir sonst noch retten könnten. Aus der Apotheke gibt es provisorischen Befestigungszement, der ein paar Tage überbrückt.",
        },
        {
          _key: "s4",
          _type: "schritt",
          title: "Schmerzen bis zum Termin",
          text: "Kühlen hilft, Wärme macht es schlimmer. Bei Schmerzmitteln ist Ibuprofen bei Zahnschmerzen meist die bessere Wahl, weil es zusätzlich entzündungshemmend wirkt. Finger weg von Aspirin, wenn vielleicht ein Eingriff ansteht: Es hemmt die Blutgerinnung. Halte dich an die Packungsbeilage und leg dich nachts eher hoch als flach. Im Liegen pocht es stärker.",
        },
        {
          _key: "s5",
          _type: "schritt",
          title: "Warum es nachts schlimmer wird",
          text: "Das bildest du dir nicht ein. Das Zahnmark sitzt in einer harten Kammer aus Dentin, die sich nicht ausdehnen kann. Entzündet es sich, schwillt es an, und weil der Raum fest ist, drückt alles direkt auf den Nerv. Im Liegen steigt der Blutdruck im Kopf zusätzlich, der Druck nimmt zu, und nachts fehlt jede Ablenkung. Deshalb ist zwei Uhr nachts die Stunde, in der die meisten Menschen nach einem Notdienst suchen. Schlaf mit erhöhtem Oberkörper, das nimmt einen Teil davon.",
        },
      ],
    },

    explainer: {
      topline: "Kosten",
      headline: "Was kostet eine Notfallbehandlung?",
      columns: [
        "Wenn du gesetzlich versichert bist und deine Gesundheitskarte dabeihast, übernimmt deine Krankenkasse die Schmerzbehandlung. Das gilt auch im organisierten Notdienst am Wochenende. Was darüber hinausgeht (eine neue Krone, eine Wurzelbehandlung, die Reparatur von Zahnersatz), rechnen wir ganz normal ab, und wir sagen dir vorher, was auf dich zukommt.",
        "Für den Dienst am Wochenende sieht die Gebührenordnung einen Zuschlag vor. Der ist nicht unsere Erfindung, sondern gilt überall. Innerhalb unserer Sprechzeiten berechnen wir keinen, auch dann nicht, wenn es abends einmal länger dauert.",
        "Privat versichert? Dann rechnen wir nach der Gebührenordnung für Zahnärzte ab. Wenn du magst, schätzen wir dir den Betrag am Telefon grob ein, bevor du kommst.",
      ],
      actionLabel: "Jetzt anrufen",
    },

    faq: [
      {
        _key: "q1",
        _type: "questionAnswer",
        question: "Was gilt als zahnärztlicher Notfall?",
        answer:
          "Alles, was starke Schmerzen macht, blutet, geschwollen ist oder plötzlich passiert ist. Konkret: pochender oder nachts zunehmender Zahnschmerz, eine dicke Wange, ein abgebrochener oder herausgeschlagener Zahn, eine Nachblutung nach einem Eingriff. Kein Notfall ist ein Zahn, der seit Monaten hin und wieder zwickt. Dafür reicht ein normaler Termin.",
      },
      {
        _key: "q2",
        _type: "questionAnswer",
        question: "Bekomme ich einen Termin ohne Voranmeldung?",
        answer:
          "Ruf bitte trotzdem vorher an. Nicht, um abgewiesen zu werden, sondern damit wir wissen, dass du kommst und womit wir rechnen müssen. Wer mit Schmerzen anruft, wird bei uns anders eingeplant als eine Kontrolle.",
      },
      {
        _key: "q3",
        _type: "questionAnswer",
        question: "Wann reicht ein normaler Termin?",
        answer:
          "Wenn du auf Kaltes oder Süßes kurz empfindlich reagierst, wenn eine Füllung rau geworden ist oder wenn Zahnfleisch beim Putzen leicht blutet. Unangenehm, aber nicht dringend. Ein Termin in den nächsten Tagen genügt.",
      },
      {
        _key: "q4",
        _type: "questionAnswer",
        question: "Mein Zahn ist nachts abgebrochen. Was jetzt?",
        answer:
          "Bruchstück aufheben, Mund ausspülen, von außen kühlen. Wenn es auszuhalten ist, ruf uns morgens früh an. Wenn nicht, geh über den Notdienst: 030 89004-333. Und falls du vor dem Zahnarzt ohnehin Angst hast: Das lässt sich einrichten, dazu steht mehr auf unserer Seite für Angstpatient:innen.",
      },
    ],

    seo: {
      _type: "seo",
      title: "Zahnarzt Notdienst Berlin – schnelle Hilfe bei Schmerzen",
      description:
        "Zahnarzt Notdienst Berlin: schnelle Termine bei Zahnschmerzen im Prenzlauer Berg, plus die richtigen Anlaufstellen für nachts und Wochenende. Jetzt anrufen.",
    },
  },

  notes: [
    "Links inside the text (KZV, Charité, tel: numbers, Wurzelbehandlung) are plain text in the service blocks; the hero button dials.",
    "Closing ('Im Zweifel: lieber einmal zu früh anrufen …') dropped: the service page ends on the FAQ.",
    "The 116 117 sentence became a fourth benefits item.",
    "The explainer's button jumps to the contact section (the foot with the number); only the hero button dials.",
    "The old `emergency` document (and its draft) still sits in the dataset without a schema; delete it in the Studio or with a script once the service is published.",
  ],
};
