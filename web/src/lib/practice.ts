import { sanityClient } from "sanity:client";
import { withoutNull } from "./without-null";
import { PRACTICE_QUERY } from "./queries";
import type { PRACTICE_QUERY_RESULT } from "./sanity.types";
import type { WithoutNull } from "./without-null";
import { fallbackFor } from "./loading";

/**
 * The practice page. The team is shown as photos (sections/TeamPhotos.astro)
 * since 2026-10-01; the person collection and its pages are gone from here.
 * People remain in the Studio as the authors of magazine posts.
 */
export type PracticeContent = NonNullable<WithoutNull<PRACTICE_QUERY_RESULT>>;

let cached: Promise<PracticeContent | undefined> | null = null;

export function loadPractice(): Promise<PracticeContent | undefined> {
  cached ??= sanityClient
    .fetch(PRACTICE_QUERY)
    .then(withoutNull)
    .then((d) => d ?? undefined)
    .catch(fallbackFor("die Praxisseite", undefined));
  return cached;
}
