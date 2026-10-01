# Bausteine

**Erzeugt, nicht von Hand gepflegt.** Neu erzeugen mit `npm run bausteine`.

Diese Liste beantwortet eine Frage: **Gibt es das schon?** Bevor ein neuer
Baustein entsteht, gehört sie durchgesehen. Ein zweiter Baustein für dieselbe
Sache läuft beim nächsten Feinschliff auseinander, und die Seite sieht danach
an zwei Stellen verschieden aus.

Findet sich etwas Ähnliches, gibt es drei Wege:

1. **Anschließen** — der Baustein trägt die Aufgabe schon.
2. **Erweitern** — eine wahlfreie Angabe dazu, *additiv*: ohne sie muss
   dasselbe Markup wie zuvor entstehen. Mit `npm run web:styles` belegen,
   dass die bestehenden Seiten sich nicht verändert haben.
3. **Neu bauen** — nur, wenn der Bau grundlegend anders ist. Dann steht im
   Kopfkommentar, warum.

**Spalte „Verwendet in"** zeigt, was verwaist ist.
**Spalte „Katalog"** zeigt, ob der Baustein auf `/design/komponenten` steht.

## Seitenköpfe

Der erste Bildschirm eines Seitentyps. Sie unterscheiden sich im Bau, nicht nur im Inhalt.

| Baustein | Art | Was es ist | Angaben | Verwendet in | Katalog |
|---|---|---|---|---|---|
| `Hero` | Abschnitt | — | `lines: string[]` | Home, design/komponenten | ✓ |
| `ServiceHero` | Abschnitt | Hero einer Leistungsseite: Text links, randabfallendes Bild rechts. | `title: string` `slug?: string` `topline?: string` `claim?: string` `text?: string` `image?: ImageSource` `alt?: string` `action?: string` `actionHref?: string` | Service, design/komponenten | ✓ |
| `PillarHero` | Abschnitt | Der Kopf einer Pillar Page (Figma 177:1734). | `title: string` `eyebrow?: string` `image?: ImageSource` `alt?: string` | Pillar, design/komponenten | ✓ |
| `CareersHero` | Abschnitt | Der Kopf der Karriere- UND der Praxisseite: ein Wort, darunter der Bogen. | `title: string` `topline?: string` `image?: ImageSource` `alt?: string` `fallback?: string` `zoom?: boolean` | Careers, Practice, design/komponenten | ✓ |

## Text und Einstieg

Fließtext und Überleitungen.

| Baustein | Art | Was es ist | Angaben | Verwendet in | Katalog |
|---|---|---|---|---|---|
| `Intro` | Abschnitt | — | `topline?: string` `headline?: string` `columns: string[]` `image?: ImageSource` `alt?: string` `variant?: "default" | "centered"` `lead?: string` `action?: string` `actionHref?: string` `bleed?: string` | Careers, Pillar, Practice, Service, design/komponenten | ✓ |
| `Prose` | Abschnitt | Ein Textabschnitt mit Bild daneben (Figma 177:1732 und 177:2276). | `id: string` `body: PortableTextBlock[]` `image?: ImageSource` `alt?: string` `side?: "left" | "right"` `note?: ProseNote | null` | Pillar, design/komponenten | ✓ |
| `Statement` | Abschnitt | Ein einzelner Absatz über die halbe Seitenbreite, größer gesetzt als Fließtext. Trägt eine Kernaussage, ohne eine Headline zu sein | `topline: string` `text: string` | Service, design/komponenten | ✓ |
| `Split` | Abschnitt | Text links auf brauner Fläche, Bild rechts. | `topline: string` `title: string` `paragraphs: string[]` `image?: ImageSource` | Home, design/komponenten | ✓ |
| `TextHeading` | UI | Ein Zwischentitel im Fließtext — mit Sprungmarke. | `node: Block & { _tocId?: string }` | design/komponenten | ✓ |
| `SectionHeading` | UI | Die nummerierte Abschnittsüberschrift einer Pillar Page (Figma 177:2162 + 177:1731). | `number: number` `headline: string` `level?: 2 | 3` | Pillar, design/komponenten | ✓ |

## Verzeichnis und Sprungmarken

Orientierung auf langen Seiten. Alle drei arbeiten mit derselben `Heading[]`-Liste.

