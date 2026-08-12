/**
 * Setzt die Praxisseite auf und gibt den Personen eine eigene Adresse.
 *
 * Zwei Teile mit sehr unterschiedlichem Anspruch:
 *
 * **1. Die Slugs.** Rein mechanisch aus dem Namen abgeleitet. Ohne sie gibt
 * es keine Route `/praxis/<slug>`, und `npm run web:check` meldet den Typ
 * `person` als „ohne Seite". Hier wird nichts erfunden.
 *
 * **2. Die Texte der Praxisseite.** Überschriften und Toplines sind
 * strukturell und können so bleiben. Was darunter steht, ist ein **Entwurf
 * zum Überschreiben** — er beschreibt eine Praxis, wie sie sein könnte, und
 * niemand hier weiß, wie sie wirklich ist. Jede Zeile, die eine Tatsache
 * behauptet, ist unten mit ENTWURF markiert.
 *
 * Erfundene Zahlen gibt es deshalb keine. Das Feld „Zahlen" bleibt leer:
 * „Seit 2014" und „12.000 Behandlungen" sehen aus wie Belege, und ein
 * falscher Beleg ist teurer als eine fehlende Angabe.
 *
 * **Aufruf**
 *
 *     cd studio && DRY=1 npx sanity exec scripts/practice-content.mjs --with-user-token
 *     cd studio && npx sanity exec scripts/practice-content.mjs --with-user-token
 *
 * Wiederholtes Ausführen ist harmlos.
 */
import { getCliClient } from "sanity/cli";
import { LexoRank } from "lexorank";

const client = getCliClient({ apiVersion: "2026-07-28" });
const DRY = process.env.DRY === "1";

