/* Editable project data. [BRACKETS] = placeholder to verify before publishing. */
export const PROJECTS = [
  { id: 'medi-track', no: '01', title: 'MEDI-TRACK', category: 'Desktop Application Development', tech: ['Java', 'JavaFX'], mock: 'medi',
    hook: 'A better way to organize medicine data.',
    description: 'An application project involving patient, medicine, and dose-log information.' },
  { id: 'trackpro', no: '02', title: 'TRACKPRO', category: 'Web Development', tech: ['[STACK — VERIFY]'], mock: 'track',
    hook: 'Nothing slips past the tracker.',
    description: 'A web-based tracking project. [Describe the implemented functionality once confirmed.]' },
  { id: 'encrypto', no: '03', title: 'ENCRYPTO', category: 'Software Development', tech: ['[STACK — VERIFY]'], mock: 'crypto',
    hook: 'Some things are not for everyone.',
    description: 'A project exploring encryption and secure data handling. [List only the capabilities that are genuinely implemented.]' },
  { id: 'loop', no: '04', title: 'LOOP MARKETING', category: 'Branding and Web Development', tech: ['[STACK — VERIFY]'], mock: 'loop',
    hook: 'Loud brands. Tight loops.',
    description: 'An agency website and visual identity project. [Add the relevant work once confirmed.]' },
  { id: 'elegance', no: '05', title: 'ELEGANCE CURTAINS', category: 'Business Website Development', tech: ['[STACK — VERIFY]'], mock: 'curtain',
    hook: 'Dress the window. Request the estimate.',
    description: 'A website for a curtains and interior business. [Describe implemented business features, e.g. the estimate-request flow, once confirmed.]' },
];

/* Reusable case-study structure used by every project's expanded view. */
export function projectDetail(p) {
  return {
    sections: [
      { h: 'Overview', p: p.description },
      { h: 'Background', p: '[Why this project was started and who it is for.]' },
      { h: 'Problem', p: '[The problem it set out to solve. Keep it factual.]' },
      { h: 'My role', p: '[What you personally designed and built.]' },
      { h: 'Tools used', tags: p.tech },
      { h: 'Development process', list: ['[Plan]', '[Design]', '[Build]', '[Test and refine]'] },
      { h: 'Challenges', p: '[A real challenge you ran into.]' },
      { h: 'Solution', p: '[How you solved it.]' },
      { h: 'Results or lessons learned', p: '[Verified outcomes or what you learned. No invented metrics or clients.]' },
      { h: 'Screenshots', frames: 2 },
      { h: 'Links', links: ['GitHub [link]', 'Live demo [link]'] },
    ],
  };
}
