/* The four original landmarks. Each is drawn in local coordinates with the pin (marker target) at 0,0
   and translated to its anchor. Classes: lm__s (outlined shape), lm__l (line), lm__w (lit window).
   CSS turns the outlines red and the windows bright when the district is focused. */
const ln = (pts) => pts.map((p) => p.join(',')).join(' ');

function Vault() {
  const ribs = Array.from({ length: 11 }, (_, i) => 96 + i * 12);
  return (
    <g>
      <polygon className="lm__s" points="-150,232 150,232 160,288 -160,288" fill="#202127" />
      <polygon className="lm__s" points="-105,84 -78,56 78,56 105,84 105,232 -105,232" fill="#202127" />
      <polygon className="lm__s" points="105,84 150,66 150,222 105,232" fill="#111218" />
      <polygon className="lm__s" points="-78,56 78,56 128,40 -28,40" fill="#777982" fillOpacity=".55" />
      <polygon className="lm__s" points="-46,30 46,30 46,56 -46,56" fill="#111218" />
      <line className="lm__l" x1="0" y1="0" x2="0" y2="30" strokeWidth="3" />
      <circle cx="0" cy="0" r="4" fill="#E52432" />
      {ribs.map((y, i) => <line key={y} className="lm__l" x1="-100" x2="100" y1={y} y2={y} strokeWidth="2" strokeOpacity={i % 2 ? 0.25 : 0.6} />)}
      {[...Array(8)].map((_, i) => <rect key={i} className="lm__w" x={-92 + i * 24} y="236" width="14" height="22" fill="#F2F0EA" opacity=".8" />)}
      <circle className="lm__s" cx="0" cy="164" r="38" fill="#08090D" />
      {[0, 60, 120].map((a) => <line key={a} className="lm__l" x1="-34" x2="34" y1="164" y2="164" strokeWidth="4" transform={`rotate(${a} 0 164)`} />)}
      <circle cx="0" cy="164" r="11" fill="#E52432" stroke="#08090D" strokeWidth="3" />
      {[-105, 105].map((x) => <circle key={x} cx={x} cy="84" r="4" fill="#E52432" />)}
      <polygon className="lm__s" points="-210,288 -150,288 -150,246 -210,246" fill="#111218" />
      <polygon className="lm__s" points="-196,246 -164,246 -164,226 -196,226" fill="#202127" />
    </g>
  );
}

function Dossier() {
  return (
    <g>
      <circle cx="-122" cy="176" r="30" fill="#08090D" />
      <circle cx="126" cy="180" r="34" fill="#08090D" />
      <circle cx="-156" cy="196" r="22" fill="#08090D" />
      <polygon className="lm__s" points="-150,190 150,190 150,208 -150,208" fill="#111218" />
      <line className="lm__l" x1="0" y1="0" x2="0" y2="34" strokeWidth="3" />
      <circle cx="0" cy="0" r="4" fill="#E52432" />
      <path className="lm__s" d="M-40 52 Q-22 44 -14 34 L14 34 Q22 44 40 52 Z" fill="#202127" />
      <rect className="lm__s" x="-18" y="52" width="36" height="20" fill="#111218" />
      <rect className="lm__w" x="-4" y="57" width="8" height="10" fill="#F2F0EA" />
      <path className="lm__s" d="M-66 90 Q-42 80 -30 70 L30 70 Q42 80 66 90 Z" fill="#202127" />
      <rect className="lm__s" x="-30" y="90" width="60" height="30" fill="#111218" />
      <path className="lm__s" d="M-104 134 Q-70 122 -52 112 L52 112 Q70 122 104 134 Z" fill="#202127" />
      <rect className="lm__s" x="-52" y="134" width="104" height="56" fill="#111218" />
      {[-36, -12, 12, 36].map((x) => <rect key={x} className="lm__w" x={x - 5} y="148" width="10" height="16" fill="#F2F0EA" opacity=".75" />)}
      <rect x="-5" y="98" width="10" height="14" fill="#E52432" />
      {[-104, 104, -66, 66].map((x, i) => <circle key={x} cx={x} cy={i < 2 ? 134 : 90} r="3.5" fill="#E52432" />)}
    </g>
  );
}

