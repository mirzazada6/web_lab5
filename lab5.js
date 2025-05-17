let data = {
  profilePic: "https://i.pinimg.com/originals/04/64/6b/04646bc6ef384e1c564b25df6ef17291.jpg",
  name: "",
  title: "",
  contact: [],
  education: [],
  skills: [],
  languages: [],
  profile: "",
  experience: [],
  references: []
};

const elements = {
  name: document.getElementById("name-input"),
  title: document.getElementById("title-input"),
  phone: document.getElementById("phone-input"),
  email: document.getElementById("email-input"),
  address: document.getElementById("address-input"),
  website: document.getElementById("website-input"),
  profile: document.getElementById("profile-input"),
  profilePic: document.getElementById("profile-pic"),
  contact: document.getElementById("contact"),
  education: document.getElementById("education"),
  skills: document.getElementById("skills"),
  languages: document.getElementById("languages"),
  experience: document.getElementById("experience"),
  references: document.getElementById("references")
};

const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s-]+$/,
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  yearRange: /^\d{4}\s*-\s*\d{4}$/
};

// Sample JSON data
const sampleJSONData = {
  "profilePic": "https://i.pinimg.com/originals/04/64/6b/04646bc6ef384e1c564b25df6ef17291.jpg",
  "name": "Irana Mirzazada",
  "title": "Web Developer",
  "contact": [
    "+994501234567",
    "irana@example.com",
    "Baku, Azerbaijan",
    "https://irana.dev"
  ],
  "education": [
    {
      "years": "2024-2028",
      "school": "Azerbaijan Technical University",
      "degree": "Information Security",
      "gpa": "5.0"
    }
  ],
  "skills": ["JavaScript", "HTML", "CSS", "React"],
  "languages": ["Azerbaijani", "English", "Russian"],
  "profile": "Experienced web developer with 3+ years of experience building modern web applications.",
  "experience": [
    {
      "company": "Tech Solutions Inc.",
      "title": "Frontend Developer",
      "responsibilities": [
        "Developed responsive web applications",
        "Implemented new features",
        "Fixed bugs and optimized performance"
      ]
    }
  ],
  "references": [
    {
      "name": "John Smith",
      "position": "Senior Developer",
      "phone": "+994551112233",
      "email": "john@example.com"
    }
  ]
};

function initResume() {
  const savedData = localStorage.getItem('resumeData');
  if (savedData) {
    data = JSON.parse(savedData);
  }
  updateUIFromData();
  setupValidation();
  
  // Profile picture upload handler
  document.getElementById('image-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        data.profilePic = event.target.result;
        elements.profilePic.src = event.target.result;
        saveData();
      };
      reader.readAsDataURL(file);
    }
  });
}

function loadFromJSON() {
  fetch('data.json')
    .then(response => {
      if (!response.ok) throw new Error('Network error');
      return response.json();
    })
    .then(jsonData => {
      data = jsonData;
      updateUIFromData();
      alert("Data loaded successfully from JSON!");
    })
    .catch(error => {
      console.error('Error loading JSON:', error);
      if (confirm("Failed to load data.json. Load sample data instead?")) {
        loadSampleData();
      }
    });
}

function loadSampleData() {
  data = JSON.parse(JSON.stringify(sampleJSONData));
  updateUIFromData();
}

function updateUIFromData() {
  elements.profilePic.src = data.profilePic;
  elements.name.value = data.name;
  elements.title.value = data.title;
  elements.phone.value = data.contact[0] || '';
  elements.email.value = data.contact[1] || '';
  elements.address.value = data.contact[2] || '';
  elements.website.value = data.contact[3] || '';
  elements.profile.value = data.profile;

  renderEducation();
  renderSkills();
  renderLanguages();
  renderExperience();
  renderReferences();
}

function exportToPDF() {
  if (typeof html2pdf === 'undefined') {
    alert('PDF export library not loaded. Please try again later.');
    return;
  }

  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => btn.style.visibility = 'hidden');

  const element = document.getElementById('resume');
  const opt = {
    margin: 10,
    filename: 'resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save().then(() => {
    buttons.forEach(btn => btn.style.visibility = 'visible');
  });
}

