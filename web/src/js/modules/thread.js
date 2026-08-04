/**
 * Der durchlaufende Pfad zeichnet sich beim Scrollen ein.
 *
 * Die Linie beginnt an der Standards-Section und endet vor den
 * Story-Karten. Sie wächst genau in dem Maß, in dem man sich durch diesen
 * Abschnitt bewegt — dadurch liest sie sich als Spur, die man selbst zieht,
 * und nicht als Dekoration, die zufällig auch animiert ist.
 */
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap.js";

/* Fensterhöhe, auf der die Spitze der Linie mitwandert. */
const TIP = 92;

/* Höhe des viewBox in thread.hbs. */
const VIEWBOX_H = 6400;

/**
 * Tabelle: zu welcher Höhe im viewBox gehört welche Stricklänge.
 *
 * Der naheliegende Weg — Scroll-Fortschritt linear auf die Strichlänge
 * legen — hält die Spitze nicht auf konstanter Höhe. Bogenlänge und
 * Seitenhöhe laufen nämlich auseinander: die großen Schwünge in den
 * Standards verbrauchen pro Seitenpixel weit mehr Weg als die ruhigen
 * Abschnitte, die Spitze bleibt dort zurück (gemessen: 393 px Schwankung).
 * Deshalb wird die Länge über die Höhe nachgeschlagen, nicht gerechnet.
 *
 * Gemessen wird im Bildschirmraum: getTotalLength() liefert
 * viewBox-Einheiten, `vector-effect: non-scaling-stroke` rechnet Striche
 * aber in Bildschirmpixeln — dazwischen liegen hier rund 2000 px.
 * (pathLength im Markup wäre der kürzere Weg, wird bei non-scaling-stroke
 * jedoch nicht angewandt.)
 */
/* 240 statt 900 Stützstellen. Der viewBox ist 6400 Einheiten hoch, das sind
   rund 27 Einheiten je Stelle — auf dem Schirm etwa 8 px, zwischen denen
   ohnehin linear interpoliert wird. Die Tabelle war viermal feiner als das,
   was sie auflösen muss, und das Messen ist der teuerste Einzelposten beim
   Start: mit 900 Stellen 772 ms, in denen der Browser nichts zeichnet und die
   Hero-Choreografie stillsteht. */
function measure(path, samples = 240) {
  const ctm = path.getScreenCTM();
  if (!ctm) return { table: [], total: 0 };

  /* Die Abbildung eines SVG-Viewports auf den Schirm ist eine reine
     Skalierung mit Verschiebung — keine Drehung, keine Scherung. Also einmal
     die Maßstäbe lesen und die Abstände selbst skalieren, statt für jede
     Stützstelle ein neues SVGPoint durch matrixTransform() zu schicken. Das
     war neben getPointAtLength() der zweite große Posten. */
  const sx = ctm.a;
  const sy = ctm.d;

  const geometric = path.getTotalLength();
  const table = [];
  let acc = 0;
  let vorX = 0;
  let vorY = 0;

  for (let i = 0; i <= samples; i++) {
    const roh = path.getPointAtLength((geometric * i) / samples);
    const x = roh.x;
    const y = roh.y;
    if (i) acc += Math.hypot((x - vorX) * sx, (y - vorY) * sy);
    vorX = x;
    vorY = y;
    table.push({ y, len: acc });
  }

  return { table, total: acc };
}

/** Strichlänge bis zu einer Höhe im viewBox. */
function lengthAt(table, total, y) {
  if (!table.length) return 0;
  if (y <= table[0].y) return 0;
  if (y >= table[table.length - 1].y) return total;

  let lo = 0;
  let hi = table.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (table[mid].y < y) lo = mid;
    else hi = mid;
  }

  const a = table[lo];
  const b = table[hi];
  const t = b.y === a.y ? 0 : (y - a.y) / (b.y - a.y);
  return a.len + t * (b.len - a.len);
}

export function initThread() {
  const thread = document.querySelector("[data-thread]");
  if (!thread) return;

  const line = thread.querySelector(".s-thread__line");
  if (!line) return;

  // Das CSS hält die Linie verdeckt, bis die Länge feststeht.
  const reveal = () => gsap.set(thread, { visibility: "visible" });

  // Ohne Bewegung steht die Linie einfach fertig da. Ein Pfad, der nie
  // gezeichnet wird, wäre schlicht unsichtbar.
  if (prefersReducedMotion) {
    reveal();
    return;
  }

  /* Kein Messen an dieser Stelle: der ScrollTrigger unten ruft `onRefresh`
     schon beim Anlegen, und das misst. Vorher lief `measure` deshalb zweimal
     hintereinander — die teuerste Operation des ganzen Starts, doppelt. */
  let table = [];
  let total = 0;

  // Nachlaufen statt harter Kopplung — dasselbe weiche Verhalten wie ein
  // scrub-Wert, nur dass hier der Zielwert selbst berechnet wird.
  const setOffset = gsap.quickTo(line, "strokeDashoffset", {
    duration: 0.5,
    ease: "power2",
  });

  const draw = () => {
    const rect = thread.getBoundingClientRect();
    if (!rect.height) return;

    // Fensterhöhe der Spitze -> Höhe im viewBox -> Strichlänge dorthin.
    const target = (window.innerHeight * TIP) / 100;
    const y = ((target - rect.top) / rect.height) * VIEWBOX_H;
    setOffset(total - lengthAt(table, total, y));
  };

  ScrollTrigger.create({
    trigger: thread,
    start: "top bottom",
    end: "bottom top",
    onUpdate: draw,
    /* Die Maße hängen an der Fensterbreite (die SVG ist min(92vw, 1200px))
       und an der Fensterhöhe. Beides muss nach einem Resize neu gemessen
       werden, sonst bliebe ein Rest ungezeichnet. */
    onRefresh: () => {
      ({ table, total } = measure(line));
      // strokeDashoffset mit: beim ersten Lauf steht die Linie noch auf 0 und
      // wäre damit vollständig gezeichnet, bevor `draw` sie zurücknimmt.
      gsap.set(line, { strokeDasharray: total, strokeDashoffset: total });
      reveal();
      draw();
    },
  });

  /* Kein eigenes ScrollTrigger.refresh() mehr. Das Anlegen oben hat `onRefresh`
     bereits ausgelöst, und init.js vermisst am Ende ohnehin alles neu — ein
     dritter Durchgang hieße ein drittes Mal messen. */
}
