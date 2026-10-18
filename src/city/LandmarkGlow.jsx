import { DISTRICTS, MAP_W, MAP_H } from '../data/districts.js';
import Landmark from './Landmarks.jsx';

/* Idle invitation: one landmark at a time slowly fades its whole red outline in and out.
   Each landmark gets its own small SVG layer (cropped to the building) whose opacity is animated by CSS,
   so the fade is GPU-composited and never repaints the big city illustration. */
export default function LandmarkGlow({ activeId = null }) {
  return (
    <>
      {DISTRICTS.map((d) => {
        const { anchor: a, bounds: b } = d;
        const pad = 14;
        const x = a.x - b.l - pad;
        const y = a.y - pad;
        const w = b.l + b.r + pad * 2;
        const h = b.b + pad * 2;
        return (
          <svg
            key={d.id}
            className={`glow ${activeId === d.id ? 'glow--run' : ''}`}
            viewBox={`${x} ${y} ${w} ${h}`}
            style={{ left: `${(x / MAP_W) * 100}%`, top: `${(y / MAP_H) * 100}%`, width: `${(w / MAP_W) * 100}%`, height: `${(h / MAP_H) * 100}%` }}
            aria-hidden="true"
          >
            <Landmark id={d.id} anchor={a} active={false} blink={false} />
          </svg>
        );
      })}
    </>
  );
}
