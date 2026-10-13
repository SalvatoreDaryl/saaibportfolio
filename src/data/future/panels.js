import { PROJECTS, projectDetail } from './projects.js';

/* Every district page is a list of panels. `id` doubles as the CSS grid-area name, so each
   district can lay its panels out differently in district.css.
   A panel with `detail` can be expanded; one without is a static composition. */

const P = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));
const projPanel = (area, p, tone) => ({
  id: area, tone, kicker: p.category, title: p.title, summary: p.hook.toUpperCase(),
  cta: 'OPEN CASE FILE', art: `mock:${p.mock}`, no: p.no, projectId: p.id, detail: projectDetail(p),
});

const PLACEHOLDER_NOTE = '[Add specific examples you can genuinely discuss or demonstrate.]';
const skill = (id, title, kicker, items, tone = 'dark', extra = []) => ({
  id, tone, kicker, title, items, cta: 'OPEN DETAILS',
  detail: { sections: [
    { h: 'Skills', tags: items },
    ...extra,
    { h: 'Examples', p: PLACEHOLDER_NOTE },
  ] },
});

export const PANELS = {
  vault: [
    { id: 'intro', tone: 'dark', kicker: 'DISTRICT 01', title: 'THE VAULT', summary: 'FIVE CASE FILES. PICK ONE.', art: 'cat:sit' },
    projPanel('feat', P['medi-track'], 'paper'),
    projPanel('p2', P.trackpro, 'dark'),
    projPanel('p3', P.encrypto, 'dark'),
    projPanel('p4', P.loop, 'red'),
    projPanel('p5', P.elegance, 'dark'),
    { id: 'tech', tone: 'dark', kicker: 'TECHNICAL SUMMARY', title: 'STACK', summary: 'JAVA · JAVAFX · [MORE — VERIFY]', cta: 'OPEN SUMMARY',
      detail: { sections: [
        { h: 'Medi-Track', tags: ['Java', 'JavaFX'] },
        { h: 'TrackPro', tags: ['[STACK — VERIFY]'] },
        { h: 'Encrypto', tags: ['[STACK — VERIFY]'] },
        { h: 'LOOP Marketing', tags: ['[STACK — VERIFY]'] },
        { h: 'Elegance Curtains', tags: ['[STACK — VERIFY]'] },
      ] } },
    { id: 'nav', tone: 'dark', kind: 'projectNav', kicker: 'PROJECT NAVIGATION', title: 'JUMP TO FILE' },
  ],

  dossier: [
    { id: 'cat', tone: 'dark', kicker: 'SUBJECT', title: 'NINJA CAT', summary: 'REPRESENTS: MUHAMMAD SAAIB', art: 'cat:stand' },
    { id: 'name', tone: 'paper', kicker: 'CHARACTER FILE', title: 'MUHAMMAD SAAIB', summary: 'Computer Science student.',
      body: 'An aspiring developer exploring the intersection of software, digital experiences, and creative design.' },
    { id: 'bg', tone: 'dark', kicker: 'BACKGROUND', title: 'EDUCATION AND EXPERIENCE', summary: 'COMPUTER SCIENCE · [INSTITUTION]', cta: 'OPEN FILE',
      detail: { sections: [
        { h: 'Education', list: ['Computer Science', '[Institution]', '[Years]'] },
        { h: 'Experience', p: '[Add verified experience only. No invented roles, awards, or qualifications.]' },
        { h: 'Detailed biography', p: '[A longer personal background goes here.]' },
      ] } },
    { id: 'ints', tone: 'red', kicker: 'SKILLS AND INTERESTS', title: 'WHAT DRIVES ME', summary: 'SOFTWARE · WEB · CREATIVE DESIGN', cta: 'OPEN FILE',
      detail: { sections: [
        { h: 'Software development', p: '[What you enjoy about it.]' },
        { h: 'Web development', p: '[What you enjoy about it.]' },
        { h: 'Creative and visual design', p: '[What you enjoy about it.]' },
        { h: 'What I enjoy building', list: ['Desktop applications that organize real information', 'Websites with a clear purpose and some personality', 'Branding and visual identity for web projects'] },
      ] } },
    { id: 'phil', tone: 'dark', kicker: 'PHILOSOPHY', title: '“USEFUL. INTERESTING. MEMORABLE.”',
      body: 'I like building things that are useful, technically interesting, and memorable. If an experience can solve a problem and have a personality of its own, even better.' },
  ],

  arsenal: [
    { id: 'title', tone: 'dark', kicker: 'DISTRICT 03', title: 'THE ARSENAL', summary: 'EQUIP A SKILL SET.', art: 'cat:crouch' },
    skill('prog', 'PROGRAMMING', 'CATEGORY 01', ['C++', 'Java', 'Python', 'JavaScript'], 'paper'),
    skill('web', 'WEB DEVELOPMENT', 'CATEGORY 02', ['HTML', 'CSS', 'React', 'Vite']),
    skill('cs', 'COMPUTER SCIENCE', 'CATEGORY 03', ['Object-oriented programming', 'Data structures', 'Algorithms', 'Software fundamentals'], 'red'),
    skill('creative', 'CREATIVE WORK', 'CATEGORY 04', ['UI design', 'Website design', 'Visual identity', 'Branding', 'Creative problem-solving']),
    skill('digital', 'DIGITAL AND MARKETING', 'CATEGORY 05', ['Marketing and content work', 'Creative-agency work [VERIFY]']),
    { id: 'tools', tone: 'dark', kicker: 'EQUIPMENT', title: 'TOOLS', summary: '[ADD TOOLS YOU CAN DEMONSTRATE]', cta: 'OPEN DETAILS',
      detail: { sections: [{ h: 'Tools and technologies', tags: ['[Editor / IDE]', '[Version control]', '[Design tools]'] }, { h: 'Services', p: '[Service packages to be confirmed.]' }] } },
  ],

  guestbook: [
    { id: 'title', tone: 'dark', kicker: 'DISTRICT 04', title: 'THE GUESTBOOK', summary: 'MESSAGES FROM THE FIELD.', art: 'cat:peek' },
    { id: 'q1', tone: 'paper', kind: 'quote', sample: true, quote: '[A genuine quote goes here.]', name: '[PERSON NAME]', role: '[Role / organisation]', cta: 'OPEN MESSAGE',
      detail: { sections: [{ h: 'Quote', p: '[A genuine quote goes here.]' }, { h: 'From', list: ['[Person name]', '[Role / organisation]'] }, { h: 'Relationship', p: '[How they worked with you.]' }, { h: 'Project', p: '[Optional project association.]' }] } },
    { id: 'q2', tone: 'dark', kind: 'quote', sample: true, quote: '[Another genuine quote goes here.]', name: '[PERSON NAME]', role: '[Role / organisation]', cta: 'OPEN MESSAGE',
      detail: { sections: [{ h: 'Quote', p: '[Another genuine quote goes here.]' }, { h: 'From', list: ['[Person name]', '[Role / organisation]'] }, { h: 'Relationship', p: '[How they worked with you.]' }] } },
    { id: 'q3', tone: 'red', kind: 'quote', sample: true, quote: '[A short quote.]', name: '[PERSON NAME]', role: '[Role]' },
    { id: 'empty', tone: 'dark', kind: 'empty', kicker: 'NO ENTRY YET', title: 'THIS SLOT IS OPEN', body: 'Waiting for a genuine recommendation: name, role, relationship, and quote.' },
  ],

  exit: [
    { id: 'main', tone: 'red', kicker: 'DISTRICT 05 / MISSION COMPLETE', title: 'GOT A PROJECT?', summary: "LET'S MAKE SOMETHING BIZARRE.",
      body: "Got an interesting idea, a problem worth solving, or a project that needs a little more personality? Let's talk.", art: 'cat:victory' },
    { id: 'email', tone: 'paper', kind: 'contact', icon: 'mail', label: 'EMAIL', value: '[your-email@example.com]' },
    { id: 'github', tone: 'dark', kind: 'contact', icon: 'github', label: 'GITHUB', value: '[github.com/your-handle]' },
    { id: 'linkedin', tone: 'dark', kind: 'contact', icon: 'linkedin', label: 'LINKEDIN', value: '[linkedin.com/in/your-handle]' },
    { id: 'form', tone: 'dark', kicker: 'OPTIONAL', title: 'SEND A MESSAGE', summary: 'FORM PREVIEW. NOTHING IS SENT.', cta: 'OPEN FORM', kind: 'formDetail',
      detail: { form: true, sections: [] } },
    { id: 'final', tone: 'dark', kicker: 'FINAL MESSAGE', title: 'THANKS FOR PLAYING.', summary: 'THE CITY WILL BE HERE AFTER MIDNIGHT.' },
  ],

  backrooms: [
    { id: 'warn', tone: 'dark', kicker: 'RESTRICTED AREA', title: "YOU WEREN'T SUPPOSED TO FIND THIS." },
    { id: 'cat', tone: 'dark', kicker: 'OPTIONAL SECRET AREA', title: 'SPECIMEN', summary: 'MASCOT: NINJA CAT', art: 'cat:sil' },
    { id: 'exp', tone: 'red', kicker: 'EXPERIMENTS', title: 'COMING LATER', summary: '[PLACEHOLDER SLOTS]', cta: 'OPEN LOG',
      detail: { sections: [{ h: 'Slot 01', p: '[Future experiment.]' }, { h: 'Slot 02', p: '[Future experiment.]' }, { h: 'Slot 03', p: '[Future experiment.]' }] } },
    { id: 'game', tone: 'dark', kicker: 'FUTURE FEATURE', title: 'CAT CAPTURE', summary: 'NOT IMPLEMENTED YET.', body: 'A circular tracing mini-game will live here. No timers, capture mechanics, or unlocks exist in Phase 1.' },
  ],
};
