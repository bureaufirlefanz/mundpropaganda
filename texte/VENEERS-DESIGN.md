# Designbriefing Figma — Pillar Page „Veneers"

**Für:** Flo · **Stand:** 14.08.2026
**Gegenstück:** `VENEERS-PILLAR.md` (Umsetzung) · `VENEERS-TEXT.md` (Inhalt)

> Acht Dinge sind zu entwerfen. Zwölf der 22 Seitenabschnitte existieren bereits als gestaltete Bausteine und bleiben unangetastet.

---

## 1. Was du **nicht** designen musst

Diese Abschnitte sind gebaut, gestaltet und im Einsatz. Sie werden auf der Veneers-Seite verwendet, nicht neu entworfen:

| Abschnitt | Baustein |
|---|---|
| Hero | `ServiceHero.astro` |
| Was sind Veneers | `Intro.astro` |
| Arten (Textteil) | `Benefits.astro` |
| Ablauf in vier Schritten | `Steps.astro` |
| Haltung / drei Sätze | `Features.astro` — nur die Nummerierung entfällt |
| Vorher & Nachher | `BeforeAfter.astro`, mit Schieberegler |
| Patientenstimmen | `Stories.astro` |
| Magazin / Türkei-Beitrag | `Magazine.astro` |
| FAQ | `Faq.astro` + `Accordion.astro` |
| Warum Mundpropaganda | `Split.astro` oder `Experts.astro` |
| Kontakt mit Foto-Upload | `Contact.astro` |
| Zahnerhalt-Statement | `Statement.astro` |

**Ein Sonderfall, der Zeit spart:** `Compare.astro` ist eine fertige, gestaltete Vergleichstabelle — sie hängt heute nur an der Karriereseite. Wenn ihre Optik auf einer Leistungsseite trägt, brauchst du für **zwei** der geplanten Abschnitte (Arten-Vergleich und Alternativen-Matrix) gar nichts zu entwerfen. **Bitte zuerst anschauen und entscheiden.**

---

## 2. Ein Konflikt, der vor allem anderen geklärt gehört

`tokens.css` legt die Bewegungssprache fest:

> *„Die Kurven sind bewusst langsam-auslaufend (**kein Bounce**) — passt zum ruhigen, teuren Look."*
> `--e-out: cubic-bezier(0.22, 1, 0.36, 1)`

Der Osmo Section Dock ist standardmäßig **`motion = "bouncy"`**: `back.out(2.5)`, Überschwinger beim Indikator, Stauchen der Pille beim Labelwechsel.

Das ist ein direkter Widerspruch zur dokumentierten Motion-Sprache der Seite. Drei Möglichkeiten:

1. **Auf `"smooth"` schalten.** Die Vorlage hat den Schalter eingebaut (eine Zeile), alle Überschwinger und Stauchungen fallen weg, die Mechanik bleibt. Fügt sich ein.
2. **Bounce bewusst zulassen** — als einzige Ausnahme, weil der Dock ein Bedienelement ist und kein Inhalt. Dann bitte im Kopfkommentar begründen, so wie `Compare.astro` seine Abweichungen begründet.
3. **Eigene Kurve** zwischen beiden.

Ich rate zu **(1)**. Ein hüpfendes Element auf einer Seite, deren gesamte Bewegung ruhig ausläuft, liest sich als Fremdkörper — und das ist genau die Sorte Detail, die den „teuren Look" kippt.

**Das ist eine Designentscheidung, keine Codefrage.**

---

## 3. Was zu entwerfen ist

Nach Priorität. Jeder Punkt nennt, was der Code daraus braucht.

### 3.1 Prosa-Abschnitt ⭐ blockiert am meisten

Der Entwurf existiert bereits — Überschrift links, Fließtext rechts, Bild optional darüber. Es fehlen nur die Werte.

**Der Code braucht drei Zahlen:**
- Spaltenaufteilung im 12er-Raster: Überschrift / Text / Leerraum
- Satzbreite der Textspalte in `ch` — sie wirkt schmaler als die 68 ch, die `Post.astro` setzt, eher 55–60. Absicht oder Versehen?
- Abstand zwischen zwei Abschnitten: `--section-space` oder eigener Wert?

**Dazu:**
- Verhalten unter 1200 px und unter 1000 px (die beiden Schwellen, die `Post.astro` schon nutzt — bitte keine dritte einführen)
- Bild: Seitenverhältnis, Radius, Einzug gegenüber dem Satzspiegel
- Wo genau die Überschrift ansetzt: Oberkante des Textblocks oder erste Grundlinie?

