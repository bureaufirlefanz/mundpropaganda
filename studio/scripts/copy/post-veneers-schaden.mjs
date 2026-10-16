/**
 * Schaden Veneers den Zähnen? — fifth version of 15.10.2026
 * (`texte/blogs/MP_Blog_04_Veneers_Schaden_v5_2026-10-15.docx`), replacing
 * the import of v3 (13.10.2026). Non-Prep is gone, "Dr." is gone, the
 * chapter "Veneers ohne Schleifen" is rewritten around Komposit.
 *
 * Mapping from the agency's article template onto the post schema:
 *
 *   H1                 → title (the page sets it as the h1)
 *   Markenzeile        no field, not in the text
 *   Kategorie          → category ("Behandlung verstehen" → behandlung)
 *   Standfirst         → lead
 *   Autorenzeile       → author (reference); the page prints name and role
 *   Datum              → date ("[Datum]" in the document, see notes)
 *   Lesezeit, TOC      built by the page from the text and its h2
 *   Einstieg, H2 1–6   → text: paragraphs, h2, h3; FAQ as h2 + h3 + answers
 *   Abschluss          → last paragraph of text; the CTA label has no field
 *   Artikelfuß         CTA button → service reference; the teaser has no field
 *   Meta               → seo
 *
 * Link anchors in square brackets become `link` annotations where the target
 * exists on the site; dashes are replaced by a colon, comma or full stop.
 */
import { make } from "../copy-blocks.mjs";

const { p, h2, h3 } = make();

