/**
 * WCAG-2.2-AA-Prüfungen, die sich im Browser messen lassen.
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
  const FOKUSSIERBAR =
    "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled])," +
    ' textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
      const t = rgb[1]
        .split(/[,\s/]+/)
        .filter(Boolean)
        .map(zahl);
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
    /* Deckkraft der Vorfahren, bis zu dem Element, dessen Grund am Ende
       gilt.

       Der Grund dafür: `getComputedStyle(el).color` kennt `opacity` nicht.
       Steht am Zeilenelement `opacity: 0.42`, liest der Code weiterhin die
       volle Schriftfarbe und rechnet 8.47:1 aus, während auf dem Schirm
       2.14:1 stehen. Genau so ist es passiert — die gedämpften Zeilen in
       Standards, Benefits und Contents liefen jahrelang durch diese Prüfung,
       obwohl drei von ihnen unter 4.5:1 lagen.

       Gezählt wird nur bis zum Grund: Was darüber liegt, dämpft Text und
       Fläche gleichermaßen und ändert am Verhältnis nichts. */
    let deckkraft = 1;
    while (n && n !== document.documentElement.parentNode) {
      const cs = getComputedStyle(n);
      const o = parseFloat(cs.opacity);
      if (!Number.isNaN(o) && o < 1) deckkraft *= o;
      if (cs.backgroundImage && cs.backgroundImage !== "none")
        return { unbekannt: true };
      const f = farbe(cs.backgroundColor);
      if (f && f.a > 0) {
        gestapelt.push(f);
        if (f.a >= 0.999) break;
      }
      n = n.parentElement;
    }
    if (!gestapelt.length)
      return { farbe: { r: 255, g: 255, b: 255, a: 1 }, deckkraft };
    // Von hinten nach vorn zusammenrechnen.
    let result = { r: 255, g: 255, b: 255, a: 1 };
    for (const f of gestapelt.reverse()) result = ueber(f, result);
    return { farbe: result, deckkraft };
  }

  const bezeichne = (el) => {
    const kl = [...el.classList]
      .filter((c) => !c.startsWith("astro-"))
      .join(".");
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

    /* Die Deckkraft der Vorfahren wirkt wie eine zweite Durchsichtigkeit der
       Schriftfarbe: Beides multipliziert sich zu dem, was man sieht. */
    const wirksam = { ...vorn, a: vorn.a * g.deckkraft };
    const eff = wirksam.a < 1 ? ueber(wirksam, g.farbe) : wirksam;
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
    (
      el.getAttribute("aria-label") ||
      el.textContent ||
      el.getAttribute("title") ||
      ""
    ).trim();

  const ohneNamen = [...document.querySelectorAll("a[href], button")]
    .filter(
      (el) =>
        sichtbar(el) &&
        !nameVon(el) &&
        el.getAttribute("aria-hidden") !== "true",
    )
    .map(bezeichne);

  const bilderOhneAlt = [...document.querySelectorAll("img:not([alt])")].map(
    (i) => (i.currentSrc || i.src || "").split("/").pop(),
  );

  /* --- 3.3.2 Formularbeschriftungen ------------------------------------ */

  const felderOhneLabel = [
    ...document.querySelectorAll("input, select, textarea"),
  ]
    .filter((f) => {
      if (f.type === "hidden") return false;
      if (f.getAttribute("aria-label") || f.getAttribute("aria-labelledby"))
        return false;
      if (f.id && document.querySelector(`label[for="${CSS.escape(f.id)}"]`))
        return false;
      return !f.closest("label");
    })
    .map((f) => `${f.tagName.toLowerCase()}[name=${f.name || "?"}]`);

  /* --- 1.3.1 Überschriftenfolge ---------------------------------------- */

  const ebenen = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")]
    .filter(sichtbar)
    .map((h) => ({
      n: Number(h.tagName[1]),
      text: h.textContent.trim().slice(0, 30),
    }));

  const spruenge = [];
  for (let i = 1; i < ebenen.length; i++) {
    if (ebenen[i].n - ebenen[i - 1].n > 1) {
      spruenge.push(
        `h${ebenen[i - 1].n} → h${ebenen[i].n} bei „${ebenen[i].text}"`,
      );
    }
  }
  const h1 = ebenen.filter((e) => e.n === 1).length;

  /* --- 2.4.1 Bypass Blocks --------------------------------------------
     Der Sprung muss das ERSTE fokussierbare Element sein. Steht er weiter
     hinten, ist er nicht zu erreichen, bevor die Blöcke kommen, die er
     überspringen soll — und dann erfüllt er seinen Zweck nicht.
     -------------------------------------------------------------------- */

  const fokussierbar = [...document.querySelectorAll(FOKUSSIERBAR)].filter(
    (el) =>
      el.getBoundingClientRect().width > 0 ||
      getComputedStyle(el).position === "fixed",
  );
  const erstes = fokussierbar[0];
  const sprungZiel = erstes?.getAttribute("href") || "";
  const sprung = {
    vorhanden: Boolean(erstes && sprungZiel.startsWith("#")),
    zielExistiert: sprungZiel.startsWith("#")
      ? Boolean(document.querySelector(sprungZiel))
      : false,
    /* Ohne `tabindex` nimmt ein <main> den Fokus nicht an: Der Sprung
       verschöbe nur den Ausschnitt, und der Tabulator liefe danach weiter in
       der Navigation. */
    zielFokussierbar: sprungZiel.startsWith("#")
      ? (document.querySelector(sprungZiel)?.hasAttribute("tabindex") ?? false)
      : false,
  };

  /* --- 1.3.5 Identify Input Purpose ------------------------------------
     Nur Felder, deren Zweck eindeutig ist. `autocomplete` an einem Freitext
     zu verlangen wäre falsch — die Liste der Zwecke in WCAG kennt keinen
     dafür.
     -------------------------------------------------------------------- */

  const ZWECK = {
    name: "name",
    email: "email",
    tel: "tel",
    phone: "tel",
    callback: "tel",
    vorname: "given-name",
    nachname: "family-name",
  };

  const ohneZweck = [...document.querySelectorAll("input")]
    .filter((f) => {
      if (f.type === "hidden" || f.type === "file" || f.type === "checkbox")
        return false;
      const erwartet =
        ZWECK[(f.name || "").toLowerCase()] ||
        (f.type === "email" ? "email" : f.type === "tel" ? "tel" : null);
      return erwartet && !f.getAttribute("autocomplete");
    })
    .map((f) => `input[name=${f.name || "?"}]`);

  /* --- 2.5.8 Target Size (Minimum) -------------------------------------
     24 × 24 CSS-Pixel. Ausgenommen sind Ziele im Fließtext — ein Verweis
     mitten im Satz kann nicht größer werden, ohne die Zeile zu sprengen.
     Erkannt daran, dass der Vorfahre ein Textabsatz ist.
     -------------------------------------------------------------------- */

  const imFliesstext = (el) =>
    Boolean(el.closest("p, li, address, dd, dt, blockquote, figcaption"));

  /* Die Abstandsausnahme, ausgeschrieben. Ein Ziel darf kleiner als 24 × 24
     sein, solange um seinen Mittelpunkt ein Kreis von 24px Durchmesser passt,
     ohne den Kreis eines anderen Ziels zu schneiden. Gestapelte Verweise mit
     genug Luft dazwischen sind damit in Ordnung — und genau davon lebt eine
     Fußzeile.

     Ohne diese Rechnung meldet die Prüfung jeden Verweis in einer Linkspalte,
     und eine Prüfung, die zu viel meldet, wird genauso ignoriert wie eine, die
     zu wenig findet. */
  const mitte = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

  const ziele = fokussierbar
    .map((el) => ({ el, r: el.getBoundingClientRect() }))
    .filter(({ r }) => r.width > 0 && r.height > 0);

  const genugAbstand = (a) => {
    const ma = mitte(a.r);
    return ziele.every((b) => {
      if (b.el === a.el) return true;
      const mb = mitte(b.r);
      const d = Math.hypot(ma.x - mb.x, ma.y - mb.y);
      /* Zwei Kreise mit je 24px Durchmesser berühren sich ab 24px
         Mittenabstand. Darunter überschneiden sie sich. */
      return d >= 24;
    });
  };

  const zuKlein = ziele
    .filter(({ el, r }) => {
      if (imFliesstext(el)) return false;
      if (r.width >= 24 && r.height >= 24) return false;
      return !genugAbstand({ el, r });
    })
    .map(
      ({ el, r }) =>
        `${bezeichne(el)} ${Math.round(r.width)}×${Math.round(r.height)}`,
    );

  /* --- 1.4.11 Non-text Contrast: die Fokusanzeige ----------------------
     Gemessen wird die Umrissfarbe gegen den Grund dahinter. Ein Ring, den
     man nicht sieht, ist keine Anzeige — und genau das war der Fall, solange
     die Markenfarbe hier stand: 1.54:1 auf dem Seitengrund.
     -------------------------------------------------------------------- */

  const probe = fokussierbar.find((el) => el.getBoundingClientRect().width > 0);
  let fokusKontrast = null;
  if (probe) {
    const s = getComputedStyle(probe);
    const umriss = farbe(s.outlineColor);
    const dahinter = grund(probe);
    if (umriss && dahinter.farbe) {
      const v = verhaeltnis(umriss, dahinter.farbe);
      fokusKontrast = { ist: Math.round(v * 100) / 100, soll: 3 };
    }
  }

  /* --- 4.1.3 Status Messages -------------------------------------------
     Geprüft wird die Anwesenheit, nicht der Inhalt: Ob der Satz stimmt, kann
     kein Skript beurteilen. Dass eine Region da ist, bevor sie gebraucht
     wird, schon — und genau daran scheitert es sonst, weil eine erst später
     eingefügte Region nicht beobachtet wird.
     -------------------------------------------------------------------- */

  const brauchtStatus = Boolean(
    document.querySelector("[data-form], [data-filter]"),
  );
  const hatStatus = Boolean(
    document.querySelector('[role="status"], [aria-live]'),
  );

  return {
    kontrast,
    unpruefbar: [...unpruefbar],
    ohneNamen,
    bilderOhneAlt,
    felderOhneLabel,
    spruenge,
    h1,
    sprung,
    ohneZweck,
    zuKlein,
    fokusKontrast,
    statusFehlt: brauchtStatus && !hatStatus,
  };
}

