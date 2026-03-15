'use strict';

/* ══════════════════════════════════════════
   YARDTECH – PROFESSIONAL INTERACTIONS
   ══════════════════════════════════════════ */

/* ── SCROLL PROGRESS BAR ── */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

/* ── HEADER SCROLL ── */
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  progressBar.style.width = (progress * 100) + '%';
  header?.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── MOBILE NAV ── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.addEventListener('click', e => {
  if (navLinks?.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !navToggle?.contains(e.target)) {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ── WORD-BY-WORD REVEAL (hero title only) ── */
function initWordReveal() {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;

  const walker = document.createTreeWalker(heroTitle, NodeFilter.SHOW_TEXT, null);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (!node.textContent.trim()) continue;
    // Skip text inside .text-gradient spans — background-clip:text breaks inside overflow:hidden word-wrap
    let p = node.parentNode, skip = false;
    while (p && p !== heroTitle) {
      if (p.classList && p.classList.contains('text-gradient')) { skip = true; break; }
      p = p.parentNode;
    }
    if (!skip) textNodes.push(node);
  }

  textNodes.forEach(textNode => {
    const parts = textNode.textContent.split(/(\s+)/);
    const frag  = document.createDocumentFragment();
    parts.forEach(part => {
      if (!part || /^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part));
      } else {
        const wrap  = document.createElement('span');
        wrap.className = 'word-wrap';
        const inner = document.createElement('span');
        inner.className = 'word';
        inner.textContent = part;
        wrap.appendChild(inner);
        frag.appendChild(wrap);
      }
    });
    textNode.parentNode.replaceChild(frag, textNode);
  });

  setTimeout(() => {
    heroTitle.querySelectorAll('.word').forEach((w, i) => {
      w.style.transitionDelay = (i * 80) + 'ms';
      w.classList.add('word-visible');
    });
  }, 150);
}

/* ── INFINITE LOGO MARQUEE ── */
function initMarquee() {
  const row = document.querySelector('.clients-row');
  if (!row) return;
  const items = Array.from(row.children);
  if (!items.length) return;
  items.forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    row.appendChild(clone);
  });
  row.classList.add('marquee-track');
}

/* ── AOS (Animate On Scroll) ── */
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.aosDelay || 0);
      setTimeout(() => entry.target.classList.add('aos-visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
}

/* ── COUNTER ANIMATION (easeOut cubic) ── */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el       = entry.target;
      const target   = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const start    = performance.now();
      const tick = now => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.round(easeOut(progress) * target).toLocaleString('tr-TR');
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

/* ── CHART BARS ── */
function initChartBars() {
  const bars = document.querySelectorAll('.chart-bar');
  if (!bars.length) return;
  bars.forEach((bar, i) => {
    const h = bar.style.height;
    bar.style.height = '0%';
    setTimeout(() => {
      bar.style.transition = 'height 0.9s cubic-bezier(.16,1,.3,1)';
      bar.style.height = h;
    }, 600 + i * 120);
  });
}

/* ── FLOATING TECH TAGS in hero background ── */
function initFloatingTags() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;
  const tags = ['.NET 8', 'React', 'AI / ML', 'Kubernetes', 'Azure', 'TypeScript', 'Docker', 'GraphQL'];
  const positions = [
    { left: '8%',  top: '18%' },
    { left: '72%', top: '12%' },
    { left: '62%', top: '72%' },
    { left: '5%',  top: '62%' },
    { left: '82%', top: '45%' },
    { left: '38%', top: '82%' },
    { left: '24%', top: '30%' },
    { left: '88%', top: '28%' },
  ];
  tags.forEach((tag, i) => {
    const el = document.createElement('div');
    el.className = 'floating-tag';
    el.textContent = tag;
    el.style.left = positions[i].left;
    el.style.top  = positions[i].top;
    el.style.animationDuration = (9 + i * 1.1) + 's';
    el.style.animationDelay   = -(i * 1.3) + 's';
    heroBg.appendChild(el);
  });
}

/* ── SPARKLE PARTICLES in hero background ── */
function initSparkles() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;
  const colors = ['rgba(91,130,255,1)', 'rgba(0,200,255,1)', 'rgba(167,139,250,1)', 'rgba(255,255,255,.8)'];
  for (let i = 0; i < 14; i++) {
    const s    = document.createElement('div');
    s.className = 'sparkle-dot';
    const size  = 1.5 + Math.random() * 2.5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    s.style.cssText = [
      `width:${size}px`, `height:${size}px`,
      `left:${8 + Math.random() * 84}%`, `top:${10 + Math.random() * 75}%`,
      `background:${color}`, `box-shadow:0 0 ${size * 2.5}px ${color}`,
      `animation-duration:${4 + Math.random() * 6}s`,
      `animation-delay:${-(Math.random() * 6)}s`,
    ].join(';');
    heroBg.appendChild(s);
  }
}

