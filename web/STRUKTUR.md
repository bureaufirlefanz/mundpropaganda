# Aufbau der Astro-App

## Ordner

```
src/
├── layouts/Base.astro          Dokumentrahmen: head, Nav, Backdrop, Skripte
├── components/
│   ├── ui/                     Wiederverwendbar, seitenunabhängig
│   │   Button · Picture · CmsImage · Reviews · Icons · Nav · Footer
│   │   Panel · Accordion · Backdrop · Transition
│   │   Thread · ToothLines · ToothRings
│   └── sections/               Ein Seitenabschnitt, ein Baustein
│       Hero · ServiceHero · Split · Intro · Statement · Services
│       Standards · Gallery · Experts · Stories · Magazine
│       Benefits · BeforeAfter · Steps · Prices · Features
│       Faq · Contact
├── lib/                        Datenzugriff und Abfragen
└── styles/shared.css           s. u.
```

## Ein Baustein, eine Datei

Ein Baustein bringt sein Markup **und** seine Regeln mit. Wer ihn irgendwo
einbindet, bekommt beides; wer ihn ändert, ändert ihn überall. Das ist der
ganze Mechanismus — es braucht keine Registrierung und keinen Import von
Stilen daneben.

Daraus folgt die verbindliche Regel: **Seiten setzen zusammen, sie gestalten
nicht.** Eine Datei unter `pages/` holt Daten, wählt Bausteine und reicht
Props durch. Steht dort ein `<style>`-Block, ist das der Hinweis, dass ein
Baustein fehlt: sein Markup ließe sich woanders nicht wiederverwenden, ohne es
samt CSS zu kopieren.

Aktueller Stand: `index.astro` und `leistungen/[slug].astro` haben **keine
eigene Zeile CSS**. Die elf Zeilen in `Base.astro` sind der Rahmen selbst
(`main`), kein Baustein.

Zwei Dinge, die dabei leicht schiefgehen:

- **Fremdes Markup braucht `:global()`** — siehe unten. Ein Baustein darf die
  Innereien eines anderen nicht ansprechen, ohne es auszuschreiben.
- **Typen gehören nicht ins Frontmatter.** Eine `.astro`-Datei kann nur sich
  selbst exportieren. Gemeinsame Formen (`Frage`, `Schritt`, `Preis`,
  `FeatureZeile`) stehen deshalb in `lib/fixtures.ts` und werden von dort
  importiert.

## Stilebenen

Die Zuständigkeit ist geschichtet, nicht vermischt:

1. **`src/styles/tokens.css`** — die einzigen festen Werte im Projekt.
   Farben, Typo-Skala, Abstände, Radien, Bewegungsgrößen.
2. **`src/styles/base.css`** — Schriften, Reset, Typo-Hilfsklassen,
   Layout-Primitive (`.container`, `.grid`, `.section`, `.media`) und die
   Motion-Basis (`[data-reveal]`, Marker-Regeln).
3. **`src/styles/shared.css`** — was mehr als ein Baustein ausschreibt und
   keinem allein gehört: `.c-topline` und die Slider-Steuerung, die Gallery
   und Magazin teilen. Absichtlich kurz. Wächst die Datei, ist das das
   Zeichen, dass der Baustein eine eigene Komponente werden sollte.
4. **Komponentenstile** — im `<style>`-Block der jeweiligen `.astro`-Datei.
   Astro grenzt sie automatisch ab, dadurch kann eine Section ihre Regeln
   nicht mehr einer anderen unterschieben.

`components.css` und `sections.css` aus dem Prototyp sind hier **nicht**
eingebunden. Sie waren auf 1056 bzw. 2311 Zeilen gewachsen, in denen jede
Section jede andere überschreiben konnte — genau daraus sind mehrere Fehler
entstanden, etwa der deckende Hintergrund von `.section`, der das Korn
übermalte. Ihre Regeln liegen jetzt neben dem Markup, das sie betreffen.

Regel: Eine Komponente definiert **keine** eigenen Farb- oder Abstandswerte.
Sie greift ausschließlich auf Tokens zu. Steht ein Wert nicht als Token bereit,
gehört er dorthin — nicht in die Komponente.

### Zwei Fallen beim Abgrenzen

Astro hängt sein Scope-Attribut an **jeden** Teil eines Selektors:
`.a .b` wird zu `.a[data-astro-cid-x] .b[data-astro-cid-x]`. Daraus folgt:

