# Praxisseite: Texte zum Einsetzen

**Wofür das hier ist.** Die Praxisseite holt jedes Wort aus Sanity
(`PRACTICE_QUERY`, Dokument `practice`). Der Umbau am Layout ist im Code
erledigt, die Texte gehören ins Studio. Diese Datei ist die Vorlage dafür,
Feld für Feld.

**Nicht vergessen:** Im Kopf fehlt ein Bild. `image` ist leer, deshalb steht
der neue große Hero ohne Motiv da. Ein Querformat, mindestens 2600px breit,
Praxisraum mit Licht.

---

## Kopf

| Feld      | Wert                       |
| --------- | -------------------------- |
| `topline` | Praxis                     |
| `title`   | siehe unten                |
| `lead`    | siehe unten                |
| `image`   | **fehlt, bitte hochladen** |

### Headline, drei Vorschläge

Die bisherige lautet „Zwei Praxen, ein Anspruch". Sie beschreibt eine
Organisationsform, nicht das, was jemanden herführt.

**1. Zeit ist die Behandlung** — setzt das Versprechen an die erste Stelle.
Passt zum Storytext, der ohnehin von längeren Terminen handelt.

**2. Zahnarzt, bei dem du bleibst** — spricht direkt an und nimmt die Angst
vorweg, ohne sie zu benennen.

**3. Zweimal Prenzlauer Berg** — nüchtern, ortsbezogen, gut fürs Suchwort.
Die schwächste der drei, wenn die Seite überzeugen und nicht nur informieren
soll.

Meine Empfehlung ist **1**.

### Lead

> Zwei Häuser in Prenzlauer Berg, ein Team, das sich gegenseitig vertritt.
> Wir nehmen uns pro Termin länger und legen dafür weniger Termine auf den
> Tag. Was das für dich heißt: Du wirst aufgeklärt, bevor behandelt wird,
> und nicht zwischen Tür und Angel.

---

## Wer wir sind

| Feld            | Wert                          |
| --------------- | ----------------------------- |
| `storyTopline`  | Wer wir sind                  |
| `storyHeadline` | Aus einem Ärgernis entstanden |

### `storyColumns`

**Spalte 1**

> Die meisten Menschen gehen ungern zum Zahnarzt, und fast nie liegt das an
> der Behandlung. Es liegt an allem drumherum: an Terminen, die nicht halten.
> An Erklärungen, die niemand versteht. An dem Gefühl, dass die Zeit knapp
> ist und man selbst der Grund dafür.

**Spalte 2**

> Wir haben die Praxis so gebaut, dass diese Gründe wegfallen. Längere
> Termine, weniger davon am Tag, und eine Aufklärung, die vorher stattfindet
> statt hinterher. Das ist keine Haltung, die man plakatiert, sondern eine
> Rechnung, die aufgehen muss. Sie geht auf.

---

## Wofür wir stehen

| Feld             | Wert                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------ |
| `valuesTopline`  | Haltung                                                                              |
| `valuesHeadline` | Vier Dinge, auf die du dich verlassen kannst                                         |
| `valuesText`     | Nichts davon ist besonders. Besonders ist nur, dass es nicht selbstverständlich ist. |

### `valuesItems`

**Wir sagen ab, bevor du wartest.**
Wenn ein Termin nicht zu halten ist, hörst du es vorher und nicht im
Wartezimmer. Das kommt selten vor, weil der Tag nicht zu voll geplant ist.

**Der Kostenplan kommt vor der Behandlung.**
Schriftlich, aufgeschlüsselt, mit dem Teil, den die Kasse trägt. Wer nicht
weiß, was etwas kostet, kann nicht zustimmen.

**Wir raten auch ab.**
Nicht jede Behandlung, nach der gefragt wird, ist die richtige. Wenn eine
andere Lösung besser trägt oder gar keine nötig ist, sagen wir das, auch wenn
es uns Umsatz kostet.

**Ein Team, zwei Häuser.**
Wer dich behandelt, kennt deine Unterlagen, egal an welcher Adresse du
sitzt. Vertretung heißt hier nicht, dass jemand Fremdes deine Akte aufschlägt.

---

## Team

| Feld           | Wert                   |
| -------------- | ---------------------- |
| `teamTopline`  | Team                   |
| `teamHeadline` | Die Gesichter dahinter |
| `teamText`     | siehe unten            |

> Behandeln, assistieren, planen, im eigenen Labor schichten. Die Einzelnen
> stellen wir dir vor, sobald die Porträts stehen.

**Hinweis zum Code:** Die Kacheln mit Name, Rolle und Verweis auf
`/praxis/<name>` sind vorerst raus, wie besprochen. Stehen geblieben ist ein
Streifen aus den Porträts. Sobald die Detailseiten wieder dran sind, gehört
das in `components/sections/Team.astro` zurückgebaut, der Kommentar dort
sagt, was zu tun ist.

---

## Standorte

| Feld                | Wert                                                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `locationsTopline`  | Standorte                                                                                                                     |
| `locationsHeadline` | Zweimal Prenzlauer Berg                                                                                                       |
| `locationsText`     | Beide Häuser liegen zehn Gehminuten auseinander. P25 ist barrierefrei zugänglich. Anschriften und Zeiten stehen unten im Fuß. |

**Hinweis zum Code:** Die Standorte zeigt jetzt derselbe Bildring wie auf der
Startseite. Er holt Anschriften und Zeiten selbst aus den Einstellungen, die
Überschrift kommt aus `locationsHeadline`. Ohne gepflegte Motive nimmt er die
gestalteten Ersatzbilder.
