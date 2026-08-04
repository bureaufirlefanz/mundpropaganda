# Inhalte ins Studio einspielen

`inhalte.ndjson` enthält die elf Leistungen in ihrer Relevanzreihenfolge und
das Startseiten-Dokument. Erzeugt wird sie aus den Fallback-Daten der
Website, damit sie exakt das enthält, was die Seite heute zeigt:

    node studio/seed/erzeuge.mjs > studio/seed/inhalte.ndjson

Einspielen (schreibt in den Datensatz — schreibt also echte Dokumente):

    cd studio
    npx sanity dataset import ../studio/seed/inhalte.ndjson production

## Was drin steht, und was nicht

Die **Leistungen** kommen mit Titel, Kurzname, Slug, Topline, Platzierung,
Gruppe, Kürzel und Reihenfolge. Texte, Preise und Bilder bleiben leer — die
liefert vorerst die Beispiel-Leistung im Code, und der Kunde füllt sie im
Studio Stück für Stück.

Das **Startseiten-Dokument** ist bis auf seine Kennung leer. Das ist Absicht:
Jedes Feld, das hier stünde, wäre eine Kopie des Textes, der in den
Bausteinen steht — und die Kopie ist die, die veraltet. Solange ein Feld leer
bleibt, zeigt die Seite den eingebauten Text; sobald jemand es füllt, gilt
seins.

## Nur einmal

Die Leistungen bekommen keine feste `_id`, Sanity vergibt sie. Ein zweiter
Import legt sie deshalb ein zweites Mal an. Wer neu einspielen will, löscht
die alten vorher im Studio.

Das Startseiten-Dokument hängt an der ID `startseite` und wird beim erneuten
Import überschrieben, nicht verdoppelt.
