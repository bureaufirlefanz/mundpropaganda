/**
 * Standorte-Gallery: die Bildreihe läuft beim Scrollen horizontal durch.
 *
 * Statt Scroll-Hijacking (pin + fixe Distanz) wird die Reihe nur um die
 * Überbreite verschoben, während die Section durchs Viewport läuft. Das
 * bleibt scrollbar wie gewohnt und fühlt sich nicht „geklaut" an.
 */
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap.js";
import { onTeardown } from "../lib/lifecycle.js";

export function initGallery() {
  initCarousel({
    section: "[data-gallery]",
    track: "[data-gallery-track]",
    item: ".s-gallery__item",
    dots: "[data-gallery-dots]",
    prev: "[data-gallery-prev]",
    next: "[data-gallery-next]",
    label: "Standort",
    startInMiddle: true,
  });

  /* Das Magazin nutzt dieselbe Mechanik — nur andere Auswahlangaben. Die
     Karten sind dort schmaler, deshalb wird linksbündig ausgerichtet statt
     mittig. */
  initCarousel({
    section: "[data-magazine]",
    track: "[data-magazine-track]",
    item: "[data-magazine-item]",
    dots: "[data-magazine-dots]",
    prev: "[data-magazine-prev]",
    next: "[data-magazine-next]",
    paged: true,
    label: "Beitrag",
    startInMiddle: false,
  });
}

/**
 * Gemeinsame Karussell-Mechanik für Standorte und Magazin.
 * Die Spur wird per transform verschoben; die Punkte entstehen aus der
 * Anzahl der Elemente, damit beim Ergänzen nichts vergessen werden kann.
 */