| Baustein | Art | Was es ist | Angaben | Verwendet in | Katalog |
|---|---|---|---|---|---|
| `Contents` | Abschnitt | Das Inhaltsverzeichnis einer Pillar Page (Figma 177:2107). | `headings: Heading[]` `headline?: string` `image?: ImageSource` `alt?: string` `caption?: string` | Pillar, design/komponenten | ✓ |
| `SectionDock` | UI | Section Anchor Dock — a fixed pill at the bottom edge that names the current section and expands into the full section list on hov | `headings: Heading[]` `label?: string` | Pillar, design/komponenten | ✓ |
| `TableOfContents` | UI | Das Inhaltsverzeichnis neben einem Beitrag. | `headings: Heading[]` `title?: string` | Post, design/komponenten | ✓ |
| `NavPromo` | UI | Das Werbefeld im großen Menü. | `headline: string` `href: string` `label?: string` `image?: ImageSource` `alt?: string` | design/komponenten, ui/Nav | ✓ |

## Daten und Vergleich

Zahlen, Preise, Gegenüberstellungen.

| Baustein | Art | Was es ist | Angaben | Verwendet in | Katalog |
|---|---|---|---|---|---|
| `Compare` | Abschnitt | Vergleichstabelle — zwei Spalten nebeneinander, Zeile für Zeile. | `topline?: string` `headline?: string` `columns: CompareColumn[]` `lines: CompareRow[]` `note?: string` | Careers, Pillar, design/komponenten | ✓ |
| `Prices` | Abschnitt | Preisraster. Jede Karte trägt eine Bezeichnung und eine Preis-Pille, die bündig unten sitzt — dadurch stehen die Pillen aller Kart | `title?: string` `pricing: Price[]` `id?: string` `note?: string` `disclaimer?: string` | Pillar, Service, design/komponenten | ✓ |
| `Facts` | Abschnitt | Zahlenleiste — vier überprüfbare Angaben über die Praxis, die beim Hereinscrollen hochzählen. | `topline: string` `headline: string` `figures: Figure[]` | Careers, design/komponenten | ✓ |
| `QuickFacts` | Abschnitt | "Auf einen Blick" — a compact term/value overview at the top of a service page: duration, cost, durability, anaesthesia. | `id?: string` `topline?: string` `headline?: string` `items: { label: string; value: str…` | Pillar, design/komponenten | ✓ |

## Abläufe

Schritt für Schritt, mit und ohne Zeitachse.

| Baustein | Art | Was es ist | Angaben | Verwendet in | Katalog |
|---|---|---|---|---|---|
| `Steps` | Abschnitt | Nummerierte Karten: der Ablauf einer Behandlung in wenigen Schritten. | `title?: string` `steps: Step[]` | Pillar, Service, design/komponenten | ✓ |
| `Timeline` | Abschnitt | Zeitstrahl — ein Ablauf als waagerechte Bahn, an der sich beim Scrollen eine Linie entlangzieht und die Marken nacheinander anspri | `headline: string` `stages: Stage[]` | Careers, design/komponenten | ✓ |
| `Features` | Abschnitt | Alternierende Bild/Text-Zeilen. Jede zweite Zeile dreht die Reihenfolge um, dadurch wandert das Bild im Wechsel von links nach rec | `lines: FeatureRow[]` | Practice, Service, design/komponenten | ✓ |

## Karten und Listen

Wiederholte Einträge. Vor einem neuen Kartenraster hier zuerst nachsehen.

