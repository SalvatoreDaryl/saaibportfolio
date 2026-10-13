import { useRef, useState } from 'react';
import NinjaCat from './NinjaCat.jsx';
import { sfx } from '../audio/sfx.js';

/* The ninja cat peeking over the information block. Idles on its own; hover or tap makes it happy. */
export default function MascotPeek() {
  const [happy, setHappy] = useState(false);
  const timer = useRef(0);
  const pet = () => { clearTimeout(timer.current); setHappy(true); sfx.meow(); };
  const unpet = (ms) => { clearTimeout(timer.current); timer.current = setTimeout(() => setHappy(false), ms); };
  return (
    <div
      className="info__cat"
      onPointerEnter={pet}
      onPointerLeave={() => unpet(450)}
      onClick={() => { pet(); unpet(1600); }}
    >
      <NinjaCat pose="peek" happy={happy} decorative />
    </div>
  );
}
