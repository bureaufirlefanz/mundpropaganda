import type { APIRoute } from "astro";
import { VORSCHAU_COOKIE } from "../../../lib/vorschau";

/**
 * Beendet die Vorschau.
 *
 * Braucht keine Prüfung: Abschalten darf jeder. Der Weg zurück führt auf die
 * echte, veröffentlichte Seite.
 */
export const prerender = false;

export const GET: APIRoute = async ({ cookies, redirect, url }) => {
  cookies.delete(VORSCHAU_COOKIE, { path: "/" });
  const ziel = url.searchParams.get("zurueck") ?? "/";
  return redirect(ziel.startsWith("/") ? ziel : "/", 307);
};
