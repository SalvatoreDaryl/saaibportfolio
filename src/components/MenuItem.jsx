import { forwardRef, useRef } from 'react';
import PopText from './PopText.jsx';

/* One word of the fan. Real <a download> for RESUME, <button> for the rest.
   Hover selects only on real pointer movement (the fan re-lays itself under a resting cursor). */
const MenuItem = forwardRef(function MenuItem({ item, index, selected, onHover, onFocusSelect, onActivate, href }, ref) {
  const last = useRef({ x: -1, y: -1 });
  const onMove = (e) => {
    if (e.pointerType === 'touch') return;
    const d = Math.hypot(e.clientX - last.current.x, e.clientY - last.current.y);
    last.current = { x: e.clientX, y: e.clientY };
    if (d >= 3) onHover();
  };
  const inner = (
    <>
      <span className="mi__tag" aria-hidden>{String(index + 1).padStart(2, '0')}</span>
      <PopText text={item.label} seed={index * 3 + 1} />
      <span className="mi__sub" aria-hidden>{item.sub}</span>
    </>
  );
  const common = {
    ref,
    className: `mi ${selected ? 'mi--sel' : ''}`,
    'aria-label': item.label,
    'aria-current': selected ? 'true' : undefined,
    onPointerMove: onMove,
    onFocus: onFocusSelect,
    onClick: onActivate,
  };
  return item.kind === 'download'
    ? <a {...common} href={href} download>{inner}</a>
    : <button type="button" {...common}>{inner}</button>;
});

export default MenuItem;
