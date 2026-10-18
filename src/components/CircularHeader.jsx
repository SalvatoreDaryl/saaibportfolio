const RING_TEXT = 'SAAIB.EXE ✦ PORTFOLIO SYSTEM ✦ DEVELOPER / DESIGNER ✦ AFTER MIDNIGHT ✦ ';
export const DETENT = 36; // degrees the ring layers turn per menu step
const pt = (r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [500 + r * Math.cos(a), 500 + r * Math.sin(a)];
};
const spin = (deg) => ({ transform: `rotate(${deg}deg)` });

/* Dial one: oversized, cropped, side-mounted ring.
   PERFORMANCE: the ring is several stacked SVG layers. The heavy print-distortion filter is applied once per
   layer, and the moving layers are turned with a CSS transform (GPU-composited), never by animating
   shapes inside a filtered group. That keeps the turn smooth. The needle pivots at this ring's centre
   (see GameMenu); a fixed gauge scale on the rim has a red marker that follows it. */
export default function CircularHeader({ dial = 0, needle = 0 }) {
  const ticks = Array.from({ length: 72 }, (_, i) => i);
  const gauge = Array.from({ length: 33 }, (_, i) => -32 + i * 2);
  const [x1, y1] = pt(494, -32);
  const [x2, y2] = pt(494, 32);
  const [x3, y3] = pt(448, 32);
  const [x4, y4] = pt(448, -32);

  return (
    <div className="ring" aria-hidden="true">
      {/* base disc + hard shadow ring (static) */}
      <svg className="ring__layer" viewBox="0 0 1000 1000">
        <defs>
          <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <circle cx="8" cy="8" r="3.6" fill="#08090D" />
          </pattern>
          <radialGradient id="fade" cx="50%" cy="50%" r="50%">
            <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.9" stopColor="#fff" stopOpacity="1" />
          </radialGradient>
          <mask id="dotmask"><circle cx="500" cy="500" r="480" fill="url(#fade)" /></mask>
          <filter id="print" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="9" />
          </filter>
        </defs>
        <circle cx="500" cy="500" r="496" fill="#111218" />
        <circle cx="500" cy="500" r="496" fill="none" stroke="#F2F0EA" strokeWidth="3" />
        <g filter="url(#print)">
          <circle cx="514" cy="514" r="385" fill="none" stroke="#08090D" strokeWidth="112" />
        </g>
      </svg>

      {/* outer tick dial (turns) */}
      <svg className="ring__layer ring__layer--spin" viewBox="0 0 1000 1000" style={spin(dial * DETENT)}>
        {ticks.map((i) => {
          const long = i % 6 === 0;
          return <line key={i} x1="500" y1={long ? 22 : 30} x2="500" y2="44" stroke="#F2F0EA" strokeOpacity={long ? 0.9 : 0.4} strokeWidth={long ? 4 : 2} transform={`rotate(${i * 5} 500 500)`} />;
        })}
      </svg>

      {/* red band with halftone (turns) */}
      <svg className="ring__layer ring__layer--spin" viewBox="0 0 1000 1000" style={spin(dial * DETENT)}>
        <g filter="url(#print)">
          <circle cx="500" cy="500" r="385" fill="none" stroke="#E52432" strokeWidth="112" strokeDasharray="180 21.6" />
          <g mask="url(#dotmask)">
            <circle cx="500" cy="500" r="385" fill="none" stroke="url(#dots)" strokeWidth="112" strokeDasharray="180 21.6" />
          </g>
        </g>
      </svg>

      {/* static rim line + gauge scale */}
      <svg className="ring__layer" viewBox="0 0 1000 1000">
        <circle cx="500" cy="500" r="441" fill="none" stroke="#F2F0EA" strokeWidth="2" strokeOpacity=".7" />
        <path d={`M${x1} ${y1} A494 494 0 0 1 ${x2} ${y2} L${x3} ${y3} A448 448 0 0 0 ${x4} ${y4} Z`} fill="#08090D" stroke="#F2F0EA" strokeWidth="2" />
        {gauge.map((d) => {
          const major = d % 10 === 0;
          const [ax, ay] = pt(major ? 452 : 462, d);
          const [bx, by] = pt(490, d);
          return <line key={d} x1={ax} y1={ay} x2={bx} y2={by} stroke={major ? '#E52432' : '#F2F0EA'} strokeWidth={major ? 5 : 2.2} strokeOpacity={major ? 1 : 0.7} />;
        })}
      </svg>

      {/* gauge marker that follows the needle (turns) */}
      <svg className="ring__layer ring__layer--spin" viewBox="0 0 1000 1000" style={spin(needle)}>
        <polygon points="996,483 996,517 940,500" fill="#E52432" stroke="#F2F0EA" strokeWidth="3" strokeLinejoin="miter" />
      </svg>

      {/* dial face (static) */}
      <svg className="ring__layer" viewBox="0 0 1000 1000">
        <circle cx="500" cy="500" r="328" fill="#08090D" />
        <circle cx="500" cy="500" r="328" fill="none" stroke="#F2F0EA" strokeWidth="4" />
        <g stroke="#F2F0EA" strokeOpacity=".16" strokeWidth="2">
          <line x1="172" y1="500" x2="828" y2="500" />
          <line x1="500" y1="172" x2="500" y2="828" />
        </g>
        <circle cx="500" cy="500" r="120" fill="none" stroke="#E52432" strokeWidth="3" strokeDasharray="3 12" />
        <circle cx="500" cy="500" r="58" fill="none" stroke="#777982" strokeWidth="2" />
        <circle cx="500" cy="500" r="240" fill="none" stroke="#777982" strokeWidth="2" strokeDasharray="2 10" />
      </svg>

      {/* text ring (turns the other way) */}
      <svg className="ring__layer ring__layer--spin" viewBox="0 0 1000 1000" style={spin(-dial * DETENT)}>
        <path id="textring" d="M500 500 m-286 0 a286 286 0 1 1 572 0 a286 286 0 1 1 -572 0" fill="none" />
        <text fill="#F2F0EA" fillOpacity=".85" fontFamily="Space Mono, monospace" fontSize="22" letterSpacing="5">
          <textPath href="#textring">{RING_TEXT.repeat(2)}</textPath>
        </text>
      </svg>
    </div>
  );
}
