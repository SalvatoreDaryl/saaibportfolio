import { useRef, useState } from 'react';
import NinjaCat from '../components/NinjaCat.jsx';
import PopText from '../components/PopText.jsx';
import { sfx } from '../audio/sfx.js';

/* The ninja cat, idle in front of the city. Click it to hear the tour again.
   phase: idle | cast | gone. On "cast" it performs a ninjutsu vanish (hand-seal ring, spin, smoke, shards)
   and is then gone. */
const PUFFS = Array.from({ length: 9 }, (_, i) => {
  const a = (i / 9) * Math.PI * 2 + 0.3;
  const r = 52 + (i % 3) * 22;
  return { dx: Math.cos(a) * r, dy: Math.sin(a) * r * 0.8 - 14, s: 0.8 + (i % 4) * 0.22, tone: i % 3, d: (i % 4) * 0.03 };
});
const SHARDS = Array.from({ length: 7 }, (_, i) => {
  const a = (i / 7) * Math.PI * 2;
  return { dx: Math.cos(a) * 120, dy: Math.sin(a) * 100 - 20, rot: i * 51, red: i % 2 === 0 };
});

export default function CityCat({ phase = 'idle', talking = false, onTalk }) {
  const [happy, setHappy] = useState(false);
  const t = useRef(0);
  const pet = () => { clearTimeout(t.current); setHappy(true); sfx.meow(); };
  const unpet = (ms) => { clearTimeout(t.current); t.current = setTimeout(() => setHappy(false), ms); };
  return (
    <div
      className={`ccat ccat--${phase}`}
      onPointerEnter={() => { if (phase === 'idle') pet(); }}
      onPointerLeave={() => unpet(450)}
      onClick={() => { if (phase === 'idle') { pet(); unpet(1200); onTalk?.(); } }}
      title="Click for the guided tour"
    >
      <div className="ccat__body"><NinjaCat pose="sit" happy={happy && phase === 'idle' && !talking} talking={talking && phase === 'idle'} decorative /></div>
      {phase !== 'idle' && (
        <div className="ccat__fx" aria-hidden="true">
          <i className="ccat__seal" />
          {PUFFS.map((p, i) => <i key={i} className={`ccat__puff ccat__puff--${p.tone}`} style={{ '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--s': p.s, animationDelay: `${0.22 + p.d}s` }} />)}
          {SHARDS.map((s, i) => <i key={`s${i}`} className={`ccat__shard ${s.red ? 'ccat__shard--red' : ''}`} style={{ '--dx': `${s.dx}px`, '--dy': `${s.dy}px`, '--r': `${s.rot}deg` }} />)}
          <span className="ccat__ninpo"><PopText text="NINPO!" seed={4} /></span>
        </div>
      )}
    </div>
  );
}
