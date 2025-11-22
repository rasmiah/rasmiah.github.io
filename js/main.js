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
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
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

/* ----- IMAGE SLIDER FOR HERO ----- */
const slider = document.querySelector('.slider');

if (slider) {
  const track = slider.querySelector('.slider-track');
  const slides = Array.from(slider.querySelectorAll('.slide'));
  const dotsContainer = slider.querySelector('.slider-dots');

  if (track && slides.length && dotsContainer) {
    let currentSlide = 0;

    // Ensure slides are laid out correctly
    slides.forEach(slide => {
      slide.style.flex = '0 0 100%';   // each slide = 100% of slider width
      slide.style.maxWidth = '100%';
    });

    // Create dots dynamically
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    function goToSlide(index) {
      currentSlide = index;

      // width of a single slide (actual rendered width)
      const slideWidth = slides[0].getBoundingClientRect().width;

      // move track exactly one slide at a time
      track.style.transform = `translateX(-${index * slideWidth}px)`;

      dots.forEach(d => d.classList.remove('active'));
      dots[index].classList.add('active');
    }

    // Auto-slide every 3 seconds
    setInterval(() => {
      const nextIndex = (currentSlide + 1) % slides.length;
      goToSlide(nextIndex);
    }, 3000);

    // Recalculate position on resize (so it stays aligned)
    window.addEventListener('resize', () => {
      goToSlide(currentSlide);
    });

    // Initial position
    goToSlide(0);
  }
}
