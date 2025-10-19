import QRCode from 'qrcode';

// ✅ Event Data Interface (using JSDoc for type hints)
/**
 * @typedef {Object} EventData
 * @property {string} id
 * @property {string} name
 * @property {string} date
 * @property {string} time
 * @property {string} location
 * @property {string[]} invitedSections
 * @property {string} registrationStart
 * @property {string} registrationEnd
 * @property {string} deanName
 * @property {string} organizerName
 * @property {string} createdAt
 * @property {string} [token]
 * @property {string} [attendanceUrl]
 */

// ✅ Constants
const EVENTS_STORAGE_KEY = 'umak_events';

// ✅ LocalStorage Functions
/** @returns {EventData[]} */
function getEvents() {
  const stored = localStorage.getItem(EVENTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

/** @param {EventData} eventData */
function saveEvent(eventData) {
  const events = getEvents();
  events.push(eventData);
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  console.log('✅ Event saved:', eventData);
}

/** 
 * Delete event by ID
 * @param {string} eventId 
 */
function deleteEvent(eventId) {
  const events = getEvents();
  const filteredEvents = events.filter(e => e.id !== eventId);
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(filteredEvents));
  console.log('🗑️ Event deleted:', eventId);
}

// ✅ Generate unique event ID
function generateEventId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `evt_${timestamp}_${random}`;
}

// ✅ NEW: Generate JWT token via server-side API
async function generateJWT(eventId, eventName, registrationEnd) {
  try {
    console.log('📡 Calling server API to generate JWT...');
    
    const response = await fetch('/api/generate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId,
        eventName,
        registrationEnd,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate token');
    }

    const data = await response.json();
    console.log('✅ JWT generated via server:', data);
    
    return {
      token: data.token,
      attendanceUrl: data.attendanceUrl,
      expiresAt: data.expiresAt,
    };

  } catch (error) {
    console.error('❌ Server-side JWT generation failed:', error);
    throw error;
  }
}

// ✅ Generate QR Code using local package
async function generateQRCode(canvas, url) {
  try {
    console.log('🎨 Generating QR code for:', url);
    await QRCode.toCanvas(canvas, url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#1e40af',
        light: '#FFFFFF'
      }
    });
    console.log('✅ QR Code generated successfully');
  } catch (error) {
    console.error('❌ QR Code generation failed:', error);
    throw new Error('Failed to generate QR code: ' + error.message);
  }
}

