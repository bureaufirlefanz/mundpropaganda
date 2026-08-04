import { sanityClient } from "sanity:client";
import { LEISTUNG_QUERY } from "./queries";
import { beispielLeistung, type Leistung } from "./fixtures";
import { istCmsBild } from "./bilder";
import { ladeLeistungsliste } from "./leistungsliste";

/**
 * Welche Leistungsseiten gebaut werden — dieselbe Liste, aus der auch
 * Services-Tabelle, Menü und Footer entstehen.
 *
 * Bewusst nicht nur die Dokumente mit Slug: die drei Aufzählungen verlinken
 * jede Leistung der Liste. Käme die Seite nicht dazu, zeigte jeder zweite
 * Menüpunkt ins Leere. Wer in der Liste steht, bekommt eine Seite.
 */
export async function ladeSlugs(): Promise<{ params: { slug: string } }[]> {
  const liste = await ladeLeistungsliste();
  return liste.map((l) => ({ params: { slug: l.slug } }));
}

/**
 * Solange im CMS keine Bilder gepflegt sind, treten die lokalen Motive ein.
 * Ohne das lieferte die Seite leere <img> aus — Text ist gepflegt, Bilder
 * sind es typischerweise erst später.
 *
 * Geprüft wird auf ein aufgelöstes Asset, nicht nur auf Vorhandensein: ein
 * Bildfeld, das im Studio angefasst und wieder geleert wurde, bleibt als
 * Objekt ohne `asset` stehen. Mit einer `??`-Prüfung galt das als gepflegtes
 * Bild, und der URL-Bauer bekäme nichts zu tun.
 */
function mitRueckfall(d: Leistung): Leistung {
  const b = beispielLeistung;

  return {
    ...d,

    /* Abschnitt für Abschnitt, nicht nur die Handvoll, die das Schema noch
       nicht kennt.

       Der Grund ist ein Fehler, den der leere Datensatz lange verdeckt hat:
       Sobald ein Leistungsdokument existiert, gilt `ausCms` — und dann kamen
       die Abschnitte, die darin noch nicht gepflegt sind, als `undefined`
       bei den Bausteinen an. `intro.spalten.map` brach den Build ab, sobald
       die erste Leistung mit bloßen Grunddaten im CMS lag.

       So ist die Pflege im Studio Feld für Feld möglich: Eine Leistung mit
       nur Titel und Slug zeigt eine vollständige Seite, und jedes gefüllte
       Feld übernimmt seinen Platz. */
    hero: {
      ...b.hero,
      ...d.hero,
      text: d.hero?.text || b.hero.text,
      bild: istCmsBild(d.hero?.bild) ? d.hero.bild : b.hero.bild,
    },

    intro: {
      topline: d.intro?.topline || b.intro.topline,
      headline: d.intro?.headline || b.intro.headline,
      spalten: d.intro?.spalten?.length ? d.intro.spalten : b.intro.spalten,
    },

    benefits: {
      topline: d.benefits?.topline || b.benefits.topline,
      headline: d.benefits?.headline || b.benefits.headline,
      eintraege: (d.benefits?.eintraege?.length ? d.benefits.eintraege : b.benefits.eintraege).map(
        (e, i) => ({
          ...e,
          bild: istCmsBild(e.bild)
            ? e.bild
            : b.benefits.eintraege[i % b.benefits.eintraege.length].bild,
        })
      ),
    },

    preise: d.preise?.length ? d.preise : b.preise,
    faq: d.faq?.length ? d.faq : b.faq,

    /* Abschnitte, die das Inhaltsmodell noch nicht kennt. */
    vorherNachher: d.vorherNachher ?? b.vorherNachher,
    statement: d.statement ?? b.statement,
    schritte: d.schritte ?? b.schritte,
    features: d.features ?? b.features,
  };
}

export async function ladeLeistung(slug: string): Promise<{ daten: Leistung; ausCms: boolean }> {
  try {
    const daten = await sanityClient.fetch<Leistung | null>(LEISTUNG_QUERY, { slug });
    if (daten) return { daten: mitRueckfall(daten), ausCms: true };
  } catch {
    // s. o.
  }

  /* Kein Dokument zu diesem Slug — die Beispieldaten tragen die Seite. Den
     Namen aber aus der Liste übernehmen: sonst stünde über jeder ungepflegten
     Leistung „Veneers", und alle Seiten sähen identisch aus.

     Als Überschrift der ausgeschriebene Name, in der Topline der kurze: „CMD
     mit Botoxbehandlung und elektronischer Kiefergelenksvermessung in Berlin"
     wäre als Topline unlesbar. */
  const eintrag = (await ladeLeistungsliste()).find((l) => l.slug === slug);
  const daten = eintrag
    ? { ...beispielLeistung, titel: eintrag.titel ?? eintrag.name, topline: `${eintrag.name} in Berlin` }
    : beispielLeistung;

  return { daten, ausCms: false };
}
