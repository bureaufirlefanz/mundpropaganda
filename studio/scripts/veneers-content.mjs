/**
 * Der Text der Leistungsseite Veneers, Fassung der Textagentur.
 *
 * Quelle: „Veneers in Berlin · Copy-Review", Entwurf vom 07.09.2026, neu
 * strukturiert am 14.09.2026, Kommentare bis 17.09.2026 (Google Doc der
 * Agentur, als .docx exportiert). Ansprache durchgehend „du", Fokus-Keyword
 * „veneers berlin".
 *
 * Der Stand vom 07.09. wurde am 09.09. mit diesem Skript veröffentlicht.
 * Diese Fassung zieht den Datensatz auf den 14.09. nach. Das Skript schreibt,
 * was dort als ENTWURF (copy-fertig) steht:
 *
 *   · Hero samt Anspruch („Wir feilen am Lächeln, nicht an der Substanz")
 *     und eigener Beschriftung des Buttons
 *   · Intro, die drei Veneer-Arten, Vorher/Nachher, Qualitätsversprechen
 *   · das Erklärstück zum Abschleifen
 *   · der Ablauf in vier Schritten, jeder mit Dauer
 *   · die Preistabelle samt Überschrift
 *   · die ersten beiden der drei Bild-Text-Zeilen (Beratung, Praxislabor)
 *   · fünf der sechs Fragen mit Antwort
 *
 * ── Was das Skript NICHT anfasst ─────────────────────────────────────────
 *
 * **Frage 4, „Tut die Behandlung weh?"** Im Entwurf „Antwort steht noch
 * aus". Hannes hat in einem Kommentar Stichpunkte geliefert (individuell,
 * hängt von Schmerzempfindlichkeit, Zustand der Zähne und Abtrag ab, bei
 * Bedarf örtliche Betäubung), ausformuliert ist es nicht. Die Frage steht
 * deshalb noch nicht auf der Seite; sie kommt als Eintrag `f4` an vierter
 * Stelle dazu, sobald die Agentur die Antwort freigibt.
 *
 * **Die dritte Bild-Text-Zeile („Haltbarkeit").** Im Entwurf nur „xxx". Die
 * bestehende Zeile „Danach / Was in fünf Jahren ist" bleibt stehen.
 *
 * **Transformation Stories, Zitat, Magazinteaser, Kontakt.** Im Entwurf
 * OFFEN, weil sie echte Fälle, echte Zitate oder Abstimmung brauchen.
 *
 * **Die Veneer-Arten sind länger als das Wortbudget.** Der Entwurf markiert
 * den Abschnitt als OFFEN (163 statt 95 Wörter) und fragt, ob fachliche
 * Präzisierung vor dem Wortlimit geht. Die Texte sind nach Hannes' fachlichem
 * Feedback korrigiert: Non-Prep kommt „meist ohne oder mit minimaler
 * Bearbeitung" aus, nicht „ganz ohne Beschleifen" und „reversibel" wie im
 * alten Stand; Komposit wird per F.I.T.-Injektionstechnik eingebracht, nicht
 * freihändig modelliert. Fachlich falsch darf auf einer Arztseite nicht
 * stehen bleiben, deshalb gehen die längeren Texte rein. Die feste Höhe der
 * Liste in `sections/Benefits.astro` (23rem) ist danach zu prüfen.
 *
 * **Die SEO-Felder und alle Bilder.** Wie gehabt: Die SEO-Felder zieht
 * `scripts/service-seo.mjs`, leere Bildfelder fallen auf die gestalteten
 * Motive zurück.
 *
 * ── Was gegenüber dem Entwurf abweicht ───────────────────────────────────
 *
 *   · **Gedankenstriche** sind durch Kommas oder Punkte ersetzt. Hausregel,
 *     siehe `pruefeStriche()` unten. Die Preisschreibweise „450,–" und
 *     Zahlenbereiche sind ausgenommen.
 *   · **Zwischenzeilen und Kicker:** Wo der Entwurf Kandidaten nennt, steht
 *     der erstgenannte im Datensatz: „Kleine Lücke, große Wirkung" (Intro),
 *     „Zeig Zähne" (Arten), „Unser Wort" (Erklärstück), „Präzision statt
 *     Kopie" (Praxislabor). Umentscheiden geht im Studio.
 *   · **„was du dir wünschst"** — im Entwurf „wünscht".
 *   · **Die Dauer des vierten Schritts** heißt im Entwurf „je nach Anzahl
 *     bis zu 180 Minuten und ca. 30 Minuten". Hier steht, worauf sich die
 *     zweite Zahl bezieht (Nachsorge).
 *   · **Die Dauerangaben** verwenden durchgehend „bis" statt eines
 *     Streckenstrichs. Der Entwurf macht es bei dreien von vier so.
 *   · **Mock-up** steht im Entwurf vom 14.09. „pro Zahn". Die Frage aus dem
 *     07.09. (Zahn oder Kiefer) ist damit im Dokument beantwortet.
 *
 * ── Die Preise ───────────────────────────────────────────────────────────
 *
 * Die Zahlen des Entwurfs stehen seit dem 09.09. im Datensatz. Die Pillar
 * Page (`web/src/content/veneers-pillar.ts`) nannte zuletzt andere
 * (Keramik 1.200, Non-Prep 1.400, Mock-up ab 450 / Kiefer) und muss
 * denselben Zahlen folgen. Neu gegenüber dem 09.09.: Mock-up pro Zahn, nicht
 * pro Kiefer, und die Überschrift trägt das Fokus-Keyword.
 *
 * **Aufruf**
 *
 *     cd studio && DRY=1 npx sanity exec scripts/veneers-content.mjs --with-user-token
 *     cd studio && DRAFT=1 npx sanity exec scripts/veneers-content.mjs --with-user-token
 *     cd studio && npx sanity exec scripts/veneers-content.mjs --with-user-token
 *
 * `DRY=1` schreibt nichts. `DRAFT=1` schreibt in den Entwurf, sodass der Stand
 * im Studio als „unveröffentlichte Änderung" liegt und in der Vorschau
 * ansehbar ist, bevor ihn jemand veröffentlicht. Ohne beides geht der Text
 * direkt in das veröffentlichte Dokument.
 *
 * Wiederholtes Ausführen ist harmlos.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-28" });
const DRY = process.env.DRY === "1";
const DRAFT = process.env.DRAFT === "1";

const PUBLISHED = "service-veneers";
const ID = DRAFT ? `drafts.${PUBLISHED}` : PUBLISHED;

/* --- Hero ---------------------------------------------------------------
   Die Überschrift der Seite bleibt der Leistungsname; der Anspruch steht als
   eigene Zeile darunter (`hero.claim`). Ein ganzer Satz im Grad der
   Überschrift liefe ins Bild daneben — siehe `sections/ServiceHero.astro`. */