Der Abschnitt kommt **8–10 Mal** auf der Seite vor. Alles, was hier unentschieden bleibt, multipliziert sich.

### 3.2 Section Dock

Feste Pille am unteren Bildrand, zeigt den aktuellen Abschnitt, klappt bei Hover (Desktop) oder Tap (Touch) zur Liste auf.

**Zu entwerfen:**
- Geschlossen: Pille mit Nummer + Titel. Höhe, Innenabstand, Radius (`--r-round`?), Fläche
- Offen: Liste mit bis zu 10 Einträgen, Indikator hinter dem aktiven Eintrag
- Zustände: Ruhe · Hover · aktiv · ausgeblendet (über dem Footer)
- Farbe: Osmo setzt Dunkel auf Hell. Auf `--c-grey` und auf `--c-dark` (`data-theme="dark"`) prüfen — der Dock schwebt über wechselnden Flächen
- Mobil: Breite, Abstand zur Unterkante, Verhalten mit `env(safe-area-inset-bottom)`
- **Ohne JavaScript** bleibt eine gewöhnliche Sprungmarkenliste stehen. Muss nicht schön sein, darf aber nicht kaputt aussehen.

**Nicht zu entwerfen:** die Bewegung selbst — die bringt die Vorlage mit, siehe §2.

### 3.3 Preistabelle

Vier Zeilen, vier Spalten: Art · Preis · Zahnabtrag · Haltbarkeit. Darunter zwei Textzeilen (Fußnote und Pflicht-Disclaimer).

**Zu entwerfen:**
- Desktop als Tabelle
- **Mobil als gestapelte Karten**, nicht horizontal scrollend — eine Preistabelle, die man wegscrollen muss, kostet Conversions
- Alle Beträge sind „ab"-Preise. Wie wird das gesetzt — „ab 1.200 €" im Wert, oder ein eigenes Label?
- Beträge tabellarisch (`tabular-nums`), rechtsbündig
- Der Disclaimer ist Pflichtfeld und muss lesbar sein, nicht Kleingedrucktes im Wortsinn

Das ist **das meistgesuchte Element der Seite.**

### 3.4 „Auf einen Blick"

Infobox direkt unter dem Hero. 4–6 Zeilen Label/Wert: Kosten · Dauer · Haltbarkeit · Krankenkasse · Ohne Abschleifen möglich?

Erst prüfen, ob `Facts.astro` die Form schon trägt. Wenn nicht: eigene Fläche, visuell abgesetzt, ohne Bild.

### 3.5 Quellen- und Hinweiskasten

Drei Varianten aus einer Form: `source` (Studienbeleg mit Link), `info` (GOZ-Erklärung), `warning`.

Kommt zweimal auf der Seite vor. Muss sich vom Fließtext absetzen, ohne wie ein Werbekasten zu wirken.

### 3.6 Autorenbox

Am Seitenende: Porträt, Name, Qualifikation, „fachlich geprüft von", Datum, Quellenliste.

**`Post.astro` hat das Porträt-Muster fertig** (48 px, rund, Name + Rolle darunter) — als Ausgangspunkt nehmen, um die Liste der Quellen erweitern.

### 3.7 CTA-Band

Schmales Zwischenmodul: Zeile, Satz, Doctolib-Button, Telefonnummer. Kommt zwei- bis dreimal vor.

Der `Button.astro` existiert mit Varianten. Vermutlich reicht Anordnung und Fläche.

### 3.8 Querschnittsgrafik „0,3 mm / 1,0 mm / Krone" 🎯

Keine Komponente, eine Zeichnung. Zahn im Querschnitt, drei Zustände nebeneinander: Non-Prep, Prep-Veneer, Krone — mit den abgetragenen Bereichen.

**Das ist der wertvollste einzelne Entwurf auf dieser Liste.** Die stärkste Angst der Zielgruppe ist „werden meine gesunden Zähne kaputtgemacht", und diese Grafik beantwortet sie in zwei Sekunden statt in drei Absätzen. Kein Berliner Wettbewerber hat sie.

Als SVG anlegen, dann geht sie direkt nach `public/svg/` und braucht keinen Durchlauf der Bildpipeline.

---

## 4. Systemgrenzen

Der Code kann nur bauen, was auf Tokens landet. `tokens.css` sagt dazu: *„Alles was hier steht ist die einzige Quelle der Wahrheit"* — und im Kopf: *„1:1 aus Figma-Variablen"*. **Wenn deine Figma-Variablen dieselben Namen tragen, ist der Handoff mechanisch.**

