import { useCallback, useEffect, useRef, useState } from 'react';
import CityBackground from './CityBackground.jsx';
import CityWires from './CityWires.jsx';
import LandmarkGlow from './LandmarkGlow.jsx';
import DistrictMarker from './DistrictMarker.jsx';
import DistrictPreview from './DistrictPreview.jsx';
import CityHUD from './CityHUD.jsx';
import CityCat from './CityCat.jsx';
import CatGuide from './CatGuide.jsx';
import useKeys from '../hooks/useKeys.js';
import { DISTRICTS, MAP_W, MAP_H, districtById } from '../data/districts.js';
import { GUIDE } from '../data/guide.js';
import { edgesOf } from './wires.js';
import { sfx } from '../audio/sfx.js';

/* The city is the interface.
   - The ninja cat idles in front of the map and gives a guided tour (Persona-style dialogue): it spotlights each
     district in turn and says what it is and what it contains, then lets you choose.
   - Hover/focus = highlight + small info panel. Click/Enter = open the preview. ENTER DISTRICT = the cat performs
     a ninjutsu vanish and the loading cover takes over.
   - Cables stay dull; the ones attached to the confirmed district light red.
   - When nothing is happening, one landmark at a time slowly fades its outline in and out, as a gentle nudge to click. */
let tourSeen = false; // the tour plays once per page load; replay it by clicking the cat or GUIDE

