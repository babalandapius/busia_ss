/* ============================================================
   BUSIA SECONDARY SCHOOL - Main JavaScript
   Author: Web Team | Version: 1.0
   ============================================================ */

'use strict';

/* ── Utility Helpers ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

/* ═══════════════════════════════════════════
   1. PRELOADER
═══════════════════════════════════════════ */
function initPreloader() {
  const loader = $('#preloader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 500);
  });
  document.body.style.overflow = 'hidden';
}

/* ═══════════════════════════════════════════
   2. DARK MODE
═══════════════════════════════════════════ */
function initDarkMode() {
  const theme = localStorage.getItem('bss-theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
  updateDarkIcons(theme);

  $$('.dark-toggle').forEach(btn => {
    on(btn, 'click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('bss-theme', next);
      updateDarkIcons(next);
    });
  });
}
function updateDarkIcons(theme) {
  $$('.dark-toggle').forEach(btn => btn.textContent = theme === 'dark' ? '☀️' : '🌙');
}

// 1. Fixed the ID selector to match your HTML
const form = document.getElementById('contact-form');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Automatically gathers everything including your hidden access_key input from HTML
    const formData = new FormData(form); 
    formData.append("replyto", document.getElementById('cf-email').value);
    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert("Success! Your message has been sent.");
            form.reset();
            
            // Optional: If you have a character counter span, reset its text too
            const charCount = form.querySelector('.char-count');
            if (charCount) charCount.textContent = "0/500";
            
        } else {
            alert("Error: " + data.message);
        }

    } catch (error) {
        console.error("Submission Error:", error);
        alert("Something went wrong. Please try again.");
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

/* ═══════════════════════════════════════════
   3. STICKY NAVBAR
═══════════════════════════════════════════ */
function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
  on(window, 'scroll', onScroll, { passive: true });
  onScroll();

  // Active link highlight
  const links = $$('.nav-link[data-page]');
  const page = location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    if (link.dataset.page === page) link.classList.add('active');
  });
}

/* ═══════════════════════════════════════════
   4. MOBILE MENU
═══════════════════════════════════════════ */
function initMobileMenu() {
  const burger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  if (!burger || !mobileMenu) return;

  on(burger, 'click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.classList.toggle('overflow-hidden');
  });

  // Close on outside click
  on(document, 'click', e => {
    if (!burger.contains(e.target) && !mobileMenu.contains(e.target)) {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.classList.remove('overflow-hidden');
    }
  });

  // Mobile sub-menus
  $$('.mobile-menu-toggle').forEach(toggle => {
    on(toggle, 'click', e => {
      e.preventDefault();
      const submenu = toggle.nextElementSibling;
      submenu?.classList.toggle('open');
      toggle.querySelector('.chevron')?.style &&
        (toggle.querySelector('.chevron').style.transform =
          submenu?.classList.contains('open') ? 'rotate(180deg)' : '');
    });
  });
}

/* ═══════════════════════════════════════════
   5. HERO IMAGE SLIDER
═══════════════════════════════════════════ */
function initHeroSlider() {
  const slides = $$('.hero-slide');
  const dots = $$('.hero-dot');
  if (!slides.length) return;
  let current = 0;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function next() { goTo(current + 1); }

  dots.forEach((dot, i) => on(dot, 'click', () => { clearInterval(timer); goTo(i); resetTimer(); }));

  function resetTimer() { timer = setInterval(next, 5000); }
  resetTimer();
}

/* ═══════════════════════════════════════════
   6. TYPING ANIMATION
═══════════════════════════════════════════ */
function initTyping() {
  const el = $('#typing-text');
  if (!el) return;
  const phrases = [
    'Excellence in Education',
    'Building Tomorrow\'s Leaders',
    'Nurturing Academic Brilliance',
    'Where Talent Meets Opportunity'
  ];
  let pi = 0, ci = 0, deleting = false;
  const cursor = '<span class="cursor"></span>';

  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      ci++;
      el.innerHTML = phrase.slice(0, ci) + cursor;
      if (ci === phrase.length) { deleting = true; setTimeout(type, 2000); return; }
      setTimeout(type, 80);
    } else {
      ci--;
      el.innerHTML = phrase.slice(0, ci) + cursor;
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(type, 400); return; }
      setTimeout(type, 40);
    }
  }
  type();
}

/* ═══════════════════════════════════════════
   7. ANIMATED COUNTERS
═══════════════════════════════════════════ */
function initCounters() {
  const counters = $$('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const tick = () => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current).toLocaleString();
        if (current < target) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      };
      tick();
      observer.unobserve(el);
    });
  }, { threshold: .3 });

  counters.forEach(c => observer.observe(c));
}

