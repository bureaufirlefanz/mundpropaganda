import { defineLocations } from "sanity/presentation";
import type { PresentationPluginOptions } from "sanity/presentation";
import { pathFor } from "../lib/paths";

/**
 * Wo taucht dieses Dokument auf der Website auf?
 *
 * Das ist der eigentliche Gewinn des Presentation-Werkzeugs, und zwar in der
 * Richtung, die ein Baukasten nicht kann: Ein Dokument ohne eigene Seite —
 * die Einstellungen, die Navigation, eine Stelle — erscheint auf mehreren
 * Seiten. Ohne diese Zuordnung sähe die Redaktion beim Bearbeiten ein leeres
 * Vorschaufenster und wüsste nicht, wo ihre Änderung landet.
 *
 * Die Pfade kommen aus `lib/paths.ts`, nicht von hier. `pfadVon()` ist die
 * eine Stelle, an der eine URL entsteht — Vorschau, Locations und die
 * Routenprüfung in `scripts/check-web.mjs` lesen von dort. Eine zweite
 * Stelle, die Pfade baut, läuft garantiert auseinander.
 */

/** Die Seiten, auf denen der Rahmen überall sichtbar ist. */
const UEBERALL = [
  { title: "Startseite", href: "/" },
  { title: "Magazin", href: "/magazin" },
  { title: "Karriere", href: "/karriere" },
];

export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    /* --- Dokumente mit eigener Seite ---------------------------------- */

    startseite: defineLocations({
      resolve: () => ({ locations: [{ title: "Startseite", href: "/" }] }),
    }),

    karriere: defineLocations({
      resolve: () => ({ locations: [{ title: "Karriere", href: "/karriere" }] }),
    }),

    magazinIndex: defineLocations({
      resolve: () => ({ locations: [{ title: "Magazin", href: "/magazin" }] }),
    }),

    rechtstext: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => {
        const pfad = pathFor("legalPage", doc?.slug ?? undefined);
        return {
          locations: [
            ...(pfad ? [{ title: doc?.titel ?? "Der Rechtstext", href: pfad }] : []),
            /* Und die Zeile im Seitenfuß, die auf ihn verweist — sie steht
               auf jeder Seite. */
            { title: "Footer (überall)", href: "/" },
          ],
        };
      },
    }),

    leistung: defineLocations({
      select: { title: "title", shortName: "shortName", slug: "slug.current" },
      resolve: (doc) => {
        const pfad = pathFor("service", doc?.slug ?? undefined);
        return {
          locations: [
            /* Die eigene Seite zuerst — sie ist gemeint, wenn jemand die
               Leistung bearbeitet. */
            ...(pfad ? [{ title: doc?.titel ?? "Die Leistung", href: pfad }] : []),
            /* Und die drei Aufzählungen, die denselben Namen tragen. Wer hier
               umbenennt, ändert sie alle mit — das soll man sehen, bevor man
               publiziert. */
            { title: "Startseite (Tabelle, Menü, Fuß)", href: "/" },
          ],
        };
      },
    }),

    beitrag: defineLocations({
      select: { title: "title", slug: "slug.current", service: "service->slug.current" },
      resolve: (doc) => {
        const pfad = pathFor("post", doc?.slug ?? undefined);
        const zurLeistung = pathFor("service", doc?.leistung ?? undefined);
        return {
          locations: [
            ...(pfad ? [{ title: doc?.titel ?? "Der Beitrag", href: pfad }] : []),
            { title: "Magazin (Übersicht)", href: "/magazin" },
            { title: "Startseite (Karussell)", href: "/" },
            /* Nur wenn der Beitrag auf eine Leistung verweist: dort steht er
               dann unter „Passend zum Thema". */
            ...(zurLeistung ? [{ title: "Die verknüpfte Leistung", href: zurLeistung }] : []),
          ],
        };
      },
    }),

    /* --- Dokumente ohne eigene Seite ---------------------------------- */

    stelle: defineLocations({
      select: { title: "title" },
      resolve: () => ({ locations: [{ title: "Karriere (Offene Stellen)", href: "/karriere" }] }),
    }),

    einstellungen: defineLocations({
      resolve: () => ({
        locations: UEBERALL,
        message: "Kontakt, Bewertungen, Standorte und die Profile stehen auf jeder Seite.",
      }),
    }),

    navigation: defineLocations({
      resolve: () => ({
        locations: UEBERALL,
        message: "Die Leiste und das große Menü stehen auf jeder Seite.",
      }),
    }),

    footer: defineLocations({
      resolve: () => ({
        locations: UEBERALL,
        message: "Der Footer steht auf jeder Seite.",
      }),
    }),
  },
};
