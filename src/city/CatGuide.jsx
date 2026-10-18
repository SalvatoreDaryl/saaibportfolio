import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import PopText from '../components/PopText.jsx';
import { DISTRICTS } from '../data/districts.js';
import { sfx } from '../audio/sfx.js';

/* Persona-style dialogue box for the cat: a red burst behind a skewed black panel, a name tag,
   typewriter text with cut-out lettering for the important words, and (on the last step) choices. */
const flatten = (line) => line.map((seg) => (typeof seg === 'string' ? { k: 't', s: seg } : seg.pop ? { k: 'p', s: seg.pop } : { k: 'e', s: seg.em }));

const CatGuide = forwardRef(function CatGuide({ step, index, last, left, docked, vw, onTalking, onNext, onBack, onSkip, onPick }, ref) {
  const segs = useMemo(() => flatten(step.line), [step]);
  const total = useMemo(() => segs.reduce((n, s) => n + s.s.length, 0), [segs]);
  const [n, setN] = useState(0);
  const done = n >= total;
  const spot = step.id ? DISTRICTS.find((d) => d.id === step.id) : null;

  useEffect(() => {
    setN(0);
    const id = setInterval(() => setN((v) => {
      if (v >= total) { clearInterval(id); return v; }
      if (v % 3 === 0) sfx.blip();
      return v + 1;
    }), 24);
    return () => clearInterval(id);
  }, [index, total]);

  // tell the cat when it is "speaking" (text still typing) so its mouth can move
  useEffect(() => { onTalking?.(!done); }, [done]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => onTalking?.(false), []); // eslint-disable-line react-hooks/exhaustive-deps

  const advance = () => {
    if (!done) { setN(total); return; }
    onNext();
  };
  useImperativeHandle(ref, () => ({ advance, back: () => onBack() }));

  let off = 0;
  const parts = segs.map((sg, i) => {
    const shown = Math.max(0, Math.min(sg.s.length, n - off));
    off += sg.s.length;
    if (!shown) return null;
    const txt = sg.s.slice(0, shown);
    if (sg.k === 'p') return <span key={i} className="guide__pop" role="img" aria-label={sg.s}><PopText text={txt} seed={i + index} /></span>;
    if (sg.k === 'e') return <span key={i} className="guide__em">{txt}</span>;
    return <span key={i}>{txt}</span>;
  });

  const style = docked
    ? { left: 10, right: 10, bottom: 74 }
    : { left, width: Math.min(1000, vw - left - 24), bottom: 18 };

  return (
    <div className="guide" style={style} role="dialog" aria-label="Ninja cat guide" aria-live="polite" onClick={advance} key={`g${index}`}>
      <i className="guide__shard" aria-hidden />
      <i className="guide__slash" aria-hidden />
      <span className="guide__name"><b>★</b> NINJA CAT</span>
      {spot && <span className="guide__spot">{spot.no} // {spot.name}</span>}
      <div className="guide__box">
        <button type="button" className="guide__skip" onClick={(e) => { e.stopPropagation(); onSkip(); }}>SKIP ▸▸</button>
        <p className="guide__text">{parts}<span className="guide__caret" aria-hidden /></p>
        {last && done && (
          <div className="guide__choices" onClick={(e) => e.stopPropagation()}>
            {DISTRICTS.map((d) => (
              <button key={d.id} type="button" className="guide__choice" onClick={() => onPick(d.id)}>
                <b>{d.no}</b><span>{d.name}</span><small>{d.destination}</small>
              </button>
            ))}
          </div>
        )}
        <span className="guide__next" aria-hidden>{done ? (last ? 'OR CLOSE ▸' : 'NEXT') : '...'} <i /></span>
      </div>
    </div>
  );
});

export default CatGuide;
