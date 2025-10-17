# Certificate Generator (Astro)

Small web app to create single or batch certificates (University of Makati styling).

## Features

- Single mode: live certificate preview (smaller, on top) + form to edit participant details and download a PNG.
- Batch mode: upload a JSON file of participants, preview a table (includes name, email, category, seminar, date), apply e-signatures to all, and generate a ZIP of PNG certificates.
- Client-side image generation using html-to-image and packaging with JSZip.
- Modular scripts: `shared.js` (utilities) + `main.js` (app logic).

## Quick start

1. Install dependencies
   ```sh
   npm install
   ```
2. Run dev server
   ```sh
   npm run dev
   ```
3. Open the app in the browser (default Astro port printed by CLI).

## Project structure (important files)

```
src/
├── components/
│   ├── Welcome.astro        ← App container (mode tabs)
│   ├── SingleMode.astro     ← Live preview + form + uploads + download
│   ├── BatchPanel.astro     ← JSON upload, participants table, batch controls
│   ├── CertificateCard.astro← Certificate DOM used for preview and export
│   ├── ParticipantForm.astro← Input fields (name, email, category, seminar, date, location, dean, organizer)
│   └── SignatureUploader.astro
├── scripts/
│   ├── shared.js            ← Utility functions (updateCertificatePreview, loadImage, validation, sample JSON, table renderer)
│   └── main.js              ← App wiring (imports shared.js, handles UI, batch generation)
├── styles/
└── pages/
```

## Where to put scripts

- Place shared utilities in:
  `src/scripts/shared.js`
- Place main application logic in:
  `src/scripts/main.js`
- `Welcome.astro` loads `main.js` in the page (keep script path `/src/scripts/main.js` as used in the project).

## Participant fields (single + batch)

Each participant must include:

- name (string)
- email (UMak format recommended e.g. kgarcia.a62240916@umak.edu.ph)
- category (e.g. Student, Faculty, Staff)
- seminarTitle
- eventDate
- location
- deanName
- organizerName

## Sample JSON template

Save this as `sample_participants.json` or download from the app.

```json
{
  "participants": [
    {
      "name": "Maria Santos",
      "email": "msantos.a62240916@umak.edu.ph",
      "category": "Student",
      "seminarTitle": "Cybersecurity Fundamentals for Modern Organizations",
      "eventDate": "October 15, 2025",
      "location": "HPSB 1012, University of Makati, Taguig City",
      "deanName": "Prof. Levi B. Mangaba, DT",
      "organizerName": "Prof. Cecille E. Tadeo, Ph. D."
    }
  ]
}
```

## How to use

Single mode

- Click "Single Certificate".
- Edit fields in the form (live preview updates the certificate).
- Upload left/right logos and two e-signature images (Dean, Organizer). Signatures apply to the preview and exported image.
- Click "Download Certificate" to export the visible certificate as PNG.

Batch mode

- Click "Batch Mode".
- Upload a JSON file matching the sample structure.
- The participants table shows Name, Email, Category, Seminar and Date.
- Optionally upload `Dean` / `Organizer` signature images to apply to all certificates.
- Click "Generate All Certificates" to produce PNGs and download a ZIP file.

Notes

- The app uses `html-to-image` to render the certificate DOM to PNG and `JSZip` to bundle files.
- `shared.js` exposes helpers:
  - updateCertificatePreview(participant)
  - loadImage(file) → Promise<DataURL>
  - createSampleJSON()
  - validateParticipant(part)
  - validateEmail(email)
  - displayParticipantsTable(participants, containerId)
- `main.js` imports and uses those helpers for live preview, uploads, validation and batch generation.

Troubleshooting

- If batch table does not show email/category, confirm your JSON includes `email` and `category` fields and follow the sample structure.
- If signatures do not appear in the exported image, ensure you uploaded PNG/SVG/JPEG, then regenerate (file reader loads images as data URLs).

License / Credits

- Icons and fonts loaded via CDN (Tailwind, Google Fonts).
- Built with Astro starter.

If you want, I can:

- Add a validated email pattern description,
- Convert `shared.js` to TypeScript,
- Provide a small UI tweak to show validation errors inline.
