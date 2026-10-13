/**
 * Notdienst — third draft, Hannes' answers of 11.10.2026.
 *
 * Its own page type since 2026-10-13 (`documents/emergency.ts`), not a
 * service: the service template had no place for numbers to tap, the
 * official emergency services or the A&E warning.
 *
 * Mapping:
 *
 *   H1                 → title (the full sentence; it is the page's <h1>)
 *   Markenzeile + Hero → lead, the brand line as its first sentence, because
 *                        the next one ("Deshalb zuerst das Wichtigste") leans
 *                        on it
 *   H2 1–4             → sections, the H3s as Portable Text h3
 *   "Und einmal deutlich: … 112" → the warning under section 1
 *   FAQ                → faq
 *   Abschluss          → closing
 *
 * Links: both emergency numbers are `tel:` links; the two external links the
 * brief allows go to the KZV's emergency page and the Charité's dental
 * emergency service (both checked 13.10.2026); "Wurzelbehandlung" links to
 * the service page. Neither external link opens a new window (SEO agency).
 */
let n = 0;
const key = () => `k${++n}`;

/** A paragraph from strings and `[text, href]` pairs. */
function p(...parts) {
  const markDefs = [];
  const children = parts.map((part) => {
    if (typeof part === "string")
      return { _type: "span", _key: key(), text: part, marks: [] };
    const [text, href] = part;
    const mark = key();
    markDefs.push({ _type: "link", _key: mark, href });
    return { _type: "span", _key: key(), text, marks: [mark] };
  });
  return { _type: "block", _key: key(), style: "normal", markDefs, children };
}

const h3 = (text) => ({
  _type: "block",
  _key: key(),
  style: "h3",
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});

const KZV = "https://www.kzv-berlin.de/fuer-patienten/notdienst";
const CHARITE = "https://paromoc.charite.de/zahnaerztlicher_notdienst/";

