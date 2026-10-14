import type { PillarPage } from "../lib/pillar-sections";
import { blocks } from "../lib/portable-text";

/**
 * Die Pillar Page „Veneers in Berlin“ — Inhalt.
 *
 * **Vorläufig hier, später in Sanity.** Die Form ist schon die des künftigen
 * Schemas (`PillarSection` in `lib/pillar-sections.ts`); der Umzug ist dann
 * ein Austausch des Imports in `pages/veneers-berlin.astro`, nicht ein Umbau
 * der Vorlage.
 *
 * ── Die zehn Punkte der Navigation ────────────────────────────────────────
 *
 * Reihenfolge und Beschriftungen sind vorgegeben. `navLabel` trägt die kurze
 * Fassung, die Überschrift auf der Seite bleibt ausgeschrieben:
 *
 *    1. Was sind Veneers        6. Haltbarkeit
 *    2. Arten im Vergleich      7. Nachteile
 *    3. Abschleifen             8. Alternativen
 *    4. Mock-up                 9. Kosten
 *    5. Ablauf                 10. Häufige Fragen
 *
 * Die Kosten stehen hinten, nicht vorn: erst die Sache, dann der Preis. Wer
 * nur den Preis sucht, findet ihn über Verzeichnis und Dock in einem Klick.
 *
 * „Auf einen Blick“, das Verzeichnis und die Handlungsbänder tragen kein
 * `navLabel` und erscheinen deshalb in keiner der beiden Listen — sie sind
 * Wegweiser, keine Kapitel.
 *
 * ── Quelle der Texte ──────────────────────────────────────────────────────
 *
 * `web/VENEERS-TEXT.md`. Übernommen, nicht neu erfunden. Drei Eingriffe:
 *
 *   1. **Gedankenstriche ersetzt.** Hausregel: kein Geviertstrich und kein
 *      umschlossener Halbgeviertstrich im Seitentext. Spannen („10–15
 *      Jahre“) bleiben.
 *   2. **Preise korrigiert** auf die Werte aus Briefing §1.3, als
 *      „ab“-Preise. Sanity hält derzeit 890/950/190 EUR; welche Reihe
 *      stimmt, entscheidet die Praxis.
 *   3. **[PRÜFEN]-Stellen weggelassen** statt geraten. Betroffen: die FAQ zur
 *      Wartezeit auf einen Beratungstermin, dazu Autor, fachliche Prüfung und
 *      Prüfdatum der Autorenbox.
 *
 * ── Bilder ────────────────────────────────────────────────────────────────
 *
 * `image` trägt hier Namen der gestalteten Motive aus
 * `lib/image-widths.json`, Belegung nach Briefing §6 — `CmsImage` löst das
 * auf. `treatment-02` hat nur 1920 px und wird nicht angefordert.
 */