export default {
  id: "post-veneers-schaden",
  type: "post",
  source: "MP_Blog_04_Veneers_Schaden_v5_2026-10-15.docx",

  create: {
    title: "Schaden Veneers den Zähnen?",
    slug: { _type: "slug", current: "veneers-schaden" },
  },

  set: {
    title: "Schaden Veneers den Zähnen?",
    slug: { _type: "slug", current: "veneers-schaden" },
    date: "2026-10-13",
    category: "behandlung",
    author: { _type: "reference", _ref: "person-schulte-ostermann" },
    service: { _type: "reference", _ref: "service-veneers" },
    lead: "Was beim Abschleifen wirklich passiert, wie viel Schmelz verloren geht und wann ich abrate.",

    text: [
      p(
        "Die kurze Antwort: Für ein Keramikveneer wird Zahnschmelz abgetragen, und Zahnschmelz wächst nicht nach. Insofern ja, der Zahn verändert sich dauerhaft. Wer dir etwas anderes erzählt, verkauft dir etwas.",
      ),
      p(
        "Die längere Antwort ist entscheidend, denn „dauerhaft verändert“ und „geschädigt“ sind nicht dasselbe. Es geht um ein paar Zehntelmillimeter, die an der richtigen Stelle abgetragen werden, und darum, ob sie überhaupt abgetragen werden müssen. Hier steht, was dabei wirklich passiert.",
      ),

      h2("Was beim Abschleifen wirklich passiert"),
      p(
        "Auf der Vorderseite deiner Schneidezähne liegt Zahnschmelz, je nach Stelle zwischen etwa drei Zehntel- und einem Millimeter dick. Für ein Veneer werden davon meist drei bis sieben Zehntel abgetragen: ungefähr die Dicke einer Eierschale.",
      ),
      p(
        "Die wichtigste Regel dabei lautet: Es soll im Schmelz bleiben. Darunter liegt Dentin, und Dentin verhält sich anders. Der Kleber haftet dort schlechter, der Zahn reagiert empfindlicher auf Kälte, und die Verbindung hält weniger lange. Eine gut gemachte Veneer-Präparation unterschreitet diese Grenze nicht.",
      ),
      p(
        "Die Bilder, die du vielleicht gesehen hast, Reihen spitzer, brauner Stümpfe, zeigen fast nie Veneer-Präparationen. Sie zeigen Kronenpräparationen. Der Unterschied steht weiter unten.",
      ),

      h2("Veneers ohne Schleifen: geht das?"),
      p(
        "Bei einem Keramikveneer nicht ganz. Es bleibt aber oft bei wenigen Zehntelmillimetern, und an manchen Stellen bei null; wie viel es wird, entscheidet die geplante Form. Wie das gesteuert wird, steht weiter unten.",
      ),
      p(
        "Die schleiffreie Variante ist Komposit. Es wird aufgebaut statt abgetragen und lässt sich wieder entfernen. Dafür hält es kürzer und verfärbt sich mit den Jahren. Wenn du unsicher bist, ist das der Weg, der dir alle Türen offen lässt.",
      ),
      p([
        "Was Keramik und Komposit sonst noch unterscheidet, steht in ",
        { text: "Veneers-Arten im Vergleich", href: "/magazin/veneers-arten" },
        ".",
      ]),

      h2("Veneers vs. Kronen: der Unterschied"),
      p(
        "Ein Veneer bedeckt die Vorderseite des Zahns, manchmal zusätzlich die Schneidekante. Der Rest des Zahns bleibt, wie er ist.",
      ),
      p(
        "Eine Krone umfasst den ganzen Zahn. Dafür wird er rundherum verkleinert, um ein bis zwei Millimeter, und dabei fast immer bis ins Dentin. Es geht also ein Vielfaches an Substanz verloren, der Zahnnerv liegt näher am Geschehen, und über die Jahre steigt das Risiko, dass er abstirbt und eine Wurzelbehandlung nötig wird.",
      ),
      p(
        "Deshalb gilt in der Reihenfolge: erst prüfen, ob es mit Komposit geht, dann das Veneer, und die Krone erst, wenn vom Zahn ohnehin zu wenig übrig ist. Wer mit der Krone anfängt, kann nicht mehr zurück.",
      ),

      h2("Wann Veneers die falsche Wahl sind"),
      p(
        "Es gibt sechs Situationen, in denen ich abrate. Nicht aus Vorsicht, sondern weil es in diesen Fällen etwas Besseres gibt oder die Voraussetzungen fehlen.",
      ),
      p(
        "Wenn dich nur die Stellung deiner Zähne stört, gehören sie bewegt und nicht überklebt; dafür gibt es Aligner. Wenn ein Zahn wurzelbehandelt ist oder große Füllungen hat, trägt ein Veneer nicht mehr; dann ist die Krone die richtige Versorgung. Wenn die Mundhygiene nicht stimmt und sich daran nichts ändern lässt, hält keine Klebeverbindung dauerhaft. Wenn du dich für die Behandlung verschulden müsstest, ist es die falsche Zeit. Wenn du unter 18 bist, ist das Wachstum nicht abgeschlossen. Und wenn eine Parodontitis aktiv und unbehandelt ist, wird sie zuerst behandelt; alles andere baut auf Sand.",
      ),

      h2("So minimierst du das Risiko"),
      p(
        "Der wichtigste Punkt ist technisch und klingt unspektakulär: Es wird erst geplant, dann beschliffen. Aus der digitalen Planung entsteht ein Mock-up, also die geplante Zahnform aus Kunststoff, die dir aufgesetzt wird. Über dieses Mock-up wird ein Silikonschlüssel angefertigt, und der gibt beim Beschleifen vor, wie viel abgetragen werden darf.",
      ),
      p(
        "Das ist der ganze Unterschied zwischen minimalinvasiv als Wort und als Verfahren. Ohne Schlüssel schätzt man, und wer schätzt, nimmt im Zweifel mehr weg. Mit Schlüssel wird genau so viel abgetragen, wie die geplante Form braucht, und keinen Zehntelmillimeter mehr. An manchen Stellen ist das null.",
      ),
      p(
        "Der Rest ist weniger aufregend, aber genauso wichtig: Karies und Zahnfleischentzündungen vorher behandeln, bei nächtlichem Knirschen eine Schiene tragen, zur Kontrolle kommen. Und wenn du unsicher bist: mit Komposit anfangen. Du kannst es jederzeit rückgängig machen.",
      ),
      h3("Was die Zahlen sagen"),
      p(
        "Zum Schluss die Größenordnung, die in den Videos nie vorkommt. In einer Innsbrucker Langzeituntersuchung waren nach zehn Jahren noch 93,5 Prozent der Keramikveneers in Funktion. Das ist keine Zusage für deinen Zahn. Es heißt aber, dass ein sauber geplantes und sauber geklebtes Veneer zu den haltbarsten Versorgungen gehört, die die Zahnmedizin kennt. Die Fälle, die schiefgehen, haben fast immer eine von drei Ursachen: zu viel abgetragen, unbehandeltes Zahnfleisch, oder Knirschen ohne Schiene. Alle drei lassen sich vorher klären.",
      ),

      h2("FAQ zu Risiken"),
      h3("Kann man Veneers wieder entfernen?"),
      p(
        "Komposit-Veneers ja, weitgehend spurlos. Keramikveneers lassen sich zwar ablösen, aber der Zahnschmelz darunter fehlt weiterhin; der Zahn braucht also wieder eine Versorgung. „Entfernen“ heißt hier: austauschen, nicht zurück zum Ausgangszustand.",
      ),
      h3("Was passiert mit den Zähnen nach 15 Jahren Veneers?"),
      p(
        "Wenn die Ränder dicht sind und du sie ordentlich pflegst, passiert dem Zahn darunter nichts Besonderes. Irgendwann ist das Veneer selbst an der Reihe und wird erneuert; dabei geht meist noch etwas Substanz verloren. Manche Zähne werden nach zwei Veneer-Generationen zu Kronen. Das ist kein Unfall, sondern der normale Lauf.",
      ),
      h3("Kann unter Veneers Karies entstehen?"),
      p(
        "Ja, wie unter jeder Füllung und jeder Krone, und zwar am Rand, dort wo Keramik auf Zahn trifft. Das Veneer selbst kann keine Karies bekommen, dein Zahn schon. Deshalb sind Zahnseide und regelmäßige Kontrollen nach Veneers nicht weniger wichtig als vorher, sondern mehr.",
      ),
      h3("Schmerzen die Zähne nach dem Einsetzen von Veneers?"),
      p(
        "Empfindlichkeit auf Kalt und Süß in den ersten Tagen bis Wochen ist normal, besonders wenn an einzelnen Stellen Dentin freilag. Das gibt sich. Was nicht normal ist: Schmerz beim Zubeißen oder Beschwerden, die nach Wochen zunehmen. Dann stimmt meist der Biss nicht, und das lässt sich in wenigen Minuten korrigieren. Melde dich in dem Fall, statt abzuwarten.",
      ),

      p([
        "Ob Veneers deinen Zähnen schaden, entscheidet sich nicht am Material, sondern daran, wie viel abgetragen wird und ob es überhaupt sein muss. Das sieht man am Zahn, nicht im Internet. Wie eine Behandlung bei uns abläuft, steht in ",
        { text: "unserem Veneers-Ratgeber", href: "/veneers-berlin" },
        " und auf der Seite zu ",
        { text: "Veneers in Berlin", href: "/leistungen/veneers" },
        ".",
      ]),
    ],

    seo: {
      _type: "seo",
      title: "Schaden Veneers den Zähnen? Der ehrliche Blick",
      description:
        "Schaden Veneers den Zähnen? Wie viel Zahnschmelz wirklich abgetragen wird, wo der Unterschied zur Krone liegt und wann wir abraten. Ehrlich erklärt.",
    },
  },

  notes: [
    "Date: the document says 'Veröffentlicht am [Datum]'. Kept at 2026-10-13 from the first import.",
    "seo.description is the copywriter's proposal (the agency's original names Non-Prep and uses 'Sie'); Summer Days has to confirm it.",
    "Markenzeile 'Was weg ist, kommt nicht wieder. Die Frage ist, wie viel weggeht' (variant A) has no field; choice A/B/C open.",
    "Header image missing. Suggested caption and alt text not imported: 'Mock-up aus Kunststoff auf ungeschliffenen Zähnen: der Moment vor der Entscheidung.' / 'Patientin trägt ein Kunststoff-Mock-up auf den eigenen, unbeschliffenen Frontzähnen'.",
    "Open with Hannes: may 'wenn du dich für die Behandlung verschulden müsstest' stand publicly?",
    "Closing CTA label 'Unverbindlich beraten lassen' and the Artikelfuß teaser ('Weiterlesen: Veneers vorher / nachher') have no field.",
  ],
};
