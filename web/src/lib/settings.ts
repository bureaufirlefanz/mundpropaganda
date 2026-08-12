import { sanityClient } from "sanity:client";
import { withoutNull } from "./without-null";
import { SETTINGS_QUERY } from "./queries";
import { imageUrl, isCmsImage } from "./images";

/**
 * Die Angaben, die auf jeder Seite gleich sind. Ein Einzeldokument im Studio.
 *
 * Bis Aufgabe 4 stand hier ein vollständiger Beispielstand aus dem Prototyp,
 * und jedes leere Feld fiel darauf zurück. Das ist abgeschafft: Die Telefon-
 * nummer, die auf der Seite steht, ist die, die im Studio steht — sonst
 * telefoniert der Kunde einer Nummer hinterher, die er dort nirgends findet.
 *
 * Die Klassen wie bei der Startseite:
 *
 *   Klasse 1  phone, email, locations — im Schema Pflicht. Ohne Anschrift
 *             und Rufnummer ist eine Praxis-Website kaputt, nicht leer.
 *   Klasse 2  Bewertungen und Profile. Was nicht gepflegt ist, verschwindet:
 *             der Balken ganz, ein Profil einzeln. Eine Praxis ohne
 *             Bewertungen soll nicht „0 Bewertungen, 0,0 von 5" anzeigen.
 */