function useViewport() {
  const read = () => ({ vw: window.innerWidth, vh: window.innerHeight });
  const [v, setV] = useState(read);
  useEffect(() => {
    const on = () => setV(read());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return v;
}

export default function CityMap({ initialId = null, onEnter, onBack }) {
  const { vw, vh } = useViewport();
  const [hover, setHover] = useState(null);
  const [focus, setFocus] = useState(initialId);
  const [open, setOpen] = useState(null);
  const [tour, setTour] = useState(initialId || tourSeen ? null : 0);
  const [cast, setCast] = useState('idle'); // idle | cast | gone
  const [blinkId, setBlinkId] = useState(null);
  const [talking, setTalking] = useState(false); // true while the cat's dialogue is typing
  const refs = useRef({});
  const guideRef = useRef(null);
  const casting = useRef(false);

  const scale = Math.max(vw / MAP_W, vh / MAP_H);
  const W = MAP_W * scale;
  const H = MAP_H * scale;
  const ty = (vh - H) / 2;
  const ms = Math.max(0.95, scale);
  const narrow = vw < 760 || vw / vh < 1.15; // portrait-ish: pan, dock popups, show the selector

  const tourStep = tour !== null ? GUIDE[tour] : null;
  const tourId = tourStep ? tourStep.id : null;

  // horizontal pan (only when the illustration is wider than the window)
  const [tx, setTx] = useState((vw - W) / 2);
  const panTarget = tourId || open || focus;
  useEffect(() => {
    const min = Math.min(0, vw - W);
    if (!panTarget) return;
    const px = districtById(panTarget).anchor.x * scale;
    setTx((cur) => {
      let next = cur;
      if (narrow) next = vw / 2 - px;
      else if (px + next < vw * 0.2) next = vw * 0.2 - px;
      else if (px + next > vw * 0.8) next = vw * 0.8 - px;
      return Math.min(0, Math.max(min, next));
    });
  }, [panTarget, vw, vh, W, scale, narrow]);
  useEffect(() => { setTx((vw - W) / 2); }, [vw, vh]); // eslint-disable-line react-hooks/exhaustive-deps

  const pinOf = (d) => ({ x: tx + d.anchor.x * scale, y: ty + d.anchor.y * scale });
  // the cat perches in front of the screen (fixed to the viewport), so panning the map never moves or clips it
  const perchW = Math.min(540, Math.max(270, vw * 0.36));
  const catW = Math.min(184, Math.max(108, vw * 0.125));
  const guideLeft = perchW * 0.3 + catW + 40;
  const ownRect = (d) => {
    const p = pinOf(d);
    return { x: p.x - d.bounds.l * scale, y: p.y - 6, w: (d.bounds.l + d.bounds.r) * scale, h: d.bounds.b * scale + 6 };
  };
  const avoidRects = (self) => DISTRICTS.filter((d) => d.id !== self.id).flatMap((d) => {
    const p = pinOf(d);
    const lw = 205 * ms;
    const lh = 44 * ms;
    const lx = p.x + d.label.dx * ms;
    return [
      { x: p.x - 30, y: p.y - 30, w: 60, h: 60 },
      { x: d.label.side === 'r' ? lx : lx - lw, y: p.y + d.label.dy * ms - lh / 2, w: lw, h: lh },
    ];
  });

  // what is highlighted: during the tour the cat decides; otherwise hover/focus/open
  const highlighted = tour !== null ? tourId : hover || focus || open;
  const infoId = tour === null && (hover || focus) && (hover || focus) !== open ? hover || focus : null;
  const hot = open ? edgesOf(open) : [];

  /* ----- tour ----- */
  const endTour = useCallback(() => { tourSeen = true; setTour(null); }, []);
  const startTour = useCallback(() => {
    if (casting.current) return;
    setOpen(null); setHover(null); setFocus(null); setTour(0);
  }, []);
  const nextStep = () => setTour((t) => { if (t >= GUIDE.length - 1) { tourSeen = true; return null; } return t + 1; });
  const prevStep = () => setTour((t) => Math.max(0, t - 1));

  /* ----- selecting / entering ----- */
  const openDistrict = useCallback((id) => {
    endTour();
    setOpen(id); setFocus(id); sfx.confirm();
  }, [endTour]);
  const closePreview = useCallback((refocus = true) => {
    setOpen((cur) => {
      if (cur && refocus) setTimeout(() => refs.current[cur]?.focus({ preventScroll: true }), 0);
      return null;
    });
    sfx.back();
  }, []);
  // confirming: the cat performs a ninjutsu vanish, then we go (the loading cover does the rest)
  const enter = useCallback((id) => {
    if (casting.current) return;
    casting.current = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sfx.poof();
    setCast('cast');
    setTimeout(() => { setCast('gone'); onEnter(id); }, reduced ? 120 : 640);
  }, [onEnter]);

  const move = (dx, dy) => {
    const base = districtById(open || focus || hover || 'arsenal');
    let best = null;
    DISTRICTS.forEach((d) => {
      if (d.id === base.id) return;
      const vx = d.anchor.x - base.anchor.x;
      const vy = d.anchor.y - base.anchor.y;
      if (vx * dx + vy * dy <= 0) return;
      const score = Math.hypot(vx, vy) + Math.abs(vx * dy - vy * dx) * 1.2;
      if (!best || score < best.score) best = { id: d.id, score };
    });
    if (!best) return;
    if (open) setOpen(null);
    setFocus(best.id);
    sfx.move();
    refs.current[best.id]?.focus({ preventScroll: true });
  };

  useKeys({
    ArrowLeft: () => (tour !== null ? prevStep() : move(-1, 0)),
    ArrowUp: () => (tour !== null ? prevStep() : move(0, -1)),
    ArrowRight: () => (tour !== null ? guideRef.current?.advance() : move(1, 0)),
    ArrowDown: () => (tour !== null ? guideRef.current?.advance() : move(0, 1)),
    ' ': () => { if (tour !== null) guideRef.current?.advance(); },
    Enter: () => {
      if (tour !== null) { guideRef.current?.advance(); return; }
      const id = open || focus;
      if (!id) { setFocus('arsenal'); refs.current.arsenal?.focus({ preventScroll: true }); return; }
      if (open) enter(open); else openDistrict(id);
    },
    Escape: () => {
      if (tour !== null) endTour();
      else if (open) closePreview();
      else onBack();
    },
  });

  const onStageDown = (e) => {
    if (open && !e.target.closest('.mk, .dp, .dsel, .hud')) closePreview(false);
  };

  /* ----- idle ambience: landmarks slowly fade their outlines in and out, one at a time, in random order ----- */
  const idle = tour === null && !open && !hover && !focus && cast === 'idle';
  useEffect(() => {
    setBlinkId(null);
    if (!idle || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let alive = true;
    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(() => alive && fn(), ms));
    const FADE_MS = 4800; // fade in, hold, fade out (see .glow--run)
    let last = null;
    const cycle = () => {
      const pool = DISTRICTS.filter((d) => d.id !== last);
      const pick = pool[Math.floor(Math.random() * pool.length)].id;
      last = pick;
      setBlinkId(pick);
      later(() => setBlinkId(null), FADE_MS);
      later(cycle, FADE_MS + 2200 + Math.random() * 3200); // a pause between buildings
    };
    later(cycle, 1500 + Math.random() * 1500);
    return () => { alive = false; timers.forEach(clearTimeout); setBlinkId(null); };
  }, [idle]);

  const info = infoId ? districtById(infoId) : null;
  const full = open ? districtById(open) : null;

  return (
    <section className={`cmap ${open ? 'cmap--open' : ''}`} aria-label="City map" onPointerDown={onStageDown}>
      <div className="cmap__stage" style={{ width: W, height: H, transform: `translate(${tx}px, ${ty}px)`, '--ms': ms }}>
        <CityBackground activeId={highlighted} />
        <LandmarkGlow activeId={blinkId} />
        <CityWires hot={hot} />
        <div className="cmap__markers">
          {DISTRICTS.map((d) => (
            <DistrictMarker
              key={d.id}
              ref={(el) => { refs.current[d.id] = el; }}
              district={d}
              highlighted={highlighted === d.id}
              dimmed={!!highlighted && highlighted !== d.id}
              open={open === d.id}
              narrow={narrow}
              onHover={(on) => { if (tour !== null) return; setHover(on ? d.id : null); if (on) sfx.move(); }}
              onFocus={() => setFocus(d.id)}
              onBlur={() => setFocus((cur) => (cur === d.id && !open ? null : cur))}
              onActivate={() => (open === d.id ? enter(d.id) : openDistrict(d.id))}
            />
          ))}
        </div>
      </div>

      <CityHUD onMenu={onBack} onGuide={startTour} hideKeys={tour !== null} />
      {narrow ? (
        <div className="cmap__catfixed"><CityCat phase={cast} talking={talking} onTalk={startTour} /></div>
      ) : (
        <div className="cmap__perch" style={{ width: perchW, '--cw': `${catW}px` }}>
          <svg className="cmap__roof" viewBox="0 0 380 140" preserveAspectRatio="none" aria-hidden="true">
            <polygon points="0,70 150,28 380,60 380,140 0,140" fill="#08090D" />
            <polyline points="0,70 150,28 380,60" fill="none" stroke="#F2F0EA" strokeOpacity=".55" strokeWidth="3" />
            <line x1="40" y1="68" x2="40" y2="48" stroke="#F2F0EA" strokeOpacity=".35" strokeWidth="2.5" />
            <line x1="330" y1="56" x2="330" y2="36" stroke="#F2F0EA" strokeOpacity=".35" strokeWidth="2.5" />
          </svg>
          <CityCat phase={cast} talking={talking} onTalk={startTour} />
        </div>
      )}

      <div className="cmap__overlay">
        {tour !== null && !open && (
          <CatGuide
            ref={guideRef}
            step={tourStep}
            index={tour}
            last={tour === GUIDE.length - 1}
            left={guideLeft}
            onTalking={setTalking}
            docked={narrow}
            vw={vw}
            onNext={nextStep}
            onBack={prevStep}
            onSkip={endTour}
            onPick={openDistrict}
          />
        )}
        {info && <DistrictPreview key={`i-${info.id}`} district={info} pin={pinOf(info)} own={ownRect(info)} avoid={avoidRects(info)} vw={vw} vh={vh} docked={narrow} mode="info" />}
        {full && (
          <DistrictPreview
            key={`f-${full.id}`}
            district={full}
            pin={pinOf(full)}
            own={ownRect(full)}
            avoid={avoidRects(full)}
            vw={vw}
            vh={vh}
            docked={narrow}
            mode="full"
            onEnter={() => enter(full.id)}
            onClose={() => closePreview()}
          />
        )}
      </div>

      {narrow && (
        <nav className="dsel" aria-label="Districts">
          {DISTRICTS.map((d) => (
            <button key={d.id} type="button" className={highlighted === d.id ? 'is-on' : ''} onClick={() => openDistrict(d.id)}>
              <b>{d.no}</b><span>{d.name.replace('THE ', '')}</span>
            </button>
          ))}
        </nav>
      )}
    </section>
  );
}