| Baustein | Art | Was es ist | Angaben | Verwendet in | Katalog |
|---|---|---|---|---|---|
| `Services` | Abschnitt | Services-Tabelle. Die Zeilen kommen aus der Leistungen-Collection, nicht mehr aus dem Markup — dieselbe Quelle wie Menü und Footer | `title: string` | Home, design/komponenten | ✓ |
| `Magazine` | Abschnitt | — | `topline: string` `title: string` `text: string` `posts: Post[]` | Home, Service, design/komponenten, magazin/index, preview/[...path] | ✓ |
| `PostList` | Abschnitt | Die Beiträge als Raster — die Übersicht unter /magazin. | `posts: Post[]` | Magazine, design/komponenten | ✓ |
| `PostCard` | UI | Die Beitragskarte: Bild, darauf versetzt eine weiße Fläche. | `post: Post` `sizes: string` `parallax?: string` `withButton?: boolean` `headingLevel?: "h2" | "h3"` | Post, design/komponenten, sections/Magazine | ✓ |
| `Jobs` | Abschnitt | Offene Stellen — jede Zeile klappt auf und zeigt Aufgaben, Profil und den Weg zur Bewerbung. | `id?: string` `topline: string` `headline: string` `jobs: Job[]` `applicationEmail: string` `text?: string` | Careers, design/komponenten | ✓ |
| `Locations` | Abschnitt | Die Standorte mit Anschrift, Zeiten und Karte. | `id?: string` `topline: string` `headline: string` `text?: string` `locations: Location[]` | design/komponenten | ✓ |
| `Perks` | Abschnitt | Was die Praxis bietet, als Liste. Auf der Karriereseite. | `topline: string` `headline: string` `items: string[]` | Careers, design/komponenten | ✓ |
| `Reasons` | Abschnitt | Zwei bis vier Blöcke, die je eine Frage beantworten, die vor einer Bewerbung wirklich gestellt wird: Wie komme ich hin, mit wem ar | `topline: string` `headline: string` `items: Reason[]` | Careers, design/komponenten | ✓ |
| `Standards` | Abschnitt | Nummerierte Punkte links, ein zahnförmig maskiertes Foto rechts. | `title: string` `items: { name: string; text?: stri…` | Home, design/komponenten | ✓ |
| `Benefits` | Abschnitt | Dieselbe Section wie im Prototyp — Markup und Klassen unverändert, nur die Inhalte kommen jetzt aus der Datenschicht. Die data-Att | `topline: string` `headline: string` `items: Entry[]` `footnote?: TextWithLinks` | Service, design/komponenten | ✓ |
| `Values` | Abschnitt | Die Haltung der Praxis: drei bis fünf Punkte, jeder mit einem Wie. | `topline: string` `headline: string` `text?: string` `items: Value[]` | Practice, design/komponenten | ✓ |

## Stimmen und Geschichten

Patientinnen und Patienten, Mitarbeitende.

| Baustein | Art | Was es ist | Angaben | Verwendet in | Katalog |
|---|---|---|---|---|---|
| `Stories` | Abschnitt | Karten und Zitate gehören zusammen: Beim Blättern wechselt beides gleichzeitig, deshalb ist es EIN Datensatz und nicht zwei parall | `items: Geschichte[]` `action?: { text: string; href: strin…` | Home, Pillar, Service, design/komponenten | ✓ |
| `Story` | Abschnitt | Die Praxis in eigenen Worten: Text links, Bild rechts, Zahlen darunter. | `topline: string` `headline: string` `columns: string[]` `image?: ImageSource` `figures?: Figure[]` | Practice, design/komponenten | ✓ |
| `Voices` | Abschnitt | Stimmen aus dem Team — Zitate, versetzt statt in einer Reihe. | `topline: string` `headline: string` `voices: Voice[]` | Careers, design/komponenten | ✓ |
| `Experts` | Abschnitt | — | `title: string` `names: string` `paragraphs: string[]` `image?: ImageSource` | Home, design/komponenten | ✓ |

## Medien

Bilder, Vergleiche, Video.

