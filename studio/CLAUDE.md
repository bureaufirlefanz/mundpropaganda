# studio/ — das CMS

**Produkt.** Was hier am Schema geändert wird, ändert, was der Kunde sieht
und pflegen kann.

Sanity 6, eigenständig — nicht in die Astro-App eingebettet.
Projekt `a6bjftwf`, Dataset `production`.

```bash
npm run dev      # Port 3333
```

Vom Projektstamm aus: `npm run studio`.

## Der Grundsatz

**Das Studio darf nicht mehr versprechen, als die Website hält.** Ein Feld,
das der Kunde pflegt und dessen Wirkung er nirgends sieht, kostet das
Vertrauen in jedes andere Feld. Daraus folgen zwei Regeln, die
`../CMS-UMBAU.md` in den Aufgaben 3 und 4 ausbuchstabiert:

- **Kein Dokumenttyp in der Seitenleiste ohne Route.** Wer „Praxis & Team"
  pflegt und publiziert, muss das Ergebnis aufrufen können.
- **Kein stiller Rückfall auf eingebauten Text.** Ein geleertes Feld
  verschwindet von der Seite, es wird nicht ersetzt. Jedes Feld gehört in
  genau eine der drei Klassen: trägt die Seite (`required`), wahlfrei
  (Abschnitt wird ausgeblendet), oder gar kein Feld.

## Aufbau

```
sanity.config.ts       Werkzeuge, Schema, Vorlagen
sanity.cli.ts          Projekt und Dataset für die Kommandozeile
schemaTypes/           die Inhaltsmodelle
structure/index.ts     die Seitenleiste
lib/pfade.ts           die einzige Quelle für URLs
seed/                  Startbestand zum Einspielen
```

`lib/pfade.ts` ist wichtiger, als sie aussieht: `pfadVon()` ist die **eine**
Stelle, an der eine URL entsteht. Vorschau, Locations und die Routenprüfung in
`scripts/check-web.mjs` lesen von dort. Eine zweite Stelle, die URLs baut,
läuft garantiert auseinander.

## Einzeldokumente

Eine Schema-Option dafür gibt es nicht — erzwungen wird sie über eine feste ID
in `structure/index.ts` **und** dadurch, dass der Typ in den Vorlagen fehlt.
Ohne das zweite steht im Menü „Neue Einstellungen", und zwei davon lassen die
Seite still auf das falsche zeigen.

## Was kein Baukasten wird

Die Startseite hat feste, benannte Felder (`heroZeilen`, `splitTitel`,
`standardsEintraege`) — kein Array aus austauschbaren Blöcken. Das ist eine
Entscheidung, keine Unfertigkeit: Ein Baukasten, in dem sich jeder Abschnitt
in jeden anderen verwandeln lässt, produziert Seiten, die aussehen wie nichts.
Der freie Baukasten bleibt auf Pillar Pages beschränkt.