const HERO = {
  claim: "Wir feilen am Lächeln, nicht an der Substanz",
  text: "Veneers sind hauchdünne Keramik- oder Kompositschalen, mit denen wir in Berlin täglich natürlich-strahlende Lächeln schaffen. Jede Korrektur stimmen wir genau auf dich ab und achten dabei auf deine gesunde Zahnhartsubstanz. Hannes und Kerrin, unsere Spezialist:innen, lernst du schon im ersten Gespräch kennen.",
  actionLabel: "Jetzt Zähne zeigen",
};

/* --- Intro --------------------------------------------------------------
   Ein Absatz im Entwurf, hier auf die zwei Spalten des Bausteins verteilt.
   Die Naht liegt nach dem Problem („obwohl deine Zähne völlig gesund
   sind") und vor der Antwort darauf — nicht mitten in einem Gedanken. */

const INTRO = {
  topline: "Sind Veneers für mich?",
  headline: "Kleine Lücke, große Wirkung",
  columns: [
    "Oft ist es nur eine leichte Verfärbung, Zahnform oder Lücke, die dich beim Lachen zögern oder auf Fotos die Lippen zusammenkneifen lässt. Und das, obwohl deine Zähne völlig gesund sind.",
    "Wir nehmen das ernst und wollen dir beides zurückgeben: Veneers können kleine Unstimmigkeiten ohne große Eingriffe ausgleichen und dich wieder befreit lachen lassen, ohne dabei gesunde Substanz zu riskieren. Als Expert:innen raten wir aber auch mal ehrlich davon ab, wenn eine andere Lösung besser zu dir passt.",
  ],
};