**Abstände** (nur diese): 8 · 12 · 16 · 24 · 32 · 40 · 64 · 80 · 112 · 160
Abschnittsabstand: `--section-space` `clamp(80, 8.1vw, 140)` · `-sm` `clamp(48, 4.8vw, 84)` · `-lg` `clamp(120, 11.6vw, 200)`

**Schriftgrade** (Referenz 1728 px): display 250 · display-2 125 · h1 70 · h2 = h3 40 · h5 24 · text-large 20 · text-main 18 · text-small 16 · label 12
⚠️ **Es gibt kein h4**, und h3 ist gleich h2. Wenn du eine Stufe zwischen 40 und 24 brauchst, ist das ein neuer Token — dann bitte bewusst und benannt.

**Radien:** 8 · 16 · 32 · rund
**Raster:** 12 Spalten, `--site-max` 1728, Rand `clamp(16, 2.78vw, 48)`, Gutter `clamp(16, 1.85vw, 32)`
**Breakpoints im Einsatz:** 1200 · 1000 · 640. Bitte keine vierte Schwelle.

**Farben:** brand `#ff84c8` · dark `#403229` · taupe `#d0bec3` · grey `#d6d6d6` (Standardgrund) · neutral-800 `#201d1d` · neutral-200 `#f4f4f4`

**Themes:** Abschnitte können über `data-theme` auf `dark`, `taupe` oder `light` umschalten. **Jeder neue Baustein sollte in mindestens zwei davon geprüft sein** — der Dock schwebt ohnehin über allen.

⚠️ **Zurückgenommener Text ist pro Fläche gerechnet, nicht geschätzt.** `--c-text-muted` ist auf Grau 75 %, auf Braun 65 %, auf Taupe 82 % — jeweils der Wert, ab dem WCAG 4.5:1 erreicht ist. **Auf einer neuen Fläche gilt keiner davon.** `Post.astro` musste für seine weiße Titelkarte genau deshalb eine eigene Abstufung setzen. Wenn du weiße Karten entwirfst: Wert nachrechnen, nicht übernehmen.

---

## 5. Was auch ohne Design schon laufen kann

Falls du parallel etwas anstoßen willst — diese fünf Punkte brauchen keinen einzigen Pixel:

| Aufgabe | Warum unabhängig |
|---|---|
| `toc.js` → `getLenis()` | Bugfix, `window.__lenis` ist in Produktion `undefined` |
| `Compare.astro` an `SERVICE_QUERY` anschließen | Baustein ist fertig gestaltet, es fehlt nur das Schemafeld |
| Schemafelder anlegen (`textSections`, `consentConfirmed`, `priceDisclaimer`, `author`) | Datenmodell, keine Optik |
| `StructuredData.astro` + Canonical + `site` | steht im `<head>`, unsichtbar |
| 301-Weichen in `netlify.toml` | `/praxisleistungen/…` → `/leistungen/…`, blockierend für den Livegang |

Das ist ungefähr ein Drittel der Umsetzung. **Und es hat einen zweiten Nutzen:** Wenn die Schemafelder stehen, kannst du in Figma gegen echte Datenstrukturen entwerfen statt gegen Blindtext — und die Preistabelle bekommt ihre vier Spalten aus dem Modell, nicht aus einer Annahme.

---

## 6. Wenn das Design steht

Zwei Wege in den Code:

**(a) Figma-MCP.** Ist in dieser Session über deinen Rechner erreichbar. Frame auswählen, Link schicken — dann lese ich Raster, Satzbreite, Abstände und Typo-Zuordnung aus der Quelle und schreibe sie als Token-Zuordnung in `VENEERS-PILLAR.md`, statt dass jemand sie abtippt.

**(b) Du nennst die Werte**, ich trage sie ein.

In beiden Fällen: **Der Handoff ist nur dann mechanisch, wenn die Figma-Variablen wie die Custom Properties heißen.** Wo ein Wert im Entwurf keinem Token entspricht, gibt es genau zwei richtige Antworten — auf den nächsten Token ziehen, oder einen neuen Token anlegen. Der Zwischenweg („nur hier mal 28 px") ist der, an dem Designsysteme auseinanderfallen.

---

## Kurzfassung

**Acht Entwürfe**, davon vier klein (Infobox, Quellenkasten, Autorenbox, CTA-Band).
**Zwei Entscheidungen vorab:** trägt `Compare.astro` auf einer Leistungsseite? Und: Bounce oder nicht?
**Ein Entwurf, der über den Rest hinausragt:** die Querschnittsgrafik.
**Ein Drittel der Umsetzung** kann parallel laufen.
