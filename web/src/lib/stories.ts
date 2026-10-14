import { sanityClient } from "sanity:client";
import { withoutNull } from "./without-null";
import { STORIES_QUERY } from "./queries";
import type { STORIES_QUERY_RESULT } from "./sanity.types";
import type { WithoutNull } from "./without-null";
import { fallbackFor } from "./loading";

/** One story, see `studio/schemaTypes/documents/collections.ts`. */
export type Story = WithoutNull<STORIES_QUERY_RESULT>[number];

let cached: Promise<Story[]> | null = null;

/** All stories, once per build. The homepage shows them all. */
export function loadStories(): Promise<Story[]> {
  cached ??= sanityClient
    .fetch(STORIES_QUERY)
    .then(withoutNull)
    .then((list) => list ?? [])
    .catch(fallbackFor("die Geschichten", []));
  return cached;
}

/**
 * The stories of one service page: the generic ones (no services assigned)
 * and those assigned to this slug. A service with neither gets none, and
 * the section stays away.
 */
export async function storiesFor(slug: string): Promise<Story[]> {
  const all = await loadStories();
  return all.filter((s) => !s.services?.length || s.services.includes(slug));
}
