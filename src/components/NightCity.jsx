import { useMemo } from 'react';

/* A bigger, living midnight city. PERFORMANCE: the buildings are a completely static SVG (painted once).
   Everything that moves (blinking beacons, searchlights, cars) lives in a second, tiny SVG on top, so the
   browser never has to repaint the whole skyline. Heights dip behind the menu area so it stays readable. */
function rng(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}

function layer(seed, { minH, maxH, minW, maxW, base, density, redP }) {
  const r = rng(seed);
  const out = [];
  let x = -70;
  while (x < 1510) {
    const w = minW + r() * (maxW - minW);
    const cx = (x + w / 2) / 1440;
    const bias = cx > 0.4 && cx < 0.82 ? 0.5 : 1;
    const h = (minH + r() * (maxH - minH)) * bias;
    const top = base - h;
    const wins = [];
    const cols = Math.max(1, Math.floor((w - 12) / 13));
    const rows = Math.max(0, Math.floor((h - 18) / 17));
    for (let c = 0; c < cols; c += 1) {
      for (let k = 0; k < rows; k += 1) {
        const v = r();
        if (v < density) wins.push({ x: x + 7 + c * 13, y: top + 10 + k * 17, red: v < redP });
      }
    }
    out.push({ x, w, h, top, wins, edge: r() < 0.6, ant: r() < 0.2 && h > 120, tank: r() < 0.14, sign: r() < 0.05 });
    x += w - 2 + r() * 6;
  }
  return out;
}

function Layer({ items, fill, rim, winOp, id }) {
  return (
    <g>
      {items.map((b, i) => (
        <g key={`${id}${i}`}>
          <rect x={b.x} y={b.top} width={b.w} height={b.h + 4} fill={fill} />
          {b.edge && <line x1={b.x} y1={b.top} x2={b.x + b.w} y2={b.top} stroke="#F2F0EA" strokeOpacity={rim} strokeWidth="2" />}
          {b.tank && <g fill={fill} stroke="#F2F0EA" strokeOpacity={rim * 0.6} strokeWidth="1.5"><rect x={b.x + b.w * 0.25} y={b.top - 16} width="22" height="16" /><polygon points={`${b.x + b.w * 0.25 - 2},${b.top - 16} ${b.x + b.w * 0.25 + 11},${b.top - 26} ${b.x + b.w * 0.25 + 24},${b.top - 16}`} /></g>}
          {b.ant && <line x1={b.x + b.w / 2} y1={b.top} x2={b.x + b.w / 2} y2={b.top - 34} stroke="#F2F0EA" strokeOpacity={rim} strokeWidth="2" />}
          {b.sign && <rect x={b.x + 6} y={b.top + 20} width={Math.max(14, b.w - 12)} height="12" fill="#E52432" opacity=".9" />}
          {b.wins.map((wn, k) => (
            <rect key={k} x={wn.x} y={wn.y} width="6" height="9" fill={wn.red ? '#E52432' : '#F2F0EA'} opacity={wn.red ? 0.9 : winOp} />
          ))}
        </g>
      ))}
    </g>
  );
}

const CARS = [
  { y: 429, dir: 'r', delay: -2, dur: 15 },
  { y: 429, dir: 'r', delay: -9, dur: 19 },
  { y: 434, dir: 'l', delay: -5, dur: 17 },
  { y: 434, dir: 'l', delay: -12, dur: 22 },
];

export default function NightCity({ className = '' }) {
  const far = useMemo(() => layer(3, { minH: 150, maxH: 330, minW: 46, maxW: 100, base: 440, density: 0.2, redP: 0.015 }), []);
  const mid = useMemo(() => layer(9, { minH: 90, maxH: 230, minW: 54, maxW: 118, base: 440, density: 0.2, redP: 0.02 }), []);
  const near = useMemo(() => layer(17, { minH: 40, maxH: 130, minW: 60, maxW: 130, base: 440, density: 0.07, redP: 0.05 }), []);
  const beacons = useMemo(() => [...far, ...mid].filter((b) => b.ant).map((b, i) => ({ x: b.x + b.w / 2, y: b.top - 36, d: (i % 5) * -0.4 })), [far, mid]);

  return (
    <div className={`citywrap ${className}`} aria-hidden="true">
      <svg className="city city--static" viewBox="0 0 1440 440" preserveAspectRatio="xMidYMax slice">
        <Layer id="f" items={far} fill="#202127" rim={0.5} winOp={0.4} />
        <Layer id="m" items={mid} fill="#111218" rim={0.38} winOp={0.55} />
        <Layer id="n" items={near} fill="#08090D" rim={0.65} winOp={0.5} />
        <rect x="-60" y="424" width="1560" height="20" fill="#08090D" />
        <line x1="-60" y1="424" x2="1500" y2="424" stroke="#F2F0EA" strokeOpacity=".25" strokeWidth="2" />
      </svg>
      <svg className="city city--fx" viewBox="0 0 1440 440" preserveAspectRatio="xMidYMax slice">
        <g className="city__beam" style={{ transformOrigin: '1010px 330px' }}>
          <polygon points="1010,330 980,-260 1042,-260" fill="#F2F0EA" opacity=".07" />
        </g>
        <g className="city__beam city__beam--b" style={{ transformOrigin: '760px 350px' }}>
          <polygon points="760,350 734,-260 786,-260" fill="#F2F0EA" opacity=".05" />
        </g>
        {beacons.map((b, i) => <circle key={i} className="city__blink" style={{ animationDelay: `${b.d}s` }} cx={b.x} cy={b.y} r="3" fill="#E52432" />)}
        {CARS.map((c, i) => (
          <g key={i} className={`car car--${c.dir}`} style={{ animationDelay: `${c.delay}s`, animationDuration: `${c.dur}s` }}>
            <rect x="0" y={c.y - 5} width="26" height="6" fill="#202127" />
            <rect x={c.dir === 'r' ? 20 : 0} y={c.y - 4} width="6" height="3" fill="#F2F0EA" />
            <rect x={c.dir === 'r' ? 0 : 20} y={c.y - 4} width="6" height="3" fill="#E52432" />
          </g>
        ))}
      </svg>
    </div>
  );
}