function Arsenal() {
  const hw = (y) => 4 + y * 0.28;
  const levels = Array.from({ length: 11 }, (_, i) => i * 23);
  return (
    <g>
      <polygon className="lm__s" points="-220,296 200,296 210,310 -230,310" fill="#202127" />
      {/* gantry */}
      <g>
        <polygon className="lm__s" points="-210,206 -60,206 -60,296 -210,296" fill="#111218" />
        {[-210, -135, -60].map((x) => <line key={x} className="lm__l" x1={x} y1="206" x2={x} y2="296" strokeWidth="4" />)}
        <line className="lm__l" x1="-210" y1="206" x2="-60" y2="296" strokeWidth="2.5" />
        <line className="lm__l" x1="-60" y1="206" x2="-210" y2="296" strokeWidth="2.5" />
        <rect className="lm__s" x="-220" y="196" width="170" height="12" fill="#202127" />
      </g>
      {/* tanks */}
      {[80, 150].map((x, i) => (
        <g key={x}>
          <rect className="lm__s" x={x - 32} y={236 - i * 14} width="64" height={60 + i * 14} fill="#202127" />
          <ellipse className="lm__s" cx={x} cy={236 - i * 14} rx="32" ry="9" fill="#777982" fillOpacity=".6" />
          {[1, 2, 3].map((k) => <line key={k} className="lm__l" x1={x - 32} x2={x + 32} y1={236 - i * 14 + k * 16} y2={236 - i * 14 + k * 16} strokeWidth="2" strokeOpacity=".5" />)}
        </g>
      ))}
      <rect x="-230" y="290" width="440" height="10" fill="url(#warn)" />
      {/* lattice mast */}
      <polyline className="lm__l" fill="none" strokeWidth="5" points={ln([[-hw(0), 0], [-hw(230), 230]])} />
      <polyline className="lm__l" fill="none" strokeWidth="5" points={ln([[hw(0), 0], [hw(230), 230]])} />
      {levels.map((y, i) => (
        <g key={y}>
          <line className="lm__l" x1={-hw(y)} x2={hw(y)} y1={y} y2={y} strokeWidth="2.5" />
          {i < levels.length - 1 && (
            <>
              <line className="lm__l" x1={-hw(y)} y1={y} x2={hw(levels[i + 1])} y2={levels[i + 1]} strokeWidth="1.8" />
              <line className="lm__l" x1={hw(y)} y1={y} x2={-hw(levels[i + 1])} y2={levels[i + 1]} strokeWidth="1.8" />
            </>
          )}
        </g>
      ))}
      {[62, 138, 196].map((y) => <rect key={y} className="lm__s" x={-hw(y) - 8} y={y} width={hw(y) * 2 + 16} height="9" fill="#111218" />)}
      <ellipse className="lm__s" cx={hw(96) + 20} cy="96" rx="11" ry="24" transform={`rotate(-14 ${hw(96) + 20} 96)`} fill="#777982" fillOpacity=".7" />
      <line className="lm__l" x1={hw(96)} y1="96" x2={hw(96) + 18} y2="96" strokeWidth="3" />
      <circle cx="0" cy="0" r="5" fill="#E52432" />
      <circle cx={-hw(138) - 8} cy="138" r="3.5" fill="#E52432" />
    </g>
  );
}

function Exit() {
  return (
    <g>
      {/* bridge */}
      <polygon className="lm__s" points="-330,212 -140,190 -140,214 -330,238" fill="#202127" />
      <polygon className="lm__s" points="-330,212 -140,190 -140,182 -330,204" fill="#777982" fillOpacity=".5" />
      <polyline className="lm__l" fill="none" strokeWidth="2.5" points="-330,196 -140,174" />
      {[-300, -250, -200, -160].map((x) => <line key={x} className="lm__l" x1={x} y1={x * 0.116 + 245} x2={x} y2="282" strokeWidth="3" strokeOpacity=".5" />)}
      {/* pylons */}
      <polygon className="lm__s" points="-150,70 -96,70 -96,262 -150,262" fill="#111218" />
      <polygon className="lm__s" points="96,70 150,70 150,262 96,262" fill="#111218" />
      {[110, 140, 170, 200, 230].map((y) => <g key={y}><line className="lm__l" x1="-148" x2="-98" y1={y} y2={y} strokeWidth="2" strokeOpacity=".5" /><line className="lm__l" x1="98" x2="148" y1={y} y2={y} strokeWidth="2" strokeOpacity=".5" /></g>)}
      {/* portal */}
      <rect className="lm__s" x="-96" y="80" width="192" height="182" fill="#08090D" />
      <rect className="lm__w" x="-58" y="104" width="116" height="158" fill="#F2F0EA" opacity=".12" />
      {[0, 1, 2, 3, 4].map((i) => <line key={i} className="lm__l" x1="-96" x2="96" y1={226 + i * 7} y2={226 + i * 7} strokeWidth="2" strokeOpacity=".4" />)}
      {/* lintel + sign */}
      <polygon className="lm__s" points="-170,44 170,44 160,80 -160,80" fill="#202127" />
      <polygon className="lm__s" points="-170,44 170,44 190,30 -150,30" fill="#777982" fillOpacity=".55" />
      <rect x="-52" y="50" width="104" height="24" fill="#E52432" stroke="#08090D" strokeWidth="3" />
      <text className="lm__t" x="0" y="68" textAnchor="middle" fontFamily="Anton, Impact, sans-serif" fontSize="20" letterSpacing="4" fill="#F2F0EA">EXIT</text>
      <line className="lm__l" x1="0" y1="0" x2="0" y2="30" strokeWidth="3" />
      <circle cx="0" cy="0" r="4.5" fill="#E52432" />
      {[-165, 165].map((x) => <circle key={x} cx={x} cy="44" r="3.5" fill="#E52432" />)}
      <polygon className="lm__s" points="150,262 230,262 230,240 190,240 190,218 150,218" fill="#202127" />
    </g>
  );
}

const MAP = { vault: Vault, dossier: Dossier, arsenal: Arsenal, exit: Exit };

export default function Landmark({ id, anchor, active, blink }) {
  const Shape = MAP[id];
  return (
    <g className={`lm ${active ? 'lm--on' : ''} ${blink ? 'lm--blink' : ''}`} transform={`translate(${anchor.x} ${anchor.y})`}>
      <Shape />
    </g>
  );
}
