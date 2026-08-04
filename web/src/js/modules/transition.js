/**
 * Seitenwechsel als Column-Wipe.
 *
 * Fünf Spalten wandern durch drei Zustände: 0 (über dem Viewport),
 * 100 (deckt ab), 200 (darunter durch, gibt frei). Beim Verlassen läuft
 * der Versatz von rechts nach links, beim Ankommen von links nach rechts.
 * Über beide Seiten hinweg liest sich das als eine Bewegung mit Rhythmus.
 *
 * Bewusst ohne clientseitigen Router: die Seiten werden weiterhin normal
 * geladen. Ein Container-Tausch würde bedeuten, jedes Modul bei jedem
 * Wechsel neu aufzusetzen — das ist ein Architekturumbau, kein Übergang.
 * Der Effekt ist derselbe, weil die Spalten während des Ladens abdecken.
 *
 * Dass die Spalten auf der Zielseite von Anfang an abdecken, entscheidet
 * ein Inline-Skript im Head (siehe partials/head.hbs). Dieses Modul läuft
 * erst nach dem ersten Bild und käme dafür zu spät.
 */
import { gsap, prefersReducedMotion } from "../lib/gsap.js";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("osmo", "0.625, 0.05, 0, 1");

const FLAG = "mp:transition";
const DURATION = 0.6;
const STAGGER = 0.06;

export function initTransitions() {
  const wrap = document.querySelector("[data-transition-wrap]");
  if (!wrap) return;

  const columns = wrap.querySelectorAll("[data-transition-column]");
  if (!columns.length) return;

  const root = document.documentElement;
  const entering = root.classList.contains("is-entering");

  if (prefersReducedMotion) {
    root.classList.remove("is-entering");
    gsap.set(columns, { yPercent: 0 });
    return;
  }

  /* Ausgangslage einmal über GSAP setzen, nicht dem CSS überlassen: eine
     in Prozent geschriebene Transformation liest GSAP beim ersten Zugriff
     als Pixelwert aus dem Computed Style und addiert sie zum Prozentwert.
     Das ausdrückliche y: 0 räumt den Pixelanteil ab. */
  gsap.set(columns, { y: 0, yPercent: entering ? 100 : 0 });

  /* --- Ankunft: die Spalten laufen nach unten durch -------------------- */
  if (entering) {
    root.classList.remove("is-entering");

    gsap.to(columns, {
      yPercent: 200,
      duration: DURATION,
      ease: "osmo",
      stagger: STAGGER,
      overwrite: "auto",
      // Zurück in die Ruhelage über dem Viewport, bereit für den nächsten
      // Wechsel.
      onComplete: () => gsap.set(columns, { yPercent: 0 }),
    });
  }

  /* --- Abgang: die Spalten fahren herunter und decken ab ---------------- */
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!isInternalNavigation(link, e)) return;

    e.preventDefault();
    try {
      sessionStorage.setItem(FLAG, "1");
    } catch {
      // Ohne Speicher kein nahtloser Übergang — der Wechsel selbst
      // funktioniert trotzdem.
    }

    gsap.to(columns, {
      yPercent: 100,
      duration: DURATION,
      ease: "osmo",
      stagger: { each: STAGGER, from: "end" },
      overwrite: "auto",
      onComplete: () => {
        window.location.href = link.href;
      },
    });
  });

  /* Zurück-Navigation zeigt die Seite aus dem Cache — dann stehen die
     Spalten noch oben drauf. Also wegräumen. */
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) gsap.set(columns, { yPercent: 0 });
  });
}

/** Nur echte Seitenwechsel innerhalb der Site abfangen. */
function isInternalNavigation(link, event) {
  if (!link || !link.href) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return false;
  if (link.target && link.target !== "_self") return false;
  if (link.hasAttribute("download")) return false;

  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin) return false;

  /* Gleicher Pfad heißt: kein Seitenwechsel. Das deckt Anker (#kontakt),
     Platzhalter (#) und den Logo-Link auf die eigene Seite gleichermaßen
     ab. Vorher wurde nur auf einen vorhandenen Hash geprüft — „#" allein
     hat keinen, und `/` unterscheidet sich als Zeichenkette von `/?x`.
     Beides löste dadurch einen vollen Neuaufbau aus. */
  if (url.pathname === location.pathname) return false;

  return true;
}
