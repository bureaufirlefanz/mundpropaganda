# Sanity + Astro — Stand und Bedienung

Testaufbau neben dem bestehenden Prototyp. Der Prototyp bleibt unberührt.

```
studio/   Sanity Studio, eigenständig (nicht in die App eingebettet)
web/      Astro-App, zieht Inhalte aus Sanity
src/ public/ index.html …   der bisherige Prototyp, unverändert
```

Projekt `a6bjftwf`, Dataset `production`.

## Starten

Zwei Terminals, weil beide Server im Vordergrund laufen:

```bash
npm run studio    # → http://localhost:3333
npm run web       # → http://localhost:4321
```

Die Leistungsseite liegt unter <http://localhost:4321/leistungen/veneers>.

## Prüfen

```bash
npm run web:check     # Typen + Rauchtest über drei Breakpoints (braucht `npm run web`)
npm run web:styles    # Stil-Abgleich, s. u. (braucht Build + `npm run web:preview`)
```

`web:check` ist das Gegenstück zu `npm run check` beim Prototyp: Konsolenfehler,
fehlgeschlagene Requests, unsichtbar gebliebene Reveals, horizontaler Überlauf,
kaputte Bilder. Zwei Prüfungen kommen hinzu, die es dort nicht braucht: die
Seiten werden ab `/` **gecrawlt** statt aufgelistet — eine neue Leistung im
Studio wird damit automatisch mitgeprüft — und der Seitenwechsel über den Router
wird einmal echt durchgespielt, weil dabei Module tot bleiben und ScrollTrigger
sich stapeln können.

`web:styles` vergleicht die gerechneten Stile jedes Elements mit einem
gesicherten Stand (`… -- sichern` legt ihn an). Gedacht für Umbauten am CSS, bei
denen sich am Ergebnis nichts ändern soll.

Für die Ladeanimation gibt es zwei weitere Werkzeuge, beide gegen den Build:

```bash
npm run erstbild   # das erste Bild, bevor die Module laufen
npm run intro      # Daumenkino der Choreografie; MP_RELOAD=1 für warmen Cache
```

`erstbild` blockiert das JS-Bundle und zeigt damit genau den Zustand, den der
Browser zwischen Stylesheet und Skript zeichnet. Steht dort etwas in seiner
Endlage, das erst animiert erscheinen soll, blitzt es auf und springt zurück —
das nimmt man als „die Animation feuert nicht" wahr. Mit Zeitstichproben ist
das nicht zu fassen: lokal liegen dazwischen oft weniger als 50 ms.

## Ausprobieren

1. Im Studio **Leistung → Veneers** öffnen.
2. Etwas ändern, z. B. die Topline oder einen Preis, und **Publish** drücken.
3. Im Browser die Astro-Seite neu laden — die Änderung ist da.

Im Entwicklungsmodus fragt Astro bei jedem Aufruf frisch ab. Für den
Produktivstand entsteht die Seite beim Build (`npm run web:build`); Änderungen
im CMS brauchen dann einen neuen Build oder später einen Webhook.

## Aufbau des Studios

```
studio/
├── sanity.config.ts          Werkzeuge, Schema, Vorlagen
├── sanity.cli.ts             Projekt und Dataset für die Kommandozeile
├── schemaTypes/              die Inhaltsmodelle
│   ├── einstellungen.ts      Einzeldokument: Kontakt, Bewertungen, Profile
│   └── leistung.ts           Collection: Leistungen
├── structure/
│   ├── index.ts              die Seitenleiste
│   ├── dokumentAnsichten.ts  welche Reiter ein Dokument bekommt
│   └── WebVorschau.tsx       der Vorschau-Reiter
└── seed/                     Startbestand zum Einspielen
```

Die Seitenleiste ist ausgeschrieben statt der flachen Standardliste. Die
Ordnung folgt der üblichen: **erst was einmalig ist, dann die Sammlungen, dann
alles Übrige.**

- **Einstellungen** hängt an einer festen ID (`einstellungen`) und ist damit ein
  Einzeldokument. Eine Schema-Option dafür gibt es nicht — erzwungen wird es
  über die Struktur, und zusätzlich fehlt der Typ in den Vorlagen, damit im
  Menü kein „Neue Einstellungen" steht. Zwei davon würden die Seite still auf
  das falsche zeigen lassen.
