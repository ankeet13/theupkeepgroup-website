// Smooth anchor scroll with offset for sticky nav
const getNavOffset = () => {
  const nav = document.querySelector('.nav');
  return (nav ? nav.getBoundingClientRect().height : 76) + 8;
};
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      const y = el.getBoundingClientRect().top + window.scrollY - getNavOffset();
      const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: y, behavior: prefersReduced ? 'auto' : 'smooth' });
    }
  });
});

// Auto year
document.getElementById('year')?.appendChild(document.createTextNode(String(new Date().getFullYear())));

// Reveal on scroll
(() => {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('visible')); return; }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('visible'); });
  }, { threshold: 0.2 });
  els.forEach(el => io.observe(el));
})();

// Contact Form (Formspree)
(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const success = document.getElementById('formSuccess');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const endpoint = form.getAttribute('action') || '';
    const fd = new FormData(form);

    if (!endpoint.includes('formspree.io') || endpoint.includes('FORM_ID')) {
      success && (success.hidden = false);
      submitBtn && (submitBtn.disabled = true);
      return;
    }

    try {
      const res = await fetch(endpoint, { method:'POST', body: fd, headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        success && (success.hidden = false);
        submitBtn && (submitBtn.disabled = true);
        form.reset();
      } else {
        alert('Submission failed. Please email hello@theupkeepgroup.com');
      }
    } catch (err) {
      alert('Network error. Please email hello@theupkeepgroup.com');
    }
  });
})();

// Mobile nav toggle
(() => {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  const isDesktop = () => window.innerWidth >= 900;
  const setDesktop = () => { links.style.removeProperty('display'); document.body.classList.remove('no-scroll'); toggle.setAttribute('aria-expanded','false'); };
  const setMobileClosed = () => { links.style.display = 'none'; document.body.classList.remove('no-scroll'); toggle.setAttribute('aria-expanded','false'); };
  const toggleMobile = () => { const open = links.style.display === 'flex'; links.style.display = open ? 'none' : 'flex'; document.body.classList.toggle('no-scroll', !open); toggle.setAttribute('aria-expanded', String(!open)); };

  if (isDesktop()) setDesktop(); else setMobileClosed();
  toggle.addEventListener('click', () => { if (!isDesktop()) toggleMobile(); });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { if (!isDesktop()) setMobileClosed(); }));
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && !isDesktop()) setMobileClosed(); });
  document.addEventListener('click', e => { if (!isDesktop() && !links.contains(e.target) && !toggle.contains(e.target)) setMobileClosed(); });
  window.addEventListener('resize', () => { if (isDesktop()) setDesktop(); else if (links.style.display === '') setMobileClosed(); });
})();
