import { useState } from 'react';

export default function useClipboard(text) {
  const [feedback, setFeedback] = useState(null);
  const status = feedback?.text === text ? feedback.status : 'idle';

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setFeedback({ text, status: 'copied' });
    } catch {
      setFeedback({ text, status: 'failed' });
    }
  }

  return { status, copy };
}