/* ── CARD MOUSE GLOW ── */
function initCardGlow() {
  const sel = '.service-card, .contact-form-card, .ai-cap, .consulting-card, .testimonial-card, .stat-item';
  document.querySelectorAll(sel).forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width  * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - rect.top)  / rect.height * 100) + '%');
    });
  });
}

/* ── 3D CARD TILT ── */
function initTilt() {
  const sel = '.service-card, .testimonial-card, .ai-cap, .consulting-card, .value-card, .expertise-card';
  document.querySelectorAll(sel).forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-5px) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ── HERO MOUSE SPOTLIGHT ── */
function initHeroSpotlight() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    hero.style.setProperty('--sx', ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%');
    hero.style.setProperty('--sy', ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%');
  });
}

/* ── NEURAL NETWORK CANVAS (AI company signature effect) ── */
function initNeuralNetwork() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'neural-canvas';
  heroBg.insertBefore(canvas, heroBg.firstChild);
  const ctx = canvas.getContext('2d');

  let W, H, nodes = [];
  const mouse = { x: -2000, y: -2000 };

  function resize() {
    W = canvas.width  = heroBg.offsetWidth;
    H = canvas.height = heroBg.offsetHeight;
  }

  function makeNodes() {
    nodes = Array.from({ length: 42 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .4,
      vy: (Math.random() - .5) * .4,
      r:  1.2 + Math.random() * 1.6,
      cyan: Math.random() > .65,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  heroBg.addEventListener('mousemove', e => {
    const r = heroBg.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  heroBg.addEventListener('mouseleave', () => { mouse.x = -2000; mouse.y = -2000; });

  function frame() {
    ctx.clearRect(0, 0, W, H);
    const MAX = 145, MR = 110;

    nodes.forEach(n => {
      /* mouse repulsion */
      const dx = n.x - mouse.x, dy = n.y - mouse.y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < MR) {
        const f = (MR - d) / MR * .9;
        n.vx += (dx / d) * f;
        n.vy += (dy / d) * f;
      }
      n.vx *= .97; n.vy *= .97;
      const spd = Math.sqrt(n.vx*n.vx + n.vy*n.vy);
      if (spd > 1.4) { n.vx = n.vx/spd*1.4; n.vy = n.vy/spd*1.4; }
      n.x += n.vx; n.y += n.vy; n.phase += .016;
      if (n.x < 0) { n.x = 0; n.vx = Math.abs(n.vx); }
      if (n.x > W) { n.x = W; n.vx = -Math.abs(n.vx); }
      if (n.y < 0) { n.y = 0; n.vy = Math.abs(n.vy); }
      if (n.y > H) { n.y = H; n.vy = -Math.abs(n.vy); }
    });

    /* connections */
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < MAX) {
          const a = (1 - d / MAX) * .18;
          ctx.strokeStyle = `rgba(91,130,255,${a})`;
          ctx.lineWidth = .7;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    /* nodes */
    nodes.forEach(n => {
      const pulse  = .5 + .5 * Math.sin(n.phase);
      const alpha  = .25 + .45 * pulse;
      const col    = n.cyan ? '0,200,255' : '91,130,255';
      const grad   = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
      grad.addColorStop(0, `rgba(${col},${alpha * .6})`);
      grad.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(${col},${alpha})`;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    });

    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', () => { resize(); makeNodes(); });
  resize(); makeNodes(); requestAnimationFrame(frame);
}

/* ── LIVE DASHBOARD (hero kart canlı veri simülasyonu) ── */
function initLiveDashboard() {
  const bars = document.querySelectorAll('.chart-bar');
  if (!bars.length) return;

  const bases = Array.from(bars).map(b => parseInt(b.style.height));

  setInterval(() => {
    bars.forEach((bar, i) => {
      const v = Math.max(15, Math.min(95, bases[i] + Math.round((Math.random() - .5) * 14)));
      bar.style.height = v + '%';
    });
  }, 2600);

  const timeEl = document.querySelector('.status-time');
  if (timeEl) {
    const labels = ['Şimdi', 'Az önce', '1s önce', 'Şimdi'];
    let t = 0;
    setInterval(() => { timeEl.textContent = labels[++t % labels.length]; }, 3200);
  }
}

/* ── MAGNETIC BUTTONS ── */
function initMagneticBtns() {
  document.querySelectorAll('.btn-primary, .btn-outline, .btn-ghost, .btn-primary-sm').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - .5) * 12;
      const y = ((e.clientY - rect.top)  / rect.height - .5) * 12;
      btn.style.transform = `translate(${x}px,${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ── CLICK RIPPLE ── */
function initRipple() {
  document.querySelectorAll('.btn-primary, .btn-outline, .btn-ghost').forEach(btn => {
    btn.addEventListener('click', e => {
      const rect = btn.getBoundingClientRect();
      const rip  = document.createElement('span');
      rip.className = 'btn-ripple';
      rip.style.left = (e.clientX - rect.left) + 'px';
      rip.style.top  = (e.clientY - rect.top)  + 'px';
      btn.appendChild(rip);
      setTimeout(() => rip.remove(), 700);
    });
  });
}

/* ── TYPEWRITER CYCLING on hero desc ── */
function initTypewriter() {
  const el = document.querySelector('.hero-desc');
  if (!el) return;

  const lines = [
    'Yapay zeka çözümleri, ileri veri bilimi ve stratejik teknoloji danışmanlığıyla işletmenizin verilerini rekabet avantajına dönüştürüyoruz.',
    'GPT-4o, Claude ve özel LLM entegrasyonlarıyla iş süreçlerinizi akıllı otomasyona taşıyoruz.',
    '50M+ günlük veri işleme kapasitesiyle işletmenizin büyüme motorunu inşa ediyoruz.',
    'Türkiye\'nin en güçlü yapay zeka ve veri bilimi ekibi, dijital dönüşümünüzde yanınızda.',
  ];

  let li = 0, ci = 0, deleting = false, waiting = false;
  const WRITE_SPEED = 28, DELETE_SPEED = 14, PAUSE = 2800;

  el.style.borderRight = '2px solid rgba(91,130,255,.7)';
  el.style.animation = 'cursor-blink .8s step-end infinite';
  el.textContent = '';

  function tick() {
    if (waiting) return;
    const full = lines[li];
    if (!deleting) {
      el.textContent = full.slice(0, ++ci);
      if (ci === full.length) { deleting = true; waiting = true; setTimeout(() => { waiting = false; }, PAUSE); return; }
      setTimeout(tick, WRITE_SPEED);
    } else {
      el.textContent = full.slice(0, --ci);
      if (ci === 0) { deleting = false; li = (li + 1) % lines.length; }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  setTimeout(tick, 1200);
}

/* ── LIVE NOTIFICATION WIDGET ── */
function initLiveNotif() {
  const el = document.getElementById('liveNotif');
  if (!el) return;
  const titleEl = document.getElementById('lnotif-title');
  const subEl   = document.getElementById('lnotif-sub');

  const notifications = [
    { title: 'Yeni Proje Başladı',        sub: 'Makine öğrenimi • az önce' },
    { title: 'Model Eğitimi Tamamlandı',   sub: 'Doğruluk: %97.3 • 2dk önce' },
    { title: 'Veri Pipeline Hazır',        sub: '1.2M kayıt işlendi • 5dk önce' },
    { title: 'Yeni İstemci Onboarding',    sub: 'Danışmanlık • başladı' },
    { title: 'Deployment Başarılı',        sub: 'v3.2.1 canlıya alındı • az önce' },
    { title: 'Anomali Tespiti Aktif',      sub: '99.8% hassasiyet • çalışıyor' },
  ];
  let ni = 0;

  function show() {
    if (el.dataset.dismissed) return;
    const n = notifications[ni % notifications.length];
    titleEl.textContent = n.title;
    subEl.textContent   = n.sub;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 4500);
    ni++;
  }

  setTimeout(show, 4000);
  setInterval(show, 9000);
}

/* ── CTA CONFETTI BURST ── */
function initConfetti() {
  const btn = document.querySelector('.cta-section .btn-primary');
  if (!btn) return;
  btn.addEventListener('mouseenter', () => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      const angle = (i / 18) * Math.PI * 2;
      const dist  = 40 + Math.random() * 50;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const colors = ['#5B82FF','#00C8FF','#a855f7','#34d399','#FBBF24'];
      p.style.cssText = `
        position:fixed;
        left:${cx}px; top:${cy}px;
        width:${4 + Math.random()*4}px;
        height:${4 + Math.random()*4}px;
        background:${colors[i % colors.length]};
        border-radius:${Math.random() > .5 ? '50%' : '2px'};
        pointer-events:none;
        z-index:99998;
        transform:translate(-50%,-50%);
        animation: confetti-fly .8s ease-out forwards;
        --dx:${dx}px; --dy:${dy}px;
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 900);
    }
  });
}

/* ── ACTIVE NAV HIGHLIGHT ── */
(function() {
  const links = document.querySelectorAll('.nav-link');
  const path  = window.location.pathname.replace(/\/$/, '') || '/';
  links.forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href && (path === href || path.startsWith(href) && href !== '/')) {
      a.classList.add('nav-active');
    }
  });
})();

/* ── CURSOR DOT ── */

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initCounters();
  initChartBars();
  initWordReveal();
  initMarquee();
  initLiveDashboard();
  initTypewriter();
  initRings();
  initLiveNotif();
  initBenchmarkBars();
  initTerminal();
  initScrollRevealCards();
});

/* ── RING GAUGES ── */
function initRings() {
  const fills = document.querySelectorAll('.ring-fill[data-pct]');
  if (!fills.length) return;
  const C = 2 * Math.PI * 50; // 314.159

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const pct = parseFloat(el.dataset.pct);
      el.style.strokeDasharray = C;
      el.style.strokeDashoffset = C;
      requestAnimationFrame(() => {
        setTimeout(() => {
          el.style.transition = 'stroke-dashoffset 2.2s cubic-bezier(.4,0,.2,1)';
          el.style.strokeDashoffset = C * (1 - pct / 100);
        }, 80);
      });
      observer.unobserve(el);
    });
  }, { threshold: 0.3 });

  fills.forEach(el => {
    el.style.strokeDasharray = C;
    el.style.strokeDashoffset = C;
    observer.observe(el);
  });
}

/* ── TERMINAL LIVE ANIMATION ── */
function initTerminal() {
  const tpsEl  = document.getElementById('tps-counter');
  const reqEl  = document.getElementById('req-counter');
  const log1   = document.getElementById('live-log-1');
  const log2   = document.getElementById('live-log-2');
  const log3   = document.getElementById('live-log-3');
  if (!tpsEl) return;

  const logs = [
    '[INFO] inference request → latency 11ms',
    '[INFO] batch processed: 128 tokens',
    '[PERF] throughput: 4,913 tok/s',
    '[INFO] model checkpoint saved',
    '[INFO] inference request → latency 9ms',
    '[PERF] GPU utilization: 94.2%',
    '[INFO] embedding computed: 768-dim',
    '[INFO] request queue: 3 pending',
    '[PERF] cache hit ratio: 87%',
    '[INFO] inference request → latency 13ms',
    '[INFO] tokens generated: 512',
    '[PERF] memory usage: 38.4 GB / 80 GB',
  ];
  let li = 0;

  function pushLog() {
    const lines = [log1, log2, log3];
    lines[2].textContent = lines[1].textContent;
    lines[1].textContent = lines[0].textContent;
    lines[0].textContent = logs[li % logs.length];
    li++;
  }

  function updateCounters() {
    const tps = 4800 + Math.floor(Math.random() * 300);
    const req = 1250 + Math.floor(Math.random() * 100);
    tpsEl.textContent = tps.toLocaleString('tr-TR');
    reqEl.textContent = req.toLocaleString('tr-TR');
  }

  pushLog();
  setInterval(() => { pushLog(); updateCounters(); }, 2000);
  setInterval(updateCounters, 800);
}

/* ── PARTICLE TRAIL ── */

/* ── BENCHMARK BARS ── */
function initBenchmarkBars() {
  const bars = document.querySelectorAll('.bm-bar[data-w]');
  if (!bars.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      setTimeout(() => { el.style.width = el.dataset.w + '%'; }, 200);
      observer.unobserve(el);
    });
  }, { threshold: 0.3 });
  bars.forEach(b => observer.observe(b));
}

/* ── SCROLL REVEAL CARDS (stagger) ── */
function initScrollRevealCards() {
  const cards = document.querySelectorAll(
    '.service-card, .testimonial-card, .value-card, .expertise-card, .consulting-card, .ai-cap'
  );
  if (!cards.length) return;

  const seen = new WeakSet();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || seen.has(entry.target)) return;
      seen.add(entry.target);
      const siblings = [...entry.target.parentElement.children];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.style.transition = 'opacity .6s ease, transform .6s cubic-bezier(.2,.8,.2,1)';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, idx * 80);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(28px)';
    observer.observe(card);
  });
}
