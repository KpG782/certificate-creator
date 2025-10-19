# Event Management System Architecture & Workflow

Let me break down a professional, scalable solution for your use case. I'm thinking about this from both technical efficiency and user experience perspectives.

## 🎯 Core Problem Analysis

You want to transform a manual attendance process into:

1. **One QR code per event** (not per student)
2. **Automatic attendance marking** when scanned
3. **Secure student identification** (OAuth with UMak credentials)
4. **Post-evaluation verification** before certificate sending
5. **Minimal API calls** and optimal data storage

## 🏗️ Proposed Architecture

### **High-Level Flow**

```
Event Created → QR Generated → Student Scans → OAuth Login →
Attendance Marked → Event Ends → Evaluation Form → Verified →
Certificate Auto-Sent
```

---

## 📊 Database Schema Extension

Add these tables to your Google Sheets or migrate to a lightweight database:

### **1. Events Table**

```
- event_id (unique)
- event_name
- event_date
- location
- qr_token (unique hash per event)
- status (upcoming/ongoing/completed)
- evaluation_form_url
- registration_open (boolean)
- created_at
```

### **2. Event_Registrations Table**

```
- registration_id
- event_id (FK)
- student_email
- registered_at (timestamp)
- attendance_status (registered/attended/absent)
- attended_at (timestamp, null until scanned)
- ip_address (security)
- device_fingerprint (optional, prevent duplicate scans)
```

### **3. Evaluations Table**

```
- evaluation_id
- event_id (FK)
- student_email
- responses (JSON or separate columns)
- submitted_at
- certificate_sent (boolean)
- certificate_sent_at
```

---

## 🔐 Secure QR Code Implementation

### **Option A: JWT-Based Tokens (Recommended)**

**QR Code contains:**

```
https://yourdomain.com/event/attend?token=eyJhbGc...
```

**Token payload (JWT):**

```json
{
  "event_id": "evt_20251015_cybersec",
  "exp": 1729036800, // Expires after event ends
  "iat": 1728950400
}
```

**Benefits:**

- ✅ One QR per event
- ✅ Tamper-proof (signed with secret)
- ✅ Automatic expiration
- ✅ No database lookup needed to validate token

### **Option B: Simple Hash (Lighter)**

**QR Code:**

```
https://yourdomain.com/event/attend?e=evt_20251015_cybersec
```

**Backend validates:**

- Event exists
- Event is currently ongoing (within date/time window)
- Student not already marked present

---

## 🔄 Detailed Workflow

### **Phase 1: Event Setup**

```
Admin Dashboard → Create Event →
{
  name: "Cybersecurity Seminar",
  date: "2025-10-15",
  registration_window: "2025-10-10 to 2025-10-15 18:00",
  invited_students: ["1-ACSAD"] // Section filter
}
→ Generate JWT token → Display QR Code → Admin prints/projects
```

### **Phase 2: Student Attendance (Scan Flow)**

```
Student scans QR → Redirect to /event/attend?token=xxx

IF not logged in:
  → Redirect to OAuth (Google/Microsoft with UMak domain restriction)
  → After login, return to attendance page

IF logged in:
  → Validate token (JWT signature + expiration)
  → Check student is invited (matches section/email whitelist)
  → Check not duplicate scan (query Event_Registrations by email + event_id)

  IF all valid:
    → INSERT into Event_Registrations
    → Show success: "Welcome, Ken! You're checked in ✓"
    → Store: event_id, email, attended_at, IP, device hash

  ELSE:
    → Show error: "Already attended" / "Not invited" / "Event closed"
```

**Security measures:**

- OAuth ensures only @umak.edu.ph emails
- Device fingerprinting prevents one student scanning multiple times
- IP logging for audit trails
- Token expiration prevents post-event scanning

### **Phase 3: Post-Event Evaluation**

```
Event ends → Admin triggers "Send Evaluation Forms"

n8n Workflow:
1. Query Event_Registrations WHERE attendance_status = 'attended'
2. For each student:
   → Send email with Google Form link (pre-filled with email)
   → Include hidden field: event_id + student_email hash
```

**Google Form structure:**

```
- Email (pre-filled, read-only)
- Rating questions
- Feedback text
- Hidden: verification_hash (SHA256 of event_id + email + secret)
```

