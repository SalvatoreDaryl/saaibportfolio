/* The cat's guided tour of the map. Lines are arrays of segments:
   plain strings, { pop } (exaggerated cut-out lettering), { em } (red emphasis).
   `id` is the district spotlighted on that step. Only real, supplied facts are stated. */
export const GUIDE = [
  { id: null, line: ['Yo! Welcome to the city. Every district is a piece of this portfolio. ', { pop: 'SELECT' }, ' what you want to ', { pop: 'EXPLORE' }, '. First, a quick tour!'] },
  { id: 'vault', line: ["That's ", { pop: 'THE VAULT' }, '. The ', { em: 'PROJECT ARCHIVE' }, '. Everything that was built lives here as case files, one manga panel per project.'] },
  { id: 'dossier', line: ['Over there: ', { pop: 'THE DOSSIER' }, ". It's the ", { em: 'PROFILE' }, ': who he is, his background, his interests and his goals.'] },
  { id: 'arsenal', line: [{ pop: 'THE ARSENAL' }, ' holds the ', { em: 'SKILLS' }, ': programming, web development, computer science fundamentals and creative tools.'] },
  { id: 'exit', line: ['And ', { pop: 'THE EXIT GATE' }, ': ', { em: 'CONTACT' }, '. Email, GitHub, LinkedIn, and a way to team up.'] },
  { id: null, choose: true, line: ["That's the whole city! Now it's ", { pop: 'YOUR CALL' }, ". Pick a district and I'll get you there. Ninja style."] },
];
