/**
 * Standorte-Gallery: die Bildreihe läuft beim Scrollen horizontal durch.
 *
 * Statt Scroll-Hijacking (pin + fixe Distanz) wird die Reihe nur um die
 * Überbreite verschoben, während die Section durchs Viewport läuft. Das
 * bleibt scrollbar wie gewohnt und fühlt sich nicht „geklaut" an.
 */
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap.js";

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
    seitenweise: true,
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
  function proSeite() {
    if (!cfg.seitenweise) return 1;
    const sicht = track.parentElement.clientWidth;
    const schritt =
      items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : items[0].offsetWidth;
    return Math.max(1, Math.floor(sicht / schritt));
  }

  /* Punkte: bei seitenweisem Blättern einer je SEITE, sonst einer je Element.
     Sonst stünden unter vier gleichzeitig sichtbaren Beiträgen vier Punkte,
     von denen drei nichts bewirken. */
  let dots = [];

  function baueDots() {
    dotsBox?.replaceChildren();
    const anzahl = cfg.seitenweise
      ? Math.ceil(items.length / proSeite())
      : items.length;
    dots = Array.from({ length: anzahl }, (_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "s-gallery__dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `${cfg.label} ${i + 1}`);
      dot.addEventListener("click", () => go(cfg.seitenweise ? i * proSeite() : i));
      dotsBox?.append(dot);
      return dot;
    });
  }

  baueDots();

  /** Verschiebt die Spur auf das gewählte Element. */
  function go(next) {
    index = gsap.utils.clamp(0, items.length - 1, next);

    const item = items[index];
    const target = cfg.startInMiddle
      ? item.offsetLeft + item.offsetWidth / 2 - window.innerWidth / 2
      : item.offsetLeft;
    // Nicht über die Enden hinausfahren.
    const max = Math.max(0, track.scrollWidth - track.parentElement.clientWidth);

    gsap.to(track, {
      x: -gsap.utils.clamp(0, max, target),
      duration: prefersReducedMotion ? 0 : 1.1,
      ease: "expo.out",
      overwrite: "auto",
    });

    const aktiv = cfg.seitenweise ? Math.floor(index / proSeite()) : index;
    dots.forEach((d, i) => d.setAttribute("aria-selected", String(i === aktiv)));
  }

  /* Ein Klick blättert eine SEITE weiter, nicht einen Beitrag. Bei vier
     nebeneinander sichtbaren Karten sprang der Pfeil sonst um eine Karte —
     das las sich wie ein Ruckeln und nicht wie Blättern. */
  const schrittweite = () => (cfg.seitenweise ? proSeite() : 1);

  section.querySelector(cfg.next)?.addEventListener("click", () => go(index + schrittweite()));
  section.querySelector(cfg.prev)?.addEventListener("click", () => go(index - schrittweite()));

  go(cfg.startInMiddle ? Math.floor(items.length / 2) : 0);

  /* Nach einem Resize stimmen die Offsets nicht mehr — und bei seitenweisem
     Blättern auch die Anzahl der Punkte nicht, weil dann andere viele Karten
     nebeneinander passen. */
  ScrollTrigger.addEventListener("refreshInit", () => {
    if (cfg.seitenweise) baueDots();
    go(index);
  });
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
      }
    );
  });
}
