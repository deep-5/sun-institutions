/**
 * SUN GROUP OF INSTITUTIONS - MASTER CLIENT SCRIPT (assets/js/app.js)
 * Clean, modern vanilla JavaScript for high performance, smooth interactions, and global search.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initHeroSlider();
  initModals();
  initGlobalSearch();
  initAdmissionsWizard();
  initExamPortal();
});

/* ==========================================================================
   Header Scroll State
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-backdrop');
  const closeBtn = document.querySelector('.mobile-close-btn');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   Hero Slider (Interactive & Touch-friendly with Local HD Assets)
   ========================================================================== */
const heroSlides = [
  {
    tag: 'SUN GROUP OF INSTITUTIONS',
    title: 'Build Your Career in <span class="pink">Agriculture</span>',
    desc: 'Learn beyond the classroom with practical education, modern facilities and career-focused training.',
    img: 'assets/images/original/hero_students.jpg',
    alt: 'SUN Group of Institutions students on campus'
  },
  {
    tag: 'SCIENCE & TECHNOLOGY • NTR UNIVERSITY',
    title: 'Modern Computing & <span class="pink">Innovation</span>',
    desc: 'BCA, B.Sc Computer Science, BBA & B.Com programs with high-performance computer laboratories and corporate placement support.',
    img: 'assets/images/original/inst_science_tech.jpg',
    alt: 'Sun Institute of Science & Technology Campus'
  },
  {
    tag: 'PHYSIOTHERAPY & HEALTHCARE • Dr. NTRUHS',
    title: 'Hands-on Clinical <span class="pink">Excellence</span>',
    desc: 'BPT & MPT clinical training with 500+ bed hospital postings, advanced biomechanics labs, and patient rehabilitation mastery.',
    img: 'assets/images/original/inst_physiotherapy.jpg',
    alt: 'Sun College of Physiotherapy Clinical Training'
  },
  {
    tag: 'AGRICULTURAL SCIENCES • ISO 9001:2008',
    title: 'Cultivating the <span class="pink">Future</span> of Farming',
    desc: 'B.Sc (Hons) Agriculture with 50-acre live experimental crop farm lands, modern agritech labs, and agribusiness job linkages.',
    img: 'assets/images/original/inst_agri_sciences.jpg',
    alt: 'Sun Institute of Agricultural Sciences Research Farm'
  }
];

// Preload hero slide images immediately into browser cache
if (typeof window !== 'undefined') {
  heroSlides.forEach(slide => {
    const preImg = new Image();
    preImg.src = slide.img;
  });
}

let currentSlideIdx = 0;
let slideInterval = null;

function initHeroSlider() {
  const headingEl = document.querySelector('.hero-headline') || document.querySelector('.hero-heading');
  const descEl = document.querySelector('.hero-subparagraph') || document.querySelector('.hero-lead-text');
  const superTagEl = document.querySelector('.hero-tagline') || document.querySelector('.hero-super-tag');
  const imgEl = document.querySelector('.hero-bg-img') || document.querySelector('.hero-composite-img') || document.querySelector('.hero-main-img');
  const dotBtns = document.querySelectorAll('.hero-dot');

  if (!headingEl || !imgEl) return;

  let isTransitioning = false;

  function updateDots(idx) {
    if (!dotBtns || dotBtns.length === 0) return;
    dotBtns.forEach((dot, dIdx) => {
      if (dIdx === idx) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('active');
        dot.removeAttribute('aria-current');
      }
    });
  }

  function renderSlide(idx) {
    if (isTransitioning) return;
    isTransitioning = true;

    const slide = heroSlides[idx];
    
    // Smooth crossfade transition
    imgEl.style.opacity = '0.35';
    headingEl.style.opacity = '0.6';

    setTimeout(() => {
      if (superTagEl) superTagEl.textContent = slide.tag;
      headingEl.innerHTML = slide.title;
      if (descEl) descEl.textContent = slide.desc;
      imgEl.src = slide.img;
      imgEl.alt = slide.alt;

      updateDots(idx);

      imgEl.style.opacity = '1';
      headingEl.style.opacity = '1';
      isTransitioning = false;
    }, 180);
  }

  function nextSlide() {
    currentSlideIdx = (currentSlideIdx + 1) % heroSlides.length;
    renderSlide(currentSlideIdx);
  }

  function prevSlide() {
    currentSlideIdx = (currentSlideIdx - 1 + heroSlides.length) % heroSlides.length;
    renderSlide(currentSlideIdx);
  }

  function startAutoScroll() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(() => {
      nextSlide();
    }, 4500);
  }

  function resetTimer() {
    startAutoScroll();
  }

  // Dot navigation click handlers
  if (dotBtns && dotBtns.length > 0) {
    dotBtns.forEach((dot, dotIdx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentSlideIdx !== dotIdx) {
          currentSlideIdx = dotIdx;
          renderSlide(currentSlideIdx);
          resetTimer();
        }
      });
    });
  }

  // Touch Swipe support for mobile devices
  const heroWrapper = document.querySelector('.hero-wrapper');
  if (heroWrapper) {
    let touchStartX = 0;
    let touchEndX = 0;

    heroWrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroWrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 45) {
        nextSlide();
        resetTimer();
      } else if (touchEndX - touchStartX > 45) {
        prevSlide();
        resetTimer();
      }
    }, { passive: true });
  }

  // Initial render & launch continuous auto-scroll
  updateDots(0);
  startAutoScroll();
}

