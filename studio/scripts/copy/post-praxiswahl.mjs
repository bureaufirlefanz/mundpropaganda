/**
 * Woran erkennt man einen guten Zahnarzt für Veneers? — fifth version of
 * 15.10.2026 (`texte/blogs/MP_Blog_06_Praxiswahl_v5_2026-10-15.docx`),
 * replacing the import of v3 (13.10.2026).
 *
 * The SEO agency re-anchored the post on 15.10.2026: new keyword, new title,
 * new H1, new URL. Same document in Sanity, new slug; the old address
 * `/magazin/beste-veneers-zahnaerzte-berlin` is redirected in
 * `web/astro.config.mjs`.
 *
 * Mapping as in `post-veneers-schaden.mjs`.
 */
import { make } from "../copy-blocks.mjs";

const { p, h2, h3 } = make();
const slug = "guten-zahnarzt-fuer-veneers-erkennen";

export default {
  id: "post-beste-veneers-zahnaerzte-berlin",
  type: "post",
  source: "MP_Blog_06_Praxiswahl_v5_2026-10-15.docx",

  create: {
    title: "Woran erkennt man einen guten Zahnarzt für Veneers? 6 Merkmale",
    slug: { _type: "slug", current: slug },
  },

  set: {
    title: "Woran erkennt man einen guten Zahnarzt für Veneers? 6 Merkmale",
    slug: { _type: "slug", current: slug },
    date: "2026-10-13",
    category: "behandlung",
    author: { _type: "reference", _ref: "person-schulte-ostermann" },
    service: { _type: "reference", _ref: "service-veneers" },
    lead: "Wir nennen keine Namen. Stattdessen sechs Merkmale, die du selbst überprüfen kannst, auch bei uns.",

    text: [
      p(
        "Woran erkennt man einen guten Zahnarzt für Veneers? Nicht an einer Rangliste auf der Website einer Zahnarztpraxis. Die wäre nichts wert, weil wir Richter in eigener Sache wären, und das merkst du beim Lesen sowieso. Diese Seite nennt deshalb keine anderen Praxen. Nicht, weil es keine guten gäbe, es gibt in Berlin viele.",
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
        "Das ist das wichtigste Merkmal auf dieser Liste. Beim Mock-up wird dir die geplante Zahnform aus Kunststoff aufgesetzt, auf ungeschliffene Zähne. Du läufst damit herum und zeigst es Leuten; essen kannst du damit nicht, dafür ist es zu dünn. Entschieden wird erst danach. Wo das nicht vorgesehen ist, siehst du dein Ergebnis zum ersten Mal, wenn es nicht mehr rückgängig zu machen ist.",
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
        "Ein konkreter Preis am Telefon, ohne dass jemand in deinen Mund gesehen hat. Ein Angebot, das nur gilt, wenn du dich heute entscheidest. Ein Behandlungsplan, in dem kein Mock-up vorkommt. Alles an einem Tag. Keine Antwort auf die Frage, ob es Veneers oder Kronen werden. Und Beratungsgespräche, in denen ausschließlich über das Ergebnis gesprochen wird und nie über den Weg dorthin.",
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
        ". Fälle aus unserer Praxis findest du unter ",
        {
          text: "Veneers vorher / nachher",
          href: "/magazin/veneers-vorher-nachher",
        },
        ".",
      ]),

      p(
        "Wenn du eine Praxis gefunden hast, die dir zusagt, nimm diese Fragen mit. Und wenn du noch unschlüssig bist, komm zu einem Beratungsgespräch, auch dann, wenn du am Ende woanders behandeln lässt. Es kostet 99 Euro, und wenn du dich danach für die Behandlung entscheidest, wird der Betrag angerechnet.",
      ),
    ],

    seo: {
      _type: "seo",
      title: "Woran erkennt man einen guten Zahnarzt für Veneers?",
      description:
        "Woran erkennt man einen guten Zahnarzt für Veneers? Sechs Merkmale einer guten Praxis, typische Warnsignale und die richtigen Fragen fürs Beratungsgespräch.",
    },
  },

  notes: [
    "Re-anchored by Kahn on 15.10.2026: slug changes from beste-veneers-zahnaerzte-berlin to guten-zahnarzt-fuer-veneers-erkennen (redirect in astro.config.mjs). Document ID stays.",
    "Date kept at 2026-10-13 from the first import; the real date is the practice's call.",
    "Category 'Behandlung verstehen' → behandlung.",
    "Markenzeile 'Wir sagen dir nicht, wo du hingehen sollst. Nur, worauf du schauen musst' (variant A) has no field.",
    "Header image missing. Suggested caption and alt text not imported: 'Beratungsgespräch mit digitaler Planung auf dem Bildschirm.' / 'Zahnarzt und Patientin sehen sich gemeinsam die digitale Veneer-Planung auf einem Monitor an'.",
    "Link to /magazin/veneers-vorher-nachher works only once that post is published; it is blocked (no images).",
    "Open with Mara: the Veneers service FAQ 'Woran erkenne ich eine gute Praxis für Veneers in Berlin?' should link here (Kahn, 15.10.2026).",
    "Closing CTA label 'Beratungstermin vereinbaren' and the Artikelfuß teaser ('Weiterlesen: Was Veneers kosten') have no field.",
    "'Sie' in the six questions is deliberate: the reader addresses the dentist.",
  ],
};
