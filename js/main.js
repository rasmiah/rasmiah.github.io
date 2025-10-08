// Mobile nav toggle + active link persistence + footer year + simple filters
const toggle = document.querySelector('.nav__toggle');
const linksWrap = document.getElementById('navLinks');

if (toggle && linksWrap){
  toggle.addEventListener('click', ()=>{
    const open = linksWrap.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Footer year
const y = document.getElementById('year');
if (y) y.textContent = String(new Date().getFullYear());

// Projects filtering (projects.html)
const filterBtns = document.querySelectorAll('.filters [data-filter]');
const cards = document.querySelectorAll('.projects-grid .project');
if (filterBtns.length && cards.length){
  filterBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      filterBtns.forEach(b=>b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const cat = btn.dataset.filter;
      cards.forEach(card=>{
        const show = (cat === 'all') || (card.dataset.cat === cat);
        card.style.display = show ? 'block' : 'none';
      });
    });
  });
}

// Contact form handler (runs only if the form exists on the page)
// Contact form handler
// Contact form handler
(function(){
  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusBox = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  const note = document.getElementById('formNote');

  const setStatus = (msg, ok = true) => {
    if (!statusBox) return;
    statusBox.textContent = msg;
    statusBox.style.color = ok ? 'var(--green)' : 'var(--red)';
  };

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('');

    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!email || !isValidEmail(email)) {
      setStatus('Please enter a valid email address.', false);
      form.email.focus();
      return;
    }
    if (!message || message.length < 10) {
      setStatus('Please write a bit more (at least 10 characters).', false);
      form.message.focus();
      return;
    }

    submitBtn.disabled = true;
    const original = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';

    try {
      const data = new FormData(form);
      const res = await fetch(form.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        form.reset();
        setStatus('Thank you! Your message has been sent. ✨', true);
        if (note) note.textContent = 'I’ll get back to you soon.';
      } else {
        const err = await res.json().catch(() => ({}));
        setStatus(err?.error || 'Oops, something went wrong. Please try again.', false);
      }
    } catch {
      setStatus('Network error. Please try again later.', false);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = original;
    }
  });
})();
