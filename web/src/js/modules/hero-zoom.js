/**
 * Das Kopfbild zieht beim Scrollen auf Vollbild auf.
 *
 * Ein Bild, ein Maßstab, kein Pinning. Der Kopf bleibt im Fluss: Man scrollt,
 * das Bild wächst, und wenn es den Bildschirm deckt, läuft die Seite
 * gewöhnlich weiter. Es gibt keine Extrastrecke, über die man erst hinweg
 * muss, und keine Bühne, in der etwas klebt.
 *
 * **Warum kein Pinning.** Ein gepinnter Kopf schiebt den ganzen Rest der Seite
 * um seine Strecke nach unten, und wer zurückscrollt, landet in einem
 * Abschnitt, der sich rückwärts abspult. Für einen Kopf ist das zu viel
 * Aufwand für eine Geste, die eine Sekunde dauert.
 *
 * **Die Rechnung.** Der Maßstab ist der, bei dem die kürzere Seite des Bildes
 * gerade den Bildschirm deckt (`Math.max` aus beiden Verhältnissen). Weil das
 * Bild oben ansetzt (`transform-origin: center top`) und der Kopf bereits
 * unter der Navigationsleiste beginnt, reicht die Höhe des Fensters als Ziel.
 *
 * Gerechnet wird in einer Funktion, nicht als Zahl: ScrollTrigger ruft sie bei
 * jedem `refresh` neu auf. Einmalig gerechnet stimmte nach dem Drehen eines
 * Telefons kein Wert mehr.
 */
import { gsap, prefersReducedMotion } from "../lib/gsap.js";