export default {
  id: "emergency",
  type: "emergency",
  source: "MP_LS_13_Notdienst_v3_2026-10-12.docx",

  create: {
    title: "Zahnarzt Notdienst in Berlin: schnelle Hilfe bei Zahnschmerzen",
  },

  set: {
    title: "Zahnarzt Notdienst in Berlin: schnelle Hilfe bei Zahnschmerzen",
    lead: "Wenn es jetzt wehtut, hilft dir kein Ratgeber. Deshalb zuerst das Wichtigste: Ruf uns an unter 030 5199 99580. Montag bis Donnerstag von 8 bis 20 Uhr, freitags von 8 bis 14:30 Uhr nehmen wir ab. Wenn du Schmerzen hast, sag das gleich am Telefon. Für Schmerzfälle halten wir jeden Tag Zeit frei. Das ist keine Kulanz, sondern so eingeplant. Außerhalb dieser Zeiten bist du bei uns falsch, aber nicht verloren. Weiter unten steht, wen du nachts, am Wochenende und an Feiertagen erreichst.",
    actionLabel: "Jetzt anrufen",

    sections: [
      {
        _key: "akut",
        _type: "emergencySection",
        headline: "Akute Zahnschmerzen? Ruf uns an",
        body: [
          p(
            "Wir sind an beiden Standorten im Prenzlauer Berg erreichbar, in der Christburger Straße 37 und in der Prenzlauer Allee 25. Montags bis donnerstags bis 20 Uhr. Das ist später, als die meisten Praxen in Berlin geöffnet haben, und der Grund, warum sich viele Notfälle bei uns noch am selben Tag lösen lassen. Der letzte Termin beginnt um 19:45.",
          ),
          h3("Wann du nicht warten solltest"),
          p(
            "Manches kann bis morgen warten, manches nicht. Ruf sofort an, wenn ein Zahn pocht oder nachts wehtut, wenn dein Zahnfleisch oder deine Wange geschwollen ist, wenn ein Zahn abgebrochen oder ganz herausgeschlagen wurde, wenn eine Krone oder Füllung verloren gegangen ist oder wenn es nach einer Behandlung stärker blutet, als du erwartet hättest.",
          ),
        ],
        warning:
          "Und einmal deutlich: Wenn zu einer Schwellung Fieber, Schluckbeschwerden oder Atemnot kommen, oder wenn die Schwellung bis zum Auge reicht, ist das kein Fall für den zahnärztlichen Notdienst. Fahr in die nächste Notaufnahme oder ruf die 112. Eine Entzündung, die sich ausbreitet, kann gefährlich werden, und dann zählt nicht der Zahn, sondern die Zeit.",
      },
      {
        _key: "nachts",
        _type: "emergencySection",
        headline: "Notdienst nachts und am Wochenende",
        body: [
          p(
            "Nach 20 Uhr, an Wochenenden und an Feiertagen sind wir nicht besetzt. Berlin hat dafür einen organisierten zahnärztlichen Notdienst, und der ist in diesen Stunden die richtige Adresse.",
          ),
          h3("Die zentrale Nummer"),
          p(
            "Unter ",
            ["030 89004-333", "tel:+493089004333"],
            " erfährst du, welche Praxis gerade Notdienst hat. Die ",
            ["Kassenzahnärztliche Vereinigung Berlin", KZV],
            " teilt den Dienst nach Bezirken ein: an Samstagen, Sonntagen und Feiertagen jeweils vormittags von 9 bis 12 Uhr und nachmittags von 15 bis 18 Uhr.",
          ),
          h3("Wir sind selbst im Wochenenddienst"),
          p(
            "Wenn du am Wochenende die Notdienstnummer anrufst, kann es gut sein, dass du bei uns landest. Wir nehmen am organisierten Notdienst der Kassenzahnärztlichen Vereinigung teil. Dafür werden wir eingeteilt, und an diesen Samstagen und Sonntagen sind wir da. Welche Praxis an einem bestimmten Tag Dienst hat, sagt dir die zentrale Nummer.",
          ),
          h3("Nachts und in den Randzeiten"),
          p(
            "Außerhalb dieser Fenster hilft die ",
            ["zahnärztliche Rettungsstelle der Charité", CHARITE],
            " in der Aßmannshauser Straße 4–6 in Wilmersdorf weiter. Sie ist werktags abends, samstags bis in die Nacht und sonntags tagsüber besetzt. Die aktuellen Zeiten stehen auf der Seite der KZV Berlin. Bitte dort nachsehen, bevor du losfährst.",
          ),
          p(
            "Wenn du dir unsicher bist, ob es überhaupt zahnärztlich ist, hilft der ärztliche Bereitschaftsdienst unter ",
            ["116 117", "tel:116117"],
            " bei der Einordnung.",
          ),
        ],
      },
      {
        _key: "bis-zum-termin",
        _type: "emergencySection",
        headline: "Was du bis zum Termin tun kannst",
        body: [
          h3("Ein Zahn ist ganz herausgeschlagen"),
          p(
            "Hier zählen Minuten. Fass den Zahn nur an der Krone an, nie an der Wurzel, und putz ihn nicht sauber: Die Zellen an der Wurzeloberfläche entscheiden darüber, ob er wieder anwächst. Am besten legst du ihn in eine Zahnrettungsbox aus der Apotheke. Hast du keine, tut es H-Milch, notfalls auch deine eigene Wangentasche. Nicht in Wasser legen. Und dann so schnell wie möglich zu uns oder in den Notdienst.",
          ),
          p(
            "Ist es ein Milchzahn, ruf uns zuerst an, bevor du etwas unternimmst. Für Kinder mit Schmerzen haben wir immer Zeit.",
          ),
          h3("Ein Zahn ist abgebrochen"),
          p(
            "Heb das Bruchstück auf und bring es mit, auch wenn es klein ist. Oft lässt es sich wieder ankleben. Spül den Mund mit lauwarmem Wasser und kühle von außen, wenn etwas geschwollen ist.",
          ),
          h3("Krone oder Füllung ist herausgefallen"),
          p(
            "Kein Notfall, aber auch nichts, was wochenlang warten sollte. Bewahre die Krone auf und bring sie mit. Klebe sie bitte nicht selbst fest: Sekundenkleber macht den Zahn unbrauchbar für das, was wir sonst noch retten könnten. Aus der Apotheke gibt es provisorischen Befestigungszement, der ein paar Tage überbrückt.",
          ),
          h3("Schmerzen bis zum Termin"),
          p(
            "Kühlen hilft, Wärme macht es schlimmer. Bei Schmerzmitteln ist Ibuprofen bei Zahnschmerzen meist die bessere Wahl, weil es zusätzlich entzündungshemmend wirkt. Finger weg von Aspirin, wenn vielleicht ein Eingriff ansteht: Es hemmt die Blutgerinnung. Halte dich an die Packungsbeilage und leg dich nachts eher hoch als flach. Im Liegen pocht es stärker.",
          ),
          h3("Warum es nachts schlimmer wird"),
          p(
            "Das bildest du dir nicht ein. Das Zahnmark sitzt in einer harten Kammer aus Dentin, die sich nicht ausdehnen kann. Entzündet es sich, schwillt es an, und weil der Raum fest ist, drückt alles direkt auf den Nerv. Im Liegen steigt der Blutdruck im Kopf zusätzlich, der Druck nimmt zu, und nachts fehlt jede Ablenkung. Deshalb ist zwei Uhr nachts die Stunde, in der die meisten Menschen nach einem Notdienst suchen. Schlaf mit erhöhtem Oberkörper, das nimmt einen Teil davon.",
          ),
        ],
      },
      {
        _key: "kosten",
        _type: "emergencySection",
        headline: "Was kostet eine Notfallbehandlung?",
        body: [
          p(
            "Wenn du gesetzlich versichert bist und deine Gesundheitskarte dabeihast, übernimmt deine Krankenkasse die Schmerzbehandlung. Das gilt auch im organisierten Notdienst am Wochenende. Was darüber hinausgeht (eine neue Krone, eine ",
            ["Wurzelbehandlung", "/leistungen/wurzelbehandlung"],
            ", die Reparatur von Zahnersatz), rechnen wir ganz normal ab, und wir sagen dir vorher, was auf dich zukommt.",
          ),
          p(
            "Für den Dienst am Wochenende sieht die Gebührenordnung einen Zuschlag vor. Der ist nicht unsere Erfindung, sondern gilt überall. Innerhalb unserer Sprechzeiten berechnen wir keinen, auch dann nicht, wenn es abends einmal länger dauert.",
          ),
          p(
            "Privat versichert? Dann rechnen wir nach der Gebührenordnung für Zahnärzte ab. Wenn du magst, schätzen wir dir den Betrag am Telefon grob ein, bevor du kommst.",
          ),
        ],
      },
    ],

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

    closing: {
      headline:
        "Im Zweifel: lieber einmal zu früh anrufen als eine Nacht zu lange warten.",
      text: "Du erreichst uns unter 030 5199 99580.",
      actionLabel: "Jetzt anrufen",
    },

    seo: {
      _type: "seo",
      title: "Zahnarzt Notdienst Berlin – schnelle Hilfe bei Schmerzen",
      description:
        "Zahnarzt Notdienst Berlin: schnelle Termine bei Zahnschmerzen im Prenzlauer Berg, plus die richtigen Anlaufstellen für nachts und Wochenende. Jetzt anrufen.",
    },
  },

  notes: [
    "The brand line 'Wenn es jetzt wehtut, hilft dir kein Ratgeber' opens the lead; the hero has no separate slot for it next to a sentence-long H1.",
    "Closing: 'alle weiteren Wege stehen auf unserer [Kontaktseite]' dropped, /kontakt does not exist.",
    "FAQ heading 'FAQ zum zahnärztlichen Notdienst' replaced by the site's standard FAQ head.",
    "'Angstpatient:innen' in FAQ 4 is plain text: the page exists only as a draft.",
    "Open with Hannes: spell out that a knocked-out milk tooth is not replanted?",
  ],
};
