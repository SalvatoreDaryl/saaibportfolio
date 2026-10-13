import { useCallback, useState } from 'react';
import HeroScreen from './components/HeroScreen.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import MapPlaceholder from './components/MapPlaceholder.jsx';
import DestinationPlaceholder from './components/DestinationPlaceholder.jsx';
import SoundToggle from './components/SoundToggle.jsx';
import { DESTINATIONS } from './data/menu.js';
import { sfx } from './audio/sfx.js';

/* Navigation state only. Screens: hero | loading | map | profile | options | credits.
   A future transition layer can wrap `go()` without touching any screen. */
export default function App() {
  const [screen, setScreen] = useState('hero');
  const [next, setNext] = useState(null);
  const [menuIndex, setMenuIndex] = useState(0); // RESUME is selected on first open

  const toHero = useCallback(() => { sfx.back(); setScreen('hero'); }, []);
  const finishLoading = useCallback(() => setScreen(next || 'hero'), [next]);

  const go = ({ screen: s, loading }) => {
    if (loading) { setNext(loading); setScreen('loading'); } else setScreen(s);
  };

  if (screen === 'loading') return <LoadingScreen onDone={finishLoading} />;
  if (screen === 'map') return <MapPlaceholder onBack={toHero} />;
  if (DESTINATIONS[screen]) {
    return (
      <DestinationPlaceholder {...DESTINATIONS[screen]} onBack={toHero}>
        {screen === 'options' && <SoundToggle />}
      </DestinationPlaceholder>
    );
  }
  return <HeroScreen selected={menuIndex} onSelect={setMenuIndex} onNavigate={go} />;
}
