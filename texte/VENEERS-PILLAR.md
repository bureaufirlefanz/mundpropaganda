# Briefing: Pillar Page „Veneers" — Gerüst und neue Bausteine

**An:** Claude Code · **Repo:** `Mundpropaganda/web` (Astro 5 + Sanity) · **Stand:** 14.08.2026
**Textfassung:** `VENEERS-TEXT.md` nebenan — wird noch überarbeitet, ist nicht final

> **Auftrag in einem Satz:** Das Gerüst für textlastige Leistungsseiten bauen — Section Dock, Prosa-Template, sechs kleine Bausteine — und die Veneers-Seite darauf stellen. Der Text ist nicht final; **Struktur und Datenverträge sind das Ziel**, nicht die Formulierungen.

---

## 0. Bevor du anfängst

**Was geprüft ist.** Dieses Briefing wurde gegen den Code geschrieben, nicht ins Blaue: `CLAUDE.md`, `STRUKTUR.md`, `package.json`, `astro.config.mjs`, `layouts/Base.astro`, `templates/Service.astro`, `templates/Post.astro`, `lib/queries.ts`, `lib/services.ts`, `lib/table-of-contents.ts`, `lib/image-widths.json`, `components/ui/TableOfContents.astro`, `components/ui/Picture.astro`, `components/sections/Compare.astro`, `js/init.js`, `js/lib/gsap.js`, `js/modules/toc.js`, `js/modules/scroll.js`, `styles/tokens.css`, `dist/leistungen/veneers/index.html` (Build vom 12.08.).

**Was nicht geprüft ist.** `studio/` liegt als Schwesterordner neben `web/` und war nicht zugänglich. **Alle Schemaaussagen unten sind aus `queries.ts` rückgeschlossen.** Bevor du ein Feld anlegst: im Studio nachsehen.

**Lies zuerst `STRUKTUR.md`.** Es ist keine Zierde, es sind die Hausregeln, und dieses Briefing setzt sie voraus. Die vier, die hier am häufigsten scharf werden:

1. **Seiten komponieren, sie gestalten nicht.** Ein `<style>` unter `pages/` heißt: ein Baustein fehlt.
2. **Fremdes Markup braucht `:global()`.** Astro hängt sein Scope-Attribut an _jeden_ Selektorteil. Alles aus `PortableText`, `Picture.astro`, `Button.astro` oder zur Laufzeit Erzeugtes trägt es nicht. Stiller Fehler, keine Warnung.
3. **`html.js`, nie ein nacktes `.js`.** Sonst wird daraus `.js[data-astro-cid-…]` und trifft `<html>` nie.
4. **Verborgene Startzustände gehören ins CSS, nicht in GSAP.** Ein `gsap.set` im Modul läuft nach dem ersten Bild — das Element blitzt auf. CSS versteckt, das Modul löst.

Und: **keine eigenen Farb- oder Abstandswerte in Komponenten.** Nur Tokens. Fehlt einer, gehört er in `tokens.css`.

---

## 1. Vier Funde, die vorab geklärt gehören

### 1.1 Bug: `window.__lenis` ist in Produktion `undefined`

`js/modules/toc.js:94` liest `window.__lenis`. `js/modules/scroll.js:37` setzt das aber nur unter `if (import.meta.env.DEV)`.

In der Auslieferung steigt der Klick-Handler damit sofort aus: kein `setActive(id)`, kein `history.replaceState`, kein `offset: -120`. Es _funktioniert_ trotzdem, weil `initAnchors()` alle `a[href^="#"]` global abfängt — nur mit `offset: -100` und ohne sofortige Hervorhebung.

`scroll.js` exportiert `getLenis()` genau dafür. **Bitte `toc.js` darauf umstellen** und im neuen Dock von vornherein `getLenis()` verwenden. Fünf Minuten, unabhängig vom Rest.

### 1.2 Platzhalter-FAQ im Build