// Original functions (keep all these exactly as they were)
function renderEducation() {
  elements.education.innerHTML = data.education.map((e, index) => `
    <div class="education-item text-small">
      <div class="view-mode">${e.years || 'Years not specified'}</div>
      <div class="edit-mode form-group">
        <input type="text" class="years" value="${e.years}" placeholder="Years (e.g., 2020-2024)" required>
        <span class="error-message"></span>
      </div>
      
      <div class="view-mode">${e.school || 'School not specified'}</div>
      <div class="edit-mode form-group">
        <input type="text" class="school" value="${e.school}" placeholder="School/University" required>
        <span class="error-message"></span>
      </div>
      
      <div class="view-mode">${e.degree || 'Degree not specified'}</div>
      <div class="edit-mode form-group">
        <input type="text" class="degree" value="${e.degree}" placeholder="Degree" required>
        <span class="error-message"></span>
      </div>
      
      <div class="view-mode">${e.gpa ? 'GPA: ' + e.gpa : ''}</div>
      <div class="edit-mode form-group">
        <input type="text" class="gpa" value="${e.gpa || ''}" placeholder="GPA (optional)">
        <span class="error-message"></span>
      </div>
      
      <div class="edit-mode">
        <button class="delete-btn" onclick="deleteEducation(${index})">Delete</button>
      </div>
    </div>
  `).join('');
}

function renderSkills() {
  elements.skills.innerHTML = data.skills.map((s, index) => `
    <div class="skill-item">
      <div class="view-mode">${s || 'Skill not specified'}</div>
      <div class="edit-mode">
        <input type="text" class="skill-input" value="${s}" required>
        <span class="error-message"></span>
        <button class="delete-btn" onclick="deleteSkill(${index})">Delete</button>
      </div>
    </div>
  `).join('');
}

function renderLanguages() {
  elements.languages.innerHTML = data.languages.map((l, index) => `
    <div class="language-item text-small">
      <div class="view-mode">${l || 'Language not specified'}</div>
      <div class="edit-mode">
        <input type="text" class="language-input" value="${l}" required>
        <span class="error-message"></span>
        <button class="delete-btn" onclick="deleteLanguage(${index})">Delete</button>
      </div>
    </div>
  `).join('');
}

function renderExperience() {
  elements.experience.innerHTML = data.experience.map((exp, index) => `
    <div class="experience-item text-small">
      <div class="view-mode"><strong>${exp.company || 'Company not specified'}</strong></div>
      <div class="edit-mode form-group">
        <input type="text" class="company" value="${exp.company}" placeholder="Company" required>
        <span class="error-message"></span>
      </div>
      
      <div class="view-mode">${exp.title || 'Title not specified'}</div>
      <div class="edit-mode form-group">
        <input type="text" class="job-title" value="${exp.title}" placeholder="Job Title" required>
        <span class="error-message"></span>
      </div>
      
      <div class="view-mode">
        ${exp.responsibilities.length > 0 ? 
          '<ul>' + exp.responsibilities.map(r => `<li>${r || 'Responsibility not specified'}</li>`).join('') + '</ul>' : 
          'No responsibilities specified'}
      </div>
      <div class="edit-mode responsibilities">
        ${exp.responsibilities.map((r, i) => `
          <div class="form-group responsibility">
            <input type="text" value="${r}" placeholder="Responsibility" required>
            <button class="delete-btn" onclick="deleteResponsibility(${index}, ${i})">Delete</button>
          </div>
        `).join('')}
      </div>
      
      <div class="edit-mode">
        <button onclick="addResponsibility(${index})">Add Responsibility</button>
        <button class="delete-btn" onclick="deleteExperience(${index})">Delete Experience</button>
      </div>
    </div>
  `).join('');
}

function renderReferences() {
  elements.references.innerHTML = data.references.map((ref, index) => `
    <div class="reference-item text-small">
      <div class="view-mode"><strong>${ref.name || 'Name not specified'}</strong></div>
      <div class="edit-mode form-group">
        <input type="text" class="ref-name" value="${ref.name}" placeholder="Name" required>
        <span class="error-message"></span>
      </div>
      
      <div class="view-mode">${ref.position || 'Position not specified'}</div>
      <div class="edit-mode form-group">
        <input type="text" class="ref-position" value="${ref.position}" placeholder="Position" required>
        <span class="error-message"></span>
      </div>
      
      <div class="view-mode">${ref.phone || 'Phone not specified'}</div>
      <div class="edit-mode form-group">
        <input type="tel" class="ref-phone" value="${ref.phone}" placeholder="Phone" required>
        <span class="error-message"></span>
      </div>
      
      <div class="view-mode">${ref.email || 'Email not specified'}</div>
      <div class="edit-mode form-group">
        <input type="email" class="ref-email" value="${ref.email}" placeholder="Email" required>
        <span class="error-message"></span>
      </div>
      
      <div class="edit-mode">
        <button class="delete-btn" onclick="deleteReference(${index})">Delete</button>
      </div>
    </div>
  `).join('');
}

