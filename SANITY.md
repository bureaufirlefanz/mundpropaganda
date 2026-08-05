# Sanity + Astro — Stand und Bedienung

Astro + Sanity ist das Produkt. Wie der Ordner aufgebaut ist, steht in
`CLAUDE.md`; hier geht es um das CMS und seine Anbindung.

```
studio/          Sanity Studio, eigenständig (nicht in die App eingebettet)
web/             Astro-App, zieht Inhalte aus Sanity
prototypen/      Vite-Handlebars-Stand und Webflow-Notizen, eingefroren
```

Hier stand, dies sei ein „Testaufbau neben dem bestehenden Prototyp" und der
Prototyp bleibe unberührt. Beides ist seit Stufe A überholt: Der Prototyp trug
bis dahin Tokens, Basis-CSS und das gesamte JavaScript der ausgelieferten
Seite — wer dort etwas änderte, änderte die Live-Website.

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
│   └── orte.ts               wo ein Dokument auf der Website auftaucht
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

**Klick-zum-Bearbeiten** über das Presentation-Werkzeug (Stufe 2). Die Website
steht neben dem Formular, mit den Entwürfen statt dem letzten Build, und ein
Klick auf einen Text öffnet das zugehörige Feld.

Hier stand die Begründung, warum es das nicht gebe: Es bräuchte
Stega-Markierungen in der Ausgabe. Das stimmte so nicht — die Markierungen
schaltet ein eigener Vorschau-Client ein, und die ausgelieferte Seite trägt
kein einziges davon (gemessen: 165.848 in der Vorschau, 0 im Build).

Der frühere Vorschau-Reiter am Dokument ist damit entfallen. Er zeigte den
gebauten Stand in einem iframe, also gerade nicht den Entwurf, den man
bearbeitet.

**Wo ein Dokument auftaucht**, steht in `structure/orte.ts`. Das ist der
eigentliche Gewinn: Die Einstellungen, die Navigation und der Fuß haben keine
eigene Seite und erscheinen trotzdem überall — ohne diese Zuordnung sähe die
Redaktion beim Bearbeiten ein leeres Vorschaufenster.

**Die Vorschau zeigt den Rahmen nicht als Entwurf.** Navigation, Fuß und
Einstellungen holen ihre Daten über die Ladefunktionen in `web/src/lib/`, und
die hängen am veröffentlichten Client. Für die Seite, die man gerade
bearbeitet, stimmt die Vorschau.

**TypeGen läuft** (Aufgabe 1 der Umbauliste): `npm run types` zieht das Schema
und erzeugt `web/src/lib/sanity.types.ts`, gesteuert über `sanity-typegen.json`
im Projektstamm. Es hängt in `web:check`, ein falsch geschriebener Feldname in
einer Abfrage bricht damit die Prüfung.

Hier stand die Begründung, warum es aus sei — es bliebe in seinem
Projektordner, und die Typen in `fixtures.ts` seien von Hand geschrieben, weil
sie doppelt dienten. Beides ist überholt: Man muss TypeGen die Pfade nur
ausdrücklich geben, und `fixtures.ts` gibt es seit Aufgabe 4 nicht mehr.

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
davon stand vorher fest im Markup.

Seit Aufgabe 4 ohne Rückfall: Telefon, E-Mail und Standorte sind Pflicht, die
Bewertungen sind wahlfrei — und zwar zusammen. Fehlt eine der drei Angaben,
erscheint der Balken gar nicht, statt „0 Bewertungen" zu zeigen. Profile ohne
Adresse verschwinden einzeln, statt als Symbol ins Leere zu führen. Vorher
fiel jedes leere Feld auf den Prototyp-Stand zurück, also auf eine Rufnummer
und 272 Bewertungen, die im Studio nirgends standen.

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

Der Startbestand ist eingespielt: elf Leistungen, die Einstellungen und die
Startseite — siehe `studio/seed/README.md`. Damit trägt die Collection, und
`leistungsliste.ts` hat seine Beispielliste verloren. Wer eine Leistung im
Studio löscht, sieht sie auch aus Tabelle, Menü und Fuß verschwinden.

## Wie die Inhalte an die Seite kommen

- `studio/schemaTypes/leistung.ts` — das Inhaltsmodell. Zugeschnitten auf die
  Abschnitte, die die Seite wirklich hat: Hero, Intro, Benefits, Kosten, FAQ.
