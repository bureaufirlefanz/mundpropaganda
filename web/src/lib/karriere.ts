/**
 * Inhalte der Karriereseite.
 *
 * Liegt als Datei und nicht im Markup, aus demselben Grund wie fixtures.ts:
 * Die Seite soll aus Daten entstehen, damit dieselben Bausteine später aus
 * dem CMS gespeist werden können, ohne dass Markup umgebaut werden muss.
 * Die Formen unten sind bereits so geschnitten, dass ein Sanity-Dokumenttyp
 * „stelle“ sie eins zu eins abbildet.
 */

export interface Stelle {
  /** Wird zur Sprungmarke und zum Betreff der Bewerbungsmail. */
  kennung: string;
  titel: string;
  /** „Vollzeit“, „Teilzeit“, „Ausbildung“ — steht als Marke neben dem Titel. */
  art: string;
  standort: string;
  umfang: string;
  /** Zwei bis drei Sätze. Steht aufgeklappt über den Aufzählungen. */
  einleitung: string;
  aufgaben: string[];
  profil: string[];
  /** Optional: was diese Stelle besonders macht, in einem Satz. */
  besonderheit?: string;
}

export interface Zahl {
  wert: number;
  /** Was hinter der Zahl steht: „+“, „%“, „h“. Leer lassen, wenn nichts. */
  einheit?: string;
  text: string;
}

/* --- Zahlen -------------------------------------------------------------
   Bewusst wenige und überprüfbare Angaben. Eine Karriereseite, die mit
   „100 % Zufriedenheit“ wirbt, glaubt niemand. */

export const ZAHLEN: Zahl[] = [
  { wert: 2, text: "Standorte im Prenzlauer Berg, fünf Gehminuten auseinander" },
  { wert: 1, text: "Meisterlabor im Haus - Einprobe am Stuhl statt Versand" },
  { wert: 60, einheit: " min", text: "je Behandlungstermin, so im Kalender hinterlegt" },
  { wert: 5, text: "Fortbildungstage im Jahr, bezahlt und im Vertrag" },
];

/* --- Offene Stellen ---------------------------------------------------- */

export const STELLEN: Stelle[] = [
  {
    kennung: "zahnaerztin-aesthetik",
    titel: "Zahnärztin mit Schwerpunkt Ästhetik",
    art: "Vollzeit oder Teilzeit",
    standort: "Prenzlauer Allee 25",
    umfang: "ab sofort",
    einleitung:
      "Du behandelst mit 60 Minuten je Termin, eigener Einheit und einem Meisterlabor zwei Türen weiter. " +
      "Veneers und Vollkeramik machen wir täglich - was du davon noch nicht kannst, lernst du hier am Fall, " +
      "nicht im Kurs.",
    aufgaben: [
      "Ästhetische Rehabilitationen von der Analyse bis zur Einprobe",
      "Digitale Planung mit Intraoralscan, DVT und Mock-up",
      "Fallbesprechung mit dem Labor, bevor präpariert wird",
      "Eigener Recall - du behältst deine Patientinnen",
    ],
    profil: [
      "Approbation und mindestens drei Jahre am Stuhl",
      "Anspruch an Ästhetik, der über „passt schon“ hinausgeht",
      "Bereitschaft, Entscheidungen zu begründen - bei uns und gegenüber der Patientin",
    ],
    besonderheit: "Nach drei Jahren ist eine Beteiligung an der Praxis möglich.",
  },
  {
    kennung: "oralchirurgie",
    titel: "Zahnärztin für Implantologie und Oralchirurgie",
    art: "Vollzeit",
    standort: "Prenzlauer Allee 25",
    umfang: "ab Januar",
    einleitung:
      "Eigener OP mit DVT und geführter Implantologie. Du planst, setzt und versorgst selbst - " +
      "die prothetische Seite läuft mit der Kollegin nebenan zusammen, nicht gegen sie.",
    aufgaben: [
      "Implantationen, Augmentationen, Sinuslift",
      "Schablonengeführte Planung am DVT",
      "Weisheitszahnentfernung mit Eigenblutbehandlung",
      "Fachliche Führung der chirurgischen Assistenz",
    ],
    profil: [
      "Tätigkeitsschwerpunkt Implantologie oder Fachzahnarzt Oralchirurgie",
      "Erfahrung mit augmentativen Verfahren",
      "Ruhe im Umgang mit Komplikationen - und die Bereitschaft, sie zu besprechen",
    ],
  },
  {
    kennung: "vorbereitungsassistenz",
    titel: "Vorbereitungsassistenz",
    art: "Vollzeit",
    standort: "Beide Standorte",
    umfang: "ab sofort",
    einleitung:
      "Zwei Jahre strukturierte Assistenzzeit mit fester Mentorin, eigener Einheit ab dem dritten Monat " +
      "und wöchentlicher Fallbesprechung. Du sollst hier nicht mitlaufen, sondern behandeln lernen.",
    aufgaben: [
      "Konservierende und prothetische Behandlung unter Anleitung",
      "Assistenz bei Implantationen und ästhetischen Fällen",
      "Eigene Sprechstunde ab dem dritten Monat",
      "Dokumentation und Nachsorge deiner Fälle",
    ],
    profil: [
      "Approbation, Berufseinstieg oder erstes Jahr",
      "Interesse an digitaler Zahnmedizin",
      "Der Wille, Fragen zu stellen, bevor etwas schiefgeht",
    ],
    besonderheit: "Kurskosten und Freistellung für die Assistenzzeit übernehmen wir vollständig.",
  },
  {
    kennung: "kfo",
    titel: "Zahnärztin für Aligner-Therapie",
    art: "Teilzeit",
    standort: "Christburger Straße 37",
    umfang: "10–20 Stunden",
    einleitung:
      "Eigene Aligner-Sprechstunde mit fester Assistenz und eigenem Scanner. Du entscheidest über " +
      "Behandlungsplan und Intervalle selbst - Vorgaben zur Fallzahl gibt es nicht.",
    aufgaben: [
      "Planung und Kontrolle von Aligner-Behandlungen",
      "Digitale Abformung und Verlaufskontrolle",
      "Abstimmung mit der ästhetischen Kollegin bei kombinierten Fällen",
    ],
    profil: [
      "Approbation und Erfahrung in der Aligner-Therapie",
      "Sicherer Umgang mit Planungssoftware",
      "Freude daran, einen Verlauf über Monate zu begleiten",
    ],
  },
];

