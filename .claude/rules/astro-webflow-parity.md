---
paths:
  - "web/src/**/*.astro"
  - "web/src/**/*.css"
  - "src/styles/**/*.css"
  - "src/partials/**/*.hbs"
---

# CSS-Konventionen und Webflow-Übersetzbarkeit

Dieses Projekt soll perspektivisch als Webflow-Site auf Basis von **Lumos v2** rekonstruiert
werden. `src/styles/tokens.css` sagt es selbst: *"jede Custom Property wird später eine
Webflow-Variable."* Die folgenden Regeln halten diese Übersetzung 1:1 statt zu einem Neubau.

## Die bestehende Konvention gilt weiter

Nicht auf Lumos-Namen umschreiben. Die vorhandene BEM-Konvention bleibt:

- `s-*` — Seitenabschnitt (`s-benefits`, `s-hero`)
- `c-*` — wiederverwendbare Komponente (`c-btn`, `c-accordion`)
- `__element` — Kindelement (`s-benefits__title`)
- `--modifier` — Variante (`c-btn--dark`)
- `container` — Layout-Utility

Sie ist konsistent und übersetzt sich sauber. Ein Umbau auf Lumos-Grammatik im Astro-Code
brächte keinen Vorteil und riskiert Regressionen.

## Übersetzungstabelle → Webflow/Lumos

Beim Aufbau in Webflow gilt diese Abbildung. Sie ist der Grund, warum die Konvention eingehalten
werden muss — jede Abweichung erzeugt Handarbeit.

| Hier | Webflow/Lumos |
|---|---|
| `s-benefits` | `benefits_wrap` (Custom Class, `_wrap` startet die Komponente) |
| `s-benefits__inner` | `benefits_contain` |
| `s-benefits__title` | `benefits_title` + `u-text-style-h2` |
| `c-btn` | `button_wrap` |
| `c-btn__label` | `button_label` |
| `c-btn--dark` | Combo-Class `is-dark` |
| `container` | Lumos-Container-Utility |
| `--c-brand` | Variable `swatch/brand-500` (Default-Collection) |
| `--c-bg`, `--c-text` | Variablen in der **Theme**-Collection, aliased auf Swatches |
| `--fs-h1` | `text-style/*`-Mode in der Text-Style-Collection |
| `--sp-*` | `space/1` … `space/8` |

Lumos erlaubt **maximal 3 Unterstriche** in einer Custom Class. Verschachtelte BEM-Namen mit mehr
als zwei `__`-Ebenen brechen diese Regel — beim Anlegen neuer Bausteine flach bleiben.

## Was die Übersetzbarkeit erhält

- **Ein Element, eine semantische Klasse.** Keine atomaren Utility-Klassen, kein Tailwind.
  Webflows Modell ist Klasse-pro-Element mit Combo-Classes; atomare Utilities erzeugen dort
  hunderte Müll-Combos. Das ist der eine Fehler, der eine Übersetzung unmöglich macht.
- **Jeder Wert ist ein Token.** Keine Magic Numbers, keine Hex-Werte im Regelwerk.
  `tokens.css` ist die einzige Quelle.
- **`clamp()` für fluide Größen.** Webflow-Variablen nehmen rohe CSS-Ausdrücke über `custom_value`
  entgegen — `clamp()` und `color-mix()` überleben die Übersetzung unverändert. Beides ist hier
  bereits im Einsatz und soll so bleiben.
- **Flache Selektoren.** Webflow-Klassen sind flach; `.a .b .c span` hat dort keine Entsprechung.
- **Container Queries** statt Media Queries, wo möglich — Lumos v2 ist breakpointless.

## Offener Punkt: px im Spacing

`--sp-*` ist in px definiert. Lumos verlangt rem, damit Layouts bei erhöhter Nutzer-Schriftgröße
umbrechen statt zu überlaufen (Ziel: bei 200 % Schriftgröße läuft kein Text über).

Die Typo-Skala ist bereits rem-basiert — nur das Spacing nicht. **Nicht eigenmächtig umstellen**,
das berührt jedes Layout. Beim Übertragen nach Webflow als `space/*` in rem anlegen und die
Abweichung benennen.

## Was nie überträgt

Astro-Islands, clientseitiges JS, GSAP/Lenis-Choreografien, Content Collections, Build-Logik.
Webflow-Interaktionen (IX3) lassen sich **über MCP gar nicht** anlegen — das ist Handarbeit im
Designer. Bausteine, deren Wirkung an der Animation hängt, portieren nicht von selbst.
