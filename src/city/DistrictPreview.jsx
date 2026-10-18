import { useLayoutEffect, useRef, useState } from 'react';

/* Popup for one district. mode "info" = small hover/focus panel; mode "full" = the opened preview with
   ENTER DISTRICT. Placed beside the marker's pin (viewport coordinates), flipped/clamped so it never
   clips, with a connector line. On narrow screens it docks above the bottom selector instead. */
const M = 12;
const GAP = 14;
const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
const overlap = (a, b) => (hit(a, b) ? Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) : 0) * (hit(a, b) ? Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) : 0);

export default function DistrictPreview({ district, pin, own, avoid = [], vw, vh, docked, mode, onEnter, onClose }) {
  const ref = useRef(null);
  const [box, setBox] = useState(null);
  const full = mode === 'full';

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (docked) {
      setBox({ x: M, y: vh - h - 74, w: vw - M * 2, h, docked: true });
      return;
    }
    // try beside / below / above the landmark; keep the first spot that covers nothing important
    const top = Math.max(M + 56, Math.min(pin.y - 14, vh - h - M));
    const cands = [
      { x: own.x + own.w + GAP, y: top },
      { x: own.x - w - GAP, y: top },
      { x: pin.x - w / 2, y: own.y + own.h + GAP },
      { x: pin.x - w / 2, y: own.y - h - 70 },
      { x: own.x + own.w + GAP, y: vh - h - M },
      { x: own.x - w - GAP, y: vh - h - M },
    ].map((c) => ({ x: Math.min(Math.max(M, c.x), vw - w - M), y: Math.min(Math.max(M + 56, c.y), vh - h - M) }));
    let best = null;
    cands.forEach((c) => {
      const r = { x: c.x, y: c.y, w, h };
      const score = avoid.reduce((n, a) => n + overlap(r, a), 0) * 4 + overlap(r, own);
      if (!best || score < best.score) best = { ...c, score };
    });
    setBox({ x: best.x, y: best.y, w, h });
  }, [pin.x, pin.y, own?.x, own?.y, own?.w, own?.h, vw, vh, docked, mode, district.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    if (full && box && ref.current) {
      const b = ref.current.querySelector('[data-enter]');
      if (b) b.focus({ preventScroll: true });
    }
  }, [full, box === null, district.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // connector from the pin to the nearest point on the panel
  let line = null;
  if (box) {
    const nx = Math.min(Math.max(pin.x, box.x), box.x + box.w);
    const ny = Math.min(Math.max(pin.y, box.y), box.y + box.h);
    line = { x1: pin.x, y1: pin.y, x2: nx, y2: ny };
  }

  return (
    <>
      {line && (
        <svg className="dp__conn" width={vw} height={vh} aria-hidden>
          <line {...line} />
          <rect x={line.x2 - 4} y={line.y2 - 4} width="8" height="8" />
        </svg>
      )}
      <aside
        ref={ref}
        className={`dp ${full ? 'dp--full' : 'dp--info'} dp--${district.id}`}
        style={box ? { left: box.x, top: box.y, width: docked ? box.w : undefined, visibility: 'visible' } : { visibility: 'hidden', left: 0, top: 0 }}
        role={full ? 'dialog' : 'status'}
        aria-label={`${district.name}, ${district.destination}`}
      >
        <header className="dp__head">
          <span>DISTRICT {district.no}</span>
          {full && <button type="button" className="dp__x" onClick={onClose} aria-label="Close preview">✕</button>}
        </header>
        <h2 className="dp__title">{district.name}</h2>
        <p className="dp__dest">{district.destination}</p>
        {full ? (
          <>
            <p className="dp__tag">“{district.tagline}”</p>
            <p className="dp__desc">{district.description}</p>
            <div className="dp__actions">
              <button type="button" className="gbtn gbtn--sm" data-enter onClick={onEnter}>
                <span>[ ENTER DISTRICT ]</span>
              </button>
              <button type="button" className="dp__back" onClick={onClose}>BACK</button>
            </div>
          </>
        ) : (
          <>
            <p className="dp__desc">{district.short}</p>
            <p className="dp__hint">CLICK OR PRESS ENTER TO OPEN</p>
          </>
        )}
      </aside>
    </>
  );
}
