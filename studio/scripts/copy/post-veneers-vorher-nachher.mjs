/**
 * Veneers vorher / nachher — fifth version of 15.10.2026
 * (`texte/blogs/MP_Blog_05_Veneers_Vorher_Nachher_v5_2026-10-15.docx`).
 *
 * **Not publishable as delivered.** The post is a gallery, and there are no
 * image pairs yet; case 1 and 2 carry gaps only the practice can fill
 * ("[Anzahl] Keramikveneers auf [Position]"), case 3 has no patient at all.
 * Imported as a draft so the text sits where it will be edited, with the
 * gap sentences left out and case 3 reduced to its heading and the
 * sentence that does not depend on a patient. See FLAGS-2026-10-16.md.
 */
import { make } from "../copy-blocks.mjs";

const { p, h2, h3 } = make();
const slug = "veneers-vorher-nachher";

export default {
  id: `post-${slug}`,
  type: "post",
  source: "MP_Blog_05_Veneers_Vorher_Nachher_v5_2026-10-15.docx",

  create: {
    title: "Veneers vorher / nachher: echte Fälle aus unserer Praxis",
    slug: { _type: "slug", current: slug },
  },

  set: {
    title: "Veneers vorher / nachher: echte Fälle aus unserer Praxis",
    slug: { _type: "slug", current: slug },
    date: "2026-10-16",
    category: "behandlung",
    author: { _type: "reference", _ref: "person-schulte-ostermann" },
    service: { _type: "reference", _ref: "service-veneers" },
    lead: "Drei echte Fälle aus unserer Praxis, und sechs Merkmale, an denen du ein gutes Ergebnis erkennst.",

    text: [
      p(
        "Die Bilder auf dieser Seite sind von Patientinnen und Patienten aus unserer Praxis, mit ihrem Einverständnis veröffentlicht. Nichts davon ist nachbearbeitet, und beide Aufnahmen entstehen jeweils am selben Ort mit demselben Licht; sonst vergleicht man Fotografie statt Zahnmedizin.",
      ),
      p(
        "Ein Hinweis vorweg: Was bei dir möglich ist, entscheidet dein Befund, nicht diese Galerie. Zahnstellung, Zahnfleisch und wie viel Substanz vorhanden ist, unterscheiden sich von Mensch zu Mensch. Trotzdem lohnt das Durchsehen; meistens ist ein Fall dabei, der dem eigenen ähnelt.",
      ),

      h2("Fall 1: Verfärbte Frontzähne"),
      p(
        "Erik störte sich an der Farbe seiner Zähne: nicht an einer einzelnen Verfärbung, sondern daran, dass der Grundton nie schön wurde. Bei einer Farbe, die im Zahn sitzt statt auf ihm, hilft Aufhellen nur begrenzt weiter.",
      ),
      p(
        "Die Behandlung lief in fünf Terminen: Kennenlernen, Scan für das Mock-up, Einprobe des Mock-ups, Präparation, Eingliederung.",
      ),
      p(
        "Meine Einordnung: Der schwierige Teil war hier nicht die Form, sondern die Deckkraft. Ein dunkler Untergrund schimmert durch dünne Keramik hindurch, also braucht es entweder mehr Schichtdicke oder eine stärker deckende Keramik, und beides kostet etwas Natürlichkeit. Der Kompromiss gelingt, wenn die Schneidekante lichtdurchlässig bleibt.",
      ),

      h2("Fall 2: Kleine Zähne / Lücke"),
      p(
        "Bei Timo kam dreierlei zusammen: zu kleine Zähne, zu große Lücken und eine Fehlstellung. Das ist der Fall, bei dem Veneers technisch am meisten Sinn ergeben: Es fehlt Form, und Form lässt sich ergänzen, ohne viel wegzunehmen.",
      ),
      p(
        "Vier Termine: Kennenlernen mit Scan, Einprobe des Mock-ups, Präparation, Eingliederung.",
      ),
      p(
        "Meine Einordnung: Hier war wenig zu beschleifen, weil die Veneers Volumen ergänzen statt zu überdecken. Die eigentliche Arbeit steckte in den Proportionen: Werden zwei Zähne verbreitert, um eine Lücke zu schließen, wirken sie schnell zu breit. Das verteilt man besser auf mehrere Zähne, als es an zwei zu erzwingen.",
      ),

      h2("Fall 3: Komposit-Fall"),
      p([
        "Meine Einordnung: Komposit ist nicht die kleine Lösung für Leute mit wenig Budget, sondern die richtige Lösung für alle, die eine Entscheidung noch offenhalten wollen. Man sieht am Ergebnis, was möglich ist, und kann in ein paar Jahren immer noch zu Keramik wechseln. Was die Materialien unterscheidet, steht in ",
        { text: "Veneers-Arten im Vergleich", href: "/magazin/veneers-arten" },
        ".",
      ]),

      h2("Woran du ein gutes Ergebnis erkennst"),
      p(
        "Wenn du dir Galerien ansiehst, unsere und andere, lohnt es sich, auf sechs Dinge zu achten. Sie sagen mehr aus als jedes Sternchen unter einem Foto.",
      ),
      p(
        "Die Länge. Natürliche Schneidezähne sind nicht alle gleich lang. Die beiden mittleren stehen etwas vor und sind etwas länger als die seitlichen. Eine gerade Kante über alle Zähne hinweg sieht auf dem Foto ordentlich aus und im Gesicht wie eine Klaviertastatur.",
      ),
      p(
        "Die Symmetrie. Kein Gesicht ist symmetrisch, kein natürliches Gebiss auch. Wenn links und rechts exakt spiegelbildlich sind, merkt man es, ohne zu wissen warum.",
      ),
      p(
        "Die Farbe. Als Faustregel: nicht weißer als das Weiß in deinen Augen. Alles darüber wirkt auf Fotos gut und beim Gegenüber künstlich.",
      ),
      p(
        "Die Schneidekante. Echter Zahnschmelz ist dort leicht durchscheinend. Eine flächig deckende, matte Kante ist das häufigste Erkennungszeichen billiger Arbeit.",
      ),
      p(
        "Der Zahnfleischrand. Dort entscheidet sich, ob es auffällt. Das Zahnfleisch soll sauber anliegen, nicht gereizt sein, und es darf kein dunkler Schatten am Übergang stehen.",
      ),
      p(
        "Und ein sechster Punkt, der nicht die Zähne betrifft, sondern das Foto. Sieh nach, ob beide Aufnahmen gleich hell sind, aus demselben Winkel stammen und denselben Hintergrund haben. Ein Nachher-Bild mit mehr Licht oder weiter geöffnetem Mund vergleicht Fotografie statt Behandlung. Bei uns steht die Kamera für beide Bilder am selben Platz: nicht aus Prinzip, sondern weil alles andere die Bilder wertlos macht.",
      ),

      h2("FAQ zu Veneers-Ergebnissen"),
      h3("Sehen Veneers künstlich aus?"),
      p(
        "Sie können. Es liegt aber nicht am Material, sondern an den Entscheidungen davor: zu hell, zu gleichmäßig, zu lang. Gut gemachte Veneers fallen niemandem auf. Das ist gleichzeitig der Grund, warum man im Alltag fast nur die schlechten sieht und deshalb denkt, alle sähen so aus.",
      ),
      h3("Wie lange hält das Ergebnis?"),
      p(
        "Keramik ist farbstabil und verändert sich über die Jahre praktisch nicht. In einer Innsbrucker Langzeituntersuchung waren nach zehn Jahren noch 93,5 Prozent der Keramikveneers in Funktion. Komposit hält deutlich kürzer und verfärbt sich mit der Zeit. Was sich bei beiden verändert, sind die Nachbarzähne; die altern weiter.",
      ),
      h3("Kann man auch einzelne Zähne mit Veneers versorgen?"),
      p(
        "Ja, und das ist die anspruchsvollste Variante. Ein einzelnes Veneer muss sich zwischen deine echten Zähne einfügen, in Farbe, Form und Lichtdurchlässigkeit. Zwanzig neue Zähne sind technisch einfacher, weil man den Maßstab selbst setzt. Bei einem Zahn gibt ihn der Nachbar vor.",
      ),

      p([
        "Wenn du einen Fall gesehen hast, der deinem ähnelt: Bring das Bild mit. Wir sagen dir, ob es bei dir so funktioniert, und wenn nicht, warum. Das Gespräch kostet 99 Euro und wird angerechnet, wenn du dich bei uns behandeln lässt. Wie eine Behandlung abläuft, steht in ",
        { text: "unserem Veneers-Ratgeber", href: "/veneers-berlin" },
        " und auf der Seite zu ",
        { text: "Veneers in Berlin", href: "/leistungen/veneers" },
        ".",
      ]),
    ],

    seo: {
      _type: "seo",
      title: "Veneers vorher / nachher: echte Ergebnisse aus Berlin",
      description:
        "Veneers vorher nachher: echte Patientenfälle aus unserer Berliner Praxis, von kleinen Zähnen bis zur Frontzahnlücke. Mit Fotos und Einordnung vom Zahnarzt.",
    },
  },

  notes: [
    "BLOCKED for publishing: no image pairs, no written consents, case 3 has no patient (Isabella Breska is a question to Hannes, not a case).",
    "Left out: '[Anzahl] Keramikveneers auf [Position].' in case 1 and 2, and the first paragraph of case 3 ('[Vorname] war sich noch nicht sicher …'). Only the practice can fill these.",
    "Headline variant A 'Das beste Ergebnis ist das, bei dem niemand fragt' has no field.",
    "Image pairs per case: one pair each, same place, same light; the page has no before/after module inside a post yet (BeforeAfter exists as a section only).",
    "Legal: consent per person and channel (Art. 9 DSGVO), identical photo conditions (§ 5 UWG), no promises in quotes (§ 11 HWG). Mara as a case: § 5a UWG, her call.",
    "Artikelfuß teaser ('Weiterlesen: Woran erkennt man einen guten Zahnarzt für Veneers?') and the CTA label have no field.",
  ],
};
