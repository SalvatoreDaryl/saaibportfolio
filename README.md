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


## Page 2: the city map (`src/city/`)
- **`CityBackground`** draws an original night city as layered SVG: a fisheye "bowl" skyline, flat greys with dark outlines,
  hatching, sparse white windows, red rooftop sparks, an avenue, a cross street and an elevated bridge, plus big dark
  foreground roofs. **`Landmarks`** holds the four district landmarks: pagoda tower (Dossier), striped vault tower (Vault),
  lattice mast with tanks and gantry (Arsenal), gate with bridge and EXIT sign (Exit Gate).
- **Markers** (`DistrictMarker`) are an HTML layer inside the same coordinate space as the illustration (positions are
  percentages of 1600x900, from `src/data/districts.js`), so they stay on the right buildings at any size.
- **Hover/focus** = red outline on the building, other districts dim, small info panel. **Click / Enter** = opens the preview
  (`DistrictPreview`) with ENTER DISTRICT / BACK. Selecting and entering are separate. The popup picks a spot that avoids its
  own landmark and the other markers, and draws a connector to the pin. One preview at a time; Esc or an outside click closes it.
- **Keyboard:** arrows move between districts, Enter selects/enters, Esc closes the preview, then returns to the menu.
- **Pages:** `src/pages/` has `TheVaultPage`, `TheDossierPage`, `TheArsenalPage`, `TheExitGatePage` (placeholders), registered
  in `pages/index.js`. Each returns to the city; the city restores the last district's highlight.
- **Transitions:** the short loading screen shows `INITIALIZING CITY...`, `ACCESSING THE VAULT...`, `OPENING DOSSIER...`,
  `ACTIVATING ARSENAL...`, `APPROACHING EXIT GATE...`.
- **Small screens:** the illustration covers the window and pans to the selected district; markers are labelled above their
  pins, popups dock above a four-button district selector, and everything works by touch.

## Smoothness and loading (latest pass)
- **Loading covers on every page change** (menu, city, districts, back): `App.go()` slides a cover in, mounts the next page
  underneath it, waits for fonts and a few painted frames, then slides the cover away, so a page is only ever seen fully built.
- **Why it was choppy, and the fix:** the ring's displacement filter was recomputed every frame while it turned, and the
  skyline repainted constantly. The ring is now stacked SVG layers turned with a composited CSS transform; the skyline is a
  static SVG with a tiny separate layer for beacons, searchlights and cars; filters/blur were removed from moving words
  (text-shadow instead); the per-mouse-move parallax variable was removed; easing is now short and smooth.
- **Selection indicator:** no dotted outline anywhere. The selected menu word gets a dark rectangle that fades in and sweeps
  across behind it, left to right.
- **Map clicks:** point-and-click works end to end. Click a marker, then ENTER DISTRICT (or click the same marker again).
  A bug where the popup closed on mouse-down (before the click landed) is fixed.
- **CSS namespace:** the map uses `.cmap*` classes so it can never collide with the hero skyline's `.city`.

## The cat, the tour, and the cables (map)
- **Cat guide (`CityCat`, `CatGuide`, `src/data/guide.js`):** the ninja cat idles on a foreground rooftop in front of the city.
  A Persona-style dialogue box (red burst, skewed black panel, name tag, typewriter text, cut-out lettering for key words)
  says "select what you want to explore", then spotlights each district in turn (red outline, other districts dim) and says what
  it is and what it contains, then offers the four districts as choices. Enter / Space / click = next, arrows = next/back,
  Esc or SKIP = close. It plays once per page load; click the cat or the `? GUIDE` button to hear it again. Edit the lines
  in `guide.js` (strings, `{ pop }`, `{ em }`).
- **Ninjutsu on confirm:** ENTER DISTRICT (or Enter, or a second click on an open marker) makes the cat do a hand-seal ring,
  spin-vanish, smoke puff and shards (~0.64s), then the loading cover takes over. The cat is back when you return to the city.
- **Cables (`wires.js`, `CityWires`):** all cables stay dull; the ones attached to the confirmed (opened) district light red.
- **Idle invitation (`LandmarkGlow`):** when nothing is selected, hovered or being toured, ONE landmark at a time slowly fades its
  whole red outline in (about 1.6s), holds, and fades out (about 2s), then there is a pause of roughly 3-5s before another
  randomly chosen building does the same. Each landmark has its own small overlay layer and only opacity is animated, so it
  is smooth and never repaints the city.
- **Speaking:** while the dialogue is typing, the cat's mouth opens and closes and its body bobs faster (`talking` prop on
  `NinjaCat`, driven by `CatGuide`'s `onTalking`); it stops when the line is complete.
- **Size:** cat and dialogue are larger (cat up to ~184px, dialogue text ~34px at 1440 wide). Sizes live in `CityMap.jsx`
  (`perchW`, `catW`) and the `.guide__*` rules in `city.css`.
- Reduced motion: no ninjutsu animation or idle glow; the cat just disappears.