- **Fremdes Markup braucht `:global()`.** Ein `<img>` aus `Picture.astro` oder
  ein `.c-btn` aus `Button.astro` trägt das Attribut der *einbindenden* Datei
  nicht. `.s-split__media img` greift deshalb ins Leere —
  `.s-split__media :global(img)` trifft. Dasselbe gilt für alles, was die
  Module zur Laufzeit anlegen: `.highlight-marker-line` (marker.js), die
  Slider-Punkte (gallery.js), die Zeilen von SplitText.
- **`.js` allein funktioniert nicht.** Ausgenommen vom Scoping sind nur Teile,
  die `html` oder `body` nennen. Aus `.js .s-hero__tooth` würde
  `.js[data-astro-cid-x] …` und träfe das `<html>` nie — der Zahn bliebe für
  immer unsichtbar. Deshalb steht dort `html.js .s-hero__tooth`.

Beides sind stille Fehler: es gibt keine Warnung, die Regel gilt einfach nicht.

### Startzustände gehören ins CSS, nicht in GSAP

Was erst animiert erscheinen soll, muss **schon im ersten Bild** verborgen
sein. Ein `gsap.set` in einem Modul ist dafür zu spät: das Bundle ist ein
Modul-Skript, läuft also nach dem Parsen des Dokuments, und `init` hängt
zusätzlich an `astro:page-load`. Das Stylesheet steht da längst — der Browser
hat die Seite fertig gezeichnet.

Deshalb gilt: **der verborgene Startzustand steht im CSS und hängt an
`html.js`, freigegeben wird er im Modul.** Betroffen sind heute
`[data-reveal]`, `[data-reveal-child]`, `[data-split]` (alle in `base.css`)
sowie `.s-hero__word`, `.s-hero__foot`, `.s-hero__scroll`, `.s-hero__tooth`
und `.c-nav__inner` in ihren Komponenten.

Zwei Dinge dazu sind leicht zu übersehen:

- **Die Klasse `js` muss synchron im `<head>` gesetzt werden**, nicht erst von
  `init.js`. Beim Seitenwechsel übernimmt der Router zudem die Attribute des
  eingehenden `<html>`-Elements und wirft sie dabei weg — `Base.astro` setzt
  sie in `astro:after-swap` nach.
- **Wer verbirgt, muss freigeben.** Bleibt ein Element hängen, sieht man es nur
  in dem Fall, den man gerade nicht testet: ohne Hero auf der Seite, oder mit
  „Bewegung reduzieren". `npm run web:check` prüft beides.

Der Fehler, aus dem diese Regel entstanden ist: beim ersten Aufruf zeichnet
der Browser Text nicht, solange die Schrift lädt — das verdeckte das Problem
vollständig. Mit warmem Cache entfällt die Sperre, und die Headline stand
sofort komplett da.

### Der Auftritt kommt zuerst, der Rest danach

`init()` läuft in drei Stufen (`src/js/init.js`):

1. **Sofort** — was den Auftritt trägt: Scroll, Navigation, Hero. Alles billig.
2. **Nach dem ersten Bild** (zwei geschachtelte `requestAnimationFrame`) —
   Reveals, Headlines, die interaktiven Sections. Zusammen rund 10 ms.
3. **Beim ersten Scrollen**, spätestens nach 2,5 s — der durchlaufende Pfad und
   das Neuvermessen aller Trigger. Zusammen rund 140 ms.

Der Grund für die Staffelung: solange der Hauptstrang belegt ist, zeichnet der
Browser nicht und ruft keinen Animationsframe auf. Die Hero-Timeline kann
fertig dastehen und trotzdem stillstehen — gemessen lag der erste gezeichnete
Frame bei 1388 ms, obwohl die Timeline seit 105 ms existierte. Genau das sieht
man als „die Animation feuert nicht": man erwischt sie erst, wenn sie schon
halb durch ist, und bei `expo.out` sind nach 10 % der Laufzeit bereits 46 % Weg
zurückgelegt — die Leiste steht dann praktisch.

Der mit Abstand teuerste Posten war `initThread`: die Tabelle, die Höhe auf
Strichlänge abbildet, wurde mit 900 Stützstellen aufgebaut, jede mit einem
`getPointAtLength()` und einem `matrixTransform()` — und das gleich zweimal,
weil `ScrollTrigger.refresh()` am Ende `onRefresh` erneut auslöste.

