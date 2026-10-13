import { useEffect, useRef } from 'react';
import MenuItem from './MenuItem.jsx';
import { computeFan } from './fan.js';

const BLUR = [0, 0.3, 0.6, 0.9, 1.2]; // px, by distance from the selection (mild optic focus)
const FADE = [1, 1, 0.97, 0.94, 0.9];

/* Red field behind the words: a jagged wedge fanning out of the ring's centre (units of 0.1u). */
function Wedge() {
  const pts = ['0,0'];
  for (let d = -28, i = 0; d <= 28; d += 4, i += 1) {
    const r = i % 2 === 0 ? 1170 : 1290;
    const a = (d * Math.PI) / 180;
    pts.push(`${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`);
  }
  return (
    <svg className="wedge" viewBox="0 -700 1300 1400" aria-hidden="true">
      <defs>
        <pattern id="wdots" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <circle cx="9" cy="9" r="4" fill="#08090D" />
        </pattern>
        <linearGradient id="wfade" x1="0" x2="1">
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="wmask"><rect x="0" y="-700" width="1300" height="1400" fill="url(#wfade)" /></mask>
      </defs>
      <polygon points={pts.join(' ')} fill="#E52432" />
      <polygon points={pts.join(' ')} fill="url(#wdots)" mask="url(#wmask)" opacity=".5" />
      {/* black ink slashes */}
      <polygon points="700,-470 1040,-300 1010,-262 660,-420" fill="#08090D" opacity=".6" />
      <polygon points="520,120 960,330 930,376 500,190" fill="#08090D" opacity=".5" />
      <polygon points="820,-110 1180,-40 1170,-6 800,-70" fill="#08090D" opacity=".38" />
    </svg>
  );
}

/* The gauge needle: pivots on the ring's centre and swings to the selected word (spring easing). */
function Needle({ angle }) {
  return (
    <div className="needle" style={{ '--na': `${angle}deg` }} aria-hidden="true">
      <svg className="needle__svg" viewBox="-90 -34 730 68">
        <g transform="translate(9 9)" fill="#08090D">
          <polygon points="-88,0 -52,-20 0,-17 520,-9 520,-24 640,0 520,24 520,9 0,17 -52,20" />
        </g>
        <polygon points="-88,0 -52,-20 0,-17 520,-9 520,-24 640,0 520,24 520,9 0,17 -52,20" fill="#E52432" stroke="#F2F0EA" strokeWidth="5" strokeLinejoin="miter" />
        <line x1="24" y1="0" x2="500" y2="0" stroke="#F2F0EA" strokeOpacity=".7" strokeWidth="2.5" />
        <circle r="31" fill="#08090D" stroke="#F2F0EA" strokeWidth="5" />
        <circle r="17" fill="#E52432" />
        <circle r="5" fill="#F2F0EA" />
      </svg>
    </div>
  );
}

/* Presentation + focus sync only. Selection state and activation live in HeroScreen. */
export default function GameMenu({ items, selected, onSelect, onActivate, resumeHref }) {
  const refs = useRef([]);
  const touched = useRef(false);
  const lockUntil = useRef(0);
  const fan = computeFan(items.length, selected);

  useEffect(() => {
    lockUntil.current = performance.now() + 420; // ignore hover while the fan is settling
    if (touched.current && refs.current[selected]) refs.current[selected].focus({ preventScroll: true });
  }, [selected]);

  return (
    <nav className="wheelbox" aria-label="Main menu">
      <div className="wheel">
        <Wedge />
        <Needle angle={fan[selected].a} />
        <ul>
          {items.map((item, i) => {
            const k = Math.min(4, Math.abs(i - selected));
            return (
              <li
                key={item.id}
                style={{ '--a': `${fan[i].a}deg`, '--s': fan[i].scale, '--bl': `${BLUR[k]}px`, '--op': FADE[k], '--n': item.label.length, zIndex: 10 - k }}
              >
                <MenuItem
                  ref={(el) => { refs.current[i] = el; }}
                  item={item}
                  index={i}
                  selected={i === selected}
                  href={resumeHref}
                  onHover={() => { if (performance.now() < lockUntil.current) return; touched.current = true; onSelect(i); }}
                  onFocusSelect={() => { touched.current = true; onSelect(i); }}
                  onActivate={(e) => onActivate(item, e)}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
