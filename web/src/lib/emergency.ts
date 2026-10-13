import { sanityClient } from "sanity:client";
import { withoutNull } from "./without-null";
import { EMERGENCY_QUERY } from "./queries";
import type { EMERGENCY_QUERY_RESULT } from "./sanity.types";
import type { WithoutNull } from "./without-null";
import { fallbackFor } from "./loading";

/** The emergency page, `/notdienst`. See `studio/schemaTypes/documents/emergency.ts`. */
export type EmergencyContent = NonNullable<WithoutNull<EMERGENCY_QUERY_RESULT>>;

let cached: Promise<EmergencyContent | undefined> | null = null;

export function loadEmergency(): Promise<EmergencyContent | undefined> {
  cached ??= sanityClient
    .fetch(EMERGENCY_QUERY)
    .then(withoutNull)
    .then((d) => d ?? undefined)
    .catch(fallbackFor("die Notdienstseite", undefined));
  return cached;
}