| Baustein | Art | Was es ist | Angaben | Verwendet in | Katalog |
|---|---|---|---|---|---|
| `Gallery` | Abschnitt | Unsere Standorte. Zwei Darstellungen derselben Motive: "reihe" — die Bildreihe läuft beim Scrollen waagerecht durch (Bestand) "rin | `variant?: "reihe" | "ring"` `title: string` `images?: { image: ImageSource; capti…` | Home, Practice, design/komponenten | ✓ |
| `BeforeAfter` | Abschnitt | Vorher/Nachher-Vergleich mit Schieberegler. | `topline: string` `before?: ImageSource` `after?: ImageSource` | Pillar, Service, design/komponenten | ✓ |
| `VideoBlock` | Abschnitt | Ein YouTube-Video, das erst auf Klick lädt. | `url: string` `title?: string` `poster?: ImageSource` `fallback?: string` | Careers, design/komponenten | ✓ |
| `CmsImage` | UI | Ein Bild, das aus dem CMS kommen kann — oder aus public/img, solange im Studio keines gepflegt ist. Beide Fälle sehen im Markup gl | `source: ImageSource | undefined | n…` `alt?: string` `widths?: number[]` `sizes?: string` `eager?: boolean` `ratio?: number` | Post, sections/BeforeAfter, sections/Benefits, sections/CareersHero, sections/Contents, sections/CtaBand, sections/Experts, sections/Features, sections/Intro, sections/PillarHero, sections/Prose, sections/ServiceHero, sections/Split, sections/Standards, sections/Stories, sections/Story, sections/VideoBlock, sections/Voices, ui/AuthorNote, ui/ImageRing, ui/NavPromo, ui/PostCard, ui/PostImage | — |
| `Picture` | UI | Responsives Bild aus der lokalen Pipeline. | `name: string` `alt?: string` `sizes?: string` `eager?: boolean` `parallax?: string` | Post, design/komponenten, sections/BeforeAfter, sections/Benefits, sections/CareersHero, sections/Experts, sections/Features, sections/Gallery, sections/Hero, sections/Intro, sections/ServiceHero, sections/Split, sections/Standards, sections/Stories, sections/Story, sections/TeamPhotos, sections/Voices, ui/ImageRing, ui/PostCard | ✓ |
| `PostImage` | UI | Ein Bild im Fließtext eines Beitrags. | `node: {` | design/komponenten | ✓ |
| `ImageRing` | UI | Bild-Ring — die Motive sitzen auf einem Zylinder, der um den Betrachter kreist. Alternative Darstellung zur laufenden Bildreihe. | `images: RingImage[]` `label: string` `minimum?: number` | design/komponenten | ✓ |

## Handlung und Kontakt

Alles, was zu einem Termin führt.

| Baustein | Art | Was es ist | Angaben | Verwendet in | Katalog |
|---|---|---|---|---|---|
| `CtaBand` | Abschnitt | Das Handlungsband zwischen zwei Abschnitten (Figma 177:2314). | `headline: string` `text?: string` `actionLabel?: string` `actionHref?: string` `image?: ImageSource` `alt?: string` | Pillar, design/komponenten | ✓ |
| `Contact` | Abschnitt | Kontaktbereich: derselbe Panel-Aufbau wie das FAQ, rechts statt des Akkordeons ein Formular. | `service?: string` `extended?: boolean` | Pillar, Service, design/komponenten | ✓ |
| `Application` | Abschnitt | Das Bewerbungsformular: mehrere Schritte, je nach Rolle andere Fragen. | `id?: string` `topline: string` `headline: string` `text?: string` `jobs: Job[]` `fallbackEmail?: string` | Careers, design/komponenten | ✓ |
| `Button` | UI | Zweiteiliger Button: Pille mit Label plus abgesetzter runder Pfeil. | `label: string` `href?: string` `variant?: "dark" | "block"` `static?: boolean` `type?: "submit" | "button"` `labelAttrs?: Record<string, unknown>` | 404, Careers, Post, design/komponenten, design/styleguide, sections/Application, sections/Contact, sections/CtaBand, sections/Hero, sections/Intro, sections/Jobs, sections/Magazine, sections/ServiceHero, sections/Services, sections/Standards, sections/Stories, ui/Footer, ui/Nav, ui/NavPromo, ui/PostCard | ✓ |
| `Faq` | Abschnitt | FAQ: panel frame plus accordion. Every page uses the same block with the same head — topline, headline and a short line — only the | `questions: Question[]` | Careers, Home, Pillar, Service, design/komponenten | ✓ |
| `Accordion` | UI | Akkordeon. Immer nur ein Eintrag offen (`data-accordion="single"`), gesteuert von modules/ui.js. | `questions: Question[]` | design/komponenten, design/styleguide, sections/Faq | ✓ |

## Hinweise und Belege

Abgesetzte Kästen, Autorenangaben.

