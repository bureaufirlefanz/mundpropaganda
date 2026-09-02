/**
 * Section Anchor Dock — behaviour, adopted from Osmo Supply.
 *
 * The mechanics are kept verbatim: timeline structure, eases, the `rect`
 * object, `hopIndicator`, `swapLabel`, the ScrollTrigger wiring and every
 * data attribute. What changed, and why (see SectionDock.astro for the
 * markup-side list):
 *
 *   - GSAP comes from `../lib/gsap.js` — one instance, centrally
 *     registered. No CDN, no `registerPlugin` here.
 *   - No DOMContentLoaded self-start. `init.js` calls `initSectionDock()`
 *     in phase 2, and again after every router swap.
 *   - The template attached `resize`, `keydown` and `click` listeners and
 *     never removed them; with `astro:page-load` re-running init on every
 *     navigation they would stack. Each run now cleans up the previous one
 *     first. The ScrollTriggers are already covered by the global kill in
 *     `Base.astro` on `astro:before-swap`.
 *   - The initial gsap.set that hid the dock stays, but the *first paint*
 *     is covered by CSS (`html.js .c-section-dock`) — a module runs too late
 *     to hide anything without a flash.
 *   - Link clicks are left to the site-wide `initAnchors()` handler, which
 *     scrolls via Lenis. The dock only closes itself on click; a second
 *     scroll handler here would fight the global one.
 */
import { gsap, ScrollTrigger } from "../lib/gsap.js";

/* Listener removers from the previous run — see header. */
let cleanup = null;

