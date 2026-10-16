import type { PillarPage } from "../lib/pillar-sections";
import { blocks } from "../lib/portable-text";

/**
 * The pillar page "Veneers: Der medizinische Ratgeber", content.
 *
 * **Here for now, Sanity later.** The shape is already that of the future
 * schema (`PillarSection` in `lib/pillar-sections.ts`); the move is then a
 * swap of the import in `pages/veneers-berlin.astro`, not a rebuild of the
 * template.
 *
 * ── Source of the copy ───────────────────────────────────────────────────
 *
 * `texte/MP_Pillar_01_Veneers_Ratgeber_v8_2026-10-15.docx` (Summer Days,
 * eighth version, 15.10.2026). Taken over, not reinvented. What changed on
 * the way in:
 *
 *   1. **Dashes replaced.** House rule: no em dash and no spaced en dash in
 *      page copy. Ranges ("0,3–1,0 mm") stay.
 *   2. **Square brackets resolved** to links where the target exists, left
 *      out where it does not ("Fachlich geprüft … am [Datum]").
 *   3. **Modules without copy kept as they were:** before/after, stories and
 *      the contact form carry no text in this file. The five patient quotes
 *      the document asks for are blocked (no approved quotes yet) and have
 *      no module here.
 *
 * What the document leaves open is listed in `texte/FLAGS-2026-10-16.md`.
 *
 * ── The eleven points of the navigation ──────────────────────────────────
 *
 * The document counts ten chapters and adds "Veneers im Ausland" as an
 * eleventh the brief requires. It has a `navLabel` like the others, so the
 * contents and the dock show eleven entries. `navLabel` is the short form;
 * the heading on the page stays spelled out.
 *
 * Prices come last, not first: the matter, then the price. Whoever only
 * wants the price reaches it in one click via contents and dock.
 *
 * ── Images ───────────────────────────────────────────────────────────────
 *
 * `image` carries names of designed motifs from `lib/image-widths.json`;
 * `CmsImage` resolves them. The alt texts come from the document.
 */
