import useSound from '../hooks/useSound.js';
import { toggle, sfx } from '../audio/sfx.js';

export default function SoundButton() {
  const on = useSound();
  return (
    <button
      type="button"
      className={`snd ${on ? 'snd--on' : ''}`}
      aria-pressed={on}
      aria-label={`Sound effects ${on ? 'on' : 'off'}. Press to switch ${on ? 'off' : 'on'}.`}
      onClick={() => { toggle(); sfx.move(); }}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
        <path d="M3 9h4l5-4v14l-5-4H3z" fill="currentColor" />
        {on ? <path d="M15 8c2 2 2 6 0 8M18 5c4 4 4 10 0 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /> : <path d="M15 9l6 6M21 9l-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />}
      </svg>
      <span>SND {on ? 'ON' : 'OFF'}</span>
    </button>
  );
}
