import type { APIRoute } from "astro";
import { PREVIEW_COOKIE } from "../../../lib/preview";

/**
 * Beendet die Vorschau.
 *
 * Braucht keine Prüfung: Abschalten darf jeder. Der Weg zurück führt auf die
 * echte, veröffentlichte Seite.
 */
export const prerender = false;

export const GET: APIRoute = async ({ cookies, redirect, url }) => {
  cookies.delete(PREVIEW_COOKIE, { path: "/" });
  const target = url.searchParams.get("zurueck") ?? "/";
  /* Only a path on this site. `//evil.example` and `/\\evil.example` start
     with a slash too, and browsers read both as another host. */
  const local = /^\/(?![/\\])/.test(target);
  return redirect(local ? target : "/", 307);
};
