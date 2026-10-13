/**
 * Schaden Veneers den Zähnen? — new magazine post, first draft of 26.09.2026
 * (file v3 of 12.10.2026).
 *
 * Mapping from the agency's article template onto the post schema:
 *
 *   H1                 → title (the page sets it as the h1)
 *   Markenebene        no field, not in the text
 *   Kategorie          → category ("Behandlung verstehen" → behandlung)
 *   Standfirst         → lead
 *   Autorenzeile       → author (reference); the page prints name and role
 *   Datum              → date ("[Datum]" in the document, see notes)
 *   Lesezeit, TOC      built by the page from the text and its h2
 *   Einstieg, H2 1–6   → text: paragraphs, h2, h3; FAQ as h2 + h3 + answers
 *   Abschluss          → last paragraph of text; the CTA label has no field
 *   Artikelfuß         CTA button → service reference (the page renders the
 *                      way back to the service); the teaser has no field
 *   Meta               → seo
 *
 * Link anchors in square brackets become `link` annotations where the target
 * exists on the site; dashes are replaced by a colon, comma or full stop.
 */

let k = 0;
const block = (style, parts) => {
  const n = ++k;
  const markDefs = [];
  const children = (Array.isArray(parts) ? parts : [parts]).map((part, i) => {
    if (typeof part === "string")
      return { _type: "span", _key: `t${n}s${i + 1}`, text: part, marks: [] };
    const key = `t${n}l${markDefs.length + 1}`;
    markDefs.push({ _key: key, _type: "link", href: part.href });
    return {
      _type: "span",
      _key: `t${n}s${i + 1}`,
      text: part.text,
      marks: [key],
    };
  });
  return { _type: "block", _key: `t${n}`, style, markDefs, children };
};
const p = (parts) => block("normal", parts);
const h2 = (text) => block("h2", text);
const h3 = (text) => block("h3", text);

