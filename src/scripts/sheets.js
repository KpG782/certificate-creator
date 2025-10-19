const SHEET_ID = "1YC7dMB5rn1pCJjqGRbXgom3xpQN6NRC5YlU7E0nzUT0";

// ✅ Method 1: Use Published CSV URL (Most Reliable for deployed sites)
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGfW1Fc4tyVzWUftXDPJ3RYiDuAwV_2xdunWFhIp0lIS6_ibAwEFXQXr320WKZSyi80FLyOLOjxzvl/pub?output=csv";

// ✅ Method 2: Fallback to JSON API
const SHEET_JSON_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out=json`;

/**
 * Fetch students from Google Sheets with multiple fallback methods
 */
export const fetchStudents = async () => {
  try {
    console.log("🔄 Fetching students from Google Sheets...");

    // Try CSV method first (most reliable)
    const students = await fetchFromCSV();

    if (students.length > 0) {
      console.log(`✅ Loaded ${students.length} students via CSV`);
      return students;
    }

    // Fallback to JSON API
    console.log("⚠️ CSV failed, trying JSON API...");
    return await fetchFromJSON();
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    return [];
  }
};

/**
 * Method 1: Fetch via CSV (Most Reliable)
 */
async function fetchFromCSV() {
  try {
    const response = await fetch(SHEET_CSV_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error("❌ CSV fetch failed:", error);
    return [];
  }
}

/**
 * Method 2: Fetch via JSON API (Fallback)
 */
async function fetchFromJSON() {
  try {
    const response = await fetch(SHEET_JSON_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();

    // Remove Google's JSON wrapper
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    const students = rows.map((row) => ({
      id: row.c[0]?.v || "",
      name: row.c[1]?.v || "",
      email: row.c[2]?.v || "",
      section: row.c[3]?.v || "",
      category: row.c[4]?.v || "",
      seminarTitle: row.c[5]?.v || "",
      eventDate: row.c[6]?.v || "",
      location: row.c[7]?.v || "",
      deanName: row.c[8]?.v || "",
      organizerName: row.c[9]?.v || "",
      status: row.c[10]?.v || "pending",
      sentDate: row.c[11]?.v || "",
    }));

    return students;
  } catch (error) {
    console.error("❌ JSON fetch failed:", error);
    return [];
  }
}

/**
 * Parse CSV text into student objects
 */
function parseCSV(csvText) {
  const lines = csvText.split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

  console.log("📋 CSV Headers:", headers);

  const students = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle CSV with quoted values
    const values = parseCSVLine(line);

    if (values.length < 12) continue; // Skip incomplete rows

    students.push({
      id: values[0] || "",
      name: values[1] || "",
      email: values[2] || "",
      section: values[3] || "",
      category: values[4] || "",
      seminarTitle: values[5] || "",
      eventDate: values[6] || "",
      location: values[7] || "",
      deanName: values[8] || "",
      organizerName: values[9] || "",
      status: values[10] || "pending",
      sentDate: values[11] || "",
    });
  }

  return students;
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line) {
  const values = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      values.push(currentValue.trim());
      currentValue = "";
    } else {
      currentValue += char;
    }
  }

  // Push the last value
  values.push(currentValue.trim());

  return values;
}

/**
 * Filter students based on criteria
 */
export const filterStudents = (students, filters) => {
  return students.filter((student) => {
    // Email search filter
    if (
      filters.email &&
      !student.email.toLowerCase().includes(filters.email.toLowerCase())
    ) {
      return false;
    }

    // Year filter
    if (filters.year && !student.section.startsWith(filters.year + "-")) {
      return false;
    }

    // Section filter
    if (filters.section && student.section !== filters.section) {
      return false;
    }

    // Status filter
    if (filters.status && student.status !== filters.status) {
      return false;
    }

    return true;
  });
};

/**
 * Display students in a table
 */
export const displayStudentsTable = (students, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error("❌ Container not found:", containerId);
    return;
  }

  if (students.length === 0) {
    container.innerHTML =
      '<p class="text-gray-500 text-center py-8">No students found matching filters.</p>';
    return;
  }

  let tableHTML = `
    <table class="w-full text-sm">
      <thead class="bg-gray-100 sticky top-0">
        <tr>
          <th class="px-3 py-2 text-left">
            <input type="checkbox" id="select-all-checkbox" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
          </th>
          <th class="px-3 py-2 text-left">#</th>
          <th class="px-3 py-2 text-left">Name</th>
          <th class="px-3 py-2 text-left">Email</th>
          <th class="px-3 py-2 text-left">Section</th>
          <th class="px-3 py-2 text-left">Seminar</th>
          <th class="px-3 py-2 text-left">Status</th>
          <th class="px-3 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y">
  `;

  students.forEach((student, i) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: "clock" },
      sent: { bg: "bg-green-100", text: "text-green-800", icon: "mail-check" },
      failed: { bg: "bg-red-100", text: "text-red-800", icon: "alert-circle" },
    };

    const config = statusConfig[student.status] || statusConfig.pending;

    // Action buttons based on status
    let actionButtons = "";

    if (student.status === "pending") {
      actionButtons = `
        <button class="send-cert-btn px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs flex items-center gap-1" data-student='${JSON.stringify(
          student
        ).replace(/'/g, "&apos;")}' title="Send Certificate">
          <i data-lucide="send" class="w-3 h-3"></i>
          Send
        </button>
      `;
    } else if (student.status === "sent") {
      actionButtons = `
        <button class="resend-cert-btn px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-xs flex items-center gap-1" data-student='${JSON.stringify(
          student
        ).replace(/'/g, "&apos;")}' title="Resend Certificate">
          <i data-lucide="rotate-cw" class="w-3 h-3"></i>
          Resend
        </button>
      `;
    } else {
      // failed
      actionButtons = `
        <button class="retry-cert-btn px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-xs flex items-center gap-1" data-student='${JSON.stringify(
          student
        ).replace(/'/g, "&apos;")}' title="Retry Sending">
          <i data-lucide="refresh-cw" class="w-3 h-3"></i>
          Retry
        </button>
      `;
    }

    tableHTML += `
      <tr class="hover:bg-gray-50 student-row" data-email="${student.email}">
        <td class="px-3 py-2">
          <input type="checkbox" class="student-checkbox w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" data-student='${JSON.stringify(
            student
          ).replace(/'/g, "&apos;")}'>
        </td>
        <td class="px-3 py-2">${i + 1}</td>
        <td class="px-3 py-2 font-medium">${student.name}</td>
        <td class="px-3 py-2 text-xs text-gray-600">${student.email}</td>
        <td class="px-3 py-2">
          <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">${
            student.section
          }</span>
        </td>
        <td class="px-3 py-2 max-w-xs truncate" title="${
          student.seminarTitle
        }">${student.seminarTitle}</td>
        <td class="px-3 py-2">
          <span class="px-2 py-1 ${config.bg} ${
      config.text
    } rounded text-xs font-medium flex items-center gap-1 w-fit">
            <i data-lucide="${config.icon}" class="w-3 h-3"></i>
            ${student.status}
          </span>
        </td>
        <td class="px-3 py-2">${actionButtons}</td>
      </tr>
    `;
  });

  tableHTML += "</tbody></table>";
  container.innerHTML = tableHTML;

  // Update total count
  const totalElement = document.getElementById("total-students");
  if (totalElement) {
    totalElement.textContent = students.length;
  }

  // Reinitialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  console.log(`✅ Displayed ${students.length} students`);
};
