/**
 * WCAG-2.1-AA-Prüfungen, die sich im Browser messen lassen.
 *
 * Bewusst nur das Automatisierbare: Kontrast, zugängliche Namen,
 * Formularbeschriftungen, Überschriftenfolge, sichtbarer Fokus. Ob ein
 * Alternativtext den Inhalt trifft, kann kein Skript beurteilen — dafür gibt
 * es keine Prüfung, und deshalb steht hier auch keine, die so täte.
 *
 * Läuft mit abgeschalteter Bewegung: sonst sind die Reveals noch auf
 * Deckkraft 0, und jeder Text davon fiele als „unsichtbar" durch.
 */

/** Im Seitenkontext ausgeführt. Gibt reine Daten zurück. */
export function pruefeSeite() {
  /* --- Farben --------------------------------------------------------- */

  const zahl = (s) => parseFloat(s);

  /** Nimmt `rgb()`, `rgba()` und `color(srgb …)` — color-mix liefert Letzteres. */
  function farbe(wert) {
    if (!wert || wert === "transparent") return null;

    const srgb = wert.match(/^color\(srgb\s+([^)]+)\)$/);
    if (srgb) {
      const teile = srgb[1].split("/");
      const [r, g, b] = teile[0].trim().split(/\s+/).map(zahl);
      const a = teile[1] ? zahl(teile[1]) : 1;
      return { r: r * 255, g: g * 255, b: b * 255, a };
    }

    const rgb = wert.match(/^rgba?\(([^)]+)\)$/);
    if (rgb) {
      const t = rgb[1].split(/[,\s/]+/).filter(Boolean).map(zahl);
      return { r: t[0], g: t[1], b: t[2], a: t.length > 3 ? t[3] : 1 };
    }
    return null;
  }

  /** Halbdurchsichtige Farbe auf einen Grund rechnen. */
  const ueber = (vorn, hinten) => ({
    r: vorn.r * vorn.a + hinten.r * (1 - vorn.a),
    g: vorn.g * vorn.a + hinten.g * (1 - vorn.a),
    b: vorn.b * vorn.a + hinten.b * (1 - vorn.a),
    a: 1,
  });

  function leuchtdichte({ r, g, b }) {
    const k = [r, g, b].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * k[0] + 0.7152 * k[1] + 0.0722 * k[2];
  }

  function verhaeltnis(a, b) {
    const la = leuchtdichte(a);
    const lb = leuchtdichte(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }

  /**
   * Der Grund hinter einem Element. Läuft die Vorfahren hoch, bis eine
   * deckende Farbe kommt. Liegt unterwegs ein Bild oder Verlauf, ist der
   * Kontrast nicht zu berechnen — dann sagen wir das, statt zu raten.
   */
  function grund(el) {
    let n = el;
    let gestapelt = [];
    while (n && n !== document.documentElement.parentNode) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== "none") return { unbekannt: true };
      const f = farbe(cs.backgroundColor);
      if (f && f.a > 0) {
        gestapelt.push(f);
        if (f.a >= 0.999) break;
      }
      n = n.parentElement;
    }
    if (!gestapelt.length) return { farbe: { r: 255, g: 255, b: 255, a: 1 } };
    // Von hinten nach vorn zusammenrechnen.
    let ergebnis = { r: 255, g: 255, b: 255, a: 1 };
    for (const f of gestapelt.reverse()) ergebnis = ueber(f, ergebnis);
    return { farbe: ergebnis };
  }

  const bezeichne = (el) => {
    const kl = [...el.classList].filter((c) => !c.startsWith("astro-")).join(".");
    return `${el.tagName.toLowerCase()}${kl ? "." + kl : ""}`;
  };

  const sichtbar = (el) => {
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") return false;
    if (parseFloat(cs.opacity) < 0.05) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  /* --- 1.4.3 Kontrast -------------------------------------------------- */

  const kontrast = [];
  const unpruefbar = new Set();

  for (const el of document.querySelectorAll("body *")) {
    // Nur Elemente mit eigenem Text, nicht deren Hüllen.
    const text = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join("");
    if (!text || !sichtbar(el)) continue;

    const cs = getComputedStyle(el);

    /* Konturschrift: die Füllung ist absichtlich durchsichtig, gezeichnet wird
       der Umriss (`-webkit-text-stroke`). Gegen die Füllung gerechnet käme
       immer 1:1 heraus — ein Fehlbefund. Der Umriss ist mit dieser Rechnung
       nicht zu beurteilen, deshalb wandert die Stelle zu den unprüfbaren. */
    const strichbreite = parseFloat(cs.webkitTextStrokeWidth || "0");
    if (strichbreite > 0 && farbe(cs.color)?.a === 0) {
      unpruefbar.add(bezeichne(el) + " (Konturschrift)");
      continue;
    }

    const vorn = farbe(cs.color);
    if (!vorn || vorn.a === 0) continue;

    const g = grund(el);
    if (g.unbekannt) {
      unpruefbar.add(bezeichne(el));
      continue;
    }

    const eff = vorn.a < 1 ? ueber(vorn, g.farbe) : vorn;
    const v = verhaeltnis(eff, g.farbe);

    const groesse = parseFloat(cs.fontSize);
    const fett = parseInt(cs.fontWeight, 10) >= 700;
    const gross = groesse >= 24 || (groesse >= 18.66 && fett);
    const soll = gross ? 3 : 4.5;

    if (v < soll) {
      kontrast.push({
        el: bezeichne(el),
        text: text.slice(0, 40),
        ist: Math.round(v * 100) / 100,
        soll,
        groesse: Math.round(groesse),
      });
    }
  }

  /* --- 1.1.1 / 4.1.2 Namen --------------------------------------------- */

  const nameVon = (el) =>
    (el.getAttribute("aria-label") || el.textContent || el.getAttribute("title") || "").trim();

  const ohneNamen = [...document.querySelectorAll("a[href], button")]
    .filter((el) => sichtbar(el) && !nameVon(el) && el.getAttribute("aria-hidden") !== "true")
    .map(bezeichne);

  const bilderOhneAlt = [...document.querySelectorAll("img:not([alt])")].map(
    (i) => (i.currentSrc || i.src || "").split("/").pop()
  );

  /* --- 3.3.2 Formularbeschriftungen ------------------------------------ */

  const felderOhneLabel = [...document.querySelectorAll("input, select, textarea")]
    .filter((f) => {
      if (f.type === "hidden") return false;
      if (f.getAttribute("aria-label") || f.getAttribute("aria-labelledby")) return false;
      if (f.id && document.querySelector(`label[for="${CSS.escape(f.id)}"]`)) return false;
      return !f.closest("label");
    })
    .map((f) => `${f.tagName.toLowerCase()}[name=${f.name || "?"}]`);

  /* --- 1.3.1 Überschriftenfolge ---------------------------------------- */

  const ebenen = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")]
    .filter(sichtbar)
    .map((h) => ({ n: Number(h.tagName[1]), text: h.textContent.trim().slice(0, 30) }));

  const spruenge = [];
  for (let i = 1; i < ebenen.length; i++) {
    if (ebenen[i].n - ebenen[i - 1].n > 1) {
      spruenge.push(`h${ebenen[i - 1].n} → h${ebenen[i].n} bei „${ebenen[i].text}"`);
    }
  }
  const h1 = ebenen.filter((e) => e.n === 1).length;

  return {
    kontrast,
    unpruefbar: [...unpruefbar],
    ohneNamen,
    bilderOhneAlt,
    felderOhneLabel,
    spruenge,
    h1,
  };
}

