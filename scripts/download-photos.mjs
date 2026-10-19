import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const assetsDir = path.resolve("public", "assets");
const photos = [
  {
    "name": "black2blue-live-01.jpg",
    "url": "https://le-cdn.website-editor.net/s/27b6e8631e8444e2b9e73ec29a703453/dms3rep/multi/opt/IMG_1405-38d8e2b6-1920w.JPG?Expires=1794723974&Key-Pair-Id=K2NXBXLF010TJW&Signature=XADTgEUloxmzf156P4Bnh8uDLtPYp8mKq0QSkN1jnrUSrrye4rP2XnKiWjK~gnBDVnbH9uNhiextJSQL9LLFpkE~oQvD2~pqG~YoBRMfUMuma7ZcChYqx8OvZc9gOxYv941n-YITaSSdZJBA3lDyQo90b-fclhOgaJ3ZJL1mWYElLTyS0hjr1Hhiv7Vu9OPZ7pyS4~N1~F6XuqevlnGsUzVuHNqyOlYDjs-CLGlHqrlmJqvftfc4pu5uTnV3fQuDDLPRCbcsk65ZAvp3noGzRHsFMxAVZzYqxxy62waSFRsVWoRKKcXMZIBNhYPMOZo7QCiNweoinvdE55r8jXAnug__"
  },
  {
    "name": "black2blue-live-02.jpg",
    "url": "https://le-cdn.website-editor.net/s/27b6e8631e8444e2b9e73ec29a703453/dms3rep/multi/opt/IMG_1392-8d5378bd-1920w.JPG?Expires=1794723974&Key-Pair-Id=K2NXBXLF010TJW&Signature=jKaXlh08y2GTj4Ep~HqynyPKCv60ph8lXy2FAcMmDBgEDA6mkt5-KMFXCp3QuJ7LNe7SJJ2XVjQRwbWCDXRfylEFKSqAb8H20tmZaIILTmve-HeEDbtR8u7SELVBB7jgKlm-QvvH7oDzMNW6RXW8CW~WNr~QSK7w4QAmPMG9INY8VZsmgObkgGsfqpS258oG~PTxHtdHh9kWjdjf7y1mXHQjZ9xpwgbuSVVBDKvRCqsOZnw6uH3948JHlZtfJxVNgr-NlAOZ01KaxgaUVlDCYngIJvvhVihAFNzKV76Pt96cnCtabi2l0feytQvI1fyegH2u8qaz~IXkdX~jTYsP9w__"
  },
  {
    "name": "black2blue-live-03.jpg",
    "url": "https://le-cdn.website-editor.net/s/27b6e8631e8444e2b9e73ec29a703453/dms3rep/multi/opt/IMG_1341-51a07303-1920w.JPG?Expires=1794723974&Key-Pair-Id=K2NXBXLF010TJW&Signature=fVmJcbo1w-TnMWPoGtreW1SyPbmTrtHJoqMU0fpv9fhQpWlOYrNYZ23nZAhsbzJ5A727vpVTn3zVMAlOzPI5iQ8cjc5tnDW7~-fAGUmJ3X35cIRPDIXhtxMs9aDgWuLaPUSg2TZP8PrvzzXOo55PIhDkxXH-ODF~xTCKAVemSrsEFQIYfKsMiXaIX3YC4hSvhtlcE9rPc6gBwl8zeyUD9iDA8scBrEGkiegnuiyY8vmu2IXmrCth8pcZp2B7GAL414Q1rvAppubxKeNSDmXohH3KvteQbvHx4u-g~xFCwtdoD5AkDTAmPLakaEOjxT09THeN2uPJoI~K8cz01KDTjg__"
  },
  {
    "name": "black2blue-live-04.jpg",
    "url": "https://le-cdn.website-editor.net/s/27b6e8631e8444e2b9e73ec29a703453/dms3rep/multi/opt/IMG_1356-87cb0e1e-1920w.JPG?Expires=1794723974&Key-Pair-Id=K2NXBXLF010TJW&Signature=OMAkB~i4-yUq49JrPOmFA89~BZtqTz0yx1HjhIXRKNt7tyZ8Y4L5u2cQCHRmNVwWISi5PA5t3Ok7ZHA~ZIFW7r-guNzZ2u2xKwtUmo-bdNfXC4JSUDVi6i8brccIsww5X74VbyqIB8qUoAozeUpuMKTt1hr~bzVb4X-6UjFayig8YIabnoCMcgyZjWMPdw6i-cvhj665o0lHJjKRN6zpJs591SsgcDiZBOvgh-TTIW9qXeRKqz-HRw3ucivrCWqEuW6Nv~o4R0JA9PldTFjLD3uIblzQvikcfogE5P0J5-fWZto~SWmAAtpfzDFC6aNgSqIS9WADjHl9ydWUi9z8-A__"
  },
  {
    "name": "black2blue-live-05.jpg",
    "url": "https://le-cdn.website-editor.net/s/27b6e8631e8444e2b9e73ec29a703453/dms3rep/multi/opt/IMG_1398-637ad9e8-1920w.JPG?Expires=1794723974&Key-Pair-Id=K2NXBXLF010TJW&Signature=EqPqozMtWQEiLYEy3zujOB298aHXtNcvYSJBOtZc1qYdV7fsyA-7IPUB42qM0~hhg-QZPqJf5OfA~b57ZlyMECWHksuCF-rhUMb~eK9jB5fiav-Gh~ZZ8XEFdb8ib2kB5iJ5a9MvlGqYJnFRqeqSNo~-2cin-SM4mlGkcDXltW4jkovRClIpj~~~m10JOS-5W-39YX3FpITgxzmS~ioD9vvvoEIcWYDw03v6WMAGFAmlqP0J0TVD4F3gzaGCiwp-DmQDsbCszYAi~3rCBU1nvzGnTZdVQiQAXFS~Rtyt8hVGpJDe7SQxzQHKgW7Cw3Gu0MQp725uyGhS6awrYv5nqw__"
  },
  {
    "name": "black2blue-live-06.jpg",
    "url": "https://le-cdn.website-editor.net/s/27b6e8631e8444e2b9e73ec29a703453/dms3rep/multi/opt/IMG_1336-c7aa9319-1920w.JPG?Expires=1794723974&Key-Pair-Id=K2NXBXLF010TJW&Signature=Q9xAsslRw~fE8Q1OIosPZU8X9WmB-XZouU9QVevzZGk88cDqIMToNrr9laUbGYigc7sIFxDxGLU3bYprY0SvQ2KHqZUcjIr~OsES6vc7E63SCqZitxbph2Q1~VlSzZyhEWI1WC-yzq11Ts9Pjhxml5TKrYObHuNgIJDWXYVgosvr00AY0BGLpG9tXrPFIgiS~Y3X~iD2YTSsd~25~~GlMRlEVimUy1a1it6Dr~-16R9Ibhx-m71lXW4hBTLIIL6l1VMW9zGfn8ASJsXtGObb7QUEGYjqY8qaoNkhoRJIrvVWhg8IoNNbQRb0oMpcm1aO3wJRFyIQK6gZyTZ0LCZWqA__"
  }
];

await mkdir(assetsDir, { recursive: true });

for (const photo of photos) {
  const destination = path.join(assetsDir, photo.name);
  console.log(`Lade ${photo.name} ...`);
  const response = await fetch(photo.url);
  if (!response.ok) {
    throw new Error(`Download von ${photo.name} fehlgeschlagen: HTTP ${response.status}. Bitte melde dich, falls der Original-Link abgelaufen ist.`);
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    throw new Error(`Unerwarteter Inhalt für ${photo.name}: ${contentType || "unbekannter Content-Type"}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 1000) throw new Error(`Datei ${photo.name} ist unerwartet klein; sie wird nicht gespeichert.`);
  await writeFile(destination, bytes);
  console.log(`  OK: ${(bytes.length / 1024).toFixed(0)} KB -> ${destination}`);
}
console.log("\nAlle sechs Fotos wurden nach public/assets/ gespeichert.");