export const veneersPillar: PillarPage = {
  title: "Veneers: Der medizinische Ratgeber",
  topline: "Guides",
  lead: "Veneers sind hauchdünne Schalen, die auf die Vorderseite der Zähne geklebt werden. Sie korrigieren Farbe, Form und kleinere Stellungsfehler, und sie sind die Behandlung, über die im Internet am meisten Unsinn steht.",
  image: "bleaching-beratung-spiegel",
  imageAlt: "Zahnärztin bei einer Veneer-Behandlung im Behandlungszimmer",
  seoDescription:
    "Was sind Veneers? Der medizinische Ratgeber: Arten, Kosten, Haltbarkeit und Risiken, erklärt von Zahnärzt:innen von Mundpropaganda in Berlin.",

  /* Points at the contact section at the end of this page. */
  action: { label: "Beratungstermin vereinbaren", href: "#kontakt" },

  sections: [
    /* --- Before the contents ------------------------------------------- */

    /* The entry under the head: standfirst left, two text columns right.
       Carries no `navLabel`, it is the introduction, not a chapter. The
       author and review line the document wants under the h1 has no field
       yet; see FLAGS. */
    {
      _type: "intro",
      _key: "einstieg",
      headline: "Hier erfährst du alles, was du über Veneers wissen musst.",
      columns: [
        "Veneers sind hauchdünne Schalen, die auf die Vorderseite der Zähne geklebt werden. Sie korrigieren Farbe, Form und kleinere Stellungsfehler, und sie sind die Behandlung, über die im Internet am meisten Unsinn steht.",
        "Dieser Ratgeber erklärt, was Veneers medizinisch sind, welche Arten es gibt, was sie kosten, wie lange sie halten und wann ich als Zahnarzt davon abrate. Letzteres ist der Teil, den die meisten Seiten weglassen. Er ist der wichtigste.",
      ],
    },

    /* The contents. Its entries come from the sections below. */
    {
      _type: "contents",
      _key: "contents",
      headline: "Inhalt",
      /* Not `experten`: that motif brings a baked-in rounding top and bottom
         right (alpha channel, opaque only after 67px) and fights the radius
         from the CSS. */
      image: "behandlungszimmer-rot",
      alt: "",
      caption: "Hannes Schulte-Ostermann",
    },

    /* --- 1 -------------------------------------------------------------- */
    {
      _type: "intro",
      _key: "was-sind-veneers",
      navLabel: "Was sind Veneers",
      headline: "Was sind Veneers?",
      variant: "centered",
      image: "veneers-farbbestimmung",
      alt: "Querschnitt eines Zahns mit aufgeklebtem Veneer",
      columns: [
        "Ein Veneer ist eine Verblendschale aus Keramik oder Kunststoff, die den sichtbaren Teil eines Zahns überzieht. Sie ist zwischen drei Zehntel- und etwa sieben Zehntelmillimeter dick: dünner als eine Kontaktlinse oder etwa so stark wie zwei Blatt Papier.",
        "Veneers verändern nichts am Zahn selbst. Sie legen sich darüber wie eine Fassade und bestimmen danach, was man sieht: Farbe, Form, Oberfläche, Länge, die Stellung der Zahnkante. Was sie nicht können: einen kranken Zahn gesund machen. Unter einem Veneer liegt derselbe Zahn wie vorher, und wenn der Karies hat, muss die zuerst behandelt werden.",
        "Der Unterschied zur Krone ist wichtig: Eine Krone umfasst den Zahn ringsum und braucht dafür deutlich mehr abgetragene Zahnsubstanz. Ein Veneer liegt nur vorn auf. Deshalb gilt es als das substanzschonendere Verfahren, vorausgesetzt, der Zahn darunter ist stabil genug.",
      ],
      body: blocks("was-sind-veneers", [
        "### Woraus Veneers bestehen",
        "Keramikveneers werden je nach Fall aus unterschiedlichen Keramiken gefertigt. Feldspatkeramik ist die lichtdurchlässigste und lässt sich besonders dünn schichten; sie kommt zum Einsatz, wo es vor allem auf Natürlichkeit ankommt. Lithiumdisilikat ist fester und wird gewählt, wenn die Schale mehr aushalten muss, etwa bei kräftigen Kaukräften. Komposit-Veneers bestehen aus demselben zahnfarbenen Kunststoff, aus dem auch weiße Füllungen gemacht werden.",
        "### Warum die Klebung entscheidend ist",
        "Ein Veneer hält nicht, weil es aufliegt, sondern weil es haftet. Die Schale wird adhäsiv mit dem Zahn verbunden, und diese Verbindung ist auf Zahnschmelz deutlich stabiler als auf dem weicheren Dentin darunter. Daraus folgt eine Regel, die viel über die Qualität einer Behandlung sagt: Je mehr Schmelz stehen bleibt, desto besser hält das Veneer.",
        "Der Schmelz an der Vorderseite der Frontzähne ist nur wenige Zehntelmillimeter dick und zum Zahnhals hin am dünnsten. Wer dort zu viel abträgt, landet im Dentin und verliert genau die Fläche, an der das Veneer halten soll. Minimaler Abtrag ist deshalb kein Marketing-Versprechen, sondern eine technische Notwendigkeit.",
        "### Woher Veneers kommen",
        "Erfunden wurden sie in Hollywood: Ende der 1920er-Jahre klebte der Zahnarzt Charles Pincus Schauspieler:innen dünne Schalen für Filmaufnahmen auf die Zähne; sie hielten nur für die Dauer des Drehs. Haltbar wurden Veneers erst Jahrzehnte später mit der adhäsiven Klebetechnik.",
      ]),
    },

    /* --- 2 --- Two columns since v8: Non-Prep is gone. ------------------ */
    {
      _type: "compare",
      _key: "arten",
      navLabel: "Arten im Vergleich",
      headline: "Welche Arten von Veneers gibt es?",
      columns: [
        { name: "Keramik", meta: "im Labor gefertigt" },
        { name: "Komposit", meta: "in einer Sitzung" },
      ],
      lines: [
        {
          name: "Material",
          values: [
            { kind: "text", text: "Lithiumdisilikat, Feldspatkeramik" },
            { kind: "text", text: "Kunststoff-Komposit" },
          ],
        },
        {
          name: "Abschleifen",
          values: [
            { kind: "text", text: "0,3–1,0 mm" },
            { kind: "text", text: "praktisch keiner" },
          ],
        },
        {
          name: "Umkehrbar",
          values: [{ kind: "nein" }, { kind: "ja" }],
        },
        {
          name: "Haltbarkeit",
          values: [
            { kind: "text", text: "über 10 Jahre" },
            { kind: "text", text: "deutlich kürzer" },
          ],
        },
        {
          name: "Stärken",
          values: [
            { kind: "text", text: "höchste Ästhetik, stabil, verfärbt nicht" },
            { kind: "text", text: "günstig, in einer Sitzung fertig" },
          ],
        },
        {
          name: "Grenzen",
          values: [
            { kind: "text", text: "irreversibel" },
            { kind: "text", text: "verfärbt mit der Zeit, weniger stabil" },
          ],
        },
      ],
      body: blocks("arten", [
        "Zwei Varianten setzen wir ein. Sie unterscheiden sich im Material, in der Dicke und darin, wie viel Zahn vorher bearbeitet werden muss.",
        "### Keramik",
        "Die gebräuchlichste Form. Die Schale wird im Labor gefertigt, und weil Keramik das Licht ähnlich bricht wie natürlicher Zahnschmelz, lässt sich das Ergebnis kaum von echten Zähnen unterscheiden. Farbe, Form und Oberflächenstruktur werden individuell abgestimmt. Keramik eignet sich für stärkere Verfärbungen und größere Formkorrekturen und ist bei guter Pflege die langlebigste Variante. Dafür wird die Zahnoberfläche vorher minimal beschliffen.",
        "### Komposit",
        "Zahnfarbener Kunststoff, direkt im Mund modelliert, in einer Sitzung und meist ohne Beschliff. Moderne Verfahren arbeiten dabei nicht freihändig, sondern über eine transparente Form aus einem digitalen Modell: Das Komposit wird eingespritzt statt aufgetragen, was gleichmäßiger wird. Komposit eignet sich für kleinere Korrekturen. Sein größter Vorteil ist nicht der Preis, sondern dass du deine Meinung noch ändern kannst.",
        "Welche Variante infrage kommt, entscheidet sich nicht am Preis, sondern am Befund: Wie viel Zahn ist noch original, und wie groß soll die Veränderung sein? Ausführlich vergleichen wir die Materialien im Beitrag [Veneers-Arten im Vergleich](/magazin/veneers-arten).",
      ]),
    },

    /* --- 3 -------------------------------------------------------------- */
    {
      _type: "prose",
      _key: "abschleifen",
      navLabel: "Abschleifen",
      heading: "Schaden Veneers den Zähnen?",
      image: "labor-hand-implantat",
      alt: "Minimal beschliffener Frontzahn vor dem Einsetzen des Veneers",
      side: "left",
      body: blocks("abschleifen", [
        "Das ist die Frage, die mir am häufigsten gestellt wird, und die Antwort hängt davon ab, wie gearbeitet wird. Entscheidend ist nicht ob, sondern wie viel.",
        "### Beim klassischen Keramikveneer",
        "Auf der Vorderseite deiner Schneidezähne liegt Zahnschmelz, je nach Stelle zwischen etwa drei Zehntel- und einem Millimeter dick. Für ein Keramikveneer werden davon meist drei bis sieben Zehntel abgetragen, ungefähr die Dicke einer Eierschale. Das ist irreversibel: Was abgetragen ist, wächst nicht nach.",
        "Die wichtigste Regel dabei lautet: Es soll im Schmelz bleiben. Darunter liegt Dentin, und Dentin verhält sich anders. Der Kleber haftet dort schlechter, der Zahn reagiert empfindlicher auf Kälte, und die Verbindung hält weniger lange.",
        "### Beim Komposit-Veneer",
        "Hier wird in der Regel nicht beschliffen. Das Komposit wird direkt auf den Zahn aufgebaut, nicht in ihn hinein. Deshalb lässt sich die Behandlung wieder entfernen, und der Zahn ist danach, wie er vorher war. Dafür hält Komposit kürzer und verfärbt sich mit den Jahren. Wenn du unsicher bist, ist das der Weg, der dir alle Türen offen lässt.",
        "Die Bilder, die man im Internet findet, zeigen etwas anderes: zu Stiften abgeschliffene Zähne. Das sind keine Veneer-Präparationen, das sind Kronenpräparationen. Wer dir für ein Veneer den halben Zahn abträgt, macht in Wahrheit eine Krone und nennt sie anders. Mehr dazu im Beitrag [Schaden Veneers den Zähnen?](/magazin/veneers-schaden).",
      ]),
    },

    /* --- 4 -------------------------------------------------------------- */
    {
      _type: "prose",
      _key: "mockup",
      navLabel: "Mock-up",
      heading: "Das Mock-up",
      image: "aligner-schiene",
      alt: "",
      side: "right",
      body: blocks("mockup", [
        "Beim Mock-up wird die geplante Zahnform direkt im Mund aufgetragen, auf ungeschliffene Zähne. Du siehst und spürst dein Ergebnis, bevor irgendetwas irreversibel ist. Du läufst damit herum und zeigst es Leuten; essen kannst du damit nicht, dafür ist es zu dünn. Genau das ist sein Wert: Es ist die letzte Station, an der du kostenfrei nein sagen kannst.",
        "Vorher planen wir deine neuen Zähne digital, auf Grundlage eines Scans und deiner Fotos. Aus dieser Planung entsteht das Mock-up, und aus dem Mock-up ein Silikonschlüssel, der beim Beschleifen vorgibt, wie viel abgetragen werden darf.",
        "Dieser Schlüssel ist der ganze Unterschied zwischen minimalinvasiv als Wort und als Verfahren. Ohne ihn schätzt man, und wer schätzt, nimmt im Zweifel mehr weg. Mit ihm wird genau so viel abgetragen, wie die geplante Form braucht. An manchen Stellen ist das null.",
        "Ein Mock-up kostet bei uns ab 450 Euro pro Kiefer. Bei einem einzelnen Zahn brauchst du meistens keines, manchmal doch. Es ist der Posten, der in günstigen Angeboten am häufigsten fehlt, und der einzige, bei dem ich vom Sparen abrate.",
      ]),
    },

    /* --- 5 -------------------------------------------------------------- */
    {
      _type: "steps",
      _key: "ablauf",
      navLabel: "Ablauf",
      headline: "Wie läuft die Behandlung ab?",
      steps: [
        {
          title: "Beratung und Analyse",
          text: "Wir prüfen, ob du für die Behandlung infrage kommst, und ob sich deine Vorstellung mit deinem Budget umsetzen lässt. Fotos, digitaler Scan, Befund. Wenn eine andere Lösung besser passt, sage ich das hier.",
        },
        {
          title: "Digitale Abformung und Mock-up",
          text: "Aus dem Scan entsteht die digitale Planung, daraus das Mock-up. Du probierst es im Mund an und entscheidest erst danach. Ohne dieses Ja geht es nicht weiter.",
        },
        {
          title: "Vorbereitung und Fertigung",
          text: "Die Zähne werden minimal beschliffen, geführt vom Silikonschlüssel aus dem Mock-up. Danach entstehen die Veneers in unserem Praxislabor: Die Keramik wird von Hand geschichtet und auf deine übrigen Zähne abgestimmt. In dieser Zeit trägst du Provisorien. Sie schützen die Zähne und zeigen dir, wie sich die neue Form beim Sprechen und Essen anfühlt. Fällt dir dabei etwas auf, ist das der richtige Moment, es zu sagen: Änderungen am Provisorium sind einfach, am fertigen Veneer nicht.",
        },
        {
          title: "Einsetzen",
          text: "Die Veneers werden eingeklebt und final angepasst. Gefällt etwas nicht, gibt es weitere Einproben; das ist eingeplant. Eine Woche später kontrollieren wir Sitz, Biss und Zahnfleisch.",
        },
      ],
      body: blocks("ablauf", [
        "Vier Schritte, verteilt auf meist fünf Termine. Bei abgenutzten Zähnen kommen zwei Termine dazu.",
        "### Wenn die Zähne abgenutzt sind",
        "Bei abradierten Zähnen ist über Jahre Substanz weggerieben worden, meist durch nächtliches Knirschen, und der Biss hat sich gesenkt. Dann reicht es nicht, die Form neu aufzubauen: Dieselbe Kraft würde anschließend gegen die neuen Veneers arbeiten. Deshalb vermessen wir vorher dein Kiefergelenk elektronisch: ein Bogen auf dem Nasenrücken, ein Sensor an den Zähnen, 45 bis 60 Minuten, völlig schmerzfrei. Aus den Daten entsteht eine Bisshebungsschiene, die du eine Zeit lang trägst, bevor irgendetwas geklebt wird. Aus fünf Terminen werden so sieben. Mehr dazu auf unserer Seite zu [Kiefergelenkbeschwerden und CMD](/leistungen/cmd-behandlung).",
      ]),
    },

    {
      _type: "ctaBand",
      _key: "cta-beratung",
      headline: "Erst sehen, dann entscheiden.",
      text: "Beim Mock-up trägst du dein Ergebnis im Mund, bevor ein Zahn beschliffen ist. Wenn es dir dann nicht gefällt, ist nichts passiert. Komm zu einem Erstgespräch. Wir sagen dir auch, wenn eine andere Lösung besser passt.",
      actionLabel: "Beratungstermin vereinbaren",
      actionHref: "#kontakt",
      image: "beratung-hannes",
    },

    /* The proof right behind the steps: whoever has just read how it works
       wants to see what comes out. No entry in the navigation. */
    {
      _type: "beforeAfter",
      _key: "vorher-nachher",
      topline: "Vorher und nachher",
    },

    /* --- 6 -------------------------------------------------------------- */
    {
      _type: "prose",
      _key: "haltbarkeit",
      navLabel: "Haltbarkeit",
      heading: "Wie lange halten Veneers?",
      image: "teeth-macro",
      alt: "",
      side: "left",
      body: blocks("haltbarkeit", [
        "Keramikveneers halten bei guter Pflege über zehn Jahre. Die belastbarste Zahl dazu kommt aus einer Langzeituntersuchung der Medizinischen Universität Innsbruck, die 318 Veneers bei 84 Patient:innen über bis zu 20 Jahre begleitet hat:",
        "- **97,3 Prozent** nach 5 Jahren",
        "- **93,5 Prozent** nach 10 Jahren",
        "- **78,5 Prozent** nach 20 Jahren",
        "Dieselbe Untersuchung zeigt auch, woran Veneers scheitern: Nächtliches Knirschen und wurzelkanalbehandelte Zähne erhöhten die Misserfolgsrate deutlich, und bei Raucher:innen verfärbten sich die Ränder stärker. Das deckt sich mit dem, was wir in der Praxis sehen, und es ist der Grund, warum ich bei wurzelbehandelten Zähnen eher zur Krone rate und bei Knirschen immer eine Schiene dazugebe.",
        "Was die Haltbarkeit verkürzt, ist gut bekannt: Knirschen ohne Schiene, Rauchen, nachlässige Reinigung der Ränder und harte Belastungen, für die kein Zahn gemacht ist. Was sie verlängert, ist unspektakulär: gute Hygiene, regelmäßige Kontrolle und ein Biss, der stimmt.",
        "Ein Veneer hält außerdem nur so lange, wie der Zahn darunter gesund bleibt. Deshalb gehört die [professionelle Zahnreinigung](/leistungen/prophylaxe) zur Behandlung dazu, nicht als Zusatzangebot.",
        "Wenn doch etwas passiert, hängt die Reparatur vom Material ab. Ein abgeplatztes Komposit-Veneer lässt sich oft direkt im Mund ausbessern. Bei Keramik ist eine Reparatur meist nur eine Übergangslösung; in der Regel wird die Schale ersetzt.",
      ]),
      note: {
        variant: "source",
        title: "Studienbeleg",
        text: "Beier US, Kapferer I, Burtscher D, Dumfahrt H. Clinical performance of porcelain laminate veneers for up to 20 years. International Journal of Prosthodontics 2012;25(1):79–85.",
        href: "https://pubmed.ncbi.nlm.nih.gov/22259802/",
        linkLabel: "Zur Studie auf PubMed",
      },
    },

    /* --- 7 -------------------------------------------------------------- */
    {
      _type: "prose",
      _key: "nachteile",
      navLabel: "Nachteile",
      heading: "Für wen eignen sich Veneers, und für wen nicht?",
      image: "empfang-p25",
      alt: "",
      side: "right",
      body: blocks("nachteile", [
        "Vier Dinge gehören gesagt, bevor die sechs Situationen kommen, in denen ich abrate.",
        "- **Der Substanzverlust ist endgültig.** Ein präparierter Zahn bleibt lebenslang versorgungspflichtig. Fällt ein Veneer nach fünfzehn Jahren aus, braucht es ein neues, mit den entsprechenden Kosten.",
        "- **Vorübergehende Empfindlichkeit** auf Kälte und Süßes ist in den ersten Wochen normal. In seltenen Fällen bleibt sie.",
        "- **Abplatzungen und Ablösungen** kommen vor, meist reparabel, gelegentlich mit Neuanfertigung.",
        "- **Das Zahnfleisch verändert sich.** Zieht es sich über die Jahre zurück, kann der Veneer-Rand sichtbar werden. Und deine übrigen Zähne altern weiter: Veneers verfärben sich nicht, eigene Zähne schon.",
        "### Wann wir abraten",
        "**Wenn dich nur die Zahnstellung stört.** Sprechen Patient:innen ausschließlich über die Stellung, nicht über Farbe, nicht über Form, und sind die Zähne füllungsfrei mit schöner Transluzenz, dann rate ich zur [Aligner-Therapie](/leistungen/aligner). Sie bewegt die Zähne, statt gesunde Substanz zu überdecken, und ist außerdem günstiger.",
        "**Wenn die Zähne wurzelkanalbehandelt sind oder sehr umfangreiche Füllungen haben.** Dann ist manchmal eine Krone die bessere Versorgung, weil sie den geschwächten Zahn umfasst. Die Langzeitdaten stützen das: Auf avitalen Zähnen versagen Veneers messbar häufiger.",
        "**Wenn die Mundhygiene dauerhaft schlecht ist** und sich daran nichts ändern lässt. Veneers verlangen saubere Ränder. Wo die nicht gepflegt werden, entsteht Karies genau dort, wo man sie am schlechtesten behandeln kann.",
        "**Wenn eine aktive, unbehandelte Parodontitis vorliegt.** Das Zahnfleisch muss vorher gesund sein, sonst verschiebt sich der Rand später und legt die Veneerkante frei. Die [Parodontitis-Behandlung](/leistungen/parodontitis-behandlung) kommt zuerst.",
        "**Wenn du sehr jung bist.** Volljährigkeit ist die Untergrenze; davor ist die Zahnentwicklung nicht abgeschlossen.",
        "**Und wenn du es dir nicht leisten kannst.** Wer sich für Veneers stark verschulden müsste, sollte sie nicht machen. Das ist keine medizinische Indikation, sondern schlicht ein ehrlicher Rat.",
      ]),
    },

    /* --- 8 --- Required by the brief, new since v8. --------------------- */
    {
      _type: "prose",
      _key: "ausland",
      navLabel: "Im Ausland",
      heading: "Veneers im Ausland: worauf du achten solltest",
      image: "flur-p25",
      alt: "",
      side: "left",
      body: blocks("ausland", [
        "Veneers in der Türkei oder in Ungarn kosten einen Bruchteil. Das ist kein Gerücht, sondern Tatsache, und es hat nachvollziehbare Gründe: niedrigere Lohn-, Miet- und Laborkosten.",
        "Was der Preisvergleich nicht abbildet, sind vier Dinge. Erstens die Zeit: Eine saubere Versorgung braucht mehrere Termine über Wochen. Wer sie in fünf Tagen durchzieht, lässt die Anprobe weg oder kürzt Zwischenschritte. Zweitens die Nachsorge: Wenn nach sechs Monaten eine Kante abplatzt, ist die Praxis 2.500 Kilometer entfernt. Drittens die Gewährleistung: Ansprüche im Ausland durchzusetzen ist in der Praxis schwierig. Und viertens die Dokumentation: Ohne sie kann eine Praxis hier nur raten, was gemacht wurde.",
        "Das heißt nicht, dass im Ausland schlecht gearbeitet wird. Es heißt, dass der Preis nicht die ganze Rechnung ist. Und es gibt einen Punkt, der selten benannt wird: Wer wegen der Ersparnis fährt, kann eine Nacharbeit zu deutschen Preisen meistens auch nicht bezahlen. Die Ersparnis ist sicher, die Nacharbeit ist ein Risiko.",
        "Die vollständige Rechnung haben wir im Beitrag [Veneers in der Türkei: der ehrliche Vergleich](/magazin/veneers-tuerkei-vergleich) aufgemacht.",
      ]),
    },

    /* --- 9 -------------------------------------------------------------- */
    {
      _type: "compare",
      _key: "alternativen",
      navLabel: "Alternativen",
      headline: "Welche Alternativen gibt es zu Veneers?",
      columns: [
        { name: "Veneers" },
        { name: "Bleaching" },
        { name: "Komposit" },
        { name: "Aligner" },
      ],
      lines: [
        {
          name: "Wofür",
          values: [
            { kind: "text", text: "Form, Farbe und Länge ändern" },
            { kind: "text", text: "gesunde, aber verfärbte Zähne" },
            { kind: "text", text: "kleine Absplitterung oder Ecke" },
            { kind: "text", text: "schiefe oder gedrehte Zähne" },
          ],
        },
        {
          name: "Substanzverlust",
          values: [
            { kind: "text", text: "0,3–1,0 mm" },
            { kind: "text", text: "praktisch keiner" },
            { kind: "text", text: "praktisch keiner" },
            { kind: "text", text: "keiner" },
          ],
        },
        {
          name: "Umkehrbar",
          values: [
            { kind: "nein" },
            { kind: "ja" },
            { kind: "ja" },
            { kind: "ja" },
          ],
        },
        {
          name: "Behandelt die Ursache",
          values: [
            { kind: "nein" },
            { kind: "nein" },
            { kind: "nein" },
            { kind: "ja" },
          ],
        },
        {
          name: "In einer Sitzung fertig",
          values: [
            { kind: "nein" },
            { kind: "pille", text: "meist ja" },
            { kind: "ja" },
            { kind: "nein" },
          ],
        },
      ],
      body: blocks("alternativen", [
        "Veneers sind selten die einzige Lösung und oft nicht die naheliegendste.",
        "Häufig ist die beste Antwort eine Kombination: erst bleichen, dann zwei Wochen warten, dann nur die zwei Zähne mit Veneers versorgen, die es wirklich brauchen. Das kostet einen Bruchteil und erhält deine Zahnsubstanz.",
        "Als Faustregel: Stört dich nur die Farbe, denk zuerst an [Bleaching](/leistungen/bleaching). Stört dich nur die Stellung, denk zuerst an Aligner. Stört dich beides zugleich, oder kommen Form und Oberfläche dazu, sind Veneers meist der Weg mit dem besten Verhältnis von Aufwand und Ergebnis. Und wenn dich eigentlich nichts richtig stört, sondern nur ein Bild im Kopf herumgeht: Warte noch.",
      ]),
    },

    /* --- 10 --- The matter first, then the price. ----------------------- */
    {
      _type: "pricing",
      _key: "kosten",
      navLabel: "Kosten",
      headline: "Was kosten Veneers?",
      pricing: [
        {
          name: "Komposit-Veneer",
          price: "€ 450,-",
          from: true,
          unit: "/ Zahn",
        },
        {
          name: "Keramikveneer",
          price: "€ 1.500,-",
          from: true,
          unit: "/ Zahn",
        },
        { name: "Mock-up", price: "€ 450,-", from: true, unit: "/ Kiefer" },
        /* A flat fee, not a from-price: the one amount on the page that
           points downwards. It is credited against the treatment. */
        { name: "Beratung", price: "€ 99,-", unit: "einmalig" },
      ],
      note: "Die Beratung wird auf die Behandlung angerechnet, wenn du dich dafür entscheidest.",
      body: blocks("kosten", [
        "Veneers sind eine rein ästhetische Leistung. Die gesetzliche Krankenkasse übernimmt sie nicht. Manche privaten Zusatzversicherungen beteiligen sich anteilig; kläre das vorab, und zwar schriftlich.",
        "Was den Preis vor allem bestimmt, ist die Anzahl. Wer zwei Frontzähne korrigiert, zahlt einen Bruchteil dessen, was eine Versorgung von Ober- und Unterkiefer kostet. Größere Beträge lassen sich bei positiver Bonität über unseren Partner Mediserv Bank in Raten zahlen: sechs Raten zinsfrei, Laufzeiten bis 56 Monate.",
        "Nicht enthalten sind Leistungen, die je nach Fall dazukommen: eine professionelle Zahnreinigung vor der Behandlung, eine Knirscherschiene, wenn du nachts knirschst, oder die Vorbehandlung von Karies und Zahnfleisch. Das sind keine versteckten Posten; sie stehen im Kostenvoranschlag, bevor du zusagst. Eine ausführliche Aufschlüsselung findest du im Beitrag [Was kosten Veneers?](/magazin/veneers-kosten).",
        "Eine Rechnung, die kaum jemand aufmacht und die am meisten aussagt: Legst du die ab 1.500 Euro auf zehn Jahre um, sind das 150 Euro im Jahr, und die Innsbrucker Zahlen oben legen nahe, dass viele länger halten. Komposit kostet knapp ein Drittel, muss aber deutlich früher erneuert werden. Über fünf Jahre gerechnet ist Komposit die günstigere Wahl, über zwanzig fast immer Keramik.",
      ]),
    },

    /* Voices before the questions: whoever has read this far is deciding
       right now. The stories are the ones assigned to Veneers in the
       Studio. */
    { _type: "stories", _key: "stimmen" },

    /* --- 11 --- The six questions of brief 03, verbatim. ---------------- */
    {
      _type: "faq",
      _key: "faq",
      navLabel: "Häufige Fragen",
      headline: "Häufige Fragen zu Veneers",
      questions: [
        {
          question: "Kann man mit Veneers normal essen?",
          answer:
            "Ja. Keramikveneers sind nach dem Aushärten des Klebers voll belastbar. Was ich nicht empfehle: Nüsse knacken, Flaschen öffnen, Fingernägel kauen. Das würde ich allerdings auch ohne Veneers nicht empfehlen.",
        },
        {
          question: "Können Veneers sich verfärben?",
          answer:
            "Keramik kaum, sie nimmt praktisch keine Farbstoffe auf. Komposit schon, ähnlich wie eine Kunststofffüllung. Verfärben kann sich außerdem der Klebespalt am Rand, besonders bei Raucher:innen.",
        },
        {
          question: "Wie pflegt man Veneers richtig?",
          answer:
            "Wie eigene Zähne, nur konsequenter: zweimal täglich putzen, täglich Zahnseide oder Interdentalbürsten, und regelmäßig zur professionellen Zahnreinigung. Wichtig ist der Übergang zwischen Veneer und Zahn. Dort entsteht Karies, wenn überhaupt.",
        },
        {
          question: "Können Veneers abfallen?",
          answer:
            "Selten, aber es kommt vor. Meist steckt eine Überbelastung dahinter, etwa nächtliches Knirschen, oder ein Klebespalt, der undicht geworden ist. Ein gelöstes Veneer lässt sich in vielen Fällen wieder befestigen. Komm damit bitte zügig vorbei, bevor der Zahn darunter Schaden nimmt.",
        },
        {
          question: "Ab welchem Alter sind Veneers möglich?",
          answer:
            "Ab Volljährigkeit. Vorher ist die Zahnentwicklung nicht abgeschlossen und der Zahnfleischverlauf verändert sich noch. Bei Jugendlichen rate ich grundsätzlich ab.",
        },
        {
          question: "Merkt man Veneers im Mund?",
          answer:
            "In den ersten Tagen ja, die Zunge findet jede Veränderung. Nach etwa einer Woche gewöhnt man sich daran. Wenn sich nach zwei Wochen etwas beim Zubeißen noch anders anfühlt, stimmt der Biss nicht und wird nachjustiert.",
        },
      ],
    },

    /* The contact section closes the page, without a number: it is not a
       chapter, it is the destination. Only here in the extended version,
       because whoever has read this far often already holds another
       practice's quote. */
    {
      _type: "contact",
      _key: "kontakt",
      service: "Veneers",
      extended: true,
    },
  ],
};