/* ==========================================================================
   Modals Management (Admissions, Search, Dialogs)
   ========================================================================== */
function initModals() {
  document.querySelectorAll('[data-modal-target]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      openModal(targetId);
    });
  });

  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = btn.closest('.modal-backdrop');
      if (modal) closeModal(modal);
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModalEl = document.querySelector('.modal-backdrop.active');
      if (openModalEl) closeModal(openModalEl);
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (modalId === 'search-modal') {
    const input = modal.querySelector('.search-main-input');
    if (input) {
      setTimeout(() => input.focus(), 80);
    }
  }
}

function closeModal(modal) {
  if (typeof modal === 'string') modal = document.getElementById(modal);
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==========================================================================
   Global Search Modal & Search Index
   ========================================================================== */
const searchDatabase = [
  { title: 'Sun Institute of Science & Technology', subtitle: 'Affiliated to NTR University • BCA, B.Sc, BBA, B.Com', category: 'Institutions', icon: '🔬', url: 'institutions/science-and-technology.html' },
  { title: 'Sun College of Physiotherapy', subtitle: 'Affiliated to Dr. NTRUHS • Bachelor of Physiotherapy (BPT)', category: 'Institutions', icon: '🩺', url: 'institutions/physiotherapy.html' },
  { title: 'SUN Institute of Allied Health Sciences', subtitle: 'AP Paramedical Board • B.Sc MLT, Radiology, OT Tech', category: 'Institutions', icon: '🏥', url: 'institutions/allied-health-sciences.html' },
  { title: 'Sun Institute of Agricultural Sciences', subtitle: 'Estd. 2016 • ISO 9001:2008 • 50-Acre Experimental Farms', category: 'Institutions', icon: '🌱', url: 'institutions/agricultural-sciences.html' },
  { title: 'Institutions Hub Directory', subtitle: 'Explore all 4 constituent colleges under SUN Group', category: 'Institutions', icon: '🏛️', url: 'institutions.html' },
  { title: 'BCA (Bachelor of Computer Applications)', subtitle: '3-Year Program • Full Stack, Cloud, AI & Python', category: 'Programs', icon: '💻', url: 'academics.html' },
  { title: 'B.Sc Computer Science, Mathematics, Electronics', subtitle: '3-Year Degree • NTR University Affiliation', category: 'Programs', icon: '📐', url: 'academics.html' },
  { title: 'BBA & B.Com Computer Applications', subtitle: '3-Year Degree • Corporate Finance, ERP & Marketing', category: 'Programs', icon: '📊', url: 'academics.html' },
  { title: 'BPT (Bachelor of Physiotherapy)', subtitle: '4.5-Year Clinical Degree + 6 Months Hospital Internship', category: 'Programs', icon: '🩺', url: 'institutions/physiotherapy.html' },
  { title: 'MPT (Master of Physiotherapy)', subtitle: '2-Year PG Specializations in Orthopedics & Neuro-rehab', category: 'Programs', icon: '🧑‍⚕️', url: 'institutions/physiotherapy.html' },
  { title: 'B.Sc Medical Laboratory Technology (BMLT)', subtitle: '3-Year Paramedical Degree with Clinical Biochemistry', category: 'Programs', icon: '🔬', url: 'institutions/allied-health-sciences.html' },
  { title: 'B.Sc (Hons) Agriculture', subtitle: '4-Year Professional Degree with Field Practicum & ICAR Norms', category: 'Programs', icon: '🌾', url: 'institutions/agricultural-sciences.html' },
  { title: 'Diploma in Agriculture (2 Years)', subtitle: 'Practical Seed Technology, Agronomy & Soil Science', category: 'Programs', icon: '🌱', url: 'institutions/agricultural-sciences.html' },
  { title: 'Admissions 2026-27 Application Process', subtitle: 'Step-by-step roadmap, eligibility criteria & online form', category: 'Admissions', icon: '📝', url: 'admissions.html' },
  { title: 'Fee Schedule & Merit Scholarships', subtitle: 'Transparent annual fee structures and government aid', category: 'Admissions', icon: '💳', url: 'admissions.html#fees' },
  { title: 'Entrance Examination Guidelines (AP ICET, AP EAPCET, NEET)', subtitle: 'Cutoff ranks and counseling code details', category: 'Admissions', icon: '📋', url: 'admissions.html#eligibility' },
  { title: 'Semester Examination Results Portal', subtitle: 'Look up SGPA, grades and download provisional marks memo', category: 'Examinations', icon: '🎓', url: 'examinations.html' },
  { title: 'Hall Ticket & Admit Card Download Simulator', subtitle: 'Print verified hall ticket for university semester exams', category: 'Examinations', icon: '🎫', url: 'examinations.html#hallticket' },
  { title: 'University Examination Timetable 2026', subtitle: 'Dr. NTRUHS & NTR University semester schedules', category: 'Examinations', icon: '📅', url: 'examinations.html#timetable' },
  { title: 'Placements & Recruiter Directory', subtitle: 'Apollo, Dr. Reddy\'s, TCS, Syngenta, Bayer & 100+ Partners', category: 'Placements', icon: '💼', url: 'placements.html' },
  { title: '50-Acre Agricultural Demonstration Farms', subtitle: 'Live agronomy trials, polyhouses & seed testing stations', category: 'Research', icon: '🚜', url: 'research.html' },
  { title: 'Clinical Physiotherapy Research & Case Studies', subtitle: 'Spinal rehabilitation & athletic injury clinical research', category: 'Research', icon: '📑', url: 'research.html#clinical' },
  { title: 'Campus Life, Hostels & Hospital Tie-Ups', subtitle: '500+ Bed hospital rotations, sports arenas & tech labs', category: 'Campus Life', icon: '🏢', url: 'campus-life.html' },
  { title: 'Contact Directory & Grievance Redressal Desk', subtitle: 'Institution contacts, Visakhapatnam campus map & helpline', category: 'Contact', icon: '📞', url: 'contact.html' }
];

function initGlobalSearch() {
  const searchInput = document.getElementById('global-search-input');
  const resultsContainer = document.getElementById('global-search-results');
  const tagChips = document.querySelectorAll('.search-tag-chip');

  if (!searchInput || !resultsContainer) return;

  function renderSearchResults(query = '', filterCategory = 'All') {
    const q = query.trim().toLowerCase();
    let matches = searchDatabase.filter(item => {
      const matchCat = filterCategory === 'All' || item.category.toLowerCase() === filterCategory.toLowerCase();
      const matchQuery = !q || item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-empty-state">
          <p style="font-size:1.5rem; margin-bottom:8px;">🔍</p>
          <p><strong>No results found</strong> for "${query}"</p>
          <p style="font-size:0.8125rem; color:#9ca3af; margin-top:4px;">Try searching for "BCA", "Physiotherapy", "Agriculture", "Admissions", or "Results".</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = matches.map(item => `
      <a href="${item.url}" class="search-result-item">
        <div class="search-item-left">
          <div class="search-item-icon">${item.icon}</div>
          <div>
            <div class="search-item-title">${item.title}</div>
            <div class="search-item-subtitle">${item.subtitle}</div>
          </div>
        </div>
        <span class="search-item-badge">${item.category}</span>
      </a>
    `).join('');
  }

  renderSearchResults();

  searchInput.addEventListener('input', (e) => {
    renderSearchResults(e.target.value);
  });

  tagChips.forEach(chip => {
    chip.addEventListener('click', () => {
      tagChips.forEach(c => c.style.borderColor = '');
      chip.style.borderColor = 'var(--color-pink)';
      const cat = chip.getAttribute('data-search-cat') || 'All';
      renderSearchResults(searchInput.value, cat);
    });
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openModal('search-modal');
    } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      openModal('search-modal');
    }
  });
}

/* ==========================================================================
   Admissions Wizard & Application Generator
   ========================================================================== */
function initAdmissionsWizard() {
  const form = document.getElementById('admissions-apply-form');
  if (!form) return;

  const institutionSelect = document.getElementById('wizard-inst-select');
  const courseSelect = document.getElementById('wizard-course-select');

  const coursesByInst = {
    'science-and-tech': [
      'B.Sc Computer Science',
      'B.Sc Mathematics, Electronics, CS',
      'BCA (Bachelor of Computer Applications)',
      'BBA (Bachelor of Business Administration)',
      'B.Com (Computer Applications & Finance)'
    ],
    'physiotherapy': [
      'BPT (Bachelor of Physiotherapy - 4.5 Years with Internship)',
      'MPT (Master of Physiotherapy - Orthopedics / Neurology)'
    ],
    'allied-health': [
      'B.Sc Medical Laboratory Technology (BMLT)',
      'B.Sc Radiography & Imaging Technology',
      'B.Sc Operation Theatre & Anesthesia Technology',
      'Diploma in Medical Lab Technology (DMLT)'
    ],
    'agri-sciences': [
      'B.Sc (Hons) Agriculture (4 Years - ICAR / ANGRAU Norms)',
      'Diploma in Agriculture'
    ]
  };

  if (institutionSelect && courseSelect) {
    institutionSelect.addEventListener('change', () => {
      const selectedInst = institutionSelect.value;
      courseSelect.innerHTML = '<option value="">Select Target Program</option>';
      if (coursesByInst[selectedInst]) {
        coursesByInst[selectedInst].forEach(course => {
          const opt = document.createElement('option');
          opt.value = course;
          opt.textContent = course;
          courseSelect.appendChild(opt);
        });
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="full_name"]').value;
    const email = form.querySelector('[name="email"]').value;
    const phone = form.querySelector('[name="phone"]').value;
    const inst = institutionSelect.options[institutionSelect.selectedIndex].text;
    const course = courseSelect.value;
    const appRef = 'SUN-' + Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });

    const slipContainer = document.getElementById('admission-slip-content');
    if (slipContainer) {
      slipContainer.innerHTML = `
        <div id="printable-admission-slip" style="padding:20px; border:2px dashed #0f7a3b; border-radius:12px; background:#f9fafb; font-family:'Poppins',sans-serif;">
          <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid #0f7a3b; padding-bottom:12px; margin-bottom:16px;">
            <div>
              <h3 style="color:#0f7a3b; font-size:1.2rem; font-weight:800; margin:0;">SUN GROUP OF INSTITUTIONS</h3>
              <p style="font-size:0.75rem; color:#6b7280; margin:2px 0 0;">ADMISSIONS OFFICE • ACADEMIC YEAR 2026-27</p>
            </div>
            <div style="text-align:right;">
              <span style="background:#ff38bd; color:#fff; font-size:0.75rem; padding:4px 10px; border-radius:4px; font-weight:700;">PROVISIONAL SLIP</span>
              <p style="font-size:0.8rem; font-weight:700; color:#111827; margin:4px 0 0;">Ref: ${appRef}</p>
            </div>
          </div>
          
          <table style="width:100%; font-size:0.875rem; border-collapse:collapse; margin-bottom:16px;">
            <tr><td style="padding:6px 0; color:#4b5563;"><strong>Candidate Name:</strong></td><td style="padding:6px 0; color:#111827; font-weight:600;">${name}</td></tr>
            <tr><td style="padding:6px 0; color:#4b5563;"><strong>Contact Phone:</strong></td><td style="padding:6px 0; color:#111827;">${phone}</td></tr>
            <tr><td style="padding:6px 0; color:#4b5563;"><strong>Registered Email:</strong></td><td style="padding:6px 0; color:#111827;">${email}</td></tr>
            <tr><td style="padding:6px 0; color:#4b5563;"><strong>Institution:</strong></td><td style="padding:6px 0; color:#0f7a3b; font-weight:600;">${inst}</td></tr>
            <tr><td style="padding:6px 0; color:#4b5563;"><strong>Program Applied:</strong></td><td style="padding:6px 0; color:#ff38bd; font-weight:700;">${course}</td></tr>
            <tr><td style="padding:6px 0; color:#4b5563;"><strong>Application Date:</strong></td><td style="padding:6px 0; color:#111827;">${dateStr}</td></tr>
          </table>

          <div style="background:#eaf7ef; padding:10px 14px; border-radius:6px; font-size:0.8rem; color:#0f7a3b; line-height:1.4; margin-bottom:14px;">
            ✓ <strong>Next Steps:</strong> Our Admissions Counselor will contact you within 24 hours. Please bring this slip and 10th/12th marksheets for certificate verification at the Visakhapatnam central campus.
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <button onclick="window.print()" class="btn btn-green btn-sm" style="cursor:pointer;">🖨️ Print Slip</button>
            <span style="font-size:0.75rem; color:#6b7280;">Helpline: +91 891 278 9400</span>
          </div>
        </div>
      `;
    }

    form.style.display = 'none';
    const slipWrap = document.getElementById('admissions-slip-wrap');
    if (slipWrap) slipWrap.style.display = 'block';

    showToast('Application submitted successfully! Reference: ' + appRef);
  });
}

