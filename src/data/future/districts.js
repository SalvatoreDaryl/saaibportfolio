/* City districts. `x`/`y` are map coordinates (1440x820 canvas) used for directional key movement. */
export const DISTRICTS = [
  { id: 'vault', no: '01', name: 'THE VAULT', menu: 'PROJECT ARCHIVE', chapter: '02', loading: 'ACCESSING ARCHIVE...', x: 470, y: 330,
    blurb: 'Projects and case studies.', long: 'A secured industrial block. Five case files on record: desktop software, web apps, branding, and business sites.' },
  { id: 'dossier', no: '02', name: 'THE DOSSIER', menu: 'PROFILE', chapter: '03', loading: 'OPENING CASE FILE...', x: 150, y: 200,
    blurb: 'About, background, education.', long: 'A quiet, secluded tower with one lit window. Who Muhammad Saaib is, what he studies, and how he thinks.' },
  { id: 'arsenal', no: '03', name: 'THE ARSENAL', menu: 'SKILL SET', chapter: '04', loading: 'LOADING ARSENAL...', x: 180, y: 530,
    blurb: 'Technical and creative skills.', long: 'A gantry yard of equipment. Programming, web development, computer science fundamentals, and creative work.' },
  { id: 'guestbook', no: '04', name: 'THE GUESTBOOK', menu: 'GUESTBOOK', chapter: '05', loading: 'RECEIVING MESSAGES...', x: 800, y: 220,
    blurb: 'Testimonials and recommendations.', long: 'A communications tower and public billboard. What other people say about working with him.' },
  { id: 'exit', no: '05', name: 'THE EXIT GATE', menu: 'CONTACT', chapter: '06', loading: 'TRANSFERRING TO EXIT GATE...', x: 1110, y: 440,
    blurb: 'Contact and social links.', long: 'A terminal and bridge at the edge of the city. Email, GitHub, LinkedIn, and an invitation to collaborate.' },
  { id: 'backrooms', no: '06', name: 'THE BACKROOMS', menu: 'BACKROOMS', chapter: '??', loading: 'BREACHING RESTRICTED AREA...', x: 720, y: 610, hidden: true,
    blurb: 'Experiments and secrets.', long: 'A fenced-off area marked with a red symbol. Experiments, easter eggs, and one day, a ninja cat mini-game.' },
];
export const districtById = (id) => DISTRICTS.find((d) => d.id === id);

export const MENU_ITEMS = [
  { id: 'start', label: 'START', no: '01', desc: 'Enter the city map and explore the portfolio.', to: { name: 'map' }, primary: true },
  { id: 'profile', label: 'PROFILE', no: '02', desc: 'Background, interests, and professional identity.', to: { name: 'district', id: 'dossier' } },
  { id: 'archive', label: 'PROJECT ARCHIVE', no: '03', desc: 'Open the project showcase directly.', to: { name: 'district', id: 'vault' } },
  { id: 'skills', label: 'SKILL SET', no: '04', desc: 'Technical skills and creative abilities.', to: { name: 'district', id: 'arsenal' } },
  { id: 'contact', label: 'CONTACT', no: '05', desc: 'Email, GitHub, LinkedIn, and collaboration.', to: { name: 'district', id: 'exit' } },
  { id: 'credits', label: 'CREDITS / INFO', no: '06', desc: 'Portfolio concept, tech stack, and site information.', to: { name: 'credits' } },
];
