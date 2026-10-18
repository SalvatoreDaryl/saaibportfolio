import { useMemo } from 'react';
import { DISTRICTS, MAP_W as W, MAP_H as H } from '../data/districts.js';
import Landmark from './Landmarks.jsx';

/* An original, generated city: a fisheye "bowl" of layered buildings seen from above, flat greys with
   dark outlines, sparse white windows and red rooftop sparks. Only the palette greys, black, white
   and red are used. Landmarks are drawn on top; clickable markers live in a separate HTML layer. */
const CX = W / 2;
function rng(seed) {
  let s = seed % 2147483647;
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}

const ROWS = [
  { seed: 11, baseC: 330, baseE: 205, h: [120, 270], w: [34, 72], front: '#202127', side: '#08090D', lean: 9, win: 0.22, skip: 0 },
  { seed: 23, baseC: 385, baseE: 262, h: [100, 210], w: [40, 84], front: '#111218', side: '#08090D', lean: 8, win: 0.2, skip: 0 },
  { seed: 37, baseC: 440, baseE: 322, h: [90, 190], w: [46, 92], front: '#202127', side: '#08090D', lean: 7, win: 0.2, skip: 0.1 },
  { seed: 41, baseC: 505, baseE: 392, h: [80, 170], w: [54, 104], front: '#111218', side: '#08090D', lean: 6, win: 0.18, skip: 0.16 },
  { seed: 53, baseC: 580, baseE: 470, h: [90, 200], w: [64, 124], front: '#202127', side: '#08090D', lean: 5, win: 0.14, skip: 0.24 },
  { seed: 67, baseC: 665, baseE: 560, h: [110, 240], w: [80, 150], front: '#111218', side: '#08090D', lean: 4, win: 0.1, skip: 0.34 },
];

function buildRow(row, rowIndex) {
  const r = rng(row.seed);
  const out = [];
  let x = -90;
  while (x < W + 90) {
    const w = row.w[0] + r() * (row.w[1] - row.w[0]);
    const cx = x + w / 2;
    const t = (cx - CX) / CX;
    const advance = w * (0.78 + r() * 0.3);
    if (Math.abs(t) < row.skip) { x += advance; continue; }
    const base = row.baseC + (row.baseE - row.baseC) * t * t;
    const h = row.h[0] + r() * (row.h[1] - row.h[0]);
    // windows: dots plus the occasional long lit strip
    const cols = Math.max(1, Math.floor((w - 12) / 12));
    const rows = Math.min(14, Math.max(0, Math.floor((h - 14) / 16)));
    let win = '';
    for (let c = 0; c < cols; c += 1) {
      for (let k = 0; k < rows; k += 1) {
        if (r() < row.win) win += `M${(-w / 2 + 7 + c * 12).toFixed(1)} ${(-h + 10 + k * 16).toFixed(1)}h6v8h-6z`;
      }
    }
    if (r() < 0.22 && rows > 2) {
      const k = Math.floor(r() * rows);
      win += `M${(-w / 2 + 6).toFixed(1)} ${(-h + 12 + k * 16).toFixed(1)}h${(w - 12).toFixed(1)}v5h-${(w - 12).toFixed(1)}z`;
    }
    out.push({
      key: `${rowIndex}-${out.length}`, cx, base, w, h, t, lean: t * row.lean, win,
      dir: t < 0 ? 1 : -1, red: r() < 0.16, ant: r() < 0.14, hatch: r() < 0.28, edge: r() < 0.4, rcorner: r() < 0.5 ? -1 : 1,
    });
    x += advance;
  }
  return out;
}