/** Aus dem Messergebnis lesbare Befunde bauen. */
export function wcagBefunde(r) {
  const liste = [];

  if (r.kontrast.length) {
    const schlimmster = r.kontrast.sort((a, b) => a.ist - b.ist)[0];
    liste.push(
      `${r.kontrast.length}× Kontrast unter AA — schlechtester ${schlimmster.ist}:1 statt ${schlimmster.soll}:1 ` +
        `(${schlimmster.el}, ${schlimmster.groesse}px, „${schlimmster.text}")`
    );
  }
  if (r.ohneNamen.length) {
    liste.push(`${r.ohneNamen.length} Bedienelement(e) ohne zugänglichen Namen: ${r.ohneNamen[0]}`);
  }
  if (r.bilderOhneAlt.length) {
    liste.push(`${r.bilderOhneAlt.length} Bild(er) ohne alt-Attribut: ${r.bilderOhneAlt[0]}`);
  }
  if (r.felderOhneLabel.length) {
    liste.push(`${r.felderOhneLabel.length} Formularfeld(er) ohne Beschriftung: ${r.felderOhneLabel[0]}`);
  }
  if (r.spruenge.length) {
    liste.push(`Überschriftenebene übersprungen: ${r.spruenge[0]}`);
  }
  if (r.h1 !== 1) {
    liste.push(`${r.h1} h1 auf der Seite — genau eine ist gemeint`);
  }

  return liste;
}
