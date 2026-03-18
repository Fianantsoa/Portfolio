/* =============================================
   script.js — Portfolio interactions & animations
   ============================================= */

(function () {
  'use strict';

  /* -----------------------------------------------
     1. THREE.JS PARTICLE BACKGROUND
  ----------------------------------------------- */
  function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4;

    // Particle geometry
    const COUNT    = 1800;
    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);

    const palette = [
      new THREE.Color('#6c63ff'),
      new THREE.Color('#3ecfcf'),
      new THREE.Color('#8b7cf8'),
      new THREE.Color('#ffffff'),
    ];

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * 14;
      positions[i3 + 1] = (Math.random() - 0.5) * 14;
      positions[i3 + 2] = (Math.random() - 0.5) * 8;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i3]     = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

    const material = new THREE.PointsMaterial({
      size:           0.04,
      vertexColors:   true,
      transparent:    true,
      opacity:        0.55,
      sizeAttenuation: true,
      depthWrite:     false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse parallax
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', function (e) {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.5;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    });

    // Resize
    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation loop
    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.001;
      particles.rotation.y = t * 0.04  + mouseX * 0.3;
      particles.rotation.x = t * 0.02  - mouseY * 0.2;
      renderer.render(scene, camera);
    }

    animate();
  }

  /* -----------------------------------------------
     2. NAVBAR scroll effect & active link
  ----------------------------------------------- */
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    var links  = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', function () {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      updateActiveLink();
    }, { passive: true });

    function updateActiveLink() {
      var sections = document.querySelectorAll('section[id]');
      var scrollPos = window.scrollY + 120;

      sections.forEach(function (sec) {
        if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
          links.forEach(function (a) {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + sec.id) {
              a.classList.add('active');
            }
          });
        }
      });
    }
  }

  /* -----------------------------------------------
     3. HAMBURGER MENU
  ----------------------------------------------- */
  function initHamburger() {
    var btn   = document.getElementById('hamburger');
    var menu  = document.getElementById('mobile-menu');
    var links = menu.querySelectorAll('.mobile-link');

    function close() {
      btn.classList.remove('open');
      menu.classList.remove('open');
    }

    btn.addEventListener('click', function () {
      btn.classList.toggle('open');
      menu.classList.toggle('open');
    });

    links.forEach(function (link) {
      link.addEventListener('click', close);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        close();
      }
    });
  }

  /* -----------------------------------------------
     4. TYPEWRITER
  ----------------------------------------------- */
  function initTypewriter() {
    var el = document.getElementById('typewriter-text');
    if (!el) return;

    var phrases = [
      'Full-Stack Developer',
      'Systems Programmer',
      '42 School Student',
      'Open Source Enthusiast',
      'Problem Solver',
    ];

    var phraseIndex = 0;
    var charIndex   = 0;
    var deleting    = false;
    var pausing     = false;

    function tick() {
      var phrase = phrases[phraseIndex];

      if (pausing) {
        pausing = false;
        setTimeout(tick, deleting ? 50 : 1800);
        return;
      }

      if (!deleting) {
        el.textContent = phrase.slice(0, ++charIndex);
        if (charIndex === phrase.length) {
          deleting = true;
          pausing  = true;
        }
      } else {
        el.textContent = phrase.slice(0, --charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }

      var speed = deleting ? 35 : 70;
      setTimeout(tick, speed);
    }

    setTimeout(tick, 600);
  }

  /* -----------------------------------------------
     5. SCROLL REVEAL (IntersectionObserver)
  ----------------------------------------------- */
  function initScrollReveal() {
    var els = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right');
    if (!els.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Stagger siblings in a grid
          var parent = entry.target.parentElement;
          var siblings = Array.from(parent.querySelectorAll('.reveal-up, .reveal-fade'));
          var idx = siblings.indexOf(entry.target);
          var delay = idx >= 0 ? idx * 80 : 0;

          setTimeout(function () {
            entry.target.classList.add('revealed');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    els.forEach(function (el) { observer.observe(el); });
  }

  /* -----------------------------------------------
     6. SKILL BARS animation
  ----------------------------------------------- */
  function initSkillBars() {
    var bars = document.querySelectorAll('.skill-fill');
    if (!bars.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var bar   = entry.target;
          var width = bar.getAttribute('data-width') || '0';
          bar.style.width = width + '%';
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(function (bar) { observer.observe(bar); });
  }

  /* -----------------------------------------------
     7. PROJECT FILTERS
  ----------------------------------------------- */
  function initProjectFilters() {
    var buttons = document.querySelectorAll('.filter-btn');
    var cards   = document.querySelectorAll('.project-card');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filter = btn.getAttribute('data-filter');

        cards.forEach(function (card) {
          var cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* -----------------------------------------------
     8. CODE CARD 3D tilt on mousemove
  ----------------------------------------------- */
  function initCardTilt() {
    var card = document.querySelector('.code-card');
    if (!card) return;

    var MAX = 12;

    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var cx   = rect.left + rect.width  / 2;
      var cy   = rect.top  + rect.height / 2;
      var dx   = (e.clientX - cx) / (rect.width  / 2);
      var dy   = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = 'perspective(800px) rotateY(' + (dx * MAX) + 'deg) rotateX(' + (-dy * MAX) + 'deg) scale(1.03)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(800px) rotateY(-6deg) rotateX(3deg)';
    });
  }

  /* -----------------------------------------------
     9. CONTACT FORM (frontend validation only)
  ----------------------------------------------- */
  function initContactForm() {
    var form   = document.getElementById('contact-form');
    var status = document.getElementById('form-status');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-note';

      var name    = form.name.value.trim();
      var email   = form.email.value.trim();
      var message = form.message.value.trim();

      if (!name || !email || !message) {
        status.textContent = '⚠️ Please fill in all fields.';
        status.className   = 'form-note error';
        return;
      }

      // Basic email validation
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email)) {
        status.textContent = '⚠️ Please enter a valid email address.';
        status.className   = 'form-note error';
        return;
      }

      // Simulate send (no backend)
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.querySelector('.btn-text').textContent = 'Sending…';

      setTimeout(function () {
        btn.disabled = false;
        btn.querySelector('.btn-text').textContent = 'Send Message';
        status.textContent = '✅ Message sent! I\'ll get back to you soon.';
        status.className   = 'form-note success';
        form.reset();
      }, 1200);
    });
  }

  /* -----------------------------------------------
     10. GSAP enhanced animations (if available)
  ----------------------------------------------- */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    gsap.from('.hero-name', {
      duration: 1.2,
      y: 60,
      opacity: 0,
      ease: 'power4.out',
      delay: 0.2,
    });

    gsap.from('.hero-greeting', {
      duration: 1,
      x: -30,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.1,
    });

    gsap.from('.hero-typewriter', {
      duration: 0.8,
      opacity: 0,
      ease: 'power2.out',
      delay: 0.6,
    });

    gsap.from('.hero-sub', {
      duration: 1,
      y: 20,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.8,
    });

    gsap.from('.hero-cta .btn', {
      duration: 0.8,
      y: 20,
      opacity: 0,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 1,
    });

    gsap.from('.code-card', {
      duration: 1.4,
      x: 80,
      opacity: 0,
      ease: 'power4.out',
      delay: 0.4,
    });

    // Scroll-based parallax on orbs
    var orbs = document.querySelectorAll('.orb');
    orbs.forEach(function (orb, i) {
      var dir = i % 2 === 0 ? -60 : 60;
      gsap.to(orb, {
        y: dir,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    });

    // Section titles
    document.querySelectorAll('.section-title').forEach(function (title) {
      gsap.from(title, {
        scrollTrigger: { trigger: title, start: 'top 85%' },
        duration: 1,
        x: -30,
        opacity: 0,
        ease: 'power3.out',
      });
    });
  }

  /* -----------------------------------------------
     INIT ALL
  ----------------------------------------------- */
  function init() {
    initParticles();
    initNavbar();
    initHamburger();
    initTypewriter();
    initScrollReveal();
    initSkillBars();
    initProjectFilters();
    initCardTilt();
    initContactForm();
    initGSAP();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