/** Aus dem Messergebnis lesbare Befunde bauen. */
export function wcagBefunde(r) {
  const list = [];

  if (r.kontrast.length) {
    const schlimmster = r.kontrast.sort((a, b) => a.ist - b.ist)[0];
    list.push(
      `${r.kontrast.length}× Kontrast unter AA — schlechtester ${schlimmster.ist}:1 statt ${schlimmster.soll}:1 ` +
        `(${schlimmster.el}, ${schlimmster.groesse}px, „${schlimmster.text}")`,
    );
  }
  if (r.ohneNamen.length) {
    list.push(
      `${r.ohneNamen.length} Bedienelement(e) ohne zugänglichen Namen: ${r.ohneNamen[0]}`,
    );
  }
  if (r.bilderOhneAlt.length) {
    list.push(
      `${r.bilderOhneAlt.length} Bild(er) ohne alt-Attribut: ${r.bilderOhneAlt[0]}`,
    );
  }
  if (r.felderOhneLabel.length) {
    list.push(
      `${r.felderOhneLabel.length} Formularfeld(er) ohne Beschriftung: ${r.felderOhneLabel[0]}`,
    );
  }
  if (r.spruenge.length) {
    list.push(`Überschriftenebene übersprungen: ${r.spruenge[0]}`);
  }
  if (r.h1 !== 1) {
    list.push(`${r.h1} h1 auf der Seite — genau eine ist gemeint`);
  }

  /* --- WCAG 2.2 --------------------------------------------------------- */

  if (!r.sprung.vorhanden) {
    list.push(
      "2.4.1: Kein Sprung zum Inhalt als erstes fokussierbares Element",
    );
  } else if (!r.sprung.zielExistiert) {
    list.push(
      "2.4.1: Der Sprung zum Inhalt zeigt auf eine id, die es nicht gibt",
    );
  } else if (!r.sprung.zielFokussierbar) {
    list.push(
      "2.4.1: Das Sprungziel hat kein tabindex und nimmt den Fokus nicht an",
    );
  }

  if (r.ohneZweck.length) {
    list.push(
      `1.3.5: ${r.ohneZweck.length} Feld(er) ohne autocomplete: ${r.ohneZweck.join(", ")}`,
    );
  }

  if (r.zuKlein.length) {
    list.push(
      `2.5.8: ${r.zuKlein.length} Ziel(e) unter 24×24 außerhalb des Fließtexts: ${r.zuKlein[0]}`,
    );
  }

  if (r.fokusKontrast && r.fokusKontrast.ist < r.fokusKontrast.soll) {
    list.push(
      `1.4.11: Fokusanzeige nur ${r.fokusKontrast.ist}:1 gegen den Grund, ` +
        `${r.fokusKontrast.soll}:1 verlangt`,
    );
  }

  if (r.statusFehlt) {
    list.push(
      "4.1.3: Formular oder Filter auf der Seite, aber keine Statusregion",
    );
  }

  return list;
}
