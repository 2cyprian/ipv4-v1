

import Router from '../src/js/router.js';
import { initHome } from './js/components/home.js';



// Update active link based on current page
function updateActiveLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.navbar-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (currentPath === href || (currentPath === '/' && href === '/')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
// Setup mobile navbar toggle behavior
function setupNavbarToggle() {
  const toggle = document.querySelector('.navbar-toggle');
  const mobileMenu = document.getElementById('navbar-mobile-menu');
  const body = document.body;

  if (!toggle || !mobileMenu) return;

  // --- Helper Functions --- //

  const openMenu = () => {
    toggle.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('data-visible', 'true');
    // Optional: Prevent background scrolling when menu is open
    body.style.overflow = 'hidden'; 
  };

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('data-visible', 'false');
    // Restore background scrolling
    body.style.overflow = ''; 
  };

  const isMenuOpen = () => {
    return toggle.getAttribute('aria-expanded') === 'true';
  };

  // --- Core Toggle Logic --- //

  toggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent this click from triggering the "click outside" listener immediately
    if (isMenuOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // --- 1. Close when clicking a link --- //
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // --- 2. Close with Escape Key --- //
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen()) {
      closeMenu();
    }
  });

  // --- 3. Close when clicking outside the menu --- //
  document.addEventListener('click', (e) => {
    if (isMenuOpen()) {
      // If the click target is NOT the menu and NOT the toggle button
      if (!mobileMenu.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    }
  });

  // --- 4. Close when resizing screen (Orientation change or Desktop switch) --- //
  window.addEventListener('resize', () => {
    // If screen gets larger than mobile breakpoint (e.g., 768px) and menu is open
    if (window.innerWidth > 768 && isMenuOpen()) {
      closeMenu();
    }
  });

  // --- 5. Close on Scroll (Optional but requested) --- //
  // Note: Usually, "Body Scroll Lock" (above) is better UX than closing on scroll.
  // However, here is the code to close it if the user manages to scroll the page.
  window.addEventListener('scroll', () => {
    if (isMenuOpen()) {
        // Simple check: if page is scrolled more than 50px, close menu
        closeMenu();
    }
  }, { passive: true });
}
// Expose globally for router.js
window.setupNavbarToggle = setupNavbarToggle;

// Handle contact form submission
function handleContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const statusDiv = document.getElementById('form-status');
    
    // Show success message (in production, send to server)
    statusDiv.innerHTML = '<div class="alert alert-success">Thank you! We\'ll get back to you soon.</div>';
    form.reset();
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      statusDiv.innerHTML = '';
    }, 5000);
  });
}

// Handle service links routing
// Remove SPA hash routing logic for service links

// Load an HTML partial and insert into the document if a selector isn't already present
async function loadHtmlPartial(url, insertPosition = 'beforeend', existenceSelector = null) {
  try {
    if (existenceSelector && document.querySelector(existenceSelector)) return;
    const resp = await fetch(url, { cache: 'no-store' });
    if (!resp.ok) return;
    const html = await resp.text();
    if (insertPosition === 'afterbegin') document.body.insertAdjacentHTML('afterbegin', html);
    else document.body.insertAdjacentHTML('beforeend', html);
  } catch (e) {
    // fail silently — partials are optional
  }
}

// Utility to inject HTML partials into containers by ID
async function injectPartial(containerId, url) {
  const container = document.getElementById(containerId);
  if (container) {
    try {
      const resp = await fetch(url);
      if (resp.ok) {
        container.innerHTML = await resp.text();
      }
    } catch (e) {
      // fail silently
    }
  }
}

// Initialize app
// Only run router.init() on DOMContentLoaded


async function loadNavbarAndInitRouter() {
  const navbarContainer = document.getElementById('navbar-container');
  if (navbarContainer) {
    const resp = await fetch('/src/components/navbar.html');
    const html = await resp.text();
    navbarContainer.innerHTML = html;
  }
  setupNavbarToggle();
  const router = new Router();
  router.init();
}

document.addEventListener('DOMContentLoaded', () => {
  loadNavbarAndInitRouter();
  injectPartial('footer-container', '/src/components/footer.html');
  
  // Initialize home page components if on home
  if (window.location.pathname === '/' || window.location.pathname === '') {
    initHome();
  }
});