/* Geometry of the menu fan, shared by the words and the needle.
   Words are laid out on radial lines from the ring's centre. Angles are degrees (positive = clockwise/down).
   The selected word takes a big angular slot, the rest take small ones; the whole fan is centred on 0. */
export const R0 = 68; // radius (in layout units `u`) where each word starts
const SLOT_SELECTED = 16;
const SLOT_OTHER = 8.4;
export const SCALE_OTHER = 0.5;

export function computeFan(count, selected) {
  const slots = Array.from({ length: count }, (_, i) => (i === selected ? SLOT_SELECTED : SLOT_OTHER));
  const total = slots.reduce((a, b) => a + b, 0);
  let acc = -total / 2;
  return slots.map((slot, i) => {
    const a = acc + slot / 2;
    acc += slot;
    return { a, scale: i === selected ? 1 : SCALE_OTHER };
  });
}