// ✅ Render Events List with Delete Button
function renderEventsList() {
  const container = document.getElementById('eventsListContainer');
  if (!container) return;
  
  const events = getEvents();

  if (events.length === 0) {
    container.innerHTML = `
      <div class="text-gray-500 text-center py-12">
        <i data-lucide="calendar-x" class="w-12 h-12 text-gray-300 mx-auto mb-3"></i>
        <p>No events created yet</p>
        <p class="text-sm mt-1">Create your first event to get started</p>
      </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }

  container.innerHTML = events.reverse().map(event => `
    <div class="border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-lg transition-shadow bg-gradient-to-r from-white to-gray-50">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h3 class="font-semibold text-lg text-gray-800 mb-2 flex items-center gap-2">
            <i data-lucide="calendar-check" class="w-5 h-5 text-blue-600"></i>
            ${event.name}
          </h3>
          <div class="text-sm text-gray-600 space-y-1">
            <p class="flex items-center gap-2">
              <i data-lucide="calendar" class="w-4 h-4"></i>
              ${event.date} at ${event.time}
            </p>
            <p class="flex items-center gap-2">
              <i data-lucide="map-pin" class="w-4 h-4"></i>
              ${event.location}
            </p>
            ${event.invitedSections.length > 0 ? 
              `<p class="flex items-center gap-2">
                <i data-lucide="users" class="w-4 h-4"></i>
                ${event.invitedSections.join(', ')}
              </p>` 
              : ''}
          </div>
        </div>
        <div class="flex gap-2">
          <button 
            onclick="viewEventQR('${event.id}')"
            class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition flex items-center gap-2 shadow-md"
          >
            <i data-lucide="qr-code" class="w-4 h-4"></i>
            View QR
          </button>
          <button 
            onclick="confirmDeleteEvent('${event.id}', '${event.name.replace(/'/g, "\\'")}')"
            class="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition flex items-center gap-2 shadow-md"
            title="Delete event"
          >
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ✅ Confirm Delete Event
window.confirmDeleteEvent = function(eventId, eventName) {
  const confirmed = confirm(`⚠️ Are you sure you want to delete the event "${eventName}"?\n\nThis action cannot be undone.`);
  if (confirmed) {
    deleteEvent(eventId);
    renderEventsList();
    alert('✅ Event deleted successfully!');
  }
};

// ✅ View Event QR Code
window.viewEventQR = async function(eventId) {
  const events = getEvents();
  const event = events.find(e => e.id === eventId);
  if (!event) return;

  // Populate QR display
  const displayNameSpan = document.getElementById('displayEventName')?.querySelector('span');
  if (displayNameSpan) displayNameSpan.textContent = event.name;
  
  const displayDateEl = document.getElementById('displayEventDate');
  if (displayDateEl) displayDateEl.textContent = `${event.date} at ${event.time}`;
  
  const displayLocationEl = document.getElementById('displayLocation');
  if (displayLocationEl) displayLocationEl.textContent = event.location;
  
  const displayRegWindowEl = document.getElementById('displayRegistrationWindow');
  if (displayRegWindowEl) {
    displayRegWindowEl.textContent = `${new Date(event.registrationStart).toLocaleString()} - ${new Date(event.registrationEnd).toLocaleString()}`;
  }
  
  const jwtTokenEl = document.getElementById('jwtToken');
  if (jwtTokenEl && event.token) jwtTokenEl.textContent = event.token;

  // Regenerate QR
  const canvas = document.getElementById('qrCodeCanvas');
  if (canvas && event.attendanceUrl) {
    try {
      await generateQRCode(canvas, event.attendanceUrl);
    } catch (error) {
      console.error('❌ Error regenerating QR:', error);
      alert('Failed to generate QR code. Please try again.');
      return;
    }
  }

  const qrDisplay = document.getElementById('qrCodeDisplay');
  if (qrDisplay) {
    qrDisplay.classList.remove('hidden');
    qrDisplay.scrollIntoView({ behavior: 'smooth' });
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
};

// ✅ Initialize Event Management
export function initEventManagement() {
  console.log('🚀 Initializing Event Management...');

  // Handle form submission
  const eventForm = document.getElementById('eventForm');
  if (eventForm) {
    eventForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('createEventBtn');
      if (!submitBtn) return;
      
      const originalHTML = submitBtn.innerHTML;
      
      try {
        submitBtn.innerHTML = '<i data-lucide="loader" class="w-5 h-5 mr-2 animate-spin"></i>Generating...';
        submitBtn.disabled = true;

        // Collect form data
        const eventData = {
          id: generateEventId(),
          name: document.getElementById('eventName')?.value || '',
          date: document.getElementById('eventDate')?.value || '',
          time: document.getElementById('eventTime')?.value || '',
          location: document.getElementById('location')?.value || '',
          invitedSections: (document.getElementById('invitedSections')?.value || '')
            .split(',')
            .map(s => s.trim())
            .filter(s => s),
          registrationStart: document.getElementById('registrationStart')?.value || '',
          registrationEnd: document.getElementById('registrationEnd')?.value || '',
          deanName: document.getElementById('deanName')?.value || '',
          organizerName: document.getElementById('organizerName')?.value || '',
          createdAt: new Date().toISOString()
        };

        // ✅ Generate JWT token via server-side API
        const jwtData = await generateJWT(
          eventData.id,
          eventData.name,
          eventData.registrationEnd
        );

        // Save event with token and attendance URL
        saveEvent({ 
          ...eventData, 
          token: jwtData.token, 
          attendanceUrl: jwtData.attendanceUrl 
        });

        // Generate QR Code
        const canvas = document.getElementById('qrCodeCanvas');
        if (!canvas) {
          throw new Error('Canvas element not found');
        }
        
        // ✅ Generate QR with server-generated attendance URL
        await generateQRCode(canvas, jwtData.attendanceUrl);

        // Display event info
        const displayNameSpan = document.getElementById('displayEventName')?.querySelector('span');
        if (displayNameSpan) displayNameSpan.textContent = eventData.name;
        
        const displayDateEl = document.getElementById('displayEventDate');
        if (displayDateEl) {
          displayDateEl.textContent = `${new Date(eventData.date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} at ${eventData.time}`;
        }
        
        const displayLocationEl = document.getElementById('displayLocation');
        if (displayLocationEl) displayLocationEl.textContent = eventData.location;
        
        const displayRegWindowEl = document.getElementById('displayRegistrationWindow');
        if (displayRegWindowEl) {
          displayRegWindowEl.textContent = 
            `${new Date(eventData.registrationStart).toLocaleString()} - ${new Date(eventData.registrationEnd).toLocaleString()}`;
        }
        
        const jwtTokenEl = document.getElementById('jwtToken');
        if (jwtTokenEl) jwtTokenEl.textContent = jwtData.token;

        // Show QR code display
        const qrDisplay = document.getElementById('qrCodeDisplay');
        if (qrDisplay) {
          qrDisplay.classList.remove('hidden');
          setTimeout(() => {
            qrDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }

        // Refresh events list
        renderEventsList();

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }

        console.log('✅ Event created successfully!');
        console.log('📍 Attendance URL:', jwtData.attendanceUrl);
        alert('✅ Event created and QR code generated successfully!');

      } catch (error) {
        console.error('❌ Error creating event:', error);
        alert(`❌ Failed to create event: ${error.message}\n\nPlease try again.`);
      } finally {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    });
  }

  // Download QR Code
  document.getElementById('downloadQRBtn')?.addEventListener('click', () => {
    const canvas = document.getElementById('qrCodeCanvas');
    const eventNameSpan = document.getElementById('displayEventName')?.querySelector('span');
    const eventName = eventNameSpan?.textContent || 'Event';
    
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${eventName.replace(/\s+/g, '_')}_QR.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      console.log('✅ QR Code downloaded');
    }
  });

  // Copy attendance link
  document.getElementById('copyLinkBtn')?.addEventListener('click', () => {
    const tokenEl = document.getElementById('jwtToken');
    const token = tokenEl?.textContent || '';
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseUrl = isDev ? window.location.origin : 'https://certificate-creator-gules.vercel.app';
    const url = `${baseUrl}/event/attend?token=${token}`;
    
    navigator.clipboard.writeText(url).then(() => {
      alert('✅ Attendance link copied to clipboard!');
      console.log('✅ Link copied:', url);
    });
  });

  // Print QR Code
  document.getElementById('printQRBtn')?.addEventListener('click', () => {
    const canvas = document.getElementById('qrCodeCanvas');
    const eventNameSpan = document.getElementById('displayEventName')?.querySelector('span');
    const eventName = eventNameSpan?.textContent || 'Event';
    
    if (!canvas) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${eventName} - QR Code</title>
          <style>
            body { 
              display: flex; 
              flex-direction: column;
              align-items: center; 
              justify-content: center; 
              min-height: 100vh;
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            h1 { margin-bottom: 20px; text-align: center; }
            img { border: 4px solid #1e40af; padding: 20px; background: white; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <h1>${eventName}</h1>
          <img src="${canvas.toDataURL()}" />
          <p style="margin-top: 20px; text-align: center;">Scan to mark attendance</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  });

  // Refresh events list
  document.getElementById('refreshEventsBtn')?.addEventListener('click', () => {
    renderEventsList();
    console.log('✅ Events list refreshed');
  });

  // Initial render
  setTimeout(() => {
    renderEventsList();
  }, 500);
}

// ✅ Auto-initialize when loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEventManagement);
} else {
  initEventManagement();
}