export function initSectionDock() {
  cleanup?.();
  cleanup = null;
  const removers = [];

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const canHover = window.matchMedia("(hover: hover)");

  document.querySelectorAll("[data-section-dock-init]").forEach((dock) => {
    const pill = dock.querySelector("[data-section-dock-pill]");
    const toggle = dock.querySelector("[data-section-dock-toggle]");
    const labelWrap = dock.querySelector("[data-section-dock-label-wrap]");
    const list = dock.querySelector("[data-section-dock-list]");
    const indicator = dock.querySelector("[data-section-dock-indicator]");
    const links = list ? Array.from(list.querySelectorAll("[data-section-dock-link]")) : [];
    const sections = links.map((link) => document.querySelector(link.getAttribute("href")));
    const labelTemplate = labelWrap ? labelWrap.firstElementChild : null;
    if (!pill || !toggle || !labelWrap || !labelTemplate || !list || !indicator || links.length < 2 || sections.some((s) => !s)) return;

    let activeIndex = Math.max(0, links.findIndex((l) => l.hasAttribute("data-active")));
    let open = false;
    let dockTl = null;
    const rect = { x: 0, y: 0, w: 0, h: 0 };

    /* „bouncy" behält den Charakter der Vorlage, aber deutlich zurückgenommen:
       Die Überschwinger standen ursprünglich bei 1.4 bis 2.5 und ließen jede
       Bewegung federn. Eleganter wirkt es, wenn man den Rückschwung eher
       ahnt als sieht — 1.0 bis 1.4, dazu ein flacheres Stauchen beim
       Wechsel der Beschriftung. */
    const motion = "bouncy"; // "bouncy" | "smooth"
    const smooth = () => motion === "smooth" || reduceMotion.matches;
    const dur = (d) => (reduceMotion.matches ? 0 : d);
    const ease = (bouncy, calm) => (smooth() ? calm : bouncy);

    gsap.set(pill, { transformOrigin: "50% 100%" });

    /* Die Rundung wird nicht animiert. Sie steht als fester Wert im CSS
       (`--r-dock`) und ändert sich beim Aufklappen gar nicht — deshalb gibt
       es hier nichts zu tun. Ein mitwachsender Radius (`--r-round`) wanderte
       beim Aufklappen sichtbar mit, und jeder Versuch, das zu animieren,
       lief entweder gegen die Größenänderung oder war erst am Ende zu sehen. */

    function syncLinkState() {
      links.forEach((l, i) => {
        l.toggleAttribute("data-active", i === activeIndex);
        if (i === activeIndex) l.setAttribute("aria-current", "location");
        else l.removeAttribute("aria-current");
      });
    }

    function buildLabel(index) {
      const span = labelTemplate.cloneNode(false);
      span.innerHTML = links[index].innerHTML;
      return span;
    }

    /* Erst den laufenden Breiten-Tween abräumen, dann neu aufbauen.
       Ohne das lief er nach dem Austausch weiter und zog den Knopf auf die
       Breite der vorigen Beschriftung — bei einem Wechsel kurz nach dem
       anderen blieb davon eine schmale Pille übrig, in der nichts mehr Platz
       hatte. `clearProps` nimmt die Inline-Breite ganz weg, damit wieder das
       Stylesheet bestimmt. */
    function setLabel(index) {
      gsap.killTweensOf(labelWrap);
      labelWrap.textContent = "";
      labelWrap.appendChild(buildLabel(index));
      gsap.set(labelWrap, { clearProps: "width" });
    }

    /* Warum es hier überhaupt eine Aufräumlogik braucht:
       Beim schnellen Scrollen überqueren mehrere Marken in derselben Sekunde,
       und dann läuft ein Wechsel in den nächsten. Die eben eingeblendete
       Beschriftung wird im nächsten Durchgang zur „alten" — `killTweensOf`
       bricht ihr Einblenden ab, das `onComplete` des Auslaufens feuert nie,
       und sie bleibt unsichtbar im DOM stehen. Nach zwei, drei solchen
       Überlagerungen war im Knopf gar nichts mehr zu sehen. */
    function swapLabel(index, movingDown) {
      const olds = Array.from(labelWrap.children);
      const startWidth = labelWrap.offsetWidth;
      gsap.killTweensOf(labelWrap);
      olds.forEach((old) => {
        gsap.killTweensOf(old);

        /* Schon auf dem Weg hinaus? Dann sofort entfernen. Ein zweites
           Auslaufen desselben, längst unsichtbaren Elements bringt nichts —
           außer einem weiteren `onComplete`, das ausbleiben kann. */
        if (old.dataset.leaving === "true") {
          old.remove();
          return;
        }

        old.dataset.leaving = "true";
        gsap.set(old, { position: "absolute", top: 0, left: 0 });
        gsap.to(old, {
          yPercent: movingDown ? -120 : 120,
          autoAlpha: 0,
          duration: dur(0.35),
          ease: "power2.out",
          onComplete: () => old.remove(),
          onInterrupt: () => old.remove(),
        });
      });

      const next = buildLabel(index);
      labelWrap.appendChild(next);
      gsap.set(labelWrap, { width: "auto" });
      const targetWidth = next.offsetWidth;

      /* Kommt hier eine 0 heraus, war der Knopf einen Lidschlag lang eine
         schmale Pille. Dann lieber ohne Breiten-Animation: `auto` ist immer
         richtig, nur eben ohne Übergang. */
      if (!targetWidth) {
        gsap.set(labelWrap, { clearProps: "width" });
        gsap.set(next, { yPercent: 0, autoAlpha: 1 });
        return;
      }

      gsap.fromTo(
        labelWrap,
        { width: startWidth },
        { width: targetWidth, duration: dur(0.45), ease: ease("back.out(1.1)", "power3.out") }
      );
      gsap.fromTo(
        next,
        { yPercent: movingDown ? 120 : -120, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: dur(0.45),
          ease: "power3.out",
          /* Wird dieses Einblenden selbst unterbrochen, bleibt die
             Beschriftung nicht auf halbem Weg stehen. Der nächste Durchgang
             nimmt sie dann als sichtbares Element mit hinaus. */
          onInterrupt: () => gsap.set(next, { yPercent: 0, autoAlpha: 1 }),
        }
      );

      if (!smooth()) {
        gsap.killTweensOf(pill, "scaleY");
        gsap.timeline()
          .to(pill, { scaleY: 0.94, duration: 0.15, ease: "power2.out" })
          .to(pill, { scaleY: 1, duration: 0.5, ease: "back.out(1.3)" });
      }
    }

    function rectFor(link) {
      return { x: link.offsetLeft, y: link.offsetTop, w: link.offsetWidth, h: link.offsetHeight };
    }

    function render() {
      gsap.set(indicator, { x: rect.x, y: rect.y, width: rect.w, height: rect.h });
    }

    function placeIndicator(index) {
      Object.assign(rect, rectFor(links[index]));
      gsap.killTweensOf(rect);
      gsap.killTweensOf(indicator);
      gsap.set(indicator, { scaleX: 1, scaleY: 1 });
      render();
    }

    function hopIndicator(index) {
      const target = rectFor(links[index]);
      gsap.killTweensOf(rect);
      gsap.killTweensOf(indicator);

      if (smooth()) {
        gsap.set(indicator, { scaleX: 1, scaleY: 1 });
        gsap.to(rect, {
          x: target.x,
          y: target.y,
          w: target.w,
          h: target.h,
          duration: dur(0.35),
          ease: "power3.out",
          onUpdate: render,
        });
        return;
      }

      const delta = target.y - rect.y;
      const sign = delta === 0 ? 1 : Math.sign(delta);
      const overshoot = gsap.utils.clamp(3, 6, Math.abs(delta) * 0.04) * sign;
      const apexY = gsap.utils.clamp(0, list.clientHeight - target.h, target.y + overshoot);

      gsap.set(indicator, { transformOrigin: "50% 50%" });
      gsap.timeline()
        .to(rect, {
          x: target.x,
          y: apexY,
          w: target.w,
          h: target.h,
          duration: 0.35,
          ease: "power3.out",
          onUpdate: render,
        })
        .to(rect, { y: target.y, duration: 0.25, ease: "power2.inOut", onUpdate: render });
      gsap.timeline()
        .to(indicator, { scaleX: 0.9, duration: 0.15, ease: "power2.out" })
        .to(indicator, { scaleY: 1, scaleX: 1, duration: 0.5, ease: "back.out(1.3)" });
    }

    /* Letzte Sicherung. Die Aufräumlogik oben deckt die Überlagerung ab, die
       wir kennen; dies deckt die ab, die wir nicht kennen. Ein leerer Knopf
       ist der einzige Zustand, in dem die Navigation nichts mehr aussagt —
       lieber ohne Animation richtig als animiert leer. */
    let healTimer = null;
    function ensureLabel() {
      clearTimeout(healTimer);
      healTimer = setTimeout(() => {
        const visible = Array.from(labelWrap.children).some(
          (c) => c.dataset.leaving !== "true" && Number(getComputedStyle(c).opacity) > 0.5
        );
        if (!visible) setLabel(activeIndex);
      }, 700);
    }
    removers.push(() => clearTimeout(healTimer));

    function setActive(index, movingDown) {
      if (index === activeIndex) return;
      activeIndex = index;
      syncLinkState();
      ensureLabel();
      if (open) {
        setLabel(index);
        hopIndicator(index);
      } else {
        swapLabel(index, movingDown);
        placeIndicator(index);
      }
    }

    function openDock() {
      if (open) return;
      open = true;
      toggle.setAttribute("aria-expanded", "true");
      placeIndicator(activeIndex);

      const fromW = pill.offsetWidth;
      const fromH = pill.offsetHeight;

      if (dockTl) dockTl.kill();
      gsap.set(list, { visibility: "inherit" });
      gsap.set(pill, { width: fromW, height: fromH });
      gsap.set(links[activeIndex], { yPercent: 0, opacity: 1 });

      dockTl = gsap.timeline()
        /* Langsamer als zuvor (0.45): Die Karte wächst über zwei Drittel
           mehr Zeit auf, die Einträge laufen darin gestaffelt auf. Das Öffnen
           ist die tragende Bewegung, nicht das Auflaufen der Zeilen. */
        .to(pill, {
          width: list.offsetWidth,
          height: list.offsetHeight,
          duration: dur(0.75),
          ease: ease("back.out(1.05)", "power3.out"),
        }, 0)
        .to(toggle, { autoAlpha: 0, duration: dur(0.15), ease: "power1.out" }, 0)
        .to(list, { opacity: 1, duration: dur(0.5), ease: "power1.out" }, dur(0.08))
        /* Die Einträge laufen von unten nach oben auf — dort sitzt der Knopf,
           aus dem sich die Karte öffnet, und die Bewegung folgt derselben
           Richtung.

           Ein Versuch, sie vom aktiven Abschnitt nach außen laufen zu lassen,
           ist wieder verworfen: Er war zwar symmetrisch, wirkte aber
           unmotiviert, weil die Karte selbst von unten wächst. */
        .fromTo(
          links.filter((l, i) => i !== activeIndex),
          { yPercent: 40, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            /* Langsamer als das Aufklappen selbst: Die Zeilen sollen
               erscheinen, während die Karte schon steht, nicht mit ihr um
               die Aufmerksamkeit ringen. */
            duration: dur(0.55),
            ease: "power2.out",
            stagger: { each: dur(0.025), from: "end" },
          },
          dur(0.12)
        );
    }

    function closeDock() {
      if (!open) return;
      open = false;
      toggle.setAttribute("aria-expanded", "false");

      if (dockTl) dockTl.kill();

      dockTl = gsap.timeline({
        onComplete: () => {
          gsap.set(pill, { clearProps: "width,height" });
          gsap.set(list, { visibility: "hidden" });
          gsap.set(links, { yPercent: 0, opacity: 1 });
        },
      })
        .to(pill, {
          width: toggle.offsetWidth,
          height: toggle.offsetHeight,
          duration: dur(0.3),
          ease: "power3.out",
        }, 0)
        .to(list, { opacity: 0, duration: dur(0.15), ease: "power1.out" }, 0)
        .to(toggle, { autoAlpha: 1, duration: dur(0.25), ease: "power1.out" }, dur(0.1));
    }

    /* Der Wechsel greift an der Kante, an der der Abschnitt ins Bild kommt —
       und die liegt je nach Richtung woanders:

         nach unten   `top bottom`    Oberkante berührt den unteren Bildrand
         nach oben    `bottom center` Unterkante erreicht die Bildmitte

       Nach unten ist das der Moment, in dem der Abschnitt zu erscheinen
       beginnt. Vorher stand hier `top 10%`: Das hieß fast eine ganze Bildhöhe
       warten, bis der Abschnitt oben angekommen war — man las längst im neuen
       Kapitel, während das Menü noch das alte zeigte.

       Nach oben ist die spiegelbildliche Kante (`bottom top`) zwar formal
       dieselbe, fühlt sich aber falsch an: Sie greift, wenn vom Abschnitt
       gerade ein Pixel am oberen Rand auftaucht — der Bildschirm zeigt dann
       noch fast vollständig den Abschnitt darunter. Deshalb die Bildmitte:
       Der Eintrag wechselt, sobald der Abschnitt die obere Bildhälfte
       einnimmt.

       `onEnter` feuert am Beginn beim Hinunterscrollen, `onEnterBack` am Ende
       beim Hinaufscrollen — genau die beiden Kanten. Die Richtung geht an
       `setActive` weiter, damit die Beschriftung in die passende Richtung
       durchläuft. */
    sections.forEach((section, i) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom center",
        onEnter: () => setActive(i, true),
        onEnterBack: () => setActive(i, false),
      });
    });

    let isHidden = true;
    let hideTriggers = [];
    let rangeTrigger = null;

    gsap.set(dock, { yPercent: 40, autoAlpha: 0 });
    dock.toggleAttribute("data-hidden", true);

    function updateHidden() {
      const inRange = rangeTrigger ? rangeTrigger.isActive : true;
      const hidden = !inRange || hideTriggers.some((t) => t.isActive);

      if (hidden === isHidden) return;
      isHidden = hidden;
      if (hidden && open) closeDock();
      dock.toggleAttribute("data-hidden", hidden);
      gsap.to(dock, {
        yPercent: hidden ? 40 : 0,
        autoAlpha: hidden ? 0 : 1,
        duration: dur(0.3),
        ease: hidden ? "power2.out" : ease("back.out(1.4)", "power3.out"),
      });
    }

    /* Das Menü ist da, sobald der erste Abschnitt ins Bild kommt — `top bottom`
       heißt: seine Oberkante berührt den unteren Bildrand.

       Vorher hing der Beginn am Inhaltsverzeichnis („bottom top": erscheint,
       wenn das Verzeichnis oben aus dem Bild gelaufen ist). Das war um eine
       ganze Bildhöhe zu spät — beim Lesen von „1 Was sind Veneers" gab es noch
       kein Menü, obwohl der Abschnitt längst dastand.

       Dass Verzeichnis und Menü sich dabei kurz überschneiden, ist kein
       Doppel: Das Verzeichnis ist zu dem Zeitpunkt nur noch am oberen Rand zu
       sehen, und wer weiterliest, braucht die Sprungmarken ab dem ersten
       Abschnitt. */
    rangeTrigger = ScrollTrigger.create({
      trigger: sections[0],
      endTrigger: sections[sections.length - 1],
      start: "top bottom",
      end: "bottom 10%",
      onToggle: updateHidden,
    });

    /* The footer counts as a hide zone without carrying an attribute of its
       own. Marking it in `Footer.astro` would have put a dock-specific
       attribute into the markup of every page on the site, including the ones
       that never show a dock - the footer is shared by all of them. */
    const zones = [
      ...document.querySelectorAll("[data-section-dock-hide]"),
      ...document.querySelectorAll(".c-footer"),
    ];

    hideTriggers = zones.map((zone) => {
      const offset = parseFloat(zone.getAttribute("data-section-dock-hide"));
      const line = 100 - gsap.utils.clamp(0, 100, Number.isNaN(offset) ? 10 : offset);
      return ScrollTrigger.create({
        trigger: zone,
        start: "top " + line + "%",
        end: "bottom top",
        onToggle: updateHidden,
      });
    });

    links.forEach((link) => {
      link.addEventListener("click", () => closeDock());
    });

    toggle.addEventListener("click", () => {
      if (open) {
        closeDock();
        return;
      }
      openDock();
      links[activeIndex].focus();
    });

    if (canHover.matches) {
      dock.addEventListener("mouseenter", openDock);
      dock.addEventListener("mouseleave", closeDock);
    }

    const onKeydown = (event) => {
      if (event.key === "Escape" && open) {
        closeDock();
        gsap.delayedCall(0.15, () => toggle.focus());
      }
    };
    const onDocumentClick = (event) => {
      if (open && !dock.contains(event.target)) closeDock();
    };
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("click", onDocumentClick);
    removers.push(() => document.removeEventListener("keydown", onKeydown));
    removers.push(() => document.removeEventListener("click", onDocumentClick));

    dock.addEventListener("focusout", (event) => {
      if (open && !dock.contains(event.relatedTarget)) closeDock();
    });

    function refreshLayout() {
      setLabel(activeIndex);
      placeIndicator(activeIndex);
      if (open) gsap.set(pill, { width: list.offsetWidth, height: list.offsetHeight });
    }
    window.addEventListener("resize", refreshLayout);
    removers.push(() => window.removeEventListener("resize", refreshLayout));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refreshLayout);

    syncLinkState();
    refreshLayout();
  });

  if (removers.length) cleanup = () => removers.forEach((off) => off());
}
