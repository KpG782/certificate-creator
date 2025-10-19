# Certificate Generator (Astro + n8n)

Professional certificate generator for University of Makati with automated email delivery via n8n workflow automation.

## Features

- **Single mode**: Live certificate preview + form to edit participant details and download/send certificate
- **Batch mode**: Upload JSON or fetch from Google Sheets, preview table, and send certificates to multiple recipients
- **Student Management**: View, filter, and manage certificates with Google Sheets integration
- **Automated Email Delivery**: Certificates sent via n8n webhook with Gmail integration
- **Real-time Status Tracking**: Google Apps Script updates certificate send status automatically
- **Client-side image generation**: JPEG compression for optimal email delivery (~160KB per certificate)

## Tech Stack

- **Frontend**: Astro, Tailwind CSS, Lucide Icons
- **Image Generation**: html-to-image (JPEG, pixelRatio: 1.5)
- **Automation**: n8n workflow (webhook → Gmail API)
- **Data Source**: Google Sheets (public CSV/JSON)
- **Status Updates**: Google Apps Script (doPost endpoint)
- **Packaging**: JSZip for batch downloads

## Quick Start

1. **Install dependencies**

   ```sh
   npm install
   ```

2. **Configure environment** (optional)

   - n8n webhook URL: `https://n8n.kenbuilds.tech/webhook/certificate-email`
   - Google Apps Script URL: Update in `main.js` line 888
   - Google Sheets ID: Update in `sheets.js`

3. **Run dev server**

   ```sh
   npm run dev
   ```

4. **Build for production**
   ```sh
   npm run build
   npm run preview
   ```

## Project Structure

```
src/
├── components/
│   ├── SingleMode.astro           ← Single certificate form + preview
│   ├── BatchMode.astro            ← Batch processing UI
│   ├── StudentManagement.astro    ← Google Sheets integration
│   ├── CertificateCard.astro      ← Certificate template (1122x794px)
│   ├── ParticipantForm.astro      ← Input fields
│   └── SignatureUploader.astro    ← E-signature uploads
├── scripts/
│   ├── main.js                    ← Core logic (certificate generation, email sending)
│   └── sheets.js                  ← Google Sheets data fetching
├── pages/
│   ├── index.astro                ← Landing/login page
│   └── dashboard.astro            ← Main app (tabs: Single, Batch, Student Management)
└── styles/
    └── global.css                 ← Tailwind + custom styles
```

## n8n Workflow Integration

### **Email Sending Endpoint**

```
POST https://n8n.kenbuilds.tech/webhook/certificate-email
Content-Type: application/json

{
  "participantName": "Ken Garcia",
  "participantEmail": "kgarcia@umak.edu.ph",
  "category": "Student",
  "seminarTitle": "Mobile App Security",
  "eventDate": "Date(2025,9,15)",
  "location": "HPSB 1012",
  "organizerName": "Dr. Cecille E. Tadeo, Ph. D.",
  "deanName": "Dr. Joel B. Mangaba, DIT",
  "certificateBase64": "base64EncodedJPEG..."
}
```

### **n8n Workflow Steps**

1. Webhook trigger receives certificate data
2. Decode base64 image to binary
3. Gmail node sends email with certificate attached
4. Response confirms delivery

### **Performance**

- Image generation: ~1.2s
- Email send (first): ~13s (cold start)
- Email send (subsequent): ~7.5s
- Total per certificate: ~8-10s average

## Google Sheets Integration

### **Sheet Structure**

| Column        | Description                            |
| ------------- | -------------------------------------- |
| id            | Unique identifier                      |
| name          | Student name                           |
| email         | UMak email (e.g., student@umak.edu.ph) |
| section       | Class section                          |
| category      | Student/Faculty/Staff                  |
| seminarTitle  | Event title                            |
| eventDate     | Event date                             |
| location      | Venue                                  |
| deanName      | Dean signature name                    |
| organizerName | Organizer signature name               |
| **status**    | pending/sent                           |
| **sentDate**  | Timestamp when sent                    |

### **Google Apps Script (Status Updates)**

```javascript
function doPost(e) {
  // Receives: { email: "student@umak.edu.ph" }
  // Updates: status → "sent", sentDate → timestamp
  // Returns: { success: true, message: "Status updated" }
}
```

Endpoint: `https://script.google.com/macros/s/.../exec`

## Certificate Fields

Each participant requires:

- `name` (string)
- `email` (UMak format: `username@umak.edu.ph`)
- `category` (Student/Faculty/Staff)
- `seminarTitle` (event name)
- `eventDate` (formatted date)
- `location` (venue)
- `deanName` (Dean signature)
- `organizerName` (Organizer signature)

## Usage Modes

### **1. Single Certificate**

- Fill form with participant details
- Upload signatures (Dean + Organizer)
- Preview live updates
- Download PNG or Send Email

### **2. Batch Mode**

- Upload JSON file or fetch from Google Sheets
- Upload signatures (applied to all)
- Preview participants table
- Generate ZIP or Send to Selected/All

### **3. Student Management**

- View all students from Google Sheets
- Filter by email, year, section, status
- Send certificates individually
- Bulk send to selected students
- Real-time status updates

## Sample JSON

```json
{
  "participants": [
    {
      "name": "Maria Santos",
      "email": "msantos.a62240916@umak.edu.ph",
      "category": "Student",
      "seminarTitle": "Cybersecurity Fundamentals",
      "eventDate": "October 15, 2025",
      "location": "HPSB 1012",
      "deanName": "Dr. Joel B. Mangaba, DIT",
      "organizerName": "Dr. Cecille E. Tadeo, Ph. D."
    }
  ]
}
```

## Performance Optimizations

- **JPEG compression** (quality: 0.92) → 50% smaller files vs PNG
- **Cached signatures** → No reload after first certificate
- **Parallel execution** → Email send + Sheet update run simultaneously
- **PixelRatio: 1.5** → Balance of quality (1683x1191px) and speed

## Key Files to Configure

1. **main.js**

   - Line 888: Apps Script URL
   - Line 860: n8n webhook URL

2. **sheets.js**

   - Line 1: Google Sheets ID
   - Line 5: Published CSV URL

3. **Google Apps Script**
   - Deploy as Web App
   - Execute as: Me
   - Who has access: Anyone

## Troubleshooting

**Students not loading:**

- Check Google Sheets is published (File → Share → Publish to web)
- Verify sheet structure matches expected columns
- Check browser console for CORS errors

**Email not sending:**

- Verify n8n workflow is active
- Check webhook URL is correct
- Ensure Gmail API is connected in n8n
- Check certificate image size < 10MB

**Status not updating:**

- Verify Apps Script URL is correct
- Check Apps Script is deployed as Web App
- Ensure `mode: 'no-cors'` is set in fetch

**CORS errors:**

- Use `mode: 'no-cors'` for Apps Script calls
- Ensure CDNs are from trusted sources
- Check Vercel deployment settings

## Development Tips

- Use browser DevTools → Network tab to debug requests
- Check console logs for performance metrics
- Test with 1-2 students before bulk sending
- Keep signatures < 1MB for faster loading

## License

Built for University of Makati - College of Computing and Information Sciences (CCIS)

---

**AI Context Summary:**
This is an Astro-based certificate generator that uses n8n for email automation and Google Sheets for data management. Main flow: User fills form → Certificate generated as JPEG → Sent via n8n webhook → Gmail delivers → Google Apps Script updates status. Key performance: ~1.2s image gen, ~8s total per certificate. Three modes: Single, Batch, Student Management.
