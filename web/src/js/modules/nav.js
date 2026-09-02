/**
 * Navigation: Mega-Menu und Mobile-Burger.
 *
 * Die Leiste selbst ist rein statisch — sie schwebt konstant über der
 * Seite und verändert beim Scrollen weder Position, Größe noch Farbe.
 */
import { gsap, prefersReducedMotion } from "../lib/gsap.js";
import { pageSignal } from "../lib/lifecycle.js";

/* Ohne Bewegung soll das Menü sofort dastehen und nicht gar nicht: Es ist
   kein Schmuck, sondern der Weg durch die Seite. Null Sekunden statt kein
   Tween — der Endzustand wird gesetzt, nur ohne Weg dorthin. */
const dauer = (wert) => (prefersReducedMotion ? 0 : wert);

export function initNav() {
  const nav = document.querySelector("[data-nav]");
  if (!nav) return;

  /* Die Leiste ändert ihr Aussehen beim Scrollen nicht — Milchglas und
     Maße sind konstant. Deshalb gibt es hier keinen Scroll-Zustand.

     Der Auftritt von oben gehört auf Seiten mit Hero in dessen Timeline,
     damit er sich in die Choreografie einfügt. Auf allen anderen Seiten
     wird er hier ausgelöst. */
  if (!document.querySelector("[data-hero]")) {
    const inner = nav.querySelector(".c-nav__inner");
    /* Derselbe Wert wie überall sonst, statt einer zweiten Abfrage: Die in
       `lib/gsap.js` hört auf Änderungen, diese hier tat es nicht. */
    if (inner && !prefersReducedMotion) {
      gsap.from(inner, {
        yPercent: -140,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        delay: 0.1,
      });
    }
  }

  /* --- Mega-Menu ----------------------------------------------------- */
  const items = nav.querySelectorAll("[data-nav-item]");
  const menus = new Map();

  items.forEach((item) => {
    /* Das Panel liegt nicht mehr im Menüelement, sondern als Geschwister
       der Leiste — ein backdrop-filter erzeugt einen eigenen Backdrop-Root,
       und ein Panel darin hätte nur die bereits gefilterte Fläche der
       Leiste abgetastet statt der Seite. Verbunden sind beide über den
       Namen im Attribut. */
    const name = item.dataset.navItem;
    const panel = name ? nav.querySelector(`[data-megamenu="${name}"]`) : null;
    if (!panel) return;

    const tl = gsap.timeline({ paused: true });
    tl.set(panel, { visibility: "visible" })
      .to(panel, { height: "auto", duration: dauer(0.5), ease: "power3.inOut" })
      .from(
        panel.querySelectorAll("[data-megamenu-item]"),
        { y: 20, opacity: 0, duration: dauer(0.5), stagger: dauer(0.03) },
        "-=0.3",
      );

    menus.set(item, { tl });

    /* Das Panel ist kein Kind des Menüelements mehr. Zwischen beiden liegt
       eine Lücke, und ohne Nachlauf schließt das Menü, sobald der Zeiger
       das Wort verlässt — man kommt gar nicht erst hin. Deshalb ein kurzer
       Aufschub, den das Betreten von Wort oder Panel wieder aufhebt. */
    let closeTimer = null;

    const open = () => {
      clearTimeout(closeTimer);

      // Andere Menüs schließen, sonst überlagern sich zwei Panels.
      menus.forEach((other, otherItem) => {
        if (otherItem !== item) {
          other.tl.reverse();
          otherItem.dataset.open = "false";
        }
      });
      item.dataset.open = "true";
      nav.dataset.menuOpen = "true";
      tl.play();
    };

    const close = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        item.dataset.open = "false";
        nav.dataset.menuOpen = "false";
        tl.reverse();
      }, 180);
    };

    [item, panel].forEach((el) => {
      el.addEventListener("mouseenter", open);
      el.addEventListener("mouseleave", close);
      el.addEventListener("focusin", open);
    });

    item.addEventListener("focusout", (e) => {
      if (!item.contains(e.relatedTarget) && !panel.contains(e.relatedTarget))
        close();
    });
    panel.addEventListener("focusout", (e) => {
      if (!panel.contains(e.relatedTarget) && !item.contains(e.relatedTarget))
        close();
    });
  });

  /* --- Mobile-Burger -------------------------------------------------- */
  const burger = nav.querySelector("[data-burger]");
  const mobilePanel = nav.querySelector("[data-mobile-menu]");
  let mobileTl = null;

  /**
   * Das mobile Panel auf oder zu — an einer Stelle, weil es drei Auslöser
   * gibt: der Knopf, die Escape-Taste und ein Klick auf einen Verweis darin.
   *
   * Die Aufschrift wechselt mit. Ein Knopf, der im offenen Zustand weiterhin
   * „Menü öffnen" heißt, ist für ein Vorlesegerät schlicht falsch
   * beschriftet — `aria-expanded` allein sagt den Zustand, aber nicht, was
   * der nächste Druck tut.
   */
  const setzeMobil = (offen) => {
    if (!burger || !mobileTl) return;
    burger.setAttribute("aria-expanded", String(offen));
    burger.setAttribute("aria-label", offen ? "Menü schließen" : "Menü öffnen");
    nav.dataset.menuOpen = String(offen);
    offen ? mobileTl.play() : mobileTl.reverse();
  };

  const mobilIstOffen = () => burger?.getAttribute("aria-expanded") === "true";

  if (burger && mobilePanel) {
    mobileTl = gsap.timeline({ paused: true });
    mobileTl
      .set(mobilePanel, { visibility: "visible" })
      .to(mobilePanel, {
        height: "auto",
        duration: dauer(0.5),
        ease: "power3.inOut",
      })
      .from(
        mobilePanel.querySelectorAll("[data-megamenu-item]"),
        { y: 20, opacity: 0, duration: dauer(0.4), stagger: dauer(0.04) },
        "-=0.25",
      );

    burger.addEventListener("click", () => setzeMobil(!mobilIstOffen()));
  }

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key !== "Escape") return;
      menus.forEach(({ tl }, item) => {
        tl.reverse();
        item.dataset.open = "false";
      });
      nav.dataset.menuOpen = "false";

      /* Escape schloss bis hierher nur die Mega-Menüs. Auf dem Telefon blieb
       das Panel offen, und wer es mit der Tastatur geöffnet hatte, kam nur
       durch das ganze Menü hindurch wieder heraus.

       Der Fokus geht zurück auf den Knopf: Er ist die Stelle, an der man war,
       bevor das Panel aufging. Ohne das steht der Fokus auf einem Element,
       das gerade unsichtbar geworden ist. */
      if (mobilIstOffen()) {
        setzeMobil(false);
        burger.focus();
      }
    },
    { signal: pageSignal() },
  );
}
