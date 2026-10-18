/* Central district data for the city map. `anchor` is the landmark's pin (top of the building) in
   the city illustration's own 1600x900 coordinate system. Markers are placed as percentages of
   that system, so they stay on the right buildings at any screen size. `label` is the marker label's
   offset from the pin (px at scale 1). Real contact URLs and project data are NOT invented here. */
export const MAP_W = 1600;
export const MAP_H = 900;

export const DISTRICTS = [
  {
    id: 'vault', no: '01', name: 'THE VAULT', destination: 'PROJECT ARCHIVE',
    tagline: 'A record of things built, broken, and brought to life.',
    description: 'Projects and case studies. Open the archive to explore what has been built.',
    short: 'Projects and case studies.',
    loading: 'ACCESSING THE VAULT...',
    bounds: { l: 215, r: 165, b: 290 }, anchor: { x: 470, y: 372 }, label: { dx: 64, dy: -58, side: 'r' },
  },
  {
    id: 'dossier', no: '02', name: 'THE DOSSIER', destination: 'PROFILE / ABOUT ME',
    tagline: 'A private file on the person behind the project.',
    description: 'Introduction, background, interests, goals, and the developer profile.',
    short: 'Background, interests, goals.',
    loading: 'OPENING DOSSIER...',
    bounds: { l: 165, r: 155, b: 210 }, anchor: { x: 270, y: 218 }, label: { dx: 56, dy: -36, side: 'r' },
  },
  {
    id: 'arsenal', no: '03', name: 'THE ARSENAL', destination: 'SKILLS AND TECHNOLOGIES',
    tagline: 'Everything on the rack, ready to be put to work.',
    description: 'Programming languages, tools, technical skills, and creative skills.',
    short: 'Technical and creative skills.',
    loading: 'ACTIVATING ARSENAL...',
    bounds: { l: 235, r: 215, b: 312 }, anchor: { x: 1010, y: 250 }, label: { dx: -60, dy: -44, side: 'l' },
  },
  {
    id: 'exit', no: '04', name: 'THE EXIT GATE', destination: 'CONTACT',
    tagline: 'The way out is also the way in. Say hello.',
    description: 'Email, GitHub, LinkedIn, and collaboration. Links appear once real URLs are supplied.',
    short: 'Contact and links.',
    loading: 'APPROACHING EXIT GATE...',
    bounds: { l: 335, r: 235, b: 290 }, anchor: { x: 1360, y: 380 }, label: { dx: -72, dy: -62, side: 'l' },
  },
];

export const districtById = (id) => DISTRICTS.find((d) => d.id === id);
