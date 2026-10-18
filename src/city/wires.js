import { DISTRICTS } from '../data/districts.js';

/* Dull cables joining the four nodes. Confirming a district lights the cables attached to it. */
const LINKS = [['dossier', 'vault'], ['vault', 'arsenal'], ['arsenal', 'exit'], ['vault', 'exit']];
const anchors = Object.fromEntries(DISTRICTS.map((d) => [d.id, d.anchor]));

export const EDGES = LINKS.map(([a, b], i) => {
  const A = anchors[a];
  const B = anchors[b];
  const dist = Math.hypot(B.x - A.x, B.y - A.y);
  const sag = Math.min(80, Math.max(24, dist * 0.1));
  const c = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 + sag * 2 };
  return { i, a, b, d: `M${A.x} ${A.y} Q${c.x} ${c.y} ${B.x} ${B.y}` };
});

export const edgesOf = (id) => EDGES.filter((e) => e.a === id || e.b === id).map((e) => e.i);
