/**
 * Das Inhaltsverzeichnis hebt den Abschnitt hervor, in dem man gerade liest.
 *
 * Kein IntersectionObserver, sondern ein ScrollTrigger je Zwischentitel: Die
 * Seite läuft auf Lenis, und dessen weiches Scrollen und der Observer sind
 * zwei getrennte Uhren — die Hervorhebung ruckelte dadurch hinterher. GSAP
 * hängt dagegen an derselben Schleife wie alles andere auf dieser Seite.
 *
 * Ohne JavaScript bleibt eine gewöhnliche Liste aus Sprungmarken stehen, die
 * vollständig funktioniert. Deshalb gibt es hier keinen verborgenen
 * Startzustand im CSS, den dieses Modul erst auflösen müsste.
 */
import { gsap, ScrollTrigger } from "../lib/gsap.js";

export function initToc() {
  const toc = document.querySelector("[data-toc]");
  if (!toc) return;

  const links = new Map();
  for (const a of toc.querySelectorAll("[data-toc-link]")) {
    links.set(a.dataset.tocLink, a);
  }
  if (!links.size) return;

  const ziele = [...document.querySelectorAll("[data-toc-ziel]")].filter((el) =>
    links.has(el.dataset.tocZiel)
  );
  if (!ziele.length) return;

  let aktiv = null;

  function setze(id) {
    if (id === aktiv) return;
    aktiv = id;
    for (const [kennung, a] of links) {
      a.setAttribute("aria-current", String(kennung === id));
    }
    if (id) haltePunktImBild(links.get(id));
  }

  /**
   * Das Verzeichnis scrollt bei vielen Einträgen selbst. Steht der aktive
   * Punkt außerhalb, wandert er ins Bild — sonst zeigt ein Verzeichnis mit
   * fünfzehn Zeilen ab der Hälfte des Beitrags nur noch Punkte, die man
   * längst hinter sich hat.
   *
   * `scrollTop` von Hand statt `scrollIntoView`: Letzteres scrollt in Chrome
   * die ganze Seite mit, wenn der Kasten selbst nicht scrollen kann.
   */
  function haltePunktImBild(a) {
    if (!a || toc.scrollHeight <= toc.clientHeight) return;
    const oben = a.offsetTop - toc.offsetTop;
    const unten = oben + a.offsetHeight;
    if (oben < toc.scrollTop) toc.scrollTop = oben - 8;
    else if (unten > toc.scrollTop + toc.clientHeight) {
      toc.scrollTop = unten - toc.clientHeight + 8;
    }
  }

  /* Der Zwischentitel gilt als erreicht, sobald er die obere Drittelmarke
     passiert. Nicht die Oberkante: Dort wechselte die Hervorhebung erst,
     wenn die Überschrift schon halb aus dem Bild ist, und der letzte
     Abschnitt einer kurzen Seite käme nie dran. */
  const ausloeser = ziele.map((el, i) =>
    ScrollTrigger.create({
      trigger: el,
      start: "top 33%",
      /* Bis zum nächsten Zwischentitel, sonst bis zum Ende des Textes.
         Das Ende des Textes wird an DERSELBEN Marke gemessen wie der Anfang
         eines Zwischentitels. Mit „bottom bottom" lag es davor: Der Text
         endete bei 2444, seine Unterkante erreichte die Fensterunterkante
         also schon bei scrollY 1444 — der letzte Zwischentitel begann aber
         erst bei 1767. Ende vor Anfang heißt: nie aktiv, und der letzte
         Abschnitt blieb im Verzeichnis dauerhaft unmarkiert. */
      endTrigger: ziele[i + 1] ?? el.closest("[data-toc-bereich]") ?? el,
      end: ziele[i + 1] ? "top 33%" : "bottom 33%",
      onToggle: (self) => self.isActive && setze(el.dataset.tocZiel),
      onRefresh: (self) => self.isActive && setze(el.dataset.tocZiel),
    })
  );

  /* Über dem ersten Zwischentitel ist keiner aktiv — dann soll auch keiner
     hervorgehoben sein, statt dass der erste dort schon leuchtet. */
  ScrollTrigger.create({
    trigger: ziele[0],
    start: "top bottom",
    end: "top 33%",
    onToggle: (self) => self.isActive && setze(null),
  });

  /* Klick: sanft hinscrollen und sofort hervorheben. Die Sprungmarke im href
     bleibt stehen — ohne JavaScript springt der Browser hart, und das ist das
     richtige Verhalten. */
  const lenis = window.__lenis;
  for (const [id, a] of links) {
    a.addEventListener("click", (e) => {
      const ziel = document.getElementById(id);
      if (!ziel || !lenis) return;
      e.preventDefault();
      setze(id);
      lenis.scrollTo(ziel, { offset: -120 });
      history.replaceState(null, "", `#${id}`);
    });
  }

  return () => ausloeser.forEach((t) => t.kill());
}

/* `gsap` ist importiert, damit dieses Modul dieselbe Instanz benutzt wie der
   Rest — ScrollTrigger meldet sich sonst bei einer zweiten an. */
void gsap;