Im gebauten HTML steht: _„Wie funktioniert das alles?" — „Alles funktioniert immer sehr gut"_. Das ist Redaktionsarbeit im Studio, kein Code — bitte nur melden.

### 1.3 Falsche Preise in Sanity

Sanity hält aktuell 890 € / 950 € / 190 €. **Richtig sind die Werte der Live-Seite, und zwar als „ab"-Preise:**

| Art                  | Preis                                                                        |
| -------------------- | ---------------------------------------------------------------------------- |
| Komposit-Veneer      | ab 450 € pro Zahn                                                            |
| Keramikveneer (Prep) | ab 1.200 € pro Zahn (Einzelzahn mit hohem ästhetischen Anspruch: ab 1.500 €) |
| Non-Prep-Veneer      | ab 1.400 € pro Zahn                                                          |
| Mock-up              | ab 450 € pro Kiefer                                                          |

Auch das ist Redaktionsarbeit — aber es betrifft das Datenmodell: **`pricing` braucht ein `from`-Flag oder die Preise tragen das „ab" im Feld.** Siehe §5.7.

### 1.4 „Ein Leben lang" muss raus

Steht zweimal im Build. Erfolgsversprechen sind nach HWG unzulässig, und fachlich ist es falsch (Beier et al., Med Uni Innsbruck: 93,5 % nach 10, 78,5 % nach 20 Jahren). Ersatztext liegt in `VENEERS-TEXT.md`. Redaktionsarbeit — melden, nicht selbst ändern.

---

## 2. Was gebaut wird

| #   | Baustein                                                | Art         | Aufwand    | Blockiert durch                |
| --- | ------------------------------------------------------- | ----------- | ---------- | ------------------------------ |
| 1   | `ui/SectionDock.astro` + `js/modules/section-dock.js`   | neu         | mittel     | **nichts**                     |
| 2   | `toc.js` → `getLenis()`                                 | Fix         | 5 min      | nichts                         |
| 3   | `sections/Compare.astro` an `SERVICE_QUERY` anschließen | Anschluss   | sehr klein | Schemafeld                     |
| 4   | `sections/Prose.astro`                                  | neu         | mittel     | Figma-Werte + Schema           |
| 5   | `sections/QuickFacts.astro`                             | neu         | klein      | prüfen ob `Facts.astro` reicht |
| 6   | `ui/SourceNote.astro`                                   | neu         | klein      | —                              |
| 7   | `ui/AuthorNote.astro`                                   | neu         | klein      | `person`-Referenz im Schema    |
| 8   | `sections/CtaBand.astro`                                | neu         | klein      | —                              |
| 9   | `sections/Prices.astro` erweitern                       | Erweiterung | klein      | Schemafelder                   |
| 10  | `ui/StructuredData.astro` + Canonical                   | neu         | mittel     | `site` in `astro.config.mjs`   |

**Reihenfolge: 1 → 2 → 3 → (Schemaentscheidung) → 4 → 5–8 → 9 → 10.**
Nach **1** und nach der Schemaentscheidung bitte innehalten.

---

## 3. Baustein 1 — Section Dock

Ein festes Pillenmenü am unteren Bildrand, das den aktuellen Abschnitt zeigt und auf Hover/Tap zur Liste aufklappt. Die Vorlage ist Osmos „Section Anchor Dock" (HTML/CSS/JS liegt bei Flo).

### 3.1 Präzedenzfall

`components/sections/Compare.astro` **ist bereits eine übernommene Osmo-Vorlage.** Der Kopfkommentar dort ist die Vorlage für dein Vorgehen: Mechanik, Klassennamen und ARIA-Rollen bleiben; abgewichen wird nur bei Gestaltung (Tokens statt Stripe-Optik) und Überschriftenebene (h3 statt h4, sonst übersprungener Rang, WCAG 1.3.1) — **und beide Abweichungen stehen als Kommentar im Kopf der Datei.**

