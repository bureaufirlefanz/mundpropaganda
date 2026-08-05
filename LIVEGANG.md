# Livegang — was fehlt und was es kostet

Geprüft gegen den Stand vom 05.08.2026, nach Stufe A bis 19. Das meiste ist
gebaut: Preview-Route, Draft-Mode, Presentation mit Locations, TypeGen, die
getrennte Ordnerstruktur. Was hier steht, ist das, was zwischen „läuft" und
„darf online" liegt.

Zwei Teile: die Liste, und die Rechnung.

---

# Teil 1 — Was noch fehlt

## Blocker — ohne die geht es nicht live

### B1. Impressum und Datenschutzerklärung haben keine Seite

`rechtstext` existiert als Dokumenttyp, `pfadVon()` kennt ihn und gibt `/<slug>`
zurück. Eine Route gibt es nicht: in `web/src/pages/` liegen `index`,
`karriere`, `leistungen/[slug]`, `magazin/*` — kein `[slug].astro` auf oberster
Ebene.

Damit ist die Seite ohne Impressum. Für eine Zahnarztpraxis ist das kein
Schönheitsfehler, sondern abmahnfähig.

**Zu tun:** `web/src/pages/[slug].astro` für `rechtstext` und `pillar`, mit
Kollisionsprüfung gegen `RESERVIERTE_SLUGS`. Die Prüfung aus Aufgabe 2 meldet
das ohnehin schon.

### B2. Das Impressum braucht Heilberuf-Angaben

Ein Standard-Impressum reicht nicht. Nach § 5 DDG kommen bei Zahnärzten dazu:

- gesetzliche Berufsbezeichnung („Zahnarzt" / „Zahnärztin") **und** der Staat,
  in dem sie verliehen wurde
- zuständige Zahnärztekammer (Kammerbezirk)
- zuständige Kassenzahnärztliche Vereinigung
- Berufsordnung und Heilberufsgesetz mit Fundstelle, verlinkt
- Berufshaftpflichtversicherung mit räumlichem Geltungsbereich
- USt-IdNr., falls vorhanden

Das gehört als Feldstruktur ins `rechtstext`-Schema oder in `einstellungen` —
nicht als freier Fließtext, den beim nächsten Umzug niemand nachträgt.

### B3. Vorher/Nachher und Erfahrungsberichte rechtlich prüfen lassen

