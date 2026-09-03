/**
 * Bild-Ring: die Motive sitzen auf einem Zylinder, der um den Betrachter
 * kreist. Er läuft von selbst weiter und lässt sich mit der Maus oder dem
 * Finger drehen.
 *
 * Der Betrachter steht INNEN, nicht davor: Die Wölbung geht nach innen, die
 * Karten kommen an den Rändern auf einen zu und laufen seitlich aus dem Bild.
 *
 * Das ist eine Vorzeichenfrage. Die Karten sitzen auf der ABGEWANDTEN Seite
 * der Achse (translateZ(−r) statt +r), dadurch schauen wir auf die Innenwand
 * des Zylinders:
 *
 *   Mitte (Winkel 0)   z = −r  → am weitesten weg, kleinste Darstellung
 *   Rand  (Winkel 90°) z = +t  → am nächsten, größte Darstellung
 *
 * Nach außen gewölbt wäre es genau andersherum, mit der Mitte vorn.
 *
 * Die Geometrie wird gemessen, nicht gesetzt: Der Radius folgt aus der
 * tatsächlichen Kartenbreite, damit die Karten bei jeder Fenstergröße
 * lückenlos aneinanderstoßen, ohne sich zu überlappen.
 *
 *   r = (Breite + Abstand) / (2 · tan(π / Anzahl))
 *
 * Die Rückseite verbirgt sich von selbst: Karten hinter dem Betrachter
 * zeigen uns ihre Rückseite, und die ist über `backface-visibility`
 * unsichtbar. Deshalb braucht es kein Aussortieren im Skript — und deshalb
 * kann auch nichts durch die Bildebene brechen.
 */
import { gsap, prefersReducedMotion } from "../lib/gsap.js";
import { pageSignal, onTeardown } from "../lib/lifecycle.js";

/** Grad pro Sekunde im Leerlauf. Bewusst langsam — es soll treiben, nicht fahren. */
const SPEED = 3.4;

/** Wie stark der Schwung nach dem Loslassen nachlässt (pro Sekunde). */
const FRICTION = 2.4;

/** Darunter gilt der Schwung als ausgelaufen und der Leerlauf greift wieder. */
const REST = 3;

/**
 * Höchstausschlag der Bildverschiebung, als Anteil der KARTENBREITE.
 *
 * Der Wert muss zum Vorrat passen, den das CSS bereitstellt
 * (`--image-pool`), sonst liefe an einer Kante der Grund durch. Deshalb
 * wird er unten in Pixel umgerechnet und nicht als Prozentwert gesetzt:
 * `translateX` in Prozent bezieht sich auf die Breite des BILDES, und das
 * ist mit dem Vorrat auf beiden Seiten 18 % breiter als der Rahmen. 9 %
 * Ausschlag wären dadurch 10.6 % des Rahmens gewesen — knapp über dem
 * Vorrat, und an schräg stehenden Karten blitzte der Grund durch.
 *
 * 0.18 gegen 19 % Vorrat im CSS: ein Prozentpunkt Luft, damit auch bei einer
 * gerundeten Kartenbreite nichts an den Rand stößt.
 */
const PARALLAX = 0.18;

export function initRing() {
  document.querySelectorAll("[data-ring]").forEach(buildRing);
}

