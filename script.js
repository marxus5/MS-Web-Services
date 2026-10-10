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

  function handleSubmit(e) {
    e.preventDefault();

    const form = document.getElementById('contact-form');
    const businessName = document.getElementById('business-name')?.value?.trim() || 'Not provided';
    const email = document.getElementById('email')?.value?.trim() || 'Not provided';
    const phone = document.getElementById('phone')?.value?.trim() || 'Not provided';
    const message = document.getElementById('message')?.value?.trim() || 'No additional details provided';
    const recipient = 'contact@mswebservices.org';

    const subject = encodeURIComponent('New Website Quote request from ' + businessName);
    const body = encodeURIComponent(
      'Business Name: ' + businessName + '\n' +
      'Email: ' + email + '\n' +
      'Phone: ' + phone + '\n\n' +
      'Project details:\n' + message
    );

    window.location.href = 'mailto:' + recipient + '?subject=' + subject + '&body=' + body;

    form.style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
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