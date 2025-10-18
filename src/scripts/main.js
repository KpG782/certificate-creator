import {
  updateCertificatePreview,
  loadImage,
  createSampleJSON,
  validateParticipant,
  validateEmail,
  displayParticipantsTable,
} from "./shared.js";

import {
  fetchStudents,
  filterStudents,
  displayStudentsTable as displayStudentsTableFromSheets,
} from "./sheets.js";

let deanSignatureData = null;
let organizerSignatureData = null;
let leftLogoData = null;
let rightLogoData = null;
let batchDeanSignatureData = null;
let batchOrganizerSignatureData = null;
let batchParticipants = [];

document.addEventListener("DOMContentLoaded", () => {
  // Mode Switching
  const singleTab = document.getElementById("single-mode-tab");
  const batchTab = document.getElementById("batch-mode-tab");
  const studentTab = document.getElementById("student-management-tab");
  const singleContent = document.getElementById("single-mode-content");
  const batchContent = document.getElementById("batch-mode-content");
  const studentContent = document.getElementById("student-management-content");

  console.log("Tabs found:", { singleTab, batchTab, studentTab });

  singleTab?.addEventListener("click", () => {
    console.log("Single clicked");
    singleTab.className =
      "px-8 py-4 rounded-xl font-semibold text-lg transition-all bg-blue-600 text-white shadow-lg";
    batchTab.className =
      "px-8 py-4 rounded-xl font-semibold text-lg transition-all bg-white text-gray-700 shadow";
    studentTab.className =
      "px-8 py-4 rounded-xl font-semibold text-lg transition-all bg-white text-gray-700 shadow";
    singleContent?.classList.remove("hidden");
    batchContent?.classList.add("hidden");
    studentContent?.classList.add("hidden");
  });

  batchTab?.addEventListener("click", () => {
    console.log("Batch clicked");
    batchTab.className =
      "px-8 py-4 rounded-xl font-semibold text-lg transition-all bg-blue-600 text-white shadow-lg";
    singleTab.className =
      "px-8 py-4 rounded-xl font-semibold text-lg transition-all bg-white text-gray-700 shadow";
    studentTab.className =
      "px-8 py-4 rounded-xl font-semibold text-lg transition-all bg-white text-gray-700 shadow";
    batchContent?.classList.remove("hidden");
    singleContent?.classList.add("hidden");
    studentContent?.classList.add("hidden");
  });

  studentTab?.addEventListener("click", () => {
    console.log("Student tab clicked");
    studentTab.className =
      "px-8 py-4 rounded-xl font-semibold text-lg transition-all bg-blue-600 text-white shadow-lg";
    singleTab.className =
      "px-8 py-4 rounded-xl font-semibold text-lg transition-all bg-white text-gray-700 shadow";
    batchTab.className =
      "px-8 py-4 rounded-xl font-semibold text-lg transition-all bg-white text-gray-700 shadow";
    studentContent?.classList.remove("hidden");
    singleContent?.classList.add("hidden");
    batchContent?.classList.add("hidden");

    if (typeof window.loadStudents === "function") {
      window.loadStudents();
    }
  });

  setupLivePreview();
  setupImageUploads();
  setupDownload();
  setupBatchMode();
  setupStudentManagement();
});

function setupLivePreview() {
  const fields = [
    "participantName",
    "participantEmail",
    "category",
    "seminarTitle",
    "eventDate",
    "location",
    "deanName",
    "organizerName",
  ];

  fields.forEach((fieldId) => {
    const input = document.getElementById(fieldId);
    input?.addEventListener("input", () => {
      const participant = {
        name: document.getElementById("participantName")?.value || "",
        email: document.getElementById("participantEmail")?.value || "",
        category: document.getElementById("category")?.value || "",
        seminarTitle: document.getElementById("seminarTitle")?.value || "",
        eventDate: document.getElementById("eventDate")?.value || "",
        location: document.getElementById("location")?.value || "",
        deanName: document.getElementById("deanName")?.value || "",
        organizerName: document.getElementById("organizerName")?.value || "",
      };

      updateCertificatePreview(participant);
    });
  });
}

