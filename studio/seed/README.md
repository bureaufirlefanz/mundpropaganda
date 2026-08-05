# Startbestand einspielen

Zwei Dateien, weil zwei Importarten nötig sind. Sie sind **die Quelle** —
erzeugt wurden sie einmalig von `erzeuge.mjs`, das die Vorgaben aus den
Bausteinen las. Diese Vorgaben gibt es seit Aufgabe 4 nicht mehr, das Skript
läuft nicht mehr und liegt nur noch als Beleg daneben.

Einspielen — schreibt echte Dokumente in den Datensatz:

```bash
cd studio
npx sanity dataset import ../studio/seed/seiten.ndjson     --dataset production --replace
npx sanity dataset import ../studio/seed/karriere.ndjson   --dataset production --replace
npx sanity dataset import ../studio/seed/leistungen.ndjson --dataset production --missing
npx sanity dataset import ../studio/seed/magazin.ndjson    --dataset production --missing
npx sanity dataset import ../studio/seed/recht.ndjson      --dataset production --missing
npx sanity dataset import ../studio/seed/rahmen.ndjson     --dataset production --replace
```

**Die Reihenfolge zählt.** `rahmen.ndjson` verweist auf Startseite, Magazin,
Karriere und die drei Rechtstexte — deshalb müssen `karriere.ndjson` und
`recht.ndjson` davor laufen; `magazin.ndjson` verweist auf Leistungen. Sanity prüft Verweise beim
Import und bricht ab, wenn das Ziel fehlt — mit `references non-existent
document`. Deshalb zuerst die Einzelseiten, dann die Sammlungen, zuletzt der
Rahmen.

## Warum getrennt

| Datei | Inhalt | Import | Grund |
|---|---|---|---|
| `leistungen.ndjson` | 11 Leistungen, nur Grunddaten | `--missing` | `leistung-veneers` ist voll gepflegt. `--replace` überschriebe seinen Inhalt mit Titel und Slug — ohne Rückfrage. |
| `magazin.ndjson` | Magazin-Übersicht und 4 Beiträge | `--missing` | Sobald jemand einen Beitrag redigiert, soll ein erneuter Import ihn nicht zurücksetzen. |
| `karriere.ndjson` | Karriereseite und 4 Stellen | `--replace` | Die Seite ist ein Einzeldokument; die Stellen sollen genau diesen Stand bekommen, solange sie niemand redigiert hat. |
| `recht.ndjson` | Impressum, Datenschutz, Barrierefreiheit | `--missing` | Sobald jemand die Angaben vervollständigt, soll ein erneuter Import sie nicht auf „Noch zu ergänzen“ zurücksetzen. |
| `rahmen.ndjson` | Navigation und Seitenfuß | `--replace` | Zwei Einzeldokumente, die genau diesen Stand bekommen sollen. |
| `seiten.ndjson` | Einstellungen, Startseite | `--replace` | Beide sollen genau diesen Stand bekommen. |

Die IDs sind fest (`leistung-<slug>`, `einstellungen`, `startseite`), der
Vorgang also wiederholbar. Ohne feste IDs vergäbe Sanity zufällige, und jeder
zweite Import legte alles ein zweites Mal an.

## Was drin steht

**Leistungen** — Titel, Kurzname, Slug, Topline, Platzierung, Gruppe, Kürzel
und Reihenfolge. Texte, Preise und Bilder bleiben leer; die pflegt der Kunde
im Studio.

**Einstellungen** — Telefon, E-Mail, Bewertungszahlen, Profile, beide
Anschriften.

**Karriere** — Kopf, Haltung, vier Zahlen, zehn Zeilen Vergleichstabelle, drei
Stimmen, vier Etappen des Bewerbungsablaufs und sechs Fragen. Dazu vier Stellen
als eigene Dokumente, jede mit Aufgaben, Profil und einem Haken
„Ausgeschrieben“. Alles davon lag bis zum Umzug in `web/src/lib/karriere.ts`.

**Startseite** — jedes Feld mit dem Text, den die Seite zeigt: Hero-Zeilen,
Split, Services-Titel, die fünf Standards, Standorte-Titel, Experten mit
beiden Absätzen, die fünf Stories, Magazin und die sechs FAQ-Einträge.

**Rechtstexte** — Impressum, Datenschutzerklärung und
Barrierefreiheitserklärung, gegliedert und mit den Daten der Praxis gefüllt,
soweit sie bekannt sind. Wo eine rechtsverbindliche Angabe fehlt, steht
ausdrücklich „Noch zu ergänzen“ statt einer erfundenen. Ein Impressum, das
vollständig aussieht und falsche Namen trägt, ist die gefährlichste Sorte
Platzhalter.

Die Datenschutzerklärung hält fest, dass die Website keine
einwilligungspflichtigen Cookies setzt: keine Analysedienste, keine
Werbenetzwerke, keine fremden Schriftarten, keine eingebetteten Karten. Das
ist gemessen, nicht behauptet — im gebauten HTML steht kein einziger
Fremdhost. Deshalb gibt es auch keinen Punkt „Cookie-Einstellungen“ im Fuß:
Er öffnete ein leeres Fenster.

Bilder und SEO trägt der Seed nicht — die pflegt der Kunde. Ein leeres
Bildfeld fällt auf das gestaltete Motiv zurück, ein leeres SEO-Feld auf den
Seitentitel.

## Warum der Seed jetzt Inhalt trägt

Bis Aufgabe 4 war er bis auf die Kennungen leer, mit der Begründung: Was hier
stünde, wäre eine Kopie des Textes in den Bausteinen, und die Kopie veraltet.
Das galt, solange der eingebaute Text die Seite trug.

Mit Aufgabe 4 trägt ihn das CMS. Damit dreht sich die Lage um — der Seed ist
nicht mehr die zweite Kopie, sondern der Umzug der ersten. Danach gibt es
keinen zweiten Ort, von dem er abweichen könnte.

Erzeugt wird er aus den Quelldateien, nicht abgetippt. Ein abgetippter Seed
hätte genau einen Tippfehler, und den fände niemand — er sähe aus wie eine
Textentscheidung.

## Die Probe

Nach dem Einspielen liest die Seite aus dem CMS statt aus dem Code. Ist der
Seed originalgetreu, darf sich am Ergebnis nichts ändern:

```bash
npm run web:build && npm run web:preview
npm run web:styles          # im zweiten Terminal
```

Gemessen beim Einspielen: 3918 Elemente über drei Breakpoints, keine
Abweichung.

## Ein Sonderfall: Veneers

`leistung-veneers` ist die einzige voll gepflegte Leistung und steht **nicht**
in `leistungen.ndjson` — die trägt nur Grunddaten und wird mit `--missing`
eingespielt, rührt das Dokument also nicht an.

Mit Aufgabe 4 sind vier Abschnitte dazugekommen, die gebaut waren und im
Schema fehlten: Vorher/Nachher, Kernaussage, Ablauf und die Bild-Text-Zeilen.
Sie lagen als Beispieldaten in `web/src/lib/fixtures.ts`, und die Datenschicht
setzte bei **jeder** Leistung dieselben ein — auf der Bleaching-Seite stand
deshalb „In vier Schritten zu neuen Veneers".

Dieser Inhalt ist einmalig in das Veneers-Dokument gezogen. Er ist damit
umgezogen, nicht abgetippt, und `fixtures.ts` ist entfallen.