- **Leistungen** ist eine Drag-Liste (s. u.).
- Darunter erscheint automatisch, was künftig dazukommt — ohne dass jemand die
  Strukturdatei anfassen muss.

Leistungen haben einen zweiten Reiter **Vorschau**: die Seite im iframe neben
dem Formular. Bewusst kein Presentation-Werkzeug — das bräuchte
Stega-Markierungen in der Ausgabe und einen Vorschau-Endpunkt in der Astro-App.
Gezeigt wird der Dev-Server auf :4321, also der letzte Build und nicht der
Entwurf.

**TypeGen ist bewusst aus.** Es bliebe in seinem Projektordner: Pfade nach
`../web` verwirft es, von der Wurzel aus findet es keine Projektwurzel. Es
liefe nur mit einer zweiten `sanity.cli.ts` oder indem die Abfragen ins Studio
wandern, weg von der Seite, die sie benutzt. Die Typen in
`web/src/lib/fixtures.ts` sind von Hand geschrieben, weil sie doppelt dienen —
als Vertrag für die Abfrage und als Form der Beispieldaten. Erzeugte Typen
könnten das zweite nicht. Bei deutlich mehr Collections lohnt die Umstellung.

## Collections

Was in Webflow eine **Collection** ist, heißt hier **Dokumenttyp**:

| Webflow | Sanity | Astro |
| --- | --- | --- |
| Collection | `defineType({ type: "document" })` | — |
| Collection Item | ein Dokument | — |
| Collection Page | — | `[slug].astro` mit `getStaticPaths()` |
| Collection List | GROQ-Abfrage | `.map()` im Baustein |
| Reference | Feldtyp `reference` | `->` in der Abfrage |
| Rich Text | Portable Text | `astro-portabletext` |

Bislang gibt es eine Sammlung und ein Einzeldokument.

**Einstellungen** trägt, was auf jeder Seite gleich ist: Telefon, E-Mail, die
Zahlen im Bewertungsbalken und die Profile in den sozialen Netzwerken. Alles
davon stand vorher fest im Markup. Gepflegte Felder gewinnen einzeln — ein
gesetztes Telefon gilt auch dann, wenn die Bewertungszahlen noch fehlen; nur
leere Felder fallen auf den Prototyp-Stand zurück. Profile ohne Adresse
verschwinden ganz, statt als Symbol ins Leere zu führen.

**Leistungen** ist die Sammlung. Sie trägt zwei Rollen, und die Felder im
Studio sind danach gruppiert:

- **Inhalt** — die eigene Seite unter `/leistungen/<slug>`.
- **Listeneintrag** — wie die Leistung in Services-Tabelle, Navigationsmenü und
  Footer auftaucht: Name in Listen, Platzierung, Menüspalte, Kürzel,
  Vorschaubild.

Der zweite Teil ist der eigentliche Gewinn. Dieselben Leistungen standen vorher
dreimal im Markup, in drei Schreibweisen — wer eine umbenannte, musste an alle
drei denken. Jetzt kommen sie aus `web/src/lib/leistungsliste.ts`, und das holt
sie einmal je Build aus der Collection.

**Sortiert wird per Drag-and-drop** wie in Webflow. Dafür läuft das Studio auf
Sanity 6 mit `@sanity/orderable-document-list`; die Reihenfolge landet im Feld
`orderRank`, und die Abfrage sortiert danach. Die Seitenleiste des Studios ist
deshalb ausgeschrieben (`sanity.config.ts`) statt der flachen Standardliste —
nur so gibt es die ziehbare Liste.

**Welche Seiten gebaut werden, entscheidet die Liste**, nicht mehr eine eigene
Slug-Abfrage: wer in der Collection steht, bekommt eine Seite. Sonst zeigte
jeder zweite Menüpunkt ins Leere.

### Startbestand einspielen

Die dreizehn Leistungen, die bisher fest im Markup standen, liegen als
Seed-Datei bereit — siehe `studio/seed/README.md`. Solange sie nicht
eingespielt sind, trägt die Liste in `leistungsliste.ts` die Seite;
umgeschaltet wird, sobald mindestens eine Leistung eine Menüspalte hat.

## Wie die Inhalte an die Seite kommen

- `studio/schemaTypes/leistung.ts` — das Inhaltsmodell. Zugeschnitten auf die
  Abschnitte, die die Seite wirklich hat: Hero, Intro, Benefits, Kosten, FAQ.
