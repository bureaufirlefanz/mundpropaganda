import { sanityClient } from "sanity:client";
import { withoutNull, type WithoutNull } from "./without-null";
import type { SERVICE_QUERY_RESULT } from "./sanity.types";
import { SERVICE_QUERY } from "./queries";
import { loadServiceList } from "./service-list";
import { fallbackFor } from "./loading";

/**
 * Welche Leistungsseiten gebaut werden — dieselbe Liste, aus der auch
 * Services-Tabelle, Menü und Footer entstehen.
 *
 * Bewusst nicht nur die Dokumente mit Slug: die drei Aufzählungen verlinken
 * jede Leistung der Liste. Käme die Seite nicht dazu, zeigte jeder zweite
 * Menüpunkt ins Leere. Wer in der Liste steht, bekommt eine Seite.
 */
export async function loadSlugs(): Promise<{ params: { slug: string } }[]> {
  const liste = await loadServiceList();
  return liste.map((l) => ({ params: { slug: l.slug } }));
}

/**
 * Was die Abfrage liefert — und nichts darüber hinaus.
 *
 * Bis Aufgabe 4 stand hier `mitRueckfall()`: eine Funktion, die jedes fehlende
 * Feld aus `beispielLeistung` auffüllte. Gedacht war sie als Netz für die
 * Einrichtung, gewirkt hat sie als Etikettenschwindel — nur `veneers` ist
 * gepflegt, und die zehn übrigen Seiten zeigten dadurch dessen Inhalt unter
 * eigenem Namen. Auf `/leistungen/bleaching` stand „Was Veneers leisten",
 * das Wort Veneers kam 31-mal vor, und darunter standen Veneers-Preise.
 *
 * Das ist kein CMS-Problem mehr, sondern eine falsche Aussage über eine
 * Behandlung samt Preis. Der Rückfall ist deshalb ersatzlos weg: Ein
 * Abschnitt, den das Dokument nicht trägt, erscheint nicht. Zehn Seiten sind
 * seitdem dünn — sie waren es vorher auch, man sah es nur nicht.
 *
 * Die Bilder bleiben die bekannte Ausnahme: Ein leeres Bildfeld fällt weiter
 * auf das gestaltete Motiv zurück. Das entscheidet der Baustein, nicht diese
 * Datei — er kennt sein Motiv, die Datenschicht nicht.
 */
export type Service = NonNullable<WithoutNull<SERVICE_QUERY_RESULT>>;

/**
 * Eine Leistung laden.
 *
 * `undefined`, wenn es zum Slug kein Dokument gibt. Der Fall ist echt: Die
 * Seiten entstehen aus der Liste, und die Liste kommt aus derselben
 * Collection — ein Slug ohne Dokument kann also nur eine Leistung sein, die
 * zwischen Listenabfrage und Detailabfrage verschwunden ist. Die Seite zeigt
 * dann ihren Titel aus der Liste und sonst nichts Erfundenes.
 */
export async function loadService(slug: string): Promise<Service | undefined> {
  return sanityClient
    .fetch(SERVICE_QUERY, { slug })
    .then((d) => withoutNull(d) ?? undefined)
    .catch(fallbackFor("eine Leistungsseite", undefined));
}
