import { useEffect } from 'react';
import NinjaCat from './NinjaCat.jsx';
import { sfx } from '../audio/sfx.js';

const CELLS = 10;

/* Short interstitial: red wipe, stepped progress, label. `onDone` fires after `duration`. */
export default function LoadingScreen({ text = 'ENTERING THE CITY....', duration = 1100, onDone }) {
  useEffect(() => { sfx.whoosh(); }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(onDone, reduced ? 350 : duration);
    return () => clearTimeout(t);
  }, [duration, onDone]);

  return (
    <section className="loading" role="status" aria-live="polite" aria-label={text}>
      <div className="loading__wipe" aria-hidden />
      <div className="loading__slash" aria-hidden />
      <NinjaCat pose="stand" className="loading__cat" decorative />
      <div className="loading__copy">
        <p className="loading__tag">NOW LOADING</p>
        <h1 className="loading__text">{text}</h1>
        <div className="loading__bar" aria-hidden>
          {Array.from({ length: CELLS }, (_, i) => <i key={i} style={{ animationDelay: `${(i * duration * 0.8) / CELLS}ms` }} />)}
        </div>
      </div>
    </section>
  );
}
