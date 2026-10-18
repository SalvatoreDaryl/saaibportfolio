import SoundButton from '../components/SoundButton.jsx';

/* Restrained persistent interface: logo, map label, instruction, key legend, way back to the menu. */
export default function CityHUD({ onMenu, onGuide, hideKeys }) {
  return (
    <div className="hud">
      <div className="hud__id">
        <b>SAAIB.EXE</b>
        <span>MAP / CITY</span>
      </div>
      <p className="hud__instr">SELECT A DISTRICT</p>
      <button type="button" className="hud__menu" onClick={onMenu}>◂ MAIN MENU <small>ESC</small></button>
      <button type="button" className="hud__guide" onClick={onGuide}>? GUIDE</button>
      <SoundButton />
      {!hideKeys && <p className="hud__keys">
        <span>ARROWS</span> MOVE <i>·</i> <span>ENTER</span> SELECT / ENTER <i>·</i> <span>ESC</span> CLOSE / BACK
      </p>}
    </div>
  );
}