| | vorher | nachher |
| --- | --- | --- |
| `initThread` | 772 ms | 68 ms |
| `ScrollTrigger.refresh` | 256 ms | 69 ms |
| alles Übrige | ~11 ms | ~11 ms |

Behoben durch dreierlei: 240 statt 900 Stützstellen (der viewBox löst nicht
feiner auf), die Bildschirmabbildung einmal lesen statt je Stützstelle ein
neues `SVGPoint` zu erzeugen, und das doppelte Messen entfernen.

Wortmarke in Bewegung, gemessen mit `npm run takt`:

| | vorher | nachher |
| --- | --- | --- |
| erster Aufruf | 1600 ms | 191 ms |
| Reload, warmer Cache | 1415 ms | 104 ms |

Wer einen neuen Baustein ergänzt, hängt ihn in Stufe 2 — es sei denn, er
gehört sichtbar zum Auftritt (Stufe 1) oder kostet zweistellige Millisekunden
und wird erst beim Scrollen gebraucht (Stufe 3). Gefahrlos ist das, weil jeder
Baustein seinen verborgenen Startzustand im CSS hat (s. o.): ein paar Frames
früher oder später ändert am Bild nichts.

**`requestIdleCallback` ist hier die falsche Wahl** und war ein Zwischenschritt,
der nicht getragen hat: es feuert schon nach wenigen Millisekunden „Ruhe", und
ein Block von 140 ms überzieht sein Zeitfenster ohnehin — der Aussetzer landete
dadurch exakt dort, wo die Leiste losfahren soll.

Verwandt, aber eine eigene Falle: **`document.fonts.ready` ist die falsche
Marke, und `document.fonts.load()` ist es auch**, wenn man es zu spät ruft —
beide warten darauf, dass die *ganze* Sammlung fertig ist. Gefragt ist
`document.fonts.check()`: „kann ich mit diesem Schnitt jetzt messen?".
Gemessen stand die Wortmarken-Schrift nach 92 ms bereit, während
`load()` erst nach 872 ms erfüllte. Die Begründung steht ausführlich in
`src/js/lib/fonts.js`.

### Was noch gekoppelt ist

`base.css` nennt in einer Sammelregel einige Section-Klassen
(`.s-split__media`, `.s-experts__media`, `.s-gallery__item`, …), um ihnen eine
eigene Compositing-Ebene zu geben. Die Regel bleibt dort, weil `base.css` mit
dem Prototyp geteilt wird. Sie ist harmlos — sie setzt nur
`transform: translateZ(0)` — aber sie ist der letzte Rest von Section-Wissen
in der globalen Ebene.

## Prüfen

```bash
npm run web:check    # Typen + Rauchtest über drei Breakpoints (Dev-Server nötig)
npm run web:styles   # Stil-Abgleich gegen einen gesicherten Stand (Build nötig)
npm run erstbild     # zeigt das erste Bild, bevor die Module laufen (Build nötig)
npm run intro        # Daumenkino der Ladeanimation (Build nötig)
npm run takt         # wann passiert was beim Laden (Build nötig)
```

`web:styles` nimmt für jedes Element im Dokument die gerechneten Werte und
seine Position auf und vergleicht sie mit einem früheren Stand — gedacht für
Umbauten am CSS, bei denen sich am Ergebnis nichts ändern soll. Gemessen wird
ohne JavaScript gegen den Build; sonst mischen sich GSAPs Inline-Stile und der
Zeitpunkt, zu dem die Module gelaufen sind, in den Vergleich.

## Animationen

Bleiben unverändert: die Module in `../src/js/` werden über `data-`Attribute
angesteuert. Eine Komponente bringt ihr Attribut mit, das Modul findet sie.
Kein Framework, keine Hydration, keine Lebenszyklen.

`../src/js/init.js` hält die Modulliste, `main.js` daneben ergänzt für den
Prototyp die globalen Stylesheets und den Selbststart. Die Astro-App bindet
`init.js` ein und ruft es bei jedem `astro:page-load` erneut auf — nach einem
Seitenwechsel muss jedes Modul neu anlaufen.

Verbindlich, wie im Styleguide festgelegt:

- `data-split="lines"` — nur Headlines und Display-Typo
- `data-reveal="up"` — Fließtext, Karten, Listen
- `data-reveal="left|right"` — nur Flächen und Bilder
- `data-highlight-marker-reveal` — allein die Meta-Zeilen im Hero