/* --- Die drei Arten -----------------------------------------------------
   Fachlich nach Hannes' Feedback korrigiert und darum länger als das
   Wortbudget, siehe Kopf der Datei. Die Liste klappt genau einen Eintrag auf
   und hat dafür eine feste Höhe (23rem, siehe `sections/Benefits.astro`),
   die mit dem längeren Text zu prüfen ist. Der weiterführende Satz mit den beiden
   Verweisen auf die Pillar Page steht nicht hier, sondern in
   `web/src/content/service-crosslinks.ts` — sein Ziel ist eine Seite im
   Repository und kein Dokument im Datensatz. */

const BENEFITS = {
  topline: "Zeig Zähne",
  headline: "Welche Veneer-Art passt zu mir?",
  items: [
    {
      key: "e1",
      name: "Keramikveneers",
      text: "Die gebräuchlichste Form unter den Verblendschalen, gefertigt aus lichtdurchlässiger Keramik. Wie natürliche Zähne brechen sie das Licht, dein Ergebnis lässt sich dadurch kaum von echten Zähnen unterscheiden. Farbe, Form und Oberflächenstruktur passen wir dabei individuell an dich an. Ideal bei stärkeren Verfärbungen oder größeren Formkorrekturen und bei guter Pflege besonders langlebig.",
    },
    {
      key: "e2",
      name: "Komposit-Veneers",
      text: "Die schnellere, schonende und vergleichsweise kostengünstige Variante. Aus dem digitalen Modell deines Wunschlächelns entsteht eine transparente Form. Wir arbeiten mit F.I.T.-Injektionstechnik und bringen das Komposit präziser und gleichmäßiger als beim freihändigen Modellieren ein. Ideal bei kleineren Korrekturen, das Einsetzen erfolgt in einer Sitzung.",
    },
    {
      key: "e3",
      name: "Non-Prep-Veneers",
      text: "Diese Keramikschalen sind nur 0,2 bis 0,3 Millimeter dünn und kommen meist ohne oder mit minimaler Bearbeitung durch Polieren oder Glätten von Kanten aus. Ideal, wenn ohnehin Platz vorhanden ist, etwa bei kleinen Zähnen oder leichten Lücken. Die Indikation dafür ist eng, deshalb prüfen wir vorab genau, ob das bei deinen Zähnen optimal gelingt.",
    },
  ],
};

/* --- Vorher / Nachher ---------------------------------------------------
   Nur die Topline kommt aus dem CMS. Der Bedienhinweis am Regler („Ziehe
   fürs Ergebnis") steht im Baustein, weil er für jeden Vergleich derselbe
   ist. */

const BEFORE_AFTER_TOPLINE = "Vorher vs. Nachher";

/* --- Qualitätsversprechen ------------------------------------------------ */

const STATEMENT = {
  topline: "Unserem Ruf voraus",
  text: "Wenn uns scharfe Zungen eins nachsagen, dann dass bei uns kein Zahn dem Zufall überlassen wird. Durch präzise, digitale Planung und ein hauseigenes Praxislabor können wir neue Qualitätsstandards setzen und für den Erhalt gesunder Zahnsubstanz einstehen. Es zählt eben nicht nur das Endergebnis, sondern auch, dass du dich von Anfang an bei uns abgeholt fühlst.",
};

/* --- Erklärstück --------------------------------------------------------
   Eine Spalte, nicht zwei: 57 Wörter auf zwei Spalten verteilt ergäben eine
   Spalte aus anderthalb Sätzen. Die Topline ist der Zwischenzeilen-Kandidat
   des Entwurfs. */

const EXPLAINER = {
  topline: "Unser Wort",
  headline: "Wieso wir radikales Abschleifen vermeiden",
  columns: [
    "Die Frage, die uns bei Veneers oft gestellt wird: Müssen meine Zähne radikal abgeschliffen werden? Wir setzen dabei bewusst auf Fingerspitzengefühl, denn schon ein Mikrometer zu viel ist einer, der dir später unnötig fehlt. Das Wie hängt tatsächlich von deinen Zähnen sowie der gewählten Veneer-Art ab. Deswegen klären wir jeden Schritt immer im Voraus mit dir ab.",
  ],
};

/* --- Ablauf -------------------------------------------------------------
   Die Überschriften sind die des Entwurfs, nicht die Sachbegriffe aus dem
   SEO-Briefing (Vorbereitung, Mock-up, Präparation, Einsetzen) — auf der
   Seite steht, was die Agentur als Überschrift gesetzt hat.

   `duration` ist ein eigenes Feld und steht abgesetzt unter dem Text. Vier
   Karten, die alle mit „Dauer: ..." enden, lesen sich als vier Nachklappern
   statt als eine Angabe, die man vergleichen kann. */

