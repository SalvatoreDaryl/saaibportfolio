import { useCallback, useRef, useState } from 'react';
import HeroScreen from './components/HeroScreen.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import DestinationPlaceholder from './components/DestinationPlaceholder.jsx';
import SoundToggle from './components/SoundToggle.jsx';
import CityMap from './city/CityMap.jsx';
import { PAGES } from './pages/index.js';
import { districtById } from './data/districts.js';
import { DESTINATIONS } from './data/menu.js';
import { sfx } from './audio/sfx.js';

/* Navigation state only.
   view: { name: 'hero' | 'map' | 'district' | 'profile' | 'options' | 'credits', id? }

   EVERY page change goes through go(): a cover slides in, the next page is mounted underneath where
   nobody can see it half-built, and the cover only slides away once fonts and a few frames have settled.
   `lastDistrict` is remembered so returning to the city restores the highlighted district. */
const LABELS = { profile: 'OPENING PROFILE...', options: 'LOADING OPTIONS...', credits: 'ROLLING CREDITS...' };
const frames = (n) => new Promise((resolve) => {
  const tick = (k) => (k <= 0 ? resolve() : requestAnimationFrame(() => tick(k - 1)));
  tick(n);
});

export default function App() {
  const [view, setView] = useState({ name: 'hero' });
  const [overlay, setOverlay] = useState(null); // { text, phase }
  const [menuIndex, setMenuIndex] = useState(0); // RESUME is selected on first open
  const [lastDistrict, setLastDistrict] = useState(null);
  const busy = useRef(false);

  const go = useCallback((next, text) => {
    if (busy.current) return;
    busy.current = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sfx.whoosh();
    setOverlay({ text, phase: 'in' });
    setTimeout(() => {
      setOverlay({ text, phase: 'hold' });
      setView(next); // mounts behind the cover
      const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
      const minimum = new Promise((r) => setTimeout(r, reduced ? 120 : 520));
      Promise.all([fonts, frames(4), minimum]).then(() => {
        setOverlay({ text, phase: 'out' });
        setTimeout(() => { setOverlay(null); busy.current = false; }, reduced ? 0 : 420);
      });
    }, reduced ? 0 : 320);
  }, []);

  const toHero = useCallback(() => go({ name: 'hero' }, 'RETURNING TO MENU...'), [go]);
  const toCity = useCallback(() => go({ name: 'map' }, 'RETURNING TO CITY...'), [go]);
  const enterDistrict = useCallback((id) => {
    setLastDistrict(id);
    go({ name: 'district', id }, districtById(id).loading);
  }, [go]);
  const fromHero = useCallback(({ loading, screen }) => {
    if (loading === 'map') go({ name: 'map' }, 'INITIALIZING CITY...');
    else if (screen) go({ name: screen }, LABELS[screen] || 'LOADING...');
  }, [go]);

  let page;
  switch (view.name) {
    case 'map':
      page = <CityMap initialId={lastDistrict} onEnter={enterDistrict} onBack={toHero} />;
      break;
    case 'district': {
      const Page = PAGES[view.id];
      page = <Page onBack={toCity} />;
      break;
    }
    case 'profile':
    case 'options':
    case 'credits':
      page = (
        <DestinationPlaceholder {...DESTINATIONS[view.name]} onBack={toHero}>
          {view.name === 'options' && <SoundToggle />}
        </DestinationPlaceholder>
      );
      break;
    default:
      page = <HeroScreen selected={menuIndex} onSelect={setMenuIndex} onNavigate={fromHero} />;
  }

  return (
    <>
      {page}
      {overlay && <LoadingScreen text={overlay.text} phase={overlay.phase} />}
    </>
  );
}
