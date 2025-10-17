import {
  updateCertificatePreview,
  loadImage,
  createSampleJSON,
  validateParticipant,
  validateEmail,
  displayParticipantsTable,
} from "./shared.js";

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
  const singleContent = document.getElementById("single-mode-content");
  const batchContent = document.getElementById("batch-mode-content");

  singleTab?.addEventListener("click", () => {
    singleTab.className =
      "px-8 py-4 rounded-xl font-semibold text-lg transition-all bg-blue-600 text-white shadow-lg";
    batchTab.className =
      "px-8 py-4 rounded-xl font-semibold text-lg transition-all bg-white text-gray-700 shadow";
    singleContent?.classList.remove("hidden");
    batchContent?.classList.add("hidden");
  });

  batchTab?.addEventListener("click", () => {
    batchTab.className =
      "px-8 py-4 rounded-xl font-semibold text-lg transition-all bg-blue-600 text-white shadow-lg";
    singleTab.className =
      "px-8 py-4 rounded-xl font-semibold text-lg transition-all bg-white text-gray-700 shadow";
    batchContent?.classList.remove("hidden");
    singleContent?.classList.add("hidden");
  });

  // Live Preview for Single Mode
  setupLivePreview();

  // Logo & Signature Uploads
  setupImageUploads();

  // Download Certificate
  setupDownload();

  // Batch Mode
  setupBatchMode();
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
      // Create participant object from all form fields
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

      // Use shared function to update preview
      updateCertificatePreview(participant);
    });
  });
}

function setupImageUploads() {
  // Left Logo Upload
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

  // Right Logo Upload
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

  // Dean Signature Upload
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

  // Organizer Signature Upload
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

  // Download Sample JSON - Using shared function
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

  // JSON Upload and Table Display
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
            // Use shared validation function
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

            // Use shared function to display table
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

  // Batch Signature Uploads
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

  // Generate All Certificates
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

    // Temporarily show certificate for rendering
    const wasHidden = singleContent.classList.contains("hidden");
    if (wasHidden) {
      singleContent.style.position = "absolute";
      singleContent.style.left = "-9999px";
      singleContent.classList.remove("hidden");
    }

    for (let i = 0; i < batchParticipants.length; i++) {
      const participant = batchParticipants[i];

      // Use shared function to update preview
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

    // Restore visibility
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
