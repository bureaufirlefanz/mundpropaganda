# CMS-Umbau — Aufgabenliste

Der Weg von „Prototyp mit CMS daneben" zu „das CMS ist die Quelle, und der
Kunde sieht, was er bearbeitet".

Gedacht zum Abarbeiten in dieser Reihenfolge, eine Aufgabe je Sitzung. Die
Stufen bauen aufeinander auf: Stufe 0 spannt das Netz, in das die späteren
Umbauten fallen dürfen. Wer bei 3 anfängt, baut ohne Netz.

**Vor jeder Aufgabe:** `SANITY.md` und `web/STRUKTUR.md` lesen. Einige
Begründungen darin sind durch diese Liste überholt — Aufgabe 19 räumt das auf,
bis dahin gilt: diese Liste sticht.

---

## Entschieden

**Astro + Sanity ist das Produkt. Webflow/Lumos und der Vite-Stand sind
Prototypen.** (Flo, 04.08.2026)

Damit ist die Frage weg, die sonst über Stufe 2 gehangen hätte. `CLAUDE.md`
liest sich heute anders — dort steht, die Site solle „perspektivisch als
Webflow-Projekt auf Lumos v2.2.3 rekonstruiert werden". Das ist überholt und
wird in Aufgabe A4 richtiggestellt.

---

## Stufe A — Ordnung, bevor umgebaut wird

Drei Stände liegen im selben Ordner: der Vite-Handlebars-Prototyp (Wurzel),
die Astro-App (`web/`), das Studio (`studio/`). Dazu die Webflow-Spur, die nur
als Skill und Regeldatei existiert, aber Arbeit steuert. Das ist der Grund,
warum eine Sitzung im falschen Stand landen kann.

Der eigentliche Ärger ist aber nicht die Nachbarschaft, sondern die
**Abhängigkeit in der falschen Richtung**: `web/` — der Live-Stand — importiert
sein Fundament aus dem Prototyp.

```
web/src/layouts/Base.astro      → ../../../src/styles/tokens.css
web/src/layouts/Base.astro      → ../../../src/styles/base.css
web/src/layouts/Base.astro      → ../../../src/js/init.js
web/src/layouts/Base.astro      → ../../../src/js/lib/gsap.js
web/src/layouts/Design.astro    → dieselben drei
web/src/components/ui/Transition.astro → ../../../../src/js/lib/gsap.js
web/public                      → Symlink auf ../public
```

`SANITY.md` sagt „der Prototyp bleibt unberührt". Tatsächlich trägt er die
Tokens, das Basis-CSS und das gesamte JavaScript der ausgelieferten Seite. Wer
dort etwas ändert, ändert die Live-Website — und glaubt, in einem Prototyp zu
arbeiten. Das ist die Falle, die zugeschnappt wäre.

### Zielstruktur

```
Mundpropaganda/
├─ web/                    Astro — die Website
│  ├─ src/styles/          tokens.css · base.css · shared.css   ← hierher
│  ├─ src/js/              init.js · lib/gsap.js · …            ← hierher
│  └─ public/              echter Ordner, kein Symlink
├─ studio/                 Sanity — das CMS
├─ prototypen/
│  ├─ vite/                der Handlebars-Stand, eingefroren
│  └─ webflow/             Lumos: Paritätsregeln, Notizen
├─ scripts/                Werkzeug
└─ CLAUDE.md               Wegweiser
```

Die Regel dahinter in einem Satz: **das Produkt besitzt sein Fundament, die
Prototypen leihen es sich.** Heute ist es umgekehrt.

### A1. Git anlegen — vor allem anderen

Es gibt kein Repository — `git rev-parse` sagt „not a git repository". Stufe A
verschiebt hunderte Dateien und ändert Importpfade in mehreren Sprachen
gleichzeitig. Ohne `git reset --hard` als Rückweg ist ein halb gelungener
Umzug von Hand zurückzubauen, und zwar genau in dem Moment, in dem man nicht
mehr sicher weiß, was vorher wo lag.

`git init`, `.gitignore` steht schon (`node_modules/`, `dist/`, `.astro/`,
`.env`), ein erster Commit über den jetzigen Stand.

**Fertig, wenn** `git status` sauber ist und `git log` einen Commit zeigt.
Erst danach A2.

### A2. Das Fundament nach `web/` holen

**Zu tun**

