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

/** Grad pro Sekunde im Leerlauf. Bewusst langsam — es soll treiben, nicht fahren. */
const TEMPO = 3.4;

/** Wie stark der Schwung nach dem Loslassen nachlässt (pro Sekunde). */
const REIBUNG = 2.4;

/** Darunter gilt der Schwung als ausgelaufen und der Leerlauf greift wieder. */
const RUHE = 3;

/**
 * Höchstausschlag der Bildverschiebung, als Anteil der KARTENBREITE.
 *
 * Der Wert muss zum Vorrat passen, den das CSS bereitstellt
 * (`--bild-vorrat`), sonst liefe an einer Kante der Grund durch. Deshalb
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
  document.querySelectorAll("[data-ring]").forEach(baueRing);
}

function baueRing(wurzel) {
  const buehne = wurzel.querySelector("[data-ring-stage]");
  const drehteil = wurzel.querySelector("[data-ring-rotor]");
  const karten = [...wurzel.querySelectorAll("[data-ring-card]")];
  if (!buehne || !drehteil || karten.length < 3) return;

  /* Einmal eingesammelt statt je Bild neu gesucht: `zeichnen` läuft in jedem
     Bild, und eine Abfrage je Karte und Bild wären 1200 Suchen je Sekunde. */
  const bilder = karten.map((k) => k.querySelector("img"));

  /* Der Höchstausschlag in Pixeln. Wird in `vermessen` gesetzt, weil er an
     der Kartenbreite hängt — dieselbe Messung, aus der auch der Radius
     entsteht. */
  let ausschlag = 0;

  const anzahl = karten.length;
  const schritt = 360 / anzahl;
  const ruhig = prefersReducedMotion;

  let radius = 0;
  let winkel = 0;
  let schwung = 0; // Grad pro Sekunde, nur nach dem Ziehen
  let zieht = false;
  let kippt = false; // läuft eine Pfeil-Bewegung?
  /* Tempofaktor statt Schalter: 1 = volle Fahrt, 0 = steht. Der Zeiger
     schiebt ihn sanft auf null, statt die Bewegung abzuschneiden. */
  const lauf = { tempo: 1 };

  /* --- Geometrie ------------------------------------------------------ */

  function vermessen() {
    const breite = karten[0].offsetWidth;
    // Der Abstand steht im CSS, damit Aussehen und Rechnung nicht auseinanderlaufen.
    const luft = parseFloat(getComputedStyle(wurzel).getPropertyValue("--ring-luft")) || 0;
    radius = Math.round((breite + luft) / (2 * Math.tan(Math.PI / anzahl)));
    ausschlag = breite * PARALLAX;

    /* Minus: die Karten sitzen auf der abgewandten Seite der Achse, wir
       schauen von innen auf die Wand. Plus wäre die Wölbung nach außen. */
    karten.forEach((karte, i) => {
      karte.style.transform = `rotateY(${i * schritt}deg) translateZ(${-radius}px)`;
    });

    /* Die Tiefe hängt am Radius, nicht an einer festen Zahl — sonst wäre die
       Krümmung bei jeder Fenstergröße eine andere.

       Der Faktor bestimmt, wie stark die Perspektive zupackt: je größer,
       desto flacher. Bei 1.5 war der Größenunterschied zwischen Mitte und
       Rand rund ein Fünftel, bei 2.2 nur noch ein Fünfzehntel — die Kurve
       kommt dann fast nur noch aus der Drehung der Karten selbst. */
    buehne.style.perspective = `${Math.round(radius * 2.2)}px`;
  }

  /* --- Zeichnen ------------------------------------------------------- */

  function zeichnen() {
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
    drehteil.style.transform =
      `translateZ(${Math.round(radius * 0.22)}px) rotateY(${-winkel}deg)`;

    /* Tiefe sichtbar machen. Anders als bei der Wölbung nach außen ist hier
       die MITTE am weitesten weg — die Helligkeit folgt der Entfernung, nicht
       der Bildmitte. Bewusst zurückhaltend: im Zylinder steht man in einem
       Raum, nicht vor einer Bühne. */
    karten.forEach((karte, i) => {
      const eigen = (((i * schritt - winkel) % 360) + 360) % 360;
      const tief = Math.cos((eigen * Math.PI) / 180); // 1 = Mitte, −1 = hinter uns
      const naehe = (1 - tief) / 2; // 0 in der Mitte, 1 an den Rändern
      karte.style.filter = `brightness(${(0.9 + 0.1 * naehe).toFixed(3)})`;

      /* Leichte Verschiebung des Motivs im Rahmen. Der Ausschlag folgt dem
         Sinus des Kartenwinkels: null, wenn die Karte frontal steht, und am
         größten, wenn sie seitlich steht — dieselbe Kurve, nach der sich
         auch ihre Lage auf dem Zylinder ergibt.

         Das Vorzeichen ist negativ, damit das Motiv der Bewegung des Rahmens
         nachläuft statt ihr vorauszueilen. Genau daraus entsteht der
         Eindruck von Tiefe: Was hinter einem Fenster liegt, wandert
         langsamer als das Fenster selbst. */
      const bild = bilder[i];
      if (bild && !ruhig) {
        const seitlich = Math.sin((eigen * Math.PI) / 180);
        bild.style.transform = `translateX(${(-seitlich * ausschlag).toFixed(1)}px)`;
      }
    });
  }

  /* --- Lauf ----------------------------------------------------------- */

  function takt() {
    const dt = gsap.ticker.deltaRatio(60) / 60; // Sekunden seit dem letzten Bild
    if (!zieht && !kippt) {
      /* Der Faktor liegt NUR auf dem Leerlauf, nicht auf dem Nachschwung.
         Sonst schlagen Überfahren und Ziehen einander tot: Nach dem
         Loslassen steht der Zeiger ja noch auf dem Ring, der Faktor ist
         null — und der eben erzeugte Schwung wäre im selben Bild erstickt.
         Gezogen wird bewusst, der Leerlauf läuft nebenbei; deshalb hat das
         Ziehen Vorrang. */
      if (Math.abs(schwung) > RUHE) {
        winkel += schwung * dt;
        schwung -= schwung * Math.min(1, REIBUNG * dt);
      } else {
        schwung = 0;
        if (!ruhig) winkel += TEMPO * lauf.tempo * dt;
      }
      zeichnen();
    }
  }

  /* --- Ziehen ---------------------------------------------------------- */

  let letztesX = 0;
  let letzteZeit = 0;

  /* Ein Pixel Zeigerweg soll die vorderste Karte um genau einen Pixel
     verschieben. Das ist der Bogenmaß-Zusammenhang, keine Geschmacksgröße:
     dφ = dx / r. */
  const gradProPixel = () => 180 / (Math.PI * Math.max(radius, 1));

  buehne.addEventListener("pointerdown", (e) => {
    zieht = true;
    schwung = 0;
    letztesX = e.clientX;
    letzteZeit = e.timeStamp;
    buehne.setPointerCapture(e.pointerId);
    wurzel.dataset.ringZieht = "true";
  });

  buehne.addEventListener("pointermove", (e) => {
    if (!zieht) return;
    const dx = e.clientX - letztesX;
    const dt = Math.max(1, e.timeStamp - letzteZeit) / 1000;
    const dGrad = dx * gradProPixel();

    winkel += dGrad;
    schwung = dGrad / dt;
    letztesX = e.clientX;
    letzteZeit = e.timeStamp;
    zeichnen();
  });

  const loslassen = (e) => {
    if (!zieht) return;
    zieht = false;
    delete wurzel.dataset.ringZieht;
    if (e.pointerId != null && buehne.hasPointerCapture?.(e.pointerId)) {
      buehne.releasePointerCapture(e.pointerId);
    }
    /* Zeigt der Schwung entgegen dem Leerlauf, läuft er aus und der Ring
       kehrt in seine Richtung zurück — kein harter Umschlag. */
    schwung = gsap.utils.clamp(-900, 900, schwung);
  };

  buehne.addEventListener("pointerup", loslassen);
  buehne.addEventListener("pointercancel", loslassen);

  /* --- Überfahren -------------------------------------------------------
     Der Ring läuft aus, solange der Zeiger auf ihm steht — mehr nicht. Wer
     ein Motiv ansehen will, soll es nicht verfolgen müssen. Am Rand des
     Bereichs und nicht an den einzelnen Karten, damit das Ausrollen nicht
     flackert, während die Karten unter dem stehenden Zeiger durchwandern. */

  const tempoAuf = (ziel, dauer) => {
    gsap.to(lauf, { tempo: ziel, duration: ruhig ? 0 : dauer, ease: "power2.out", overwrite: true });
  };

  /* Auslaufen ist kürzer als Anlaufen: Anhalten soll auf den Zeiger
     antworten, Wiederanfahren darf sich Zeit lassen und nicht anspringen. */
  buehne.addEventListener("pointerenter", () => tempoAuf(0, 0.7));
  buehne.addEventListener("pointerleave", () => tempoAuf(1, 1.1));

  /* --- Tasten und Knöpfe ------------------------------------------------
     Ziehen ist eine Zugabe für die Maus. Bedienbar muss der Ring auch mit
     der Tastatur sein — dafür die beiden Knöpfe und die Pfeiltasten. */

  const drehen = (richtung) => {
    schwung = 0;
    /* Der Leerlauf pausiert währenddessen. Vorher schrieben beide denselben
       Winkel: der Leerlauf zählte weiter hoch, die Bewegung sprang auf ihren
       bei Klickbeginn festgehaltenen Zielwert zurück — sichtbar blieb davon
       fast nichts.

       Und die Bewegung zählt einen ZUWACHS, keinen Zielwert. Dadurch bleibt
       sie richtig, egal was den Winkel sonst noch bewegt hat. */
    kippt = true;
    const stand = { d: 0 };
    let bisher = 0;

    gsap.to(stand, {
      d: richtung * schritt,
      duration: 0.6,
      ease: "power3.out",
      overwrite: true,
      onUpdate() {
        winkel += stand.d - bisher;
        bisher = stand.d;
        zeichnen();
      },
      onComplete() {
        kippt = false;
      },
    });
  };

  wurzel.querySelector("[data-ring-prev]")?.addEventListener("click", () => drehen(1));
  wurzel.querySelector("[data-ring-next]")?.addEventListener("click", () => drehen(-1));

  buehne.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { drehen(1); e.preventDefault(); }
    if (e.key === "ArrowRight") { drehen(-1); e.preventDefault(); }
  });

  /* --- Start ----------------------------------------------------------- */

  vermessen();
  zeichnen();
  gsap.ticker.add(takt);

  let messTimer;
  window.addEventListener("resize", () => {
    clearTimeout(messTimer);
    messTimer = setTimeout(() => {
      vermessen();
      zeichnen();
    }, 150);
  });
}
