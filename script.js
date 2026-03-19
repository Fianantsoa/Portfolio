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
    var forms = document.querySelectorAll('.contact-form');
    if (!forms.length) return;

    forms.forEach(function (form) {
      if (form.dataset.bound === '1') return;
      form.dataset.bound = '1';
      var status = form.querySelector('.form-note');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (status) {
          status.className = 'form-note';
        }

        var name    = form.name.value.trim();
        var email   = form.email.value.trim();
        var message = form.message.value.trim();

        if (!name || !email || !message) {
          if (status) {
            status.textContent = '⚠️ Please fill in all fields.';
            status.className   = 'form-note error';
          }
          return;
        }

        // Basic email validation
        var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(email)) {
          if (status) {
            status.textContent = '⚠️ Please enter a valid email address.';
            status.className   = 'form-note error';
          }
          return;
        }

        // Simulate send (no backend)
        var btn = form.querySelector('button[type="submit"]');
        if (btn) {
          btn.disabled = true;
          var textEl = btn.querySelector('.btn-text');
          if (textEl) textEl.textContent = 'Sending…';
        }

        setTimeout(function () {
          if (btn) {
            btn.disabled = false;
            var textEl2 = btn.querySelector('.btn-text');
            if (textEl2) textEl2.textContent = 'Send Message';
          }
          if (status) {
            status.textContent = '✅ Message sent! I\'ll get back to you soon.';
            status.className   = 'form-note success';
          }
          form.reset();
        }, 1200);
      });
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
     11. DESKTOP OS WINDOWS
  ----------------------------------------------- */
  function initDesktopOS() {
    var icons       = document.querySelectorAll('.desktop-icon');
    var windowArea  = document.getElementById('window-area');
    var taskbarWrap = document.getElementById('taskbar-windows');
    var clockEl     = document.getElementById('taskbar-clock');
    if (!icons.length || !windowArea || !taskbarWrap) return;

    var contentMap = {};
    document.querySelectorAll('.window-source').forEach(function (sec) {
      var key = sec.getAttribute('data-window');
      if (key) {
        contentMap[key] = sec.innerHTML;
      }
    });

    var titles = {
      about:    'About',
      projects: 'Projects',
      skills:   'Skills',
      contact:  'Contact',
      resume:   'Resume',
    };

    var zCounter = 20;
    var idCounter = 0;
    var openWindows = new Map();
    var taskbarButtons = new Map();

    function updateClock() {
      if (!clockEl) return;
      var now = new Date();
      var h = now.getHours().toString().padStart(2, '0');
      var m = now.getMinutes().toString().padStart(2, '0');
      clockEl.textContent = h + ':' + m;
    }
    function scheduleClockTick() {
      updateClock();
      var now = new Date();
      var msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
      setTimeout(function () {
        updateClock();
        setInterval(updateClock, 60000);
      }, Math.max(msToNextMinute, 1000));
    }
    scheduleClockTick();

    function updateBlur() {
      document.body.classList.toggle('blur-active', openWindows.size > 0);
    }

    function focusWindow(win) {
      zCounter += 1;
      win.style.zIndex = zCounter;
      taskbarButtons.forEach(function (btn) { btn.classList.remove('active'); });
      var id = win.dataset.windowId;
      var btn = taskbarButtons.get(id);
      if (btn) btn.classList.add('active');
    }

    function ensureTaskbarItem(id, title, onClick) {
      if (taskbarButtons.has(id)) return taskbarButtons.get(id);
      var btn = document.createElement('button');
      btn.className = 'taskbar-item';
      btn.textContent = title;
      btn.addEventListener('click', onClick);
      taskbarWrap.appendChild(btn);
      taskbarButtons.set(id, btn);
      return btn;
    }

    function closeWindow(id) {
      var win = openWindows.get(id);
      if (!win) return;
      win.remove();
      openWindows.delete(id);
      var btn = taskbarButtons.get(id);
      if (btn) {
        btn.remove();
        taskbarButtons.delete(id);
      }
      updateBlur();
    }

    function toggleMinimize(win) {
      win.classList.toggle('minimized');
    }

    function makeDraggable(win, handle) {
      var offsetX = 0, offsetY = 0, dragging = false;

      function onMove(e) {
        if (!dragging) return;
        var newX = e.clientX - offsetX;
        var newY = e.clientY - offsetY;
        var maxX = window.innerWidth - 120;
        var maxY = window.innerHeight - 120;
        win.style.left = Math.min(Math.max(newX, 8), maxX) + 'px';
        win.style.top  = Math.min(Math.max(newY, 8), maxY) + 'px';
      }

      function onUp() {
        dragging = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }

      handle.addEventListener('mousedown', function (e) {
        dragging = true;
        focusWindow(win);
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    }

    function createWindow(id) {
      if (!contentMap[id]) return;

      var existing = openWindows.get(id);
      if (existing) {
        existing.classList.remove('minimized');
        focusWindow(existing);
        updateBlur();
        return;
      }

      var win = document.createElement('div');
      win.className = 'desktop-window resizable';
      win.dataset.windowId = id;
      win.style.width = '520px';
      win.style.height = '420px';
      win.style.left = (80 + Math.random() * 160) + 'px';
      win.style.top  = (80 + Math.random() * 120) + 'px';
      win.style.zIndex = zCounter;

      var header = document.createElement('div');
      header.className = 'window-header';
      header.innerHTML = '<span class="window-title">' + (titles[id] || 'Window') + '</span>';

      var actions = document.createElement('div');
      actions.className = 'window-actions';
      var btnMin = document.createElement('button');
      btnMin.className = 'win-btn min';
      btnMin.innerHTML = '—';
      var btnClose = document.createElement('button');
      btnClose.className = 'win-btn close';
      btnClose.innerHTML = '×';
      actions.appendChild(btnMin);
      actions.appendChild(btnClose);
      header.appendChild(actions);

      var body = document.createElement('div');
      body.className = 'window-body';
      body.innerHTML = contentMap[id];
      body.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right').forEach(function (el) {
        el.classList.add('revealed');
      });
      // Ensure cloned contact form IDs remain unique and label associations stay intact
      var clonedForm = body.querySelector('.contact-form');
      if (clonedForm) {
        var unique = id + '-' + (++idCounter) + '-' + Date.now();
        clonedForm.id = 'contact-form-' + unique;
        var statusEl = clonedForm.querySelector('.form-note');
        if (statusEl) statusEl.id = 'form-status-' + unique;
        clonedForm.querySelectorAll('input, textarea').forEach(function (field, idx) {
          var oldId = field.id;
          var baseId = oldId || ('field-' + idx);
          var newId = baseId + '-' + unique;
          if (oldId) {
            var lbl = clonedForm.querySelector('label[for="' + oldId + '"]');
            if (lbl) lbl.setAttribute('for', newId);
          }
          field.id = newId;
        });
      }

      win.appendChild(header);
      win.appendChild(body);
      windowArea.appendChild(win);
      openWindows.set(id, win);
      initContactForm(); // bind any forms inside the new window

      var taskBtn = ensureTaskbarItem(id, titles[id] || id, function () {
        if (!openWindows.has(id)) {
          createWindow(id);
          return;
        }
        var target = openWindows.get(id);
        var minimized = target.classList.contains('minimized');
        if (minimized) {
          target.classList.remove('minimized');
          focusWindow(target);
        } else {
          toggleMinimize(target);
        }
      });

      btnClose.addEventListener('click', function (e) {
        e.stopPropagation();
        closeWindow(id);
      });

      btnMin.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMinimize(win);
      });

      win.addEventListener('mousedown', function () {
        focusWindow(win);
      });

      makeDraggable(win, header);
      focusWindow(win);
      updateBlur();
    }

    icons.forEach(function (icon) {
      var target = icon.getAttribute('data-window');
      icon.addEventListener('dblclick', function () {
        createWindow(target);
      });
      // Mobile/touch fallback
      icon.addEventListener('click', function () {
        if (window.matchMedia('(pointer: coarse)').matches) {
          createWindow(target);
        }
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
    initDesktopOS();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
