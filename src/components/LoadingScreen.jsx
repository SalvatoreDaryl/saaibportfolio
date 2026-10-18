import NinjaCat from './NinjaCat.jsx';

const CELLS = 10;

/* Cover shown while a page is invoked. App mounts the next page underneath, waits until it is fully
   ready (fonts + painted frames), then lets this cover slide away. phase: in | hold | out. */
export default function LoadingScreen({ text = 'LOADING...', phase = 'hold' }) {
  return (
    <section className={`loading loading--${phase}`} role="status" aria-live="polite" aria-label={text}>
      <i className="loading__edge loading__edge--l" aria-hidden />
      <i className="loading__edge loading__edge--r" aria-hidden />
      <div className="loading__slash" aria-hidden />
      <NinjaCat pose="stand" className="loading__cat" decorative />
      <div className="loading__copy">
        <p className="loading__tag">NOW LOADING</p>
        <h1 className="loading__text">{text}</h1>
        <div className="loading__bar" aria-hidden>
          {Array.from({ length: CELLS }, (_, i) => <i key={i} style={{ animationDelay: `${i * 60}ms` }} />)}
        </div>
      </div>
    </section>
  );
}
