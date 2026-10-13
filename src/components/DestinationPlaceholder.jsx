import useKeys from '../hooks/useKeys.js';
import NinjaCat from './NinjaCat.jsx';
import NightSky from './NightSky.jsx';

/* Shared dark placeholder for PROFILE / OPTIONS / CREDITS (and the base for the map placeholder). */
export default function DestinationPlaceholder({ kicker, title, body, onBack, children, backLabel = 'RETURN TO MENU' }) {
  useKeys({ Escape: onBack });
  return (
    <section className="dest">
      <NightSky className="dest__sky" />
      <div className="dest__slab" aria-hidden />
      <div className="dest__inner">
        <p className="dest__kicker">{kicker}</p>
        <h1 className="dest__title">{title}</h1>
        <p className="dest__body">{body}</p>
        {children}
        <button type="button" className="gbtn" onClick={onBack}>
          <span>{backLabel}</span><small>ESC</small>
        </button>
      </div>
      <NinjaCat pose="sit" className="dest__cat" decorative />
    </section>
  );
}