function buildRing(root) {
  const stage = root.querySelector("[data-ring-stage]");
  const rotor = root.querySelector("[data-ring-rotor]");
  const cards = [...root.querySelectorAll("[data-ring-card]")];
  if (!stage || !rotor || cards.length < 3) return;

  /* Einmal eingesammelt statt je Bild neu gesucht: `draw` läuft in jedem
     Bild, und eine Abfrage je Karte und Bild wären 1200 Suchen je Sekunde. */
  const images = cards.map((k) => k.querySelector("img"));

  /* Der Höchstausschlag in Pixeln. Wird in `measure` gesetzt, weil er an
     der Kartenbreite hängt — dieselbe Messung, aus der auch der Radius
     entsteht. */
  let amplitude = 0;

  const count = cards.length;
  const step = 360 / count;
  const reduced = prefersReducedMotion;

  let radius = 0;
  let angle = 0;
  let momentum = 0; // Grad pro Sekunde, nur nach dem Ziehen
  let dragging = false;
  let turning = false; // läuft eine Pfeil-Bewegung?
  /* Tempofaktor statt Schalter: 1 = volle Fahrt, 0 = steht. Der Zeiger
     schiebt ihn sanft auf null, statt die Bewegung abzuschneiden. */
  const drive = { speed: 1 };

  /* --- Geometrie ------------------------------------------------------ */

  function measure() {
    const width = cards[0].offsetWidth;
    // Der Abstand steht im CSS, damit Aussehen und Rechnung nicht auseinanderlaufen.
    const gap =
      parseFloat(getComputedStyle(root).getPropertyValue("--ring-gap")) || 0;
    radius = Math.round((width + gap) / (2 * Math.tan(Math.PI / count)));
    amplitude = width * PARALLAX;

    /* Minus: die Karten sitzen auf der abgewandten Seite der Achse, wir
       schauen von innen auf die Wand. Plus wäre die Wölbung nach außen. */
    cards.forEach((card, i) => {
      card.style.transform = `rotateY(${i * step}deg) translateZ(${-radius}px)`;
    });

    /* Die Tiefe hängt am Radius, nicht an einer festen Zahl — sonst wäre die
       Krümmung bei jeder Fenstergröße eine andere.

       Der Faktor bestimmt, wie stark die Perspektive zupackt: je größer,
       desto flacher. Bei 1.5 war der Größenunterschied zwischen Mitte und
       Rand rund ein Fünftel, bei 2.2 nur noch ein Fünfzehntel — die Kurve
       kommt dann fast nur noch aus der Drehung der Karten selbst. */
    stage.style.perspective = `${Math.round(radius * 2.2)}px`;
  }

  /* --- Zeichnen ------------------------------------------------------- */

  function draw() {
    /* Ein knappes Viertel Radius nach vorn: dadurch liegen die seitlichen
       Karten leicht VOR der Bildebene und schieben sich am Rand über den
       Betrachter hinweg, statt an ihr zu enden. Stünde hier 0, endete der
       Zylinder genau in der Bildebene und der Eindruck, mittendrin zu sein,
       ginge verloren.

       Der Wert ist der Abstand zum Betrachter — je größer, desto näher und
       größer alles. Nach oben begrenzt ihn der Perspektivfaktor (2.2, siehe
       oben): dort läge der Zylinderrand im Auge und die Darstellung risse
       auseinander. 0.45 war spürbar zu nah, 0.22 lässt Luft, ohne die
       Wölbung zu verlieren.

       Das negative Vorzeichen am Winkel gehört zur Innenwölbung: die Karten
       liegen bei −r, eine positive Drehung schöbe sie entgegen der
       Zugrichtung. So bleibt „nach rechts ziehen" auch „nach rechts". */
    rotor.style.transform = `translateZ(${Math.round(radius * 0.22)}px) rotateY(${-angle}deg)`;

    /* Tiefe sichtbar machen. Anders als bei der Wölbung nach außen ist hier
       die MITTE am weitesten weg — die Helligkeit folgt der Entfernung, nicht
       der Bildmitte. Bewusst zurückhaltend: im Zylinder steht man in einem
       Raum, nicht vor einer Bühne. */
    cards.forEach((card, i) => {
      const cardAngle = (((i * step - angle) % 360) + 360) % 360;
      const depth = Math.cos((cardAngle * Math.PI) / 180); // 1 = Mitte, −1 = hinter uns
      const proximity = (1 - depth) / 2; // 0 in der Mitte, 1 an den Rändern
      card.style.filter = `brightness(${(0.9 + 0.1 * proximity).toFixed(3)})`;

      /* Leichte Verschiebung des Motivs im Rahmen. Der Ausschlag folgt dem
         Sinus des Kartenwinkels: null, wenn die Karte frontal steht, und am
         größten, wenn sie seitlich steht — dieselbe Kurve, nach der sich
         auch ihre Lage auf dem Zylinder ergibt.

         Das Vorzeichen ist negativ, damit das Motiv der Bewegung des Rahmens
         nachläuft statt ihr vorauszueilen. Genau daraus entsteht der
         Eindruck von Tiefe: Was hinter einem Fenster liegt, wandert
         langsamer als das Fenster selbst. */
      const image = images[i];
      if (image && !reduced) {
        const lateral = Math.sin((cardAngle * Math.PI) / 180);
        image.style.transform = `translateX(${(-lateral * amplitude).toFixed(1)}px)`;
      }
    });
  }

  /* --- Lauf ----------------------------------------------------------- */

  function tick() {
    const dt = gsap.ticker.deltaRatio(60) / 60; // Sekunden seit dem letzten Bild
    if (!dragging && !turning) {
      /* Der Faktor liegt NUR auf dem Leerlauf, nicht auf dem Nachschwung.
         Sonst schlagen Überfahren und Ziehen einander tot: Nach dem
         Loslassen steht der Zeiger ja noch auf dem Ring, der Faktor ist
         null — und der eben erzeugte Schwung wäre im selben Bild erstickt.
         Gezogen wird bewusst, der Leerlauf läuft nebenbei; deshalb hat das
         Ziehen Vorrang. */
      if (Math.abs(momentum) > REST) {
        angle += momentum * dt;
        momentum -= momentum * Math.min(1, FRICTION * dt);
      } else {
        momentum = 0;
        if (!reduced) angle += SPEED * drive.speed * dt;
      }
      draw();
    }
  }

  /* --- Ziehen ---------------------------------------------------------- */

  let lastX = 0;
  let lastTime = 0;

  /* Ein Pixel Zeigerweg soll die vorderste Karte um genau einen Pixel
     verschieben. Das ist der Bogenmaß-Zusammenhang, keine Geschmacksgröße:
     dφ = dx / r. */
  const degreesPerPixel = () => 180 / (Math.PI * Math.max(radius, 1));

  stage.addEventListener("pointerdown", (e) => {
    dragging = true;
    momentum = 0;
    lastX = e.clientX;
    lastTime = e.timeStamp;
    stage.setPointerCapture(e.pointerId);
    root.dataset.ringDragging = "true";
  });

  stage.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dt = Math.max(1, e.timeStamp - lastTime) / 1000;
    const dGrad = dx * degreesPerPixel();

    angle += dGrad;
    momentum = dGrad / dt;
    lastX = e.clientX;
    lastTime = e.timeStamp;
    draw();
  });

  const release = (e) => {
    if (!dragging) return;
    dragging = false;
    delete root.dataset.ringDragging;
    if (e.pointerId != null && stage.hasPointerCapture?.(e.pointerId)) {
      stage.releasePointerCapture(e.pointerId);
    }
    /* Zeigt der Schwung entgegen dem Leerlauf, läuft er aus und der Ring
       kehrt in seine Richtung zurück — kein harter Umschlag. */
    momentum = gsap.utils.clamp(-900, 900, momentum);
  };

  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);

  /* --- Überfahren -------------------------------------------------------
     Der Ring läuft aus, solange der Zeiger auf ihm steht — mehr nicht. Wer
     ein Motiv ansehen will, soll es nicht verfolgen müssen. Am Rand des
     Bereichs und nicht an den einzelnen Karten, damit das Ausrollen nicht
     flackert, während die Karten unter dem stehenden Zeiger durchwandern. */

  const rampSpeed = (target, duration) => {
    gsap.to(drive, {
      speed: target,
      duration: reduced ? 0 : duration,
      ease: "power2.out",
      overwrite: true,
    });
  };

  /* Auslaufen ist kürzer als Anlaufen: Anhalten soll auf den Zeiger
     antworten, Wiederanfahren darf sich Zeit lassen und nicht anspringen. */
  stage.addEventListener("pointerenter", () => rampSpeed(0, 0.7));
  stage.addEventListener("pointerleave", () => rampSpeed(1, 1.1));

  /* --- Tasten und Buttons ------------------------------------------------
     Ziehen ist eine Zugabe für die Maus. Bedienbar muss der Ring auch mit
     der Tastatur sein — dafür die beiden Buttons und die Pfeiltasten. */

  const turn = (direction) => {
    momentum = 0;
    /* Der Leerlauf pausiert währenddessen. Vorher schrieben beide denselben
       Winkel: der Leerlauf zählte weiter hoch, die Bewegung sprang auf ihren
       bei Klickbeginn festgehaltenen Zielwert zurück — sichtbar blieb davon
       fast nichts.

       Und die Bewegung zählt einen ZUWACHS, keinen Zielwert. Dadurch bleibt
       sie richtig, egal was den Winkel sonst noch bewegt hat. */
    turning = true;
    const progress = { d: 0 };
    let previous = 0;

    gsap.to(progress, {
      d: direction * step,
      duration: 0.6,
      ease: "power3.out",
      overwrite: true,
      onUpdate() {
        angle += progress.d - previous;
        previous = progress.d;
        draw();
      },
      onComplete() {
        turning = false;
      },
    });
  };

  root
    .querySelector("[data-ring-prev]")
    ?.addEventListener("click", () => turn(1));
  root
    .querySelector("[data-ring-next]")
    ?.addEventListener("click", () => turn(-1));

  stage.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      turn(1);
      e.preventDefault();
    }
    if (e.key === "ArrowRight") {
      turn(-1);
      e.preventDefault();
    }
  });

  /* --- Start ----------------------------------------------------------- */

  measure();
  draw();
  gsap.ticker.add(tick);

  let measureTimer;
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(measureTimer);
      measureTimer = setTimeout(() => {
        measure();
        draw();
      }, 150);
    },
    { signal: pageSignal() },
  );

  /* Der Ticker schreibt jedes Bild `transform` und `filter` auf jede Karte.
     Ohne Abmeldung läuft er nach dem Seitenwechsel weiter — auf Karten, die
     aus dem Dokument genommen wurden, und zusätzlich zu dem Ticker, den der
     nächste Aufruf anlegt. */
  onTeardown(() => {
    gsap.ticker.remove(tick);
    clearTimeout(measureTimer);
  });
}
