# SAAIB.EXE — hero screen and foundation

React + Vite + plain CSS. Nighttime palette only: Midnight #08090D, Obsidian #111218, Charcoal #202127,
Muted Grey #777982, Moonlit White #F2F0EA, Phantom Red #E52432 (CSS variables in `src/styles/base.css`).

```bash
npm install
npm run dev
npm run build
```

## RESUME download — action needed
Place your real PDF at **`public/Saaib_Resume.pdf`** (exact name). RESUME is a real `<a download>`; it checks the
file exists first and shows a "RESUME PDF NOT FOUND" notice (with an error sound) instead of faking a download.

## What moves
- **Menu fan (Persona-style).** Every option is a ransom-note word: each letter is a chunky cut-out (white fill, thick black
  outline, thin white edge) with its own tilt, size and baseline; some letters are inverted, some carry a star. Words sit on
  radial lines fanning out from the ring's centre over a jagged red wedge with ink slashes. The selected word is huge, with a
  white arrow number plate and a sub-label; the others sit smaller around it. Lettering lives in `PopText.jsx`; the fan
  geometry (angles, slot sizes) lives in `fan.js`.
- **Dial = a real gauge.** The ring has a hub at its centre and a red needle that pivots there and swings (spring overshoot
  plus a faint idle tremble) to point down the selected word's line. A static gauge scale on the ring's rim has a red marker
  that follows the needle. The ring's tick dial, red band and text ring also turn with each step.
- **Hover safety.** Hover selects only on real pointer movement and is locked ~420ms after each change, so the fan never
  chases a resting cursor. Focus (keyboard) and click also select/activate.
- **Ninja cat:** peeks over the information block; idles, ducks, and reacts to hover/tap (happy eyes, smile, hop, meow).
- **Sky (`NightSky`, canvas)** and **city (`NightCity`, SVG):** stars, shooting stars, clouds, plane, moon, flickering windows,
  searchlights, cars. All motion is disabled under `prefers-reduced-motion`.

## Sound (`src/audio/sfx.js`)
Synthesised with Web Audio, no audio files: dial ratchet ticks, menu blip, confirm, back, error, loading whoosh,
cat meow, faint shooting-star zing. Browsers only allow audio after a first click/key press, so hover sounds start once
the visitor has interacted. Toggle with the SND button (top-right) or OPTIONS; the choice is saved in localStorage.

## Structure
- `src/App.jsx` — navigation state (hero | loading | map | profile | options | credits).
- `src/components/` — HeroScreen, CircularHeader (dial one), GameMenu (fan, wedge, needle) + MenuItem + PopText, InformationBlock, MascotPeek, LoadingScreen, MapPlaceholder
  (isolated; replace with the real night-city map), DestinationPlaceholder, NinjaCat, NightSky, NightCity, SoundButton, SoundToggle.
- `src/hooks/` — useKeys (arrows/Enter/Esc; never intercepts typing), useResumeDownload, useSound.
- `src/data/menu.js` — menu order and placeholder copy. `src/data/future/` — parked data from the larger redesign brief (unused).
- `src/styles/` — `base.css`, `hero.css`, `screens.css`, `alive.css` (cat + city motion).

## Responsive
PC: ring left, wheel right, tall city; the wheel is sized from one unit (`--u`) so it scales with the window. Tablet and phone
(<=900px): ring becomes a cropped arc at the top, the wheel comes next (its centre sits off-screen left so it still curves),
then the info block. Checked at 1920, 1440, 1366x600, 1024, 820, 390.