Genauso hier: **`data-`-Attribute, Timeline-Struktur, Eases, `rect`-Objekt, `hopIndicator`, `swapLabel` bleiben wörtlich.** Nicht refactoren, nicht „verbessern".

### 3.2 Die sieben Anpassungen

1. **Keine CDN-Skripte.** GSAP liegt als Abhängigkeit vor, gleiche Version (`^3.15.0`). → `import { gsap, ScrollTrigger } from "../lib/gsap.js"`
2. **`gsap.registerPlugin(ScrollTrigger)` streichen.** `js/lib/gsap.js` registriert zentral — _„sonst registriert jedes Modul erneut und wir bezahlen das mit Bundle-Größe und doppelten Tickern."_
3. **Farben → Tokens:**

   | Osmo                     | →                                                                                      |
   | ------------------------ | -------------------------------------------------------------------------------------- |
   | `#161c33`                | `var(--c-dark)`                                                                        |
   | `#e9ecf6`                | `var(--c-grey)` oder `var(--c-neutral-200)` — Designentscheidung                       |
   | `#161c338c`              | `var(--c-text-muted)`                                                                  |
   | `#fff` (aktiver Link)    | `var(--c-grey)` oder `var(--c-white)`                                                  |
   | `rgba(255,255,255,0.6)`  | `color-mix(in srgb, var(--c-grey) 65%, transparent)`                                   |
   | `1.5em` / `100em` Radius | `var(--r-round)`                                                                       |
   | `z-index: 100`           | `var(--z-sticky)` — **nicht** `--z-nav`, der Dock darf die Navigation nicht überlagern |
   | `bottom: 2em`            | `var(--sp-4)` + `env(safe-area-inset-bottom)`                                          |

   Die `em`-Innenabstände darf die Vorlage behalten — sie skalieren die Pille an ihrer eigenen Schriftgröße, das ist Teil der Mechanik.

4. **Klick über Lenis**, via `getLenis()` (nicht `window.__lenis`, s. §1.1).
5. **Phase 2 in `init.js`**, neben `initToc()`. `STRUKTUR.md`: _„Wer einen neuen Baustein hinzufügt, hängt ihn in Phase 2."_
6. **Aufräumen.** Die Vorlage hängt `resize`, `keydown` und `click` an und entfernt sie nie. `init()` läuft bei **jedem** Seitenwechsel über `astro:page-load` erneut → die Listener stapeln sich. `toc.js` macht es vor: Aufräumfunktion zurückgeben. Die ScrollTrigger deckt `astro:before-swap` in `Base.astro` schon ab, die `document`-Listener nicht.
7. **`DOMContentLoaded`-Selbststart am Dateiende streichen.** Widerspricht dem Modulmuster.

### 3.3 Komponente

`src/components/ui/SectionDock.astro` — `ui/`, nicht `sections/`: seitenunabhängig, dieselbe Kategorie wie `TableOfContents.astro`.

```ts
interface Props {
  headings: Heading[]; // aus lib/table-of-contents.ts
  label?: string; // aria-label, Vorgabe "Auf dieser Seite"
}
```

Die Nummer (`01`, `02`) entsteht aus dem Index, sie steht nicht in den Daten.

**Verborgener Startzustand ins CSS**, nicht in GSAP:

```css
html.js .c-section-dock {
  opacity: 0;
  transform: translateY(40%);
}
```

Das Modul löst ihn. Ohne JavaScript bleibt eine gewöhnliche Sprungmarkenliste stehen, die vollständig funktioniert — genau wie `.c-toc`. Deshalb hängt der Startzustand an `html.js`.

**`:global()`** für alles, was `swapLabel()` zur Laufzeit klont.

**Ausblenden über dem Footer:** `data-section-dock-hide` an `Footer.astro`.

**Abschnitte brauchen `scroll-margin-top`** — `Post.astro` setzt bereits `calc(var(--nav-height, 96px) + var(--sp-4))`. Denselben Wert verwenden.

