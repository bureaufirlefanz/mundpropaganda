# Mundpropaganda

Website einer Zahnarztpraxis in Berlin Prenzlauer Berg. **Astro + Sanity** —
statisch gebaut, Inhalte aus dem CMS.

```
web/                Astro — die Website           Produkt
studio/             Sanity — das CMS              Produkt
prototypen/vite/    Handlebars-Stand              Archiv
prototypen/webflow/ Lumos-Rekonstruktion          ruhend
scripts/            Bildpipeline, Aufnahmen, Prüfungen
```

## Loslegen

```bash
npm install
npm run web        # Astro auf :4321
npm run studio     # Sanity Studio auf :3333
```

Beide laufen im Vordergrund, also zwei Terminals.

## Befehle

| Befehl | Zweck |
| --- | --- |
| `npm run web` | Dev-Server der Website, :4321 |
| `npm run web:build` | Produktions-Build nach `web/dist/` |
| `npm run web:preview` | den Build ausliefern, :4322 |
| `npm run web:check` | Typen, Rauchtest über drei Breakpoints, Barrierefreiheit |
| `npm run web:styles` | Stil-Abgleich gegen einen gesicherten Stand |
| `npm run web:deploy` | bauen und auf Netlify veröffentlichen |
| `npm run studio` | Sanity Studio, :3333 |
| `npm run images` | Quellbilder → responsive WebP/AVIF nach `web/public/img/` |
| `npm run intro` · `takt` · `erstbild` | Werkzeuge für die Ladeanimation |
| `npm run proto:dev` · `proto:build` | der eingefrorene Vite-Stand, :5173 |

## Wo was steht

| Datei | Inhalt |
| --- | --- |
| `CLAUDE.md` | Zuordnung Produkt/Prototyp, Grundregeln |
| `CMS-UMBAU.md` | die laufende Umbauliste, nach Stufen |
| `SANITY.md` | Studio, Collections, wie Inhalte an die Seite kommen |
| `web/STRUKTUR.md` | Aufbau der Astro-App — verbindlich |
| `web/CLAUDE.md` · `studio/CLAUDE.md` | was im jeweiligen Ordner gilt |

## Veröffentlichen

<https://mundpropaganda-prototyp.netlify.app> — für Suchmaschinen gesperrt
(`robots.txt` plus `X-Robots-Tag`), nicht passwortgeschützt.

Die Inhalte werden **zur Bauzeit** aus Sanity geholt. Eine Änderung im Studio
erscheint erst nach `npm run web:deploy`; automatisch wird das mit Aufgabe 14
aus `CMS-UMBAU.md`.
