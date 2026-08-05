import type { APIRoute } from "astro";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { vorschauClient, VORSCHAU_COOKIE } from "../../../lib/vorschau";

/**
 * Schaltet die Vorschau frei.
 *
 * Aufgerufen wird das aus dem Studio: Das Presentation-Werkzeug legt dort ein
 * kurzlebiges Geheimnis im Datensatz ab, hängt es an diese Adresse und
 * schickt den Browser her. `validatePreviewUrl` prüft es gegen den Datensatz
 * — nur dann wird das Cookie gesetzt.
 *
 * Ohne diese Prüfung wäre `/preview/` für jeden offen, der die Adresse
 * errät. Sie ist die einzige Sperre, die zwischen einem unveröffentlichten
 * Entwurf und dem offenen Netz steht.
 */
export const prerender = false;

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const client = vorschauClient();
  if (!client) {
    return new Response("SANITY_API_READ_TOKEN fehlt.", { status: 500 });
  }

  const { isValid, redirectTo = "/" } = await validatePreviewUrl(client, request.url);
  if (!isValid) {
    return new Response("Ungültiges oder abgelaufenes Geheimnis.", { status: 401 });
  }

  cookies.set(VORSCHAU_COOKIE, "an", {
    path: "/",
    /* httpOnly: Kein Skript im Browser soll das Cookie lesen können — es
       schaltet Entwürfe frei. sameSite "none" mit secure, weil die Vorschau
       im Studio in einem iframe steckt und das Cookie sonst bei fremder
       Herkunft nicht mitgeschickt würde. Lokal über http bleibt es "lax":
       secure-Cookies verwirft der Browser dort. */
    httpOnly: true,
    sameSite: import.meta.env.DEV ? "lax" : "none",
    secure: !import.meta.env.DEV,
  });

  /* Auf die Vorschau-Fassung der Zielseite, nicht auf die echte: Die echten
     Routen sind vorgerendert und wüssten nichts von Entwürfen.

     Der Präfix wird nur gesetzt, wenn er fehlt. Das Presentation-Werkzeug
     liefert den Pfad der Location, also `/leistungen/veneers`; ruft jemand
     den Endpunkt aber mit einem bereits präfigierten Pfad auf, entstünde
     sonst `/preview/preview/…` und damit ein 404. */
  const ziel = redirectTo.startsWith("/preview")
    ? redirectTo
    : `/preview${redirectTo === "/" ? "" : redirectTo}`;

  return redirect(ziel, 307);
};
