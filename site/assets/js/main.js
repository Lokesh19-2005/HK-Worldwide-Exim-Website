// ===========================================================
// HK WORLDWIDE EXIM — Site Interactions
// ===========================================================
document.addEventListener('DOMContentLoaded', function () {

  /* ---- Header scroll state ---- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile menu ---- */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeBtn = document.querySelector('.mobile-menu .close-btn');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => mobileMenu.classList.add('open'));
    closeBtn && closeBtn.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
  }

  /* ---- Active nav link ---- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---- Counter animation ---- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = target * eased;
      el.textContent = (target % 1 === 0 ? Math.floor(val) : val.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateCounter(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  }

  /* ---- Accordion (FAQ) ---- */
  document.querySelectorAll('.accordion-item').forEach(item => {
    const head = item.querySelector('.accordion-head');
    const body = item.querySelector('.accordion-body');
    head.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.accordion-item').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.accordion-body').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ---- Testimonial slider ---- */
  const track = document.querySelector('.testi-track');
  if (track) {
    const slides = track.children;
    let idx = 0;
    const dotsWrap = document.querySelector('.testi-dots');
    const visibleCount = () => window.innerWidth < 900 ? 1 : 3;
    const total = slides.length;
    if (dotsWrap) {
      for (let i = 0; i < total; i++) {
        const d = document.createElement('button');
        d.className = 'testi-dot';
        d.addEventListener('click', () => { idx = i; update(); });
        dotsWrap.appendChild(d);
      }
    }
    function update() {
      const w = slides[0].getBoundingClientRect().width + 28;
      track.style.transform = `translateX(-${idx * w}px)`;
      if (dotsWrap) {
        [...dotsWrap.children].forEach((d, i) => d.classList.toggle('active', i === idx));
      }
    }
    let auto = setInterval(() => {
      idx = (idx + 1) % Math.max(total - visibleCount() + 1, 1);
      update();
    }, 4500);
    update();
    window.addEventListener('resize', update);
  }

  /* ---- Filter (Products page) ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('[data-category]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      productCards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ---- Contact form (static demo) ---- */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = 'Message Sent ✓';
      btn.style.opacity = '0.75';
      form.reset();
      setTimeout(() => { btn.innerHTML = original; btn.style.opacity = '1'; }, 2600);
    });
  }

  /* ---- Lucide icons ---- */
  if (window.lucide) lucide.createIcons();
});
