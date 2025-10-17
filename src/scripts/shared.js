export const updateCertificatePreview = (participant) => {
  const previewName = document.getElementById('preview-name');
  const previewEmail = document.getElementById('preview-email');
  const previewCategory = document.getElementById('preview-category');
  const previewSeminar = document.getElementById('preview-seminar');
  const previewDate = document.getElementById('preview-date');
  const previewLocation = document.getElementById('preview-location');
  const previewDean = document.getElementById('preview-dean');
  const previewOrganizer = document.getElementById('preview-organizer');

  if (previewName) previewName.textContent = participant.name;
  if (previewEmail) previewEmail.textContent = participant.email;
  if (previewCategory) previewCategory.textContent = participant.category;
  if (previewSeminar) previewSeminar.textContent = `"${participant.seminarTitle}"`;
  if (previewDate) previewDate.textContent = participant.eventDate;
  if (previewLocation) previewLocation.textContent = participant.location;
  if (previewDean) previewDean.textContent = participant.deanName;
  if (previewOrganizer) previewOrganizer.textContent = participant.organizerName;
};

export const loadImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const createSampleJSON = () => {
  return {
    participants: [
      {
        name: "Maria Santos",
        email: "msantos.a62240916@umak.edu.ph",
        category: "Student",
        seminarTitle: "Cybersecurity Fundamentals for Modern Organizations",
        eventDate: "October 15, 2025",
        location: "HPSB 1012, University of Makati, Taguig City",
        deanName: "Prof. Levi B. Mangaba, DT",
        organizerName: "Prof. Cecille E. Tadeo, Ph. D.",
      },
      {
        name: "Juan Dela Cruz",
        email: "jdelacruz.f12345678@umak.edu.ph",
        category: "Faculty",
        seminarTitle: "Cloud Computing and DevOps Best Practices",
        eventDate: "October 16, 2025",
        location: "HPSB 1013, University of Makati, Taguig City",
        deanName: "Prof. Levi B. Mangaba, DT",
        organizerName: "Prof. Cecille E. Tadeo, Ph. D.",
      },
      {
        name: "Anna Reyes",
        email: "areyes.s87654321@umak.edu.ph",
        category: "Staff",
        seminarTitle: "Artificial Intelligence in Business Applications",
        eventDate: "October 17, 2025",
        location: "HPSB 1014, University of Makati, Taguig City",
        deanName: "Prof. Levi B. Mangaba, DT",
        organizerName: "Prof. Cecille E. Tadeo, Ph. D.",
      },
    ],
  };
};

export const validateParticipant = (participant) => {
  const requiredFields = [
    'name',
    'email',
    'category',
    'seminarTitle',
    'eventDate',
    'location',
    'deanName',
    'organizerName'
  ];
  
  return requiredFields.every(field => participant[field] && participant[field].trim() !== '');
};

export const validateEmail = (email) => {
  // UMak email format: name.x12345678@umak.edu.ph
  const umakEmailPattern = /^[a-zA-Z]+\.[a-z]\d{8}@umak\.edu\.ph$/;
  return umakEmailPattern.test(email);
};

export const displayParticipantsTable = (participants, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  let tableHTML = `
    <table class="w-full text-sm">
      <thead class="bg-gray-100 sticky top-0">
        <tr>
          <th class="px-3 py-2 text-left">#</th>
          <th class="px-3 py-2 text-left">Name</th>
          <th class="px-3 py-2 text-left">Email</th>
          <th class="px-3 py-2 text-left">Category</th>
          <th class="px-3 py-2 text-left">Seminar</th>
          <th class="px-3 py-2 text-left">Date</th>
        </tr>
      </thead>
      <tbody class="divide-y">
  `;

  participants.forEach((p, i) => {
    tableHTML += `
      <tr class="hover:bg-gray-50">
        <td class="px-3 py-2">${i + 1}</td>
        <td class="px-3 py-2 font-medium">${p.name}</td>
        <td class="px-3 py-2 text-xs">${p.email}</td>
        <td class="px-3 py-2">
          <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">${p.category}</span>
        </td>
        <td class="px-3 py-2">${p.seminarTitle}</td>
        <td class="px-3 py-2">${p.eventDate}</td>
      </tr>
    `;
  });

  tableHTML += '</tbody></table>';
  container.innerHTML = tableHTML;
};