### 3.4 Verhältnis zum bestehenden `.c-toc`

`ui/TableOfContents.astro` bleibt und gehört weiter zu `Post.astro`. Der Dock ist eine **zweite Darstellung derselben Daten** für die Leistungsseiten. Nicht ersetzen, nicht beides auf einer Seite.

**Erste Testfläche: `Post.astro`** — dort läuft `headingsFrom()` schon, du brauchst kein neues Schema, um den Dock zu prüfen. (Auf Beitragsseiten dann `.c-toc` **oder** Dock, nicht beides — für den Test reicht ein Flag.)

**Höchstens ~10 Einträge**, sonst wird die aufgeklappte Pille zu hoch. Braucht sie doch mehr: `.c-toc` löst das bereits mit `max-height` + `keepLinkInView()` in `toc.js` — die Mechanik ließe sich übernehmen.

---

## 4. Die offene Schemaentscheidung

`service` ist **keine** Portable-Text-Seite, sondern eine feste Komposition typisierter Abschnitte (`intro`, `benefits`, `pricing`, `faq`, `beforeAfter`, `statement`, `steps`, `features`). `Service.astro` prüft je Abschnitt „ganz oder gar nicht" — eine begründete Entscheidung (Aufgabe 4, der `mitRueckfall()`-Vorfall). **Nicht nebenbei kippen.**

Die Pillar Page braucht zusätzlich ~2.000 Wörter Prosa. Der Entwurf zeigt dafür: **Überschrift links, Fließtext rechts, optional ein Bild darüber.**

Das schließt einen flachen Portable-Text-Strom praktisch aus: `astro-portabletext` liefert `h2, p, p, h2, p, p, …`, und daraus „Überschrift links, ihre Absätze rechts" zu bauen hieße, den Strom beim Rendern in Gruppen zu schneiden — was still bricht, sobald jemand im Studio einen Absatz vor die erste Überschrift setzt.

**Empfehlung:**

```ts
// in service, zusätzlich zu den bestehenden Abschnitten
textSections: [{
  heading  string
  body     portableText   // Absätze, Listen, Links
  image    image?         // optional, über dem Abschnitt
}]
```

Damit steckt die Gruppierung im Modell statt in einer Render-Heuristik, der Reichtext bleibt Reichtext (die internen Links brauchen Portable-Text-Annotationen), und die Redaktion sieht im Studio dieselbe Einheit wie auf der Seite.

**Anbindung an Dock/TOC:** eine `headingsFromSections()` neben `headingsFrom()` in `lib/table-of-contents.ts`, gleiche `Heading[]`-Schnittstelle, **gleiche `idFrom()`**. Der Kopfkommentar dort schützt genau das: _„Die Kennung entsteht an genau einer Stelle."_ `withHeadingIds()` entfällt hier — die Kennung wandert als Prop an die Komponente, was einfacher ist als der `_tocId`-Umweg.

**Das ist eine Entscheidung für Flo, und `studio/` ist nicht freigegeben. Bitte nachfragen, bevor du Schema anfasst.**

---

## 5. Die neuen Bausteine

### 5.1 `sections/Prose.astro`

**Vorher prüfen: `sections/Split.astro` (8,9 KB)** — dem Namen nach ein zweispaltiger Abschnitt mit Medium. Wenn das Raster dort schon liegt, ist Erweitern günstiger als Neubau.

```ts
interface Props {
  id: string; // Sprungmarke aus idFrom()
  heading: string;
  body: PortableTextBlock[];
  image?: CmsImage;
  level?: 2 | 3; // Vorgabe 2
}
```

```astro
<section class="s-prose container" id={id} data-toc-target={id}>
  {image && <figure class="s-prose__media">…</figure>}
  <div class="s-prose__grid">
    <h2 class="s-prose__title" data-split="lines">{heading}</h2>
    <div class="s-prose__body" data-reveal="up">
      <PortableText value={body} />
    </div>
  </div>
</section>
```