### **Phase 4: Certificate Auto-Send**

**Trigger:** Google Form submission webhook

```
n8n Workflow:
1. Receive form response
2. Verify hash (ensure form not tampered)
3. Query: Does student have attendance record?
4. IF yes AND not certificate_sent:
   → Generate certificate (reuse your existing logic)
   → Send via Gmail
   → UPDATE Evaluations SET certificate_sent = true
   → UPDATE Event_Registrations SET status = 'completed'
5. ELSE:
   → Log warning (someone filled form without attending)
```

---

## 🚀 Technical Implementation Stack

### **Frontend (Astro)**

```javascript
// src/pages/event/attend.astro
---
import { verifyJWT } from '@/utils/auth'

const token = Astro.url.searchParams.get('token')
const session = Astro.locals.session // OAuth session

if (!session) {
  return Astro.redirect('/auth/login?redirect=' + Astro.url.pathname)
}

const event = verifyJWT(token) // Returns { event_id, exp }
if (!event || event.exp < Date.now()) {
  return Astro.redirect('/error?msg=invalid_token')
}

// Mark attendance
const result = await markAttendance(event.event_id, session.user.email)
---
```

### **Backend (Astro API Routes)**

```javascript
// src/pages/api/attendance.js
export async function POST({ request }) {
  const { event_id, student_email } = await request.json();

  // Check duplicate
  const existing = await query(
    "SELECT * FROM Event_Registrations WHERE event_id = ? AND student_email = ?",
    [event_id, student_email]
  );

  if (existing.length > 0) {
    return new Response(JSON.stringify({ error: "Already attended" }), {
      status: 409,
    });
  }

  // Insert
  await query(
    "INSERT INTO Event_Registrations (event_id, student_email, attended_at) VALUES (?, ?, ?)",
    [event_id, student_email, new Date().toISOString()]
  );

  return new Response(JSON.stringify({ success: true }));
}
```

### **n8n Workflows**

**Workflow 1: Send Evaluation Forms**

```
Schedule Trigger (manual/cron) →
Google Sheets: Read attended students →
Loop: Send email with form link →
Include verification hash
```

**Workflow 2: Process Evaluations → Send Certificates**

```
Google Forms Webhook →
Verify Hash →
Check Attendance Record →
IF valid: Generate Certificate →
Send via Gmail →
Update Google Sheets (certificate_sent = true)
```

---

## 💾 Data Optimization Strategies

### **1. Minimize n8n API Calls**

**Current problem:** Each operation = separate n8n call

**Solution:** Batch processing

```javascript
// Instead of 24 separate n8n calls:
await fetch(n8nWebhook, {
  method: 'POST',
  body: JSON.stringify({
    action: 'bulk_certificates',
    participants: [...] // All 24 students
  })
})

// n8n handles loop internally (1 API call from your app)
```

**Estimated savings:**

- Before: 24 students × 2 calls (cert + status) = 48 API calls
- After: 1 call + 24 Gmail sends = 25 total operations

### **2. Use Supabase/Firestore Instead of Google Sheets**

**Why?**

- Google Sheets = slow reads (500ms+), limited to 100 requests/100 seconds
- Supabase = <50ms queries, real-time subscriptions, 500 API calls/second (free tier)

**Migration path:**

```javascript
// Current: Fetch from Google Sheets CSV
const response = await fetch("https://docs.google.com/spreadsheets/...");

// New: Supabase
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const { data } = await supabase
  .from("event_registrations")
  .select("*")
  .eq("event_id", eventId)
  .eq("attendance_status", "attended");
```

**Cost:** Free for <500MB storage, 50,000 monthly active users

### **3. Client-Side QR Generation**

```javascript
// Generate QR on user's device (zero server cost)
import QRCode from "qrcode";

const qrDataUrl = await QRCode.toDataURL(
  `https://yourdomain.com/event/attend?token=${jwtToken}`,
  { width: 512, margin: 2 }
);
// Display or download
```

---

## 🔒 Security Enhancements

### **1. OAuth Implementation (UMak Google Workspace)**

```javascript
// src/pages/auth/login.astro
---
import { OAuth2Client } from 'google-auth-library'

