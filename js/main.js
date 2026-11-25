/* =====================================================
   INBIO - main.js
   Typewriter, nav, scroll reveal, tabs, slider, forms
   ===================================================== */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Typewriter (hero) ---------- */
  var typedEl = $('#typed');
  if (typedEl) {
    var words = ['Web Coder.', 'Web Designer.', 'Freelancer.'];
    var wi = 0, ci = 0, deleting = false;
    if (reduceMotion) {
      typedEl.textContent = words[0];
    } else {
      (function tick() {
        var word = words[wi];
        ci += deleting ? -1 : 1;
        typedEl.textContent = word.substring(0, ci);
        var delay = deleting ? 55 : 110;
        if (!deleting && ci === word.length) { delay = 1600; deleting = true; }
        else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 400; }
        setTimeout(tick, delay);
      })();
    }
  }

  /* ---------- Header: shadow on scroll + mobile menu ---------- */
  var header = $('#header');
  var nav = $('#mainNav');
  var toggle = $('#navToggle');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      header.classList.toggle('scrolled', window.scrollY > 20);
      spy();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toggle) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('open');
      nav.classList.toggle('open');
    });
  }
  $$('a', nav).forEach(function (a) {
    a.addEventListener('click', function () {
      toggle.classList.remove('open');
      nav.classList.remove('open');
    });
  });

  /* ---------- Scroll spy ---------- */
  var links = $$('a[href^="#"]', nav).filter(function (a) { return !a.classList.contains('btn-buy'); });
  var sections = links.map(function (a) { return $(a.getAttribute('href')); });
  function spy() {
    var pos = window.scrollY + 120, current = 0;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= pos) current = i; });
    links.forEach(function (a, i) { a.classList.toggle('active', i === current); });
  }
  spy();

  /* ---------- Scroll reveal ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var el = e.target;
          // small stagger for siblings in the same row
          var sibs = el.parentElement ? $$('.reveal', el.parentElement) : [el];
          var idx = Math.max(0, sibs.indexOf(el));
          el.style.transitionDelay = Math.min(idx, 5) * 80 + 'ms';
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Resume tabs ---------- */
  var resumeTabs = $$('#resumeTabs .tab-btn');
  function fillBars(panel) {
    $$('.bar i', panel).forEach(function (b) {
      b.style.width = '0';
      requestAnimationFrame(function () { requestAnimationFrame(function () { b.style.width = b.getAttribute('data-w') + '%'; }); });
    });
  }
  resumeTabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      resumeTabs.forEach(function (b) { b.classList.remove('active'); });
      $$('#resume .tab-panel').forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      var panel = $('#tab-' + btn.getAttribute('data-tab'));
      panel.classList.add('active');
      fillBars(panel);
    });
  });

  /* ---------- Testimonial slider ---------- */
  var slides = $$('#testi .slide');
  var dots = $$('#tDots i');
  var cur = 0, busy = false, auto;
  var testi = $('#testi');
  function go(n, dir) {
    n = (n + slides.length) % slides.length;
    if (busy || n === cur) return;
    busy = true;
    testi.classList.add('ready');
    testi.style.setProperty('--dx', dir || (n > cur ? 1 : -1));
    var old = slides[cur];
    old.classList.remove('active');
    old.classList.add('leaving');
    slides[n].classList.add('active');
    dots[cur].classList.remove('active');
    dots[n].classList.add('active');
    setTimeout(function () { old.classList.remove('leaving'); }, 380);
    setTimeout(function () { busy = false; }, 950);
    cur = n;
  }
  function restart() {
    clearInterval(auto);
    if (!reduceMotion) auto = setInterval(function () { go(cur + 1, 1); }, 6000);
  }
  $('#tNext').addEventListener('click', function () { go(cur + 1, 1); restart(); });
  $('#tPrev').addEventListener('click', function () { go(cur - 1, -1); restart(); });
  dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); restart(); }); });
  restart();

  /* ---------- Clients ---------- */
  var logos = {
    ms: 'client-ms.png', wed: 'client-wedding.png', hand: 'client-handcrafted.png',
    studio: 'client-studio.png', fashion: 'client-fashion.png'
  };
  // Each tab = list of [logo, name]. Index 1 (Product Design) matches the design.
  var clientSets = [
    [['hand','Add Dev'],['ms','John Due'],['wed','Smiths Marth'],['fashion','Adon Smith'],['studio','Jone Due'],['ms','Smitha Mila'],['wed','Sultana Mila'],['hand','Jannat'],['fashion','Mila Dus'],['ms','Marth Smiths'],['studio','Hasan Ali'],['hand','Marth Smiths']],
    [['ms','John Due'],['wed','Smiths Marth'],['hand','Add Dev'],['studio','Jone Due'],['ms','John Due'],['fashion','Adon Smith'],['ms','Smitha Mila'],['wed','Sultana Mila'],['ms','Jannat'],['fashion','Mila Dus'],['ms','Marth Smiths'],['hand','Marth Smiths']],
    [['wed','Sultana Mila'],['fashion','Mila Dus'],['ms','John Due'],['hand','Jannat'],['studio','Jone Due'],['wed','Smiths Marth'],['ms','Smitha Mila'],['hand','Add Dev'],['fashion','Adon Smith'],['studio','Hasan Ali'],['ms','Marth Smiths'],['wed','Rafi Khan']],
    [['studio','Jone Due'],['hand','Add Dev'],['ms','John Due'],['fashion','Adon Smith'],['wed','Smiths Marth'],['ms','Jannat'],['hand','Marth Smiths'],['ms','Smitha Mila'],['wed','Sultana Mila'],['fashion','Mila Dus'],['studio','Hasan Ali'],['ms','Marth Smiths']],
    [['fashion','Adon Smith'],['ms','John Due'],['studio','Jone Due'],['wed','Smiths Marth'],['hand','Add Dev'],['ms','Smitha Mila'],['fashion','Mila Dus'],['wed','Sultana Mila'],['ms','Jannat'],['hand','Marth Smiths'],['studio','Hasan Ali'],['ms','Marth Smiths']],
    [['ms','Marth Smiths'],['hand','Marth Smiths'],['wed','Sultana Mila'],['fashion','Mila Dus'],['ms','Smitha Mila'],['studio','Jone Due'],['hand','Jannat'],['wed','Smiths Marth'],['ms','John Due'],['fashion','Adon Smith'],['hand','Add Dev'],['studio','Hasan Ali']]
  ];
  var grid = $('#clientGrid');
  var cTabs = $$('#clientTabs button');
  function renderClients(i) {
    grid.innerHTML = clientSets[i].map(function (c) {
      return '<div class="neu-card client-card"><img src="images/' + logos[c[0]] + '" alt="' + c[1] + '"><span>' + c[1] + '</span></div>';
    }).join('');
  }
  renderClients(1);
  cTabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.classList.contains('active')) return;
      cTabs.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      grid.classList.add('fade');
      setTimeout(function () {
        renderClients(+btn.getAttribute('data-c'));
        grid.classList.remove('fade');
      }, 300);
    });
  });

  /* ---------- Pricing ---------- */
  var plans = [
    { name: 'Design Make this Page', sub: 'Static HTML', price: '$30.00',
      list: ['1 Page Static HTML','Design Customization','Responsive Design','Content Upload','Basic SEO Setup','1 Plugin/Extension','Bootstrap Layout','Cross Browser Test','Design Figma','Source Files'] },
    { name: 'Design Make this Page', sub: 'Elementor', price: '$50.00',
      list: ['1 Page with Elementor','Design Customization','Responsive Design','Content Upload','Design Customization','2 Plugins/Extensions','multipage Elementor','Design Figma','MAintaine Design','Content Upload','Design With XD','8 Plugins/Extensions'] },
    { name: 'Design Make this Page', sub: 'Full Website', price: '$99.00',
      list: ['5 Pages Website','Design Customization','Responsive Design','Content Upload','Advanced SEO Setup','10 Plugins/Extensions','Multipage Elementor','Design Figma','Maintain Design','Speed Optimization','Design With XD','Priority Support'] }
  ];
  var pTabs = $$('#priceTabs .tab-btn');
  var pCard = $('#priceCard');
  var checkSvg = '<svg class="ic"><use href="#i-check"/></svg>';
  function renderPlan(i) {
    var p = plans[i];
    $('#pName').textContent = p.name;
    $('#pSub').textContent = p.sub;
    $('#pPrice').textContent = p.price;
    // 2 columns, 6 rows -> fill left column first like the design
    var items = p.list.slice(0, 12);
    var half = Math.ceil(items.length / 2), rows = [];
    for (var r = 0; r < half; r++) {
      rows.push(items[r]);
      if (items[r + half]) rows.push(items[r + half]);
    }
    $('#pList').innerHTML = rows.map(function (t) { return '<li>' + checkSvg + t + '</li>'; }).join('');
  }
  renderPlan(1);
  pTabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.classList.contains('active')) return;
      pTabs.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      pCard.classList.remove('swap');
      void pCard.offsetWidth; // restart animation
      renderPlan(+btn.getAttribute('data-p'));
      pCard.classList.add('swap');
    });
  });

  /* ---------- Contact form ---------- */
  var form = $('#contactForm');
  if (form) {
    var msg = document.createElement('div');
    msg.className = 'form-msg';
    form.querySelector('.row').appendChild(msg);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('[required]', form).forEach(function (f) {
        var bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
        f.classList.toggle('is-invalid', bad);
        if (bad) ok = false;
      });
      if (!ok) { msg.textContent = 'Please fill in your name, a valid email and a message.'; return; }
      // TODO: connect your backend / form service here
      msg.textContent = 'Thank you! Your message has been sent.';
      form.reset();
    });
    $$('input,textarea', form).forEach(function (f) {
      f.addEventListener('input', function () { f.classList.remove('is-invalid'); });
    });
  }

})();
