/**
 * Auf einen bestimmten Schriftschnitt warten — und nur auf den.
 *
 * Warum das nötig ist: `document.fonts.ready` ist ein lebendes Versprechen.
 * Sobald irgendwo auf der Seite ein weiterer Schnitt nachgeladen wird, geht die
 * Sammlung zurück auf „loading", und ein späterer Zugriff bekommt ein neues,
 * entsprechend später erfülltes Versprechen. Wer es in einem Modul abfragt,
 * hängt damit nicht an „meine Schrift steht", sondern an „auf der ganzen Seite
 * lädt gerade keine Schrift mehr".
 *
 * Und warum die Anfrage **beim Import** gestellt wird, nicht erst beim Warten:
 * `document.fonts.load()` ist genauso wenig zu gebrauchen, wenn man es zu spät
 * ruft. Ist die Sammlung in dem Moment beschäftigt, wartet auch dieses
 * Versprechen auf sie — gemessen auf der Startseite (`npm run takt`):
 *
 *   Schnitt beim ersten Skriptlauf angefragt   →   69 ms
 *   dieselbe Anfrage bei astro:page-load       → 1423 ms
 *   document.fonts.ready                       → 1440 ms
 *
 * Die Choreografie startete deshalb rund 1,3 Sekunden zu spät, und je nach
 * Cache jedes Mal woanders. Angestoßen wird also sofort beim Laden dieses
 * Moduls, und die Module warten anschließend auf das gemerkte Versprechen.
 *
 * Die Frist ist die Versicherung: lädt ein Schnitt gar nicht, soll die
 * Animation trotzdem laufen statt auszubleiben. Dann ist sie mit der
 * Ersatzschrift zu sehen, was deutlich besser ist als ein leerer Block.
 */

const FRIST = 1200;

/**
 * Die Schnitte, die im Entwurf vorkommen — bewusst so klein geschnitten, wie
 * die jeweilige Animation es braucht.
 *
 * Das ist keine Kosmetik: die Wortmarke wartete zusätzlich auf den
 * Regular-Schnitt, der nicht vorgeladen wird und dessen Anfrage sich hinter den
 * Bildern einreiht. Allein dadurch startete sie 780 ms später (891 ms statt
 * 110 ms), obwohl sie den Schnitt überhaupt nicht setzt.
 */
export const SCHRIFT = {
  /** Wortmarke und Display-Typo — Medium, above the fold, vorgeladen. */
  display: ['500 1em "PP Neue Montreal"'],
  /** Headlines im Fließtext, teils 400. Die laufen erst beim Scrollen. */
  sans: ['500 1em "PP Neue Montreal"', '400 1em "PP Neue Montreal"'],
  /** Meta-Zeilen, Labels, alles Mono. */
  mono: ['300 1em "GT Pressura Mono"'],
};

/* Ein Versprechen je Schnitt, beim ersten Zugriff angelegt. Ein einzelner
   unbekannter Schnitt darf die übrigen nicht mitreißen. */
const versprechen = new Map();

function ladeSchnitt(schnitt) {
  if (!versprechen.has(schnitt)) {
    versprechen.set(schnitt, document.fonts.load(schnitt).catch(() => {}));
  }
  return versprechen.get(schnitt);
}

/* Sofort anstoßen — das ist der ganze Trick. Dieses Modul wird vom
   Einstiegspunkt importiert und läuft damit im ersten Skriptdurchlauf, also
   bevor die übrigen Schnitte der Seite mit dem Laden anfangen. */
Object.values(SCHRIFT).flat().forEach(ladeSchnitt);

/**
 * @param {string|string[]} schnitte  CSS-Kurzschreibweise, z. B.
 *   `500 1em "PP Neue Montreal"`. Mehrere, wenn ein Abschnitt mehrere Schnitte
 *   setzt — gewartet wird dann auf alle.
 * @param {number} frist  Höchstwartezeit in Millisekunden.
 */
export function warteAufSchrift(schnitte, frist = FRIST) {
  const liste = Array.isArray(schnitte) ? schnitte : [schnitte];

  /* Zuerst synchron nachsehen, ob die Schnitte schon benutzbar sind. Das ist
     der entscheidende Griff — und der Grund, warum die Umstellung von
     `document.fonts.ready` auf `document.fonts.load` allein nichts gebracht
     hat: `load()` wartet, solange die Sammlung als Ganzes beschäftigt ist,
     auch wenn der gefragte Schnitt längst dasteht.

     Gemessen auf der Startseite, beim Start der Hero-Choreografie:

       document.fonts.check('500 1em …')   →  true    nach  92 ms
       document.fonts.status               →  loading
       document.fonts.load('500 1em …')    →  erfüllt nach 872 ms

     `check()` ist die Frage, die wir wirklich stellen wollen: kann ich mit
     diesem Schnitt jetzt messen? */
  try {
    if (liste.every((s) => document.fonts.check(s))) return Promise.resolve();
  } catch {
    // Ungültige Kurzschreibweise — dann eben über den Ladeweg.
  }

  const geladen = Promise.all(liste.map(ladeSchnitt));
  return Promise.race([geladen, new Promise((weiter) => setTimeout(weiter, frist))]);
}