- **`id` auf `<section>`, nicht auf der Überschrift** — der Sprung landet damit über dem Bild.
- **Ein Rasterelternteil.** Kein `display: contents`, kein Subgrid-Trick — beides bricht die Reihenfolge für Tastatur und Vorlesegerät.
- **`:global()`** für alles aus `PortableText`. Die Fließtextregeln aus `Post.astro` ab Zeile 403 sind der richtige Ausgangspunkt.
- **`level`-Prop statt hart kodiertem `h2`** — ein Cluster-Artikel braucht denselben Baustein womöglich als h3. Übersprungener Rang = WCAG 1.3.1, genau der Grund für die h4→h3-Abweichung in `Compare.astro`.
- **Bindung nach Styleguide:** `data-split="lines"` nur Headlines, `data-reveal="up"` Fließtext, `data-reveal="left|right"` nur Flächen und Bilder.
- **Umbruch:** einspaltig, Überschrift über ihrem Text. Eine der bestehenden Schwellen aus `Post.astro` übernehmen (1200 px / 1000 px), keine dritte einführen.

⚠️ **Noch nicht anfangen.** Spaltenaufteilung im 12er-Raster und Satzbreite der Textspalte stehen nicht fest — sie wirkt schmaler als die 68 ch aus `Post.astro`, eher 55–60. Kommt aus Figma. **Nicht schätzen.**

### 5.2 `sections/QuickFacts.astro`

`quickFacts[]{ label, value }`, 4–6 Zeilen, kein Bild. Erst prüfen, ob `sections/Facts.astro` + `js/modules/facts.js` die Form tragen.

### 5.3 `ui/SourceNote.astro`

Quellen-/Hinweiskasten für Studienbeleg und GOZ-Erklärung. `variant: "source" | "info" | "warning"`, Titel, Text, optional Link.

### 5.4 `ui/AuthorNote.astro`

Autor:in, fachliche Prüfung, Datum der letzten Aktualisierung, Quellenliste. **`Post.astro` ab Zeile 115 hat das Porträt-Muster fertig** (48 px, rund, `CmsImage`) — übernehmen. Braucht `author`/`reviewedBy` als `person`-Referenz und `lastReviewed` im `service`-Schema.

> Größter ungenutzter Hebel der Seite: auf keiner der 22 analysierten deutschen Veneer-Seiten gibt es eine vollständige Autorenbox. Veneers sind YMYL-Content.

### 5.5 `sections/CtaBand.astro`

Schmaler Zwischen-CTA. `headline`, `text`, `action`. Das `LINK`-Fragment in `queries.ts` und `lib/navigation.ts#linkZiel()` existieren — verwenden, keine Pfade als Text.
Doctolib-Button + `tel:`-Link, auf Desktop ebenfalls sichtbar.

### 5.6 `Compare.astro` anschließen — **bester Aufwand-Ertrag**

Der Baustein ist fertig und generisch (`--columns-in-view`), hängt aber nur an `CAREERS_QUERY`. Es fehlen nur die Felder in `SERVICE_QUERY`:

```
comparisonColumns[]{ name, emphasised }
comparisonRows[]{ name, values[]{ kind, text } }
comparisonNote
```

Die Veneers-Seite braucht **zwei** Instanzen (Arten-Vergleich, Alternativen-Matrix) — also ein Array von Vergleichen, nicht ein einzelnes Feld.

### 5.7 `Prices.astro` erweitern

Heute `pricing[]{ name, price }`. Nötig:

```
pricing[]{ name, price, reduction, durability }
priceNote          // "Einzelzahn mit hohem ästhetischen Anspruch: ab 1.500 €"
priceDisclaimer    // PFLICHTFELD — Validation-Error wenn leer
```