/* --- Vergleich: was üblich ist, und was hier gilt -----------------------
   Die linke Spalte beschreibt verbreitete Bedingungen in der Branche, nicht
   eine bestimmte Praxis. Das steht auch als Hinweis unter der Tabelle — ohne
   ihn läse sich die Spalte wie eine Behauptung über den Wettbewerb, und die
   wäre weder belegbar noch fair. */

export const VERGLEICH_SPALTEN = [
  { name: "Häufig üblich", meta: "Branchenschnitt" },
  { name: "Bei uns", meta: "Vertraglich", betont: true },
];

export const VERGLEICH_ZEILEN = [
  { name: "Zeit je Behandlungstermin", werte: ["30 Minuten", "60 Minuten"] },
  { name: "Umsatzvorgaben je Behandler", werte: ["verbreitet", "keine"] },
  { name: "Materialwahl", werte: ["Einkaufsliste der Praxis", "frei, nach Indikation"] },
  { name: "Meisterlabor im Haus", werte: [false, true] },
  { name: "Digitaler Workflow durchgängig", werte: [false, true] },
  { name: "Eigene Behandlungseinheit", werte: [false, true] },
  { name: "Fortbildungsbudget", werte: ["nach Absprache", "5 Tage + 4.000 €"] },
  { name: "Zeit für Hospitation und Fälle", werte: [false, true] },
  { name: "Dienstplan steht", werte: ["1–2 Wochen vorher", "6 Wochen vorher"] },
  { name: "Beteiligung an der Praxis", werte: [false, { pille: "Nach 3 Jahren" }] },
];

export const VERGLEICH_HINWEIS =
  "Die linke Spalte beschreibt Bedingungen, die in Zahnarztpraxen verbreitet sind - " +
  "erhoben aus Stellenausschreibungen und Branchenerhebungen, nicht aus einem Vergleich " +
  "mit einzelnen Häusern. Die rechte Spalte steht so in unseren Verträgen. " +
  "Die Beteiligung ist an eine dreijährige Zusammenarbeit geknüpft und wird " +
  "individuell verhandelt.";

/* --- Stimmen aus dem Team ---------------------------------------------- */

export const STIMMEN = [
  {
    zitat:
      "Ich hatte vorher zwanzig Minuten je Termin und habe permanent Kompromisse " +
      "gemacht, die ich fachlich nicht vertreten wollte. Hier plane ich eine Stunde " +
      "und mache die Arbeit, für die ich das Studium gemacht habe.",
    name: "Dr. Meret Kalb",
    rolle: "Zahnärztin, Schwerpunkt Ästhetik",
    dabeiSeit: "seit 2021",
    bild: "praxis-01",
    versatz: 0,
  },
  {
    zitat:
      "Das Labor sitzt zwei Türen weiter. Ich bespreche einen Fall vor der Präparation " +
      "mit dem Techniker und nicht per Beileger. Wer das einmal hatte, will nicht zurück.",
    name: "Dr. Ann-Sophie Bergmann",
    rolle: "Zahnärztin, Implantologie",
    dabeiSeit: "seit 2019",
    bild: "praxis-02",
    versatz: 1,
  },
  {
    zitat:
      "In der Assistenzzeit hatte ich ab dem dritten Monat eine eigene Sprechstunde - " +
      "und jede Woche eine Stunde, in der meine Fälle wirklich durchgesprochen wurden. " +
      "Das ist der Unterschied zwischen anlernen und ausbilden.",
    name: "Dr. Jorunn Deppe",
    rolle: "Zahnärztin, ehemals Vorbereitungsassistenz",
    dabeiSeit: "seit 2016",
    bild: "praxis-03",
    versatz: 0.5,
  },
];