const STEPS = {
  title: "Alle guten Dinge sind vier",
  items: [
    {
      key: "schritt-0",
      title: "Abdruck war gestern",
      text: "Wir lernen uns kennen, besprechen Wünsche und Budget und halten deine Zähne per digitaler Abformung mit Scan und Foto fest. Sie ersetzt den klassischen Abdrucklöffel, ganz ohne unangenehme Masse und Würgereiz.",
      duration: "ca. 30 bis 60 Minuten",
    },
    {
      key: "schritt-1",
      title: "Probelächeln für später",
      text: "Dein vorab angefertigtes, provisorisches Modell zeigt dir, ob Form, Farbe und Ausdruck später passen. Gefällt dir das Ergebnis, reden wir über die nächsten Schritte.",
      duration: "ca. 30 bis 60 Minuten",
    },
    {
      key: "schritt-2",
      title: "Feinschliff mit Maß",
      text: "Nun bereiten wir deine Zähne schonend vor. Dafür wird die Oberfläche, außer bei Non-Prep-Veneers, minimal beschliffen.",
      duration: "je nach Anzahl ca. 45 bis 180 Minuten",
    },
    {
      key: "schritt-3",
      title: "Natürlich Zähne zeigen",
      text: "Deine im Labor maßgefertigten Veneers werden präzise eingesetzt und final angepasst. Passt etwas noch nicht, gibt es weitere Einproben. Passt alles, kommst du eine Woche später zur Nachsorge.",
      duration: "je nach Anzahl bis zu 180 Minuten, Nachsorge ca. 30 Minuten",
    },
  ],
};

/* --- Kosten -------------------------------------------------------------
   Siehe den Vorbehalt im Kopf dieser Datei. Das „ab" steht im getippten Wert,
   weil das Schema der Leistungsseiten für den Preis eine freie Zeichenkette
   führt; die Schalterfassung (`from`, `unit`) trägt nur die Pillar Page. */

const PRICING_TITLE = "Was kosten Veneers in Berlin?";

const PRICING = [
  { key: "p1", name: "Komposit-Veneer", price: "ab € 450,– / Zahn" },
  { key: "p2", name: "Keramikveneer", price: "ab € 1.500,– / Zahn" },
  { key: "p3", name: "Non-Prep-Veneers", price: "ab € 1.800,–" },
  { key: "p4", name: "Mock-up", price: "ab € 150,– / Zahn" },
  { key: "p5", name: "Digitale Planung", price: "€ 190,–" },
];

/* --- Beratungsversprechen, Schritte eins und zwei -----------------------
   Der Entwurf liefert von den drei Schritten diese beiden. Die Kommentare
   dazu einigen sich auf die drei USPs „individuelle Beratung, Qualität durch
   Praxislabor, Haltbarkeit". Schritt drei („Haltbarkeit") ist ungeschrieben;
   die bestehende dritte Zeile bleibt stehen. */

const FEATURES = [
  {
    key: "feature-0",
    topline: "Mund auf, Ohren auf",
    title: "Deine Wünsche",
    text: "Bevor wir mit dir über Material oder Preis sprechen, hören wir dir erstmal richtig zu. Wir wollen wissen, was dich stört, was du dir wünschst und wie wir dir helfen können. Erst dann suchen wir nach Lösungen, die fachlich und persönlich für dich stimmen können. Dabei zeigen wir dir Materialien und Möglichkeiten, die wir dir als Spezialist:innen empfehlen. Wenn es dann noch um die Kosten geht, soll dir nicht der Mund offen bleiben, sondern alles im Voraus klar sein.",
  },
  {
    key: "feature-1",
    topline: "Präzision statt Kopie",
    title: "Unser Praxislabor",
    text: "Sobald Art, Form und Ton feststehen, geht es an die Präzisionsarbeit im Labor. Als Zahnärzt:innen arbeiten wir mit Mikrometer, einem Tausendstel Millimeter. Das ist dünner als ein menschliches Haar. Um deine Veneers bis ins letzte Detail auf deine Zahnform und deinen Hautton abstimmen zu können, stellen wir sie in unserem eigenen Praxislabor im Prenzlauer Berg her oder arbeiten mit spezialisierten Partnerlaboren zusammen. Wer nach deinem Lächeln fragt, wird keine Kopie bekommen.",
  },
];

