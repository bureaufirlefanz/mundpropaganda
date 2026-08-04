# Startbestand einspielen

Zwei Dateien, weil zwei Importarten nötig sind. Beide werden erzeugt, nicht
von Hand geschrieben:

```bash
node studio/seed/erzeuge.mjs
```

Einspielen — schreibt echte Dokumente in den Datensatz:

```bash
cd studio
npx sanity dataset import ../studio/seed/leistungen.ndjson --dataset production --missing
npx sanity dataset import ../studio/seed/seiten.ndjson     --dataset production --replace
```

## Warum getrennt

| Datei | Inhalt | Import | Grund |
|---|---|---|---|
| `leistungen.ndjson` | 11 Leistungen, nur Grunddaten | `--missing` | `leistung-veneers` ist voll gepflegt. `--replace` überschriebe seinen Inhalt mit Titel und Slug — ohne Rückfrage. |
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

**Startseite** — alle siebzehn Felder mit dem Text, den die Seite zeigt:
Hero-Zeilen, Split, Services-Titel, die fünf Standards, Standorte-Titel,
Experten, die fünf Stories, Magazin und die sechs FAQ-Einträge.

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
