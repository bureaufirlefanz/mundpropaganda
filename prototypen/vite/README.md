# Vite-Prototyp — Design-Stand

> **Eingefroren.** Astro + Sanity ist das Produkt (`web/`, `studio/`).
> Dieser Stand ist Archiv — siehe `CLAUDE.md` daneben. Was unten über
> „später in Webflow" und „kein CMS" steht, war der Stand von damals und
> gilt nicht mehr.

## Loslegen

```bash
npm install
npm run proto:dev
```

| Befehl | Zweck |
| --- | --- |
| `npm run proto:dev` | Dev-Server auf :5173 |
| `npm run proto:build` | Produktions-Build nach `prototypen/vite/dist/` |
| `npm run images` | `prototypen/vite/assets/raw/*` → responsive WebP/AVIF in `web/public/img/` |
| `npm run shots -- <pfad> <breite> <höhe>` | Screenshots der ganzen Seite nach `.shots/` |
| `npm run check` | Rauchtest: Konsolenfehler, tote Reveals, Überlauf, über drei Breakpoints |
| `npm run intro` | Daumenkino der Ladeanimation |
| `npm run takt` | wann beim Laden was passiert |
| `npm run erstbild` | das erste Bild, bevor die Module laufen |

`shots`, `intro`, `takt` und `erstbild` zielen über `MP_BASE` wahlweise auf den
Prototyp oder die Astro-App. Die Astro-App hat darüber hinaus eigene Befehle —
siehe `SANITY.md`.

Seiten: `/` · `/leistungen/veneers.html` · `/styleguide.html`

**Der Styleguide ist der Einstiegspunkt zum Weiterbauen.** Dort liegen alle
Bausteine mit ihren Zuständen und den Data-Attributen, über die sie
animiert werden.

## Aufbau

```
src/
  styles/
    tokens.css       Farben, Typo-Skala, Spacing, Radien, Motion — die einzige Quelle
    base.css         @font-face, Reset, Typo-Utilities, Layout-Primitives
    components.css   .c-*  wiederverwendbare Bausteine
    sections.css     .s-*  Seitenbausteine
  partials/          Handlebars-Partials, per {{> name }} eingebunden
  js/
    lib/gsap.js      Plugin-Registrierung, geteilte Defaults
    modules/         ein Modul je Verhalten; jedes prüft selbst, ob sein Markup da ist
assets/raw/          Quellbilder (unkomprimiert, aus Figma)
                     (die Bilder liegen bei web/public/img/)
scripts/             Bild-Pipeline, Screenshots, Rauchtest
```

Alle Seiten teilen sich ein JS-Bundle. Jedes Modul prüft beim Start, ob sein
Markup existiert — dadurch braucht keine neue Seite einen eigenen Einstiegspunkt.

## Eine neue Seite anlegen

1. HTML-Datei anlegen, `{{> head }}`, `{{> icons }}`, `{{> nav }}`, `{{> footer }}`
   einbinden (siehe `leistungen/veneers.html` als Vorlage).
2. Sections aus `sections.css` zusammenstecken.
3. Die Datei in `vite.config.js` unter `build.rollupOptions.input` eintragen —
   sonst landet sie nicht im Build.

## Bewegung

Animiert wird über Data-Attribute, nicht über neuen Code:

| Attribut | Wirkung |
| --- | --- |
| `data-reveal="up\|fade\|left\|right\|scale\|clip"` | Einblenden beim Scrollen |
| `data-reveal-delay="0.1"` | Verzögerung in Sekunden |
| `data-reveal-stagger="0.08"` | am Container; Kinder brauchen `data-reveal-child` |
| `data-split="lines\|words\|chars"` | Headline zeilen-/wort-/zeichenweise |
| `data-parallax="10"` | Bild läuft langsamer als sein Rahmen |
| `data-magnetic="0.3"` | Element zieht zum Cursor |
| `data-cursor-text="Lesen"` | Beschriftung im Custom-Cursor |

Alle Reveals teilen sich dieselbe Kurve (`expo.out`) und lange Laufzeiten.
Wer eine neue Section baut, sollte davon nicht abweichen — die Einheitlichkeit
der Bewegung trägt den Eindruck mehr als jeder einzelne Effekt.

Die Zuordnung ist verbindlich, nicht Geschmackssache:

- **`data-split="lines"` nur für Headlines und Display-Typo.** Bei Fließtext
  zerfällt der Absatz in einzeln aufsteigende Zeilen und wird unruhig.