- `web/src/lib/queries.ts` — die GROQ-Abfragen.
- `web/src/lib/leistungen.ts` — der Datenzugriff, seit Aufgabe 4 ohne
  Rückfall. Was das Dokument nicht trägt, erscheint nicht. Nur die Bilder
  fallen weiter auf die lokalen Motive zurück, und das entscheidet der
  Baustein, nicht die Datenschicht.
- `web/src/pages/leistungen/[slug].astro` — **eine** Route für alle
  Leistungsseiten. Eine zweite Leistung kostet nur noch ein Dokument im
  Studio, keinen Code.

## Was noch offen ist

- **Zehn der elf Leistungen sind ungepflegt.** Sie tragen Grunddaten und
  sonst nichts, ihre Seiten zeigen deshalb Hero, Stories, Magazin und
  Kontakt. Bis Aufgabe 4 sahen sie vollständig aus, weil der Rückfall den
  Inhalt von Veneers einsetzte — samt dessen Preisen. Was fehlt, ist Text,
  kein Code.
- Die Motive in der Zahnmaske (Standards) und die fünf Bilder im
  Standorte-Ring sind fest verdrahtet. Sie gehören eins zu eins an ihre
  Punkte bzw. an eine gestaltete Komposition; pflegbar zu machen ist je ein
  eigener Umbau, nicht ein Feld mehr.
- `og:url` fehlt in `Base.astro`, weil `site` in `astro.config.mjs` nicht
  gesetzt ist — die Domain steht noch nicht fest. Sobald sie da ist: `site`
  setzen und die Zeile ergänzen.

## Aufbau einer Leistungsseite

Die Reihenfolge entspricht der Vanilla-Vorlage `leistungen/veneers.html`:

| Abschnitt | Baustein | Inhalt aus |
| --- | --- | --- |
| Service-Hero | `[slug].astro` | CMS |
| Intro | `[slug].astro` | CMS |
| Benefits | `Benefits.astro` | CMS |
| Vorher/Nachher | `BeforeAfter.astro` | CMS |
| Statement | `[slug].astro` | CMS |
| In vier Schritten | `Steps.astro` | CMS |
| Transformation Stories | `Stories.astro` | CMS, aus dem Startseiten-Dokument |
| Kosten | `[slug].astro` | CMS |
| Feature-Zeilen | `Features.astro` | CMS |
| Magazin | `Magazine.astro` | Einstieg aus der Seite, Beiträge fest |
| FAQ | `Faq.astro` | CMS |
| Kontakt | `Contact.astro` | fest |

Jeder Abschnitt hängt an seinen eigenen Daten: Was das Dokument nicht trägt,
erscheint nicht. Die Patientenstimmen stehen im Startseiten-Dokument, weil es
dieselben sind wie dort — ein zweites Feld je Leistung liefe auseinander, und
niemand pflegt elf Mal dieselben fünf Zitate.

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

## Betrieb

### Publish erreicht die Website noch nicht

**Das fehlt noch und ist der wahrscheinlichste erste Support-Anruf.** Die
Website ist statisch; sie entsteht beim Build. Ohne Webhook wartet der Kunde
auf eine Änderung, die nie ankommt.