function Building({ b, row }) {
  const sx = b.dir * b.w * 0.3;
  const td = Math.abs(sx) * 0.45;
  const e = b.dir > 0 ? b.w / 2 : -b.w / 2;
  return (
    <g transform={`translate(${b.cx.toFixed(1)} ${b.base.toFixed(1)}) rotate(${b.lean.toFixed(2)})`} stroke="#08090D" strokeWidth="2.6" strokeLinejoin="round">
      <polygon points={`${e},${-b.h} ${e + sx},${-b.h - td} ${e + sx},${-td} ${e},0`} fill={row.side} />
      {b.hatch && <polygon points={`${e},${-b.h} ${e + sx},${-b.h - td} ${e + sx},${-td} ${e},0`} fill="url(#hatch)" stroke="none" />}
      <polygon points={`${-b.w / 2},${-b.h} ${b.w / 2},${-b.h} ${b.w / 2 + sx},${-b.h - td} ${-b.w / 2 + sx},${-b.h - td}`} fill="#777982" fillOpacity=".5" />
      <rect x={-b.w / 2} y={-b.h} width={b.w} height={b.h} fill={row.front} />
      {b.edge && <line x1={-b.w / 2 + 1} y1={-b.h} x2={-b.w / 2 + 1} y2="0" stroke="#F2F0EA" strokeOpacity=".35" strokeWidth="1.5" />}
      {b.win && <path d={b.win} fill="#F2F0EA" fillOpacity=".85" stroke="none" />}
      {b.ant && <line x1="0" y1={-b.h} x2="0" y2={-b.h - 28} stroke="#F2F0EA" strokeOpacity=".7" strokeWidth="2" />}
      {b.red && (
        <g stroke="none">
          <circle cx={b.rcorner * (b.w / 2 - 3)} cy={-b.h - (b.ant ? 0 : 2)} r="7" fill="#E52432" fillOpacity=".25" />
          <circle cx={b.rcorner * (b.w / 2 - 3)} cy={-b.h - (b.ant ? 0 : 2)} r="3" fill="#E52432" />
        </g>
      )}
    </g>
  );
}