- **`data-reveal="up"` für Fließtext, Cards und Listen** — der Block bewegt
  sich als Ganzes.
- **`data-reveal="left|right"` nur für Flächen und Bilder**, die eine
  Komposition schließen. Nicht für Text.
- **`data-highlight-marker-reveal`** ist ein Markenmoment und bleibt den
  Meta-Zeilen im Hero vorbehalten.
- **`data-split="chars"`** gehört allein der Wortmarke.

`?nosmooth` an die URL hängen schaltet Lenis ab — nötig für Screenshots und
zum Nachstellen von Fehlern, die nur mit nativem Scrollen auftreten.
Bei `prefers-reduced-motion: reduce` entfallen alle Bewegungen.

### Seitenwechsel

Column-Wipe: fünf Spalten fahren versetzt herunter, decken ab, und laufen auf
der Zielseite in derselben Richtung weiter aus dem Bild. Bewusst **ohne**
clientseitigen Router — die Seiten laden normal. Ein Container-Tausch (Barba)
würde bedeuten, jedes Modul bei jedem Wechsel neu aufzusetzen; der Effekt ist
derselbe, weil die Spalten während des Ladens abdecken.

Dass die Spalten auf der Zielseite ab dem ersten Bild abdecken, entscheidet
ein Inline-Skript in `partials/head.hbs` — es liest eine Markierung aus dem
`sessionStorage`. Das Modul selbst läuft erst nach dem ersten Bild und käme
dafür zu spät.

### Seitengrund

Zwei Ebenen, beide rein CSS: wandernde Lichtfelder auf `body::before/::after`
(64 s und 82 s, gegenläufig) und ein feines Korn als eingebettetes SVG. Zusammen
ergibt das Tiefe ohne sichtbaren Effekt. Bei `prefers-reduced-motion` stehen
die Felder still.

### Interaktive Sections

Drei Sections haben eigene Bedienlogik (Details im Styleguide):

- **Services-Tabelle** (`data-services`) — Bild-Preview am Cursor.
- **Standards-Liste** (`data-standards`) — Autoplay mit Fortschrittsbalken,
  Hover übernimmt und pausiert, das Bild in der Zahnmaske wechselt mit.
- **Story-Kartendeck** (`data-deck`) — Wischen, Buttons, Pfeiltasten.

### Zur Zahnmaske

`tooth-shape.svg` aus dem Figma ist **eine einzige, nach innen laufende
Spirale** — keine Silhouette. Gestrichen ergibt sie die komplette Spirale,
gefüllt nur Bänder. Die verwendete Maske (`web/public/svg/tooth-silhouette.png`)
ist deshalb aus dem Alphakanal des freigestellten Fotos abgeleitet. Wer die
Form ändern will, ändert dort — nicht am SVG.

## Bilder

`assets/raw/` enthält die Originale aus Figma (teils über 15 MB).
`npm run images` erzeugt daraus WebP und AVIF in mehreren Breiten; im Markup
bindet das `picture`-Partial sie mit `srcset`/`sizes` ein:

```hbs
{{> picture name="portrait-hero" widths="640,1024,1600,2200"
            alt="…" sizes="(max-width: 900px) 100vw, 50vw" }}
```

`eager="true"` nur für das LCP-Bild der jeweiligen Seite setzen — alles andere
lädt lazy. Aktueller Stand: 57 MB Quellmaterial → 7,8 MB über alle Größen.

## Übergang nach Webflow

- Jede Custom Property aus `tokens.css` wird eine Webflow-Variable.
- `.c-*`-Klassen werden Webflow-Components, `.s-*` werden Section-Symbole.
- Der Button ist zweiteilig (Pill + abgesetzter Pfeil) — als eine Component
  mit Varianten anlegen, nicht als zwei Elemente.
- Die GSAP-Module laufen unverändert im Webflow-Custom-Code, solange die
  Data-Attribute erhalten bleiben. Das ist der Grund, warum das gesamte
  Verhalten über Attribute statt über Klassen gesteuert wird.

## Bekannte Auslassungen

- Inhalte sind Platzhalter, nur teilweise aus dem Figma übernommen.
- Das Vorher/Nachher-Bildpaar ist simuliert (dasselbe Motiv, aufgehellt) —
  im Figma gibt es dafür kein echtes Paar.
- Kein CMS: Magazin-Cards und Leistungen sind statisch ausgeschrieben.
- Das Formular validiert clientseitig und versendet nichts.