/* --- Fragen -------------------------------------------------------------
   Reihenfolge und Wortlaut der Fragen sind die des SEO-Briefings („bleiben
   fix formuliert"). Frage 4 fehlt, siehe Kopf der Datei; ihr Schlüssel `f4`
   ist dafür reserviert. Die Liste wird ganz ersetzt: Der alte Stand hatte
   andere Fragen und einen Testeintrag („Wie funktioniert das alles?"). */

const FAQ = [
  {
    key: "f1",
    question: "Was zahlt die Krankenkasse bei Veneers?",
    answer:
      "Die gesetzliche Krankenkasse übernimmt keine Kosten, da Veneers eine rein ästhetische Leistung sind. Manche privaten Zusatzversicherungen beteiligen sich anteilig. Am besten checkst du das vorab mit deiner Versicherung.",
  },
  {
    key: "f2",
    question: "Wie lange halten Veneers?",
    answer:
      "Bei guter Pflege halten Keramikveneers oft ein Leben lang, während Komposit-Veneers meist 5 bis 7 Jahre halten. In jedem Fall eine Entscheidung, von der du lange profitieren wirst.",
  },
  {
    key: "f3",
    question: "Wie viele Termine brauche ich für Veneers?",
    answer:
      "Wir planen vier Termine plus Nachsorge für dich ein: Kennenlernen, Mock-up-Anprobe, Präparation und Einsetzen. Die Dauer hängt jeweils von Art und Menge deiner Veneers ab. Wir nehmen uns die Zeit, die du brauchst.",
  },
  {
    key: "f5",
    question: "Kann ich das Ergebnis vorher sehen?",
    answer:
      "Ja, und zwar schon bevor es losgeht. Mit einem Mock-up siehst du Form, Farbe und Ausdruck deines neuen Lächelns und kannst es vorab testen. Erst wenn alles passt, beginnt die tatsächliche Anfertigung.",
  },
  {
    key: "f6",
    question: "Woran erkenne ich eine gute Praxis für Veneers in Berlin?",
    answer:
      "Eine gute Praxis für Veneers in Berlin zeigt dir dein Ergebnis vorab, schont deine Zahnsubstanz und sagt dir ehrlich, wenn eine andere Lösung besser passt. Ein eigenes Praxislabor ist dabei ein starkes Qualitätsmerkmal.",
  },
];

/* --- Hausregel: keine Gedankenstriche im Seitentext ----------------------
   Ausgenommen sind die Preisschreibweise („450,–") und Zahlenbereiche
   („8–19 Uhr"). Beides prüft die Regel, indem sie diese Formen zuerst
   herausnimmt und erst dann nach einem Strich sucht — sonst müsste jede
   Ausnahme einzeln durchgewinkt werden.

   Die Prüfung steht im Skript und nicht im Kopf: Ein Geviertstrich rutscht
   beim Übertragen aus dem Dokument der Agentur mit durch, und auf der Seite
   fällt er auf. Im Entwurf standen vier. */
const ERLAUBT = [
  /,–/g, // Preis: „450,–"
  /\d\s?[–—]\s?\d/g, // Bereich: „8–19 Uhr"
];

function pruefeStriche(wert, pfad = "") {
  if (typeof wert === "string") {
    const rest = ERLAUBT.reduce((s, form) => s.replace(form, ""), wert);
    if (/[—–]/.test(rest))
      throw new Error(`Gedankenstrich in ${pfad}: „${wert.slice(0, 70)}…"`);
    return;
  }
  if (Array.isArray(wert))
    return wert.forEach((v, i) => pruefeStriche(v, `${pfad}[${i}]`));
  if (wert && typeof wert === "object")
    return Object.entries(wert).forEach(([k, v]) =>
      pruefeStriche(v, pfad ? `${pfad}.${k}` : k),
    );
}

