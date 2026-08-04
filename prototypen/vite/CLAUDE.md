# Vite-Prototyp — eingefroren

**Archiv. Nicht ändern, wenn nicht ausdrücklich danach gefragt.**

Der ursprüngliche Handlebars-Stand, aus dem die Astro-App entstanden ist. Er
liegt hier, weil sich an ihm ablesen lässt, wie ein Abschnitt gedacht war,
bevor er in Bausteine zerfiel — nicht, weil er noch gepflegt würde.

```bash
npm run proto:dev      # → http://localhost:5173
npm run proto:build
```

## Was er sich leiht

Seit A2 besitzt das Produkt sein Fundament, und dieser Stand borgt es:

| Hier | Von dort |
|---|---|
| `src/js/main.js` → Tokens, Basis-CSS | `web/src/styles/` |
| `src/js/main.js` → Modulliste | `web/src/js/init.js` |
| statische Dateien (`publicDir`) | `web/public/` |

`src/styles/components.css` und `sections.css` gehören ihm allein — die
Astro-App bindet sie bewusst nicht ein, dort liegen Komponentenstile bei den
Komponenten.

## Dass er baut, ist keine Zusage

Er zeigt auf `web/src/…` und baut, solange dort nichts umgebaut wird. Wenn er
irgendwann nicht mehr baut, ist das **kein Fehler**, sondern die erwartete
Folge davon, dass das Produkt weitergeht. Dann wird er nicht repariert,
sondern gelesen.
