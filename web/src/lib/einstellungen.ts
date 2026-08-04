import { sanityClient } from "sanity:client";
import { EINSTELLUNGEN_QUERY } from "./queries";

/**
 * Die Angaben, die auf jeder Seite gleich sind. Ein Einzeldokument im Studio,
 * hier ein Objekt mit Rückfall — Kontaktdaten dürfen nie fehlen, auch nicht,
 * solange im CMS noch nichts gepflegt ist.
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
export interface Standort {
  kuerzel: string;
  name: string;
  strasse: string;
  ort: string;
  beschreibung: string;
}

export interface Einstellungen {
  telefon: string;
  email: string;
  bewertungenAnbieter: string;
  bewertungenAnzahl: number;
  bewertungenSchnitt: number;
  social: Social;
  standorte: Standort[];
}

/** Der Stand aus dem Prototyp. */
export const beispielEinstellungen: Einstellungen = {
  telefon: "+49 3051 9999 580",
  email: "praxis@mundpropaganda.de",
  bewertungenAnbieter: "Google Reviews",
  bewertungenAnzahl: 272,
  bewertungenSchnitt: 5,
  social: { facebook: "#", instagram: "#", linkedin: "#", youtube: "#" },
  standorte: [
    {
      kuerzel: "P25",
      name: "Praxis Prenzlauer Allee",
      strasse: "Prenzlauer Allee 25",
      ort: "10405 Berlin",
      beschreibung:
        "Sechs Behandlungsräume, eigenes Meisterlabor im Haus, direkter " +
        "Zugang über den Innenhof. Termine Mo–Fr, 8–19 Uhr.",
    },
    {
      kuerzel: "C37",
      name: "Praxis Christburger Straße",
      strasse: "Christburger Straße 37",
      ort: "10405 Berlin",
      beschreibung:
        "Unser Standort für Prophylaxe und Aligner-Kontrollen. Barrierefrei, " +
        "fünf Minuten vom Kollwitzplatz.",
    },
  ],
};

/* Einmal je Build. Rahmen und Hero fragen dasselbe Dokument ab. */
let gemerkt: Promise<Einstellungen> | null = null;

export function ladeEinstellungen(): Promise<Einstellungen> {
  gemerkt ??= sanityClient
    .fetch<Partial<Einstellungen> | null>(EINSTELLUNGEN_QUERY)
    .then((d) => ({
      // Feld für Feld auffüllen, nicht das ganze Dokument verwerfen: ein
      // gepflegtes Telefon soll auch dann gelten, wenn die Bewertungszahlen
      // noch fehlen.
      ...beispielEinstellungen,
      ...Object.fromEntries(Object.entries(d ?? {}).filter(([, v]) => v != null && v !== "")),
      social: { ...beispielEinstellungen.social, ...(d?.social ?? {}) },
      // Standorte nur übernehmen, wenn wirklich welche gepflegt sind — eine
      // leere Liste im CMS soll die Adressen nicht von der Seite nehmen.
      standorte: d?.standorte?.length ? d.standorte : beispielEinstellungen.standorte,
    }))
    .catch(() => beispielEinstellungen);

  return gemerkt;
}

/** „5,0 von 5" — deutsches Dezimalkomma, immer eine Nachkommastelle. */
export const schnittText = (wert: number) =>
  `${wert.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} von 5`;

/** Telefonnummer als wählbarer Link: alles außer Ziffern und führendem Plus. */
export const telLink = (nummer: string) => `tel:${nummer.replace(/(?!^\+)[^\d]/g, "")}`;
