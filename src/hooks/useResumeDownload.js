import { useCallback, useState } from 'react';
import { sfx } from '../audio/sfx.js';

export const RESUME_FILE = 'Saaib_Resume.pdf';
export const RESUME_URL = `${import.meta.env.BASE_URL}${RESUME_FILE}`;

/* Real download only. Checks that a PDF actually exists first, so a missing file is reported
   instead of silently downloading an HTML error page. */
export default function useResumeDownload() {
  const [missing, setMissing] = useState(false);
  const download = useCallback(async (e) => {
    if (e) e.preventDefault();
    try {
      const res = await fetch(RESUME_URL, { method: 'HEAD' });
      const type = res.headers.get('content-type') || '';
      if (!res.ok || !/pdf|octet-stream/i.test(type)) throw new Error('not a pdf');
      setMissing(false);
      const a = document.createElement('a');
      a.href = RESUME_URL;
      a.download = RESUME_FILE;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      sfx.error();
      setMissing(true);
    }
  }, []);
  return { download, missing, dismiss: () => setMissing(false) };
}
