/**
 * Gemeinsamer Browserstart für alle Prüfskripte.
 *
 * Nutzt das lokal installierte Chrome (puppeteer-core lädt keine eigene
 * Binary herunter) und meldet früh und verständlich, wenn der Dev-Server
 * nicht läuft — sonst kommt nur ERR_CONNECTION_REFUSED zurück.
 */
import puppeteer from "puppeteer-core";

export const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

export function starteBrowser(args = []) {
  return puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--force-device-scale-factor=1", "--hide-scrollbars", ...args],
  });
}

/**
 * Prüft, ob unter `base` überhaupt etwas antwortet. Ohne das laufen die
 * Skripte minutenlang in Timeouts, statt zu sagen, was fehlt.
 */
export async function erwarteServer(base, startbefehl) {
  try {
    await fetch(base, { signal: AbortSignal.timeout(3000) });
  } catch {
    console.error(`Kein Server auf ${base}.\nBitte in einem zweiten Terminal starten:\n\n  ${startbefehl}\n`);
    process.exit(2);
  }
}
