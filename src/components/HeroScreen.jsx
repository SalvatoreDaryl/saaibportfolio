import { useEffect, useState } from 'react';
import CircularHeader from './CircularHeader.jsx';
import InformationBlock from './InformationBlock.jsx';
import GameMenu from './GameMenu.jsx';
import NightSky from './NightSky.jsx';
import NightCity from './NightCity.jsx';
import SoundButton from './SoundButton.jsx';
import useKeys from '../hooks/useKeys.js';
import useResumeDownload, { RESUME_URL, RESUME_FILE } from '../hooks/useResumeDownload.js';
import { MENU } from '../data/menu.js';
import { sfx } from '../audio/sfx.js';
import { computeFan } from './fan.js';

export default function HeroScreen({ selected, onSelect, onNavigate }) {
  const { download, missing, dismiss } = useResumeDownload();
  // running count of menu positions moved, so the dial keeps turning the same way through wrap-around
  const [dial, setDial] = useState(selected);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const select = (i) => {
    if (i === selected) return;
    const n = MENU.length;
    let d = i - selected;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    setDial((v) => v + d);
    sfx.dial(Math.abs(d));
    sfx.move();
    onSelect(i);
  };

  const activate = (item, e) => {
    sfx.confirm();
    if (item.kind === 'download') return download(e);
    dismiss();
    if (item.kind === 'loading') return onNavigate({ loading: item.to });
    return onNavigate({ screen: item.to });
  };

  useKeys({
    ArrowUp: () => select((selected + MENU.length - 1) % MENU.length),
    ArrowDown: () => select((selected + 1) % MENU.length),
    Enter: () => activate(MENU[selected]),
  });

  return (
    <section className="hero" aria-label="Title screen">
      <div className="hero__stage">
        <NightSky />
        <NightCity className="hero__city" />
        <CircularHeader dial={dial} needle={computeFan(MENU.length, selected)[selected].a} />
        <InformationBlock target={MENU[selected].label} />
        <SoundButton />

        <div className="hero__top">
          <p className="hero__kicker">MAIN MENU // MIDNIGHT</p>
          <p className="hero__hint">MOUSE TO SELECT · ENTER TO CONFIRM · ESC TO RETURN</p>
          {missing && (
            <p className="notice" role="status">
              RESUME PDF NOT FOUND. Add <b>{RESUME_FILE}</b> to the <b>public</b> folder.
              <button type="button" onClick={dismiss} aria-label="Dismiss">✕</button>
            </p>
          )}
        </div>
        <GameMenu items={MENU} selected={selected} onSelect={select} onActivate={activate} resumeHref={RESUME_URL} />
      </div>
    </section>
  );
}