function editSection(sectionId, event) {
  event.stopPropagation();
  const section = document.getElementById(sectionId);
  section.classList.toggle('editing');
  
  if (!section.classList.contains('editing')) {
    saveData();
  }
}

function addEducation() {
  data.education.push({
    years: "",
    school: "",
    degree: "",
    gpa: ""
  });
  renderEducation();
  document.getElementById('education').classList.add('editing');
}

function deleteEducation(index) {
  data.education.splice(index, 1);
  renderEducation();
}

function addSkill() {
  data.skills.push("");
  renderSkills();
  document.getElementById('skills').classList.add('editing');
}

function deleteSkill(index) {
  data.skills.splice(index, 1);
  renderSkills();
}

function addLanguage() {
  data.languages.push("");
  renderLanguages();
  document.getElementById('languages').classList.add('editing');
}

function deleteLanguage(index) {
  data.languages.splice(index, 1);
  renderLanguages();
}

function addExperience() {
  data.experience.push({
    company: "",
    title: "",
    responsibilities: []
  });
  renderExperience();
  document.getElementById('experience').classList.add('editing');
}

function deleteExperience(index) {
  data.experience.splice(index, 1);
  renderExperience();
}

function addResponsibility(expIndex) {
  data.experience[expIndex].responsibilities.push("");
  renderExperience();
}

function deleteResponsibility(expIndex, respIndex) {
  data.experience[expIndex].responsibilities.splice(respIndex, 1);
  renderExperience();
}

function addReference() {
  data.references.push({
    name: "",
    position: "",
    phone: "",
    email: ""
  });
  renderReferences();
  document.getElementById('references').classList.add('editing');
}

function deleteReference(index) {
  data.references.splice(index, 1);
  renderReferences();
}

function toggleSection(header) {
  const dropdown = header.parentElement;
  dropdown.classList.toggle("open");
}

function saveData() {
  if (!validateForm()) {
    alert("Please fix all validation errors before saving.");
    return;
  }

  data.name = elements.name.value;
  data.title = elements.title.value;
  data.contact = [
    elements.phone.value,
    elements.email.value,
    elements.address.value,
    elements.website.value
  ];
  data.profile = elements.profile.value;

  data.education = Array.from(document.querySelectorAll('.education-item')).map(item => ({
    years: item.querySelector('.years')?.value || '',
    school: item.querySelector('.school')?.value || '',
    degree: item.querySelector('.degree')?.value || '',
    gpa: item.querySelector('.gpa')?.value || ''
  }));

  data.skills = Array.from(document.querySelectorAll('.skill-input')).map(input => input.value);

  data.languages = Array.from(document.querySelectorAll('.language-input')).map(input => input.value);

  data.experience = Array.from(document.querySelectorAll('.experience-item')).map(item => ({
    company: item.querySelector('.company')?.value || '',
    title: item.querySelector('.job-title')?.value || '',
    responsibilities: Array.from(item.querySelectorAll('.responsibility input')).map(input => input.value)
  }));

  data.references = Array.from(document.querySelectorAll('.reference-item')).map(item => ({
    name: item.querySelector('.ref-name')?.value || '',
    position: item.querySelector('.ref-position')?.value || '',
    phone: item.querySelector('.ref-phone')?.value || '',
    email: item.querySelector('.ref-email')?.value || ''
  }));

  localStorage.setItem('resumeData', JSON.stringify(data));
  alert("Resume saved successfully!");
}

function resetData() {
  if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
    localStorage.removeItem('resumeData');
    data = {
      profilePic: "https://i.pinimg.com/originals/04/64/6b/04646bc6ef384e1c564b25df6ef17291.jpg",
      name: "",
      title: "",
      contact: [],
      education: [],
      skills: [],
      languages: [],
      profile: "",
      experience: [],
      references: []
    };
    updateUIFromData();
  }
}

