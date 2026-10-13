/* Original ninja cat mascot. Mostly-black silhouette with a moonlit rim line, off-white angular eyes,
   a headband plate, and a vivid red scarf. Poses: peek | sit | stand.
   Alive: idle bob, blinking, ear twitch, fluttering scarf, swaying tail (CSS, see alive.css).
   `happy` swaps in closed ^ ^ eyes, a smile and blush marks. */
const INK = '#08090D';
const BODY = '#111218';
const MOON = '#F2F0EA';
const RED = '#E52432';

function Head() {
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <polygon className="cat__ear cat__ear--l" points="70,72 78,14 114,52" fill={BODY} stroke={MOON} strokeWidth="5" />
      <polygon className="cat__ear cat__ear--r" points="170,72 162,14 126,52" fill={BODY} stroke={MOON} strokeWidth="5" />
      <polygon points="66,84 88,50 152,50 174,84 170,120 140,144 100,144 70,120" fill={BODY} stroke={MOON} strokeWidth="5" />
      <polygon points="66,68 174,68 177,84 63,84" fill={INK} stroke={MOON} strokeWidth="3" />
      <polygon points="104,64 136,64 136,88 104,88" fill={MOON} />
      <path d="M112 82 L128 70" stroke={INK} strokeWidth="4" />

      <g className="cat__eyes-open">
        <polygon points="86,102 114,108 108,122 90,116" fill={MOON} />
        <polygon points="154,102 126,108 132,122 150,116" fill={MOON} />
        <polygon points="98,108 108,110 106,118 98,115" fill={INK} />
        <polygon points="142,108 132,110 134,118 142,115" fill={INK} />
      </g>
      <path className="cat__brows" d="M82 96 L116 104 M158 96 L124 104" stroke={MOON} strokeWidth="4" fill="none" />
      <g className="cat__eyes-happy">
        <path d="M86 118 Q100 98 114 118 M126 118 Q140 98 154 118" fill="none" stroke={MOON} strokeWidth="5.5" />
        <path d="M78 122 L90 124 M150 124 L162 122" stroke={RED} strokeWidth="4" />
      </g>

      <polygon points="116,126 124,126 120,132" fill={MOON} />
      <path className="cat__mouth-idle" d="M106 136 L114 142 L120 136 L126 142 L134 136" fill="none" stroke={MOON} strokeWidth="2.5" />
      <g className="cat__mouth-happy">
        <path d="M104 134 Q120 154 136 134 Z" fill={MOON} stroke={MOON} strokeWidth="2" />
        <path d="M113 142 Q120 151 127 142 Z" fill={RED} stroke="none" />
      </g>
      <path d="M72 116 L38 108 M72 124 L38 130 M168 116 L202 108 M168 124 L202 130" stroke={MOON} strokeWidth="2.5" fill="none" />
    </g>
  );
}

function Scarf({ y = 0 }) {
  return (
    <g transform={`translate(0 ${y})`} strokeLinejoin="round">
      <polygon points="82,142 158,142 164,162 120,174 76,162" fill={RED} stroke={INK} strokeWidth="4" />
      <polygon className="cat__scarf" points="146,152 196,164 232,148 216,178 244,192 172,184 150,170" fill={RED} stroke={INK} strokeWidth="4" />
    </g>
  );
}

const limb = { fill: BODY, stroke: MOON, strokeWidth: 4, strokeLinejoin: 'round' };

export default function NinjaCat({ pose = 'peek', className = '', label = 'Ninja cat mascot', happy = false, decorative = false }) {
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': label };
  const cls = `cat cat--${pose} ${happy ? 'cat--happy' : ''} ${className}`;

  if (pose === 'peek') {
    return (
      <svg className={cls} viewBox="30 4 200 176" {...a11y}>
        <g className="cat__body">
          <Head />
          <Scarf />
          <ellipse cx="86" cy="164" rx="16" ry="12" {...limb} />
          <ellipse cx="154" cy="164" rx="16" ry="12" {...limb} />
        </g>
      </svg>
    );
  }
  if (pose === 'sit') {
    return (
      <svg className={cls} viewBox="0 0 260 300" {...a11y}>
        <g className="cat__body">
          <g className="cat__tail">
            <path d="M176 282 Q246 292 232 232" fill="none" stroke={MOON} strokeWidth="16" strokeLinecap="round" />
            <path d="M176 282 Q246 292 232 232" fill="none" stroke={BODY} strokeWidth="8" strokeLinecap="round" />
          </g>
          <polygon points="82,198 158,198 182,284 58,284" {...limb} />
          <polygon points="96,216 116,216 114,286 92,286" {...limb} />
          <polygon points="124,216 144,216 148,286 126,286" {...limb} />
          <g transform="translate(0 40)"><Head /></g>
          <Scarf y={40} />
        </g>
      </svg>
    );
  }
  return (
    <svg className={cls} viewBox="0 0 260 300" {...a11y}>
      <g className="cat__body">
        <g className="cat__tail">
          <path d="M156 228 Q216 224 206 158 Q200 126 232 112" fill="none" stroke={MOON} strokeWidth="16" strokeLinecap="round" />
          <path d="M156 228 Q216 224 206 158 Q200 126 232 112" fill="none" stroke={BODY} strokeWidth="8" strokeLinecap="round" />
        </g>
        <polygon points="88,228 118,228 116,284 86,284" {...limb} />
        <polygon points="122,228 152,228 154,284 124,284" {...limb} />
        <polygon points="76,280 118,280 122,294 72,294" {...limb} />
        <polygon points="122,280 164,280 168,294 118,294" {...limb} />
        <polygon points="88,158 152,158 162,232 78,232" {...limb} />
        <polygon points="90,164 64,204 68,228 84,224 98,192" {...limb} />
        <polygon points="150,164 176,204 172,228 156,224 142,192" {...limb} />
        <Head />
        <Scarf />
      </g>
    </svg>
  );
}
