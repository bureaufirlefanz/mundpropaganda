/**
 * Transformation Stories.
 *
 * 1. Der Kreis-Schriftzug dreht sich mit dem Scroll. Weil es ein voller
 *    Kreis ist, läuft der Text endlos durch — es braucht keine Kopie und
 *    keinen Marquee.
 * 2. Die Bilder liegen als Kartendeck übereinander. Durchblättern per
 *    Wischen, Buttons oder Pfeiltasten; die abgelegte Karte fliegt zur
 *    Seite und reiht sich hinten wieder ein.
 */
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap.js";

export function initStories() {
  initRing();
  initDeck();
}

/* --- Kreis-Schriftzug --------------------------------------------------- */

function initRing() {
  const ring = document.querySelector("[data-stories-ring]");
  if (!ring || prefersReducedMotion) return;

  gsap.to(ring, {
    rotation: 62,
    ease: "none",
    transformOrigin: "50% 50%",
    scrollTrigger: {
      trigger: ring.closest("section") ?? ring,
      start: "top bottom",
      end: "bottom top",
      scrub: 1.1,
    },
  });
}

/* --- Kartendeck ---------------------------------------------------------
   Layout-Regel: Karte 0 liegt vorn (gerade, volle Größe), dahinter je
   Position etwas kleiner, tiefer und leicht gekippt. Ab der vierten Karte
   wird nichts mehr gezeichnet — sonst wächst der Stapel ins Unsichtbare.
   -------------------------------------------------------------------- */

const VISIBLE = 3;

function layout(cards, index, animate = true) {
  const total = cards.length;

  cards.forEach((card, i) => {
    // Position im Stapel, zyklisch ab der aktuellen Karte.
    const pos = (i - index + total) % total;
    const hidden = pos > VISIBLE;

    /* Seitlich statt vertikal gefächert: die hinteren Karten wandern
       abwechselnd nach links und rechts heraus. Ein rein vertikaler
       Versatz stapelte sie fast deckungsgleich übereinander — man sah nur
       Kanten, keine Karten. */
    const side = pos % 2 ? 1 : -1;

    const props = {
      xPercent: pos === 0 ? 0 : side * (7 + pos * 4),
      yPercent: pos * 1.6,
      scale: 1 - pos * 0.05,
      rotation: pos === 0 ? 0 : side * (2.5 + pos * 1.5),
      opacity: hidden ? 0 : 1,
      zIndex: total - pos,
      duration: animate ? 0.85 : 0,
      ease: "expo.out",
      overwrite: "auto",
    };

    gsap.to(card, props);
    card.setAttribute("aria-hidden", String(pos !== 0));
  });
}

