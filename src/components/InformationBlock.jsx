import MascotPeek from './MascotPeek.jsx';

export default function InformationBlock({ target = 'RESUME' }) {
  return (
    <div className="infowrap">
      <MascotPeek />
      <aside className="info" aria-label="Portfolio information">
        <p className="info__title">SAAIB.EXE</p>
        <p className="info__row">PORTFOLIO SYSTEM</p>
        <p className="info__row">DEVELOPER / DESIGNER</p>
        <i className="info__rule" aria-hidden />
        <p className="info__status"><b aria-hidden /> SYSTEM STATUS: ONLINE</p>
        <p className="info__signal">TARGET LOCKED // {target}</p>
        <i className="info__bars" aria-hidden />
      </aside>
    </div>
  );
}
