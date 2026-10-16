/**
 * Veneers in der Türkei: der ehrliche Vergleich — fifth version of 15.10.2026
 * (`texte/blogs/MP_Blog_03_Veneers_Tuerkei_v5_2026-10-15.docx`).
 *
 * Replaces the placeholder post `post-veneers-aus-der-tuerkei` of June 2026
 * (prototype copy, same subject) in place: same document, new slug. The old
 * address is redirected in `web/astro.config.mjs`.
 *
 * Mapping as in `post-veneers-schaden.mjs`. The cost comparison is a `table`
 * block; its two "—" cells (no flight for Berlin) read "entfällt".
 */
import { make } from "../copy-blocks.mjs";

const { p, h2, h3, table } = make();
const slug = "veneers-tuerkei-vergleich";

export default {
  id: "post-veneers-aus-der-tuerkei",
  type: "post",
  source: "MP_Blog_03_Veneers_Tuerkei_v5_2026-10-15.docx",

  set: {
    title: "Veneers in der Türkei: der ehrliche Vergleich",
    slug: { _type: "slug", current: slug },
    date: "2026-10-16",
    category: "technik",
    author: { _type: "reference", _ref: "person-schulte-ostermann" },
    service: { _type: "reference", _ref: "service-veneers" },
    lead: "Eine ehrliche Rechnung, inklusive der Kosten, die erst später anfallen.",

    text: [
      p(
        "Wenn du ein Angebot aus Istanbul im Postfach hast, kennst du die Zahl schon: Veneers in der Türkei kosten einen Bruchteil dessen, was du in Deutschland zahlst. Das stimmt. Es ist kein Lockangebot und kein Trick, sondern ein realer Kostenunterschied: Löhne, Mieten und Laborkosten sind dort niedriger.",
      ),
      p(
        "Ich bin Zahnarzt in Berlin, ich habe also ein Interesse an deiner Entscheidung. Deshalb hier kein Text, der dir Angst machen soll. Stattdessen: die vollständige Rechnung, die Stellen, an denen es in der Praxis schiefgeht, und die Fälle, in denen ich selbst zur Türkei raten würde.",
      ),

      h2("Was kosten Veneers in der Türkei wirklich?"),
      p(
        "Beworben werden 2026 zwischen 180 und 350 Euro pro Zahn, häufig als Paket mit Transfer, Hotel und Betreuung. Ein Vergleich über acht Veneers, mit allem, was wirklich anfällt:",
      ),
      table([
        ["", "Istanbul", "Berlin"],
        ["8 Keramikveneers", "ca. 2.000 €", "ab 12.000 €"],
        ["Mock-up vor dem Beschleifen", "meist im Paket", "ab 450 €"],
        ["Flug und Unterkunft", "ca. 400–700 €", "entfällt"],
        ["Zweite Reise bei Nacharbeit", "ca. 400–700 €", "entfällt"],
        ["Nachsorge über Jahre", "trägst du selbst", "vor Ort"],
        ["Realistisch ab", "ca. 2.400–3.400 €", "ca. 12.450 €"],
      ]),
      p(
        "Der Abstand bleibt groß. Es ist ungefähr der Faktor vier, und keine Reisekosten der Welt machen das wett. Wer dir etwas anderes vorrechnet, rechnet falsch.",
      ),
      p([
        "Zwei Dinge gehören trotzdem dazu. Erstens stammen die türkischen Zahlen aus der Werbung der Anbieter: Paketpreise sind Einstiegspreise, und was passiert, wenn mehr nötig ist als geplant, steht selten im Angebot. Zweitens sind die ab 12.000 Euro in Berlin der Preis mit allem: Planung, Mock-up, eigenes Labor, Nachkontrollen. ",
        {
          text: "Was Veneers in Deutschland kosten",
          href: "/magazin/veneers-kosten",
        },
        ", ist im Detail aufgeschlüsselt.",
      ]),

      h2("Was du für den Preis bekommst"),
      p(
        "Es gibt in Istanbul hervorragende Kliniken. Moderne Geräte, erfahrene Behandler, eigene Labore, Ergebnisse, an denen ich fachlich nichts auszusetzen habe. Und es gibt Anbieter, bei denen der Preis das einzige Argument ist. Der Unterschied ist von außen schwer zu sehen, weil beide dieselben Fotos benutzen.",
      ),
      p(
        "Woran du eine gute Adresse erkennst, hat wenig mit dem Preis zu tun und viel mit dem Ablauf. Bekommst du vor der Reise eine Diagnose auf Grundlage eigener Aufnahmen, oder nur einen Kostenvoranschlag nach einem Selfie? Ist ein Mock-up vorgesehen, bevor irgendetwas beschliffen wird? Steht im Angebot, ob Veneers oder Kronen gemacht werden, und zwar bevor du dort bist? Bekommst du am Ende deine Unterlagen mit, Röntgenbilder, Befund, Materialangaben? Und wie viele Tage sind eingeplant?",
      ),
      p(
        "Wenn die Antwort auf die letzte Frage „drei“ lautet, ist das kein Effizienzbeweis.",
      ),

      h2("Die Risiken: was wir in der Praxis sehen"),
      p(
        "Vorweg, damit das hier nicht mehr behauptet als es kann: Wir sehen nicht die gelungenen Behandlungen. Wer zufrieden ist, kommt nicht zu uns. Was uns begegnet, ist eine Auswahl; sonst wird aus Erfahrung Statistik, und das wäre unredlich.",
      ),
      p(
        "Was wir gesehen haben, waren undichte Kronenränder und entzündetes Zahnfleisch. Nachgearbeitet haben wir davon bisher nichts. Und genau das ist der Punkt, auf den es in diesem Abschnitt ankommt.",
      ),
      p(
        "Wer für eine Behandlung in die Türkei fliegt, tut das wegen des Preises. Wenn danach etwas nicht stimmt und diese Menschen bei uns sitzen, hören sie, was eine Korrektur in Berlin kostet, und gehen wieder. Die Nacharbeit wird nicht in türkischen Preisen abgerechnet, sondern in deutschen. Wer die Behandlung hier nicht bezahlen konnte, kann die Reparatur hier meistens auch nicht.",
      ),
      p(
        "Das ist das eigentliche Risiko, und es hat nichts mit der Qualität türkischer Zahnmedizin zu tun. Es ist eine Rechnung: Die Ersparnis ist sicher, die Nacharbeit ist ein Risiko, und wenn es eintritt, trifft es dich zum vollen hiesigen Preis.",
      ),
      p(
        "Dazu kommt der Zeitplan. Fünf bis sieben Tage für zwanzig Zähne heißt: beschleifen, abformen, einsetzen, abreisen. Was sonst über Wochen läuft (provisorisch tragen, sprechen, essen, korrigieren lassen), fällt weg. Und je weniger Zeit bleibt, desto näher liegt die Krone: Sie verzeiht mehr als ein Veneer und ist schneller fertig. Deshalb die Frage von oben, ob im Angebot steht, was genau gemacht wird.",
      ),

      h2("Aftercare: das unterschätzte Argument"),
      p(
        "Eine Veneer-Behandlung endet nicht mit dem Einsetzen. Sie endet frühestens nach der ersten Kontrolle, oft später: wenn sich der Biss eingespielt hat, das Zahnfleisch beruhigt ist und klar ist, dass nichts drückt.",
      ),
      p(
        "Genau dieser Teil lässt sich nicht exportieren. Ein Veneer, das nach vier Monaten am Rand undicht wird, ist kein Drama, wenn man am Dienstag vorbeikommen kann. Es wird eines, wenn die nächste Kontrolle einen Flug kostet. Und es wird teuer, wenn jemand ran muss, der die Arbeit nicht gemacht hat und für sie nicht einstehen kann.",
      ),
      h3("Und die Versicherung?"),
      p(
        "Ein Punkt, der selten mitgerechnet wird: Deine Zahnzusatzversicherung hilft hier meistens nicht. Die meisten Tarife leisten für rein ästhetische Behandlungen ohnehin nicht, und für Behandlungen im Ausland gelten oft zusätzliche Einschränkungen. Muss eine Versorgung später ersetzt werden, ist auch das in aller Regel kein Versicherungsfall, sondern eine Neuanfertigung auf eigene Rechnung. Deine Bedingungen vorher zu lesen kostet eine Viertelstunde. Es nicht zu tun, kann fünfstellig werden.",
      ),
      p([
        "Das ist das eigentliche Argument für eine Behandlung in der Nähe: nicht das bessere Material und nicht der bessere Zahnarzt, sondern die Erreichbarkeit über Jahre. Wie wir das halten, steht auf der Seite zu ",
        { text: "Veneers in Berlin", href: "/leistungen/veneers" },
        ".",
      ]),

      h2("Wann lohnt sich die Türkei, wann Berlin?"),
      p(
        "Für die Türkei spricht ein klarer Fall: wenige Zähne, eine Klinik mit nachprüfbaren Unterlagen und eigenem Labor, genug Zeit vor Ort (mindestens sieben bis zehn Tage) und Geld, das du für eine Nachreise zurücklegst. Wer diese vier Punkte erfüllt und die Ersparnis braucht, um die Behandlung überhaupt machen zu können, trifft keine schlechte Entscheidung. Das gilt besonders dann, wenn die Alternative lautet: gar nichts machen.",
      ),
      p(
        "Für Berlin spricht der umgekehrte Fall: viele Zähne auf einmal, ein anspruchsvoller Befund, Knirschen, Vorerkrankungen des Zahnfleischs, oder schlicht der Wunsch, dass derselbe Mensch verantwortlich bleibt, wenn in drei Jahren etwas ist.",
      ),
      p([
        "Und es gibt einen Fall, in dem ich von beidem abraten würde: wenn du dir noch nicht sicher bist, ob du überhaupt Veneers willst. Dann ist die richtige Entscheidung weder Istanbul noch Berlin, sondern erst einmal keine. Was dabei auf dich zukommt, steht in ",
        { text: "unserem Veneers-Ratgeber", href: "/veneers-berlin" },
        ".",
      ]),

      h2("FAQ zu Veneers im Ausland"),
      h3("Kann man eine Garantie aus der Türkei in Deutschland einklagen?"),
      p(
        "Praktisch kaum. Dein Behandlungsvertrag unterliegt in aller Regel türkischem Recht, und die Türkei gehört nicht zur EU; ein deutsches Urteil müsste dort erst in einem eigenen Verfahren anerkannt werden. Bei den üblichen Beträgen steht der Aufwand selten dafür. Die Garantieversprechen der Kliniken sind deshalb vor allem so viel wert, wie die Klinik bereit ist, sie freiwillig einzulösen. Wenn dir daran liegt, lass den Vertrag vorher von einer Rechtsanwältin ansehen, nicht hinterher.",
      ),
      h3("Behandeln deutsche Zahnärzte Türkei-Fälle nach?"),
      p(
        "Viele nicht, und der Grund ist nachvollziehbar: Wer fremde Arbeit anfasst, übernimmt Haftung für etwas, das er nicht gemacht hat. Wir sehen das anders. Wenn du mit einem Problem kommst, schauen wir es uns an und sagen dir, was möglich ist, ohne Vortrag darüber, was du hättest anders machen sollen. Diese Entscheidung ist gefallen, bevor du im Stuhl sitzt.",
      ),
      h3("Wie viel spart man wirklich mit Veneers in der Türkei?"),
      p(
        "Bei acht Keramikveneers realistisch zwischen 9.000 und 10.000 Euro, Flug und Unterkunft schon abgezogen. Diese Zahl schrumpft nicht, wenn man ehrlich rechnet. Sie schrumpft nur, wenn etwas nachgearbeitet werden muss: Dann kommen Reise und Nachbehandlung dazu, und im ungünstigsten Fall zahlst du die Versorgung ein zweites Mal.",
      ),
      h3("Sind Veneers aus der Türkei schlechter?"),
      p(
        "Nein, nicht grundsätzlich. Die Materialien sind dieselben, die Technik ist dieselbe, und die Ausbildung guter türkischer Kolleg:innen steht unserer in nichts nach. Der Unterschied liegt nicht im Land, sondern im Ablauf: wie viel Zeit eingeplant ist, ob vor dem Beschleifen geplant wird und wer in drei Jahren erreichbar ist. Diese drei Fragen kannst du jeder Praxis stellen, in Istanbul wie in Berlin.",
      ),

      p(
        "Wenn du ein Angebot aus der Türkei hast und wissen willst, was darin steht: Bring es mit. Wir gehen es mit dir durch, ohne dir etwas verkaufen zu wollen, und sagen dir ehrlich, wenn es ein gutes Angebot ist. Das Gespräch kostet 99 Euro und wird angerechnet, wenn du dich bei uns behandeln lässt.",
      ),
    ],

    seo: {
      _type: "seo",
      title: "Veneers in der Türkei: Kosten & Risiken im Vergleich",
      description:
        "Veneers Türkei: Was kostet die Behandlung in Istanbul wirklich, welche Risiken gibt es und wann lohnt sich der Zahnarzt in Berlin? Der ehrliche Vergleich.",
    },
  },

  notes: [
    "Replaces the June placeholder post in place; slug changes from veneers-aus-der-tuerkei to veneers-tuerkei-vergleich (redirect in astro.config.mjs). Date set to 2026-10-16.",
    "Category 'Material & Technik' → technik, as delivered; the document itself questions this (Mara + Kahn).",
    "The two '—' cells of the table ('Flug und Unterkunft', 'Zweite Reise' for Berlin) read 'entfällt'.",
    "Markenzeile 'Ja, du sparst Geld. Hier steht, wofür' (variant A) has no field.",
    "Header image missing. Suggested caption and alt text not imported: 'Kostenvoranschlag aus einer Istanbuler Klinik neben einem deutschen Heil- und Kostenplan.' / 'Zwei Kostenvoranschläge für eine Veneer-Behandlung nebeneinander auf einem Tisch'.",
    "Closing CTA label 'Angebot gemeinsam durchgehen - Termin vereinbaren' and the Artikelfuß teaser have no field.",
    "Turkish advertised prices are from 26.09.2026; the document asks for a re-check before going live.",
    "No external link set (the document would add one neutral source, not yet chosen).",
  ],
};