export function initHeroZoom() {
  /* Ohne Bewegung bleibt der Kopf, wie er ist. Das CSS setzt zusätzlich
     `transform: none`, damit auch ein halb gelaufener Maßstab zurückfällt. */
  if (prefersReducedMotion) return;

  document.querySelectorAll("[data-chero-zoom]").forEach((media) => {
    /* Wie weit aufgezogen wird: genau bis an die Fensterkanten.
     *
     * Der Maßstab ist das Verhältnis von Fensterbreite zur gemessenen Breite
     * des Bildes. Bei 1 steht das Bild randabfallend — die seitlichen Fugen
     * sind zu, und kein Bildinhalt wandert aus dem Fenster hinaus.
     *
     * Zwei Zwischenstände hat diese Zeile hinter sich, beide zu weit: erst
     * `Math.max` aus Breite und Höhe (Maßstab 1.32 bei 16:9 in 1440 × 900,
     * das Bild schob weit über beide Seiten), dann randabfallend plus ein
     * Achtel Überzug. Das Achtel ist jetzt auch weg, und damit die
     * Stellschraube `--zoom-ueberzug` im CSS.
     *
     * Die Höhe steht bewusst nicht in der Rechnung: Ein Bild, das auch die
     * Höhe deckt, ist kein aufgezogenes Bild mehr, sondern ein
     * Vollbildhintergrund — und dafür ist der Kopf der falsche Ort.
     *
     * Gemessen wird mit `offsetWidth`, NICHT mit `getBoundingClientRect`.
     * Der Unterschied ist hier der ganze Punkt: `getBoundingClientRect` gibt
     * die verschobene Breite zurück, also die bereits skalierte. Rechnet man
     * damit, jagt die Rechnung ihrer eigenen Wirkung hinterher — läuft ein
     * `refresh`, während das Bild schon aufgezogen ist, misst sie fast die
     * Fensterbreite und leitet daraus ab, es sei nichts mehr zu tun. Gemessen:
     * Das Bild wuchs dann über die ganze Strecke um vier Pixel.
     *
     * `offsetWidth` ist die Layoutbreite und von `transform` unberührt. Sie
     * stimmt zu jedem Zeitpunkt, unabhängig davon, wo im Ablauf gefragt
     * wird. */
    const faktor = () => (media.offsetWidth ? window.innerWidth / media.offsetWidth : 1);

    /* Alle vier Ecken flachen mit dem Maßstab ab.
     *
     * Bei vollem Zoom steht das Bild randabfallend, und eine Rundung an einer
     * Kante, die es gar nicht mehr gibt, ist ein Rest: Man sieht den
     * Hintergrund durch die Ecke schimmern, obwohl das Bild den Bildschirm
     * decken soll.
     *
     * Zwischenzeitlich liefen hier nur die oberen beiden Ecken, mit dem
     * Gedanken, das Bild sitze unten weiter im Fluss und der nächste
     * Abschnitt schließe an. Am fertig aufgezogenen Bild überzeugt das nicht —
     * unten blieb sichtbar gerundet, während oben schon Kante war.
     *
     * Vier einzelne Eigenschaften und nicht die Kurzschreibweise
     * `borderRadius`: Jede Ecke startet bei ihrem eigenen Wert (oben der große
     * Bogen, unten die kleine Brechung), und die Kurzschreibweise würde sie
     * über einen Kamm scheren. */
    const stil = getComputedStyle(media);

    gsap.fromTo(
      media,
      {
        scale: 1,
        borderTopLeftRadius: stil.borderTopLeftRadius,
        borderTopRightRadius: stil.borderTopRightRadius,
        borderBottomLeftRadius: stil.borderBottomLeftRadius,
        borderBottomRightRadius: stil.borderBottomRightRadius,
      },
      {
        scale: faktor,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,

        /* Der Radius rastet in 16er-Schritten.
         *
         * `transform` übernimmt die Grafikkarte — der Maßstab kostet pro Bild
         * fast nichts. `border-radius` kann sie NICHT übernehmen: Jede
         * Änderung zwingt den Browser, das Element neu zu zeichnen, und das
         * Element ist hier ein bildschirmfüllendes Foto.
         *
         * Ohne Rasterung passiert das bei jedem einzelnen Bild, also
         * sechzigmal je Sekunde. Mit 16er-Schritten sind es über die ganze
         * Strecke rund vierzehn Neuzeichnungen statt mehrerer hundert. 16 ist
         * `--r-md`, die kleinste Stufe der Skala — feiner als sie kann man
         * eine Rundung ohnehin nicht beurteilen.
         *
         * Der Maßstab bleibt ungerastert: Er ist die Bewegung, die man sieht,
         * und sie kostet nichts. */
        snap: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        },
        ease: "none",
        /* Die Kompositionsebene nur, solange die Bewegung läuft. Dauerhaft
           kostet sie bei einem Bild dieser Größe Speicher, den man auf einem
           Telefon merkt. */
        onStart: () => gsap.set(media, { willChange: "transform" }),
        onComplete: () => gsap.set(media, { willChange: "auto" }),
        onReverseComplete: () => gsap.set(media, { willChange: "auto" }),
        scrollTrigger: {
          /* Der ABSCHNITT ist der Auslöser, nicht das Bild.
           *
           * Am Bild hing der Start an dessen Oberkante — und die steht unter
           * Topline und Überschrift. Man scrollte erst drei- bis vierhundert
           * Pixel, in denen nichts geschah, und dann sprang die Bewegung an.
           * Das las sich als Verzögerung, obwohl der Maßstab schon direkt
           * gekoppelt war.
           *
           * Der Abschnitt beginnt am Seitenanfang. `start: "top top"` heißt
           * damit: bei Scrollposition null. Die Bewegung setzt mit der ersten
           * Radbewegung ein. */
          trigger: media.closest("section") ?? media,
          start: "top top",

          /* Schluss, sobald das Bild oben ansteht.
           *
           * Vorher lief der Maßstab über eine feste Bildschirmhöhe (`+=100%`)
           * und wuchs damit weiter, während das Bild längst nach oben aus dem
           * Kopf gewandert war. Jetzt endet er genau dann, wenn die Oberkante
           * des Bildes die Fensteroberkante erreicht — von da an ist es fertig
           * aufgezogen und scrollt einfach weiter.
           *
           * Die Strecke ist damit der Weg, den Topline und Überschrift über
           * dem Bild einnehmen. Sie ergibt sich aus dem Satz und muss nicht
           * geraten werden.
           *
           * ScrollTrigger misst die Lage im Layout, nicht die verschobene:
           * Der Maßstab wirkt über `transform` und verändert die gemessene
           * Oberkante nicht. Sonst jagte die Messung ihrer eigenen Wirkung
           * hinterher. */
          endTrigger: media,
          end: "top top",
          /* `true` und nicht eine Zahl: Eine Zahl ist die Zeit in Sekunden,
             die der Wert dem Scrollen NACHLÄUFT — 0.5 fühlte sich weich an,
             war aber ein halbsekündiges Hinterherziehen. `true` koppelt den
             Maßstab unmittelbar an die Scrollposition. Zusammen mit
             `ease: "none"` läuft er damit linear mit der Bewegung: gleicher
             Weg, gleicher Zuwachs. */
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );
  });
}
