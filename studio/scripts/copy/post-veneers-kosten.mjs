/**
 * Was kosten Veneers? — new magazine post, fifth version of 15.10.2026
 * (`texte/blogs/MP_Blog_01_Veneers_Kosten_v5_2026-10-15.docx`).
 *
 * Mapping as in `post-veneers-schaden.mjs`: H1 → title, Standfirst → lead,
 * Kategorie → category, Autor → author, body → text, Meta → seo. The price
 * table is a `table` block (new on 16.10.2026, see `rich-text.ts`).
 */
import { make } from "../copy-blocks.mjs";

const { p, h2, h3, table } = make();
const slug = "veneers-kosten";

export default {
  id: `post-${slug}`,
  type: "post",
  source: "MP_Blog_01_Veneers_Kosten_v5_2026-10-15.docx",

  create: {
    title: "Was kosten Veneers? Alle Preise im Überblick",
    slug: { _type: "slug", current: slug },
  },

  set: {
    title: "Was kosten Veneers? Alle Preise im Überblick",
    slug: { _type: "slug", current: slug },
    date: "2026-10-16",
    category: "kosten",
    author: { _type: "reference", _ref: "person-schulte-ostermann" },
    service: { _type: "reference", _ref: "service-veneers" },
    lead: "Was ein Veneer wirklich kostet, und welche Posten in günstigen Angeboten fehlen.",

    text: [
      p(
        "Ein Keramikveneer kostet in Deutschland ab etwa 1.500 Euro pro Zahn, ein Komposit-Veneer ab etwa 450 Euro pro Zahn. Willst du das Ergebnis vorher sehen, kommt ein Mock-up dazu, ab 450 Euro pro Kiefer.",
      ),
      p(
        "Das ist die kurze Antwort. Die längere ist interessanter, denn die Spanne zwischen Angeboten ist enorm, und sie erklärt sich fast nie über den Zahn selbst, sondern über das, was drumherum passiert oder eben nicht passiert. Ich bin Zahnarzt in Berlin und setze Veneers seit Jahren. Hier steht, wofür du bezahlst.",
      ),

      h2("Veneers-Kosten pro Zahn: die Übersicht"),
      table([
        ["Leistung", "Preis"],
        ["Komposit-Veneer, pro Zahn", "ab 450 €"],
        ["Keramik-Veneer, pro Zahn", "ab 1.500 €"],
        ["Mock-up zum Probetragen, pro Kiefer", "ab 450 €"],
        ["Beratung, einmalig", "99 €"],
      ]),
      p(
        "Zwei Dinge fallen an dieser Tabelle auf. Erstens: Zwischen Komposit und Keramik liegt mehr als das Dreifache. Zweitens: Die Beratung steht drin, weil sie Geld kostet: 99 Euro, und wenn du dich danach für die Behandlung entscheidest, wird der Betrag angerechnet.",
      ),
      p(
        "Dafür bekommst du Fotos, einen Befund und eine Einschätzung, was in deinem Fall möglich ist. Wer sich danach gegen die Behandlung entscheidet, hat 99 Euro für eine ehrliche Auskunft bezahlt. Das ist weniger, als eine falsche Entscheidung kostet.",
      ),
      p([
        "Alle übrigen Preise sind Ab-Preise. Was du am Ende zahlst, hängt vom Befund ab, und eine seriöse Zahl bekommst du erst nach einer Untersuchung. Alles andere wäre geraten. Was die Materialien im Detail unterscheidet, steht in ",
        { text: "Veneers-Arten im Vergleich", href: "/magazin/veneers-arten" },
        ".",
      ]),

      h2("Was beeinflusst den Preis?"),
      h3("Das Material"),
      p(
        "Komposit wird direkt im Mund modelliert, in einer Sitzung, ohne Labor. Das macht es günstig und reversibel. Es verfärbt sich allerdings mit den Jahren und hält deutlich kürzer. Keramik entsteht im Labor, ist farbstabil, lichtdurchlässig wie Zahnschmelz und hält bei guter Pflege über ein Jahrzehnt. Der Preisunterschied ist also kein Aufschlag, sondern ein anderes Produkt.",
      ),
      h3("Das Labor"),
      p(
        "Ein Keramikveneer wird von einem Menschen gebaut, nicht von einer Maschine allein. Wie lange jemand daran sitzt und wie oft er es korrigiert, bis es passt, steckt direkt im Preis. Bei uns entstehen Veneers im eigenen Praxislabor. Das ist nicht die billigste Variante. Es ist die, bei der ich dem Zahntechniker über die Schulter schauen kann.",
      ),
      h3("Die Vorbereitung"),
      p(
        "Das Mock-up ist der Schritt, der in günstigen Angeboten am häufigsten fehlt. Wir planen deine neuen Zähne zuerst digital, und dann klebe ich dir die geplante Form aus Kunststoff auf die ungeschliffenen Zähne. Du läufst damit herum und zeigst es Leuten; essen kannst du damit nicht, dafür ist es zu dünn. Erst danach beschleifen wir irgendetwas. Wer diesen Schritt weglässt, spart den Mock-up-Preis und riskiert ein Ergebnis, das dir nicht gefällt, nur dass es dann nicht mehr rückgängig zu machen ist.",
      ),
      h3("Die Anzahl der Zähne"),
      p(
        "Der Preis pro Zahn sinkt nicht, wenn du mehr machen lässt. Das Mock-up verteilt sich aber: Es fällt einmal pro Kiefer an, nicht pro Zahn. Bei zwölf Veneers fällt es kaum ins Gewicht, bei zweien deutlich, und bei einem einzelnen Zahn brauchst du meistens keins.",
      ),
      h3("Wer es macht"),
      p(
        "Erfahrung ist der Posten, den niemand gern bepreist sieht, und der am meisten ausmacht. Bei Frontzähnen entscheidet ein Zehntelmillimeter darüber, ob das Ergebnis natürlich wirkt oder gemacht. Das lernt man nicht in einem Wochenendkurs.",
      ),
      h3("Was ein Veneer pro Jahr kostet"),
      p(
        "Das ist die Rechnung, die kaum jemand aufmacht, und die einzige, die etwas aussagt. In einer Innsbrucker Langzeituntersuchung waren nach zehn Jahren noch 93,5 Prozent der Keramikveneers in Funktion. Legst du die ab 1.500 Euro auf zehn Jahre um, sind das ab 150 Euro im Jahr, und viele halten länger. Komposit kostet knapp ein Drittel, muss aber deutlich früher erneuert werden, und wie früh, hängt stark davon ab, ob du rauchst, viel Kaffee trinkst oder nachts knirschst. Über fünf Jahre gerechnet ist Komposit die günstigere Wahl. Über zwanzig ist es fast immer Keramik.",
      ),

      h2("Kosten nach Behandlungsumfang"),
      p(
        "Drei Fälle, wie sie bei uns vorkommen. Alle Zahlen sind Ab-Preise für Keramik und verstehen sich als Größenordnung, nicht als Angebot.",
      ),
      h3("Ein einzelner Zahn"),
      p(
        "Ein abgebrochener oder verfärbter Frontzahn, der nicht zu den anderen passt. Ein Mock-up brauchen wir hier oft keines, manchmal doch; das entscheidet der Befund. Du liegst also bei ab 1.500 Euro. Technisch ist es trotzdem der anspruchsvollste Fall: Ein einzelnes Veneer muss sich zwischen deine echten Zähne einfügen, ohne aufzufallen. Zwanzig neue Zähne sind einfacher, weil man den Maßstab selbst setzt.",
      ),
      h3("Die sechs oberen Frontzähne"),
      p(
        "Sechs Keramikveneers plus Mock-up für den Oberkiefer: zusammen ab etwa 9.450 Euro. In Komposit läge derselbe Umfang bei ab 2.700 Euro. Dort ist das Mock-up im Preis enthalten, dafür hält das Ergebnis kürzer und du fängst in einigen Jahren wieder an.",
      ),
      h3("Das ganze sichtbare Lächeln"),
      p(
        "Zwanzig Zähne, beide Kiefer, alles, was man beim Lächeln zeigt. Mit zwei Mock-ups liegst du ab etwa 30.900 Euro. Das ist der Punkt, an dem ich im Beratungsgespräch meistens frage, ob es wirklich zwanzig sein müssen.",
      ),
      h3("Die Kosten, an die niemand denkt"),
      p(
        "Drei Posten stehen in keinem Angebot und entscheiden trotzdem mit. Erstens: Wenn du nachts knirschst, brauchst du eine Schiene. Das sind mehrere hundert Euro zusätzlich, und sie ist keine Empfehlung, sondern Bedingung: Ohne sie riskierst du die Veneers, für die du gerade bezahlt hast. Zweitens: Deine Zähne müssen vorher gesund sein. Kommt eine Füllung, eine Reinigung oder eine Behandlung des Zahnfleischs dazu, kommt sie dazu. Drittens: Veneers verfärben sich nicht, deine übrigen Zähne schon. Wer nur die Frontzähne machen lässt, gleicht die Farbe später wieder an.",
      ),
      p(
        "Frag bei jedem Angebot, ob diese drei Punkte besprochen wurden. Wenn nicht, ist es kein günstiges Angebot, sondern ein unvollständiges.",
      ),

      h2("Zahlt die Krankenkasse oder Zusatzversicherung?"),
      p(
        "Die gesetzliche Krankenkasse zahlt für Veneers nichts, solange sie aus ästhetischen Gründen gemacht werden. Das ist keine Auslegungssache, sondern der Normalfall.",
      ),
      p(
        "Anders liegt es, wenn ein Frontzahn durch einen Unfall abgebrochen ist oder ein Defekt vorliegt, der ohnehin versorgt werden muss. Dann übernimmt die Kasse den Festzuschuss für die Regelversorgung, meist eine Krone oder eine Füllung. Entscheidest du dich stattdessen für ein Veneer, bekommst du diesen Zuschuss angerechnet und zahlst die Differenz.",
      ),
      h3("Und die Zahnzusatzversicherung?"),
      p(
        "Hier ist die wichtigste Auskunft eine unangenehme: Wenn du jetzt Veneers möchtest und heute eine Zusatzversicherung abschließt, bekommst du dafür nichts. Versicherungen zahlen nicht für Behandlungen, die bei Vertragsabschluss schon angeraten oder absehbar waren. Dazu kommen Wartezeiten von oft acht Monaten und Zahnstaffeln, die die Leistung in den ersten Jahren deckeln.",
      ),
      p(
        "Und selbst mit lange bestehendem Vertrag gilt: Die meisten Tarife leisten für Zahnersatz und Zahnbehandlung, nicht für Ästhetik. Ob dein Tarif Veneers einschließt, steht in deinen Bedingungen. Such nach „medizinisch notwendig“, daran hängt alles. Frag im Zweifel vor der Behandlung schriftlich bei deiner Versicherung nach, nicht danach.",
      ),

      h2("Billig-Veneers: woran gespart wird"),
      p(
        "Es gibt Angebote für 400 Euro pro Keramikveneer, im Ausland auch für weniger. Diese Preise sind echt. Die Frage ist nur, was darin nicht enthalten ist.",
      ),
      p(
        "Gespart wird fast immer an denselben vier Stellen. Am Material, wenn eine günstigere Keramik verarbeitet oder Komposit als Keramik verkauft wird. Am Labor, wenn die Arbeit an einen Billiganbieter weitergegeben wird und niemand sie vor dem Einsetzen kontrolliert. An der Vorbereitung, wenn Planung und Mock-up wegfallen und du das Ergebnis zum ersten Mal siehst, wenn es schon drin ist. Und an den Terminen: Wenn alles an einem Tag passieren soll, fehlt der Schritt dazwischen, an dem geprüft und nachjustiert wird.",
      ),
      p(
        "Das letzte wird oft missverstanden, deshalb genau: Viele Zähne in kurzer Zeit sind kein Warnsignal. Zwanzig Zähne zu beschleifen dauert bei mir keine drei Stunden. Das Warnsignal ist, wenn es keinen zweiten Termin gibt, wenn zwischen Beschleifen und endgültigem Einsetzen niemand noch einmal hinschaut.",
      ),
      p(
        "Der teuerste Teil kommt danach. Ein Veneer, das nicht passt, lässt sich nicht zurückgeben. Der Zahnschmelz darunter ist weg, und die Korrektur kostet regelmäßig mehr als die ursprüngliche Behandlung; oft wird aus dem Veneer dann eine Krone. Wer im Ausland behandelt wurde, hat außerdem niemanden vor Ort, der die Gewährleistung übernimmt.",
      ),
      p([
        "Damit das nicht nach Angstmache klingt: Günstig ist nicht automatisch schlecht, und teuer ist keine Garantie. Aber wenn ein Angebot deutlich unter allen anderen liegt, lohnt genau eine Frage: welcher der vier Punkte oben darin fehlt. Wie sich ein Berliner Angebot gegen eine Behandlung im Ausland rechnet, steht in ",
        {
          text: "Veneers in der Türkei: der ehrliche Vergleich",
          href: "/magazin/veneers-tuerkei-vergleich",
        },
        ".",
      ]),

      h2("FAQ zu Veneers-Kosten"),
      h3("Kann man Veneers in Raten zahlen?"),
      p(
        "Ja. Wir arbeiten mit der Mediserv Bank zusammen: bis zu sechs Raten sind zinsfrei, Laufzeiten bis 56 Monate sind möglich, beides bei positiver Bonitätsprüfung. Besprich das am besten schon im Beratungsgespräch, dann steht die Finanzierung, bevor der erste Zahn angerührt wird.",
      ),
      h3("Sind Veneers steuerlich absetzbar?"),
      p(
        "Nur wenn sie medizinisch notwendig sind: dann als außergewöhnliche Belastung, und auch dann erst oberhalb deiner zumutbaren Eigenbelastung, die sich nach Einkommen und Familienstand richtet. Rein ästhetische Behandlungen erkennt das Finanzamt nicht an. Ob dein Fall darunterfällt, klärst du besser mit einer Steuerberatung als mit uns.",
      ),
      h3("Werden Veneers pro Zahn günstiger, wenn man mehrere machen lässt?"),
      p(
        "Der Preis pro Zahn bleibt gleich. Was sich verteilt, ist das Mock-up: Es fällt einmal pro Kiefer an, nicht pro Zahn. Bei einem einzelnen Veneer brauchst du oft gar keines, bei zweien macht es einen spürbaren Anteil aus, bei zwölf kaum noch. Rechnerisch wird es pro Zahn also etwas günstiger, aber nicht, weil wir einen Mengenrabatt geben.",
      ),
      h3("Warum sind Veneers je nach Zahnarzt unterschiedlich teuer?"),
      p(
        "Weil „Veneer“ kein genormtes Produkt ist. Der Preis enthält Material, Laborzeit, Planung, Mock-up, Behandlungszeit und Nachsorge, und jede Praxis stellt diesen Korb anders zusammen. Vergleichbar werden Angebote erst, wenn du dir für jedes aufschlüsseln lässt, was enthalten ist. Frag konkret nach: Ist die Planung dabei? Das Mock-up? Wo wird das Veneer gefertigt? Wer zahlt, wenn es nachgearbeitet werden muss?",
      ),

      p([
        "Wenn du wissen willst, was Veneers in deinem Fall kosten, brauchst du keine Preisliste, sondern einen Blick in deinen Mund. Das Beratungsgespräch kostet 99 Euro und wird angerechnet, wenn du dich für die Behandlung entscheidest. Wie die Behandlung abläuft, steht in ",
        { text: "unserem Veneers-Ratgeber", href: "/veneers-berlin" },
        "; wie wir sie machen, auf der Seite zu ",
        { text: "Veneers in Berlin", href: "/leistungen/veneers" },
        ".",
      ]),
    ],

    seo: {
      _type: "seo",
      title: "Was kosten Veneers? Preise pro Zahn im Überblick",
      description:
        "Veneers Kosten: alle Preise pro Zahn für Keramik- und Komposit-Veneers, plus was die Zahnzusatzversicherung übernimmt. Vom Berliner Zahnarzt erklärt.",
    },
  },

  notes: [
    "Date: the document says 'Veröffentlicht am [Datum]'. Set to 2026-10-16 as a placeholder.",
    "Category 'Kosten & Kassen' → kosten (new value, added to the schema on 16.10.2026).",
    "Headline variant A is the H1; the choice between A, B and C is still open with Mara and Flo.",
    "Header image missing. Suggested caption and alt text not imported: 'Zahntechniker beim Schichten eines Keramikveneers im Praxislabor.' / 'Zahntechniker trägt Keramik in mehreren Schichten auf ein Veneer auf'.",
    "Closing CTA label 'Beratungstermin vereinbaren' and the Artikelfuß teaser ('Weiterlesen: Veneers-Arten im Vergleich') have no field.",
    "Open with Hannes: 'Oft sind es zwölf' (dropped), 'technisch der anspruchsvollste Fall' (kept), the Komposit price (stays at 450 €).",
    "Links to /magazin/veneers-arten and /magazin/veneers-tuerkei-vergleich work only once those posts are published too.",
  ],
};