export default function CityBackground({ activeId = null, blinkId = null }) {
  const rows = useMemo(() => ROWS.map((row, i) => ({ row, items: buildRow(row, i) })), []);
  const stars = useMemo(() => {
    const r = rng(5);
    return Array.from({ length: 70 }, () => ({ x: r() * W, y: r() * 230, r: 0.5 + r() * 1.2, o: 0.2 + r() * 0.6 }));
  }, []);
  return (
    <svg className={`citysvg ${activeId ? 'citysvg--sel' : ''}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustrated night city">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#08090D" />
          <stop offset="0.5" stopColor="#111218" />
          <stop offset="1" stopColor="#202127" />
        </linearGradient>
        <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="#777982" strokeWidth="2" strokeOpacity=".45" />
        </pattern>
        <pattern id="warn" width="16" height="10" patternUnits="userSpaceOnUse" patternTransform="skewX(-30)">
          <rect width="8" height="10" fill="#E52432" /><rect x="8" width="8" height="10" fill="#08090D" />
        </pattern>
        <pattern id="halftone" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="4.5" cy="4.5" r="1.3" fill="#F2F0EA" />
        </pattern>
        <radialGradient id="vig" cx="50%" cy="46%" r="75%">
          <stop offset="0.55" stopColor="#08090D" stopOpacity="0" />
          <stop offset="1" stopColor="#08090D" stopOpacity=".85" />
        </radialGradient>
        <radialGradient id="moonhalo"><stop offset="0" stopColor="#F2F0EA" stopOpacity=".22" /><stop offset="1" stopColor="#F2F0EA" stopOpacity="0" /></radialGradient>
      </defs>

      <rect width={W} height={H} fill="url(#sky)" />
      {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#F2F0EA" opacity={s.o} />)}
      <circle cx="1170" cy="86" r="90" fill="url(#moonhalo)" />
      <circle cx="1170" cy="86" r="26" fill="#F2F0EA" />
      <circle cx="1160" cy="80" r="6" fill="#111218" opacity=".18" />

      {/* ground bowl */}
      <path d="M-40 250 Q800 470 1640 250 L1640 920 L-40 920 Z" fill="#111218" />

      {rows.slice(0, 4).map(({ row, items }, i) => <g key={i}>{items.map((b) => <Building key={b.key} b={b} row={row} />)}</g>)}

      {/* avenue, cross street, and elevated bridge */}
      <polygon points="690,900 910,900 826,470 774,470" fill="#202127" stroke="#08090D" strokeWidth="3" />
      <polyline points="800,900 800,480" fill="none" stroke="#F2F0EA" strokeOpacity=".55" strokeWidth="4" strokeDasharray="26 22" />
      <path d="M-20 650 Q800 560 1620 640" fill="none" stroke="#202127" strokeWidth="46" />
      <path d="M-20 650 Q800 560 1620 640" fill="none" stroke="#08090D" strokeWidth="3" transform="translate(0 -23)" />
      <path d="M-20 650 Q800 560 1620 640" fill="none" stroke="#F2F0EA" strokeOpacity=".4" strokeWidth="2" strokeDasharray="22 18" />
      <path d="M380 520 Q760 470 1130 510" fill="none" stroke="#08090D" strokeWidth="30" />
      <path d="M380 514 Q760 464 1130 504" fill="none" stroke="#777982" strokeOpacity=".7" strokeWidth="3" />
      <path d="M380 524 Q760 474 1130 514" fill="none" stroke="#F2F0EA" strokeOpacity=".35" strokeWidth="2" strokeDasharray="10 12" />
      {[430, 520, 620, 720, 820, 920, 1020, 1100].map((x, i) => <line key={x} x1={x} y1={514 - Math.sin((x - 380) / 750 * Math.PI) * 44} x2={x} y2="600" stroke="#08090D" strokeWidth="5" />)}

      {rows.slice(4).map(({ row, items }, i) => <g key={i}>{items.map((b) => <Building key={b.key} b={b} row={row} />)}</g>)}

      {DISTRICTS.map((d) => <Landmark key={d.id} id={d.id} anchor={d.anchor} active={activeId === d.id} blink={blinkId === d.id} />)}


      {/* foreground rooftops */}
      <g stroke="#08090D" strokeWidth="3" strokeLinejoin="round">
        <polygon points="0,704 130,670 370,706 450,900 0,900" fill="#08090D" />
        <polyline points="0,704 130,670 370,706" fill="none" stroke="#F2F0EA" strokeOpacity=".5" strokeWidth="3" />
        {[30, 90, 150, 210, 270, 330].map((x, i) => <line key={x} x1={x} y1={702 - i * 2 + (x > 130 ? (x - 130) * 0.15 : 0) - 20} x2={x} y2={702 - i * 2 + (x > 130 ? (x - 130) * 0.15 : 0)} stroke="#F2F0EA" strokeOpacity=".4" strokeWidth="2.5" />)}
        <rect x="50" y="640" width="64" height="48" fill="#111218" />
        <polygon points="46,640 82,620 118,640" fill="#202127" />
        <polygon points="1230,900 1296,650 1600,520 1600,900" fill="#08090D" />
        <polyline points="1296,650 1600,520" fill="none" stroke="#F2F0EA" strokeOpacity=".45" strokeWidth="3" />
        {[0, 1, 2, 3].map((i) => <line key={i} x1={1296 + i * 20} y1={650 + i * 62} x2={1560} y2={560 + i * 90} stroke="#777982" strokeOpacity=".4" strokeWidth="2" />)}
        <polygon points="1090,900 1150,772 1330,730 1400,900" fill="#111218" />
        <line x1="1150" y1="772" x2="1400" y2="900" stroke="#777982" strokeOpacity=".45" strokeWidth="2.5" />
        <line x1="1330" y1="730" x2="1090" y2="900" stroke="#777982" strokeOpacity=".45" strokeWidth="2.5" />
        <polygon points="880,900 920,790 1060,770 1100,900" fill="#08090D" />
      </g>
      {[[1296, 650], [1600, 520], [130, 670]].map(([x, y], i) => <circle key={i} cx={x - (x > 1500 ? 8 : 0)} cy={y} r="4.5" fill="#E52432" />)}

      <rect width={W} height={H} fill="url(#halftone)" opacity=".05" />
      <rect width={W} height={H} fill="url(#vig)" />
    </svg>
  );
}
