import { forwardRef } from 'react';
import { MAP_W, MAP_H } from '../data/districts.js';

/* A red target pinned to its landmark, with a connector line and compact label.
   Positioned in % of the city illustration so it stays on the right building at any size. */
const DistrictMarker = forwardRef(function DistrictMarker(
  { district, highlighted, dimmed, open, narrow, onHover, onFocus, onBlur, onActivate }, ref,
) {
  const { anchor, no, name, destination } = district;
  // on narrow screens labels sit centred above the pin so they never clip
  const label = narrow ? { dx: 0, dy: -54, side: 'c' } : district.label;
  const left = `${(anchor.x / MAP_W) * 100}%`;
  const top = `${(anchor.y / MAP_H) * 100}%`;
  return (
    <button
      ref={ref}
      type="button"
      className={`mk ${highlighted ? 'mk--hl' : ''} ${dimmed ? 'mk--dim' : ''} ${open ? 'mk--open' : ''}`}
      style={{ left, top }}
      aria-label={`${no}, ${name}, ${destination}. Press Enter to preview.`}
      aria-expanded={open}
      onPointerEnter={(e) => { if (e.pointerType !== 'touch') onHover(true); }}
      onPointerLeave={(e) => { if (e.pointerType !== 'touch') onHover(false); }}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onActivate}
    >
      <span className="mk__inner">
        <svg className="mk__conn" width="1" height="1" overflow="visible" aria-hidden>
          <line x1="0" y1="0" x2={label.dx} y2={label.dy} />
        </svg>
        <span className="mk__ring" aria-hidden />
        <svg className="mk__dot" viewBox="-16 -16 32 32" width="32" height="32" aria-hidden>
          <path d="M-15 0H-8 M8 0H15 M0 -15V-8 M0 8V15" stroke="#F2F0EA" strokeWidth="2.2" />
          <polygon points="0,-10 10,0 0,10 -10,0" fill="#E52432" stroke="#08090D" strokeWidth="2.6" />
          <circle r="2.6" fill="#F2F0EA" />
        </svg>
        <span className={`mk__label mk__label--${label.side}`} style={{ left: label.dx, top: label.dy }}>
          <b>{no} // {name}</b>
          <small>ENTER ▸</small>
        </span>
      </span>
    </button>
  );
});

export default DistrictMarker;
