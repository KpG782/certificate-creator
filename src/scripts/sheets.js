const SHEET_ID = "1YC7dMB5rn1pCJjqGRbXgom3xpQN6NRC5YlU7E0nzUT0";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

export const fetchStudents = async () => {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();

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
    console.error("Error fetching students:", error);
    return [];
  }
};

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

export const displayStudentsTable = (students, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

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
};