**Der Build Hook steht schon.** Angelegt, ausgelöst und geprüft: Ein POST
darauf antwortet mit 200 und startet einen Deploy („Deploy triggered by
hook"). Die Adresse:

```
https://api.netlify.com/build_hooks/6a736594a374ca00c47c1aa2
```

Was fehlt, ist die Gegenseite bei Sanity. Sie lässt sich nicht mit dem
Lesetoken anlegen — das Verwalten von Webhooks verlangt das Recht
`sanity.project.webhooks/read` und mehr, ein Viewer-Token hat es nicht. Das
ist die richtige Grenze und kein Mangel.

**sanity.io/manage** → Projekt `a6bjftwf` → API → Webhooks → *Create webhook*

| Feld | Wert |
|---|---|
| Name | `Netlify Build` |
| URL | die Adresse oben |
| Dataset | `production` |
| Trigger on | Create, Update, Delete — alle drei |
| Filter | leer |
| HTTP method | POST |

Danach die Probe: Im Studio etwas ändern und publizieren. Bei Netlify muss
innerhalb von Sekunden ein Deploy anlaufen. Falls nicht, steht unter dem
Webhook bei Sanity ein Protokoll mit der Antwort.

Der Hinweis im Studio, dass eine Veröffentlichung ein bis zwei Minuten
braucht, steht schon (`studio/components/PublishHinweis.tsx`).

### Umgebungsvariablen

| Name | Wo | Wofür |
|---|---|---|
| `PUBLIC_SANITY_PROJECT_ID` | `web/.env`, Netlify | Projekt |
| `PUBLIC_SANITY_DATASET` | `web/.env`, Netlify | Datensatz |
| `SANITY_API_READ_TOKEN` | `web/.env`, Netlify | Entwürfe für die Vorschau |
| `PUBLIC_SANITY_STUDIO_URL` | Netlify | Wohin Stega beim Klick springt |
| `SANITY_STUDIO_PREVIEW_URL` | Studio-Deploy | Wo die Website läuft |

**`SANITY_API_READ_TOKEN` trägt kein `PUBLIC_`.** Mit dem Präfix backte Astro
ihn ins ausgelieferte JavaScript, und ein Lesetoken für Entwürfe stünde im
Quelltext jeder Seite. Rechte: **Viewer** genügt — die Vorschau liest nur.

Bei Netlify gehört an dieser Variable der Haken **„Contains secret values"**.
Er setzt die Scopes von selbst auf Builds, Functions und Runtime und nimmt
Post processing heraus — genau richtig. Bei den beiden `PUBLIC_`-Variablen
gehört er NICHT gesetzt: Sie landen ohnehin im ausgelieferten JavaScript, und
als Secret markiert lassen sie sich nur nicht mehr nachlesen.

**Der Scope „Functions" muss bleiben.** `lib/vorschau.ts` liest den Token
zuerst über `process.env`, also zur Laufzeit der Funktion. Der Grund steht
dort ausführlich: Astro ersetzt `import.meta.env.X` beim Bauen durch den
damaligen Wert, auch im Servercode — gemessen, der Klartext steht im
Funktionsbündel unter `.netlify/` (in `dist/` dagegen in keiner einzigen
Datei). Ohne den Laufzeitzugriff wirkte ein Tokenwechsel erst nach einem
neuen Deploy, und man hielte einen kompromittierten Token für gewechselt,
während der alte weiterläuft.

### Builds bei Netlify und die Sichtbarkeit des Repositorys

Netlify baut bei **privaten** Repositories auf dem kostenlosen Plan nur
Commits von verifizierten Kontomitgliedern. Andernfalls:
„Build blocked: This commit is from an unrecognized Git contributor."

Das Repository ist deshalb **öffentlich**. Es enthält keine Zugangsdaten —
vor dem ersten Push geprüft, und `.env` ist seit jeher ignoriert. Die Inhalte
liegen ohnehin öffentlich lesbar in Sanity.

**Zwei Fallen dabei, beide teuer:**

Die Meldung führt in die Irre. Sie klingt nach der E-Mail-Adresse im Commit;
gemeint ist der GitHub-Account, über den gepusht wurde (im Deploy steht er
als `committer`). Die Commit-Adresse umzustellen bringt nichts, und den
GitHub-Account mit Netlify zu verknüpfen allein auch nicht.

**Netlify speichert die Sichtbarkeit beim Verbinden.** Stellt man das
Repository bei GitHub auf öffentlich, merkt Netlify das nicht — im Site-Objekt
steht weiter `public_repo: false`, und es blockt gegen den alten Stand. Über
die API lässt sich das Feld nicht setzen. Der einzige Weg ist *Unlink
repository* und erneut verbinden; dabei liest Netlify sie neu ein.

Wer das Repository wieder auf privat stellt, braucht Netlify Pro — oder muss
denselben Weg noch einmal gehen.

**Das Neuverbinden löscht die Build Hooks.** Danach steht die Adresse unten
nicht mehr, und der Sanity-Webhook zeigt ins Leere. Beides neu anlegen.

### Rollen

Der Kunde gehört als **Editor** eingeladen, nicht als Administrator. Ob die
Rolle im gebuchten Plan verfügbar ist, vorher prüfen: Bei manchen Plänen ist
Administrator die einzige Option, dann braucht es stattdessen eine kurze
schriftliche Absprache, was nicht angefasst wird.

### Für den Kunden

`ANLEITUNG.md` — eine Seite, deutsch, ohne Screenshots von Zuständen, die
sich ändern.
