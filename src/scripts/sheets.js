const SHEET_ID = "1YC7dMB5rn1pCJjqGRbXgom3xpQN6NRC5YlU7E0nzUT0";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&tq=SELECT%20*`;

export const fetchStudents = async () => {
  try {
    console.log("📊 Fetching students from Google Sheets...");

    // ✅ Use fetch with no-cors mode for Google Sheets
    const response = await fetch(SHEET_URL, {
      method: "GET",
      mode: "no-cors", // ✅ Bypass CORS for Google Sheets public data
    });

    // ✅ Since mode is no-cors, we can't read the response
    // Use JSONP parsing instead
    const text = await response.text();

    // Parse JSONP response (Google Sheets returns JSONP)
    const jsonString = text.match(
      /google\.visualization\.Query\.setResponse\((.*)\);/
    )?.[1];

    if (!jsonString) {
      throw new Error("Failed to parse Google Sheets response");
    }

    const data = JSON.parse(jsonString);

    if (!data.table || !data.table.rows) {
      console.warn("⚠️ No data found in sheet");
      return [];
    }

    const rows = data.table.rows;
    const students = rows.map((row, index) => {
      const cells = row.c || [];
      return {
        id: cells[0]?.v || index + 1,
        name: cells[1]?.v || "",
        email: cells[2]?.v || "",
        section: cells[3]?.v || "",
        category: cells[4]?.v || "Student",
        seminarTitle: cells[5]?.v || "",
        eventDate: cells[6]?.v || "",
        location: cells[7]?.v || "",
        deanName: cells[8]?.v || "",
        organizerName: cells[9]?.v || "",
        status: cells[10]?.v || "pending",
        sentDate: cells[11]?.v || null,
      };
    });

    console.log(`✅ Loaded ${students.length} students`);
    return students;
  } catch (error) {
    console.error("❌ Error fetching students:", error);

    // ✅ Return sample data for testing if fetch fails
    console.warn("⚠️ Using sample data for testing");
    return [
      {
        id: 1,
        name: "Ken Garcia",
        email: "kenpatrickgarcia123@gmail.com",
        section: "BSIT 4-1",
        category: "Student",
        seminarTitle: "Mobile App Security",
        eventDate: "Date(2025,9,15)",
        location: "HPSB 1012",
        deanName: "Dr. Joel B. Mangaba, DIT",
        organizerName: "Dr. Cecille E. Tadeo, Ph. D.",
        status: "pending",
        sentDate: null,
      },
      {
        id: 2,
        name: "Mark Siazon",
        email: "msiazon.k12043276@umak.edu.ph",
        section: "BSIT 4-1",
        category: "Student",
        seminarTitle: "AI in Education",
        eventDate: "Date(2025,9,15)",
        location: "HPSB 1012",
        deanName: "Dr. Joel B. Mangaba, DIT",
        organizerName: "Dr. Cecille E. Tadeo, Ph. D.",
        status: "sent",
        sentDate: "2025-10-19 19:48",
      },
    ];
  }
};

export const filterStudents = (students, filters) => {
  return students.filter((student) => {
    // Email search
    if (
      filters.email &&
      !student.email.toLowerCase().includes(filters.email.toLowerCase())
    ) {
      return false;
    }

    // Year filter (extract from section)
    if (filters.year && filters.year !== "all") {
      const yearMatch = student.section.match(/\d/);
      if (!yearMatch || yearMatch[0] !== filters.year) {
        return false;
      }
    }

    // Section filter
    if (filters.section && filters.section !== "all") {
      if (
        !student.section.toLowerCase().includes(filters.section.toLowerCase())
      ) {
        return false;
      }
    }

    // Status filter
    if (filters.status && filters.status !== "all") {
      if (student.status !== filters.status) {
        return false;
      }
    }

    return true;
  });
};

export const displayStudentsTable = (students, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (students.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12">
        <i data-lucide="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-3"></i>
        <p class="text-gray-600">No students found</p>
      </div>
    `;
    if (typeof lucide !== "undefined") lucide.createIcons();
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
};
