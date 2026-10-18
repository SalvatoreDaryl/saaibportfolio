import { EDGES } from './wires.js';

/* All cables stay dull. The ones attached to the confirmed district light up red. */
export default function CityWires({ hot = [] }) {
  return (
    <svg className="wires" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {EDGES.map((e) => <path key={`u${e.i}`} className="wire__under" d={e.d} />)}
      {EDGES.map((e) => <path key={`c${e.i}`} className="wire__core" d={e.d} />)}
      {hot.map((i) => <path key={`h${i}`} className="wire__hot" d={EDGES[i].d} />)}
    </svg>
  );
}
