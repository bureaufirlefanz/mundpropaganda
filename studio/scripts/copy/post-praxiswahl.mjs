/**
 * Die besten Zahnärzte für Veneers in Berlin — new magazine post, third
 * draft with Hannes' comments of 08.10.2026 (file v3 of 12.10.2026).
 *
 * Mapping as in `post-veneers-schaden.mjs`:
 *
 *   H1                 → title
 *   Markenzeile        no field, not in the text (the document sets it as
 *                      an H2; in the text it would turn up in the TOC)
 *   Kategorie          → category, Standfirst → lead, Autor → author
 *   Einstieg, H2 1–4   → text; the six features as numbered h3
 *   Abschluss          → last paragraph of text; the CTA label has no field
 *   Artikelfuß         CTA button → service reference; teaser has no field
 *   Meta               → seo
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

const slug = "beste-veneers-zahnaerzte-berlin";

export default {
  id: `post-${slug}`,
  type: "post",
  source: "MP_Blog_06_Praxiswahl_v3_2026-10-12.docx",

  create: {
    title: "Die besten Zahnärzte für Veneers in Berlin: worauf es ankommt",
    slug: { _type: "slug", current: slug },
  },

  set: {
    title: "Die besten Zahnärzte für Veneers in Berlin: worauf es ankommt",
    slug: { _type: "slug", current: slug },
    date: "2026-10-13",
    category: "behandlung",
    author: { _type: "reference", _ref: "person-schulte-ostermann" },
    service: { _type: "reference", _ref: "service-veneers" },
    lead: "Wir nennen keine Namen. Stattdessen sechs Merkmale, die du selbst überprüfen kannst, auch bei uns.",

    text: [
      p(
        "Diese Seite nennt keine anderen Praxen. Nicht, weil es keine guten gäbe (es gibt in Berlin viele), sondern weil eine Rangliste auf der Website einer Zahnarztpraxis nichts wert ist. Wir wären Richter in eigener Sache, und das merkst du beim Lesen sowieso.",
      ),
      p(
        "Stattdessen steht hier, was aus unserer Sicht eine gute Veneers-Praxis ausmacht und woran du es von außen erkennen kannst, bevor du dich entscheidest, und unabhängig davon, für wen. Wenn du danach zu jemand anderem gehst und dort gut behandelt wirst, hat diese Seite ihren Zweck erfüllt.",
      ),

      h2("Woran erkennst du eine gute Veneers-Praxis?"),
      p(
        "Sechs Merkmale. Alle sechs kannst du überprüfen, bevor du irgendetwas unterschreibst: teils schon auf der Website, den Rest im Beratungsgespräch.",
      ),
      h3("1. Du erfährst, wo dein Veneer gefertigt wird"),
      p(
        "Ein Keramikveneer baut ein Mensch, kein Gerät allein. Frag, in welchem Labor es entsteht und ob du den Namen erfahren kannst. Eine Praxis, die das beantwortet, hat eine Beziehung zu ihrem Labor. Eine, die ausweicht, gibt die Verantwortung für das Ergebnis ab und weiß selbst nicht genau, an wen.",
      ),
      h3("2. Es gibt ein Mock-up, bevor etwas beschliffen wird"),
      p(
        "Das ist das wichtigste Merkmal auf dieser Liste. Beim Mock-up wird dir die geplante Zahnform aus Kunststoff aufgesetzt, auf ungeschliffene Zähne. Du läufst damit herum und zeigst es Leuten: Essen kannst du damit nicht, dafür ist es zu dünn. Werden alle Zähne beschliffen, bekommst du statt des Mock-ups ein laborgefertigtes Langzeitprovisorium, und damit geht auch essen. In beiden Fällen entscheidest du erst danach. Wo das nicht vorgesehen ist, siehst du dein Ergebnis zum ersten Mal, wenn es nicht mehr rückgängig zu machen ist.",
      ),
      h3("3. Jemand kann dir das Material benennen"),
      p(
        "Nicht „hochwertige Keramik“, sondern welche und warum diese. Es gibt Unterschiede zwischen geschichteter Keramik, bemalter Keramik, Fräskeramik und Presskeramik, und sie haben Gründe: Lichtdurchlässigkeit gegen Bruchfestigkeit, zum Beispiel. Wer dir diese Abwägung erklären kann, hat sie für dich getroffen. Wer nur Adjektive anbietet, vermutlich nicht.",
      ),
      h3("4. Die gezeigten Fälle sind eigene"),
      p(
        "Sieh dir die Bilder an und frag dich, ob es dieselbe Praxis sein kann: gleiches Licht, gleicher Hintergrund, gleicher Winkel bei Vorher und Nachher. Herstellerbilder und Stockfotos erkennt man daran, dass sie zu gut sind und zu wenige. Eine Praxis mit Schwerpunkt hat mehr als drei Fälle und muss sie nicht ausleihen.",
      ),
      h3("5. Die Nachsorge ist Teil des Ablaufs"),
      p(
        "Eine Veneer-Behandlung endet nicht beim Einsetzen. Frag, wann die erste Kontrolle stattfindet, was passiert, wenn etwas drückt, und wer erreichbar ist. Wenn darauf keine konkrete Antwort kommt, ist der Termin des Einsetzens für die Praxis das Ende. Für dich fängt es da an.",
      ),
      h3("6. Sie sagt dir auch, wann es nicht geht"),
      p([
        "Das verrät am meisten. Es gibt mehrere Situationen, in denen Veneers die falsche Wahl sind: wenn eigentlich die Zahnstellung stört, wenn zu wenig Zahn übrig ist, wenn eine unbehandelte Parodontitis vorliegt. Eine Praxis, die dir nie sagt, wann sie abraten würde, hat nicht darüber nachgedacht, ob sie es bei dir tun sollte. Wir haben die Gründe in ",
        {
          text: "Schaden Veneers den Zähnen?",
          href: "/magazin/veneers-schaden",
        },
        " aufgeschrieben.",
      ]),
      h3("Und was heißt eigentlich „Spezialist“?"),
      p(
        "Weniger, als du vermutest. Geschützt ist in Deutschland der Titel Fachzahnarzt: Den gibt es für Kieferorthopädie, Oralchirurgie und einige weitere Gebiete, aber nicht für Ästhetik und nicht für Veneers. Einen Fachzahnarzt für Veneers kann es also gar nicht geben.",
      ),
      p(
        "„Spezialist“ und „Tätigkeitsschwerpunkt“ sind etwas anderes. Ein Schwerpunkt muss der tatsächlichen Tätigkeit entsprechen, ist aber keine Prüfung. Manche Spezialisten-Titel kommen von Fachgesellschaften und stehen für ein Curriculum mit Prüfung, andere sind schlicht selbstgewählt. Von außen sieht man den Unterschied nicht.",
      ),
      p(
        "Du kannst ihn aber erfragen, und die Frage ist einfach: Woher kommt der Titel, und was musste man dafür tun? Wer eine Fachgesellschaft und ein Curriculum nennen kann, hat etwas gemacht. Wer ins Stocken gerät, hat es auf die Website geschrieben.",
      ),

      h2("Warnsignale"),
      p(
        "Umgekehrt gibt es Dinge, bei denen wir an deiner Stelle noch einmal nachfragen würden. Keines davon heißt automatisch, dass etwas nicht stimmt. Alle zusammen schon.",
      ),
      p(
        "Ein konkreter Preis am Telefon, ohne dass jemand in deinen Mund gesehen hat. Ein Angebot, das nur gilt, wenn du dich heute entscheidest. Ein Behandlungsplan, in dem kein Mock-up vorkommt. Keine Antwort auf die Frage, ob es Veneers oder Kronen werden. Und Beratungsgespräche, in denen ausschließlich über das Ergebnis gesprochen wird und nie über den Weg dorthin.",
      ),
      p(
        "Das letzte ist das verlässlichste. Wer dir zwanzig Minuten lang zeigt, wie schön es wird, und keine zwei Minuten darauf verwendet, was dabei mit deinen Zähnen passiert, verkauft dir ein Bild und keine Behandlung.",
      ),

      h2("Die richtigen Fragen im Beratungsgespräch"),
      p(
        "Sechs Fragen zum Mitnehmen. Sie funktionieren in jeder Praxis, auch in unserer, und du darfst sie alle stellen, ohne dich unhöflich zu fühlen. Es geht um deine Zähne.",
      ),
      p(
        "Wie viel Zahnschmelz wird abgetragen, und bleibt die Präparation im Schmelz? Sehe ich das Ergebnis, bevor beschliffen wird? In welchem Labor entsteht mein Veneer? Welches Material verwenden Sie, und warum dieses? Was kostet es, wenn nachgearbeitet werden muss, und wer trägt das? Und: In welchem Fall würden Sie mir davon abraten?",
      ),
      p(
        "Die letzte Frage ist die beste, die du stellen kannst. Nicht wegen der Antwort, sondern wegen der Reaktion darauf.",
      ),
      p([
        "Was dich sonst noch erwartet, von der ersten Beratung bis zum Einsetzen, steht in ",
        { text: "unserem Veneers-Ratgeber", href: "/veneers-berlin" },
        ".",
      ]),

      h2("Transparenz"),
      p(
        "Diesen Text hat Hannes Schulte-Ostermann geschrieben, Zahnarzt in Berlin-Prenzlauer Berg. Er steht auf der Website seiner eigenen Praxis. Das heißt: Wir haben ein Interesse daran, dass du zu uns kommst, und die sechs Merkmale oben sind Merkmale, die wir selbst erfüllen. Wer eine Liste von Kriterien aufstellt, stellt sie selten so auf, dass er dabei schlecht aussieht.",
      ),
      p(
        "Deshalb zwei Dinge. Erstens stehen auf dieser Seite absichtlich keine anderen Praxen, weder gelobt noch abgewertet. Zweitens sind alle sechs Merkmale so formuliert, dass du sie überall überprüfen kannst, auch bei uns. Wenn wir eines davon nicht einlösen, sag es uns.",
      ),
      p([
        "Wie wir arbeiten, steht auf der Seite zu ",
        { text: "Veneers in Berlin", href: "/leistungen/veneers" },
        ".",
      ]),

      p(
        "Wenn du eine Praxis gefunden hast, die dir zusagt, nimm diese Fragen mit. Und wenn du noch unschlüssig bist, komm zu einem Beratungsgespräch, auch dann, wenn du am Ende woanders behandeln lässt. Es kostet 99 Euro: Wir machen Fotos, ermitteln den Bedarf und scannen deine Zähne, wenn es sinnvoll ist.",
      ),
    ],

    seo: {
      _type: "seo",
      title: "Die besten Zahnärzte für Veneers in Berlin: Kriterien",
      description:
        "Die besten Zahnärzte für Veneers in Berlin: sechs Merkmale, an denen du eine gute Praxis erkennst, typische Warnsignale und die richtigen Fragen.",
    },
  },

  notes: [
    "Date: the document says 'Veröffentlicht am [Datum]'. Set to 2026-10-13 as a placeholder; the practice must set the real date.",
    "Slug from the document's URL /blog/beste-veneers-zahnaerzte-berlin/; the site serves it as /magazin/beste-veneers-zahnaerzte-berlin.",
    "Title is the body H1 'Die besten Zahnärzte für Veneers in Berlin: worauf es ankommt'; the document's cover line reads without ': worauf es ankommt'.",
    "Category 'Behandlung verstehen' → behandlung (praxis would also fit).",
    "Markenzeile A 'Wir sagen dir nicht, wo du hingehen sollst. Nur, worauf du schauen musst' has no field and is not in the text. Choice between A, B and C is still open with Mara and Flo.",
    "Not imported: 'Fälle aus unserer Praxis findest du unter [Veneers vorher / nachher].' No such post exists and the site has no own before/after cases yet.",
    "seo.description is the agency's proposal; Summer Days' original promises 'welche Praxen spezialisiert sind', which the page no longer delivers. Not yet agreed with Summer Days.",
    "The dropped mandatory H2 'Berliner Praxen mit Veneers-Schwerpunkt' (Mara, 26.09.2026) still needs Summer Days' sign-off.",
    "Header image missing; suggested caption and alt text not imported: 'Beratungsgespräch mit digitaler Planung auf dem Bildschirm.' / 'Zahnarzt und Patientin sehen sich gemeinsam die digitale Veneer-Planung auf einem Monitor an'.",
    "Closing CTA label 'Beratungstermin vereinbaren' has no field. Closing paragraph follows the Transparenz section without a heading of its own.",
    "Artikelfuß: CTA button covered by the service reference. Teaser 'Weiterlesen: Was Veneers kosten' has no field and no target post.",
    "Open with Hannes: are the 99 Euro credited against the treatment?",
    "Link to /magazin/veneers-schaden works only once that post is published too.",
    "Paired dashes around 'es gibt in Berlin viele' became parentheses.",
    "'Sie' in the six questions is deliberate: the reader addresses the dentist.",
  ],
};
