/**
 * Veneers Arten: der große Vergleich — new magazine post, fifth version of
 * 15.10.2026 (`texte/blogs/MP_Blog_02_Veneers_Arten_v5_2026-10-15.docx`).
 *
 * Mapping as in `post-veneers-schaden.mjs`. The "Markenzeile" under the H1
 * is set as an h2 in the document but is a line, not a chapter; it is not
 * imported, as with the other posts. The comparison table is a `table`
 * block.
 */
import { make } from "../copy-blocks.mjs";

const { p, h2, h3, table } = make();
const slug = "veneers-arten";

export default {
  id: `post-${slug}`,
  type: "post",
  source: "MP_Blog_02_Veneers_Arten_v5_2026-10-15.docx",

  create: {
    title: "Veneers Arten: der große Vergleich",
    slug: { _type: "slug", current: slug },
  },

  set: {
    title: "Veneers Arten: der große Vergleich",
    slug: { _type: "slug", current: slug },
    date: "2026-10-16",
    category: "technik",
    author: { _type: "reference", _ref: "person-schulte-ostermann" },
    service: { _type: "reference", _ref: "service-veneers" },
    lead: "Keramik, Komposit, E-max, Sofort-Veneers: vier Namen, zwei echte Unterschiede.",

    text: [
      p(
        "Wenn du dich in den letzten Tagen eingelesen hast, kennst du die Begriffe: Keramik, Komposit, E-max, Presskeramik, Sofort-Veneers. Das klingt nach fünf Produkten. Es sind zwei Entscheidungen.",
      ),
      p(
        "Erstens: Keramik oder Kunststoff. Zweitens: Wird das Veneer für dich gemacht oder kommt es fertig aus der Schachtel. Alles andere ist die Frage, wie die Keramik hergestellt wird, und die beantwortet das Labor, nicht du. Hier ist die Sortierung.",
      ),

      h2("Die Übersichtstabelle"),
      table([
        [
          "Art",
          "Material",
          "Haltbarkeit",
          "Preis ab",
          "Sitzungen",
          "Reversibel",
        ],
        [
          "Keramik, geschichtet",
          "Feldspatkeramik",
          "über 10 Jahre",
          "ab 1.500 €",
          "2–3",
          "nein",
        ],
        [
          "Keramik, gefräst",
          "Lithiumdisilikat (E-max)",
          "über 10 Jahre",
          "ab 1.500 €",
          "2–3",
          "nein",
        ],
        [
          "Keramik, gepresst",
          "Presskeramik",
          "über 10 Jahre",
          "ab 1.500 €",
          "2–3",
          "nein",
        ],
        ["Komposit", "Kunststoff", "deutlich kürzer", "ab 450 €", "1", "ja"],
        [
          "Sofort-Veneers",
          "vorgefertigtes Komposit",
          "deutlich kürzer",
          "bieten wir nicht an",
          "1",
          "ja",
        ],
      ]),
      p([
        "Die Tabelle beantwortet die meisten Fragen schon. Zwei Dinge fallen auf: Zwischen Komposit und Keramik liegt mehr als das Dreifache. Und die drei Keramikzeilen kosten dasselbe; der Unterschied liegt nicht im Preis, sondern in der Herstellung. Was die Preise im Einzelnen enthalten, steht in ",
        { text: "was Veneers kosten", href: "/magazin/veneers-kosten" },
        ".",
      ]),
      h3("Wie die Spalte „Haltbarkeit“ zu lesen ist"),
      p(
        "Die Angaben sind keine Zusage, sondern Erfahrungswerte aus Studien. In einer Innsbrucker Langzeituntersuchung waren nach zehn Jahren noch 93,5 Prozent der Keramikveneers in Funktion. Das ist ein sehr guter Wert; er beschreibt allerdings ein Kollektiv und nicht deinen Zahn. Wie lange deine halten, hängt an drei Dingen: ob du nachts knirschst, wie sauber der Klebeverbund beim Einsetzen war und wie konsequent du putzt. Der erste Punkt wiegt am schwersten. Wer knirscht und keine Schiene trägt, darf jede Zahl in dieser Tabelle halbieren.",
      ),

      h2("Keramik-Veneers"),
      p(
        "Der Standard, wenn es lange halten und natürlich aussehen soll. Keramik ist farbstabil, sie verfärbt sich nicht durch Kaffee, Rotwein oder Zigaretten, und sie lässt Licht ähnlich durchscheinen wie echter Zahnschmelz. Das ist der Grund, warum gute Veneers nicht auffallen.",
      ),
      h3("Vier Wege zur Keramikschale"),
      p(
        "Keramik ist nicht Keramik. Es gibt vier gängige Herstellungswege, und sie führen zu unterschiedlichen Eigenschaften: geschichtete Keramik, bemalte Keramik, Fräskeramik und Presskeramik.",
      ),
      p(
        "Geschichtete Veneers baut ein Zahntechniker von Hand auf, Schicht für Schicht. Das erlaubt feine Farbverläufe, vom etwas dunkleren Zahnhals bis zur transparenten Schneidekante, und ist bei Frontzähnen kaum zu schlagen. Es ist der aufwendigste Weg und der mit dem größten Spielraum.",
      ),
      p(
        "Gefräste Veneers aus Lithiumdisilikat, meist unter dem Markennamen E-max verkauft, entstehen aus einem Block. Die Keramik ist dadurch gleichmäßig dicht und bruchfester. Wer nachts knirscht oder kräftig zubeißt, fährt damit oft besser. Presskeramik erreicht ein ähnliches Ziel über ein anderes Verfahren: Die Keramik wird unter Druck und Hitze in eine Form gepresst, was sehr formtreue und stabile Schalen ergibt.",
      ),
      p(
        "Bei bemalter Keramik wird eine Grundform hergestellt und die Farbgestaltung anschließend auf der Oberfläche ergänzt. Das ist schneller als vollständiges Schichten und reicht in vielen Fällen aus.",
      ),
      p(
        "Für dich als Patient ist das keine Entscheidung, die du allein treffen musst. Welcher Weg passt, hängt davon ab, wie viel Platz vorhanden ist, wie dunkel der Zahn darunter ist und wie stark deine Kaukräfte sind. Wichtig ist nur, dass dir jemand sagen kann, welche Keramik verwendet wird und warum diese. Eine Praxis, die nur „hochwertige Keramik“ anbietet, hat die Abwägung nicht getroffen.",
      ),
      h3("Der Haken"),
      p([
        "Keramikveneers sind nicht reversibel. Für sie wird eine dünne Schicht Zahnschmelz abgetragen, und Schmelz wächst nicht nach. Diese Entscheidung gilt für den Rest deines Zahnlebens: Ab da trägt der Zahn immer eine Versorgung. Ob das dem Zahn schadet, haben wir in ",
        {
          text: "Schaden Veneers den Zähnen?",
          href: "/magazin/veneers-schaden",
        },
        " auseinandergenommen.",
      ]),

      h2("Komposit-Veneers"),
      p(
        "Komposit ist zahnfarbener Kunststoff, derselbe, aus dem moderne Füllungen bestehen. Er wird direkt im Mund modelliert, in einer einzigen Sitzung, ohne Labor und meistens ohne Beschliff.",
      ),
      p(
        "Modern wird dabei nicht freihändig gearbeitet. Aus einem digitalen Modell deines geplanten Lächelns entsteht eine transparente Form, in die das Komposit eingebracht wird; das Ergebnis ist gleichmäßiger als von Hand modelliert. Ein Mock-up gehört auch hier dazu und ist im Preis enthalten.",
      ),
      h3("Wofür es sich lohnt"),
      p(
        "Für kleine Korrekturen, für ein Budget, das eine Keramikversorgung gerade nicht hergibt, und vor allem für alle, die sich noch nicht sicher sind. Komposit lässt sich reparieren, ergänzen und wieder entfernen. Das macht es zur einzigen Veneer-Art, bei der du deine Meinung noch ändern kannst.",
      ),
      h3("Was du dafür in Kauf nimmst"),
      p(
        "Kunststoff nimmt Farbstoffe auf. Nach ein paar Jahren sieht man das, besonders an den Rändern, und die Oberfläche verliert ihren Glanz. Komposit-Veneers halten deutlich kürzer als Keramik, und wie kurz genau, hängt stark von dir ab: Rauchen, Kaffee und nächtliches Knirschen beschleunigen alles.",
      ),

      h2("Sofort-Veneers und Veneers-to-go"),
      p(
        "Hier geht es um vorgefertigte Schalen aus Komposit, die es in verschiedenen Größen gibt und die in einer Sitzung angepasst und aufgeklebt werden. Kein Labor, kein Modell, keine Einzelanfertigung.",
      ),
      p(
        "Der Reiz liegt auf der Hand: schnell und günstig. Der Preis dafür ist die Individualität. Deine Zähne sind nicht genormt, vorgefertigte Schalen schon, und was in der Schachtel am besten passt, ist selten das, was zu deinem Gesicht gehört. Für einen einzelnen abgebrochenen Zahn oder als Übergangslösung kann das sinnvoll sein. Als Lösung für ein ganzes Lächeln sehe ich es nicht.",
      ),
      p(
        "Wir bieten sie deshalb nicht an. Von Angeboten, die ganz ohne Abformung, ohne Beratung und per Post funktionieren, würde ich ohnehin absehen: Was auf deine Zähne geklebt wird, sollte jemand vorher angesehen haben.",
      ),

      h2("Welche Art für welchen Fall?"),
      p(
        "Die ehrliche Antwort lautet: Das entscheidet dein Zahn, nicht dein Budget, und schon gar nicht ein Artikel. Trotzdem lässt sich eine Richtung angeben.",
      ),
      p(
        "Willst du eine dauerhafte Lösung für die Frontzähne und sie soll niemandem auffallen, ist geschichtete Keramik der Weg. Knirschst du nachts oder hast kräftige Kaumuskeln, spricht mehr für gefräste oder gepresste Keramik. Bist du dir noch nicht sicher, ob Veneers überhaupt zu dir passen, fang mit Komposit an. Du kannst jederzeit zurück.",
      ),
      p(
        "Und wenn es nur um eine einzelne abgebrochene Ecke geht, brauchst du vielleicht gar kein Veneer, sondern eine gute Füllung. Das ist ein Satz, den man selten liest, und einer der häufigsten Befunde in meinem Sprechzimmer.",
      ),

      h2("FAQ zu Veneers-Arten"),
      h3("Was ist besser: Keramik- oder Komposit-Veneers?"),
      p(
        "Keramik hält länger, verfärbt sich nicht und sieht natürlicher aus. Komposit ist günstiger, in einer Sitzung fertig und rückgängig zu machen. „Besser“ hängt also davon ab, was du gewichtest. Wer eine dauerhafte Lösung sucht, nimmt Keramik. Wer ausprobieren will, nimmt Komposit.",
      ),
      h3("Was sind E-Max-Veneers?"),
      p(
        "E-max ist ein Markenname für Lithiumdisilikat-Keramik. Der Werkstoff ist besonders bruchfest und wird aus einem Block gefräst oder gepresst. Es ist also kein eigener Veneer-Typ, sondern eine Keramiksorte: eine sehr gute, aber nicht die einzige.",
      ),
      h3(
        "Was ist der Unterschied zwischen geschichteter und gefräster Keramik?",
      ),
      p(
        "Geschichtete Keramik wird von Hand aufgebaut und erlaubt feinere Farbverläufe; bei Frontzähnen ist das der Vorteil. Gefräste Keramik kommt aus einem Block, ist dichter und bruchfester, und damit die bessere Wahl, wenn du nachts knirschst. Beide kosten bei uns dasselbe; die Entscheidung fällt am Befund.",
      ),
      h3("Kann man verschiedene Veneer-Arten kombinieren?"),
      p(
        "Technisch ja, empfehlenswert ist es selten. Unterschiedliche Materialien altern unterschiedlich: Komposit verfärbt sich, Keramik nicht. Nach ein paar Jahren sieht man, welcher Zahn welcher ist. Sinnvoll ist eine Kombination vor allem als Etappe, etwa wenn du die Frontzähne in Keramik machst und die seitlichen erst später.",
      ),

      p([
        "Welche Art in deinem Fall überhaupt in Frage kommt, sieht man in zehn Minuten am Zahn. Wie eine Veneer-Behandlung abläuft, steht in ",
        { text: "unserem Veneers-Ratgeber", href: "/veneers-berlin" },
        "; wie wir sie machen, auf der Seite zu ",
        { text: "Veneers in Berlin", href: "/leistungen/veneers" },
        ".",
      ]),
    ],

    seo: {
      _type: "seo",
      title: "Veneers Arten im Vergleich: Keramik, Komposit & Co.",
      description:
        "Alle Veneers Arten im Vergleich: Keramik und Komposit, plus was hinter Markennamen wie E-max steckt. Haltbarkeit, Kosten und für wen welche Art passt.",
    },
  },

  notes: [
    "Date: placeholder 2026-10-16.",
    "Category 'Material & Technik' → technik.",
    "Markenzeile 'Vier Namen, zwei echte Unterschiede' (variant A) has no field; choice A/B/C open with Mara and Flo.",
    "Header image missing. Suggested caption and alt text not imported: 'Veneer-Rohlinge im Vergleich: geschichtete Keramik, gefräste Keramik, Komposit.' / 'Drei Veneers aus unterschiedlichen Materialien nebeneinander auf einem Modell'.",
    "Open with Kahn: does the FAQ 'geschichtete vs. gefräste Keramik' replace the dropped Lumineers FAQ? Imported as delivered.",
    "Open with Hannes: the descriptions of Presskeramik and bemalte Keramik are not confirmed by him.",
    "Closing CTA label and Artikelfuß teaser ('Weiterlesen: Was Veneers kosten') have no field.",
  ],
};
