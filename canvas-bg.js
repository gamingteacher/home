/**
 * canvas-bg.js — Minimalist videogame-inspired animated background
 * Colors drawn from the site palette (white, grey, red, green)
 * Technique: faint grid + slow horizontal scan lines + drifting particles
 */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const GRID      = 42;          // grid cell size in px
  const GRID_COL  = 'rgba(52,52,52,0.055)';
  const SCAN_COL  = 'rgba(217,76,80,0.07)';
  const DOT_COL   = 'rgba(42,189,81,0.13)';
  const SCAN_H    = 1.5;         // scan line height
  const N_SCANS   = 4;
  const N_DOTS    = 14;

  let W, H;
  let scans = [];
  let dots  = [];
  let raf;
  let paused = false;

  /* ── Helpers ───────────────────────────────── */
  function rand(min, max) { return min + Math.random() * (max - min); }

  /* ── Resize ─────────────────────────────────── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /* ── Init entities ──────────────────────────── */
  function initScans() {
    scans = [];
    for (let i = 0; i < N_SCANS; i++) {
      scans.push({
        y:     rand(0, H),
        speed: rand(0.18, 0.45),  // px per frame
      });
    }
  }

  function initDots() {
    dots = [];
    for (let i = 0; i < N_DOTS; i++) {
      dots.push({
        x:    rand(0, W),
        y:    rand(0, H),
        r:    rand(1.5, 3.2),
        vx:   rand(-0.12, 0.12),
        vy:   rand(-0.12, 0.12),
      });
    }
  }

  /* ── Draw grid ───────────────────────────────── */
  function drawGrid() {
    ctx.strokeStyle = GRID_COL;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    // vertical lines
    for (let x = 0; x < W; x += GRID) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, H);
    }
    // horizontal lines
    for (let y = 0; y < H; y += GRID) {
      ctx.moveTo(0,      y + 0.5);
      ctx.lineTo(W, y + 0.5);
    }
    ctx.stroke();
  }

  /* ── Draw scan lines ─────────────────────────── */
  function drawScans() {
    ctx.fillStyle = SCAN_COL;
    for (const s of scans) {
      ctx.fillRect(0, s.y, W, SCAN_H);
    }
  }

  /* ── Draw dots ───────────────────────────────── */
  function drawDots() {
    ctx.fillStyle = DOT_COL;
    for (const d of dots) {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ── Update ──────────────────────────────────── */
  function update() {
    // scan lines — move downward, wrap
    for (const s of scans) {
      s.y += s.speed;
      if (s.y > H + 4) s.y = -4;
    }
    // dots — drift, bounce off edges
    for (const d of dots) {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
    }
  }

  /* ── Render loop ─────────────────────────────── */
  function render() {
    if (paused) return;
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    drawScans();
    drawDots();
    update();
    raf = requestAnimationFrame(render);
  }

  /* ── Init ────────────────────────────────────── */
  function init() {
    resize();
    initScans();
    initDots();
    render();
  }

  window.addEventListener('resize', () => {
    resize();
    initScans();
    initDots();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      paused = true;
      cancelAnimationFrame(raf);
    } else {
      paused = false;
      render();
    }
  });

  init();
})();