const oauth2Client = new OAuth2Client(
  import.meta.env.GOOGLE_CLIENT_ID,
  import.meta.env.GOOGLE_CLIENT_SECRET,
  'https://yourdomain.com/auth/callback'
)

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['email', 'profile'],
  hd: 'umak.edu.ph' // Restrict to UMak domain
})

return Astro.redirect(authUrl)
---
```

### **2. Device Fingerprinting (Prevent Proxy Scans)**

```javascript
// Client-side
const fingerprint = await import("@fingerprintjs/fingerprintjs");
const fp = await fingerprint.load();
const { visitorId } = await fp.get();

// Send with attendance request
await fetch("/api/attendance", {
  method: "POST",
  body: JSON.stringify({
    event_id,
    student_email,
    device_id: visitorId, // Stored for duplicate detection
  }),
});
```

### **3. Rate Limiting**

```javascript
// Prevent QR code farming
const attendanceAttempts = await redis.get(
  `attendance:${studentEmail}:${eventId}`
);
if (attendanceAttempts > 3) {
  return new Response("Too many attempts", { status: 429 });
}
```

---

## 📱 Mobile-Optimized Attendance Page

```astro
---
// src/pages/event/attend-success.astro
---
<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
  <div class="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4">
    <div class="text-center">
      <!-- Animated checkmark -->
      <div class="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
        <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
      </div>

      <h1 class="text-2xl font-bold text-gray-800 mb-2">
        You're Checked In! ✓
      </h1>

      <p class="text-gray-600 mb-6">
        Welcome, <strong>{studentName}</strong><br/>
        Event: <strong>{eventName}</strong><br/>
        Time: {attendedAt}
      </p>

      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left">
        <p class="text-sm text-yellow-800">
          <strong>Next Steps:</strong><br/>
          1. Attend the full event<br/>
          2. Complete the evaluation form (sent after event)<br/>
          3. Receive your certificate via email
        </p>
      </div>
    </div>
  </div>
</div>
```

---

## 🎯 Implementation Roadmap

### **Phase 1: MVP (Week 1-2)**

- [ ] Add Events table to Google Sheets
- [ ] Implement JWT-based QR generation
- [ ] Create `/event/attend` page with session check
- [ ] Add attendance marking API endpoint
- [ ] Test with dummy OAuth (mock session)

### **Phase 2: OAuth Integration (Week 2-3)**

- [ ] Register OAuth app with Google Cloud
- [ ] Implement login/callback routes
- [ ] Add session management (cookies/JWT)
- [ ] Test with real UMak accounts

### **Phase 3: Evaluation Flow (Week 3-4)**

- [ ] Create Google Form template with hash field
- [ ] Set up n8n workflow for form submissions
- [ ] Connect evaluation → attendance verification
- [ ] Auto-trigger certificate sending

### **Phase 4: Admin Dashboard (Week 4-5)**

- [ ] Event creation UI
- [ ] QR code display/download
- [ ] Real-time attendance tracker
- [ ] Certificate send status monitor

### **Phase 5: Optimization (Week 5-6)**

- [ ] Migrate to Supabase (optional but recommended)
- [ ] Add device fingerprinting
- [ ] Implement rate limiting
- [ ] Performance testing with 100+ students

---

## 💡 Key Recommendations

1. **Start with JWT tokens** - Simplest, most secure, zero database lookups
2. **Use Supabase** - Google Sheets won't scale past 50 concurrent users
3. **Batch n8n calls** - Process certificates in groups of 10-20
4. **OAuth is essential** - Don't rely on honor system (forms can be spoofed)
5. **Add analytics** - Track scan times to detect bottlenecks (e.g., everyone scanning at once)

## 📦 Estimated Costs (Free Tier)

- **Vercel/Netlify:** Free (100GB bandwidth)
- **Supabase:** Free (500MB storage, 50K users)
- **n8n Cloud:** $20/mo (or self-host for free)
- **Google OAuth:** Free
- **Total:** $0-20/month

---

**Want me to start implementing any specific part?** I can create:

1. The JWT token generation system
2. The attendance API endpoints
3. The n8n workflow JSONs
4. The Supabase schema migration scripts
5. The admin dashboard components

Let me know which piece you want to tackle first! 🚀
