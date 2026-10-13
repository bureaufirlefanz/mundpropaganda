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
const SITEWIDE = [
  { title: "Startseite", href: "/" },
  { title: "Magazin", href: "/magazin" },
  { title: "Karriere", href: "/karriere" },
];

export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    /* --- Dokumente mit eigener Seite ---------------------------------- */

    homepage: defineLocations({
      select: {},
      resolve: () => ({ locations: [{ title: "Startseite", href: "/" }] }),
    }),

    careers: defineLocations({
      select: {},
      resolve: () => ({
        locations: [{ title: "Karriere", href: "/karriere" }],
      }),
    }),

    practice: defineLocations({
      select: {},
      resolve: () => ({ locations: [{ title: "Praxis", href: "/praxis" }] }),
    }),

    emergency: defineLocations({
      select: {},
      resolve: () => ({
        locations: [{ title: "Notdienst", href: "/notdienst" }],
      }),
    }),

    person: defineLocations({
      /* No page of its own since 2026-10-01. A person shows up as the
         author of magazine posts; the magazine is where to look. */
      select: {},
      resolve: () => ({
        locations: [{ title: "Magazin (als Autorin/Autor)", href: "/magazin" }],
      }),
    }),

    magazineIndex: defineLocations({
      select: {},
      resolve: () => ({ locations: [{ title: "Magazin", href: "/magazin" }] }),
    }),

    legalPage: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => {
        const path = pathFor("legalPage", doc?.slug ?? undefined);
        return {
          locations: [
            ...(path
              ? [{ title: doc?.title ?? "Der Rechtstext", href: path }]
              : []),
            /* Und die Zeile im Seitenfuß, die auf ihn verweist — sie steht
               auf jeder Seite. */
            { title: "Footer (überall)", href: "/" },
          ],
        };
      },
    }),

    service: defineLocations({
      select: { title: "title", shortName: "shortName", slug: "slug.current" },
      resolve: (doc) => {
        const path = pathFor("service", doc?.slug ?? undefined);
        return {
          locations: [
            /* Die eigene Seite zuerst — sie ist gemeint, wenn jemand die
               Leistung bearbeitet. */
            ...(path
              ? [{ title: doc?.title ?? "Die Leistung", href: path }]
              : []),
            /* Und die drei Aufzählungen, die denselben Namen tragen. Wer hier
               umbenennt, ändert sie alle mit — das soll man sehen, bevor man
               publiziert. */
            { title: "Startseite (Tabelle, Menü, Fuß)", href: "/" },
          ],
        };
      },
    }),

    post: defineLocations({
      select: {
        title: "title",
        slug: "slug.current",
        service: "service->slug.current",
      },
      resolve: (doc) => {
        const path = pathFor("post", doc?.slug ?? undefined);
        const serviceHref = pathFor("service", doc?.service ?? undefined);
        return {
          locations: [
            ...(path
              ? [{ title: doc?.title ?? "Der Beitrag", href: path }]
              : []),
            { title: "Magazin (Übersicht)", href: "/magazin" },
            { title: "Startseite (Karussell)", href: "/" },
            /* Nur wenn der Beitrag auf eine Leistung verweist: dort steht er
               dann unter „Passend zum Thema". */
            ...(serviceHref
              ? [{ title: "Die verknüpfte Leistung", href: serviceHref }]
              : []),
          ],
        };
      },
    }),

    /* --- Dokumente ohne eigene Seite ---------------------------------- */

    job: defineLocations({
      select: { title: "title" },
      resolve: () => ({
        locations: [{ title: "Karriere (Offene Stellen)", href: "/karriere" }],
      }),
    }),

    settings: defineLocations({
      select: {},
      resolve: () => ({
        locations: SITEWIDE,
        message:
          "Kontakt, Bewertungen, Standorte und die Profile stehen auf jeder Seite.",
      }),
    }),

    navigation: defineLocations({
      select: {},
      resolve: () => ({
        locations: SITEWIDE,
        message: "Die Leiste und das große Menü stehen auf jeder Seite.",
      }),
    }),

    footer: defineLocations({
      select: {},
      resolve: () => ({
        locations: SITEWIDE,
        message: "Der Footer steht auf jeder Seite.",
      }),
    }),
  },
};
