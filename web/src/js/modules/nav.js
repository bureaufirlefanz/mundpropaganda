/**
 * Navigation: Mega-Menu und Mobile-Burger.
 *
 * Die Leiste selbst ist rein statisch — sie schwebt konstant über der
 * Seite und verändert beim Scrollen weder Position, Größe noch Farbe.
 */
import { gsap } from "../lib/gsap.js";

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
    if (inner && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
      .to(panel, { height: "auto", duration: 0.5, ease: "power3.inOut" })
      .from(
        panel.querySelectorAll("[data-megamenu-item]"),
        { y: 20, opacity: 0, duration: 0.5, stagger: 0.03 },
        "-=0.3"
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
      if (!item.contains(e.relatedTarget) && !panel.contains(e.relatedTarget)) close();
    });
    panel.addEventListener("focusout", (e) => {
      if (!panel.contains(e.relatedTarget) && !item.contains(e.relatedTarget)) close();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    menus.forEach(({ tl }, item) => {
      tl.reverse();
      item.dataset.open = "false";
    });
    nav.dataset.menuOpen = "false";
  });

  /* --- Mobile-Burger -------------------------------------------------- */
  const burger = nav.querySelector("[data-burger]");
  const mobilePanel = nav.querySelector("[data-mobile-menu]");

  if (burger && mobilePanel) {
    const mobileTl = gsap.timeline({ paused: true });
    mobileTl
      .set(mobilePanel, { visibility: "visible" })
      .to(mobilePanel, { height: "auto", duration: 0.5, ease: "power3.inOut" })
      .from(
        mobilePanel.querySelectorAll("[data-megamenu-item]"),
        { y: 20, opacity: 0, duration: 0.4, stagger: 0.04 },
        "-=0.25"
      );

    burger.addEventListener("click", () => {
      const open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      nav.dataset.menuOpen = String(!open);
      open ? mobileTl.reverse() : mobileTl.play();
    });
  }
}