/* ==========================================================================
   Examinations Hall Ticket & Result Search Portal
   ========================================================================== */
function initExamPortal() {
  const resultForm = document.getElementById('exam-result-search-form');
  if (!resultForm) return;

  resultForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const regNo = resultForm.querySelector('[name="reg_number"]').value.trim();
    const resultBox = document.getElementById('exam-result-display');
    if (!resultBox) return;

    if (!regNo) {
      showToast('Please enter a valid Registration / Roll Number.');
      return;
    }

    resultBox.innerHTML = `
      <div style="margin-top:20px; padding:18px; border-radius:8px; background:#fff; border:1px solid #e5e7eb; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e5e7eb; padding-bottom:10px; margin-bottom:12px;">
          <div>
            <h4 style="color:#0f7a3b; font-weight:700; margin:0;">SEMESTER EXAMINATION RESULTS</h4>
            <p style="font-size:0.8rem; color:#6b7280; margin:2px 0 0;">Reg No: <strong style="color:#111827;">${regNo}</strong> | Academic Year: 2025-26</p>
          </div>
          <span style="background:#dcfce7; color:#15803d; font-weight:700; font-size:0.8rem; padding:4px 10px; border-radius:4px;">STATUS: PASSED</span>
        </div>

        <table class="styled-table" style="font-size:0.8125rem;">
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Title</th>
              <th>Credits</th>
              <th>Grade</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SUN-101</td>
              <td>Core Foundations & Theory</td>
              <td>4</td>
              <td><strong>A+</strong></td>
              <td><span style="color:#15803d; font-weight:600;">PASS</span></td>
            </tr>
            <tr>
              <td>SUN-102</td>
              <td>Practical & Laboratory Clinicals</td>
              <td>3</td>
              <td><strong>O (Outstanding)</strong></td>
              <td><span style="color:#15803d; font-weight:600;">PASS</span></td>
            </tr>
            <tr>
              <td>SUN-103</td>
              <td>Applied Research & Field Study</td>
              <td>4</td>
              <td><strong>A</strong></td>
              <td><span style="color:#15803d; font-weight:600;">PASS</span></td>
            </tr>
          </tbody>
          <tfoot>
            <tr style="background:#f9fafb; font-weight:700;">
              <td colspan="3">Semester SGPA: 8.85 / 10.00</td>
              <td colspan="2" style="text-align:right; color:#0f7a3b;">PROMOTED TO NEXT SEMESTER</td>
            </tr>
          </tfoot>
        </table>

        <div style="text-align:right; margin-top:12px;">
          <button onclick="window.print()" class="btn btn-outline-pink btn-sm">Download Provisional Memo (PDF)</button>
        </div>
      </div>
    `;

    showToast('Result memo retrieved for ' + regNo);
  });
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✨</span> <div>${message}</div>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