function setupImageUploads() {
  const leftLogoInput = document.getElementById("left-logo-upload");
  leftLogoInput?.addEventListener("change", async function (e) {
    const file = e.target.files?.[0];
    if (file) {
      try {
        leftLogoData = await loadImage(file);
        const preview = document.getElementById("left-logo-preview");
        if (preview) {
          preview.innerHTML = "";
          const img = document.createElement("img");
          img.src = leftLogoData;
          img.className = "w-28 h-28 object-contain";
          preview.appendChild(img);
        }
      } catch (error) {
        console.error("Error loading left logo:", error);
      }
    }
  });

  const rightLogoInput = document.getElementById("right-logo-upload");
  rightLogoInput?.addEventListener("change", async function (e) {
    const file = e.target.files?.[0];
    if (file) {
      try {
        rightLogoData = await loadImage(file);
        const preview = document.getElementById("right-logo-preview");
        if (preview) {
          preview.innerHTML = "";
          const img = document.createElement("img");
          img.src = rightLogoData;
          img.className = "w-28 h-28 object-contain";
          preview.appendChild(img);
        }
      } catch (error) {
        console.error("Error loading right logo:", error);
      }
    }
  });

  const deanUpload = document.getElementById("dean-signature");
  deanUpload?.addEventListener("change", async function (e) {
    const file = e.target.files?.[0];
    if (file) {
      try {
        deanSignatureData = await loadImage(file);
        const preview = document.getElementById("dean-signature-preview");
        if (preview) {
          preview.innerHTML = "";
          const img = document.createElement("img");
          img.src = deanSignatureData;
          img.className = "h-16 object-contain";
          preview.appendChild(img);
        }
      } catch (error) {
        console.error("Error loading dean signature:", error);
      }
    }
  });

  const organizerUpload = document.getElementById("organizer-signature");
  organizerUpload?.addEventListener("change", async function (e) {
    const file = e.target.files?.[0];
    if (file) {
      try {
        organizerSignatureData = await loadImage(file);
        const preview = document.getElementById("organizer-signature-preview");
        if (preview) {
          preview.innerHTML = "";
          const img = document.createElement("img");
          img.src = organizerSignatureData;
          img.className = "h-16 object-contain";
          preview.appendChild(img);
        }
      } catch (error) {
        console.error("Error loading organizer signature:", error);
      }
    }
  });

  const batchDeanUpload = document.getElementById("batch-dean-signature");
  batchDeanUpload?.addEventListener("change", async function (e) {
    const file = e.target.files?.[0];
    if (file) {
      try {
        batchDeanSignatureData = await loadImage(file);
      } catch (error) {
        console.error("Error loading batch dean signature:", error);
      }
    }
  });

  const batchOrganizerUpload = document.getElementById(
    "batch-organizer-signature"
  );
  batchOrganizerUpload?.addEventListener("change", async function (e) {
    const file = e.target.files?.[0];
    if (file) {
      try {
        batchOrganizerSignatureData = await loadImage(file);
      } catch (error) {
        console.error("Error loading batch organizer signature:", error);
      }
    }
  });
}

