/* ============================================================
   YERI HAN PORTFOLIO — script.js
   • Smooth scroll (Lenis-style via requestAnimationFrame)
   • Scroll progress bar
   • Nav pin on scroll
   • Scroll reveal ([data-reveal])
   • Hero text staggered entrance
   • Mobile menu burger
   • Parallax stat floats in hero
   • Skill tile tilt on mouse
   ============================================================ */

// ─── 1. SMOOTH SCROLL ENGINE ────────────────────────────────
class SmoothScroll {
  constructor() {
    this.current  = 0;
    this.target   = 0;
    this.ease     = 0.085;
    this.raf      = null;
    this.enabled  = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

    if (this.enabled) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      this.createWrapper();
      this.addListeners();
      this.loop();
    }
  }

  createWrapper() {
    this.wrapper = document.createElement('div');
    this.wrapper.id = 'smooth-wrapper';
    Object.assign(this.wrapper.style, {
      position: 'fixed',
      top: '0', left: '0', right: '0',
      willChange: 'transform',
    });
    while (document.body.firstChild) {
      this.wrapper.appendChild(document.body.firstChild);
    }
    document.body.appendChild(this.wrapper);
    this.setHeight();
    window.addEventListener('resize', () => this.setHeight());
  }

  setHeight() {
    document.body.style.height = this.wrapper.scrollHeight + 'px';
  }

  addListeners() {
    window.addEventListener('scroll', () => {
      this.target = window.scrollY;
    }, { passive: true });

    // Anchor click smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        const top = el.getBoundingClientRect().top + this.current;
        this.target = top;
        window.scrollTo(0, top);
      });
    });
  }

  loop() {
    this.current += (this.target - this.current) * this.ease;
    if (Math.abs(this.target - this.current) < 0.05) this.current = this.target;
    this.wrapper.style.transform = `translateY(${-this.current}px)`;
    this.raf = requestAnimationFrame(() => this.loop());
  }

  getScrollY() { return this.enabled ? this.current : window.scrollY; }
}

const scroller = new SmoothScroll();
const getScrollY = () => scroller.getScrollY ? scroller.getScrollY() : window.scrollY;

// ─── 2. PROGRESS BAR ────────────────────────────────────────
const progressBar = document.getElementById('progressBar');

function updateProgress() {
  const scrollY  = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const pct = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

// ─── 3. NAV PIN ─────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('pinned', window.scrollY > 60);
}, { passive: true });

// ─── 4. MOBILE BURGER ───────────────────────────────────────
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  const [s1, s2] = burger.querySelectorAll('span');
  if (open) {
    s1.style.transform = 'translateY(7.5px) rotate(45deg)';
    s2.style.transform = 'translateY(-7.5px) rotate(-45deg)';
  } else {
    s1.style.transform = '';
    s2.style.transform = '';
  }
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => s.style.transform = '');
  });
});

// ─── 5. SCROLL REVEAL ───────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = parseFloat(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('revealed'), delay * 1000);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// ─── 6. HERO STAGGERED ENTRANCE ────────────────────────────
function animateHeroLines() {
  document.querySelectorAll('.hero-hl-row').forEach((row, i) => {
    row.style.opacity  = '0';
    row.style.transform = 'translateY(60px)';
    row.style.transition = `opacity 0.9s ${0.1 + i * 0.15}s cubic-bezier(0.16,1,0.3,1), transform 0.9s ${0.1 + i * 0.15}s cubic-bezier(0.16,1,0.3,1)`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      row.style.opacity   = '1';
      row.style.transform = 'translateY(0)';
    }));
  });

  ['.hero-kicker','.hero-desc','.hero-actions','.hero-badges'].forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.7s ${0.35 + i * 0.12}s ease, transform 0.7s ${0.35 + i * 0.12}s ease`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }));
  });
}

window.addEventListener('DOMContentLoaded', animateHeroLines);

// ─── 7. SKILL TILE TILT ─────────────────────────────────────
document.querySelectorAll('.skill-tile').forEach(tile => {
  tile.addEventListener('mousemove', e => {
    const rect = tile.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
    tile.style.transform = `translateY(-8px) scale(1.01) perspective(600px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  tile.addEventListener('mouseleave', () => {
    tile.style.transform = '';
    tile.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s, border-color 0.3s, background 0.3s';
  });
});

// ─── 8. ACTIVE NAV LINK ─────────────────────────────────────
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${id}`;
      link.style.color = active ? 'var(--ink)' : '';
    });
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));

// ─── 9. PARALLAX STAT FLOATS ────────────────────────────────
const statA = document.querySelector('.stat-float--a');
const statB = document.querySelector('.stat-float--b');

if (statA && statB) {
  window.addEventListener('mousemove', e => {
    const xN = (e.clientX / window.innerWidth  - 0.5);
    const yN = (e.clientY / window.innerHeight - 0.5);
    statA.style.transform = `translate(${xN * -18}px, ${yN * -12}px)`;
    statB.style.transform = `translate(${xN * -10}px, ${yN * -8}px)`;
  });
}

// ─── 10. PHOTO CARD PARALLAX ────────────────────────────────
const photoStack = document.querySelector('.photo-stack');
if (photoStack) {
  window.addEventListener('mousemove', e => {
    const xN = (e.clientX / window.innerWidth  - 0.5);
    const yN = (e.clientY / window.innerHeight - 0.5);
    photoStack.style.transform = `perspective(1000px) rotateX(${yN * -4}deg) rotateY(${xN * 6}deg)`;
    photoStack.style.transition = 'transform 0.1s linear';
  });
}
