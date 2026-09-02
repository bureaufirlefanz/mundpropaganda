import type { ImageSource } from "../lib/images";

/**
 * Das Werbefeld im großen Menü.
 *
 * Steht hier und nicht im Baustein, aus demselben Grund wie die Inhalte der
 * Pillar Page: Es ist gepflegter Inhalt, kein Aufbau. Sobald `navigation` im
 * Studio ein Objekt dafür trägt, wird aus diesem Import eine Abfrage, und
 * `ui/NavPromo.astro` bleibt unverändert — die Feldnamen hier sind schon die,
 * die das Schema tragen soll.
 *
 * **Ein Feld, nicht mehrere.** Ein zweites Werbefeld daneben wäre eine
 * Entscheidung darüber, was wichtiger ist, an einer Stelle, wo niemand sie
 * trifft — das Menü hat genau eine freie Spalte.
 */
export interface NavPromo {
  headline: string;
  href: string;
  label: string;
  image?: ImageSource;
  alt?: string;
}

export const navPromo: NavPromo = {
  headline: "Alles zum Thema Veneers",
  href: "/veneers-berlin",
  label: "Guide lesen",
  image: "veneers-modell",
  alt: "Zahnärztin im Behandlungsraum der Praxis",
};
