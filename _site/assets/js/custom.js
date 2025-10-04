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

// (Get Involved forms removed; CTA buttons now link to future forms page)
