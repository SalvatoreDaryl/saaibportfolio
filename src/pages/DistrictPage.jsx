import NightSky from '../components/NightSky.jsx';
import NinjaCat from '../components/NinjaCat.jsx';
import PopText from '../components/PopText.jsx';
import useKeys from '../hooks/useKeys.js';

/* Shared frame for the four district pages. Each page component below supplies its own copy,
   so the real pages can replace them one at a time without touching the map. */
export default function DistrictPage({ district, status, message, onBack }) {
  useKeys({ Escape: onBack });
  return (
    <section className={`dpage dpage--${district.id}`} aria-label={district.name}>
      <NightSky className="dpage__sky" />
      <div className="dpage__shard" aria-hidden />
      <div className="dpage__inner">
        <p className="dpage__kicker">DISTRICT {district.no} // {district.destination}</p>
        <h1 className="dpage__title" aria-label={district.name}>
          <PopText text={district.name.replace('THE ', '')} seed={Number(district.no)} />
        </h1>
        <p className="dpage__status">{status}</p>
        <p className="dpage__msg">{message}</p>
        <button type="button" className="gbtn" onClick={onBack}><span>BACK TO CITY</span><small>ESC</small></button>
      </div>
      <NinjaCat pose="sit" className="dpage__cat" decorative />
    </section>
  );
}