export default {
  id: "post-veneers-schaden",
  type: "post",
  source: "MP_Blog_04_Veneers_Schaden_v3_2026-10-12.docx",

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
        "Die Bilder, die du vielleicht gesehen hast (Reihen spitzer, brauner Stümpfe), zeigen fast nie Veneer-Präparationen. Sie zeigen Kronenpräparationen. Der Unterschied steht weiter unten, und er ist groß.",
      ),

      h2("Veneers ohne Schleifen: geht das?"),
      p(
        "Ja, aber nicht immer. Non-Prep-Veneers sind so dünn, dass sie ohne nennenswerten Abtrag aufgeklebt werden können. Dafür braucht es Platz: Wenn deine Zähne etwas zu klein sind, leicht nach innen stehen oder Lücken haben, ist er da.",
      ),
      p([
        "Stehen deine Zähne dagegen ohnehin vor, würde jede zusätzliche Schicht sie weiter nach vorn bringen. Und sehr dünne Keramik ist durchscheinend: Ein stark verfärbter Zahn schimmert hindurch. In beiden Fällen führt kein Weg an etwas Abtrag vorbei. Was die Varianten sonst noch unterscheidet, steht in ",
        {
          text: "Veneers-Arten im Vergleich",
          href: "/veneers-berlin#arten-im-vergleich",
        },
        ".",
      ]),
      p(
        "Die zweite schleiffreie Option ist Komposit. Es wird aufgebaut statt abgetragen und lässt sich wieder entfernen. Dafür hält es kürzer und verfärbt sich.",
      ),

      h2("Veneers vs. Kronen: der Unterschied"),
      p(
        "Ein Veneer bedeckt die Vorderseite des Zahns, manchmal zusätzlich die Schneidekante. Der Rest des Zahns bleibt, wie er ist.",
      ),
      p(
        "Eine Krone umfasst den ganzen Zahn. Dafür wird er rundherum verkleinert, um ein bis zwei Millimeter, und dabei fast immer bis ins Dentin. Es geht also ein Vielfaches an Substanz verloren, der Zahnnerv liegt näher am Geschehen, und über die Jahre steigt das Risiko, dass er abstirbt und eine Wurzelbehandlung nötig wird.",
      ),
      p(
        "Deshalb gilt in der Reihenfolge: erst prüfen, ob es ohne Abtrag geht, dann das Veneer, und die Krone erst, wenn vom Zahn ohnehin zu wenig übrig ist. Wer mit der Krone anfängt, kann nicht mehr zurück.",
      ),

      h2("Wann Veneers die falsche Wahl sind"),
      p(
        "Es gibt sechs Situationen, in denen ich abrate. Nicht aus Vorsicht, sondern weil es in diesen Fällen etwas Besseres gibt oder die Voraussetzungen fehlen.",
      ),
      p(
        "Wenn dich nur die Stellung deiner Zähne stört, gehören sie bewegt und nicht überklebt: Dafür gibt es Aligner. Wenn ein Zahn wurzelbehandelt ist oder große Füllungen hat, trägt ein Veneer nicht mehr; dann ist die Krone die richtige Versorgung. Wenn die Mundhygiene nicht stimmt und sich daran nichts ändern lässt, hält keine Klebeverbindung dauerhaft. Wenn du dich für die Behandlung verschulden müsstest, ist es die falsche Zeit. Wenn du unter 18 bist, ist das Wachstum nicht abgeschlossen. Und wenn eine Parodontitis aktiv und unbehandelt ist, wird sie zuerst behandelt. Alles andere baut auf Sand.",
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
        "Komposit-Veneers ja, weitgehend spurlos. Keramikveneers lassen sich zwar ablösen, aber der Zahnschmelz darunter fehlt weiterhin: Der Zahn braucht also wieder eine Versorgung. „Entfernen“ heißt hier: austauschen, nicht zurück zum Ausgangszustand.",
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
        "Schaden Veneers den Zähnen? Was beim Abschleifen wirklich passiert, wann Non-Prep-Veneers die Lösung sind und worauf Sie achten sollten. Ehrlich erklärt.",
    },
  },

  notes: [
    "Date: the document says 'Veröffentlicht am [Datum]'. Set to 2026-10-13 as a placeholder; the practice must set the real date.",
    "Slug 'veneers-schaden' from the document's URL /blog/veneers-schaden/; the site serves it as /magazin/veneers-schaden.",
    "Category 'Behandlung verstehen' → behandlung. The agency's three blog categories (Material & Technik, Kosten & Kassen, Behandlung verstehen) do not match the schema's four.",
    "Markenebene A 'Was weg ist, kommt nicht wieder. Die Frage ist, wie viel weggeht' has no field and is not in the text.",
    "Header image missing; suggested caption and alt text not imported (no image yet): 'Mock-up aus Kunststoff auf ungeschliffenen Zähnen, der Moment vor der Entscheidung.' / 'Patientin trägt ein Kunststoff-Mock-up auf den eigenen, unbeschliffenen Frontzähnen'.",
    "Closing CTA label 'Unverbindlich beraten lassen' has no field. The closing paragraph follows the last FAQ answer without a heading of its own.",
    "Artikelfuß: CTA button 'Zur Leistung: Veneers' is covered by the service reference (the page prints the button as 'Veneers'). Teaser 'Weiterlesen: Veneers vorher / nachher' has no field and no target post; the page shows related posts of the same category instead.",
    "Link 'Veneers-Arten im Vergleich' points to /veneers-berlin#arten-im-vergleich (the pillar's comparison section); the agency means a separate 'Arten' post that does not exist yet.",
    "seo.description uses 'Sie' ('worauf Sie achten sollten'); kept as delivered, the agency flags it as well.",
    "Paired dashes around 'Reihen spitzer, brauner Stümpfe' became parentheses.",
    "Source of the 93.5 % figure (Beier, Kapferer, Dumfahrt 2012) is not in the text; §3 HWG: the sentence 'Das ist keine Zusage für deinen Zahn' must not be cut.",
  ],
};