export const veneersPillar: PillarPage = {
  title: "Veneers in Berlin",
  topline: "Guides",
  lead: "Veneers sind hauchdünne Keramikschalen, die auf die sichtbare Vorderseite der Frontzähne geklebt werden und Verfärbungen, kleine Lücken, Absplitterungen oder eine unregelmäßige Zahnform korrigieren. In unserer Praxis in Prenzlauer Berg planen wir sie so substanzschonend wie möglich, und sagen dir auch, wenn eine andere Lösung für dich die bessere ist.",
  image: "bleaching-beratung-spiegel",
  seoDescription:
    "Veneers in Berlin Prenzlauer Berg: die drei Arten im Vergleich, Ablauf in vier Schritten, Haltbarkeit nach Studienlage, Kosten ab 1.200 EUR und wann wir abraten.",

  /* Zeigt auf den Kontaktabschnitt der Startseite, solange die Pillar Page
     keinen eigenen hat. */
  action: { label: "Beratungstermin vereinbaren", href: "/#kontakt" },

  sections: [
    /* --- Vor dem Verzeichnis ------------------------------------------- */

    /* Der Einstieg unter dem Kopf: eine Zusage links, zwei Textspalten
       rechts (Figma y=1055). Trägt kein `navLabel` — er ist die Einleitung,
       kein Kapitel. */
    {
      _type: "intro",
      _key: "einstieg",
      headline: "Hier erfährst du alles, was du über Veneers wissen musst.",
      columns: [
        "Kosten, Ablauf und ehrliche Antworten. Veneers sind hauchdünne Keramikschalen, die auf die sichtbare Vorderseite der Frontzähne geklebt werden und Verfärbungen, kleine Lücken, Absplitterungen oder eine unregelmäßige Zahnform korrigieren.",
        "In unserer Praxis in Berlin Prenzlauer Berg planen wir sie so substanzschonend wie möglich, und sagen dir auch, wenn eine andere Lösung für dich die bessere ist.",
      ],
    },

    /* Das Verzeichnis. Die Einträge entstehen aus den Abschnitten darunter. */
    {
      _type: "contents",
      _key: "contents",
      headline: "Inhalt",
      /* Nicht `experten`: Das Motiv bringt oben und unten rechts eine
         eingebrannte Rundung mit (Alphakanal, erst nach 67px deckend) und
         kämpft dadurch gegen den Radius aus dem CSS. */
      image: "behandlungszimmer-rot",
      alt: "",
      caption: "Hannes Schulte-Ostermann",
    },

    /* --- 1 -------------------------------------------------------------- */
    {
      _type: "intro",
      _key: "was-sind-veneers",
      navLabel: "Was sind Veneers",
      headline: "Was sind Veneers",
      variant: "centered",
      image: "veneers-modell",
      columns: [
        "Veneers, auf Deutsch Verblendschalen, sind dünne Schalen aus Keramik oder Komposit, die dauerhaft auf die Vorderseite eines Zahns geklebt werden. Sie sind zwischen 0,3 und 1 Millimeter dick. Ein Non-Prep-Veneer ist damit etwa so dünn wie drei übereinandergelegte Blatt Papier.",
        "Der entscheidende Unterschied zur Krone: Eine Krone umfasst den gesamten Zahn und erfordert, dass ringsum Zahnsubstanz abgetragen wird. Ein Veneer bedeckt nur die Sichtfläche. Deshalb gilt es als die deutlich zahnschonendere Lösung, wenn es um Ästhetik geht.",
      ],
    },

    /* --- 2 --- Ohne Hervorhebung: vergleichen, nicht empfehlen. --------- */
    {
      _type: "compare",
      _key: "arten",
      navLabel: "Arten im Vergleich",
      headline: "Keramik, Non-Prep oder Komposit",
      columns: [
        { name: "Keramik", meta: "klassisch" },
        { name: "Non-Prep", meta: "ohne Abtrag" },
        { name: "Komposit", meta: "in einer Sitzung" },
      ],
      lines: [
        {
          name: "Material",
          values: [
            { kind: "text", text: "Lithiumdisilikat, Feldspatkeramik" },
            { kind: "text", text: "dünne Hochleistungskeramik" },
            { kind: "text", text: "Kunststoff-Komposit" },
          ],
        },
        {
          name: "Abschleifen",
          values: [
            { kind: "text", text: "0,3–1,0 mm" },
            { kind: "text", text: "kein bis minimaler Abtrag" },
            { kind: "text", text: "praktisch keiner" },
          ],
        },
        {
          name: "Umkehrbar",
          values: [
            { kind: "nein" },
            { kind: "pille", text: "bedingt" },
            { kind: "ja" },
          ],
        },
        {
          name: "Haltbarkeit",
          values: [
            { kind: "text", text: "10–15 Jahre" },
            { kind: "text", text: "8–12 Jahre" },
            { kind: "text", text: "5–8 Jahre" },
          ],
        },
        {
          name: "Stärken",
          values: [
            { kind: "text", text: "höchste Ästhetik, stabil, verfärbt nicht" },
            { kind: "text", text: "maximal zahnschonend" },
            { kind: "text", text: "günstig, in einer Sitzung fertig" },
          ],
        },
        {
          name: "Grenzen",
          values: [
            { kind: "text", text: "irreversibel" },
            { kind: "text", text: "nicht bei dunklen Zähnen oder engem Platz" },
            { kind: "text", text: "verfärbt mit der Zeit, weniger stabil" },
          ],
        },
      ],
    },

    /* --- 3 -------------------------------------------------------------- */
    {
      _type: "prose",
      _key: "abschleifen",
      navLabel: "Abschleifen",
      heading: "Müssen die Zähne abgeschliffen werden?",
      image: "farbskala-bleaching",
      side: "left",
      body: blocks("abschleifen", [
        "Das ist die Frage, die uns am häufigsten gestellt wird, und die berechtigteste. Die Antwort lautet: Es kommt darauf an, und bei einem Teil der Patientinnen und Patienten lautet sie Nein.",
        "### Beim klassischen Keramikveneer",
        "Die Zahnoberfläche wird um 0,3 bis 1 Millimeter reduziert, meist innerhalb des Zahnschmelzes. Das ist deutlich weniger als bei einer Krone, aber es ist endgültig: **Abgetragener Schmelz wächst nicht nach.** Der Zahn braucht ab diesem Zeitpunkt dauerhaft eine Versorgung.",
        "### Beim Non-Prep-Veneer",
        "Diese Veneers kommen ohne oder mit minimalem Abtrag aus. Sie funktionieren allerdings nicht immer: Bei stark verfärbten Zähnen scheint die Farbe durch, und bei bereits großen oder eng stehenden Zähnen kann das Ergebnis massig wirken.",
        "Was wir dir zusagen können: Wir schleifen keinen gesunden Zahn ab, um ein Ergebnis zu erreichen, das auch schonender möglich gewesen wäre. Wenn [Bleaching](/leistungen/bleaching), eine Korrektur mit [unsichtbaren Alignern](/leistungen/aligner) oder eine Komposit-Restauration dein Ziel erreicht, sagen wir dir das.",
      ]),
    },

    /* --- 4 -------------------------------------------------------------- */
    {
      _type: "prose",
      _key: "mockup",
      navLabel: "Mock-up",
      heading: "Das Mock-up",
      image: "aligner-schiene",
      side: "right",
      body: blocks("mockup", [
        "Bevor irgendetwas Unumkehrbares passiert, machen wir dein künftiges Lächeln sichtbar. Auf Basis eines digitalen Scans planen wir die neue Zahnform am Bildschirm und übertragen sie als provisorische Kunststoffschicht direkt auf deine Zähne, ohne Abschleifen und ohne Kleben.",
        "Du kannst damit sprechen, lachen und dich im Spiegel ansehen. Du kannst nach Hause gehen und Menschen fragen, deren Urteil dir wichtig ist. Und du kannst sagen: zu lang, zu weiß, zu gleichmäßig. **Änderungen an dieser Stelle kosten nichts außer Zeit.**",
        "Erst wenn du mit dem Mock-up zufrieden bist, beginnt die eigentliche Behandlung. Vorher wird kein Zahn berührt. Aus unserer Erfahrung ist das der wichtigste einzelne Schritt der gesamten Veneer-Behandlung, und der Grund, warum es bei uns keine Überraschungen beim Einsetzen gibt.",
        "Das Mock-up kostet ab 450 EUR pro Kiefer. Wer sich danach gegen Veneers entscheidet, hat einen niedrigen dreistelligen Betrag ausgegeben statt eines fünfstelligen, und weiß, woran er ist.",
      ]),
    },

    /* --- 5 -------------------------------------------------------------- */
    {
      _type: "steps",
      _key: "ablauf",
      navLabel: "Ablauf",
      headline: "Ablauf: von der Beratung bis zum fertigen Veneer",
      steps: [
        {
          title: "Beratung und Analyse",
          text: "Wir prüfen den Zustand deiner Zähne, des Zahnfleischs und deiner Kaufunktion. Nicht jeder Zahn eignet sich für ein Veneer. Am Ende steht ein schriftlicher Heil- und Kostenplan.",
        },
        {
          title: "Digitale Abformung und Mock-up",
          text: "Wir scannen deine Zähne mit einem Intraoralscanner, ohne Abformmasse. Aus diesen Daten entsteht die digitale Planung und dein Mock-up.",
        },
        {
          title: "Vorbereitung und Fertigung",
          text: "Falls nötig, wird der Zahn minimal vorbereitet. Je nach Veneer-Art entstehen deine Veneers in unserem Praxislabor im Prenzlauer Berg oder bei einem spezialisierten Partnerlabor. Farbe und Transluzenz werden am Behandlungsstuhl abgestimmt, nicht nach Farbring aus dem Katalog.",
        },
        {
          title: "Einsetzen",
          text: "Die Veneers werden angeprobt, kontrolliert und adhäsiv befestigt. Pro Zahn solltest du etwa 30 bis 45 Minuten einplanen. Danach folgt ein Kontrolltermin. Insgesamt sind das zwei bis vier Termine über etwa zwei bis vier Wochen.",
        },
      ],
    },

    {
      _type: "ctaBand",
      _key: "cta-beratung",
      headline: "Erst reden, dann entscheiden.",
      text: "In einem Beratungstermin klären wir, ob Veneers für dich das Richtige sind.",
      actionLabel: "Termin buchen",
      actionHref: "/#kontakt",
      image: "beratung-patientin",
    },

    /* Der Beleg direkt hinter dem Ablauf: Wer gerade gelesen hat, wie es
       geht, will sehen, was dabei herauskommt. Kein Eintrag in der
       Navigation — er ist Beleg, kein Kapitel. */
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
      heading: "Haltbarkeit",
      image: "teeth-macro",
      side: "left",
      body: blocks("haltbarkeit", [
        "Für Keramikveneers ist das gut untersucht. Eine Langzeitstudie der Medizinischen Universität Innsbruck wertete 1.335 vollkeramische Restaurationen bei 302 Patientinnen und Patienten über einen Zeitraum von bis zu 22 Jahren aus. Die Überlebensraten:",
        "- **97,3 %** nach 5 Jahren",
        "- **93,5 %** nach 10 Jahren",
        "- **78,5 %** nach 20 Jahren",
        "Zwei Faktoren erhöhten das Risiko eines Versagens deutlich: **wurzelbehandelte Zähne** und **Bruxismus**, also nächtliches Zähneknirschen.",
        "Realistisch solltest du mit 10 bis 15 Jahren rechnen. Zwanzig Jahre sind erreichbar, aber kein Versprechen. Komposit-Veneers halten mit 5 bis 8 Jahren erkennbar kürzer.",
      ]),
      note: {
        variant: "source",
        title: "Studienbeleg",
        text: "Beier, Kapferer, Dumfahrt (2012): Survival of Ceramic Veneers. International Journal of Prosthodontics, Medizinische Universität Innsbruck. 1.335 Restaurationen, 302 Patientinnen und Patienten, Beobachtungszeitraum bis 22 Jahre.",
      },
    },

    /* --- 7 -------------------------------------------------------------- */
    {
      _type: "prose",
      _key: "nachteile",
      navLabel: "Nachteile",
      heading: "Nachteile",
      image: "empfang-p25",
      side: "right",
      body: blocks("nachteile", [
        "Veneers sind kein risikofreier Eingriff, und wer dir das erzählt, verkauft dir etwas.",
        "- **Der Substanzverlust ist endgültig.** Ein präparierter Zahn bleibt lebenslang versorgungspflichtig. Fällt ein Veneer nach 15 Jahren aus, braucht es ein neues, mit den entsprechenden Kosten.",
        "- **Vorübergehende Empfindlichkeit** auf Kälte und Süßes ist in den ersten Wochen normal, in seltenen Fällen bleibt sie.",
        "- **Abplatzungen und Ablösungen** kommen vor, meist reparabel, gelegentlich mit Neuanfertigung.",
        "- **Das Zahnfleisch verändert sich.** Zieht es sich über die Jahre zurück, kann der Veneer-Rand sichtbar werden.",
        "### Wann wir abraten",
        "Bei ausgeprägtem Zähneknirschen oder einer unbehandelten [CMD](/leistungen/cmd-behandlung), denn hier gehört zuerst die Ursache behandelt. Bei nicht abgeschlossenem Kieferwachstum. Bei unbehandelter [Parodontitis](/leistungen/parodontitis-behandlung) oder aktiver Karies. Bei ausgeprägten Zahnfehlstellungen, wo eine kieferorthopädische Korrektur die ehrlichere Lösung ist. Und bei der Erwartung, dass alle Zähne makellos gleichmäßig strahlend weiß aussehen sollen. Das sieht künstlich aus, und wir bauen es nicht.",
      ]),
    },

    /* --- 8 -------------------------------------------------------------- */
    {
      _type: "compare",
      _key: "alternativen",
      navLabel: "Alternativen",
      topline: "Was sonst infrage kommt",
      headline: "Veneers, Bleaching, Bonding oder Aligner",
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
            { kind: "text", text: "0,3–1,0 mm, bei Non-Prep kein bis minimal" },
            { kind: "nein" },
            { kind: "text", text: "praktisch keiner" },
            { kind: "nein" },
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
            { kind: "ja" },
            { kind: "ja" },
            { kind: "nein" },
          ],
        },
      ],
      note: "Häufig ist die beste Antwort eine Kombination: erst bleichen, dann sechs Monate warten, dann nur die zwei Zähne mit Veneers versorgen, die es wirklich brauchen. Das kostet einen Bruchteil und erhält deine Zahnsubstanz.",
    },

    /* --- 9 --- Erst die Sache, dann der Preis. -------------------------- */
    {
      _type: "pricing",
      _key: "kosten",
      navLabel: "Kosten",
      headline: "Was Veneers in Berlin kosten",
      pricing: [
        {
          name: "Komposit-Veneer",
          price: "€ 450,-",
          from: true,
          unit: "/ Zahn",
        },
        {
          name: "Keramikveneer",
          price: "€ 1.200,-",
          from: true,
          unit: "/ Zahn",
        },
        {
          name: "Non-Prep-Veneer",
          price: "€ 1.400,-",
          from: true,
          unit: "/ Zahn",
        },
        { name: "Mock-up", price: "€ 450,-", from: true, unit: "/ Kiefer" },
      ],
      note: "Bei Einzelzahnversorgungen mit hohem ästhetischen Anspruch beginnt das Keramikveneer bei € 1.500,-. Ein einzelner Zahn, der sich neben unveränderten Nachbarn einfügen muss, ist die anspruchsvollste Aufgabe überhaupt.",
      disclaimer:
        "Warum „ab“ und kein Festpreis? Zahnärztliche Leistungen werden nach der Gebührenordnung für Zahnärzte abgerechnet. Was deine Behandlung kostet, hängt vom tatsächlichen Aufwand ab: Zahl der Zähne, Ausgangssituation, Material, Laboraufwand. Ein Pauschalpreis, der das ignoriert, wäre entweder für uns oder für dich der falsche. Deshalb nennen wir Einstiegspreise und rechnen den Rest im Heil- und Kostenplan aus, bevor du dich entscheidest.",
    },

    /* Stimmen vor den Fragen: Wer bis hierher gelesen hat, entscheidet sich
       gerade. Die Zitate kommen aus der Startseite, gepflegt an einer
       Stelle. */
    { _type: "stories", _key: "stimmen" },

    /* --- 10 ------------------------------------------------------------- */
    {
      _type: "faq",
      _key: "faq",
      navLabel: "Häufige Fragen",
      headline: "Häufige Fragen zu Veneers",
      questions: [
        {
          question: "Tut das Einsetzen von Veneers weh?",
          answer:
            "Die Vorbereitung erfolgt unter lokaler Betäubung und ist nicht schmerzhaft. Das Einsetzen selbst ist meist ohne Betäubung möglich. Wenn du starke Angst vor Zahnbehandlungen hast, sag das bitte im Beratungsgespräch. Wir richten den Ablauf danach.",
        },
        {
          question: "Sehen Veneers künstlich aus?",
          answer:
            "Nur, wenn sie so geplant werden. Natürlich wirkende Veneers haben leichte Farbabstufungen, unterschiedliche Längen und eine sichtbare Oberflächenstruktur. Beim Mock-up entscheidest du mit, wie weit du gehen möchtest.",
        },
        {
          question: "Können Zähne unter Veneers faulen?",
          answer:
            "Nur wenn die Ränder undicht sind oder die Mundhygiene nachlässt. Bei sauberer Verarbeitung und regelmäßiger Kontrolle ist das Risiko gering. Dichte Klebefugen sind einer der Gründe, warum wir im eigenen Labor fertigen.",
        },
        {
          question: "Kann ich Veneers wieder entfernen lassen?",
          answer:
            "Komposit-Veneers ja. Non-Prep-Veneers bedingt. Klassische Keramikveneers nicht, der Zahn bleibt versorgungspflichtig.",
        },
        {
          question: "Wie viele Veneers brauche ich?",
          answer:
            "Das hängt davon ab, wie viele Zähne beim Lachen sichtbar sind. Häufig sind es vier bis sechs, bei breitem Lachen bis zu zehn. Wir zeigen es dir am Mock-up.",
        },
        {
          question: "Was ist der Unterschied zwischen Veneers und Lumineers?",
          answer:
            "Lumineers ist ein Markenname für eine bestimmte Art sehr dünner Non-Prep-Veneers. Das Prinzip ist dasselbe.",
        },
        {
          question: "Sind Veneers bei Zähneknirschen möglich?",
          answer:
            "Eingeschränkt und nur mit Schutzschiene. Bruxismus ist der wichtigste bekannte Risikofaktor für ein vorzeitiges Versagen. Zuerst behandeln wir die Ursache.",
        },
        {
          question: "Ab welchem Alter sind Veneers sinnvoll?",
          answer:
            "Nach abgeschlossenem Kieferwachstum, in der Regel ab etwa 18 Jahren.",
        },
        {
          question: "Was passiert, wenn ein Veneer abbricht?",
          answer:
            "Kleine Absplitterungen lassen sich oft direkt reparieren. Löst sich ein Veneer vollständig, kann es meist neu befestigt werden. Bewahr das Bruchstück auf und komm zeitnah vorbei.",
        },
        {
          question: "Können Veneers gelb werden?",
          answer:
            "Keramik nicht. Komposit mit den Jahren schon. Die natürlichen Nachbarzähne verfärben sich weiterhin, deshalb planen wir die Farbe vorausschauend.",
        },
        {
          question: "Was kosten Veneers in Berlin im Vergleich?",
          answer:
            "Die Spannen Berliner Praxen liegen zwischen etwa 700 und über 2.000 EUR pro Zahn. Preisunterschiede erklären sich über Material, Laborqualität, Planungsaufwand und Erfahrung des Behandlers.",
        },
      ],
    },

    /* Der Kontaktbereich schließt die Seite ab — ohne Nummer, er ist kein
       Kapitel, sondern das Ziel.

       Nur hier in der erweiterten Fassung: Wer bis hierher gelesen hat, hält
       oft schon ein Angebot einer anderen Praxis in der Hand. Genau danach
       fragen die drei Zusatzfelder. Auf der Startseite wären es drei Fragen
       mehr vor einer einfachen Terminanfrage. */
    {
      _type: "contact",
      _key: "kontakt",
      service: "Veneers",
      extended: true,
    },
  ],
};