function validateForm() {
  let isValid = true;

  const requiredFields = [
    elements.name, 
    elements.title, 
    elements.phone, 
    elements.email, 
    elements.address, 
    elements.website, 
    elements.profile
  ];

  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      showError(field, "This field is required");
      isValid = false;
    } else if (field.type === 'email' && !validationPatterns.email.test(field.value)) {
      showError(field, "Please enter a valid email address");
      isValid = false;
    } else if (field.type === 'tel' && !validationPatterns.phone.test(field.value)) {
      showError(field, "Please enter a valid phone number");
      isValid = false;
    } else if (field.type === 'url' && !validationPatterns.url.test(field.value)) {
      showError(field, "Please enter a valid website URL");
      isValid = false;
    } else {
      clearError(field);
    }
  });

  document.querySelectorAll('.education-item').forEach((item, index) => {
    const years = item.querySelector('.years');
    const school = item.querySelector('.school');
    const degree = item.querySelector('.degree');

    if (years && !years.value.trim()) {
      showError(years, "Years are required");
      isValid = false;
    } else if (years && !validationPatterns.yearRange.test(years.value)) {
      showError(years, "Format: YYYY-YYYY");
      isValid = false;
    } else if (years) {
      clearError(years);
    }

    if (school && !school.value.trim()) {
      showError(school, "School is required");
      isValid = false;
    } else if (school) {
      clearError(school);
    }

    if (degree && !degree.value.trim()) {
      showError(degree, "Degree is required");
      isValid = false;
    } else if (degree) {
      clearError(degree);
    }
  });

  document.querySelectorAll('.skill-input').forEach(skill => {
    if (!skill.value.trim()) {
      showError(skill, "Skill cannot be empty");
      isValid = false;
    } else {
      clearError(skill);
    }
  });

  document.querySelectorAll('.language-input').forEach(lang => {
    if (!lang.value.trim()) {
      showError(lang, "Language cannot be empty");
      isValid = false;
    } else {
      clearError(lang);
    }
  });

  document.querySelectorAll('.experience-item').forEach(exp => {
    const company = exp.querySelector('.company');
    const title = exp.querySelector('.job-title');

    if (company && !company.value.trim()) {
      showError(company, "Company is required");
      isValid = false;
    } else if (company) {
      clearError(company);
    }

    if (title && !title.value.trim()) {
      showError(title, "Job title is required");
      isValid = false;
    } else if (title) {
      clearError(title);
    }

    exp.querySelectorAll('.responsibility input').forEach(resp => {
      if (!resp.value.trim()) {
        showError(resp, "Responsibility cannot be empty");
        isValid = false;
      } else {
        clearError(resp);
      }
    });
  });

  document.querySelectorAll('.reference-item').forEach(ref => {
    const name = ref.querySelector('.ref-name');
    const position = ref.querySelector('.ref-position');
    const phone = ref.querySelector('.ref-phone');
    const email = ref.querySelector('.ref-email');

    if (name && !name.value.trim()) {
      showError(name, "Name is required");
      isValid = false;
    } else if (name) {
      clearError(name);
    }

    if (position && !position.value.trim()) {
      showError(position, "Position is required");
      isValid = false;
    } else if (position) {
      clearError(position);
    }

    if (phone && !phone.value.trim()) {
      showError(phone, "Phone is required");
      isValid = false;
    } else if (phone && !validationPatterns.phone.test(phone.value)) {
      showError(phone, "Please enter a valid phone number");
      isValid = false;
    } else if (phone) {
      clearError(phone);
    }

    if (email && !email.value.trim()) {
      showError(email, "Email is required");
      isValid = false;
    } else if (email && !validationPatterns.email.test(email.value)) {
      showError(email, "Please enter a valid email address");
      isValid = false;
    } else if (email) {
      clearError(email);
    }
  });

  return isValid;
}

function showError(field, message) {
  const errorElement = field.nextElementSibling;
  if (errorElement && errorElement.classList.contains('error-message')) {
    errorElement.textContent = message;
    field.classList.add('invalid');
  }
}

function clearError(field) {
  const errorElement = field.nextElementSibling;
  if (errorElement && errorElement.classList.contains('error-message')) {
    errorElement.textContent = '';
    field.classList.remove('invalid');
  }
}

function setupValidation() {
  elements.email.addEventListener('input', () => {
    if (!validationPatterns.email.test(elements.email.value)) {
      showError(elements.email, "Please enter a valid email address");
    } else {
      clearError(elements.email);
    }
  });

  elements.phone.addEventListener('input', () => {
    if (!validationPatterns.phone.test(elements.phone.value)) {
      showError(elements.phone, "Please enter a valid phone number");
    } else {
      clearError(elements.phone);
    }
  });

  elements.website.addEventListener('input', () => {
    if (!validationPatterns.url.test(elements.website.value)) {
      showError(elements.website, "Please enter a valid website URL");
    } else {
      clearError(elements.website);
    }
  });

  document.addEventListener('input', (e) => {
    if (e.target.classList.contains('years')) {
      if (!validationPatterns.yearRange.test(e.target.value)) {
        showError(e.target, "Format: YYYY-YYYY");
      } else {
        clearError(e.target);
      }
    }
  });
}

window.onload = initResume;