- Mobil **gestapelte Karten**, nicht horizontal scrollend.
- `font-variant-numeric: tabular-nums` auf die Beträge.
- Alle Preise sind **„ab"-Preise** — entweder ein `from: boolean` je Zeile oder das „ab" steht im Wert. Das ist keine Kosmetik: Festpreise, die den GOZ-Steigerungsfaktor aushebeln, sind für Zahnärzte unzulässig, und der Disclaimer trägt das ab.

### 5.8 `ui/StructuredData.astro`

`Base.astro` liefert heute **kein JSON-LD und kein Canonical.** Beides fehlt sitewide.

```
Dentist (LocalBusiness)  ← aus settings.locations[], zwei Standorte
BreadcrumbList           ← Startseite > Leistungen > Veneers
MedicalWebPage           ← specialty: Dentistry, about: MedicalProcedure,
                            reviewedBy: → Person, lastReviewed
Person                   ← Autor:in
```

Baumuster: so wie `Base.astro` die Website-Angaben über `loadSettings()` selbst holt.

**Ausdrücklich nicht bauen:**

- **`FAQPage`** — Google hat FAQ-Rich-Results am 07.05.2026 abgeschaltet, im Juni aus dem Rich Results Test entfernt, im August den API-Support beendet. Der FAQ-_Inhalt_ bleibt und ist das wertvollste Modul für KI-Extraktion; nur das Markup entfällt.
- **`Review`/`AggregateRating`** — wer die Bewertungen über sich selbst kontrolliert, ist für Sterne-Snippets nicht qualifiziert. `settings.reviewsAverage/-Count` sichtbar auszugeben ist richtig, sie zu markupen nicht.
- **`llms.txt`** — Serverlog-Studie über 900 Domains (Sept 2025 – Apr 2026): 1.227 Abrufe, davon null von GPTBot, ClaudeBot, PerplexityBot oder Google-Extended. Google ignoriert die Datei.

**Zusätzlich melden (nicht ungefragt umsetzen):**

- `site` fehlt in `astro.config.mjs` — solange, gibt es kein `og:url` und kein absolutes Canonical. Der Kommentar in `Base.astro` nennt das als bewusste Zwischenlösung.
- 301-Weichen in `netlify.toml`: der Relaunch ändert `/praxisleistungen/veneers-berlin/` → `/leistungen/veneers`. Gilt für alle Leistungsseiten und die 18 Kiez-Seiten der alten Site. Eigener Task, aber **blockierend für den Livegang**.

---

## 6. Bilder

**Zwei Wege, nicht austauschbar:**

|         | `Picture.astro`                           | `CmsImage.astro`    |
| ------- | ----------------------------------------- | ------------------- |
| Quelle  | `public/img/`, lokale Pipeline            | Sanity CDN          |
| Aufruf  | `name="lab-veneers"`                      | `source={feld}`     |
| Breiten | aus `lib/image-widths.json`               | `widths={[…]}`      |
| Wofür   | gestaltete Motive, Platzhalter, Rückfälle | alles Redaktionelle |

⚠️ **`Picture.astro` wirft einen Build-Fehler bei unbekanntem Namen** — bewusst, mit Begründung im Kopfkommentar (ein `srcset` bot eine Breite an, die die Pipeline nie erzeugt hatte; 404, leere Stelle, ausgerechnet auf der Veneers-Seite).

**Für Platzhalter also nur Namen aus `image-widths.json`:**
`abstract-01/02` · `experten` · `lab-veneers` · `motion-01…04` · `portrait-hero` · `portrait-tooth-mask` · `praxis-01/02/03` · `smile-portrait` (nur 563 px) · `story-portrait-01/02` · `teeth-macro` · `teeth-macro-after` · `tooth-3d` · `treatment-01/02/03`

⚠️ **`treatment-02` hat nur 1920 px** — nie eine 2200er Stufe anfordern.

**Belegung der neun Bildplätze:**

