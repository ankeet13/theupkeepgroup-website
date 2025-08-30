// ---------------- Tabs ----------------
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-tab');
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
  });
});

// -------- Smooth scroll for in-page anchors (dynamic offset for sticky nav) --------
const getNavOffset = () => {
  const nav = document.querySelector('.nav');
  return (nav ? nav.getBoundingClientRect().height : 70) + 6; // small extra gap
};

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href')?.slice(1);
    const el = id && document.getElementById(id);
    if (el) {
      e.preventDefault();
      const y = el.getBoundingClientRect().top + window.scrollY - getNavOffset();
      const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: y, behavior: prefersReduced ? 'auto' : 'smooth' });
    }
  });
});

// ---------------- Auto year ----------------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------------- Reveal on scroll ----------------
(() => {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('visible'); });
  }, { threshold: 0.15 });
  els.forEach(el => observer.observe(el));
})();

// ---------------- Contact form (Formspree-ready; dev fallback) ----------------
(() => {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const endpoint = form.getAttribute('action') || '';
    const submitBtn = form.querySelector('button[type="submit"]');

    // If Formspree FORM_ID not replaced yet, show local success for demo
    if (!endpoint.includes('formspree.io') || endpoint.includes('FORM_ID')) {
      if (success) success.hidden = false;
      if (submitBtn) submitBtn.disabled = true;
      return;
    }

    try {
      const res = await fetch(endpoint, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        if (success) success.hidden = false;
        if (submitBtn) submitBtn.disabled = true;
        form.reset();
      } else {
        alert('Submission failed. Please email hello@theupkeepgroup.com');
      }
    } catch {
      alert('Network error. Please email hello@theupkeepgroup.com');
    }
  });
})();

// ---------------- Mobile/desktop-safe nav toggle ----------------
(() => {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  const isDesktop = () => window.innerWidth >= 900;

  const setDesktop = () => {
    links.style.removeProperty('display');   // let CSS show flex on desktop
    document.body.classList.remove('no-scroll');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const setMobileClosed = () => {
    links.style.display = 'none';
    document.body.classList.remove('no-scroll');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const toggleMobile = () => {
    const open = links.style.display === 'flex';
    links.style.display = open ? 'none' : 'flex';
    document.body.classList.toggle('no-scroll', !open);
    toggle.setAttribute('aria-expanded', String(!open));
  };

  // Init state
  if (isDesktop()) setDesktop(); else setMobileClosed();

  // Open/close on click (mobile only)
  toggle.addEventListener('click', () => { if (!isDesktop()) toggleMobile(); });

  // Close when a link is clicked (mobile)
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => { if (!isDesktop()) setMobileClosed(); })
  );

  // Close on ESC / outside click (mobile)
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && !isDesktop()) setMobileClosed(); });
  document.addEventListener('click', e => {
    if (!isDesktop() && !links.contains(e.target) && !toggle.contains(e.target)) setMobileClosed();
  });

  // Reset correctly on resize so it never “sticks” hidden
  window.addEventListener('resize', () => {
    if (isDesktop()) setDesktop();
    else if (links.style.display === '') setMobileClosed();
  });
})();
