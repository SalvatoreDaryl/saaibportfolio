/* Synthesised sound effects (Web Audio). No audio files, no dependencies.
   The AudioContext is created lazily inside a user gesture (browser autoplay rules), so the very first
   hover before any click/key stays silent. Enabled state persists in localStorage. */
let ctx = null;
let master = null;
let enabled = true;
const listeners = new Set();
const KEY = 'saaib-sound';

try { enabled = localStorage.getItem(KEY) !== 'off'; } catch { /* storage unavailable */ }

export const isEnabled = () => enabled;
export const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
export function setEnabled(v) {
  enabled = v;
  try { localStorage.setItem(KEY, v ? 'on' : 'off'); } catch { /* ignore */ }
  listeners.forEach((fn) => fn());
}
export const toggle = () => setEnabled(!enabled);

function ready() {
  if (!enabled) return false;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') { ctx.resume(); return false; }
  return ctx.state === 'running';
}

function env(g, t, peak, dur, attack = 0.004) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + dur);
}
function tone(type, f0, f1, t, dur, vol, dest) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  env(g, t, vol, dur);
  o.connect(g).connect(dest || master);
  o.start(t);
  o.stop(t + dur + 0.06);
}
function noise(t, dur, vol, f0, f1, q = 1.2) {
  const len = Math.max(1, Math.floor(ctx.sampleRate * (dur + 0.05)));
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i += 1) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.Q.value = q;
  f.frequency.setValueAtTime(f0, t);
  if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const g = ctx.createGain();
  env(g, t, vol, dur);
  src.connect(f).connect(g).connect(master);
  src.start(t);
  src.stop(t + dur + 0.06);
}

let lastMeow = 0;
let lastStar = 0;

export const sfx = {
  /* ratchet ticks as the dial turns */
  dial(steps = 1) {
    if (!ready()) return;
    const n = steps > 1 ? 6 : 4;
    const t0 = ctx.currentTime;
    for (let k = 0; k < n; k += 1) {
      const t = t0 + k * 0.055;
      noise(t, 0.03, 0.32, 1800 + k * 220, 2600 + k * 220, 2);
      tone('sine', 150, 60, t, 0.07, 0.22);
    }
  },
  /* menu selection blip */
  move() {
    if (!ready()) return;
    const t = ctx.currentTime;
    tone('square', 620, 900, t, 0.06, 0.07);
    tone('triangle', 1240, 1240, t, 0.05, 0.05);
  },
  confirm() {
    if (!ready()) return;
    const t = ctx.currentTime;
    tone('square', 523, 523, t, 0.07, 0.09);
    tone('square', 784, 784, t + 0.07, 0.14, 0.09);
    noise(t, 0.05, 0.18, 3000, 4000, 1);
  },
  back() {
    if (!ready()) return;
    const t = ctx.currentTime;
    tone('square', 440, 260, t, 0.12, 0.08);
  },
  error() {
    if (!ready()) return;
    const t = ctx.currentTime;
    tone('sawtooth', 220, 110, t, 0.22, 0.09);
  },
  whoosh() {
    if (!ready()) return;
    const t = ctx.currentTime;
    noise(t, 0.45, 0.4, 300, 3200, 0.8);
    tone('sine', 90, 40, t, 0.4, 0.2);
  },
  /* happy little meow when the cat is petted */
  meow() {
    if (!ready()) return;
    const now = performance.now();
    if (now - lastMeow < 1200) return;
    lastMeow = now;
    const t = ctx.currentTime;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 1300;
    f.Q.value = 3;
    f.connect(master);
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(620, t);
    o.frequency.exponentialRampToValueAtTime(1050, t + 0.12);
    o.frequency.exponentialRampToValueAtTime(720, t + 0.3);
    env(g, t, 0.16, 0.3, 0.03);
    o.connect(g).connect(f);
    o.start(t);
    o.stop(t + 0.4);
  },
  /* tiny typewriter blip for the cat's dialogue */
  blip() {
    if (!ready()) return;
    tone('square', 700 + Math.random() * 200, null, ctx.currentTime, 0.03, 0.022);
  },
  /* ninjutsu smoke poof */
  poof() {
    if (!ready()) return;
    const t = ctx.currentTime;
    noise(t, 0.4, 0.5, 2200, 260, 0.7);
    tone('sine', 480, 80, t, 0.32, 0.18);
    noise(t + 0.14, 0.26, 0.3, 3400, 900, 1);
  },
  /* very quiet zing for shooting stars */
  star() {
    if (!ready()) return;
    const now = performance.now();
    if (now - lastStar < 4000) return;
    lastStar = now;
    tone('sine', 2400, 3800, ctx.currentTime, 0.28, 0.025);
  },
};
