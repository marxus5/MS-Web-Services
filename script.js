function go(id) { document.getElementById(id).scrollIntoView({behavior:'smooth'}); }

  function openPreview(name, category, colorClass, previewUrl = '') {
    const thumb = document.getElementById('preview-thumb');
    const frame = document.getElementById('preview-frame');
    const previewUrlEl = document.getElementById('preview-url');

    thumb.className = 'screenshot-placeholder ' + colorClass;
    document.getElementById('preview-name').textContent = name;
    document.getElementById('preview-category').textContent = category;
    previewUrlEl.textContent = previewUrl || name.toLowerCase().replace(/[^a-z0-9]+/g, '') + '.com';

    if (previewUrl) {
      frame.src = previewUrl;
      frame.style.display = 'block';
      thumb.style.opacity = '0.35';
    } else {
      frame.removeAttribute('src');
      frame.style.display = 'none';
      thumb.style.opacity = '1';
    }

    document.getElementById('preview-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closePreview() {
    document.getElementById('preview-modal').classList.remove('open');
    document.body.style.overflow = '';
  }
  function handlePreviewOverlay(e) {
    if (e.target === document.getElementById('preview-modal')) closePreview();
  }
  function toggleMobileNav() {
    document.getElementById('mobile-nav').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileNav() {
    document.getElementById('mobile-nav').classList.remove('open');
    document.body.style.overflow = '';
  }
  function handleMobileNavOverlay(e) {
    if (e.target.id === 'mobile-nav') closeMobileNav();
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closePreview(); closeMobileNav(); } });

  async function handleSubmit(e) {
    e.preventDefault();

    const form = document.getElementById('contact-form');
    const submitButton = form.querySelector('button[type="submit"]');
    const errorMessage = document.getElementById('form-error');
    const successMessage = document.getElementById('form-success');
    errorMessage.textContent = '';
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });

      if (!response.ok) {
        throw new Error('The contact form could not be sent.');
      }

      form.style.display = 'none';
      successMessage.style.display = 'block';
    } catch (error) {
      errorMessage.textContent = 'Sorry, your message could not be sent. Please try again or email marcus@mswebservices.org.';
      submitButton.disabled = false;
      submitButton.textContent = 'Get My Free Quote →';
    }
  }

  function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    item.classList.toggle('open');
  }

  const hero = document.querySelector('.hero');
  const heroRight = document.querySelector('.hero-right');
  if (hero) {
    if (heroRight) hero.classList.remove('no-promo');
    else hero.classList.add('no-promo');
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Nav hides after scrolling down, reappears when scrolling up.
  const nav = document.querySelector('nav');
  let lastScrollY = window.scrollY;

  function updateNavScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 24 && currentScrollY > lastScrollY) {
      nav.classList.add('hidden');
      nav.classList.remove('scrolled');
    } else {
      nav.classList.remove('hidden');
      if (currentScrollY > 24) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  }
  window.addEventListener('scroll', updateNavScroll, { passive: true });
  updateNavScroll();