- `web/src/lib/queries.ts` — die GROQ-Abfragen.
- `web/src/lib/leistungen.ts` — Datenzugriff mit zwei Rückfallebenen: ohne
  Dokument treten Beispieldaten ein, ohne gepflegte Bilder die lokalen Motive.
- `web/src/pages/leistungen/[slug].astro` — **eine** Route für alle
  Leistungsseiten. Eine zweite Leistung kostet nur noch ein Dokument im
  Studio, keinen Code.

## Was noch offen ist

- Die Startseite ist noch nicht im CMS. Ihre Inhalte stehen als Markup in den
  Sections, ihre Bilder kommen weiterhin aus der lokalen Bildpipeline.
- Visual Editing (Klick-zum-Bearbeiten) ist nicht eingerichtet.
- Das Inhaltsmodell kennt Hero, Intro, Benefits, Kosten und FAQ. Vier weitere
  Abschnitte der Leistungsseite sind gebaut, aber noch nicht im Schema:
  **Before/After, Statement, „In vier Schritten" und die Feature-Zeilen.** Sie
  stehen als Beispieldaten in `web/src/lib/fixtures.ts`, und die Datenschicht
  setzt sie ein, solange das CMS sie nicht liefert. Wächst das Schema um
  dieselben Feldnamen, gewinnt es automatisch.

## Aufbau einer Leistungsseite

Die Reihenfolge entspricht der Vanilla-Vorlage `leistungen/veneers.html`:

| Abschnitt | Baustein | Inhalt aus |
| --- | --- | --- |
| Service-Hero | `[slug].astro` | CMS |
| Intro | `[slug].astro` | CMS |
| Benefits | `Benefits.astro` | CMS |
| Vorher/Nachher | `BeforeAfter.astro` | Beispieldaten |
| Statement | `[slug].astro` | Beispieldaten |
| In vier Schritten | `Steps.astro` | Beispieldaten |
| Transformation Stories | `Stories.astro` | fest (wie Startseite) |
| Kosten | `[slug].astro` | CMS |
| Feature-Zeilen | `Features.astro` | Beispieldaten |
| Magazin | `Magazine.astro` | fest, Einstieg über Props |
| FAQ | `Faq.astro` | CMS |
| Kontakt | `Contact.astro` | fest |

`Faq` und `Contact` teilen sich den Rahmen `ui/Panel.astro` — schmaler Kopf
links, Inhalt rechts. Beide schreiben `.s-panel` aus; läge die Regel in einer
der beiden Sections, wäre sie für die andere wirkungslos.

Das Formular prüft clientseitig und **versendet nichts** — wie im Prototyp.

## Bilder

Bilder aus dem CMS laufen über `CmsImage.astro`, nicht über `Picture.astro`:

- `web/src/lib/bilder.ts` baut die URLs mit `@sanity/image-url`. Die Größen
  rechnet Sanitys CDN zur Laufzeit; `auto=format` liefert AVIF oder WebP je
  nach Browser. Das ersetzt für gepflegte Inhalte die Bildpipeline des
  Prototyps — die kann nichts erzeugen, was erst im Studio hochgeladen wird.
- Die Abfrage nimmt das **ganze Bildobjekt** mit, nicht `asset->url`. Nur so
  bleiben Beschnitt und Bildmittelpunkt erhalten. Wirksam wird der
  Bildmittelpunkt allerdings erst, wenn ein `ratio` gesetzt ist: ohne
  Zielformat gibt es nichts, worauf er angewandt werden könnte. Ohne `ratio`
  beschneidet CSS über `object-fit: cover` — so wie bisher.
- `metadata.lqip` wird ausdrücklich mitabgefragt und als Hintergrund am Bild
  gesetzt. Anders als die lokalen Motive liegen CMS-Bilder auf einem fremden
  Host; ohne den Platzhalter bliebe der Rahmen so lange leer.
- Die lokalen Motive bleiben als Rückfall: solange im Studio kein Bild
  gepflegt ist, liefert `leistungen.ts` den Pfad aus `public/img`, und
  `CmsImage` nimmt beides an. Geprüft wird auf ein aufgelöstes Asset — ein
  angefasstes und wieder geleertes Bildfeld bleibt sonst als leeres Objekt
  stehen und gilt fälschlich als gepflegt.
