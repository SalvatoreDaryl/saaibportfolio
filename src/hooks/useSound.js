import { useSyncExternalStore } from 'react';
import { isEnabled, subscribe } from '../audio/sfx.js';

export default function useSound() {
  return useSyncExternalStore(subscribe, isEnabled);
}
