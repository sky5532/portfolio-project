/* 1. Scroll reveal (fade-in as sections enter the screen) */
const fadeElements = document.querySelectorAll(
  '.about, .skills-section, .projects, .resume, .contact, .project-card'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

fadeElements.forEach((el) => {
  el.classList.add('fade-in');
  observer.observe(el);
});

/* 2. Responsive mobile menu */
const menuToggle = document.getElementById('menu-toggle');
const siteNav = document.getElementById('site-nav');

function setMenu(open) {
  siteNav.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menuToggle.textContent = open ? '✕' : '☰';
}

menuToggle.addEventListener('click', () => {
  setMenu(!siteNav.classList.contains('open'));
});

siteNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

/* 3. Dark / light mode toggle (remembers your choice) */
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

let savedTheme = null;
try { savedTheme = localStorage.getItem('theme'); } catch (e) { /* storage unavailable */ }
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark);

themeToggle.addEventListener('click', () => {
  const isDark = !document.body.classList.contains('dark');
  applyTheme(isDark);
  try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) { /* ignore */ }
});

/* 4. Project filter */
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    filterButtons.forEach((b) => b.classList.toggle('active', b === btn));
    projectCards.forEach((card) => {
      const tags = card.dataset.tags.split(' ');
      card.classList.toggle('hide', filter !== 'all' && !tags.includes(filter));
    });
  });
});

/* 5. Contact form validation */
const form = document.getElementById('contact-form');
const statusMsg = document.getElementById('form-status');

const rules = {
  name: (v) => v.trim().length >= 2 || 'Enter your name (at least 2 characters).',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email, like name@example.com.',
  message: (v) => v.trim().length >= 10 || 'Write a message of at least 10 characters.'
};

function validateField(field) {
  const result = rules[field.name](field.value);
  const valid = result === true;
  field.classList.toggle('invalid', !valid);
  field.setAttribute('aria-invalid', String(!valid));
  document.getElementById(field.id + '-error').textContent = valid ? '' : result;
  return valid;
}

const fields = form.querySelectorAll('input, textarea');

fields.forEach((field) => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.classList.contains('invalid')) validateField(field);
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  statusMsg.textContent = '';
  const results = Array.from(fields).map(validateField);

  if (results.every(Boolean)) {
    statusMsg.textContent = 'Thanks! Your message has been sent.';
    form.reset();
  } else {
    form.querySelector('.invalid').focus();
  }
});

/* Home links always scroll back to the very top */
document.querySelectorAll('a[href="#hero"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMenu(false);
  });
});