// Mobile menu toggle
(function () {
  var toggle = document.querySelector('.amf-nav__toggle');
  var menu = document.getElementById('amfNavMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('show');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
})();

// Hide on scroll down, show on scroll up
let prevScrollPos = window.pageYOffset;
const nav = document.getElementById('amfNav');
const spacer = document.querySelector('.amf-nav-spacer');
let lastShowPos = window.pageYOffset;
let hideTimer = null;
const HIDE_DELAY = 20; // ms delay before hiding (very short)
const SCROLL_HIDE_THRESHOLD = 24; // px user must scroll down before hide

function syncSpacerHeight() {
  if (nav && spacer) {
    spacer.style.height = nav.offsetHeight + 'px';
    try { document.documentElement.style.setProperty('--amf-nav-h', nav.offsetHeight + 'px'); } catch(e) {}
  }
}

window.addEventListener('resize', syncSpacerHeight);
window.addEventListener('load', syncSpacerHeight);

window.addEventListener('scroll', function () {
  const currentScrollPos = window.pageYOffset;
  if (!nav) return;

  // Toggle stronger shadow once scrolled
  if (currentScrollPos > 2) {
    nav.classList.add('is-scrolled');
  } else {
    nav.classList.remove('is-scrolled');
  }

  // Always show when near the very top
  if (currentScrollPos < 2) {
    clearTimeout(hideTimer);
    nav.style.top = '0';
    lastShowPos = currentScrollPos;
    prevScrollPos = currentScrollPos;
    return;
  }

  // Hide on scroll down (after threshold + short delay), show on scroll up
  if (prevScrollPos > currentScrollPos) {
    // scrolling up – show immediately
    clearTimeout(hideTimer);
    nav.style.top = '0';
    lastShowPos = currentScrollPos;
  } else {
    // scrolling down – only hide after threshold + delay
    if (currentScrollPos - lastShowPos > SCROLL_HIDE_THRESHOLD) {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () {
        nav.style.top = '-' + nav.offsetHeight + 'px';
      }, HIDE_DELAY);
    }
  }
  prevScrollPos = currentScrollPos;
});

// Smooth scroll with offset for in-page anchors
(function () {
  var links = document.querySelectorAll('a[href^="#"], a[href^="/#"], a[href*="/#"]');
  function samePage(href) {
    try { var u = new URL(href, window.location.origin); return u.pathname === window.location.pathname; } catch(e){ return false; }
  }
  function scrollWithOffset(target) {
    var el = document.querySelector(target);
    if (!el) return;
    var navEl = document.getElementById('amfNav');
    var offset = navEl ? navEl.offsetHeight + 8 : 64;
    var top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }
  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#') || samePage(href)) {
        var hash = href.includes('#') ? '#' + href.split('#')[1] : href;
        if (hash && hash.length > 1) {
          e.preventDefault();
          scrollWithOffset(hash);
        }
      }
    });
  });
})();

// Active section highlighting (IntersectionObserver)
(function () {
  var sections = ['#about', '#pillars', '#event-types', '#get-involved'];
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.amf-nav__links a'));
  if (!('IntersectionObserver' in window)) return;
  var linkFor = function (id) {
    return navLinks.find(function (a) {
      var href = a.getAttribute('href') || '';
      return href.endsWith(id) || href === id || href === ('/' + id);
    });
  };
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var id = '#' + (entry.target.id || '');
      var link = linkFor(id);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(function (l) { l.classList.remove('is-active'); });
        link.classList.add('is-active');
      }
    });
  }, { root: null, rootMargin: '0px 0px -60% 0px', threshold: 0.2 });
  sections.forEach(function (sel) {
    var el = document.querySelector(sel);
    if (el) io.observe(el);
  });
})();

// Google Forms inline success handler (hidden iframe technique)
(function () {
  var form = document.getElementById('partnerForm');
  var iframe = document.getElementById('gformTarget');
  var success = document.getElementById('partnerSuccess');
  if (!form || !iframe || !success) return;
  function setError(el, msg) {
    var field = el.closest('.gfield') || el.parentElement;
    if (!field) return;
    field.classList.add('error');
    var err = field.querySelector('.field-error');
    if (err) { err.textContent = msg; err.hidden = false; }
  }
  function clearError(el) {
    var field = el.closest('.gfield') || el.parentElement;
    if (!field) return;
    field.classList.remove('error');
    var err = field.querySelector('.field-error');
    if (err) { err.hidden = true; }
  }
  function validate() {
    var valid = true;
    var firstBad = null;
    // Required text/email
    var required = form.querySelectorAll('input[required], textarea[required]');
    required.forEach(function (el) {
      clearError(el);
      if (el.type === 'checkbox') return; // consent handled later
      if (!el.value || (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value))) {
        valid = false;
        if (!firstBad) firstBad = el;
        var msg = el.type === 'email' ? 'Please enter a valid email address.' : 'This field is required.';
        setError(el, msg);
      }
    });
    // Partnership check at least one
    var checks = form.querySelectorAll('input[name="entry.555555555"]');
    var oneChecked = Array.prototype.some.call(checks, function (c) { return c.checked; });
    var partErr = document.getElementById('partnershipError');
    if (partErr) partErr.hidden = oneChecked;
    if (!oneChecked) { valid = false; if (!firstBad && checks[0]) firstBad = checks[0]; }
    // Consent
    var consent = form.querySelector('input[name="entry.777777777"]');
    var consentErr = document.getElementById('consentError');
    if (consent && !consent.checked) { valid = false; if (!firstBad) firstBad = consent; if (consentErr) consentErr.hidden = false; }
    else if (consentErr) consentErr.hidden = true;
    if (!valid && firstBad) {
      try { firstBad.focus({ preventScroll: false }); } catch(e) { firstBad.focus(); }
    }
    return valid;
  }
  form.addEventListener('submit', function (e) {
    if (!validate()) { e.preventDefault(); return; }
    form.dataset.submitted = 'true';
  });
  form.addEventListener('input', function (e) {
    var t = e.target; if (!t) return;
    if (t.matches('input, textarea, select')) clearError(t);
  });
  iframe.addEventListener('load', function () {
    if (form.dataset.submitted === 'true') {
      success.hidden = false;
      success.classList.add('show');
      form.reset();
      form.dataset.submitted = 'false';
      // Optional: scroll success message into view on mobile
      try { success.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch(e) {}
    }
  });
})();

// Observe form card and trigger entrance animation when in view
(function () {
  var card = document.querySelector('#partner-form .form-card');
  if (!('IntersectionObserver' in window)) return;
  // Also support embedded form cards on forms page (hide skeleton on load)
  var embedCards = document.querySelectorAll('.embed-card');
  embedCards.forEach(function(card){
    var frame = card.querySelector('iframe.embed-iframe');
    if (!frame) return;
    frame.addEventListener('load', function(){ card.classList.add('is-loaded'); });
  });
  if (!card) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        card.classList.add('in-view');
        io.disconnect();
      }
    });
  }, { root: null, rootMargin: '0px 0px -20% 0px', threshold: 0.2 });
  io.observe(card);
})();

// (Get Involved forms removed; CTA buttons now link to future forms page)
