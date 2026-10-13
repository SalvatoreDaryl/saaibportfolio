import useSound from '../hooks/useSound.js';
import { toggle, sfx } from '../audio/sfx.js';

/* The one real setting so far: sound effects on/off (saved in this browser). */
export default function SoundToggle() {
  const on = useSound();
  return (
    <div className="setting">
      <span className="setting__label" id="snd-label">SOUND EFFECTS</span>
      <button type="button" role="switch" aria-checked={on} aria-labelledby="snd-label" className={`switch ${on ? 'switch--on' : ''}`} onClick={() => { toggle(); sfx.move(); }}>
        <i aria-hidden /><b>{on ? 'ON' : 'OFF'}</b>
      </button>
    </div>
  );
}
