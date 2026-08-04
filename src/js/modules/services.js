/**
 * Services-Tabelle: ein Bild-Preview hängt am Cursor und wechselt je Zeile.
 *
 * Das Preview liegt position:fixed und wird ausschließlich per transform
 * bewegt (quickTo) — kein Layout, kein Repaint pro Frame.
 */
import { gsap } from "../lib/gsap.js";

export function initServicesPreview() {
  const table = document.querySelector("[data-services]");
  if (!table) return;

  const preview = table.querySelector("[data-services-preview]");
  const img = preview?.querySelector("img");
  const label = preview?.querySelector("[data-preview-label]");
  const list = table.querySelector("[data-services-list]") ?? table;
  const rows = [...table.querySelectorAll("[data-service-row]")];
  if (!preview || !img || !rows.length) return;

  // Auf Touch bringt das Preview nichts — dort gar nicht erst starten.
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    preview.remove();
    return;
  }

  const xTo = gsap.quickTo(preview, "x", { duration: 0.55, ease: "power3" });
  const yTo = gsap.quickTo(preview, "y", { duration: 0.55, ease: "power3" });
  const rTo = gsap.quickTo(preview, "rotation", { duration: 0.8, ease: "power3" });

  let lastX = null;
  let visible = false;

  gsap.set(preview, { scale: 0.85, opacity: 0, transformOrigin: "center center" });

  const centerOn = (e) => ({
    x: e.clientX - preview.offsetWidth / 2,
    y: e.clientY - preview.offsetHeight / 2,
  });

  /** Folgt dem Zeiger; die Drehung kommt aus der horizontalen Geschwindigkeit. */
  const move = (e) => {
    const { x, y } = centerOn(e);
    if (lastX !== null) {
      rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.5));
    }
    lastX = e.clientX;
    xTo(x);
    yTo(y);
  };

  const hide = () => {
    if (!visible) return;
    visible = false;
    lastX = null;
    gsap.to(preview, {
      opacity: 0,
      scale: 0.85,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  rows.forEach((row) => {
    row.addEventListener("pointerenter", (e) => {
      const src = row.dataset.preview;
      if (src && !img.src.endsWith(src)) img.src = src;
      if (label) label.textContent = row.dataset.previewLabel || "Mehr Info";

      if (visible) return;
      visible = true;

      // Erst an die Zeigerposition setzen, dann einblenden. Ohne das
      // zweite Argument von quickTo (der Startwert) würde das Preview aus
      // der linken oberen Ecke herangeflogen kommen — dort steht es, bevor
      // das erste pointermove eintrifft.
      const { x, y } = centerOn(e);
      xTo(x, x);
      yTo(y, y);
      rTo(0, 0);
      lastX = e.clientX;

      gsap.to(preview, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  });

  // Ausblenden hängt an der Liste, nicht an den einzelnen Zeilen: verlässt
  // der Zeiger die Tabelle zwischen zwei Zeilen oder springt er schnell
  // heraus, greift ein pointerleave pro Zeile nicht zuverlässig.
  list.addEventListener("pointerleave", hide);
  table.addEventListener("pointermove", move);

  // Sicherheitsnetze: Fenster verlassen, Tab wechseln, Kontextmenü öffnen.
  document.addEventListener("pointerleave", hide);
  window.addEventListener("blur", hide);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) hide();
  });
}
