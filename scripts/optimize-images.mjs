/**
 * Bild-Pipeline: Figma-Exports → responsive WebP/AVIF in web/public/img.
 *
 * Aufruf: npm run images
 * Quelle: assets/raw/<semantischer-name>.png
 *
 * Erzeugt pro Bild mehrere Breiten, damit das Markup mit srcset arbeiten
 * kann. Die Original-PNGs aus Figma sind teils >15 MB — ungefiltert wäre
 * die Seite nicht Awwwards-fähig, egal wie gut die Animationen sind.
 */
import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import { join, parse } from "node:path";

const SRC = "assets/raw";
const OUT = "web/public/img";
const WIDTHS = [640, 1024, 1600, 2200];

/* Große Flächenbilder brauchen mehr Breiten als kleine Karten. */
const QUALITY = { webp: 78, avif: 55 };

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => /\.(png|jpe?g)$/i.test(f));
if (!files.length) {
  console.log(`Keine Bilder in ${SRC}/ gefunden.`);
  process.exit(0);
}

let totalIn = 0;
let totalOut = 0;

for (const file of files) {
  const { name } = parse(file);
  const src = join(SRC, file);
  const meta = await sharp(src).metadata();
  totalIn += (await stat(src)).size;

  const widths = WIDTHS.filter((w) => w <= meta.width);
  // Wenn die größte Stufe deutlich unter der Quelle liegt, die native
  // Breite ergänzen — sonst verschenken wir Schärfe bei Bildern wie dem
  // Hero-Zahn, der zwischen zwei Stufen fällt.
  const largest = widths.at(-1) ?? 0;
  if (largest < meta.width * 0.85) widths.push(meta.width);

  for (const w of widths) {
    const pipeline = sharp(src).resize({ width: w, withoutEnlargement: true });

    const webpPath = join(OUT, `${name}-${w}.webp`);
    await pipeline.clone().webp({ quality: QUALITY.webp, effort: 5 }).toFile(webpPath);
    totalOut += (await stat(webpPath)).size;

    const avifPath = join(OUT, `${name}-${w}.avif`);
    await pipeline.clone().avif({ quality: QUALITY.avif, effort: 4 }).toFile(avifPath);
    totalOut += (await stat(avifPath)).size;
  }

  /* Winziges Blur-Placeholder-Bild als Base64 für den LQIP-Effekt. */
  const lqip = await sharp(src).resize(20).blur(2).webp({ quality: 40 }).toBuffer();

  console.log(
    `${name.padEnd(24)} ${meta.width}×${meta.height}  →  ${widths.join(", ")}  ` +
      `(LQIP ${lqip.length} B)`
  );
}

const mb = (b) => (b / 1024 / 1024).toFixed(1);
console.log(
  `\nQuelle ${mb(totalIn)} MB → Ausgabe ${mb(totalOut)} MB ` +
    `über ${files.length} Bilder in allen Größen.`
);