| Abschnitt      | Platzhalter                            | Anmerkung                                                                         |
| -------------- | -------------------------------------- | --------------------------------------------------------------------------------- |
| Hero           | CMS, Rückfall `portrait-hero`          | `eager`, **LCP-Element**                                                          |
| Abschleifen    | `teeth-macro`                          | Ziel: Querschnittsgrafik als SVG in `public/svg/` — dann kein Pipeline-Lauf nötig |
| Mock-up        | `treatment-01`                         | Ziel: eigene Aufnahme                                                             |
| Ablauf ×4      | `treatment-01/02/03`, `lab-veneers`    | s. Warnung oben                                                                   |
| Vorher/Nachher | `teeth-macro` / `teeth-macro-after`    | CMS, mit `consentConfirmed`                                                       |
| Stimmen        | `story-portrait-01/02`                 | vorhanden                                                                         |
| Warum wir      | `lab-veneers`, `experten`, `praxis-03` | vorhanden                                                                         |
| Autorenbox     | `person.image`                         | 48–64 px, rund                                                                    |

Alles unterhalb des Hero: `loading="lazy"`, `decoding="async"`.

---

## 7. Seitengerüst

Die Reihenfolge der Abschnitte in `Service.astro`. **B** = Baustein, ⚓ = im Dock.

| #   | Abschnitt                         | B                                 | ⚓  |
| --- | --------------------------------- | --------------------------------- | --- |
| 00  | Hero                              | `ServiceHero` ✓                   |     |
| 01  | Auf einen Blick                   | `QuickFacts` **neu**              |     |
| 02  | Was sind Veneers                  | `Intro` ✓                         | ⚓  |
| 03  | Was Veneers kosten                | `Prices` ✳ erweitern              | ⚓  |
| 04  | Arten im Vergleich                | `Compare` ✳ anschließen           | ⚓  |
| 05  | Müssen Zähne abgeschliffen werden | `Prose` **neu**                   | ⚓  |
| 06  | Das Mock-up                       | `Prose` **neu**                   | ⚓  |
| 07  | Ablauf in vier Schritten          | `Steps` ✓                         | ⚓  |
| 08  | CTA I                             | `CtaBand` **neu**                 |     |
| 09  | Haltung: wie hier gearbeitet wird | `Features` ✓ _Nummerierung raus_  |     |
| 10  | Vorher & Nachher                  | `BeforeAfter` ✓                   | ⚓  |
| 11  | Haltbarkeit                       | `Prose` + `SourceNote`            | ⚓  |
| 12  | Nachteile, wann wir abraten       | `Prose`                           |     |
| 13  | Krankenkasse, GOZ                 | `Prose` + `SourceNote`            | ⚓  |
| 14  | Veneers aus der Türkei            | `Magazine` ✓ _funktioniert schon_ |     |
| 15  | Alternativen-Matrix               | `Compare` (2. Instanz)            | ⚓  |
| 16  | Patientenstimmen                  | `Stories` ✓                       |     |
| 17  | Pflege im Alltag                  | `Prose`                           |     |
| 18  | Warum Mundpropaganda              | `Split`/`Experts` ✓ prüfen        |     |
| 19  | FAQ                               | `Faq` ✓ 4 → 12 Fragen             | ⚓  |
| 20  | Autorenbox                        | `AuthorNote` **neu**              |     |
| 21  | Kontakt                           | `Contact` ✓                       |     |

**Zwölf bestehende Abschnitte, neun neue.** Zu 09: `steps` und `features` tragen heute beide eine nummerierte Schrittfolge — der Nutzer liest denselben Ablauf zweimal. `steps` bleibt der Ablauf, `features` verliert die Nummerierung und wird zu drei Haltungssätzen.

**Zu 14:** `Magazine.astro` filtert bereits über die `service`-Referenz. Der Türkei-Beitrag existiert und erscheint automatisch. Das ist zugleich das Muster für die restlichen Cluster-Artikel — nichts zu bauen.