/** Aus „Dr. Kerrin Gratecap" wird „kerrin-gratecap". */
function slugAus(name) {
  return name
    .replace(/^(Dr\.|Prof\.|med\.|dent\.)\s*/gi, "")
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

/* --- Die Seite ---------------------------------------------------------- */

const SEITE = {
  topline: "Praxis",
  title: "Zwei Praxen, ein Anspruch",

  /* ENTWURF */
  lead:
    "Wir behandeln in Prenzlauer Berg, an zwei Adressen, mit einem Team, das sich gegenseitig vertritt und gemeinsam entscheidet.",

  storyTopline: "Wer wir sind",
  storyHeadline: "Zahnmedizin ohne Eile",
  /* ENTWURF — beide Absätze */
  storyColumns: [
    "Mundpropaganda ist aus einer einfachen Beobachtung entstanden: Die meisten Menschen gehen ungern zum Zahnarzt, und fast immer liegt das nicht an der Behandlung, sondern an allem drumherum. An Terminen, die nicht halten. An Erklärungen, die niemand versteht. An dem Gefühl, dass die Zeit knapp ist.",
    "Wir haben die Praxis so gebaut, dass diese Gründe wegfallen. Längere Termine, weniger davon am Tag, und eine Aufklärung, die vor der Behandlung stattfindet und nicht danach.",
  ],

  valuesTopline: "Haltung",
  valuesHeadline: "Vier Dinge, auf die Sie sich verlassen können",
  /* ENTWURF — alle vier Punkte */
  valuesItems: [
    {
      _key: "aufklaerung",
      title: "Erst verstehen, dann behandeln",
      text: "Jede Behandlung beginnt mit einem Gespräch, in dem wir zeigen, was wir sehen, und erklären, welche Wege es gibt. Auch den, nichts zu tun.",
    },
    {
      _key: "zahnerhalt",
      title: "Der eigene Zahn zuerst",
      text: "Ein erhaltener Zahn ist jedem Ersatz überlegen. Wir ziehen erst, wenn wir keinen Weg mehr sehen, ihn zu behalten - und sagen dann auch, warum.",
    },
    {
      _key: "preise",
      title: "Kosten vor der Behandlung",
      text: "Sie bekommen einen schriftlichen Plan, bevor etwas beginnt. Was die Kasse trägt und was nicht, steht darin nebeneinander.",
    },
    {
      _key: "zeit",
      title: "Termine, die halten",
      text: "Wir planen weniger Behandlungen pro Tag, damit die geplanten nicht unter Druck geraten. Wer wartet, wartet selten länger als zehn Minuten.",
    },
  ],

  teamTopline: "Team",
  teamHeadline: "Die Menschen, die Sie behandeln",
  /* ENTWURF */
  teamText:
    "Behandelnde, Prophylaxe und Verwaltung arbeiten in derselben Besprechung. Wer Sie behandelt, kennt Ihre Vorgeschichte, auch wenn er sie nicht selbst aufgenommen hat.",

  locationsTopline: "Standorte",
  locationsHeadline: "Zweimal in Prenzlauer Berg",
  /* ENTWURF */
  locationsText:
    "Beide Praxen sind mit Tram und Bus erreichbar. Welche für Sie die richtige ist, hängt von der Behandlung ab - rufen Sie an, wenn Sie unsicher sind.",
};

/* --- Ausführung --------------------------------------------------------- */

async function los() {
  const stapel = client.transaction();
  const bericht = [];

  /* 1. Die Seite. `createIfNotExists` plus Patch, damit der Aufruf
     wiederholbar ist: Das Dokument gab es bisher nicht, weil der Typ keine
     Route hatte. */
  stapel.createIfNotExists({ _id: "practice", _type: "practice" });
  stapel.patch("practice", (p) => p.set(SEITE));
  bericht.push(`practice: ${Object.keys(SEITE).length} Felder`);

  /* 2. Die Slugs. Nur wo keiner steht — ein vorhandener Slug ist eine
     Adresse, die vielleicht schon jemand geteilt hat. */
  const personen = await client.fetch(
    `*[_type == "person"] | order(coalesce(orderRank, "zzz")) { _id, name, "slug": slug.current, orderRank }`
  );

  let r = LexoRank.min();
  const raenge = personen.map(() => (r = r.genNext()).toString());

  personen.forEach((person, i) => {
    const aenderung = {};
    if (!person.slug) aenderung.slug = { _type: "slug", current: slugAus(person.name) };
    /* Auch der Sortierwert fehlt bei den Personen — sie waren nie ziehbar. */
    if (!person.orderRank) aenderung.orderRank = raenge[i];

    if (Object.keys(aenderung).length) {
      stapel.patch(person._id, (p) => p.set(aenderung));
      bericht.push(
        `${person.name}: ${aenderung.slug ? `/praxis/${aenderung.slug.current}` : ""}` +
          `${aenderung.orderRank ? "  (+ Sortierwert)" : ""}`
      );
    }
  });

  /* 3. Der Menüpunkt „Praxis". Er sprang bisher auf `/#experten` — den
     Abschnitt über die beiden Inhaber auf der Startseite. Das war richtig,
     solange es keine Praxisseite gab; jetzt führt er an ihr vorbei. Ohne
     diesen Schritt wäre die neue Seite nur über die Adresszeile erreichbar,
     und `check-web.mjs` fände sie beim Crawlen nie. */
  const nav = await client.fetch(`*[_id == "navigation"][0]{ mainMenu }`);
  const punkte = nav?.mainMenu ?? [];
  const index = punkte.findIndex((p) => p?.text === "Praxis");

  if (index === -1) {
    bericht.push('Navigation: kein Punkt „Praxis“ gefunden — bitte im Studio prüfen');
  } else if (punkte[index].target?._ref === "practice") {
    bericht.push("Navigation: zeigt bereits auf die Praxisseite");
  } else {
    stapel.patch("navigation", (p) =>
      p
        .set({
          [`mainMenu[${index}].target`]: {
            _type: "reference",
            _ref: "practice",
          },
        })
        /* Die Sprungmarke muss weg: Sie stammt von der Startseite, und
           `/praxis#experten` gibt es nicht. Ein Link auf eine Marke, die
           nirgends steht, landet oben auf der Seite — das sieht aus, als
           habe der Klick nicht funktioniert. */
        .unset([`mainMenu[${index}].anchor`])
    );
    bericht.push('Navigation: „Praxis“ zeigt jetzt auf /praxis (Sprungmarke entfernt)');
  }

  /* 4. Die Koordinaten der beiden Praxen. Ohne sie entfällt die Karte auf
     der Praxisseite — die Anschrift steht trotzdem da.

     Nachgeschlagen bei Nominatim (OpenStreetMap), nicht geschätzt: Beide
     Adressen wurden mit Hausnummer aufgelöst und liegen in 10405 Prenzlauer
     Berg. Eine geratene Stecknadel schickt jemanden an die falsche Tür.

     Zugeordnet über die Straße und nicht über die Position im Array: Wer im
     Studio die Reihenfolge der Standorte ändert, bekäme sonst die
     Koordinaten der jeweils anderen Praxis. */
  const KOORDINATEN = {
    "Prenzlauer Allee 25": { latitude: 52.5324712, longitude: 13.4206726 },
    "Christburger Straße 37": { latitude: 52.5359564, longitude: 13.4268302 },
  };

  const einstellungen = await client.fetch(
    `*[_id == "settings"][0]{ locations[]{ street, latitude } }`
  );

  (einstellungen?.locations ?? []).forEach((o, i) => {
    const treffer = KOORDINATEN[o?.street];
    if (!treffer) {
      bericht.push(`Standort „${o?.street}“: keine Koordinaten hinterlegt`);
      return;
    }
    if (o.latitude != null) {
      bericht.push(`Standort „${o.street}“: hat bereits Koordinaten`);
      return;
    }
    stapel.patch("settings", (p) =>
      p.set({
        [`locations[${i}].latitude`]: treffer.latitude,
        [`locations[${i}].longitude`]: treffer.longitude,
      })
    );
    bericht.push(`Standort „${o.street}“: ${treffer.latitude}, ${treffer.longitude}`);
  });

  console.log(bericht.map((z) => "  " + z).join("\n"));

  if (DRY) {
    console.log("\nProbelauf. Nichts geschrieben.");
    return;
  }

  await stapel.commit();
  console.log("\n✓ Geschrieben.");
  console.log("\nNoch offen, weil niemand hier die Antwort kennt:");
  console.log("  · Kopfbild, zweites Bild, Bild der Praxis, Teamfoto");
  console.log("  · Porträts, Zitate, Stationen und Sprachen je Person");
  console.log("  · Koordinaten der beiden Standorte (Einstellungen → Standorte)");
  console.log("  · Alle mit ENTWURF markierten Texte in diesem Skript");
}

los().catch((fehler) => {
  console.error("Fehlgeschlagen:", fehler.message);
  process.exit(1);
});
