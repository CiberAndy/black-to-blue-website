import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceUrl = "https://www.black2blue-band.de/aktuelles";
const assetsDir = path.resolve("public", "assets");
const expectedPhotoCount = 14;

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#0*38;/g, "&")
    .replace(/\\u0026/gi, "&")
    .replace(/\\\//g, "/")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'");
}

function getGalleryPhotos(html) {
  const normalizedHtml = decodeHtml(html);
  const urlPattern = /https?:\\/\\/le-cdn\\.website-editor\\.net\\/[^"'<>\\s\\\\]+?\\.(?:jpe?g|png|webp)(?:\\?[^"'<>\\s\\\\]*)?/gi;
  const candidates = [...normalizedHtml.matchAll(urlPattern)].map((match) => match[0]);
  const bestByImage = new Map();

  for (const candidate of candidates) {
    let url;
    try {
      url = new URL(candidate);
    } catch {
      continue;
    }

    if (!/^image\\/(?:jpe?g|png|webp)$/i.test(
      url.pathname.toLowerCase().endsWith(".png") ? "image/png" :
      url.pathname.toLowerCase().endsWith(".webp") ? "image/webp" : "image/jpeg"
    )) continue;

    // Several responsive sizes can occur in srcset. Keep the largest one
    // for each original image, so the same photo is not downloaded twice.
    const filename = path.posix.basename(url.pathname);
    const widthMatch = filename.match(/-(\\d+)w(?=\\.[^.]+$)/i);
    const width = widthMatch ? Number(widthMatch[1]) : 0;
    const imageKey = filename.replace(/-\\d+w(?=\\.[^.]+$)/i, "").toLowerCase();
    const previous = bestByImage.get(imageKey);

    if (!previous || width > previous.width) {
      bestByImage.set(imageKey, { url: url.href, width, filename });
    }
  }

  return [...bestByImage.values()];
}

await mkdir(assetsDir, { recursive: true });

console.log(`Lese Bildergalerie von ${sourceUrl} ...`);
const pageResponse = await fetch(sourceUrl, {
  headers: { "user-agent": "Mozilla/5.0 (compatible; black2blue-photo-downloader/1.0)" }
});
if (!pageResponse.ok) {
  throw new Error(`Originalseite konnte nicht geladen werden: HTTP ${pageResponse.status}`);
}

const html = await pageResponse.text();
const photos = getGalleryPhotos(html);

if (photos.length !== expectedPhotoCount) {
  throw new Error(
    `Erwartet wurden ${expectedPhotoCount} unterschiedliche Galeriebilder, gefunden wurden ${photos.length}. ` +
    "Es wird abgebrochen, damit nicht versehentlich eine unvollständige Galerie gespeichert wird."
  );
}

console.log(`${photos.length} Originalbilder gefunden. Starte Download ...`);

for (const [index, photo] of photos.entries()) {
  const url = new URL(photo.url);
  const extension = path.extname(url.pathname).toLowerCase() || ".jpg";
  const filename = `black2blue-live-${String(index + 1).padStart(2, "0")}${extension === ".jpeg" ? ".jpg" : extension}`;
  const destination = path.join(assetsDir, filename);

  console.log(`Lade ${filename} ...`);
  const response = await fetch(photo.url, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; black2blue-photo-downloader/1.0)",
      referer: sourceUrl
    }
  });

  if (!response.ok) {
    throw new Error(`Download von ${filename} fehlgeschlagen: HTTP ${response.status}`);
  }

  const contentType = (response.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (!contentType.startsWith("image/")) {
    throw new Error(`Unerwarteter Inhalt für ${filename}: ${contentType || "unbekannter Content-Type"}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 1000) {
    throw new Error(`Datei ${filename} ist unerwartet klein; sie wird nicht gespeichert.`);
  }

  await writeFile(destination, bytes);
  console.log(`  OK: ${(bytes.length / 1024).toFixed(0)} KB -> ${destination}`);
}

console.log(`\\nAlle ${photos.length} Originalfotos wurden nach public/assets/ gespeichert.`);
