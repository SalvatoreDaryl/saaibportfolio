import { useEffect, useRef } from 'react';
import { sfx } from '../audio/sfx.js';

/* Living night sky on a single canvas: twinkling stars, shooting stars, drifting clouds,
   a passing plane, and a moon with a restrained halo. Palette stays black/grey/white/red.
   Pauses when the tab is hidden; renders one still frame under prefers-reduced-motion. */
const MOON = '242,240,234';
const RED = '229,36,50';

export default function NightSky({ className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0; let h = 0; let raf = 0; let last = 0; let t = 0;
    let stars = []; let clouds = []; const shooters = []; let plane = null;
    let nextShot = 1.5; let nextPlane = 6;
    let px = 0; let py = 0; let tx = 0; let ty = 0; let lastPx = 99;

    const seed = () => {
      const n = Math.max(90, Math.min(420, Math.floor((w * h) / 4800)));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h * 0.82,
        r: Math.random() < 0.08 ? 1.6 + Math.random() : 0.4 + Math.random() * 1.1,
        ph: Math.random() * 6.28, sp: 0.6 + Math.random() * 2.2,
        d: 0.2 + Math.random() * 0.8, red: Math.random() < 0.05,
      }));
      const cn = w < 700 ? 4 : 7;
      clouds = Array.from({ length: cn }, (_, i) => ({
        x: Math.random() * w, y: h * (0.1 + (i / cn) * 0.5) + Math.random() * 30,
        s: 0.7 + Math.random() * 1.3, v: 6 + Math.random() * 14, a: 0.35 + Math.random() * 0.3,
        puffs: Array.from({ length: 5 }, (__, k) => ({ dx: k * 34 - 60, r: 18 + Math.random() * 22 })),
      }));
    };

    const resize = () => {
      const r = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = r.width; h = r.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      draw(0);
    };

    function cloudPath(c) {
      ctx.beginPath();
      ctx.moveTo(-90, 0);
      c.puffs.forEach((p, i) => {
        if (i === 0) ctx.lineTo(p.dx - p.r, 0);
        ctx.arc(p.dx, -p.r * 0.35, p.r, Math.PI, 0);
      });
      ctx.lineTo(100, 0);
      ctx.closePath();
    }

    /* flat, hard-edged clouds (manga style): a dark body plus a lighter upper band */
    function drawCloud(c) {
      ctx.save();
      ctx.translate(c.x + px * 24, c.y);
      ctx.scale(c.s, c.s);
      cloudPath(c);
      ctx.fillStyle = `rgba(32,33,39,${c.a})`;
      ctx.fill();
      ctx.save();
      ctx.translate(0, -7);
      ctx.scale(0.94, 0.9);
      cloudPath(c);
      ctx.fillStyle = `rgba(${MOON},${c.a * 0.07})`;
      ctx.fill();
      ctx.restore();
      ctx.restore();
    }

    function draw(dt) {
      t += dt;
      // sky
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#08090D');
      g.addColorStop(0.62, '#111218');
      g.addColorStop(1, '#202127');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      // low red haze on the horizon
      const hz = ctx.createRadialGradient(w * 0.45, h, 0, w * 0.45, h, Math.max(w, h) * 0.7);
      hz.addColorStop(0, `rgba(${RED},.16)`);
      hz.addColorStop(1, `rgba(${RED},0)`);
      ctx.fillStyle = hz;
      ctx.fillRect(0, 0, w, h);

      // moon + halo
      const mr = Math.max(26, Math.min(74, Math.min(w, h) * 0.075));
      const small = w < 900;
      const mx = w * (small ? 0.86 : 0.87) + px * 6; const my = h * (small ? 0.58 : 0.13);
      const hg = ctx.createRadialGradient(mx, my, mr * 0.8, mx, my, mr * 3.4);
      hg.addColorStop(0, `rgba(${MOON},.16)`);
      hg.addColorStop(1, `rgba(${MOON},0)`);
      ctx.fillStyle = hg;
      ctx.beginPath(); ctx.arc(mx, my, mr * 3.4, 0, 6.29); ctx.fill();
      ctx.fillStyle = `rgb(${MOON})`;
      ctx.beginPath(); ctx.arc(mx, my, mr, 0, 6.29); ctx.fill();
      ctx.fillStyle = 'rgba(17,18,24,.16)';
      [[-0.3, -0.25, 0.22], [0.25, 0.1, 0.3], [-0.1, 0.4, 0.15], [0.35, -0.4, 0.12]].forEach(([dx, dy, rr]) => {
        ctx.beginPath(); ctx.arc(mx + dx * mr, my + dy * mr, rr * mr, 0, 6.29); ctx.fill();
      });

      // stars
      stars.forEach((s) => {
        const tw = 0.55 + 0.45 * Math.sin(t * s.sp + s.ph);
        ctx.fillStyle = s.red ? `rgba(${RED},${0.5 + tw * 0.5})` : `rgba(${MOON},${0.25 + tw * 0.75})`;
        const x = s.x + px * s.d * 16; const y = s.y + py * s.d * 8;
        if (s.r > 1.5) {
          ctx.fillRect(x - s.r * 2.2, y - 0.5, s.r * 4.4, 1);
          ctx.fillRect(x - 0.5, y - s.r * 2.2, 1, s.r * 4.4);
        }
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.29); ctx.fill();
      });

      // clouds drift
      clouds.forEach((c) => {
        c.x += c.v * dt;
        if (c.x - 110 * c.s > w) c.x = -120 * c.s;
        drawCloud(c);
      });

      // plane
      if (plane) {
        plane.x += plane.v * dt;
        const blink = Math.sin(t * 6) > 0.2;
        ctx.fillStyle = `rgba(${MOON},.8)`;
        ctx.fillRect(plane.x, plane.y, 4, 2);
        ctx.fillStyle = blink ? `rgb(${RED})` : `rgba(${RED},.15)`;
        ctx.fillRect(plane.x - 3, plane.y - 1, 2, 2);
        ctx.fillStyle = `rgba(${MOON},.12)`;
        ctx.fillRect(plane.x - 50, plane.y + 0.5, 46, 1);
        if (plane.x > w + 60) plane = null;
      }

      // shooting stars
      for (let i = shooters.length - 1; i >= 0; i -= 1) {
        const s = shooters[i];
        s.life += dt;
        s.x += s.vx * dt; s.y += s.vy * dt;
        const a = Math.max(0, 1 - s.life / s.max);
        const tailX = s.x - s.vx * 0.16; const tailY = s.y - s.vy * 0.16;
        const lg = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        const col = s.red ? RED : MOON;
        lg.addColorStop(0, `rgba(${col},0)`);
        lg.addColorStop(1, `rgba(${col},${a})`);
        ctx.strokeStyle = lg; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(s.x, s.y); ctx.stroke();
        ctx.fillStyle = `rgba(${col},${a})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, 6.29); ctx.fill();
        if (s.life > s.max) shooters.splice(i, 1);
      }
    }

    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      px += (tx - px) * Math.min(1, dt * 3);
      py += (ty - py) * Math.min(1, dt * 3);
      if (Math.abs(px - lastPx) > 0.004) { parent.style.setProperty('--px', px.toFixed(3)); lastPx = px; }
      nextShot -= dt; nextPlane -= dt;
      if (nextShot <= 0) {
        shooters.push({ x: w * (0.3 + Math.random() * 0.7), y: Math.random() * h * 0.35, vx: -(380 + Math.random() * 420), vy: 160 + Math.random() * 200, life: 0, max: 0.9 + Math.random() * 0.6, red: Math.random() < 0.22 });
        sfx.star();
        nextShot = 2.2 + Math.random() * 4.5;
      }
      if (nextPlane <= 0 && !plane) {
        plane = { x: -40, y: h * (0.08 + Math.random() * 0.2), v: 26 + Math.random() * 14 };
        nextPlane = 16 + Math.random() * 10;
      }
      draw(dt);
      raf = requestAnimationFrame(frame);
    }

    const onMove = (e) => { tx = e.clientX / window.innerWidth - 0.5; ty = e.clientY / window.innerHeight - 0.5; };
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();
    if (!reduced) {
      raf = requestAnimationFrame(frame);
      window.addEventListener('pointermove', onMove, { passive: true });
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas ref={ref} className={`sky ${className}`} aria-hidden="true" />;
}