/* ═══════════════════════════════════════════
   8. SCROLL REVEAL
═══════════════════════════════════════════ */
function initScrollReveal() {
  const els = $$('.reveal');
  if (!els.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════
   9. BACK TO TOP
═══════════════════════════════════════════ */
function initBackTop() {
  const btn = $('#back-top');
  if (!btn) return;
  on(window, 'scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  on(btn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ═══════════════════════════════════════════
   10. TESTIMONIALS CAROUSEL
═══════════════════════════════════════════ */
function initTestimonials() {
  const inner = $('#testimonials-inner');
  if (!inner) return;
  const cards = inner.children;
  let current = 0, timer;

  function goTo(idx) {
    current = (idx + cards.length) % cards.length;
    inner.style.transform = `translateX(-${current * 100}%)`;
  }

  const prev = $('#testimonial-prev');
  const next = $('#testimonial-next');
  on(prev, 'click', () => { clearInterval(timer); goTo(current - 1); resetTimer(); });
  on(next, 'click', () => { clearInterval(timer); goTo(current + 1); resetTimer(); });

  function resetTimer() { timer = setInterval(() => goTo(current + 1), 6000); }
  resetTimer();
}

/* ═══════════════════════════════════════════
   11. GALLERY FILTER + LIGHTBOX
═══════════════════════════════════════════ */
function initGallery() {
  // Filter
  $$('.filter-btn').forEach(btn => {
    on(btn, 'click', () => {
      $$('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      $$('.gallery-item').forEach(item => {
        const show = cat === 'all' || item.dataset.category === cat;
        item.style.display = show ? '' : 'none';
      });
    });
  });

  // Lightbox
  const lb = $('#lightbox');
  const lbImg = $('#lightbox-img');
  if (!lb || !lbImg) return;

  $$('.gallery-item').forEach(item => {
    on(item, 'click', () => {
      const src = item.querySelector('img')?.src;
      if (src) { lbImg.src = src; lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
    });
  });

  on($('#lightbox-close'), 'click', closeLightbox);
  on(lb, 'click', e => { if (e.target === lb) closeLightbox(); });
  on(document, 'keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  function closeLightbox() { lb.classList.remove('open'); document.body.style.overflow = ''; }
}

/* ═══════════════════════════════════════════
   12. NEWS FILTER + SEARCH
═══════════════════════════════════════════ */
function initNewsFilter() {
  const searchInput = $('#news-search');
  if (!searchInput) return;

  on(searchInput, 'input', () => {
    const q = searchInput.value.toLowerCase();
    $$('.news-card[data-title]').forEach(card => {
      card.style.display = card.dataset.title.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  $$('.news-filter-btn').forEach(btn => {
    on(btn, 'click', () => {
      $$('.news-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      $$('.news-card[data-category]').forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
      });
    });
  });
}

/* ═══════════════════════════════════════════
   13. FAQ ACCORDION
═══════════════════════════════════════════ */
function initFAQ() {
  $$('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    on(btn, 'click', () => {
      const isOpen = item.classList.contains('open');
      $$('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ═══════════════════════════════════════════
   14. CONTACT FORM + LOCAL STORAGE
═══════════════════════════════════════════ */
function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  // Char count
  const textarea = form.querySelector('textarea');
  const charCount = form.querySelector('.char-count');
  if (textarea && charCount) {
    on(textarea, 'input', () => {
      charCount.textContent = `${textarea.value.length}/500`;
      if (textarea.value.length > 480) charCount.style.color = 'var(--error)';
      else charCount.style.color = '';
    });
  }

  on(form, 'submit', e => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const data = Object.fromEntries(new FormData(form).entries());
    data.timestamp = new Date().toISOString();
    data.id = Date.now();

    // Save to LocalStorage
    const submissions = JSON.parse(localStorage.getItem('bss-contacts') || '[]');
    submissions.push(data);
    localStorage.setItem('bss-contacts', JSON.stringify(submissions));

    showToast('✅ Message sent! We\'ll get back to you soon.', 'success');
    form.reset();
    if (charCount) charCount.textContent = '0/500';
  });
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const err = field.parentElement.querySelector('.form-error');
    if (!field.value.trim()) {
      field.classList.add('error');
      if (err) { err.textContent = 'This field is required.'; err.classList.add('show'); }
      valid = false;
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      field.classList.add('error');
      if (err) { err.textContent = 'Please enter a valid email.'; err.classList.add('show'); }
      valid = false;
    } else {
      field.classList.remove('error');
      if (err) err.classList.remove('show');
    }
  });
  return valid;
}

/* ═══════════════════════════════════════════
   15. ADMISSIONS FORM
═══════════════════════════════════════════ */
function initAdmissionsForm() {
  const form = $('#admissions-form');
  if (!form) return;
  on(form, 'submit', e => {
    e.preventDefault();
    if (!validateForm(form)) return;
    const data = Object.fromEntries(new FormData(form).entries());
    data.timestamp = new Date().toISOString();
    const inquiries = JSON.parse(localStorage.getItem('bss-inquiries') || '[]');
    inquiries.push(data);
    localStorage.setItem('bss-inquiries', JSON.stringify(inquiries));
    showToast('✅ Inquiry submitted! Admissions will contact you.', 'success');
    form.reset();
  });
}

/* ═══════════════════════════════════════════
   16. TOAST NOTIFICATION
═══════════════════════════════════════════ */
function showToast(msg, type = '') {
  let toast = $('#toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ═══════════════════════════════════════════
   17. ANNOUNCEMENTS TICKER
═══════════════════════════════════════════ */
function initTicker() {
  const track = $('#ticker-track');
  if (!track) return;
  const announcements = [
    'UNEB Results: Busia Secondary School achieves 98% pass rate — Outstanding Performance!',
    'Admissions Open 2025/2026 — Apply Now for S.1 and S.5 Intake',
    'Sports Day: March 15, 2025 — All parents and guardians are invited',
    'Inter-School Debate Competition: Busia SS emerges East Uganda Champions!',
    'Prize Giving Day: April 20, 2025 — A celebration of excellence',
    'New Science Laboratory officially opened — State-of-the-art facilities',
    'Music and Drama Festival Registration closes February 28th'
  ];
  const content = announcements.join('&nbsp;&nbsp;&nbsp;◆&nbsp;&nbsp;&nbsp;');
  track.innerHTML = content + '&nbsp;&nbsp;&nbsp;◆&nbsp;&nbsp;&nbsp;' + content;
}

/* ═══════════════════════════════════════════
   18. LIVE DATE/TIME
═══════════════════════════════════════════ */
function initDateTime() {
  const el = $('#live-time');
  if (!el) return;
  function update() {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit' });
  }
  update();
  setInterval(update, 1000);
}

/* ═══════════════════════════════════════════
   19. EVENT COUNTDOWN
═══════════════════════════════════════════ */
function initCountdown() {
  const el = $('#countdown-wrap');
  if (!el) return;
  const targetDate = new Date(el.dataset.target || '2025-06-15T08:00:00');

  function update() {
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) { el.innerHTML = '<div class="countdown-item"><span class="countdown-num">🎉</span><span class="countdown-label">Event Day!</span></div>'; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.innerHTML = [
      { n: d, l: 'Days' }, { n: h, l: 'Hours' },
      { n: m, l: 'Minutes' }, { n: s, l: 'Seconds' }
    ].map(i => `<div class="countdown-item"><span class="countdown-num">${String(i.n).padStart(2,'0')}</span><span class="countdown-label">${i.l}</span></div>`).join('');
  }
  update();
  setInterval(update, 1000);
}

/* ═══════════════════════════════════════════
   20. PAGE TABS
═══════════════════════════════════════════ */
function initTabs() {
  $$('.page-tabs').forEach(tabGroup => {
    const tabs = $$('.page-tab', tabGroup);
    tabs.forEach(tab => {
      on(tab, 'click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        $$('.tab-panel').forEach(panel => {
          panel.style.display = panel.dataset.panel === target ? '' : 'none';
        });
      });
    });
    // Init first tab
    if (tabs[0]) tabs[0].click();
  });
}

/* ═══════════════════════════════════════════
   21. LAZY LOADING
═══════════════════════════════════════════ */
function initLazyLoad() {
  const imgs = $$('img[data-src]');
  if (!imgs.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.src = e.target.dataset.src;
        e.target.removeAttribute('data-src');
        observer.unobserve(e.target);
      }
    });
  }, { rootMargin: '200px' });
  imgs.forEach(img => observer.observe(img));
}

/* ═══════════════════════════════════════════
   22. SMOOTH SCROLL FOR ANCHOR LINKS
═══════════════════════════════════════════ */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    on(link, 'click', e => {
      const target = $(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ═══════════════════════════════════════════
   23. SPORTS / CLUBS ACCORDION ON STUDENT LIFE
═══════════════════════════════════════════ */
function initActivityToggles() {
  $$('.activity-toggle').forEach(btn => {
    on(btn, 'click', () => {
      const panel = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');
      $$('.activity-toggle').forEach(b => { b.classList.remove('open'); b.nextElementSibling?.style && (b.nextElementSibling.style.maxHeight = ''); });
      if (!isOpen) {
        btn.classList.add('open');
        if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

/* ═══════════════════════════════════════════
   INIT ALL
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initDarkMode();
  initNavbar();
  initMobileMenu();
  initHeroSlider();
  initTyping();
  initCounters();
  initScrollReveal();
  initBackTop();
  initTestimonials();
  initGallery();
  initNewsFilter();
  initFAQ();
  initContactForm();
  initAdmissionsForm();
  initTicker();
  initDateTime();
  initCountdown();
  initTabs();
  initLazyLoad();
  initSmoothScroll();
  initActivityToggles();
});
