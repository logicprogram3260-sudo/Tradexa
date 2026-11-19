/* ==========================================================================
   TRADEXA — Interactions & Motion
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------------
     1. CURSOR GLOW
  --------------------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
  }

  /* ---------------------------------------------------------------------
     2. MOBILE NAV
  --------------------------------------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => mainNav.classList.remove('open'));
    });
  }

  /* ---------------------------------------------------------------------
     3. SCROLL REVEAL
  --------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------------------
     4. ANIMATED COUNTERS
  --------------------------------------------------------------------- */
  const counters = document.querySelectorAll('.hero-stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 1600;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target).toLocaleString();
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target.toLocaleString();
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  /* ---------------------------------------------------------------------
     5. PARTICLE CANVAS (hero ambient particles)
  --------------------------------------------------------------------- */
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    function initParticles() {
      const count = Math.min(70, Math.floor((w * h) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.5 + 0.15
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244,196,48,${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    window.addEventListener('resize', () => { resize(); initParticles(); });
    resize(); initParticles(); draw();
  }

  /* ---------------------------------------------------------------------
     6. TOP TICKER TAPE (simulated live fluctuation)
  --------------------------------------------------------------------- */
  const tickerTrack = document.getElementById('tickerTrack');
  const tickerAssets = [
    { name: 'XAU/USD', price: 2412.85, decimals: 2 },
    { name: 'EUR/USD', price: 1.0842, decimals: 4 },
    { name: 'GBP/USD', price: 1.2731, decimals: 4 },
    { name: 'USD/JPY', price: 156.24, decimals: 2 },
    { name: 'BTC/USD', price: 67450, decimals: 0 },
    { name: 'ETH/USD', price: 3512, decimals: 0 },
    { name: 'XAG/USD', price: 28.64, decimals: 2 },
    { name: 'US30', price: 39840, decimals: 0 }
  ];

  function renderTicker() {
    if (!tickerTrack) return;
    const items = tickerAssets.map(a => {
      const dir = Math.random() > 0.5 ? 'up' : 'down';
      const arrow = dir === 'up' ? '▲' : '▼';
      const pct = (Math.random() * 1.4).toFixed(2);
      return `<span class="ticker-item"><b>${a.name}</b> ${a.price.toFixed(a.decimals)} <span class="${dir}">${arrow} ${pct}%</span></span>`;
    }).join('');
    // duplicate content twice for seamless marquee loop
    tickerTrack.innerHTML = items + items;
  }
  renderTicker();

  function fluctuateTicker() {
    tickerAssets.forEach(a => {
      const delta = a.price * (Math.random() * 0.002 - 0.001);
      a.price = Math.max(0, a.price + delta);
    });
    renderTicker();
  }
  setInterval(fluctuateTicker, 4000);

  /* ---------------------------------------------------------------------
     7. HERO TERMINAL PRICE SIMULATION
  --------------------------------------------------------------------- */
  const terminalPrice = document.getElementById('terminalPrice');
  const terminalChange = document.getElementById('terminalChange');
  let basePrice = 2412.85;

  function fluctuateTerminal() {
    const delta = (Math.random() * 3.2 - 1.6);
    basePrice = Math.max(2350, basePrice + delta);
    const pct = ((delta / basePrice) * 100).toFixed(2);
    const isUp = delta >= 0;
    if (terminalPrice) terminalPrice.textContent = basePrice.toFixed(2);
    if (terminalChange) {
      terminalChange.textContent = `${isUp ? '▲' : '▼'} ${Math.abs(pct)}%`;
      terminalChange.classList.toggle('up', isUp);
      terminalChange.classList.toggle('down', !isUp);
    }
  }
  setInterval(fluctuateTerminal, 2600);

  /* ---------------------------------------------------------------------
     8. TRADINGVIEW LIVE XAUUSD WIDGET
  --------------------------------------------------------------------- */
  function initTradingViewWidget() {
    if (typeof TradingView === 'undefined') {
      // retry shortly if the external script hasn't finished loading yet
      setTimeout(initTradingViewWidget, 300);
      return;
    }
    new TradingView.widget({
      autosize: true,
      symbol: 'OANDA:XAUUSD',
      interval: '15',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      toolbar_bg: '#0a0e18',
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      backgroundColor: '#0a0e18',
      gridColor: 'rgba(255,255,255,0.06)',
      container_id: 'tv_gold_chart'
    });
  }
  initTradingViewWidget();

  /* ---------------------------------------------------------------------
     9. SIGNAL REVERSAL TOGGLE
  --------------------------------------------------------------------- */
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* ---------------------------------------------------------------------
     10. CRYPTO GRID
  --------------------------------------------------------------------- */
  const cryptoGrid = document.getElementById('cryptoGrid');
  const cryptoAssets = [
    { symbol: 'BTC', name: 'Bitcoin', price: 67450, change: 2.4, color: 'linear-gradient(135deg,#f7931a,#c97200)' },
    { symbol: 'ETH', name: 'Ethereum', price: 3512, change: 1.8, color: 'linear-gradient(135deg,#8a9bf0,#4c5fd6)' },
    { symbol: 'SOL', name: 'Solana', price: 178.32, change: -0.9, color: 'linear-gradient(135deg,#14f1c6,#8b5cf6)' },
    { symbol: 'BNB', name: 'BNB', price: 612.4, change: 0.6, color: 'linear-gradient(135deg,#f3ba2f,#c99413)' }
  ];

  function renderCryptoGrid() {
    if (!cryptoGrid) return;
    cryptoGrid.innerHTML = cryptoAssets.map(c => {
      const dir = c.change >= 0 ? 'up' : 'down';
      const arrow = c.change >= 0 ? '▲' : '▼';
      return `
        <div class="crypto-card">
          <div class="crypto-card-top">
            <span class="crypto-icon" style="background:${c.color}">${c.symbol.slice(0,1)}</span>
            <div>
              <div class="crypto-name">${c.name}</div>
              <div class="crypto-symbol">${c.symbol}/USD</div>
            </div>
          </div>
          <div class="crypto-price">$${c.price.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
          <div class="crypto-change ${dir}">${arrow} ${Math.abs(c.change).toFixed(2)}%</div>
        </div>`;
    }).join('');
  }
  renderCryptoGrid();

  setInterval(() => {
    cryptoAssets.forEach(c => {
      const delta = c.price * (Math.random() * 0.006 - 0.003);
      c.price = Math.max(0.01, c.price + delta);
      c.change = (Math.random() * 4 - 1.6);
    });
    renderCryptoGrid();
  }, 5000);

  /* ---------------------------------------------------------------------
     11. FAQ ACCORDION
  --------------------------------------------------------------------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------------------------------------------------------------------
     12. ACTIVE NAV LINK ON SCROLL
  --------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => navObserver.observe(s));

  /* ---------------------------------------------------------------------
     13. HEADER SHADOW ON SCROLL + PARALLAX HERO GLOWS
  --------------------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const glow1 = document.querySelector('.hero-glow-1');
  const glow2 = document.querySelector('.hero-glow-2');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (header) header.style.boxShadow = y > 40 ? '0 10px 30px -20px rgba(0,0,0,0.6)' : 'none';
    if (glow1) glow1.style.transform = `translateY(${y * 0.15}px)`;
    if (glow2) glow2.style.transform = `translateY(${y * -0.1}px)`;
  }, { passive: true });

  /* ---------------------------------------------------------------------
     14. CHAT FAB
  --------------------------------------------------------------------- */
  const chatFab = document.getElementById('chatFab');
  if (chatFab) {
    chatFab.addEventListener('click', () => {
      alert('Live chat would open here — connect this button to your support widget (Intercom, Crisp, Tawk.to, etc).');
    });
  }

});
