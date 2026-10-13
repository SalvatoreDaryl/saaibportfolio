/* Exact menu order required by the brief. `kind` decides what activation does. */
export const MENU = [
  { id: 'resume', label: 'RESUME', sub: 'DOWNLOAD PDF', kind: 'download' },
  { id: 'new-game', label: 'NEW GAME', sub: 'ENTER THE CITY', kind: 'loading', to: 'map' },
  { id: 'profile', label: 'PROFILE', sub: 'WHO IS SAAIB', kind: 'go', to: 'profile' },
  { id: 'options', label: 'OPTIONS', sub: 'SYSTEM', kind: 'go', to: 'options' },
  { id: 'credits', label: 'CREDITS', sub: 'ABOUT THIS SITE', kind: 'go', to: 'credits' },
];


export const DESTINATIONS = {
  profile: {
    kicker: 'DESTINATION / PROFILE',
    title: 'PROFILE',
    body: 'The character file for Muhammad Saaib will live here: background, education, interests, and philosophy. Placeholder for the next phase.',
  },
  options: {
    kicker: 'DESTINATION / OPTIONS',
    title: 'OPTIONS',
    body: 'Sound effects can be switched on or off below. Accessibility and display preferences will be added in a later phase.',
  },
  credits: {
    kicker: 'DESTINATION / CREDITS',
    title: 'CREDITS',
    body: 'SAAIB.EXE is a personal portfolio project by Muhammad Saaib, built with React and Vite. Typefaces: Bebas Neue, Barlow Condensed, Space Grotesk, and Space Mono.',
  },
};
