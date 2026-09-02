import { sanityClient } from "sanity:client";
import { withoutNull } from "./without-null";
import { PRACTICE_QUERY, TEAM_QUERY, PERSON_QUERY } from "./queries";
import type {
  PRACTICE_QUERY_RESULT,
  TEAM_QUERY_RESULT,
  PERSON_QUERY_RESULT,
} from "./sanity.types";
import type { WithoutNull } from "./without-null";
import { fallbackFor } from "./loading";

/**
 * Die Praxisseite und das Team.
 *
 * Drei Abfragen und nicht eine: Die Seite selbst trägt nur ihre
 * Überschriften, das Team kommt aus der Personen-Sammlung, die Standorte aus
 * den Einstellungen. Wer sie zusammenlegte, müsste eine neue Kollegin an
 * zwei Stellen eintragen — und würde die zweite vergessen.
 */
export type PracticeContent = NonNullable<WithoutNull<PRACTICE_QUERY_RESULT>>;
export type Member = NonNullable<WithoutNull<TEAM_QUERY_RESULT>>[number];
export type PersonContent = NonNullable<WithoutNull<PERSON_QUERY_RESULT>>;

let cached: Promise<PracticeContent | undefined> | null = null;
let cachedTeam: Promise<Member[]> | null = null;

export function loadPractice(): Promise<PracticeContent | undefined> {
  cached ??= sanityClient
    .fetch(PRACTICE_QUERY)
    .then(withoutNull)
    .then((d) => d ?? undefined)
    .catch(fallbackFor("die Praxisseite", undefined));
  return cached;
}

/**
 * Das Team fürs Raster. Nur Personen mit Slug — ohne ihn gäbe es keine
 * Detailseite, und eine Kachel, die ins Leere führt, ist schlechter als
 * keine. Die Abfrage filtert das bereits; hier steht es, damit niemand den
 * Filter für überflüssig hält.
 */
export function loadTeam(): Promise<Member[]> {
  cachedTeam ??= sanityClient
    .fetch(TEAM_QUERY)
    .then(withoutNull)
    .then((liste) => liste ?? [])
    .catch(fallbackFor("das Team", []));
  return cachedTeam;
}

export function loadPerson(slug: string): Promise<PersonContent | undefined> {
  return sanityClient
    .fetch(PERSON_QUERY, { slug })
    .then(withoutNull)
    .then((d) => d ?? undefined)
    .catch(fallbackFor("eine Person", undefined));
}
