/**
 * Stories become documents (2026-10-14).
 *
 * 1. Every entry of `homepage.storiesItems` becomes a `story` document with
 *    the same name, quote and image, generic (no services), in the old order.
 * 2. The three video testimonials from `assets/videos-web/` are uploaded as
 *    file assets, their poster frames as images, and become stories assigned
 *    to the veneers service. The quotes are summaries of what is said in the
 *    video, written from the burned-in captions.
 * 3. `storiesItems` is removed from the homepage document; the field is gone
 *    from the schema.
 *
 *     cd studio && DRY=1 npx sanity exec scripts/stories-import.mjs --with-user-token
 *     cd studio && npx sanity exec scripts/stories-import.mjs --with-user-token
 *
 * Running it again is harmless: documents are created if they do not exist,
 * uploads are skipped when a story already carries a video.
 */
import { createReadStream } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-28" });
const DRY = process.env.DRY === "1";
const VIDEOS = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../assets/videos-web",
);

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const VIDEO_STORIES = [
  {
    id: "story-mara",
    name: "Mara",
    file: "story-mara",
    quote:
      "Seit ich 16 bin, knirsche ich, vorne war viel kaputt, und ich habe mich nicht gern im Spiegel angeschaut. Bei Hannes wurde mir nichts verkauft: Er hat sich die Zähne in Ruhe angeschaut, gescannt, und ich konnte das Provisorium testen. Nach sechs Monaten fühlen sich die Veneers an wie meine eigenen Zähne. Mit Abstand der beste Zahnarzt, den ich in Berlin bekommen kann.",
    alt: "Mara im Behandlungszimmer, lächelnd",
  },
  {
    id: "story-timo",
    name: "Timo",
    file: "story-timo",
    quote:
      "Ich wollte Zähne, die beim Fahrradfahren die Lichter der Autos reflektieren. Hannes hat sie nur leicht geschliffen, ohne Betäubung, ich habe nichts gemerkt. Für mich ist er kein Zahnarzt, sondern Künstler: Bildhauer, Da Vinci, Picasso. Vorher, nachher: ein ganz anderer Mensch. Meine Zähne strahlen wie die Sonne.",
    alt: "Timo mit Mütze im Behandlungsstuhl, lachend",
  },
  {
    id: "story-tobias",
    name: "Tobias",
    file: "story-tobias",
    quote:
      "Ich wollte keine künstlichen Zähne, das Ergebnis sollte natürlich aussehen. Der Ablauf war verständlich, auch dass es weh tut, das haben wir vorher offen besprochen. Meine Tochter sagt: wow, cool. Meine Freundin: du benutzt dein Gesicht anders, offener. Mir ist ein Stein vom Herzen gefallen. Ich würde jeden ermutigen, der unter seinen Zähnen leidet.",
    alt: "Tobias im Behandlungszimmer, im Gespräch",
  },
];

const rank = (i) => `0|${(1000 + i * 10).toString(36)}:`;

/* 1. the homepage entries */
const home = await client.fetch(`*[_id == "homepage"][0]{ storiesItems }`);
const items = home?.storiesItems ?? [];
console.log(
  `${items.length} stories on the homepage, ${VIDEO_STORIES.length} videos`,
);

const tx = client.transaction();
items.forEach((item, i) => {
  const doc = {
    _id: `story-${slug(item.name)}`,
    _type: "story",
    name: item.name,
    quote: item.quote,
    ...(item.image ? { image: item.image } : {}),
    orderRank: rank(i),
  };
  console.log(`  ${doc._id}  (${item.name})`);
  tx.createIfNotExists(doc);
});

/* 2. the videos */
for (const [i, v] of VIDEO_STORIES.entries()) {
  const existing = await client.fetch(
    `*[_id == $id][0]{ "hasVideo": defined(video) }`,
    { id: v.id },
  );
  let video, image;
  if (!existing?.hasVideo && !DRY) {
    const videoAsset = await client.assets.upload(
      "file",
      createReadStream(join(VIDEOS, `${v.file}.mp4`)),
      { filename: `${v.file}.mp4`, contentType: "video/mp4" },
    );
    const poster = await client.assets.upload(
      "image",
      createReadStream(join(VIDEOS, `${v.file}-poster.jpg`)),
      { filename: `${v.file}-poster.jpg` },
    );
    video = {
      _type: "file",
      asset: { _type: "reference", _ref: videoAsset._id },
    };
    image = {
      _type: "picture",
      asset: { _type: "reference", _ref: poster._id },
      alt: v.alt,
    };
    console.log(
      `  uploaded ${v.file}.mp4 (${Math.round(videoAsset.size / 1e6)} MB)`,
    );
  } else {
    console.log(
      `  ${v.id}: ${existing?.hasVideo ? "has a video already" : "dry run, no upload"}`,
    );
  }
  tx.createIfNotExists({
    _id: v.id,
    _type: "story",
    name: v.name,
    quote: v.quote,
    ...(video ? { video, image } : {}),
    services: [
      { _type: "reference", _ref: "service-veneers", _key: "veneers" },
    ],
    orderRank: rank(items.length + i),
  });
}

/* 3. the old field */
tx.patch("homepage", (p) => p.unset(["storiesItems"]));

if (DRY) {
  console.log("Dry run. Nothing written.");
} else {
  await tx.commit();
  console.log("✓ written");
}