async function los() {
  pruefeStriche(
    {
      HERO,
      INTRO,
      BENEFITS,
      BEFORE_AFTER_TOPLINE,
      STATEMENT,
      EXPLAINER,
      STEPS,
      PRICING_TITLE,
      PRICING,
      FEATURES,
      FAQ,
    },
    "",
  );

  const vorhanden = await client.getDocument(PUBLISHED);
  if (!vorhanden) throw new Error(`Dokument ${PUBLISHED} gibt es nicht.`);

  /* Der Entwurf muss existieren, bevor man ihn patchen kann. Er entsteht als
     Kopie des veröffentlichten Stands — sonst stünde im Studio ein Entwurf,
     dem alle Felder fehlen, die dieses Skript nicht schreibt. */
  if (DRAFT && !DRY) {
    const { _id, _rev, _createdAt, _updatedAt, _system, ...rest } = vorhanden;
    await client.createIfNotExists({ ...rest, _id: ID, _type: "service" });
  }

  /* Punktpfade statt ganzer Objekte, wo ein Bild danebenliegen kann: Ein
     `set` auf `benefits` ersetzte den Eintrag samt hochgeladenem Motiv.
     Schlüsselpfade statt Indizes, damit ein Umsortieren im Studio nichts
     verschiebt.

     `pricing` und `faq` sind die Ausnahmen und werden ganz ersetzt: An
     Preiskarten und Fragen hängt kein Bild, und die Fragen sind andere als
     vorher. */
  const felder = {
    "hero.claim": HERO.claim,
    "hero.text": HERO.text,
    "hero.actionLabel": HERO.actionLabel,

    "intro.topline": INTRO.topline,
    "intro.headline": INTRO.headline,
    "intro.columns": INTRO.columns,

    "benefits.topline": BENEFITS.topline,
    "benefits.headline": BENEFITS.headline,

    "beforeAfter.topline": BEFORE_AFTER_TOPLINE,

    "statement.topline": STATEMENT.topline,
    "statement.text": STATEMENT.text,

    explainer: EXPLAINER,

    "steps.title": STEPS.title,

    pricingTitle: PRICING_TITLE,
    pricing: PRICING.map(({ key, ...rest }) => ({
      _key: key,
      _type: "price",
      ...rest,
    })),
    faq: FAQ.map(({ key, ...rest }) => ({
      _key: key,
      _type: "questionAnswer",
      ...rest,
    })),
  };

  BENEFITS.items.forEach((e) => {
    felder[`benefits.items[_key=="${e.key}"].name`] = e.name;
    felder[`benefits.items[_key=="${e.key}"].text`] = e.text;
  });

  STEPS.items.forEach((s) => {
    felder[`steps.items[_key=="${s.key}"].title`] = s.title;
    felder[`steps.items[_key=="${s.key}"].text`] = s.text;
    felder[`steps.items[_key=="${s.key}"].duration`] = s.duration;
  });

  FEATURES.forEach((f) => {
    felder[`features[_key=="${f.key}"].topline`] = f.topline;
    felder[`features[_key=="${f.key}"].title`] = f.title;
    felder[`features[_key=="${f.key}"].text`] = f.text;
  });

  const zeichen = JSON.stringify(felder).length;
  console.log(`Ziel: ${ID}`);
  console.log(
    `Felder: ${Object.keys(felder).length}, rund ${zeichen} Zeichen Nutzlast.`,
  );
  console.log("  · Hero mit Anspruch und eigener Beschriftung des Buttons");
  console.log("  · Intro, drei Arten, Vorher/Nachher, Qualitätsversprechen");
  console.log("  · Erklärstück zum Abschleifen");
  console.log(`  · Ablauf: ${STEPS.items.length} Schritte, jeder mit Dauer`);
  console.log(`  · Kosten: ${PRICING.length} Zeilen, Mock-up jetzt pro Zahn`);
  console.log("  · Bild-Text-Zeilen 1 und 2: Beratung, Praxislabor");
  console.log(
    `  · Fragen: ${FAQ.length} statt ${vorhanden.faq?.length ?? 0} (Frage 4 „Tut die Behandlung weh?" fehlt noch)`,
  );
  console.log(
    "\nUnberührt: Bild-Text-Zeile 3 (Haltbarkeit, im Entwurf leer),\nSEO-Felder, alle Bilder.",
  );

  if (DRY) {
    console.log("\nProbelauf. Nichts geschrieben.");
    return;
  }

  await client.patch(ID).set(felder).commit();
  console.log(`\n✓ Geschrieben nach ${ID}.`);
  if (DRAFT) console.log("  Liegt im Studio als unveröffentlichte Änderung.");
}

los().catch((error) => {
  console.error("Fehlgeschlagen:", error.message);
  process.exit(1);
});