export interface Social {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

/**
 * Ein Standort. Das Kürzel ist die große Konturzahl auf der Startseite
 * („P25"), es steckt zugleich die Hausnummer — daher stammt die Adresse.
 */
/** Eine Zeile Öffnungszeit: „Mo–Do" links, „8–19 Uhr" rechts. */
export interface Oeffnungszeit {
  days: string;
  time: string;
}

export interface Standort {
  shortCode: string;
  name: string;
  street: string;
  city: string;
  /* Klasse 2: Im Schema steht keine Pflichtregel. Fehlt der Text, steht unter
     der Anschrift nichts — es tritt keiner an seine Stelle. */
  description?: string;
  /* Klasse 2, je Standort. Eine leere Liste heißt: kein Zeitenblock. Erfundene
     Zeiten wären hier so teuer wie eine erfundene Rufnummer — jemand steht
     dann vor einer verschlossenen Tür. */
  hours?: Oeffnungszeit[];
  /* Für die Karte auf der Praxisseite. Beide fehlen oder beide sind da —
     `Locations.astro` prüft auf genau das. Ein geratener Punkt schickt
     jemanden an die falsche Tür, deshalb gibt es keinen Rückfall. */
  latitude?: number;
  longitude?: number;
}

/**
 * Der Bewertungsbalken. Als EIN wahlfreies Objekt und nicht als drei einzelne
 * Felder: Der Balken braucht Quelle, Anzahl und Schnitt zusammen. Läge jedes
 * für sich vor, ließe sich ein halber Balken bauen — „Google Reviews, 0
 * Bewertungen" ist schlechter als gar keiner.
 */
export interface Bewertungen {
  anbieter: string;
  anzahl: number;
  schnitt: number;
}

/**
 * Was die ganze Website betrifft und nicht eine einzelne Seite. Anderswo
 * heißt das Site Settings; bis hierher stand es fest in `Base.astro`,
 * `public/robots.txt` und `public/_headers`.
 */
export interface WebsiteEinstellungen {
  /** Hinter jedem Seitentitel im Tab und als `og:site_name`. */
  siteName: string;
  /** Symbol im Browser-Tab. Fehlt es, bleibt es bei der Wortmarke. */
  faviconUrl?: string;
  /** Springt ein, wenn eine Seite keine eigene SEO-Beschreibung hat. */
  defaultDescription?: string;
  /** Springt als Teilen-Motiv ein. Absolute URL vom Sanity-CDN. */
  shareImageUrl?: string;
  /** Aus heißt: robots.txt sperrt, X-Robots-Tag sperrt, jede Seite trägt noindex. */
  searchEngines: boolean;
  googleVerification?: string;
  plausibleDomain?: string;
}

export interface Settings {
  phone: string;
  email: string;
  locations: Standort[];
  bewertungen?: Bewertungen;
  social: Social;
  /* Der Kontaktbereich steht auf mehreren Seiten und ist überall derselbe —
     deshalb hier und nicht je Seite. */
  contactTitle: string;
  contactText?: string;
  website: WebsiteEinstellungen;
}

/* Einmal je Build. Rahmen und Hero questions dasselbe Dokument ab. */
let cached: Promise<Settings> | null = null;

export function loadSettings(): Promise<Settings> {
  cached ??= sanityClient
    .fetch(SETTINGS_QUERY)
    .then(withoutNull)
    .then((d) => ({
      /* Klasse 1, notfalls leer. Das Schema verlangt die drei, aber der Build
         liest ein Dataset und kein Studio — ein Import oder ein von Hand
         gelöschtes Feld kommt an der Pflichtregel vorbei. Dann steht die
         Stelle leer, und die Bausteine blenden sie aus. Ein Ersatzwert wäre
         hier besonders teuer: Eine erfundene Rufnummer sieht richtig aus. */
      phone: d?.phone || "",
      email: d?.email || "",
      locations: d?.locations ?? [],
      contactTitle: d?.contactTitle || "",
      contactText: d?.contactText || undefined,

      /* Klasse 2, alles oder nichts. `!= null` und nicht `||`: Ein Schnitt von
         0 ist ein gepflegter Wert und keine Lücke. */
      bewertungen:
        d?.reviewsProvider && d?.reviewsCount != null && d?.reviewsAverage != null
          ? {
              anbieter: d.reviewsProvider,
              anzahl: d.reviewsCount,
              schnitt: d.reviewsAverage,
            }
          : undefined,

      /* Klasse 2 je Profil. Ein Symbol ohne Ziel führt nirgends hin und sieht
         trotzdem nach Angebot aus — Footer.astro filtert leere heraus. */
      social: d?.social ?? {},

      /* Der Name ist Klasse 1: Ohne ihn stünde im Tab nur der Seitentitel und
         beim Teilen gar kein Absender. Der Rückfall steht hier und nicht im
         Schema, weil ein leeres Pflichtfeld aus einem Import kommen kann.

         `searchEngines` fällt bewusst auf `false`: Fehlt das Feld, ist die
         sichere Antwort „nicht indexieren". Ein Rückfall auf `true` hieße,
         dass ein vergessenes Feld die Seite in den Index schiebt. */
      website: {
        siteName: d?.siteName || "Mundpropaganda",
        faviconUrl: isCmsImage(d?.favicon) ? imageUrl(d.favicon, 512) : undefined,
        defaultDescription: d?.defaultDescription || undefined,
        shareImageUrl: isCmsImage(d?.shareImage)
          ? imageUrl(d.shareImage, 1200, 1.91)
          : undefined,
        searchEngines: d?.searchEngines === true,
        googleVerification: d?.googleVerification || undefined,
        plausibleDomain: d?.plausibleDomain || undefined,
      },
    }))
    /* Kein Rückfall mehr im Fehlerfall. Ist das CMS nicht erreichbar, soll der
       Build eine sichtbar leere Seite ergeben und nicht eine, die mit alten
       Daten aus dem Prototyp vollständig aussieht. */
    .catch(() => ({
      phone: "",
      email: "",
      locations: [],
      social: {},
      contactTitle: "",
      website: { siteName: "Mundpropaganda", searchEngines: false },
    }));

  return cached;
}

/** „5,0 von 5" — deutsches Dezimalkomma, immer eine Nachkommastelle. */
export const schnittText = (value: number) =>
  `${value.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} von 5`;

/** Telefonnummer als wählbarer Link: alles außer Ziffern und führendem Plus. */
export const telLink = (nummer: string) => `tel:${nummer.replace(/(?!^\+)[^\d]/g, "")}`;
