<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificate Generator - University of Makati</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Source+Sans+3:wght@300;400;600;700&display=swap');
    
    body {
      font-family: 'Source Sans 3', sans-serif;
    }
    
    .font-merriweather {
      font-family: 'Merriweather', serif;
    }

    .tab-button {
      border-bottom: 3px solid transparent;
    }

    .tab-button.active {
      border-bottom-color: #2563eb;
      color: #2563eb;
    }

  </style>
</head>
<body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">Certificate Generator</h1>
      <p class="text-gray-600">Create professional certificates instantly - Single or Batch mode</p>
    </div>

    <div class="flex justify-center gap-4 mb-8">
      <button id="single-mode-tab" class="tab-button active px-6 py-3 font-semibold text-lg transition-all">
        📄 Single Certificate
      </button>
      <button id="batch-mode-tab" class="tab-button px-6 py-3 font-semibold text-lg transition-all">
        📦 Batch Mode
      </button>
    </div>

    <!-- Single Mode Content -->
    <div id="single-mode-content">
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Certificate Preview</h2>

        <div id="certificate-container" class="overflow-x-auto">
          <div id="certificate-card" class="relative w-[1200px] h-[850px] bg-gray-100 border-8 border-double border-blue-900 mx-auto" style="box-shadow: inset 0 0 0 2px #1e3a8a;">
            <div class="absolute inset-0 opacity-5">
              <div class="absolute top-0 left-0 w-48 h-full bg-gradient-to-r from-blue-900 to-transparent transform -skew-x-12"></div>
              <div class="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-yellow-600 to-transparent transform -skew-x-12" style="left: 40px;"></div>
            </div>

            <div class="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-blue-900 via-blue-800 to-transparent"></div>
            <div class="absolute top-0 left-24 w-16 h-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-transparent"></div>

            <div class="absolute bottom-0 left-0 right-0 h-24">
              <svg viewBox="0 0 1200 100" class="w-full h-full">
                <path d="M0,50 Q300,20 600,50 T1200,50 L1200,100 L0,100 Z" fill="#1e3a8a"/>
                <path d="M0,60 Q300,30 600,60 T1200,60 L1200,100 L0,100 Z" fill="#ca8a04" opacity="0.8"/>
              </svg>
            </div>

            <div class="relative z-10 flex flex-col items-center px-16 py-12 h-full">
              <div class="flex items-center justify-between w-full mb-8">
                <div class="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-blue-900">
                  <div class="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center">
                    <span class="text-yellow-400 text-2xl font-bold">UM</span>
                  </div>
                </div>

                <div class="text-center flex-1 mx-8">
                  <h1 class="text-3xl font-bold text-gray-800 mb-1">UNIVERSITY OF MAKATI</h1>
                  <p class="text-sm text-gray-600 mb-2">J.P. Rizal Extension., West Rembo, Taguig City</p>
                  <h2 class="text-xl font-semibold text-gray-700">College of Computing and Information Sciences</h2>
                </div>

                <div class="w-24 h-24 bg-green-700 rounded-full flex items-center justify-center border-4 border-blue-900">
                  <div class="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center">
                    <span class="text-green-400 text-2xl font-bold">CC</span>
                  </div>
                </div>
              </div>

              <div class="mb-12">
                <h2 class="text-5xl font-bold text-center text-gray-800 tracking-wider font-merriweather">CERTIFICATE OF PARTICIPATION</h2>
                <p class="text-center text-gray-600 mt-4 text-lg">This certificate is presented to</p>
              </div>

              <div class="mb-8">
                <h3 id="preview-name" class="text-5xl font-bold text-blue-900 text-center border-b-4 border-blue-900 pb-2 px-8 font-merriweather">
                  Jessan Q. Mojica
                </h3>
              </div>

              <div class="text-center mb-8 max-w-4xl">
                <p class="text-gray-700 text-base leading-relaxed">
                  for actively participating in the seminar entitled
                </p>
                <p id="preview-seminar" class="text-lg font-semibold text-gray-800 mt-3 mb-3 px-4">
                  "Demystifying the SOC: Fundamentals of Security Operations Centers for Future Cyber Defenders"
                </p>
                <p class="text-gray-700 text-base">
                  held on <span id="preview-date" class="font-semibold">September 24, 2025</span>, at <span id="preview-location" class="font-semibold">HPSB 1012, University of Makati, Taguig City</span>
                </p>
              </div>

              <div class="flex justify-around items-end w-full max-w-3xl mt-auto pt-8">
                <div class="text-center">
                  <div id="dean-signature-preview" class="w-48 h-20 mb-2 flex items-center justify-center"></div>
                  <div class="w-48 border-t-2 border-gray-800 mb-2"></div>
                  <p id="preview-dean" class="font-bold text-gray-800">Prof. Levi B. Mangaba, DT</p>
                  <p class="text-sm text-gray-600">Dean, CCIS</p>
                </div>

                <div class="text-center">
                  <div id="organizer-signature-preview" class="w-48 h-20 mb-2 flex items-center justify-center"></div>
                  <div class="w-48 border-t-2 border-gray-800 mb-2"></div>
                  <p id="preview-organizer" class="font-bold text-gray-800">Prof. Cecille E. Tadeo, Ph. D.</p>
                  <p class="text-sm text-gray-600">Event Organizer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-8">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6">Participant Details</h2>

          <form id="certificate-form" class="flex flex-col gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Participant Name</label>
              <input class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" id="participantName" placeholder="Jessan Q. Mojica" required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Seminar Title</label>
              <textarea class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" id="seminarTitle" rows="3" placeholder="Demystifying the SOC..." required></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
              <input class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" id="eventDate" placeholder="September 24, 2025" required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" id="location" placeholder="HPSB 1012, University of Makati" required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Dean Name</label>
              <input class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" id="deanName" value="Prof. Levi B. Mangaba, DT" required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Event Organizer</label>
              <input class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" id="organizerName" value="Prof. Cecille E. Tadeo, Ph. D." required />
            </div>
          </form>
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">Dean E-Signature</h2>
            <div class="space-y-4">
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input type="file" id="dean-signature-upload" accept="image/*" class="hidden" />
                <label for="dean-signature-upload" class="cursor-pointer">
                  <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <p class="text-sm font-medium text-gray-700">Click to upload Dean's signature</p>
                  <p class="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                </label>
              </div>
              <div id="dean-filename" class="text-sm text-gray-600 text-center hidden"></div>
              <button type="button" id="clear-dean-signature" class="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium hidden">🗑️ Clear Signature</button>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">Organizer E-Signature</h2>
            <div class="space-y-4">
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input type="file" id="organizer-signature-upload" accept="image/*" class="hidden" />
                <label for="organizer-signature-upload" class="cursor-pointer">
                  <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <p class="text-sm font-medium text-gray-700">Click to upload Organizer's signature</p>
                  <p class="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                </label>
              </div>
              <div id="organizer-filename" class="text-sm text-gray-600 text-center hidden"></div>
              <button type="button" id="clear-organizer-signature" class="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium hidden">🗑️ Clear Signature</button>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6">
            <button class="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg text-lg" id="download-btn" type="button">📥 Download Certificate</button>
            <p class="text-sm text-gray-500 text-center mt-3">Certificate will be downloaded as PNG (1200x850px)</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Batch Mode Content -->
    <div id="batch-mode-content" class="hidden">
      <div class="grid lg:grid-cols-2 gap-8">
        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">📦 Batch Certificate Generation</h2>
            <p class="text-gray-600 mb-6">Upload a JSON file with participant details to generate multiple certificates at once.</p>

            <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors mb-4">
              <input type="file" id="json-upload" accept=".json" class="hidden" />
              <label for="json-upload" class="cursor-pointer">
                <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p class="text-lg font-medium text-gray-700 mb-2">Click to upload JSON file</p>
                <p class="text-sm text-gray-500">or drag and drop</p>
              </label>
            </div>

            <div id="json-status" class="text-sm text-center hidden mb-4"></div>

            <button id="download-sample-json" class="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium">📄 Download Sample JSON Template</button>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">E-Signatures (Applied to All)</h2>
            <div class="space-y-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Dean Signature</label>
                <input type="file" id="batch-dean-signature" accept="image/*" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Organizer Signature</label>
                <input type="file" id="batch-organizer-signature" accept="image/*" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">JSON Format Example</h2>
            <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre class="text-green-400 text-sm"><code>{

"participants": [
{
"name": "Jessan Q. Mojica",
"seminarTitle": "Demystifying the SOC",
"eventDate": "September 24, 2025",
"location": "HPSB 1012, UMak",
"deanName": "Prof. Levi B. Mangaba, DT",
"organizerName": "Prof. Cecille E. Tadeo"
}
]
}</code></pre>
</div>
<p class="text-sm text-gray-600 mt-4"><strong>Note:</strong> Each participant can have unique values for all fields.</p>
</div>

          <div id="batch-progress-section" class="bg-white rounded-xl shadow-lg p-6 hidden">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Generation Progress</h2>
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span id="progress-text" class="text-gray-600">Preparing...</span>
                <span id="progress-count" class="font-semibold text-blue-600">0 / 0</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-4">
                <div id="progress-bar" class="bg-blue-600 h-4 rounded-full transition-all duration-300" style="width: 0%"></div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6">
            <button class="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow-lg text-lg disabled:bg-gray-400 disabled:cursor-not-allowed" id="batch-generate-btn" type="button" disabled>🚀 Generate & Download All Certificates</button>
            <p class="text-sm text-gray-500 text-center mt-3">Certificates will be downloaded as a ZIP file</p>
          </div>
        </div>
      </div>
    </div>

  </div>

  <script>
    let deanSignatureData = null;
    let organizerSignatureData = null;
    let batchDeanSignatureData = null;
    let batchOrganizerSignatureData = null;
    let batchParticipants = [];

    document.addEventListener('DOMContentLoaded', function() {
      const singleTab = document.getElementById('single-mode-tab');
      const batchTab = document.getElementById('batch-mode-tab');
      const singleContent = document.getElementById('single-mode-content');
      const batchContent = document.getElementById('batch-mode-content');

      singleTab.addEventListener('click', () => {
        singleTab.classList.add('active');
        batchTab.classList.remove('active');
        singleContent.classList.remove('hidden');
        batchContent.classList.add('hidden');
      });

      batchTab.addEventListener('click', () => {
        batchTab.classList.add('active');
        singleTab.classList.remove('active');
        batchContent.classList.remove('hidden');
        singleContent.classList.add('hidden');
      });

      // SINGLE MODE
      ['participantName', 'seminarTitle', 'eventDate', 'location', 'deanName', 'organizerName'].forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (!input) return;
        
        input.addEventListener('input', function() {
          const previewMap = {
            'participantName': 'preview-name',
            'seminarTitle': 'preview-seminar',
            'eventDate': 'preview-date',
            'location': 'preview-location',
            'deanName': 'preview-dean',
            'organizerName': 'preview-organizer'
          };
          
          const previewElement = document.getElementById(previewMap[fieldId]);
          if (previewElement) {
            previewElement.textContent = fieldId === 'seminarTitle' ? `"${input.value}"` : input.value;
          }
        });
      });

      const deanUpload = document.getElementById('dean-signature-upload');
      const deanPreview = document.getElementById('dean-signature-preview');
      const deanFilename = document.getElementById('dean-filename');
      const clearDeanBtn = document.getElementById('clear-dean-signature');

      deanUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(event) {
            deanSignatureData = event.target.result;
            const img = document.createElement('img');
            img.src = deanSignatureData;
            img.className = 'max-w-full max-h-full object-contain';
            deanPreview.innerHTML = '';
            deanPreview.appendChild(img);
            deanFilename.textContent = `✓ ${file.name}`;
            deanFilename.classList.remove('hidden');
            clearDeanBtn.classList.remove('hidden');
          };
          reader.readAsDataURL(file);
        }
      });

      clearDeanBtn.addEventListener('click', function() {
        deanSignatureData = null;
        deanPreview.innerHTML = '';
        deanFilename.classList.add('hidden');
        clearDeanBtn.classList.add('hidden');
        deanUpload.value = '';
      });

      const organizerUpload = document.getElementById('organizer-signature-upload');
      const organizerPreview = document.getElementById('organizer-signature-preview');
      const organizerFilename = document.getElementById('organizer-filename');
      const clearOrganizerBtn = document.getElementById('clear-organizer-signature');

      organizerUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(event) {
            organizerSignatureData = event.target.result;
            const img = document.createElement('img');
            img.src = organizerSignatureData;
            img.className = 'max-w-full max-h-full object-contain';
            organizerPreview.innerHTML = '';
            organizerPreview.appendChild(img);
            organizerFilename.textContent = `✓ ${file.name}`;
            organizerFilename.classList.remove('hidden');
            clearOrganizerBtn.classList.remove('hidden');
          };
          reader.readAsDataURL(file);
        }
      });

      clearOrganizerBtn.addEventListener('click', function() {
        organizerSignatureData = null;
        organizerPreview.innerHTML = '';
        organizerFilename.classList.add('hidden');
        clearOrganizerBtn.classList.add('hidden');
        organizerUpload.value = '';
      });

      document.getElementById('download-btn').addEventListener('click', async function() {
        const card = document.getElementById('certificate-card');
        try {
          const dataUrl = await htmlToImage.toPng(card, { pixelRatio: 2 });
          const link = document.createElement('a');
          const participantName = document.getElementById('participantName').value || 'Certificate';
          link.download = `${participantName.replace(/\s+/g, '_')}_Certificate.png`;
          link.href = dataUrl;
          link.click();
        } catch (error) {
          console.error('Error generating certificate:', error);
          alert('Error generating certificate. Please try again.');
        }
      });

      // BATCH MODE
      const jsonUpload = document.getElementById('json-upload');
      const jsonStatus = document.getElementById('json-status');
      const batchGenerateBtn = document.getElementById('batch-generate-btn');

      document.getElementById('download-sample-json').addEventListener('click', function() {
        const sampleData = {
          participants: [
            {
              name: "Maria Santos",
              seminarTitle: "Cybersecurity Fundamentals for Modern Organizations",
              eventDate: "October 15, 2025",
              location: "HPSB 1012, University of Makati, Taguig City",
              deanName: "Prof. Levi B. Mangaba, DT",
              organizerName: "Prof. Cecille E. Tadeo, Ph. D."
            },
            {
              name: "Juan Dela Cruz",
              seminarTitle: "Cloud Computing and DevOps Best Practices",
              eventDate: "October 16, 2025",
              location: "HPSB 1013, University of Makati, Taguig City",
              deanName: "Prof. Levi B. Mangaba, DT",
              organizerName: "Prof. Cecille E. Tadeo, Ph. D."
            },
            {
              name: "Anna Reyes",
              seminarTitle: "Artificial Intelligence in Business Applications",
              eventDate: "October 17, 2025",
              location: "HPSB 1014, University of Makati, Taguig City",
              deanName: "Prof. Levi B. Mangaba, DT",
              organizerName: "Prof. Cecille E. Tadeo, Ph. D."
            },
            {
              name: "Carlos Martinez",
              seminarTitle: "Data Science and Analytics Workshop",
              eventDate: "October 18, 2025",
              location: "HPSB 1015, University of Makati, Taguig City",
              deanName: "Prof. Levi B. Mangaba, DT",
              organizerName: "Prof. Cecille E. Tadeo, Ph. D."
            },
            {
              name: "Sofia Garcia",
              seminarTitle: "Mobile App Development with Flutter",
              eventDate: "October 19, 2025",
              location: "HPSB 1016, University of Makati, Taguig City",
              deanName: "Prof. Levi B. Mangaba, DT",
              organizerName: "Prof. Cecille E. Tadeo, Ph. D."
            },
            {
              name: "Miguel Torres",
              seminarTitle: "Blockchain Technology and Cryptocurrency",
              eventDate: "October 20, 2025",
              location: "HPSB 1017, University of Makati, Taguig City",
              deanName: "Prof. Levi B. Mangaba, DT",
              organizerName: "Prof. Cecille E. Tadeo, Ph. D."
            },
            {
              name: "Isabella Cruz",
              seminarTitle: "Web Development with React and Node.js",
              eventDate: "October 21, 2025",
              location: "HPSB 1018, University of Makati, Taguig City",
              deanName: "Prof. Levi B. Mangaba, DT",
              organizerName: "Prof. Cecille E. Tadeo, Ph. D."
            },
            {
              name: "Diego Fernandez",
              seminarTitle: "Network Security and Ethical Hacking",
              eventDate: "October 22, 2025",
              location: "HPSB 1019, University of Makati, Taguig City",
              deanName: "Prof. Levi B. Mangaba, DT",
              organizerName: "Prof. Cecille E. Tadeo, Ph. D."
            },
            {
              name: "Gabriela Lopez",
              seminarTitle: "Internet of Things (IoT) Solutions",
              eventDate: "October 23, 2025",
              location: "HPSB 1020, University of Makati, Taguig City",
              deanName: "Prof. Levi B. Mangaba, DT",
              organizerName: "Prof. Cecille E. Tadeo, Ph. D."
            },
            {
              name: "Rafael Santiago",
              seminarTitle: "Machine Learning and Deep Learning Fundamentals",
              eventDate: "October 24, 2025",
              location: "HPSB 1021, University of Makati, Taguig City",
              deanName: "Prof. Levi B. Mangaba, DT",
              organizerName: "Prof. Cecille E. Tadeo, Ph. D."
            }
          ]
        };

        const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.download = 'sample_participants.json';
        link.href = URL.createObjectURL(blob);
        link.click();
      });

      jsonUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(event) {
            try {
              const data = JSON.parse(event.target.result);
              if (data.participants && Array.isArray(data.participants)) {
                batchParticipants = data.participants;
                jsonStatus.textContent = `✓ Successfully loaded ${batchParticipants.length} participants`;
                jsonStatus.className = 'text-sm text-center text-green-600 font-semibold';
                jsonStatus.classList.remove('hidden');
                batchGenerateBtn.disabled = false;
              } else {
                throw new Error('Invalid format');
              }
            } catch (error) {
              jsonStatus.textContent = '✗ Invalid JSON format. Please check your file.';
              jsonStatus.className = 'text-sm text-center text-red-600 font-semibold';
              jsonStatus.classList.remove('hidden');
              batchGenerateBtn.disabled = true;
            }
          };
          reader.readAsText(file);
        }
      });

      document.getElementById('batch-dean-signature').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(event) {
            batchDeanSignatureData = event.target.result;
          };
          reader.readAsDataURL(file);
        }
      });

      document.getElementById('batch-organizer-signature').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(event) {
            batchOrganizerSignatureData = event.target.result;
          };
          reader.readAsDataURL(file);
        }
      });

      batchGenerateBtn.addEventListener('click', async function() {
        if (batchParticipants.length === 0) {
          alert('Please upload a JSON file with participant data first.');
          return;
        }

        batchGenerateBtn.disabled = true;
        const progressSection = document.getElementById('batch-progress-section');
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        const progressCount = document.getElementById('progress-count');

        progressSection.classList.remove('hidden');
        progressText.textContent = 'Generating certificates...';

        const zip = new JSZip();
        const card = document.getElementById('certificate-card');

        for (let i = 0; i < batchParticipants.length; i++) {
          const participant = batchParticipants[i];
          
          document.getElementById('preview-name').textContent = participant.name;
          document.getElementById('preview-seminar').textContent = `"${participant.seminarTitle}"`;
          document.getElementById('preview-date').textContent = participant.eventDate;
          document.getElementById('preview-location').textContent = participant.location;
          document.getElementById('preview-dean').textContent = participant.deanName;
          document.getElementById('preview-organizer').textContent = participant.organizerName;

          const deanPreview = document.getElementById('dean-signature-preview');
          const organizerPreview = document.getElementById('organizer-signature-preview');
          
          deanPreview.innerHTML = '';
          organizerPreview.innerHTML = '';

          if (batchDeanSignatureData) {
            const img = document.createElement('img');
            img.src = batchDeanSignatureData;
            img.className = 'max-w-full max-h-full object-contain';
            deanPreview.appendChild(img);
          }

          if (batchOrganizerSignatureData) {
            const img = document.createElement('img');
            img.src = batchOrganizerSignatureData;
            img.className = 'max-w-full max-h-full object-contain';
            organizerPreview.appendChild(img);
          }

          await new Promise(resolve => setTimeout(resolve, 100));

          try {
            const dataUrl = await htmlToImage.toPng(card, { pixelRatio: 2 });
            const base64Data = dataUrl.split(',')[1];
            const fileName = `${participant.name.replace(/\s+/g, '_')}_Certificate.png`;
            zip.file(fileName, base64Data, { base64: true });

            const progress = ((i + 1) / batchParticipants.length) * 100;
            progressBar.style.width = `${progress}%`;
            progressCount.textContent = `${i + 1} / ${batchParticipants.length}`;
          } catch (error) {
            console.error(`Error generating certificate for ${participant.name}:`, error);
          }
        }

        progressText.textContent = 'Creating ZIP file...';

        try {
          const content = await zip.generateAsync({ type: 'blob' });
          const link = document.createElement('a');
          link.download = `Certificates_Batch_${new Date().getTime()}.zip`;
          link.href = URL.createObjectURL(content);
          link.click();

          progressText.textContent = 'Complete! Download started.';
          progressBar.classList.remove('bg-blue-600');
          progressBar.classList.add('bg-green-600');

          setTimeout(() => {
            progressSection.classList.add('hidden');
            progressBar.style.width = '0%';
            progressBar.classList.remove('bg-green-600');
            progressBar.classList.add('bg-blue-600');
            batchGenerateBtn.disabled = false;
          }, 3000);
        } catch (error) {
          console.error('Error creating ZIP:', error);
          alert('Error creating ZIP file. Please try again.');
          batchGenerateBtn.disabled = false;
        }
      });
    });
  </script>
</body>
</html>