function initCarousel(cfg) {
  const section = document.querySelector(cfg.section);
  if (!section) return;

  const track = section.querySelector(cfg.track);
  const items = [...section.querySelectorAll(cfg.item)];
  if (!track || !items.length) return;

  const dotsBox = section.querySelector(cfg.dots);
  let index = 0;

  /**
   * Wie viele Elemente stehen nebeneinander im Bild?
   *
   * Gemessen statt gezählt: Die Karten sind in `clamp()` bemaßt und ändern
   * ihre Breite mit dem Fenster — eine feste Zahl liefe bei der nächsten
   * Fenstergröße daneben. Der Abstand steckt in der Differenz zweier
   * Startkanten, deshalb reicht ein Blick auf die ersten beiden.
   */
  function perPage() {
    if (!cfg.paged) return 1;
    const visibleWidth = track.parentElement.clientWidth;
    const step =
      items.length > 1
        ? items[1].offsetLeft - items[0].offsetLeft
        : items[0].offsetWidth;
    return Math.max(1, Math.floor(visibleWidth / step));
  }

  /* Punkte: bei seitenweisem Blättern einer je SEITE, sonst einer je Element.
     Sonst stünden unter vier gleichzeitig sichtbaren Beiträgen vier Punkte,
     von denen drei nichts bewirken. */
  let dots = [];

  function buildDots() {
    dotsBox?.replaceChildren();
    const count = cfg.paged
      ? Math.ceil(items.length / perPage())
      : items.length;
    dots = Array.from({ length: count }, (_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "s-gallery__dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `${cfg.label} ${i + 1}`);
      dot.addEventListener("click", () => go(cfg.paged ? i * perPage() : i));
      dotsBox?.append(dot);
      return dot;
    });
  }

  buildDots();

  /** Verschiebt die Spur auf das gewählte Element. */
  function go(next) {
    index = gsap.utils.clamp(0, items.length - 1, next);

    const item = items[index];
    const target = cfg.startInMiddle
      ? item.offsetLeft + item.offsetWidth / 2 - window.innerWidth / 2
      : item.offsetLeft;
    /* Nicht über die Enden hinausfahren.
     *
     * Gerechnet wird gegen den INHALTSKASTEN des Sichtfensters, nicht gegen
     * `clientWidth`. Der Unterschied ist der Innenabstand: Das Sichtfenster
     * ist `.container` mit `padding-inline: var(--site-margin)`, bei 1440px
     * also 40px je Seite. `clientWidth` zählt die mit, die Spur darf sie aber
     * nicht überfahren.
     *
     * Gemessen war die Grenze dadurch 80px zu kurz (2066 statt 2146), und die
     * Folge betraf nicht nur die Tastatur: Die letzte Karte ließ sich auch
     * über den Pfeilbutton nie vollständig ins Bild holen — sie stand immer
     * 40px über den rechten Rand hinaus. */
    const fenster = track.parentElement;
    const fensterStil = getComputedStyle(fenster);
    const sichtbar =
      fenster.clientWidth -
      parseFloat(fensterStil.paddingLeft) -
      parseFloat(fensterStil.paddingRight);
    const max = Math.max(0, track.scrollWidth - sichtbar);

    gsap.to(track, {
      x: -gsap.utils.clamp(0, max, target),
      duration: prefersReducedMotion ? 0 : 1.1,
      ease: "expo.out",
      overwrite: "auto",
    });

    const active = cfg.paged ? Math.floor(index / perPage()) : index;
    dots.forEach((d, i) =>
      d.setAttribute("aria-selected", String(i === active)),
    );
  }

  /* Ein Klick blättert eine SEITE weiter, nicht einen Beitrag. Bei vier
     nebeneinander sichtbaren Karten sprang der Pfeil sonst um eine Karte —
     das las sich wie ein Ruckeln und nicht wie Blättern. */
  const stepSize = () => (cfg.paged ? perPage() : 1);

  section
    .querySelector(cfg.next)
    ?.addEventListener("click", () => go(index + stepSize()));
  section
    .querySelector(cfg.prev)
    ?.addEventListener("click", () => go(index - stepSize()));

  /* Die Spur nachführen, wenn der Fokus in eine Karte springt.

     Ohne das lief der Tabulator durch alle Karten, aber die Spur blieb
     stehen: Die fokussierte Karte lag außerhalb des Bildes, und wer mit der
     Tastatur arbeitet, sah schlicht nicht, wo er gerade ist. Gemessen im
     Tastaturlauf über die Startseite — zwei Karten standen bei t=222 rechts
     außerhalb.

     `focusin` und nicht `focus`: Der Fokus landet auf einem Element INNERHALB
     der Karte (dem Verweis), nicht auf der Karte selbst. `focus` steigt nicht
     auf, `focusin` schon.

     Nur nachführen, wenn die Karte wirklich außerhalb liegt. Sonst rückte die
     Spur bei jedem Tabulatorschritt nach, auch wenn längst alles zu sehen
     ist — und das Bild wackelte bei jeder Bewegung. */
  track.addEventListener("focusin", (e) => {
    const karte = e.target.closest(cfg.item);
    if (!karte) return;

    const sicht = track.parentElement.getBoundingClientRect();
    const k = karte.getBoundingClientRect();
    if (k.left >= sicht.left - 1 && k.right <= sicht.right + 1) return;

    const i = items.indexOf(karte);
    if (i >= 0) go(i);
  });

  go(cfg.startInMiddle ? Math.floor(items.length / 2) : 0);

  /* Nach einem Resize voices die Offsets nicht mehr — und bei seitenweisem
     Blättern auch die Anzahl der Punkte nicht, weil dann andere viele Karten
     nebeneinander passen. */
  /* `refreshInit` ist global, nicht an diese Galerie gebunden. Ohne
     Abmeldung baute jeder spätere `ScrollTrigger.refresh()` die Punkte einer
     Galerie neu, die längst aus dem Dokument genommen wurde — und zwar für
     jede Galerie jeder bisher besuchten Seite. */
  const beiRefresh = () => {
    if (cfg.paged) buildDots();
    go(index);
  };
  ScrollTrigger.addEventListener("refreshInit", beiRefresh);
  onTeardown(() =>
    ScrollTrigger.removeEventListener("refreshInit", beiRefresh),
  );
}

/**
 * Sanfter Bild-Parallax: der Rahmen steht still, nur das Motiv darin
 * wandert. Das Bild wird dafür leicht überskaliert — genau so viel, wie die
 * Verschiebung an Rand freilegen würde.
 */
export function initMediaParallax() {
  if (prefersReducedMotion) return;

  gsap.utils.toArray("[data-parallax]").forEach((el) => {
    const amount = parseFloat(el.dataset.parallax) || 12;

    // <picture> hat display:contents und damit keine eigene Box — als
    // Trigger unbrauchbar. Also die nächste Ebene mit Ausdehnung nehmen.
    let frame = el.parentElement;
    while (frame && frame.tagName === "PICTURE") frame = frame.parentElement;
    if (!frame) return;

    /* Ohne Zuschlag geht die Rechnung exakt auf Null auf: der Überlauf
       beträgt (scale − 1) × Höhe / 2, der Weg amount/2 % der Höhe — beides
       ist derselbe Wert. Am Ende des Wegs liegt die Bildkante damit genau
       auf der Rahmenkante, und Sub-Pixel-Rundung lässt den hellen
       Rahmenhintergrund als Haarlinie durchblitzen (sichtbar an der
       gerundeten Ecke in „Form & Funktion"). Der Zuschlag hält das Bild
       immer ein paar Pixel größer als nötig. */
    const SAFETY = 0.03;

    gsap.fromTo(
      el,
      { yPercent: -amount / 2, scale: 1 + amount / 100 + SAFETY },
      {
        yPercent: amount / 2,
        ease: "none",
        scrollTrigger: {
          trigger: frame,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });
}
