import { sanityClient } from "sanity:client";
import { ohneNull, type OhneNull } from "./ohne-null";
import type { LEISTUNG_QUERY_RESULT } from "./sanity.types";
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
/* Was aus dem CMS kommt, ist NICHT schon eine `Leistung` — es ist das, was
   die Abfrage zurückgibt, und dort ist fast alles wahlfrei. Die Signatur
   behauptete bis Aufgabe 1 das Gegenteil, obwohl der Rumpf mit `d.intro?.`
   längst vom Gegenteil ausging. TypeGen macht daraus einen Vertrag, den man
   nicht mehr versehentlich brechen kann. */
type LeistungAusCms = NonNullable<OhneNull<LEISTUNG_QUERY_RESULT>>;

function mitRueckfall(d: LeistungAusCms): Leistung {
  const b = beispielLeistung;

  return {
    ...d,
    titel: d.titel || b.titel,
    topline: d.topline || b.topline,

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

    /* Abschnitte, die das Inhaltsmodell nicht kennt — und die die Abfrage
       deshalb auch nicht auswählt.

       Hier stand bis Aufgabe 1 `d.vorherNachher ?? b.vorherNachher` und so
       fort, als könnte das CMS diese vier liefern. Konnte es nie: Weder das
       Schema noch die Projektion in `queries.ts` enthalten sie. Die vier
       Ausdrücke werteten bei jedem Aufruf zum Rückfall aus, und der
       handgeschriebene Typparameter am Abruf ließ das wie Absicht aussehen.
       TypeGen hat es in dem Moment aufgedeckt, in dem der Typ aus der
       Abfrage kam statt aus der Behauptung.

       Sie stehen jetzt als das da, was sie sind: fest, nicht gepflegt.
       Wächst das Schema um dieselben Feldnamen, gewinnt es automatisch —
       dann tauchen sie im erzeugten Typ auf, und diese Zeilen werden zur
       Übernahme aus `d`. */
    vorherNachher: b.vorherNachher,
    statement: b.statement,
    schritte: b.schritte,
    features: b.features,
  };
}

export async function ladeLeistung(slug: string): Promise<{ daten: Leistung; ausCms: boolean }> {
  try {
    const daten = ohneNull(await sanityClient.fetch(LEISTUNG_QUERY, { slug }));
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
