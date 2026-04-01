  // CURSOR
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx=0, my=0, rx=0, ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; cursor.style.left=mx+'px'; cursor.style.top=my+'px'; });
  function animRing(){ rx += (mx-rx)*0.12; ry += (my-ry)*0.12; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(animRing); }
  animRing();
  document.querySelectorAll('a, button, .service-card, .p-item, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', ()=>{ cursor.style.transform='translate(-50%,-50%) scale(2)'; ring.style.transform='translate(-50%,-50%) scale(1.5)'; ring.style.opacity='0.3'; });
    el.addEventListener('mouseleave', ()=>{ cursor.style.transform='translate(-50%,-50%) scale(1)'; ring.style.transform='translate(-50%,-50%) scale(1)'; ring.style.opacity='0.6'; });
  });

  // NAV SCROLL
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 50); });

  // MOBILE MENU
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const closeMenu = document.getElementById('closeMenu');
  function openMenu(){ mobileNav.classList.add('open'); mobileOverlay.classList.add('open'); }
  function closeMenuFn(){ mobileNav.classList.remove('open'); mobileOverlay.classList.remove('open'); }
  hamburger.addEventListener('click', openMenu);
  closeMenu.addEventListener('click', closeMenuFn);
  mobileOverlay.addEventListener('click', closeMenuFn);
  document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', closeMenuFn));

  // GSAP ANIMATIONS
  gsap.registerPlugin(ScrollTrigger);

  // Hero
  gsap.to('.hero-tag', { opacity:1, y:0, duration:0.8, delay:0.3, ease:'power2.out' });
  gsap.to('.hero-h1', { opacity:1, y:0, duration:1, delay:0.5, ease:'power3.out' });
  gsap.to('.hero-sub', { opacity:1, y:0, duration:0.8, delay:0.75, ease:'power2.out' });
  gsap.to('.hero-btns', { opacity:1, y:0, duration:0.8, delay:0.95, ease:'power2.out' });
  gsap.to('.hero-stats', { opacity:1, duration:1, delay:1.2, ease:'power2.out' });

  // Counter animation
  document.querySelectorAll('[data-target]').forEach(el => {
    const target = +el.dataset.target;
    let start = null;
    const duration = 2000;
    function step(timestamp){ if(!start) start=timestamp; const p=Math.min((timestamp-start)/duration,1); el.textContent=Math.floor(p*target)+(target>=98?'%':'+'); if(p<1) requestAnimationFrame(step); }
    setTimeout(()=>requestAnimationFrame(step), 1300);
  });

  // Fade up sections
  gsap.utils.toArray('.fade-up').forEach(el => {
    gsap.to(el, { opacity:1, y:0, duration:0.9, ease:'power2.out', scrollTrigger:{ trigger:el, start:'top 85%' } });
  });

  // Stagger children
  document.querySelectorAll('section').forEach(section => {
    const children = section.querySelectorAll('.stagger-child');
    if(children.length) {
      gsap.to(children, { opacity:1, y:0, duration:0.7, stagger:0.12, ease:'power2.out',
        scrollTrigger:{ trigger:section, start:'top 80%' } });
    }
  });

  // FILTER TABS
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function(){
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // HERO CAROUSEL
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let carouselTimer;

  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  function startCarousel() {
    carouselTimer = setInterval(nextSlide, 5000);
  }
  function resetCarousel() {
    clearInterval(carouselTimer);
    startCarousel();
  }

  document.getElementById('heroNext').addEventListener('click', () => { nextSlide(); resetCarousel(); });
  document.getElementById('heroPrev').addEventListener('click', () => { prevSlide(); resetCarousel(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goToSlide(i); resetCarousel(); }));
  startCarousel();

  // FORM SUBMIT
  async function handleSubmit(e){
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.submit-btn');
    const originalText = btn.textContent;
    const formData = new FormData(form);
    const endpoint = form.dataset.endpoint;

    if (!endpoint || endpoint.includes('your_form_id')) {
      btn.textContent = 'Set form endpoint first';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 2500);
      return;
    }

    btn.textContent = 'Sending...';
    btn.disabled = true;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      btn.textContent = 'Message Sent ✓';
      form.reset();
    } catch (err) {
      btn.textContent = 'Send Failed - Try Again';
    }

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 2500);
  }