Die Seite hat `BeforeAfter.astro`, `Stories.astro` („Transformation Stories"),
`Voices.astro` und `Reviews.astro`. Das Heilmittelwerbegesetz beschränkt beides:

- § 11 Abs. 1 Satz 3 HWG verbietet Vorher-Nachher-Darstellungen bei
  operativen plastisch-chirurgischen Eingriffen. Ob Veneers und Bleaching
  darunterfallen, ist umstritten — und genau deshalb nichts, was ich hier
  entscheide.
- § 11 Abs. 1 Nr. 11 HWG beschränkt Äußerungen Dritter, wenn sie
  missverständlich oder übertrieben wirken.

**Zu tun:** Diese vier Bausteine einem Anwalt für Medizinrecht vorlegen, bevor
die Seite indexiert wird. Kommt ein Nein, sind es vier Komponenten weniger —
schmerzhaft, aber billiger als eine Abmahnung nach dem Livegang.

Dasselbe gilt für `Prices.astro`: Preisangaben bei zahnärztlichen Leistungen
müssen zur GOZ passen und dürfen nicht irreführen.

### B4. Das Formular versendet nichts

`Contact.astro` prüft clientseitig und schickt nichts — wie im Prototyp
vermerkt. Für eine Praxisseite ist das der wichtigste Weg zum Termin.

**Empfehlung: Netlify Forms.** Kostet in allen Plänen nichts, unbegrenzte
Einsendungen, kein zusätzlicher Anbieter in der Datenschutzerklärung außer dem
Hoster, der ohnehin drinsteht. `netlify` und `netlify-honeypot` ans `<form>`,
fertig.

**Wichtig zum Zuschnitt:** Das Formular fragt Name, Kontakt, Wunschtermin und
eine kurze Nachricht — und sagt ausdrücklich dazu, dass keine Beschwerden oder
Befunde eingetragen werden sollen. Sobald ein Patient Gesundheitsdaten
einträgt, gilt Art. 9 DSGVO, und die Anforderungen steigen deutlich. Der Satz
über dem Feld ist die billigste Absicherung, die es gibt.

### B5. Die Indexsperre entfernen

`web/public/robots.txt` sperrt alles (`Disallow: /`), `web/public/_headers`
setzt `X-Robots-Tag: noindex, nofollow`. Beides ist absichtlich da und in den
Dateien sauber kommentiert.

**Beim Livegang beide entfernen** — und danach in der Search Console prüfen,
dass die Seite tatsächlich indexiert wird. Eine vergessene Zeile hier kostet
Monate Sichtbarkeit, und niemand merkt es, weil die Seite ja funktioniert.

---

## Wichtig — sollte vor dem Livegang stehen

### W1. `site:` in `astro.config.mjs` fehlt

Ohne die Angabe hat Astro keine absoluten URLs. Betroffen: `canonical`,
Open-Graph-Bilder, Sitemap. Eine Zeile.

### W2. Keine Sitemap

`@astrojs/sitemap` ist nicht installiert. Bei einer Seite mit dreizehn
Leistungen plus Magazin ist das kein Beiwerk. Braucht W1.

### W3. Keine 404-Seite

`web/src/pages/404.astro` gibt es nicht — Netlify liefert dann seine eigene,
die aussieht wie Netlify. Bei einer Praxis, die von Google auf alte URLs
verlinkt wird, ist das der erste Eindruck.

### W4. Keine strukturierten Daten

Kein einziges `application/ld+json` im Projekt. Für eine lokale Praxis ist das
der größte SEO-Hebel, den es gibt: `Dentist` (Untertyp von `LocalBusiness`) mit
Adresse, Telefon, Öffnungszeiten, `medicalSpecialty` und `areaServed` — plus
`FAQPage` auf den Leistungsseiten, die ohnehin FAQ-Daten aus dem CMS haben.

Die Daten liegen fast alle schon in `einstellungen` (Telefon, E-Mail,
Standorte mit Straße und Ort, Bewertungen). **Was fehlt: Öffnungszeiten.** Die
gehören als Feld dazu, bevor das JSON-LD gebaut wird — sonst steht es doppelt
gepflegt im Code.

### W5. Kein Deploy-Schutz gegen Publish-Wellen

Rechnerisch der überraschendste Posten, deshalb ausführlich in Teil 2: Bei
Netlify kostet jeder Produktions-Deploy 15 Credits. Ein Kunde, der an einem
Nachmittag zwanzigmal veröffentlicht, verbraucht das Monatskontingent des
Gratis-Plans an einem Tag.

**Zu tun:** Den Sanity-Webhook nicht direkt auf den Build-Hook zeigen lassen,
sondern sammeln — etwa ein geplanter Build alle zwei Stunden, der nur läuft,
wenn seit dem letzten etwas veröffentlicht wurde. Die Presentation-Vorschau aus
Aufgabe 7 nimmt dem Sofort-Build ohnehin die Dringlichkeit: Der Kunde sieht
seinen Entwurf sofort, auch wenn die öffentliche Seite erst später nachzieht.

Das gehört in `ANLEITUNG.md`, sonst wirkt die Verzögerung wie ein Fehler.

---

## Betrieb — nach dem Livegang, aber vorher einrichten

### D1. Sicherung des Datasets

`sanity dataset export` als geplanter Lauf, Ergebnis irgendwohin, wo es nicht
im selben Konto liegt. Sanity hat Dokumenthistorie, aber die hilft nicht bei
einem gelöschten Dataset oder einem verlorenen Zugang.

### D2. Erreichbarkeitsprüfung

UptimeRobot oder gleichwertig, kostenlos, Benachrichtigung an dich, nicht an
die Praxis. Eine Praxis merkt einen Ausfall erst, wenn niemand anruft — und
dann ist es Freitagnachmittag.

### D3. Zugänge sauber übergeben

Sanity-Einladung an die Praxis, Netlify-Zugang, Registrar-Zugang. Wer welche
Konten besitzt, gehört schriftlich festgehalten — das ist die Frage, die zwei
Jahre später jemand stellt.

### D4. Schriftlizenzen prüfen

In `web/public/fonts/` liegen `PPNeueMontreal-*` und `GT-Pressura-Mono-Light`.
Beides sind kommerzielle Schriften (Pangram Pangram, Grilli Type) und beide
brauchen für die Auslieferung als Webfont eine eigene Lizenz, gestaffelt nach
Seitenaufrufen. Eine Desktop-Lizenz oder ein Testdownload deckt das nicht ab.

**Das ist der unklarste Kostenpunkt im ganzen Projekt** — siehe Teil 2.

---

# Teil 2 — Was es kostet

Angenommen: Konten laufen über dich, der Kunde zahlt eine Pauschale. Preise
Stand 05.08.2026, USD-Beträge ohne Umrechnungsaufschlag.

## Laufend

| Posten | Anbieter | Preis | Anmerkung |
|---|---|---|---|
| Hosting | Netlify **Free** | 0 $ | 300 Credits/Monat, harte Grenze |
| Hosting | Netlify **Personal** | **9 $/Monat** | 1.000 Credits — die realistische Wahl |
| CMS | Sanity **Free** | 0 $ | Visual Editing inklusive, s. u. |
| CMS | Sanity **Growth** | 15 $/Platz/Monat | erst nötig, wenn Rollen oder Terminplanung gebraucht werden |
| Formular | Netlify Forms | 0 $ | unbegrenzt, in allen Plänen enthalten |
| Statistik | Plausible Starter | **9 $/Monat** | 10k Aufrufe, EU-gehostet, ohne Cookies |
| Statistik | Umami selbst betrieben | 0 $ | braucht einen Server, also nicht wirklich 0 |
| Domain `.de` | Registrar | ~1 $/Monat | 10–15 € im Jahr |
| Erreichbarkeit | UptimeRobot Free | 0 $ | |
| Fehlerprotokoll | Sentry Free | 0 $ | optional |

**Drei Rechnungen:**

- **Sparsam** — alles auf Gratis-Stufe, keine Statistik: **~1 $/Monat.**
  Funktioniert, mit den Abstrichen unten.
- **Realistisch** — Netlify Personal, Sanity Free, Plausible:
  **~19 $/Monat** (~18 €).
- **Mit Sanity Growth** für zwei Plätze (du und die Praxis):
  **~49 $/Monat** (~46 €).

## Wobei Sanity Free wirklich reicht — und wobei nicht

Der Gratis-Plan ist ungewöhnlich großzügig: 20 Plätze, 10.000 Dokumente,
1 Mio. CDN-Abfragen, 100 GB Bandbreite. **Visual Editing und Presentation sind
enthalten** — die Stufe-2-Arbeit läuft also ohne Kosten.

Drei Einschränkungen, und nur die dritte tut weh:

1. **Datasets nur öffentlich.** Bei einer Website ist der Inhalt ohnehin
   öffentlich. Verkraftbar.
2. **Keine geplante Veröffentlichung.** Wäre für Urlaubszeiten und Notdienst
   nett, ist aber kein Muss.
3. **Nur die Rollen Administrator und Viewer.** Es gibt keine Editor-Rolle —
   die Praxis wäre Administrator und könnte damit auch das Dataset löschen
   oder Zugänge ändern.

Punkt 3 ist der eigentliche Grund für Growth. Ob 30 $/Monat dafür angemessen
sind, hängt daran, wie viele Hände im Studio arbeiten. Bei einer Person, die
eingewiesen ist: eher nicht. Bei wechselndem Praxispersonal: ja.

**Vorschlag:** mit Free starten, in `ANLEITUNG.md` festhalten, was nicht
angefasst wird, und wechseln, sobald eine zweite Person dazukommt.

## Warum Netlify Free knapp wird

Netlify rechnet seit Kurzem in Credits statt in Bandbreite:

| Verbrauch | Credits |
|---|---|
| Produktions-Deploy | 15 je Stück |
| Bandbreite | 20 je GB |
| Web-Anfragen | 2 je 10.000 |
| Rechenzeit (Preview-Route) | 10 je GB-Stunde |
| Formular-Einsendungen | 0 |
| Deploy-Vorschauen, Branch-Deploys | 0 |

Überschlag für eine Praxisseite mit ~3.000 Besuchen im Monat:

```
Bandbreite   ~3,5 GB      →  70 Credits
Anfragen     ~45.000      →   9 Credits
Deploys      10 Publishes → 150 Credits
                            ───
                            229 von 300
```

Der Verkehr ist also nicht das Problem — **die Veröffentlichungen sind es.**
Jede kostet so viel wie ein dreiviertel Gigabyte Bandbreite. Zwanzig Publishes
an einem Nachmittag, wie sie beim ersten Befüllen des CMS normal sind, und der
Monat ist vorbei; danach ist die Seite bis zum Monatswechsel nicht mehr
aktualisierbar.

Deshalb entweder **Netlify Personal für 9 $** oder die gesammelten Builds aus
W5 — am besten beides. Wer ganz kostenlos bleiben will: Cloudflare Pages hat
für rein statische Seiten die großzügigere Gratis-Stufe. Der Wechsel kostet
aber den Netlify-Adapter und die Preview-Route, also einen Tag Arbeit. Lohnt
sich bei 9 $ Ersparnis im Monat nicht.

## Einmalig

| Posten | Kosten | Anmerkung |
|---|---|---|
| **Schriftlizenzen** | **offen, evtl. dreistellig** | PP Neue Montreal + GT Pressura, Webfont-Lizenz nach Aufrufen |
| Rechtsprüfung | 300–800 € | Impressum, Datenschutz, HWG-Prüfung der vier Bausteine |
| Fotografie | projektabhängig | Praxis, Team, Behandlungen |

Die Schriftlizenzen sind der Posten, den ich als Erstes klären würde. Nicht
weil er groß ist, sondern weil er unbekannt ist — und weil eine unlizenzierte
Webfont auf der Seite einer Arztpraxis genau die Art Post nach sich zieht, die
niemand haben will. Wenn die Dateien aus einem Testdownload stammen, ist das
vor dem Livegang zu klären, nicht danach.

## Was nichts kostet, aber getan werden muss

**Auftragsverarbeitungsverträge** mit Netlify, Sanity und Plausible. Alle drei
stellen sie bereit, alle drei sind mit ein paar Klicks abgeschlossen — aber
ohne sie fehlt die Grundlage nach Art. 28 DSGVO. Sanity und Netlify sitzen in
den USA; mit AVV und Standardvertragsklauseln ist das der übliche und
vertretbare Weg. Plausible liegt in der EU.

**Kein Cookie-Banner nötig** — vorausgesetzt, es bleibt so:

- Schriften liegen lokal (tun sie, `web/public/fonts/`)
- Plausible setzt keine Cookies
- keine Google-Maps-Einbettung (aktuell keine im Projekt — falls eine kommt:
  statisches Bild mit Link statt iframe, sonst ist der Banner fällig)
- kein YouTube-Einbetter, kein Google Fonts CDN

Das ist ein echter Vorteil dieses Aufbaus und gehört in die Übergabe: keine
Zustimmungsabfrage heißt bessere Zahlen und weniger Ärger. Der einzige Grund,
das aufzugeben, wäre Google Analytics — und der ist es nicht wert.

**Barrierefreiheit:** Ob das BFSG greift, hängt an der Kleinstunternehmens-
Ausnahme und daran, ob über die Seite eine echte Dienstleistung abgeschlossen
wird. Ein reines Kontaktformular spricht dagegen, eine Online-Terminbuchung
dafür. Gehört in dieselbe Rechtsprüfung wie B3 — die Frage kostet dort nichts
extra.

---

## In welcher Reihenfolge

```
B1  Rechtstext-Route            ─┐
B2  Impressum-Felder            ─┤  ohne die geht nichts live
B4  Formular an Netlify Forms   ─┤
B3  Rechtsprüfung beauftragen   ─┘  läuft nebenher, dauert am längsten
W1  site: setzen                ─┐
W2  Sitemap                     ─┤  eine Sitzung zusammen
W3  404-Seite                   ─┤
W4  Öffnungszeiten + JSON-LD    ─┘
W5  Builds sammeln              ─── vor der Übergabe ans CMS
D4  Schriftlizenzen klären      ─── parallel, so früh wie möglich
D1  Sicherung                   ─┐
D2  Erreichbarkeit              ─┼  am Tag der Übergabe
D3  Zugänge übergeben           ─┘
B5  Indexsperre entfernen       ─── als Letztes, bewusst
```

B3 und D4 zuerst anstoßen, auch wenn sie nicht zuerst fertig werden — beide
hängen an anderen Leuten.
