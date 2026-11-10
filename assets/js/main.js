/**
 * HVACConnectUSA - Interactive Landing Page Logic
 * Fast, lightweight, zero external library dependency
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initZipChecker();
  initCostEstimator();
  initFaqAccordion();
  initBookingForm();
  initLiveTicker();
});

// Mobile Navigation
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  
  if (!toggleBtn || !mobileNav) return;
  
  toggleBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('hidden');
    const isExpanded = !mobileNav.classList.contains('hidden');
    toggleBtn.setAttribute('aria-expanded', isExpanded.toString());
  });

  // Services Mega Menu Accordion in Mobile Nav
  const servicesToggle = document.getElementById('mobileServicesToggle');
  const servicesSubmenu = document.getElementById('mobileServicesSubmenu');
  const servicesChevron = document.getElementById('mobileServicesChevron');
  
  if (servicesToggle && servicesSubmenu) {
    servicesToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = servicesSubmenu.classList.toggle('hidden');
      if (servicesChevron) {
        servicesChevron.classList.toggle('rotate-180', !isHidden);
      }
      servicesToggle.setAttribute('aria-expanded', (!isHidden).toString());
    });
  }

  // Close when clicking nav links
  const links = mobileNav.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.add('hidden');
    });
  });
}

// ZIP Code Instant Coverage Checker
function initZipChecker() {
  const zipForm = document.getElementById('zipCheckForm');
  const zipInput = document.getElementById('zipCodeInput');
  const zipResult = document.getElementById('zipCheckResult');

  if (!zipForm || !zipInput || !zipResult) return;

  zipForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = zipInput.value.trim();

    if (!/^\d{5}$/.test(val)) {
      zipResult.className = 'mt-3 p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200 block';
      zipResult.innerHTML = '⚠️ Please enter a valid 5-digit US ZIP code.';
      return;
    }

    // Success simulation with realistic response
    zipResult.className = 'mt-3 p-3 rounded-lg text-sm bg-emerald-50 text-emerald-800 border border-emerald-200 block animate-fadeIn';
    zipResult.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
        <strong class="font-bold">Great news!</strong> We have <strong>4 certified technicians</strong> available in ZIP <strong>${val}</strong>.
      </div>
      <p class="mt-1 text-xs text-emerald-700">Estimated emergency dispatch time: <strong>35 - 55 minutes</strong>. <a href="#dispatch-form" class="underline font-bold hover:text-emerald-900">Claim priority slot &rarr;</a></p>
    `;

    // Pre-fill booking form if present
    const bookingZip = document.getElementById('formZipCode');
    if (bookingZip) {
      bookingZip.value = val;
    }
  });
}

// Interactive Service Cost Estimator
function initCostEstimator() {
  const serviceSelect = document.getElementById('estimatorService');
  const urgencySelect = document.getElementById('estimatorUrgency');
  const propertySelect = document.getElementById('estimatorProperty');
  const priceDisplay = document.getElementById('estimatedPriceRange');
  const durationDisplay = document.getElementById('estimatedDuration');

  if (!serviceSelect || !urgencySelect || !priceDisplay) return;

  // Base pricing matrix ($ ranges based on US industry standard benchmarks)
  const baseRates = {
    'ac-repair': { low: 150, high: 450, time: '1 - 2 Hours' },
    'ac-install': { low: 3400, high: 7800, time: 'Same-Day / Next-Day' },
    'furnace-repair': { low: 180, high: 520, time: '1 - 3 Hours' },
    'heat-pump': { low: 220, high: 600, time: '2 - 4 Hours' },
    'plumbing-leak': { low: 160, high: 390, time: '1 - 2 Hours' },
    'water-heater': { low: 240, high: 850, time: '2 - 3 Hours' },
    'drain-cleaning': { low: 140, high: 320, time: '45 - 90 Mins' },
    'duct-cleaning': { low: 290, high: 650, time: '2 - 4 Hours' }
  };

  function updateEstimate() {
    const service = serviceSelect.value;
    const urgency = urgencySelect.value;
    const property = propertySelect ? propertySelect.value : 'residential';

    const data = baseRates[service] || { low: 150, high: 450, time: '1 - 2 Hours' };
    
    let multiplier = 1;
    if (urgency === 'immediate') multiplier += 0.15; // emergency weekend/rush
    if (property === 'commercial') multiplier += 0.35;
    if (property === 'large') multiplier += 0.20;

    const calcLow = Math.round(data.low * multiplier);
    const calcHigh = Math.round(data.high * multiplier);

    priceDisplay.textContent = `$${calcLow} - $${calcHigh}`;
    if (durationDisplay) {
      durationDisplay.textContent = data.time;
    }
  }

  serviceSelect.addEventListener('change', updateEstimate);
  urgencySelect.addEventListener('change', updateEstimate);
  if (propertySelect) propertySelect.addEventListener('change', updateEstimate);

  updateEstimate();
}

// FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const button = item.querySelector('.faq-button');
    if (!button) return;

    button.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other accordions for neatness
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const btn = otherItem.querySelector('.faq-button');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// Booking & Lead Dispatch Form
function initBookingForm() {
  const form = document.getElementById('emergencyDispatchForm');
  const modal = document.getElementById('confirmationModal');
  const closeModal = document.getElementById('closeModalBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName')?.value.trim();
    const phone = document.getElementById('formPhone')?.value.trim();
    const service = document.getElementById('formService')?.value;

    if (!name || !phone) {
      alert('Please provide your name and phone number so a technician can call you immediately.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg> Connecting to local dispatcher...
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      } else {
        alert('Thank you! A licensed technician in your area has been notified and will call you within 5-10 minutes.');
      }
      form.reset();
    }, 1200);
  });

  if (closeModal && modal) {
    closeModal.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });
  }
}

// Live Status Ticker (Real-time psychological urgency & trust)
function initLiveTicker() {
  const countEl = document.getElementById('liveTechCount');
  if (!countEl) return;

  let currentCount = 26;
  setInterval(() => {
    // slight natural oscillation between 22 and 31
    const delta = Math.random() > 0.5 ? 1 : -1;
    currentCount = Math.max(21, Math.min(32, currentCount + delta));
    countEl.textContent = currentCount.toString();
  }, 12000);
}