| Baustein | Art | Was es ist | Angaben | Verwendet in | Katalog |
|---|---|---|---|---|---|
| `SourceNote` | UI | A set-off note for study references, legal wording and warnings. | `variant?: "source" | "info" | "warnin…` `title?: string` `href?: string` `linkLabel?: string` | design/komponenten, sections/Prose | ✓ |
| `AuthorNote` | UI | Accountability for a medical service page: who wrote the text, who checked it professionally, when that last happened, and what it | `author?: Person | null` `reviewedBy?: Omit<Person, "image"> | null` `lastReviewed?: string | null` `sources?: Source[] | null` | design/komponenten | ✓ |
| `Reviews` | UI | Bewertungsbalken. Zahlen und Quelle kommen aus den Einstellungen. | — | design/komponenten, sections/Hero, sections/ServiceHero | ✓ |

## Rahmen

Auf jeder Seite gleich.

| Baustein | Art | Was es ist | Angaben | Verwendet in | Katalog |
|---|---|---|---|---|---|
| `Nav` | UI | Die Leistungsspalten im Menü kommen aus der Collection — dieselbe Quelle wie Services-Tabelle und Footer. Alles Übrige (Hauptmenü, | — | layouts/Base | — |
| `Footer` | UI | — | `id?: string` | layouts/Base | — |
| `Filter` | UI | Filter für die Magazin-Übersicht: ein Button, der die Kategorien ausklappt. | `categories: string[]` `total: number` | design/komponenten, sections/PostList | ✓ |
| `Panel` | UI | Panel-Rahmen: schmaler Kopf links, der beim Scrollen stehen bleibt, breiter Inhalt rechts. Was rechts steht, gibt der Aufrufer übe | `id?: string` `topline: string` `title?: string` `text?: string` | Careers, design/komponenten, sections/Application, sections/Contact, sections/Faq | ✓ |
| `Backdrop` | UI | Seitengrund: nur ein feines Korn. Farbige Lichtfelder standen hier schon — sie haben der Fläche nicht gutgetan und sind wieder rau | — | layouts/Base | — |

## Technik und Zierde

Kein eigener Inhalt — Sprites, Übergänge, Motive, Angaben für Suchmaschinen.

| Baustein | Art | Was es ist | Angaben | Verwendet in | Katalog |
|---|---|---|---|---|---|
| `Icons` | UI | — | — | layouts/Base, layouts/Design | — |
| `Transition` | UI | Spaltenvorhang für den Seitenwechsel. | — | layouts/Base | — |
| `VisualEditing` | UI | Klick-zum-Bearbeiten in der Vorschau. | — | preview/[...path] | — |
| `StructuredData` | UI | Die Praxis als strukturierte Daten (schema.org, JSON-LD). | — | layouts/Base | — |
| `Thread` | UI | — | — | sections/Standards | — |
| `ToothLines` | UI | — | — | sections/CareersHero, sections/Hero, sections/ServiceHero | — |
| `ToothRings` | UI | — | — | design/komponenten, sections/Standards | ✓ |

## Nicht einsortiert

Diese Bausteine stehen in keiner Gruppe. Wer einen davon anfasst, trägt ihn
in `scripts/bausteine.mjs` unter `GROUPS` ein.

| Baustein | Art | Was es ist | Angaben | Verwendet in | Katalog |
|---|---|---|---|---|---|
| `PhotoGrade` | UI | TEST ONLY (2026-09-29) — a colour grade over every photo on the site, to judge whether the images read better slightly brighter an | — | layouts/Base, layouts/Design | — |
| `TeamPhotos` | Abschnitt | Team on the practice page: one large word on the left, a masonry of group photos on the right, half the window wide. Replaced the  | `id?: string` | Practice, design/komponenten | ✓ |

## Deckung der Komponentenseite

Es fehlt keiner.

Bewusst nicht im Katalog:

- `Backdrop` — Papierkörnung über der ganzen Seite, aus layouts/Base.astro; auf dem Styleguide unter Körnung
- `CmsImage` — Bildhülle ohne eigene Gestalt
- `Footer` — Seitenfuß aus layouts/Base.astro, schließt eine Seite ab; mitten im Katalog ergäbe er keinen Sinn
- `Icons` — SVG-Sprite, unsichtbar
- `Nav` — fixierte Leiste aus layouts/Base.astro, läge über jedem Beispiel
- `PhotoGrade` — Test-Farbkorrektur über allen Fotos, kein eigener Baustein
- `StructuredData` — JSON-LD im Kopf der Seite, unsichtbar
- `Thread` — Verbindungslinie, gehört zu einem Abschnitt
- `ToothLines` — Zierlinien im Hintergrund
- `Transition` — Seitenübergang, kein Markup
- `VisualEditing` — nur im Vorschaumodus

## Angaben im Einzelnen

Nur die Angaben, über denen ein JSDoc steht. Er ist der Hilfetext: Was ein
Wert bedeutet, steht damit an genau einer Stelle — in der Datei — und wird
hier bloß eingesammelt. Wer eine Angabe hinzufügt und sie nicht erklärt,
taucht hier nicht auf; das ist der Zweck der Liste.

**`Application`**

- `fallbackEmail?: string` — Adresse für Stellen, an denen keine eigene hinterlegt ist.

**`Benefits`**

- `footnote?: TextWithLinks` — Der Satz unter der Liste, der weiterführt. Wahlfrei und ohne ihn unverändert: Die Aufzählung erklärt drei Arten kurz, und wer es genauer will, gehört auf die Seite, die es genauer erklärt. Die Ziele stehen im Repository, nicht im Studio — siehe `TextWithLinks` in `lib/shapes.ts`. /

**`CareersHero`**

- `fallback?: string` — Das gestaltete Ersatzmotiv, solange im Studio keines hängt. Wählbar, seit dieser Kopf auch die Praxisseite trägt: Dort wäre ein Behandlungsbild das falsche Versprechen — man will die Räume sehen, nicht den Stuhl. Voreinstellung bleibt die Karriereseite. /
- `zoom?: boolean` — Ob das Bild beim Scrollen auf Vollbild aufzieht. Wahlfrei und aus: Auf der Karriereseite steht der Kopf für sich, dort wäre das eine Bewegung ohne Anlass. Auf der Praxisseite trägt sie den Übergang vom Kopf in die Seite — man fährt in den Raum hinein, in den man kommt. /

**`Compare`**

- `headline?: string` — Wahlfrei — siehe `ui/SectionHeading.astro`.
- `note?: string` — Kleingedrucktes unter der Tabelle.

**`Contact`**

- `service?: string` — Vorauswahl im Feld „Leistung".
- `extended?: boolean` — Die drei Zusatzfelder — siehe Kopf.

**`Contents`**

- `image?: ImageSource` — Das Porträt rechts. Ohne eines nimmt die Fläche die volle Breite.
- `caption?: string` — Steht rechtsbündig unter der Fläche, z. B. der Name der Person.

**`CtaBand`**

- `actionHref?: string` — Fertiger Pfad. Dieser Baustein setzt keine URLs zusammen.

**`Gallery`**

- `images?: { image: ImageSource; caption?: string }[]` — Die Motive auf dem Ring, aus dem CMS.

**`Hero`**

- `lines: string[]` — Die beiden kleinen Blöcke unter der Wortmarke. Zeilenumbrüche zählen.

**`Intro`**

- `topline?: string` — Die Rubrik über der Überschrift. Wahlfrei: Der Einstiegsblock der Pillar Pages trägt keine — dort steht die Rubrik schon im Kopf darüber, und zweimal „Guides" untereinander wäre eine Dopplung. Alle bestehenden Aufrufer geben eine mit, ihr Markup bleibt dadurch unverändert. /
- `headline?: string` — Wahlfrei: Auf Pillar Pages steht die Überschrift als eigener, nummerierter Block darüber (`ui/SectionHeading.astro`).
- `image?: ImageSource` — Bild über den Spalten. Nur in der Ausprägung `centered` vorgesehen — dort steht es mittig und schmäler als die Seite (Figma 177:1731). /
- `variant?: "default" | "centered"` — `centered` ist die Fassung der Pillar Pages: Bild mittig, darunter zwei Textspalten als zentrierter Block. Die Überschrift steht dort nicht hier, sondern nummeriert darüber (`ui/SectionHeading.astro`). Ohne Angabe bleibt es beim dreispaltigen Raster der übrigen Seiten — deren Markup ändert sich dadurch nicht. /
- `lead?: string` — Der Einstiegstext, der vorher im Kopf der Seite stand. Er gehört hierher: Im Kopf war er ein dritter Anfang zwischen Bild und Überschrift, hier trägt er die Aussage, die der Abschnitt ausbuchstabiert. /
- `bleed?: string` — Ein randloses Bild über dem Abschnitt, als Motivname aus der Bildpipeline (`Picture.astro`), nicht als CMS-Bild. Es bricht über die volle Fensterbreite aus und läuft ohne Rundung bis an beide Kanten — dieselbe Begründung wie bei `PostImage` in der Fassung `full`: Eine Rundung an einer Kante, die am Fensterrand endet, sieht aus wie ein Fehler beim Zuschneiden. `alt` beschreibt das Bild, das tatsächlich gerendert wird. `bleed` und `image` schließen sich in der Praxis aus: das eine ist die randlose Fassung, das andere das mittige Bild der Pillar Pages. /

**`Jobs`**

- `applicationEmail: string` — Adresse für Bewerbungen. Steht im Karriere-Dokument, nicht hier.
- `text?: string` — Der Anspruch über der Liste. Wahlfrei — ohne ihn beginnt sie sofort.

**`PillarHero`**

- `eyebrow?: string` — Die Rubrik über der Überschrift, z. B. „Guides".

**`Prices`**

- `title?: string` — Wahlfrei — siehe `ui/SectionHeading.astro`. Voreinstellung „Kosten“ bleibt für die Leistungsseiten.
- `id?: string` — Sprungmarke. Ohne Angabe bleibt es bei „kosten" wie bisher.
- `note?: string` — Der Sonderfall, der in keine Zeile passt.
- `disclaimer?: string` — Pflicht, sobald Preise dastehen — siehe Kopf.

**`Prose`**

- `id: string` — Sprungmarke, erzeugt von `idFrom()` — hier wird keine gebaut.
- `image?: ImageSource` — Bild aus dem CMS — oder der Name eines gestalteten Motivs aus `lib/image-widths.json`. `CmsImage` bedient beides. /
- `side?: "left" | "right"` — Auf welcher Seite das Bild steht. Ohne Angabe rechts.

**`ServiceHero`**

- `slug?: string` — Entscheidet über das Ersatzmotiv. Siehe `lib/service-images.ts`.
- `claim?: string` — Wofür die Praxis bei dieser Behandlung steht. Steht anstelle des Leistungsnamens in der Überschrift — siehe `heading` unten. Wahlfrei: Ohne Anspruch trägt die Überschrift weiter den Namen, und alle übrigen Leistungsseiten bleiben unverändert. /
- `action?: string` — Beschriftung des Buttons.

**`Steps`**

- `title?: string` — Wahlfrei — siehe `ui/SectionHeading.astro`.

**`Stories`**

- `action?: { text: string; href: string }` — Der Button unter dem Zitat. Ohne Verweis steht dort keiner.

**`VideoBlock`**

- `fallback?: string` — Name eines Motivs aus der lokalen Pipeline, solange im Studio kein Standbild hängt. Ohne Angabe bleibt die Fläche leer — dann steht dort der Abspielpfeil auf ruhigem Grund und sonst nichts. /

**`AuthorNote`**

- `lastReviewed?: string | null` — ISO date.

**`Button`**

- `labelAttrs?: Record<string, unknown>` — Attribute für die Beschriftung. Gebraucht, wo ein Modul den Text zur Laufzeit austauscht und dafür das Label finden muss — die Bildvorschau der Services-Tabelle setzt so `data-preview-label`. /

**`CmsImage`**

- `widths?: number[]` — Breiten für das srcset. Voreinstellung deckt Karten bis Vollpicture ab.
- `sizes?: string` — The width the image has to COVER, not the width of its box. Under `object-fit: cover` a landscape photo in a portrait box shows only its middle: a 3:2 image in a 3:4 box needs twice the box width, so the right value there is `200vw`, not `100vw`. Too small a value makes the browser pick a file that is then stretched: the magazine cards declared `24vw` while being 84vw wide on a phone, and came out soft. Derive it from the component's CSS at each of its breakpoints; values above 100vw or in vh are correct. /
- `eager?: boolean` — Nur für das LCP-Bild einer Seite setzen.
- `ratio?: number` — Seitenverhältnis (Breite/Höhe). Nur setzen, wenn serverseitig beschnitten werden soll — dann wirkt auch der Bildmittelpunkt aus dem Studio. Ohne Angabe beschneidet CSS über `object-fit: cover`. /

**`Filter`**

- `categories: string[]` — Die Kategoriewerte, die unter den Beiträgen vorkommen.
- `total: number` — Wie viele Beiträge es insgesamt gibt.

**`Footer`**

- `id?: string` — Sprungziel. Trägt `kontakt`, wenn die Seite keinen eigenen Kontaktabschnitt hat — siehe `contactSection` in `layouts/Base.astro`. /

**`NavPromo`**

- `headline: string` — Zwei bis drei Wörter. Der Kasten ist eine Menüspalte breit.

**`Panel`**

- `title?: string` — Wahlfrei — auf Pillar Pages steht die Überschrift nummeriert darüber (`ui/SectionHeading.astro`).
- `text?: string` — Zusatzzeile unter der Headline. Nicht jedes Panel hat eine.

**`Picture`**

- `sizes?: string` — The width the image has to COVER, not the width of its box. Under `object-fit: cover` a landscape photo in a portrait box shows only its middle: a 3:2 image in a 3:4 box needs twice the box width, so the right value there is `200vw`, not `100vw`. Too small a value makes the browser pick a file that is then stretched: the magazine cards declared `24vw` while being 84vw wide on a phone, and came out soft. Derive it from the component's CSS at each of its breakpoints; values above 100vw or in vh are correct. /

**`PostCard`**

- `parallax?: string` — Tiefe des Parallax auf dem Bild. Ohne Wert steht es still.
- `withButton?: boolean` — Der Button trägt das Karussell, nicht die Übersicht.
- `headingLevel?: "h2" | "h3"` — Die Ebene der Überschrift. Nicht fest verdrahtet, weil sie von der Seite abhängt: Im Karussell steht darüber ein h2 („Mund zu Mund"), also ist h3 richtig. Auf /magazin ist der Seitentitel das h1 und es gibt kein h2 dazwischen — dort wäre h3 eine übersprungene Ebene. Der Test in `web:check` hat genau das gemeldet: „h1 → h3 bei Zahngesundheit & Fitness". /

**`SectionDock`**

- `label?: string` — aria-label of the nav.

**`SectionHeading`**

- `number: number` — Die laufende Nummer, bereits 1-basiert.
- `level?: 2 | 3` — 2 oder 3 — ein Cluster-Artikel braucht dieselbe Form womöglich als h3.

**`TextHeading`**

- `node: Block & { _tocId?: string }` — Der Block, wie ihn `mitKennungen()` durchgereicht hat.

## Vorlagen und Layouts

Eine Vorlage ist der Zusammenbau eines Seitentyps. Sie lädt nichts, sie
bekommt alles als Angabe — dadurch rendert dieselbe Vorlage veröffentlichte
Inhalte und Entwürfe.

**templates/**

- `Careers` — Der Zusammenbau der Karriereseite.
- `Home` — Der Zusammenbau der Startseite — Bausteine und ihre Reihenfolge.
- `LegalPage` — Der Zusammenbau einer Rechtstextseite.
- `Magazine` — Der Zusammenbau der Magazin-Übersicht.
- `Pillar` — Der Zusammenbau einer Pillar Page.
- `Post` — Der Zusammenbau einer Beitragsseite.
- `Practice` — Der Zusammenbau der Praxisseite.
- `Service` — Der Zusammenbau einer Leistungsseite.

**layouts/**

- `Base` — Dokumentchrome. Entspricht head.hbs plus body-Gerüst.
- `Design` — Frame for the two design pages (styleguide and component catalogue).

## Module

JavaScript-Verhalten liegt in `web/src/js/modules/` und wird von `init.js`
gestartet. Ein Modul findet sein Markup über `data-`-Attribute und tut
nichts, wenn es keines gibt — deshalb schadet es nicht, dass jede Seite alle
Module lädt.

`application` · `embed` · `facts` · `filter` · `gallery` · `hero-zoom` · `hero` · `marker` · `nav` · `reveal` · `ring` · `rings` · `scroll` · `section-dock` · `services` · `standards` · `stories` · `thread` · `timeline` · `toc` · `ui`
