# black2blue Website

Moderner, responsiver Website-Prototyp für black2blue mit dunkler Bühnenästhetik, animierten Reveal-Effekten, mobiler Navigation und Bereichen für Sound, Band, Live-Termine und Booking.

## Lokal starten

Voraussetzung: Node.js 20 oder neuer.

```bash
npm install
node scripts/download-photos.mjs
npm run dev
```

Produktions-Build prüfen:

```bash
npm run build
npm run preview
```

## Importierte Inhalte

Die erste Fassung wurde anhand der öffentlich sichtbaren Inhalte der bestehenden Website erstellt:

- https://www.black2blue-band.de/
- https://www.black2blue-band.de/aktuelles

Übernommen wurden das Bandprofil, die fünf Musiker samt Instrumenten/Rollen, die Social-Media-Verweise, die Kontaktadresse und die bei der Recherche sichtbaren Termine. Ein bereits vergangener Termin (10.10.2026) wird nicht mehr als nächster Gig angezeigt.

## Vor Veröffentlichung prüfen

- Konzerttermine, Uhrzeiten und Veranstaltungsdetails mit der Band abgleichen.
- Eine Galerie mit sechs Originalfotos ist eingebunden. Die Bilder werden lokal unter `public/assets/` abgelegt. Zum Herunterladen der Originale das Skript `node scripts/download-photos.mjs` ausführen; dafür müssen die signierten Original-Links noch gültig sein.
- Ein eigenes Logo bzw. lokale Bilddateien können später ergänzt werden.
- Impressum und Datenschutzerklärung ergänzen bzw. juristisch prüfen.
- Cookie-/Datenschutzanforderungen für eingebettete Medien prüfen. SoundCloud wird derzeit nur extern verlinkt.
- Mobilgeräte und Tastaturbedienung testen.

## Design-Notizen

- Dark stage / electric blue / warm amber
- Barlow Condensed für Headlines, DM Sans für Lesetext
- Responsive Layouts ohne UI-Framework
- Animationen respektieren `prefers-reduced-motion`
