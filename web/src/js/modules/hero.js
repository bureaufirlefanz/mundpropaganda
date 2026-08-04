/**
 * Hero-Choreografie.
 *
 * Ablauf, in dieser Reihenfolge ineinandergeschoben:
 *   1. Die Navigation fährt von oben herunter.
 *   2. Die Wortmarke steigt zeichenweise hinter einer Maske hoch.
 *   3. Der Zahn kommt von unten und setzt sich in seine Endlage.
 *   4. Meta-Zeilen, Bewertungsleiste und Scroll-Hinweis blenden nach.
 *
 * Bewusst ohne Drehungen und Verzerrungen: die Tiefe entsteht aus den
 * versetzten Startzeiten und dem langen Auslaufen, nicht aus Effekten.
 *
 * Beim Scrollen laufen Zahn, Linien und Typo unterschiedlich schnell —
 * erst dadurch werden die Ebenen als Ebenen lesbar.
 */
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "../lib/gsap.js";
import { warteAufSchrift, SCHRIFT } from "../lib/fonts.js";

export function initHero() {
  const hero = document.querySelector("[data-hero]");

  /* Die Astro-App verbirgt Leiste, Wortmarke, Bewertungsleiste und
     Scroll-Knopf per CSS (`html.js …`), damit sie nicht schon im ersten Bild
     in ihrer Endlage stehen. Freigegeben werden sie hier — also muss auch
     der Fall abgedeckt sein, dass es auf einer Seite gar keinen Hero gibt:
     sonst bliebe die Leiste dort dauerhaft unsichtbar. */
  if (!hero) {
    const navOhneHero = document.querySelector("[data-nav] .c-nav__inner");
    if (navOhneHero) gsap.set(navOhneHero, { visibility: "visible" });
    return;
  }

  const words = hero.querySelectorAll("[data-hero-word]");
  const tooth = hero.querySelector("[data-hero-tooth]");
  const toothInner = hero.querySelector("[data-hero-tooth-inner]") ?? tooth;
  const toothImg = tooth?.querySelector("img");
  const glass = hero.querySelector(".s-hero__tooth-glass");

  // Muss zum Ruhewert in sections.css passen, sonst springt das Bild am
  // Ende der Einblendung auf einen anderen Wert.
  const TOOTH_OPACITY = 0.72;
  const meta = hero.querySelectorAll("[data-hero-meta]");
  const foot = hero.querySelectorAll("[data-hero-foot]");
  const scroll = hero.querySelector("[data-hero-scroll]");
  const lines = hero.querySelector("[data-hero-lines]");
  const nav = document.querySelector("[data-nav] .c-nav__inner");

  if (prefersReducedMotion) {
    /* visibility ausgeschrieben, nicht über clearProps: den verborgenen
       Startzustand setzt in der Astro-App das CSS, und `clearProps` räumt nur
       Inline-Stile weg — die CSS-Regel würde danach wieder greifen. */
    gsap.set([words, tooth, meta, foot, scroll, nav], { clearProps: "all" });
    gsap.set([words, tooth, meta, foot, scroll, nav], { opacity: 1, visibility: "visible" });
    return;
  }

  /* --- Intro ---------------------------------------------------------- */

  /* Startwerte sofort setzen, nicht erst wenn die Timeline entsteht.
     Die läuft erst nach Schriften und Freigabe an — bis dahin standen Nav,
     Fußzeile und Scroll-Knopf in ihrer Ruhelage und waren im Moment der
     Freigabe voll zu sehen. Dann legte `from` seine Startwerte an und riss
     sie zurück: sichtbar erschienen, weggesprungen, nochmal hereingefahren. */
  /* `visibility` mit im selben Aufruf: solange nur das CSS greift, sind die
     drei verborgen; hier bekommen sie im selben Frame ihren Startwert und
     werden freigegeben. Getrennt gesetzt entstünde dazwischen ein Bild, in
     dem sie in ihrer Endlage stehen. */
  gsap.set(nav, { yPercent: -140, opacity: 0, visibility: "visible" });
  gsap.set(foot, { y: 20, opacity: 0, visibility: "visible" });
  gsap.set(scroll, { scale: 0, opacity: 0, visibility: "visible" });

  /* Gewartet wird auf genau den Schnitt, den die Wortmarke setzt — nicht auf
     `document.fonts.ready`. Warum das ein Unterschied von über einer Sekunde
     ist, steht in lib/fonts.js.

     Gebraucht wird die Schrift überhaupt, weil SplitText die Zeichen ausmisst;
     mit der Ersatzschrift fielen Breiten und Umbruch anders aus. */
  warteAufSchrift(SCHRIFT.display).then(() => {
    /* „words,chars" statt nur „chars": Zerlegt man ausschließlich in
       Zeichen, wird jedes Zeichen ein eigener Inline-Block — und dann darf
       der Browser zwischen JE ZWEI ZEICHEN umbrechen. Auf den
       Leistungsseiten stand deshalb „CMD MIT BOTO / XBEHANDLUNG“, mitten im
       Wort und ohne Trennstrich.

       Mit der Wortebene liegen die Zeichen in Wort-Containern. Die allein
       genügen allerdings nicht: SplitText setzt sie auf inline-block, und ein
       inline-block bricht seinen Inhalt sehr wohl um, wenn der breiter ist
       als die Zeile — nur eben nicht sich selbst. Deshalb die Klasse, an der
       in base.css `white-space: nowrap` hängt.

       Animiert werden weiterhin die Zeichen — `s.chars` liefert sie
       unverändert. */
    const splits = [...words].map(
      (w) => new SplitText(w, { type: "words,chars", mask: "chars", wordsClass: "hero-wort" })
    );
    const chars = splits.flatMap((s) => s.chars);

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    /* Hintergrundlinien: der Pfad zeichnet sich von seinem Anfang aus ein.
       Dafür wird die Strichlänge auf die Pfadlänge gesetzt und der Versatz
       heruntergefahren. */
    /* fromTo, nicht from: die Startwerte stehen schon oben gesetzt, und
       `from` würde sie als Ziel nehmen — die Leiste animierte von 0 nach 0
       und bliebe unsichtbar. */
    if (nav) {
      tl.fromTo(
        nav,
        { yPercent: -140, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1 },
        0.1
      );
    }

    tl.set(hero, { autoAlpha: 1 }, 0)
      /* Die Wortmarke erst hier freigeben: die Zeichen stecken jetzt in ihren
         Masken, und der `from`-Tween unten legt seine Startwerte schon beim
         Anlegen an (yPercent 100). Zu sehen ist dadurch noch nichts — anders
         als vorher, wo die Zeilen bis zu diesem Moment fertig dastanden. */
      .set(words, { visibility: "visible" }, 0)
      // Zeichen steigen hinter der Maske hoch und kippen dabei aus der
      // Tiefe in die Fläche.
      // Reines Aufsteigen hinter der Maske. Keine Drehung, keine
      // Verzerrung — die Ruhe kommt aus der langen Laufzeit und dem
      // weichen Auslaufen, nicht aus zusätzlicher Bewegung.
      // Knapper Versatz: die Wortmarke steigt als Block auf, die Zeichen
      // laufen nur leicht hintereinander her.
      .from(
        chars,
        {
          yPercent: 100,
          duration: 1.5,
          stagger: { each: 0.018, from: "start" },
        },
        0.25
      )
      // Der Zahn steigt auf und setzt sich in seine Lage. Der leichte
      // Maßstabswechsel genügt für die Tiefe. Die Deckkraft läuft als
      // eigener, kurzer Tween — als Teil der langen Bewegung wäre das
      // Einblenden zäh.
      // Erst hier aus der Verborgenheit holen — vorher zeigte das CSS die
      // Glasebene bereits in voller Stärke, während der Zahn noch fehlte.
      .set(tooth ?? {}, { visibility: "visible" }, 0.85)
      .from(
        toothInner,
        {
          yPercent: 34,
          scale: 0.95,
          // Kippt beim Aufsteigen aus zwei Grad in die Senkrechte —
          // gerade genug, dass die Bewegung nicht schnurgerade wirkt.
          rotation: 2,
          transformOrigin: "50% 100%",
          duration: 1.8,
          ease: "power3.out",
          /* Danach schwebt der Zahn weiter. Erst im onComplete angelegt:
             ein vorab erzeugter Tween würde sich den Transform-Zustand vom
             Anlegezeitpunkt merken und den noch laufenden Auftritt
             überschreiben.
             `y` in Pixeln, während der Auftritt yPercent nutzt — GSAP führt
             beide getrennt und summiert sie, der Auftritt bleibt heil. */
          onComplete: () => {
            gsap.to(toothInner, {
              y: -14,
              duration: 3.6,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
          },
        },
        0.85
      )
      /* Die Deckkraft läuft auf dem Bild, nicht auf dem Wrapper: ein
         Vorfahre mit opacity < 1 isoliert das Milchglas in eine eigene
         Gruppe, und backdrop-filter sampelt dann deren leeren Hintergrund
         statt der Seite. Der Blur setzte dadurch erst ein, wenn die
         Einblendung fertig war. */
      /* Kurz gehalten: der Zahn soll seine Enddeckkraft erreicht haben,
         bevor er über der Schrift steht. Läuft die Deckkraft noch, während
         er sich schon überlagert, liest sich das als Fehler. */
      .fromTo(
        toothImg,
        { opacity: 0 },
        { opacity: TOOTH_OPACITY, duration: 0.2, ease: "power2.out" },
        0.85
      )
      /* Das Glas kommt über seine eigene Unschärfe herein — als CSS-Variable,
         weil backdrop-filter als Kurzschreibweise nicht interpolierbar ist.

         Es setzt bewusst später ein als der Zahn: das Objekt muss schon
         stehen, bevor sich das Milchglas darunterlegt. Sonst sieht man
         kurz eine schwebende Glasfläche ohne Zahn. */
      .fromTo(
        glass,
        {
          "--glass-blur": "0px",
          "--glass-sat": 1,
          "--glass-bright": 1,
          "--glass-sheen": 0,
        },
        {
          "--glass-blur": "16px",
          "--glass-sat": 1.55,
          "--glass-bright": 1.04,
          "--glass-sheen": 1,
          duration: 0.6,
          ease: "power2.out",
        },
        1.05
      )
      /* Die Meta-Zeilen laufen über den Highlight-Marker (modules/marker.js)
         und bringen ihren eigenen Auslöser mit — hier bleiben sie außen vor. */
      .fromTo(
        foot,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        1.2
      );

    /* Der Scroll-Hinweis tippt nach seinem Auftritt ruhig weiter — ein
       Hinweis, kein Blickfang.

       Die Schleife wird erst im onComplete erzeugt, nicht vorab mit einem
       Delay: ein vorab angelegter Tween merkt sich den Transform-Zustand
       von damals und würde beim Start die noch nicht abgeschlossene
       Einblendung überschreiben. */
    if (scroll) {
      // fromTo statt from: der Endwert steht ausgeschrieben da. Bei `from`
      // ermittelt GSAP ihn aus dem Zustand zum Anlegezeitpunkt — der hier
      // bereits vom gesetzten Startwert überschrieben war, wodurch der
      // Knopf auf scale 0 stehenblieb.
      tl.fromTo(
        scroll,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.9,
          ease: "back.out(1.7)",
          onComplete: () => {
            gsap.to(scroll, {
              y: 7,
              duration: 1.3,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
          },
        },
        1.35
      );
    }
  });

  /* --- Scroll-Parallax -------------------------------------------------
     Nur transform → GPU-günstig. Die Amplituden sind so gewählt, dass sich
     die Ebenen beim Scrollen sichtbar voneinander lösen.
     ------------------------------------------------------------------ */
  const parallax = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
    },
  });

  /* fromTo mit ausgeschriebenen Ruhewerten und immediateRender: false.
     Ein einfaches `to` würde seinen Startwert in dem Moment festhalten, in
     dem es angelegt wird — also mitten im Intro. Beim ersten Scrollen
     sprang der Zahn dann auf diesen veralteten Wert zurück. */
  const drift = (target, to) =>
    parallax.fromTo(
      target,
      { y: 0, yPercent: 0, scale: 1 },
      { ...to, ease: "none", immediateRender: false },
      0
    );

  if (tooth) drift(tooth, { yPercent: 26, scale: 1.06 });

  /* Beide Wortzeilen mit demselben Wert und in Pixeln, nicht in yPercent:
     die Wortmarke ist ein Schriftzug und muss als einer stehenbleiben.
     Vorher liefen sie mit -30 % und +18 % gegeneinander und rissen beim
     Scrollen um rund 90 px auseinander. Die Tiefe entsteht weiterhin aus
     dem Abstand zum Zahn, der deutlich stärker mitgeht. */
  drift(words, { y: -40 });

  /* Die Linien laufen bewusst in die nächste Section weiter. Ihr Versatz
     wird auf ganze Pixel gerundet: eine 1px-Kontur auf halben Pixeln wird
     pro Frame anders gerastert und flimmert sichtbar. */
  if (lines) {
    parallax.fromTo(
      lines,
      { y: 0 },
      {
        y: () => Math.round(window.innerHeight * 0.14),
        ease: "none",
        roundProps: "y",
        immediateRender: false,
        invalidateOnRefresh: true,
      },
      0
    );
  }

  /* --- Zeigernähe --------------------------------------------------------
     Sehr kleine Amplitude, langes Nachlaufen: der Zahn soll leben, nicht
     dem Zeiger folgen. Die Bewegung liegt auf einer dritten Ebene, damit
     sie weder den Auftritt (innen) noch den Scroll-Parallax (außen)
     überschreibt — beide schreiben ebenfalls transform.
     ------------------------------------------------------------------ */
  const drift3d = tooth?.querySelector("[data-hero-tooth-drift]");

  if (drift3d && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const xTo = gsap.quickTo(drift3d, "x", { duration: 1.4, ease: "power3" });
    const yTo = gsap.quickTo(drift3d, "y", { duration: 1.4, ease: "power3" });
    // Die Drehung läuft etwas träger als der Versatz — dadurch schwingt das
    // Objekt nach, statt starr mitzuwandern.
    const rTo = gsap.quickTo(drift3d, "rotation", { duration: 1.8, ease: "power3" });

    window.addEventListener("pointermove", (e) => {
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      xTo(cx * 14);
      yTo(cy * 9);
      rTo(cx * 2.2);
    });
  }

  ScrollTrigger.refresh();
}
