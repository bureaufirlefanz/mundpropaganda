# Source images

Drop the originals here. `npm run images` reads this folder, writes responsive
WebP and AVIF into `web/public/img/`, and records the widths it actually
produced in `web/src/lib/image-widths.json`.

```bash
assets/raw/story-anna.jpg      →  web/public/img/story-anna-{640,1024,…}.{webp,avif}
```

## Naming

Semantic, lowercase, hyphenated, **no size in the name**: `story-anna.jpg`,
not `story-anna-1600.jpg`. The name becomes the identifier a component asks
for — `<Picture name="story-anna" />` — and the pipeline appends the widths.

## Sizes

The pipeline caps every step at the width of the source
(`WIDTHS.filter(w => w <= meta.width)`). A 1200 px original therefore yields
640 and 1024 and nothing above. That is correct — upscaling adds bytes, not
detail — but it means the source should be at least as wide as the largest
place it will be shown. Full-bleed motifs want 2200 px or more.

Nothing reads the widths from the file name any more. Since August 2026
`Picture.astro` looks them up in `image-widths.json`, which this pipeline
writes. That closed a class of bug where markup asked for a step the pipeline
had never produced: the browser picked exactly that candidate on wide screens,
got a 404 and showed nothing.

## Formats

PNG or JPEG in, WebP and AVIF out. Portrait for the story cards (they render
between 563 and 1024 px wide), landscape for full-bleed sections.

## Why this folder is empty in a fresh checkout

The originals are large and are not versioned — the derived files under
`web/public/img/` are, because the build needs them and they are small. If you
need to regenerate everything, you need the originals; ask for them rather
than upscaling what is in `public/`.