- `src/styles/tokens.css` und `src/styles/base.css` nach `web/src/styles/`.
- `src/js/` nach `web/src/js/`.
- Die sechs Importpfade oben auf die neuen Orte zeigen lassen (`../styles/…`,
  `../js/…`).
- `vite.server.fs.allow: [".."]` aus `web/astro.config.mjs` entfernen. Es war
  nur für diese Importe da.
- `web/public` als echten Ordner anlegen statt als Symlink; `public/` an der
  Wurzel entfällt. `OUT` in `scripts/optimize-images.mjs` von `public/img` auf
  `web/public/img` ändern.
- Den Vite-Prototyp einmal auf die neuen Pfade zeigen lassen
  (`../../web/src/styles/…`) — danach wird er eingefroren, siehe A3.

**Fertig, wenn** `npm run web:build` aus `web/` heraus läuft, ohne den
Projektstamm zu brauchen, und `npm run web:styles` gegen den gesicherten Stand
keine Abweichung meldet. Das ist ein reiner Umzug, am Ergebnis darf sich nichts
ändern.

**Nebengewinn:** `netlify.toml` erklärt heute umständlich, warum der Build vom
Projektstamm laufen muss („Sonst liegt `src/` außerhalb des Wurzelverzeichnisses
und die Einbindungen brechen"). Der Grund entfällt. Den Kommentar mitziehen —
er wäre sonst genau die Sorte falscher Begründung, vor der Aufgabe 19 warnt.

### A3. Prototypen zusammenziehen

**Zu tun**

- `prototypen/vite/` ← `src/pages`, `src/partials`, `index.html`,
  `leistungen/`, `styleguide.html`, `vite.config.js`, `assets/`. Die
  npm-Scripts `dev`, `build`, `preview` im Wurzel-`package.json` mitziehen
  oder streichen.
- `prototypen/webflow/` ← `.claude/rules/astro-webflow-parity.md`, dazu ein
  `README.md`, das Site-ID, Lumos-Version und den Stand der Rekonstruktion
  festhält. Das Skill bleibt, wo es ist (`.agents/skills/webflow-lumos/`) —
  Skills gehören nicht in einen Inhaltsordner.
- In jeden der beiden eine `CLAUDE.md` mit einem Satz: *eingefroren, Prototyp,
  nicht ändern, wenn nicht ausdrücklich danach gefragt.*

**Fertig, wenn** an der Wurzel nur noch `web/`, `studio/`, `prototypen/`,
`scripts/` und die Doku-Dateien liegen.

*Praktisch:* Läuft ein Datei-Sync über dem Ordner, ihn für die Dauer der
Verschiebung pausieren — sonst legt er beim Umbenennen unter Umständen
„conflicted copy"-Dateien an. Mit A1 im Rücken ist das folgenlos, aber
lästig.

**Zur Frage, ob der Vite-Stand noch laufen muss:** Nach A2 zeigt er auf
`web/src/…` — er baut also weiter, solange dort nichts umgebaut wird. Diese
Zusage würde ich nicht geben. Ehrlicher ist: er ist Archiv, und wenn er
irgendwann nicht mehr baut, ist das kein Fehler. Genau das gehört in seine
`CLAUDE.md`.

### A4. Leitplanken, damit es so bleibt

Ordner allein trennen nichts — eine Sitzung, die den Aufbau nicht kennt,
landet trotzdem im falschen Stand. Was hilft, ist ein Wegweiser an der Stelle,
die ohnehin gelesen wird.

**Zu tun**

- `CLAUDE.md` bekommt ganz oben, vor allem anderen, die Zuordnung:

  | Ordner | Was | Status |
  |---|---|---|
  | `web/` | Astro — die Website | **Produkt** |
  | `studio/` | Sanity — das CMS | **Produkt** |
  | `prototypen/vite/` | Handlebars-Stand | Archiv, nicht ändern |
  | `prototypen/webflow/` | Lumos-Rekonstruktion | Prototyp, nur auf Ansage |

- Der Abschnitt „Webflow + Lumos" wird umgeschrieben: nicht mehr „die Site soll
  perspektivisch rekonstruiert werden", sondern „ein Prototyp; Arbeit daran nur
  auf ausdrückliche Ansage". Site-ID und die MCP-Grenzen bleiben stehen, die
  sind weiter richtig.
- Je eine `CLAUDE.md` in `web/` und `studio/` mit dem, was dort gilt — die
  Wurzeldatei wird sonst zur Sammelstelle und irgendwann von niemandem mehr
  ganz gelesen.
- Die Zeile in `CLAUDE.md` unter „Projektentscheidungen", die den Umbau
  festhält, plus ein Verweis auf diese Datei.

**Warum das die wichtigste der vier ist:** A1 bis A3 räumen einmal auf. A4
sorgt dafür, dass die nächste Sitzung — meine oder die eines anderen Agenten —
die Ordnung vorfindet, statt sie zu erraten.

---

## Stufe 0 — Absichern

Zwei Prüfungen, die von jetzt an jeden Fehler fangen, den die späteren
Umbauten machen könnten. Beide sind billig und blockieren nichts.

### 1. TypeGen anschalten

Die Begründung in `studio/sanity.cli.ts` beschreibt ein lösbares Problem.
TypeGen ist nicht an seinen Projektordner gebunden, wenn man ihm die Pfade
explizit gibt.

**Zu tun**

- `sanity-typegen.json` im Projektstamm:
  ```json
  {
    "path": "./web/src/lib/**/*.ts",
    "schema": "./schema.json",
    "generates": "./web/src/lib/sanity.types.ts"
  }
  ```
- npm-Scripts im Wurzel-`package.json`:
  ```
  "schema:extract": "npm --prefix studio exec -- sanity schema extract --workspace default --path ../schema.json",
  "types": "npm run schema:extract && npx --yes sanity@latest typegen generate"
  ```
- `schema.json` und `sanity.types.ts` in `.gitignore`.
- `npm run types` in `web:check` einhängen, vor `astro check`.

**Randbedingungen**

- Die Abfragen müssen in `.ts`-Dateien liegen und mit `defineQuery()` aus
  `groq` geschrieben sein. Beides ist schon so — `web/src/lib/queries.ts`
  macht es richtig. Diese Regel darf nicht brechen: eine Abfrage, die in eine
  `.astro`-Datei wandert, verschwindet still aus der Typprüfung.
- Die handgeschriebenen Interfaces in `web/src/lib/fixtures.ts` bleiben
  vorerst stehen. Sie dienen doppelt (Vertrag *und* Form der Beispieldaten) —
  aufgelöst wird das in Aufgabe 4, nicht hier.

**Fertig, wenn** ein absichtlich falsch geschriebener Feldname in
`queries.ts` `npm run web:check` bricht. Das ist der einzige Test, der zählt.

**Warum zuerst:** Das ist die mechanische Fassung von „die Daten müssen in
sync sein". Ohne sie rendert eine umbenannte Schema-Eigenschaft still
`undefined`, und niemand merkt es bis zum Kunden. Mit ihr bekommt jeder
spätere Schema-Umbau — und jeder Agent, der ihn macht — sofort einen
Compilerfehler statt einer plausiblen Halluzination.

### 2. Routen-Deckung prüfen

**Zu tun** — `scripts/check-web.mjs` um eine Prüfung erweitern: Für jeden
Dokumenttyp, für den `studio/lib/pfade.ts` einen Pfad liefert, muss im Build
eine Seite existieren. Fehlt eine, bricht der Check mit dem Typnamen im
Klartext.

**Fertig, wenn** der Check heute rot ist — er soll `praxis`, `magazinIndex`,
`beitrag`, `kontakt`, `notdienst`, `pillar` und `rechtstext` melden. Das ist
kein Fehler im Check, das ist der Befund. Aufgabe 3 macht ihn grün.

**Warum:** `pfadVon()` ist schon die einzige Quelle für URLs. Damit ist die
Prüfung fast geschenkt — und sie fängt genau den Fall, der einen Kunden am
schnellsten das Vertrauen kostet: eine Seite im Studio, die es auf der
Website nicht gibt.

---

## Stufe 1 — Das Studio muss die Wahrheit sagen

Der eigentliche Sync-Bruch liegt nicht in der Technik, sondern im
Versprechen. Das Studio zeigt heute mehr, als die Website hat, und die
Website zeigt Text, den das Studio nicht kennt.

### 3. Nicht gebaute Seiten aus dem Studio nehmen

In der Seitenleiste stehen Praxis & Team, Magazin, Kontakt, Notdienst, Pillar
Pages und Rechtstexte. In `web/src/pages/` gibt es `index`, `karriere` und
`leistungen/[slug]`. Wer „Praxis & Team" pflegt und publiziert, sieht nichts —
nirgends.

**Zu tun** — die Typen aus `studio/structure/index.ts` und aus
`dokumentAnsichten.ts` entfernen, bis ihre Route steht. Die Schemadateien
bleiben liegen; sie sind fertig und werden gebraucht, sobald die Seite kommt.
Ein Kommentar an der Stelle nennt den Grund und die Bedingung fürs
Zurückholen.

Alternative, falls die Seiten ohnehin diese Woche gebaut werden: Routen bauen
statt ausblenden. Dann ist Aufgabe 3 stattdessen eine Liste von sechs Seiten —
und deutlich größer als der Rest der Stufe.

**Fertig, wenn** die Prüfung aus Aufgabe 2 grün ist.

### 4. Den Fixture-Rückfall abbauen

`web/src/lib/startseite.ts` benennt den Preis selbst: „Ein Feld, das die
Redaktion absichtlich leert, fällt auf den eingebauten Text zurück." Für einen
Prototyp die richtige Abwägung. Für einen Kunden der Moment, in dem das CMS
sein Vertrauen verliert — er löscht einen Satz, publiziert, der Satz steht
weiter da. Danach glaubt er keinem Feld mehr.

**Zu tun** — für jedes Feld entscheiden, in welche von drei Klassen es fällt,
und das im Schema festschreiben:

| Klasse | Schema | Frontend |
|---|---|---|
| Trägt die Seite | `validation: (r) => r.required()` | darf sich auf Existenz verlassen |
| Wahlfrei, Abschnitt kann fehlen | keine Regel | Abschnitt wird **ausgeblendet**, nicht ersetzt |
| Nie vom Kunden gepflegt | gar kein Feld | fest im Baustein, und das ist ehrlich so |

Was heute Rückfall ist, wird eins von diesen dreien. `fixtures.ts` wird
danach zu reinem Seed-Material für `studio/seed/` — keine Laufzeitrolle mehr.
Die Interfaces darin ersetzt `sanity.types.ts` aus Aufgabe 1.

**Randbedingung** — vor dem Umbau muss der Startbestand eingespielt sein
(`studio/seed/README.md`), sonst ist die Seite zwischendurch leer. Reihenfolge:
seeden, dann Rückfall entfernen.

**Fertig, wenn** ein im Studio geleertes Feld auf der Seite verschwindet und
nichts an seine Stelle tritt. Einmal von Hand nachstellen, nicht annehmen.

**Warum:** Das ist die teuerste Aufgabe der Liste und die mit dem größten
Effekt. Alles darunter — Presentation, Vorschau, Locations — setzt voraus,
dass das, was im Studio steht, auch das ist, was auf der Seite steht.

---

## Stufe 2 — Presentation Tool

Erst ab hier wird es „wie Webflow". Voraussetzung: Stufe 1 ist durch.

`SANITY.md` begründet den Verzicht damit, dass es „Stega-Markierungen in der
Ausgabe" bräuchte. Das stimmt so nicht mehr: Stega ist nur im Draft-Mode
aktiv, und mit Astro 5 lässt sich das auf eine einzige Route beschränken. Die
ausgelieferte Seite bleibt Byte für Byte, was sie heute ist.

### 5. Seitenkomposition aus den Routen holen

**Zu tun** — `src/pages/index.astro` und `src/pages/karriere.astro` auf je
zwei Zeilen eindampfen: Daten laden, Renderer aufrufen. Der Zusammenbau wandert
nach `src/seiten/Startseite.astro`, `src/seiten/Karriere.astro`,
`src/seiten/Leistung.astro` — jeweils mit `data`-Prop, ohne eigenen
Datenzugriff.

Die harten Inhalte, die heute in `index.astro` stehen (die sechs FAQ-Einträge),
gehen dabei nach `startseite`-Schema oder bleiben bewusst fest — nach der
Entscheidung aus Aufgabe 4.

**Fertig, wenn** `npm run web:styles` gegen den gesicherten Stand keine
Abweichung meldet. Das ist ein reiner Umbau, am Ergebnis darf sich nichts
ändern.

**Warum:** Die Vorschau-Route muss exakt dasselbe rendern wie die echte. Zwei
Zusammenbauten, die dasselbe zeigen sollen, laufen garantiert auseinander —
und zwar unbemerkt, weil man immer nur eine von beiden ansieht. Passt
außerdem zur Regel aus `CLAUDE.md`: Seiten setzen zusammen, sie gestalten
nicht.

### 6. Adapter, Vorschau-Route, Draft-Mode

**Zu tun**

- `npm i -D @astrojs/netlify` und `npm i @sanity/visual-editing @sanity/preview-url-secret @astrojs/react` in `web/`.
- `astro.config.mjs`: `adapter: netlify()` dazu. `output: "static"` **bleibt** —
  in Astro 5 heißt das: alles prerendert, außer wo `export const prerender = false`
  steht. Dazu `stega: { studioUrl: … }` in der Sanity-Integration.
- `src/pages/preview/[...pfad].astro` mit `export const prerender = false`:
  löst den Pfad über die Umkehrung von `pfadVon()` auf, lädt mit
  `perspective: "drafts"` und Token, rendert die Renderer aus Aufgabe 5,
  hängt `<SanityVisualEditing />` an.
- `src/pages/api/draft-mode/enable.ts` und `disable.ts` mit
  `validatePreviewUrl`.
- `SANITY_API_READ_TOKEN` als Netlify-Umgebungsvariable. **Nicht** `PUBLIC_`.

**Fertig, wenn** `netlify build` läuft, `web/dist` außer der Preview-Funktion
dieselben Dateien enthält wie vorher, und kein einziges Stega-Zeichen im
ausgelieferten HTML steht. Beides prüfen, nicht annehmen.

**Warum die Vorschau auf einer eigenen Route und nicht auf den echten:** Die
Alternative wäre, die ganze Seite auf SSR zu stellen — das kostet
Auslieferungsgeschwindigkeit, Cache und die Eigenschaft, dass die Site auch
ohne laufenden Server steht. Für eine Praxis-Website ist das ein schlechter
Tausch.

### 7. `presentationTool` mit Locations

**Zu tun**

- `structureTool` behalten, `presentationTool` dazu:
  ```ts
  presentationTool({
    resolve,
    previewUrl: {
      initial: "http://localhost:4321",
      previewMode: { enable: "/api/draft-mode/enable" },
    },
  })
  ```
- `resolve` mit `defineLocations` je Dokumenttyp — auf Basis von
  `studio/lib/pfade.ts`, nicht daneben.
- `structure/WebVorschau.tsx` und `structure/dokumentAnsichten.ts` entfernen.
  Der iframe-Reiter hat ausgedient; zwei Vorschauen nebeneinander sind
  schlechter als eine.

**Fertig, wenn** ein Klick auf einen Text im Vorschaufenster im Studio das
richtige Feld öffnet — und ein Dokument ohne eigene Seite (Person, Stelle,
Einstellungen) unter „Locations" zeigt, auf welchen Seiten es auftaucht.

**Warum Locations der eigentliche Gewinn ist:** Das ist die Antwort auf „ich
verstehe nicht, wo was ausgebessert wird" — und zwar in der Richtung, die
Webflow nicht kann. Ein Teammitglied taucht auf drei Seiten auf; im Studio
steht es dann auch da.

---

## Stufe 3 — Studio-Politur

Kleinere Aufgaben, jede für sich abgeschlossen. Reihenfolge frei. Die Quellen
sind [turbo-start-sanity](https://github.com/robotostudio/turbo-start-sanity),
[SanityPress](https://sanitypress.dev/) und der
[Moze-UX-Guide](https://www.mozestudio.com/journal/sanity-studio-the-missing-ux-guide) —
übernommen wird die Studio-Mechanik, **nicht** deren Inhaltsmodell (siehe
„Was ausdrücklich nicht übernommen wird" unten).

### 8. Navigation und Footer als eigene Dokumente

Die Menüspalten hängen heute an `leistung` (Feldgruppe „Listeneintrag"). Das
ist datentechnisch sparsam und für den Kunden unauffindbar: wer das Hauptmenü
umsortieren will, sucht es unter „Navigation", nicht in einer Leistung.

Zwei Einzeldokumente `navigation` und `footer`, in der Seitenleiste unter den
Seiten, mit Verweisen auf die Leistungen. `EINZELDOKUMENTE` in
`structure/index.ts` mitpflegen.

### 9. Blockvorschauen mit Bild

`objekte/abschnitte.ts` hat schon `prepare` mit Titel und Untertitel — gut.
Fehlt: `media`. Jeder Abschnitt mit Bildfeld zeigt es in der Liste, jeder ohne
bekommt ein Icon, das zu ihm passt. In einer Liste von zwölf zusammengeklappten
Abschnitten ist das der Unterschied zwischen Scrollen und Finden.

### 10. Portable Text beschneiden

Wo Rich Text im Einsatz ist: `styles` auf `normal`, `h2`, `h3` begrenzen,
`decorators` auf `strong` und `em`, `lists` auf `bullet`. Kein `h1` — den
setzt das Layout. Keine freien Farben, keine Schriftgrößen.

Ein Kunde, der `h4` und Unterstreichung zur Verfügung hat, benutzt sie — und
danach sieht die Seite aus wie 2009. Der Guide sagt es deutlicher: Textstile
begrenzen ist keine Bevormundung, es ist die Zusage, dass jede Eingabe gut
aussehen wird.

### 11. Ein wiederverwendbarer `link`-Typ

Ein Objekt `link` mit `art` (intern / extern / E-Mail / Telefon), dazu
bedingtes Feld: `reference` bei intern, `url` bei extern. Ersetzt alle
Stellen, die heute rohe Strings als Ziel nehmen — u. a. `servicesZusatz.ziel`.

Gewinn: ein interner Link bricht nicht mehr, wenn sich ein Slug ändert, und
der Kunde kann keine URL vertippen, die es nicht gibt.

### 12. Den `bild`-Typ überall durchsetzen

`objekte/bild.ts` ist gut gelöst — Alternativtext plus ausdrücklicher Haken
„rein dekorativ", statt den Text stumpf zu erzwingen. Nur wird er nicht
überall benutzt: `leistung.ts` hat drei rohe `type: "image"`-Felder
(Vorschaubild, Zeile 132, das Bild in Zeile 180). Die haben keinen
Alternativtext, keinen Dekorativ-Haken, teils keinen `hotspot`.

Alle drei auf `type: "bild"` umstellen. `web/src/lib/bilder.ts` und die
Abfragen mitziehen — das Bildobjekt ändert seine Form.

Ausnahme: das Bild in `objekte/seo.ts` ist ein Open-Graph-Motiv, es wird nie
vorgelesen. Das bleibt roh, und ein Kommentar sagt warum.

**Warum das keine Kleinigkeit ist:** Barrierefreiheit ist bei einer
Arztpraxis kein Beiwerk. Und ein Typ, der an drei von acht Stellen nicht
benutzt wird, ist schlimmer als keiner — er weckt den Eindruck, das Thema sei
erledigt.

### 13. Feldgruppen konsequent durchziehen

`leistung.ts` hat es schon richtig: Gruppen **Inhalt · Listeneintrag · SEO**,
SEO zuletzt. Das ist die Vorlage — dasselbe Muster auf jedes Dokument mit mehr
als acht Feldern, allen voran `startseite.ts` (200 Zeilen, eine flache Liste).

SEO gehört immer in die letzte Gruppe und nie unter die ersten sichtbaren
Felder: sonst füllt der Kunde erst Meta-Descriptions aus und verliert die
Lust, bevor er beim Text ist.

---

## Stufe 4 — Betrieb

### 14. Publish erreicht die Website

Webhook in sanity.io/manage auf einen Netlify Build Hook. Ohne das wartet der
Kunde auf eine Änderung, die nie ankommt — der wahrscheinlichste erste
Support-Anruf.

Dazu ein Hinweis im Studio, dass eine Veröffentlichung ein bis zwei Minuten
braucht. Ein eigenes Studio-Tool mit Deploy-Status wäre schöner, ist aber
Kür; ein Satz im Dokument-Kopf reicht zunächst.

### 15. Rollen und Zugang

Kunde als `editor` einladen, nicht als Administrator. Ob die Rolle im
gebuchten Plan verfügbar ist, **vorher prüfen** — bei manchen Plänen ist
Administrator die einzige Option, dann braucht es stattdessen eine kurze
schriftliche Absprache, was nicht angefasst wird.

### 16. Eine Seite Anleitung

Für den Kunden, nicht für uns: wie man sich anmeldet, was „Publish" tut, wie
lange es dauert, wie man eine alte Fassung zurückholt, wen man fragt. Eine
Seite, deutsch, keine Screenshots von Zuständen, die sich ändern.

Der Reflex, das wegzulassen, ist teuer: jede Frage, die hier nicht steht,
kommt als Anruf.

---

## Stufe 5 — Werkzeug für die weitere Arbeit

### 17. Skill „neuer-abschnitt"

Ein neuer Abschnitt berührt heute vier Stellen: Schema in
`studio/schemaTypes/objekte/abschnitte.ts`, Registrierung in
`schemaTypes/index.ts`, Komponente in `web/src/components/sections/`, Abfrage
in `web/src/lib/queries.ts`. Wer eine vergisst, merkt es erst später.

Ein Skill unter `.agents/skills/neuer-abschnitt/`, das alle vier in einem Zug
anlegt und `npm run types` hinterherzieht. Die Idee ist von SanityPress
geborgt (`/new-module`), der Zuschnitt ist unserer.

### 18. Sanity-MCP anhängen

Der Remote-Server unter `mcp.sanity.io` — die npm-Variante `@sanity/mcp-server`
ist abgekündigt. Damit kann Claude Code das echte Dataset abfragen, statt
Schema-Änderungen gegen Annahmen zu prüfen.

### 19. Dokumentation nachziehen

`SANITY.md` und `studio/sanity.cli.ts` enthalten nach diesem Umbau falsche
Begründungen — „TypeGen ist bewusst aus", „bewusst kein Presentation-Werkzeug",
die Rückfall-Erklärung in `startseite.ts`. Die stehen dort gut begründet und
werden deshalb geglaubt: Der nächste Agent liest sie und baut dagegen.

**Am Ende jeder Stufe die betroffene Begründung mitziehen, nicht gesammelt am
Schluss.** Eine falsche Begründung im Repo richtet mehr Schaden an als eine
fehlende.

---

## Was ausdrücklich nicht übernommen wird

Die Referenz-Templates sind Page-Builder-Templates: jede Seite ist ein leeres
Array, der Redakteur steckt sie zusammen. **Für eine Zahnarztpraxis ist das
die falsche Vorlage.**

Der bestehende Aufbau — feste, benannte Felder je Abschnitt (`heroZeilen`,
`splitTitel`, `standardsEintraege`) — ist überlegen: der Kunde kann nichts
kaputt gestalten, und zu jedem Feld ist bekannt, wo es landet. Der Kommentar
in `abschnitte.ts` trifft es: „Ein Baukasten, in dem sich jeder Abschnitt in
jeden anderen verwandeln lässt, produziert Seiten, die aussehen wie nichts."

Der freie Baukasten bleibt auf Pillar Pages beschränkt, wo wechselnde
Reihenfolgen tatsächlich gebraucht werden. Keine Startseite aus Blöcken.

Ebenfalls nicht: Tailwind und shadcn/ui aus turbo-start-sanity. `CLAUDE.md`
schließt atomare Utilities aus, und diese Liste ändert nichts an der
CSS-Konvention.

---

## Reihenfolge auf einen Blick

```
A1 Git anlegen             ─┐
A2 Fundament nach web/     ─┼─ Stufe A, streng in dieser Reihenfolge
A3 Prototypen trennen      ─┤   A1 vor allem anderen
A4 Leitplanken             ─┘
1  TypeGen                 ─┐
2  Routen-Deckung          ─┴─ Stufe 0, unabhängig
3  Studio aufräumen        ─┐
4  Fixture-Rückfall weg    ─┴─ Stufe 1, braucht 1+2
5  Renderer extrahieren    ─┐
6  Adapter + Preview-Route ─┼─ Stufe 2, streng in dieser Reihenfolge
7  presentationTool        ─┘
8…13                         Stufe 3, frei, jede für sich
14…16                        Stufe 4, vor der Übergabe an den Kunden
17…19                        Stufe 5, laufend
```

Stufe A und Stufe 0 stören einander nicht — A verschiebt Dateien, 0 fügt
Prüfungen hinzu. Wer zuerst 1 und 2 macht, hat beim Verschieben in A2 sogar
ein Netz. Umgekehrt gilt: A1 (Git) steht **vor beidem**.

Die kürzeste sinnvolle Fassung, wenn die Zeit knapp ist: **A1, A2, 1, 2, 4,
14, 16.** Das ergibt eine sauber getrennte Codebasis und ein CMS, dem der
Kunde trauen kann — ohne Visual Editing, aber ohne Lügen.
