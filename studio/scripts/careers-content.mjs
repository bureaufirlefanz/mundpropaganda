/**
 * Spielt die Inhalte der Karriereseite ein, die der Kunde geliefert hat.
 *
 * **Warum ein Skript und kein Seed-Import:** `seed/careers.ndjson` wird mit
 * `--replace` eingespielt und ersetzt das ganze Dokument. Was im Studio
 * bereits bearbeitet wurde, wäre danach weg. Dieses Skript setzt nur die
 * NEUEN Felder und lässt alles andere unberührt.
 *
 * **Aufruf** — braucht keinen selbst erzeugten Token, sondern die Anmeldung,
 * die die Sanity-CLI ohnehin schon hat:
 *
 *     cd studio && npx sanity exec scripts/careers-content.mjs --with-user-token
 *
 * Zweimal aufrufen ist harmlos: Die Stellen hängen an festen IDs, die Felder
 * werden gesetzt und nicht angehängt.
 *
 * **Was es mit den vier alten Stellen macht:** Sie stammen aus dem Prototyp
 * („Zahnärztin mit Schwerpunkt Ästhetik" und drei weitere) und sind nicht
 * die Rollen, die die Praxis wirklich sucht. Das Skript setzt sie auf
 * `active: false` — das ist der im Schema vorgesehene Ausschalter, sie
 * verschwinden von der Seite und bleiben im Studio erhalten. Gelöscht wird
 * nichts. Ein Klick auf „Ausgeschrieben" holt jede zurück.
 */
import { getCliClient } from "sanity/cli";
import { LexoRank } from "lexorank";

const client = getCliClient({ apiVersion: "2026-07-28" });

/**
 * Sortierwerte für die ziehbare Liste im Studio. Es muss ein echter Lexorank
 * sein (`bucket|wert:`) — eine schlichte Zahl sortiert zwar, lässt sich aber
 * nicht parsen, und dann scheitert jedes Ziehen im Studio lautlos. Genau
 * das war bei den Leistungen und den alten Stellen der Fall; siehe
 * `fix-order-ranks.mjs`.
 */
function ranks(n) {
  let r = LexoRank.min();
  return Array.from({ length: n }, () => (r = r.genNext()).toString());
}

const RAENGE = ranks(5);

/* --- Die Seite ---------------------------------------------------------- */

const BENEFITS = [
  "Unbefristete Festanstellung in Voll- oder Teilzeit",
  "Überdurchschnittliches Gehalt",
  "BVG-Monatsticket",
  "Gute Work-Life-Balance",
  "Regelmäßige Fortbildungen, und Unterstützung dabei",
  "Hochmoderne und ökologische Praxis mitten in Prenzlauer Berg",
  "Ein Team aus Enthusiasten",
  "Flexible Arbeitszeitmodelle",
  "Motiviertes und dynamisches Zusammenarbeiten",
  "Digitaler Workflow und innovative Zahnmedizin",
  "Moderne und ergonomische Arbeitsstühle und Behandlungseinheiten",
  "Müslibar",
  "Bikeleasing",
  "Wöchentliche Team-Meetings und regelmäßige Team-Events",
  "Sommerfest und Weihnachtsfeier",
  "Gemeinsame Pausen",
];

/* Die Überschriften stehen bewusst NICHT so da, wie sie von der alten Seite
   kamen: Dort hießen die beiden letzten Blöcke „Familien Zahnarzt Berlin"
   und „Zahnimplantate Berlin" — Suchbegriffe über Texten, die vom Team und
   von den Praxisräumen handeln. Wer das liest, hält es für ein Versehen,
   und Google bewertet es seit Jahren nicht mehr positiv. */
const REASONS = [
  {
    _key: "anreise",
    title: "Gut zu erreichen, auch von weiter weg",
    text: "Du wohnst nicht in Praxisnähe? Wir stellen dir eine BVG-Karte und ermöglichen Bikeleasing, damit du ohne Umstände zur Arbeit kommst.",
  },
  {
    _key: "team",
    title: "Ein Team, das zusammenhält",
    text: "Regelmäßige Team-Events, wöchentliche Meetings, Sommerfest und Weihnachtsfeier. Wir unterstützen uns gegenseitig und ziehen an einem Strang, damit für die Patientinnen und Patienten das bestmögliche Ergebnis herauskommt.",
  },
  {
    _key: "raeume",
    title: "Zwei Praxen in Prenzlauer Berg",
    text: "Dein Arbeitsplatz liegt in modernen Räumen mitten im Viertel. Wir sind inzwischen zweimal in Prenzlauer Berg vertreten und wachsen weiter.",
  },
];

const PAGE = {
  videoUrl: "https://www.youtube.com/watch?v=cq7TTk5idx0",
  videoTitle: "Ein Blick in die Praxis",

  weekTopline: "Arbeitszeit",
  weekHeadline: "Bei uns gilt die 4-Tage-Woche",
  weekText:
    "Deine Work-Life-Balance ist uns wichtig, deshalb wollen wir dir mehr Zeit für Freizeit, Freunde und Familie geben. Deine vier Arbeitstage werden mit zwei Spät- und zwei Frühdiensten fest eingeplant und lassen dennoch Spielraum für individuelle Absprachen.",

  benefitsTopline: "Leistungen",
  benefitsHeadline: "Du bekommst einiges",
  benefitsItems: BENEFITS,

  reasonsTopline: "Gründe",
  reasonsHeadline: "Was für uns spricht",
  reasonsItems: REASONS,

  jobsText:
    "Bei Mundpropaganda arbeiten wir auf dem aktuellsten wissenschaftlichen und technischen Stand, und unsere Fachkräfte führen modernste Behandlungsmethoden präzise durch. Dieses Niveau wollen wir halten und weiter ausbauen. Deshalb setzen wir auf qualifizierte Kolleginnen und Kollegen mit freundlichem Umgang und verlässlicher Arbeitsmoral.",
};

