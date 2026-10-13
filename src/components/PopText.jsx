/* Ransom-note display lettering inspired by the reference menu: every letter is its own chunky
   cut-out with a white fill, a thick black outline and a thin white outer edge (three stacked copies),
   with its own tilt, size and baseline shift. Every third letter is inverted (black fill, white outline).
   Purely presentational: the parent supplies the accessible name. */
const ROT = [-5, 3, -2, 5, -6, 2, -3, 5, -2, 4];
const SCL = [1.1, 0.95, 1.05, 0.92, 1.12, 0.98, 1.06, 0.94, 1.03, 1.08];
const DY = [0, 0.04, -0.03, 0.05, -0.04, 0.02, -0.05, 0.03, 0, -0.02];

export default function PopText({ text, seed = 0 }) {
  return (
    <span className="pw" aria-hidden="true">
      {[...text].map((ch, k) => {
        if (ch === ' ') return <span className="pw__gap" key={k} />;
        const j = (k + seed) % ROT.length;
        const inv = k > 0 && (k + seed) % 4 === 3;
        const star = ch === 'O' || (k === 0 && ch === 'P');
        return (
          <span
            key={k}
            data-l={ch}
            className={`pl ${inv ? 'pl--inv' : ''}`}
            style={{ '--r': ROT[j], '--ls': k === 0 ? Math.max(SCL[j], 1.1) : SCL[j], '--dy': DY[j] }}
          >
            {ch}
            {star && <i className="pl__star" />}
          </span>
        );
      })}
    </span>
  );
}