/* --- Ablauf der Bewerbung ---------------------------------------------- */

export const ABLAUF = [
  {
    marke: "Tag 0",
    titel: "Kontaktaufnahme",
    text:
      "Eine E-Mail mit Lebenslauf genügt. Ein Anschreiben erwarten wir nicht - " +
      "schreib uns stattdessen, welche Schwerpunkte dich interessieren und ab " +
      "wann du verfügbar bist.",
  },
  {
    marke: "Bis Tag 5",
    titel: "Rückmeldung",
    text:
      "Du bekommst innerhalb von fünf Werktagen eine Antwort, in jedem Fall. " +
      "Auch eine Absage begründen wir fachlich, statt einen Textbaustein zu " +
      "verschicken.",
  },
  {
    marke: "Woche 2–3",
    titel: "Hospitation",
    text:
      "Du behandelst einen bezahlten Tag mit und lernst Abläufe, Labor und Team " +
      "kennen. Beide Seiten entscheiden danach auf einer belastbaren Grundlage.",
  },
  {
    marke: "Im Anschluss",
    titel: "Vertrag und Einarbeitung",
    text:
      "Wir unterbreiten ein schriftliches Angebot und lassen dir Zeit damit. Die " +
      "ersten drei Monate begleiten ein Einarbeitungsplan, eine feste Mentorin " +
      "und eine wöchentliche Fallbesprechung.",
  },
];

/* --- Häufige Fragen ---------------------------------------------------- */

export const KARRIERE_FAQ = [
  {
    frage: "Wie viel Zeit habe ich wirklich je Patientin?",
    antwort:
      "60 Minuten, und zwar so im Kalender hinterlegt. Erstberatungen dauern eine " +
      "volle Stunde, ästhetische Fälle länger. Wer aufholen muss, arbeitet unsauber; " +
      "das wollen wir uns nicht leisten.",
  },
  {
    frage: "Gibt es Vorgaben zu Umsatz oder Fallzahlen?",
    antwort:
      "Nein. Weder je Behandler noch je Termin. Was medizinisch nötig ist, entscheidest " +
      "du - und was nicht nötig ist, machen wir nicht, auch wenn es sich rechnen würde.",
  },
  {
    frage: "Wie ist die Praxis ausgestattet?",
    antwort:
      "DVT, zwei Intraoralscanner, geführte Implantologie, Mikroskop für die Endodontie " +
      "und ein Meisterlabor im Haus. Der Workflow ist durchgängig digital, von der " +
      "Abformung bis zur Fertigung.",
  },
  {
    frage: "Kann ich meinen Schwerpunkt weiterentwickeln?",
    antwort:
      "Das ist der Zweck der Sache. Fünf Fortbildungstage und 4.000 € stehen im Vertrag, " +
      "du wählst aus. Wer einen Tätigkeitsschwerpunkt anstrebt, bekommt die Fälle dafür " +
      "zugeteilt statt nur die Freistellung.",
  },
  {
    frage: "Ist eine Beteiligung an der Praxis möglich?",
    antwort:
      "Nach drei Jahren Zusammenarbeit, ja. Die Bedingungen verhandeln wir individuell - " +
      "wir sagen es aber von Anfang an, statt es als Karotte zu benutzen.",
  },
  {
    frage: "Ihr habt gerade nichts Passendes. Und jetzt?",
    antwort:
      "Schreib uns trotzdem. Wir besetzen selten aus dem Stand, sondern meist aus " +
      "Gesprächen, die ein halbes Jahr vorher angefangen haben.",
  },
];

/** Adresse für Bewerbungen. Steht an mehreren Stellen der Seite. */
export const BEWERBUNG_MAIL = "team@mundpropaganda.de";

/** Bewerbungslink mit vorbereitetem Betreff. */
export const bewerbungLink = (stelle?: Stelle) =>
  `mailto:${BEWERBUNG_MAIL}?subject=${encodeURIComponent(
    stelle ? `Bewerbung: ${stelle.titel}` : "Initiativbewerbung"
  )}`;