/* --- Die Stellen -------------------------------------------------------- */

/* Fragen, die nur bei dieser Rolle gestellt werden. Bewusst wenige: Jede
   zusätzliche Frage kostet Bewerbungen, und was im Lebenslauf steht, muss
   hier niemand abtippen. */
const QUESTIONS_LICENSED = [
  {
    _key: "approbation",
    label: "Seit wann bist du approbiert?",
    kind: "short",
    required: true,
  },
  {
    _key: "start",
    label: "Ab wann könntest du anfangen?",
    kind: "short",
    required: true,
  },
];

const QUESTIONS_ASSISTANT = [
  {
    _key: "abschluss",
    label: "Welchen Abschluss hast du, und wann hast du ihn gemacht?",
    kind: "short",
    required: true,
  },
  {
    _key: "start",
    label: "Ab wann könntest du anfangen?",
    kind: "short",
    required: true,
  },
];

const WORKLOAD = {
  _key: "umfang",
  label: "In welchem Umfang möchtest du arbeiten?",
  kind: "choice",
  choices: ["Vollzeit", "Teilzeit", "Das würde ich gern besprechen"],
  required: true,
};

const JOBS = [
  {
    _id: "job-kinderzahnheilkunde",
    title: "Kinderzahnärztin oder Kinderzahnarzt (m/w/d)",
    handle: "kinderzahnheilkunde",
    kind: "Voll- oder Teilzeit, unbefristet",
    fragen: QUESTIONS_LICENSED,
  },
  {
    _id: "job-endodontologie",
    title:
      "Zahnärztin oder Zahnarzt (m/w/d) mit Spezialisierung Endodontologie",
    handle: "endodontologie",
    kind: "Voll- oder Teilzeit, unbefristet",
    fragen: QUESTIONS_LICENSED,
  },
  {
    _id: "job-zfa",
    title: "Zahnmedizinische Fachkraft ZFA (m/w/d)",
    handle: "zfa",
    kind: "Voll- oder Teilzeit, unbefristet",
    fragen: QUESTIONS_ASSISTANT,
  },
  {
    _id: "job-zmp",
    title: "Zahnmedizinische Prophylaxeassistenz ZMP (m/w/d)",
    handle: "zmp",
    kind: "Voll- oder Teilzeit, unbefristet",
    fragen: QUESTIONS_ASSISTANT,
  },
  {
    _id: "job-dentalhygiene",
    title: "Dentalhygienikerin oder Dentalhygieniker (m/w/d)",
    handle: "dentalhygiene",
    kind: "Voll- oder Teilzeit, unbefristet",
    fragen: QUESTIONS_ASSISTANT,
  },
];

/* --- Ausführung --------------------------------------------------------- */

async function los() {
  const batch = client.transaction();

  /* Die Seite. `set` und nicht `setIfMissing`: Das sind die Texte, die der
     Kunde geliefert hat, und sie sollen genau so dastehen. Alle übrigen
     Felder des Dokuments bleiben unberührt. */
  batch.patch("careers", (p) => p.set(PAGE));

  /* Die alten Prototyp-Stellen abschalten, nicht löschen. */
  const stale = await client.fetch(`*[_type == "job" && !(_id in $next)]._id`, {
    next: JOBS.map((s) => s._id),
  });
  for (const id of stale) {
    batch.patch(id, (p) => p.set({ active: false }));
  }

  /* Die neuen Stellen. `createIfNotExists` legt an, der Patch danach setzt
     die Felder — zusammen ist der Aufruf wiederholbar, ohne Dubletten. */
  JOBS.forEach((s, i) => {
    batch.createIfNotExists({ _id: s._id, _type: "job" });
    batch.patch(s._id, (p) =>
      p.set({
        title: s.title,
        handle: { _type: "slug", current: s.handle },
        kind: s.kind,
        active: true,
        applicationQuestions: [WORKLOAD, ...s.fragen],
        orderRank: RAENGE[i],
      }),
    );
  });

  await batch.commit();

  console.log(`✓ Karriereseite: ${Object.keys(PAGE).length} Felder gesetzt`);
  console.log(`✓ ${JOBS.length} Stellen angelegt oder aktualisiert`);
  console.log(
    `✓ ${stale.length} stale Stellen auf „nicht ausgeschrieben" gesetzt`,
  );
  console.log("");
  console.log("Offen und bewusst nicht gesetzt:");
  console.log("  · Bewerbungsadresse je Stelle (Studio → Stellen → Bewerbung)");
  console.log("  · Einleitung, Aufgaben und Profil je Stelle");
  console.log("  · Standbild für das Video (sonst lädt es von YouTube)");
}

los().catch((error) => {
  console.error("Fehlgeschlagen:", error.message);
  process.exit(1);
});