function initDeck() {
  const deck = document.querySelector("[data-deck]");
  if (!deck) return;

  const stack = deck.querySelector("[data-deck-stack]");
  const cards = [...deck.querySelectorAll("[data-deck-card]")];
  const counter = deck.querySelector("[data-deck-count]");
  if (!stack || cards.length < 2) return;

  let index = 0;
  // Sperre während einer laufenden Bewegung: schnelles Mehrfachklicken
  // brachte sonst Index und Kartenlage auseinander.
  let busy = false;

  /* Die Zitate unterhalb gehören zu den Karten: sie wechseln mit, statt
     als eigenständiger Text danebenzustehen. */
  const quotes = [...document.querySelectorAll("[data-deck-quote]")];
  const showQuote = (i, animate = true) => {
    quotes.forEach((q, n) => q.setAttribute("data-active", String(n === i)));
    if (!quotes[i]) return;

    /* Die nicht aktiven ausdrücklich zurücksetzen: ein vorheriger Tween
       hinterlässt eine Inline-Deckkraft, die das Attribut im CSS schlägt —
       dadurch standen zwei Zitate übereinander. */
    gsap.set(
      quotes.filter((_, n) => n !== i),
      { opacity: 0 }
    );

    if (!animate || prefersReducedMotion) {
      gsap.set(quotes[i], { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      quotes[i],
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", overwrite: "auto" }
    );
  };

  const render = (animate = true) => {
    layout(cards, index, animate);
    if (counter) counter.textContent = `${index + 1} / ${cards.length}`;
    showQuote(index, animate);
  };

  /**
   * Blättert eine Karte weiter.
   *
   * Vorwärts wird die vorderste Karte zur Seite abgelegt; rückwärts kommt
   * die zuletzt abgelegte von der Seite zurück und legt sich wieder oben
   * auf. Vorher flogen in beide Richtungen Karten hinaus — rückwärts sah
   * das aus, als würde man dieselbe Karte zweimal wegwerfen.
   */
  const advance = (direction = 1) => {
    if (busy) return;

    const next = (index + direction + cards.length) % cards.length;

    if (prefersReducedMotion) {
      index = next;
      render(false);
      return;
    }

    busy = true;

    if (direction > 0) {
      // Vorwärts: oberste Karte fliegt raus, der Rest rückt auf.
      const leaving = cards[index];
      gsap
        .timeline({
          onComplete: () => {
            index = next;
            gsap.set(leaving, { xPercent: 0, opacity: 0 });
            render();
            busy = false;
          },
        })
        .to(leaving, {
          xPercent: 120,
          rotation: 14,
          opacity: 0,
          duration: 0.42,
          ease: "power2.in",
        });
      return;
    }

    // Rückwärts: die vorherige Karte kommt von der Seite zurück nach vorn.
    const returning = cards[next];
    index = next;
    gsap.set(returning, { xPercent: 120, rotation: 14, opacity: 0, zIndex: cards.length + 1 });
    render();

    gsap.to(returning, {
      xPercent: 0,
      rotation: 0,
      opacity: 1,
      duration: 0.62,
      ease: "expo.out",
      onComplete: () => {
        busy = false;
      },
    });
  };

  deck.querySelector("[data-deck-next]")?.addEventListener("click", () => advance(1));
  deck.querySelector("[data-deck-prev]")?.addEventListener("click", () => advance(-1));

  /* --- Wischen ---------------------------------------------------------
     Die vorderste Karte folgt dem Finger. Über 25 % der Kartenbreite gilt
     die Geste als Blättern, darunter federt die Karte zurück.
     ------------------------------------------------------------------ */
  let dragging = false;
  let startX = 0;
  let pointerId = null;

  stack.addEventListener("pointerdown", (e) => {
    if (prefersReducedMotion) return;
    dragging = true;
    startX = e.clientX;
    pointerId = e.pointerId;
    stack.setPointerCapture(pointerId);
    gsap.killTweensOf(cards[index]);
  });

  stack.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    gsap.set(cards[index], {
      xPercent: (dx / stack.offsetWidth) * 100,
      rotation: (dx / stack.offsetWidth) * 10,
    });
  });

  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    if (pointerId !== null) stack.releasePointerCapture(pointerId);

    const dx = e.clientX - startX;
    const threshold = stack.offsetWidth * 0.25;

    if (Math.abs(dx) > threshold) {
      // Nach links gezogen heißt vorwärts — die Karte verlässt den Stapel
      // in die Richtung, in die gewischt wurde.
      gsap.set(cards[index], { xPercent: 0, rotation: 0 });
      advance(dx < 0 ? 1 : -1);
    } else {
      gsap.to(cards[index], {
        xPercent: 0,
        rotation: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.6)",
      });
    }
  };

  stack.addEventListener("pointerup", endDrag);
  stack.addEventListener("pointercancel", endDrag);

  /* --- Tastatur --------------------------------------------------------- */
  stack.setAttribute("tabindex", "0");
  stack.setAttribute("role", "group");
  stack.setAttribute("aria-label", "Transformation Stories - Karten durchblättern");
  stack.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") advance(1);
    if (e.key === "ArrowLeft") advance(-1);
  });

  render(false);

  /* --- Auftritt ---------------------------------------------------------
     Der Stapel fächert beim ersten Sichtbarwerden aus dem Nichts auf.
     ------------------------------------------------------------------ */
  if (!prefersReducedMotion) {
    gsap.from(cards, {
      yPercent: 40,
      scale: 0.9,
      opacity: 0,
      duration: 1.3,
      stagger: 0.07,
      ease: "expo.out",
      scrollTrigger: { trigger: deck, start: "top 80%", once: true },
      onComplete: () => render(false),
    });
  }
}

/**
 * Endlos-Marquee. Zwei identische Spuren laufen versetzt; sobald die erste
 * durch ist, sitzt die zweite exakt an ihrer Stelle — nahtlose Schleife.
 * Die Richtung dreht sich mit der Scrollrichtung.
 */
export function initMarquee() {
  const marquees = document.querySelectorAll("[data-marquee]");
  if (!marquees.length || prefersReducedMotion) return;

  marquees.forEach((marquee) => {
    const track = marquee.querySelector("[data-marquee-track]");
    if (!track) return;

    // Inhalt duplizieren, damit die Schleife lückenlos ist.
    track.append(...[...track.children].map((c) => c.cloneNode(true)));

    const speed = parseFloat(marquee.dataset.marquee) || 25;
    const tween = gsap.to(track, {
      xPercent: -50,
      duration: speed,
      ease: "none",
      repeat: -1,
    });

    let direction = 1;
    ScrollTrigger.create({
      trigger: marquee,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const next = self.direction;
        if (next !== direction) {
          direction = next;
          tween.timeScale(next);
        }
      },
    });
  });
}