function setupDownload() {
  document
    .getElementById("download-btn")
    ?.addEventListener("click", async () => {
      const card = document.getElementById("certificate-card");
      if (!card) return;

      try {
        const dataUrl = await htmlToImage.toPng(card, {
          pixelRatio: 2,
          cacheBust: true,
          backgroundColor: "#ffffff",
        });
        const link = document.createElement("a");
        const name =
          document.getElementById("participantName")?.value || "Certificate";
        link.download = `${name.replace(/\s+/g, "_")}_Certificate.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Error generating certificate:", error);
        alert("Error generating certificate. Please try again.");
      }
    });
}

function setupBatchMode() {
  const jsonUpload = document.getElementById("json-upload");
  const jsonStatus = document.getElementById("json-status");
  const batchGenerateBtn = document.getElementById("batch-generate-btn");
  const tableContainer = document.getElementById(
    "participants-table-container"
  );

  const downloadSampleBtn = document.getElementById("download-sample-json");
  downloadSampleBtn?.addEventListener("click", function () {
    const sampleData = createSampleJSON();
    const blob = new Blob([JSON.stringify(sampleData, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.download = "sample_participants.json";
    link.href = URL.createObjectURL(blob);
    link.click();
  });

  jsonUpload?.addEventListener("change", function (e) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        try {
          const data = JSON.parse(event.target?.result);

          if (
            data.participants &&
            Array.isArray(data.participants) &&
            data.participants.length > 0
          ) {
            const invalidParticipants = data.participants.filter(
              (p) => !validateParticipant(p)
            );

            if (invalidParticipants.length > 0) {
              throw new Error(
                `Invalid participant data: ${invalidParticipants.length} participant(s) missing required fields`
              );
            }

            batchParticipants = data.participants;
            jsonStatus.textContent = `✓ Successfully loaded ${batchParticipants.length} participants`;
            jsonStatus.className =
              "text-sm text-center text-green-600 font-semibold";
            jsonStatus.classList.remove("hidden");
            batchGenerateBtn.disabled = false;

            displayParticipantsTable(
              batchParticipants,
              "participants-table-container"
            );
          } else {
            throw new Error("Invalid format");
          }
        } catch (error) {
          console.error("JSON parsing error:", error);
          jsonStatus.textContent =
            "✗ Invalid JSON format. Please check your file.";
          jsonStatus.className =
            "text-sm text-center text-red-600 font-semibold";
          jsonStatus.classList.remove("hidden");
          batchGenerateBtn.disabled = true;
          batchParticipants = [];
          tableContainer.innerHTML =
            '<p class="text-red-500 text-center py-8">Invalid JSON format</p>';
        }
      };
      reader.readAsText(file);
    }
  });

  batchGenerateBtn?.addEventListener("click", async function () {
    if (batchParticipants.length === 0) {
      alert("Please upload a JSON file with participant data first.");
      return;
    }

    batchGenerateBtn.disabled = true;
    const progressSection = document.getElementById("batch-progress-section");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    const progressCount = document.getElementById("progress-count");

    if (!progressSection || !progressBar || !progressText || !progressCount) {
      batchGenerateBtn.disabled = false;
      return;
    }

    progressSection.classList.remove("hidden");
    progressText.textContent = "Generating certificates...";

    const zip = new JSZip();
    const card = document.getElementById("certificate-card");
    const singleContent = document.getElementById("single-mode-content");

    if (!card || !singleContent) {
      alert("Certificate card not found.");
      batchGenerateBtn.disabled = false;
      return;
    }

    const wasHidden = singleContent.classList.contains("hidden");
    if (wasHidden) {
      singleContent.style.position = "absolute";
      singleContent.style.left = "-9999px";
      singleContent.classList.remove("hidden");
    }

    for (let i = 0; i < batchParticipants.length; i++) {
      const participant = batchParticipants[i];

      updateCertificatePreview(participant);

      const deanPreview = document.getElementById("dean-signature-preview");
      const organizerPreview = document.getElementById(
        "organizer-signature-preview"
      );

      if (deanPreview) deanPreview.innerHTML = "";
      if (organizerPreview) organizerPreview.innerHTML = "";

      await new Promise((resolve) => setTimeout(resolve, 100));

      if (batchDeanSignatureData && deanPreview) {
        const img = new Image();
        img.src = batchDeanSignatureData;
        img.className = "h-16 object-contain";
        await new Promise((resolve) => {
          img.onload = () => {
            deanPreview.appendChild(img);
            resolve();
          };
          img.onerror = () => resolve();
        });
      }

      if (batchOrganizerSignatureData && organizerPreview) {
        const img = new Image();
        img.src = batchOrganizerSignatureData;
        img.className = "h-16 object-contain";
        await new Promise((resolve) => {
          img.onload = () => {
            organizerPreview.appendChild(img);
            resolve();
          };
          img.onerror = () => resolve();
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
      void card.offsetHeight;

      try {
        const dataUrl = await htmlToImage.toPng(card, {
          pixelRatio: 2,
          cacheBust: true,
          backgroundColor: "#ffffff",
        });

        const base64Data = dataUrl.split(",")[1];
        const fileName = `${participant.name.replace(
          /\s+/g,
          "_"
        )}_Certificate.png`;
        zip.file(fileName, base64Data, { base64: true });

        const progress = ((i + 1) / batchParticipants.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressCount.textContent = `${i + 1} / ${batchParticipants.length}`;
      } catch (error) {
        console.error(
          `Error generating certificate for ${participant.name}:`,
          error
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (wasHidden) {
      singleContent.classList.add("hidden");
      singleContent.style.position = "";
      singleContent.style.left = "";
    }

    progressText.textContent = "Creating ZIP file...";

    try {
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.download = `Certificates_Batch_${new Date().getTime()}.zip`;
      link.href = URL.createObjectURL(content);
      link.click();

      progressText.textContent = "Complete! Download started.";
      progressBar.classList.remove("bg-blue-600");
      progressBar.classList.add("bg-green-600");

      setTimeout(() => {
        progressSection.classList.add("hidden");
        progressBar.style.width = "0%";
        progressBar.classList.remove("bg-green-600");
        progressBar.classList.add("bg-blue-600");
        batchGenerateBtn.disabled = false;
      }, 3000);
    } catch (error) {
      console.error("Error creating ZIP:", error);
      alert("Error creating ZIP file. Please try again.");
      batchGenerateBtn.disabled = false;
    }
  });
}

function setupStudentManagement() {
  let allStudents = [];
  let selectedStudents = new Set();

  window.loadStudents = async function () {
    console.log("Loading students...");
    const container = document.getElementById("students-table-container");

    if (container) {
      container.innerHTML =
        '<p class="text-gray-500 text-center py-8">⏳ Loading students from Google Sheets...</p>';
    }

    try {
      allStudents = await fetchStudents();
      console.log("Students loaded:", allStudents.length);
      selectedStudents.clear();
      updateBulkActionsBar();
      applyFiltersAndDisplay();
    } catch (error) {
      console.error("Error loading students:", error);
      if (container) {
        container.innerHTML = `
          <div class="text-center py-8">
            <p class="text-red-500 font-semibold mb-2">⚠️ Error loading students</p>
            <p class="text-sm text-gray-600 mb-4">Error: ${error.message}</p>
          </div>
        `;
      }
    }
  };

  function applyFiltersAndDisplay() {
    const yearFilter = document.getElementById("year-filter")?.value || "";
    const sectionFilter =
      document.getElementById("section-filter")?.value || "";
    const statusFilter = document.getElementById("status-filter")?.value || "";
    const emailSearch = document.getElementById("email-search")?.value || "";

    const filtered = filterStudents(allStudents, {
      year: yearFilter,
      section: sectionFilter,
      status: statusFilter,
      email: emailSearch,
    });

    console.log("Filtered students:", filtered.length);
    displayStudentsTableFromSheets(filtered, "students-table-container");
    attachActionListeners();

    const clearBtn = document.getElementById("clear-search-btn");
    if (clearBtn) {
      clearBtn.classList.toggle("hidden", !emailSearch);
    }
  }

  function updateBulkActionsBar() {
    const bar = document.getElementById("bulk-actions-bar");
    const countSpan = document.getElementById("selected-count");

    if (bar && countSpan) {
      if (selectedStudents.size > 0) {
        bar.classList.remove("hidden");
        countSpan.textContent = selectedStudents.size;
      } else {
        bar.classList.add("hidden");
      }
    }
  }

  function attachActionListeners() {
    document.querySelectorAll(".student-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        const student = JSON.parse(this.getAttribute("data-student"));
        if (this.checked) {
          selectedStudents.add(student.email);
        } else {
          selectedStudents.delete(student.email);
        }
        updateBulkActionsBar();
      });
    });

    // ✅ All send buttons now work the same
    document
      .querySelectorAll(".send-cert-btn, .resend-cert-btn, .retry-cert-btn")
      .forEach((btn) => {
        btn.addEventListener("click", async function () {
          const student = JSON.parse(this.getAttribute("data-student"));
          await sendCertificateToStudent(student, this);
        });
      });

    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  // Event listeners
  let searchTimeout;
  document.getElementById("email-search")?.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      applyFiltersAndDisplay();
    }, 300);
  });

  document.getElementById("clear-search-btn")?.addEventListener("click", () => {
    const searchInput = document.getElementById("email-search");
    if (searchInput) {
      searchInput.value = "";
      applyFiltersAndDisplay();
    }
  });

  document
    .getElementById("year-filter")
    ?.addEventListener("change", applyFiltersAndDisplay);
  document
    .getElementById("section-filter")
    ?.addEventListener("change", applyFiltersAndDisplay);
  document
    .getElementById("status-filter")
    ?.addEventListener("change", applyFiltersAndDisplay);

  document
    .getElementById("refresh-students-btn")
    ?.addEventListener("click", () => {
      window.loadStudents();
    });

  document.getElementById("select-all-btn")?.addEventListener("click", () => {
    const checkboxes = document.querySelectorAll(".student-checkbox");
    const allChecked = Array.from(checkboxes).every((cb) => cb.checked);

    checkboxes.forEach((cb) => {
      cb.checked = !allChecked;
      const student = JSON.parse(cb.getAttribute("data-student"));
      if (!allChecked) {
        selectedStudents.add(student.email);
      } else {
        selectedStudents.delete(student.email);
      }
    });

    updateBulkActionsBar();
  });

  // ✅ Bulk send for pending students
  document
    .getElementById("bulk-send-btn")
    ?.addEventListener("click", async () => {
      if (selectedStudents.size === 0) return;

      const students = allStudents.filter((s) => selectedStudents.has(s.email));
      const pendingStudents = students.filter((s) => s.status === "pending");

      if (pendingStudents.length === 0) {
        alert("No pending students selected.");
        return;
      }

      if (
        !confirm(`Send certificates to ${pendingStudents.length} student(s)?`)
      )
        return;

      const btn = document.getElementById("bulk-send-btn");
      btn.disabled = true;
      btn.innerHTML =
        '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Sending...';

      let successCount = 0;
      let failCount = 0;

      for (const student of pendingStudents) {
        try {
          await sendCertificateToStudent(student, null);
          successCount++;
          console.log(`✓ Sent to ${student.email}`);
        } catch (error) {
          failCount++;
          console.error(`✗ Failed to send to ${student.email}:`, error);
        }
      }

      selectedStudents.clear();
      updateBulkActionsBar();
      window.loadStudents();

      alert(`✓ Sent: ${successCount}\n✗ Failed: ${failCount}`);

      btn.disabled = false;
      btn.innerHTML =
        '<i data-lucide="send" class="w-4 h-4"></i> Send Certificates';
    });

  document.getElementById("deselect-all-btn")?.addEventListener("click", () => {
    document
      .querySelectorAll(".student-checkbox")
      .forEach((cb) => (cb.checked = false));
    selectedStudents.clear();
    updateBulkActionsBar();
  });
}

async function sendCertificateToStudent(student, buttonElement) {
  let originalHTML = "";
  if (buttonElement) {
    originalHTML = buttonElement.innerHTML;
    buttonElement.disabled = true;
    buttonElement.innerHTML =
      '<i data-lucide="loader" class="w-3 h-3 animate-spin"></i> Sending...';
  }

  try {
    const card = document.getElementById("certificate-card");
    const singleContent = document.getElementById("single-mode-content");

    if (!card || !singleContent) {
      throw new Error("Certificate card not found");
    }

    const wasHidden = singleContent.classList.contains("hidden");
    if (wasHidden) {
      singleContent.style.position = "absolute";
      singleContent.style.left = "-9999px";
      singleContent.classList.remove("hidden");
    }

    updateCertificatePreview(student);

    const deanPreview = document.getElementById("dean-signature-preview");
    const organizerPreview = document.getElementById(
      "organizer-signature-preview"
    );

    if (batchDeanSignatureData && deanPreview) {
      const img = new Image();
      img.src = batchDeanSignatureData;
      img.className = "h-16 object-contain";
      await new Promise((resolve) => {
        img.onload = () => {
          deanPreview.innerHTML = "";
          deanPreview.appendChild(img);
          resolve();
        };
        img.onerror = () => resolve();
      });
    }

    if (batchOrganizerSignatureData && organizerPreview) {
      const img = new Image();
      img.src = batchOrganizerSignatureData;
      img.className = "h-16 object-contain";
      await new Promise((resolve) => {
        img.onload = () => {
          organizerPreview.innerHTML = "";
          organizerPreview.appendChild(img);
          resolve();
        };
        img.onerror = () => resolve();
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    const dataUrl = await htmlToImage.toPng(card, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#ffffff",
    });

    if (wasHidden) {
      singleContent.classList.add("hidden");
      singleContent.style.position = "";
      singleContent.style.left = "";
    }

    // ✅ Send ALL certificate details to n8n
    const payload = {
      participantName: student.name,
      participantEmail: student.email,
      category: student.category || "Student",
      seminarTitle: student.seminarTitle,
      eventDate: student.eventDate || "",
      location: student.location || "",
      organizerName: student.organizerName || "",
      deanName: student.deanName || "",
      certificateBase64: dataUrl,
    };

    console.log("Sending to n8n:", {
      ...payload,
      certificateBase64: payload.certificateBase64.substring(0, 50) + "...",
    });

    const response = await fetch(
      "https://n8n.kenbuilds.tech/webhook/certificate-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    console.log("Response status:", response.status);
    console.log("Response headers:", [...response.headers.entries()]);

    // ✅ Get the raw response text first
    const responseText = await response.text();
    console.log("Response text:", responseText);
    console.log("Response text length:", responseText.length);

    if (!response.ok) {
      throw new Error(
        `Failed to send certificate! Status: ${response.status}, Response: ${responseText}`
      );
    }

    // ✅ Try to parse JSON
    let result;
    if (responseText && responseText.trim().length > 0) {
      try {
        result = JSON.parse(responseText);
        console.log("✓ Parsed JSON successfully:", result);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        console.error("Raw text was:", responseText);
        // ✅ Still consider it a success if status is 200
        result = {
          success: true,
          message: "Certificate sent (no JSON response)",
        };
      }
    } else {
      console.warn("⚠️ Empty response body from n8n");
      result = { success: true, message: "Certificate sent (empty response)" };
    }

    console.log("✓ Email sent successfully");
    console.log('✓ Status should be updated to "sent"');

    if (buttonElement) {
      buttonElement.innerHTML =
        '<i data-lucide="check" class="w-3 h-3"></i> Sent!';
      buttonElement.classList.remove("bg-blue-600", "hover:bg-blue-700");
      buttonElement.classList.add("bg-green-600");
    }

    if (!buttonElement) {
      return; // Bulk send mode
    }

    setTimeout(() => {
      window.loadStudents();
    }, 2000);
  } catch (error) {
    console.error(`Error sending certificate:`, error);

    if (buttonElement) {
      buttonElement.innerHTML =
        '<i data-lucide="x" class="w-3 h-3"></i> Failed';
      buttonElement.classList.add("bg-red-600");

      setTimeout(() => {
        buttonElement.innerHTML = originalHTML;
        buttonElement.disabled = false;
        buttonElement.classList.remove("bg-red-600");
        if (typeof lucide !== "undefined") lucide.createIcons();
      }, 3000);
    }

    throw error;
  }
}