---

## 8. Recht im Code

Drei Dinge lassen sich technisch erzwingen und sollten es:

1. **`consentConfirmed` als Pflicht-Boolean** bei Before/After (DSGVO-Einwilligung). Validation-Error mit Hinweistext, wenn nicht gesetzt.
2. **`priceDisclaimer` als Pflichtfeld** an der Preistabelle.
3. **Keine Rabatt-, Aktions- oder Countdown-Bausteine.** Für Zahnärzte eine unzulässige Zuwendung — gar nicht erst anbieten.

---

## 9. Fertig ist es, wenn

**Funktional**

- [ ] Der Dock zeigt den aktuellen Abschnitt, klappt auf Hover (Desktop) und Tap (Touch) auf, schließt auf Escape, Klick außerhalb, Fokusverlust und Linkwahl
- [ ] Ohne JavaScript bleibt eine funktionierende Sprungmarkenliste stehen
- [ ] Der Dock blendet über dem Footer aus
- [ ] Nach einem Router-Wechsel läuft er wieder an, ohne dass sich Listener stapeln
- [ ] Genau ein `<h1>`, keine übersprungenen Heading-Level
- [ ] Jeder verlinkte Abschnitt hat eine stabile, aus `idFrom()` erzeugte `id`
- [ ] Redaktion kann in Sanity eine vollständige Seite anlegen, ohne Entwickler

**Performance**

- [ ] LCP < 2,5 s (Hero)
- [ ] CLS < 0,1 — Dock und Bilder verschieben nichts
- [ ] Kein JS-Bundle für nicht-interaktive Module
- [ ] Nichts blitzt beim Laden auf (verborgene Startzustände in CSS)

**A11y**

- [ ] Tabellen mit `<th scope>` und `<caption>`
- [ ] FAQ tastaturbedienbar, Antworten im initialen HTML auch zugeklappt
- [ ] Dock mit ausreichendem Kontrast, blockiert keinen Fokus
- [ ] `alt` als Pflichtfeld in Sanity

**SEO**

- [ ] JSON-LD validiert ohne Errors
- [ ] Canonical vorhanden
- [ ] Kein `FAQPage`, kein `AggregateRating`

**Wiederverwendbarkeit**

- [ ] Eine zweite Leistungsseite lässt sich ohne neuen Code anlegen. **Das ist der eigentliche Test.**

**Prüfen mit**

```bash
npm run web:check    # Typen + drei Breakpoints, und ob jede Bildadresse existiert
npm run web:styles   # Computed-Style-Diff gegen Baseline
npm run erstbild     # erstes Bild, bevor die Module laufen
```

---

## 10. Was du nachfragen musst, statt zu raten

1. **Datenmodell:** `textSections[]` wie in §4 vorgeschlagen — oder anders?
2. **`studio/` freigeben?** Ohne den Ordner geht kein einziges Schemafeld: `textSections`, Vergleichsspalten, `consentConfirmed`, `priceDisclaimer`, `author`.
3. **Figma-Werte für `Prose.astro`:** Spaltenaufteilung im 12er-Raster, Satzbreite in `ch`, Abstand zwischen zwei Abschnitten.
4. **Dock im Magazin?** Empfehlung: nein, `.c-toc` bleibt dort. Für den Test von `Post.astro` reicht ein Flag.
5. **Kommentarsprache.** `CLAUDE.md` verlangt Englisch, das gesamte `src/` ist auf Deutsch kommentiert — und sehr gut. Empfehlung: die Realität schlägt die Regel, deutsche Kommentare, und `CLAUDE.md` wird korrigiert. Aber das entscheidet Flo.
6. **Domain / `site` in `astro.config.mjs`** — steht sie fest?

**Arbeite in kleinen, überprüfbaren Schritten. Nach Baustein 1 und nach der Schemaentscheidung: innehalten.**
