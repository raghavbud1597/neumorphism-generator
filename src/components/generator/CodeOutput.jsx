import { useId } from 'react';
import useClipboard from '../../hooks/useClipboard.js';
import './CodeOutput.css';

const COPY_MESSAGES = {
  idle: '',
  copied: 'CSS copied to clipboard.',
  failed: 'Could not copy. Select the CSS above and copy it manually.',
};

export default function CodeOutput({ code, backgroundColor }) {
  const headingId = useId();
  const { status, copy } = useClipboard(code);

  return (
    <section className="code-panel panel" aria-labelledby={headingId}>
      <div className="code-heading">
        <h2 id={headingId}><span aria-hidden="true">&lt;/&gt;</span> Your CSS</h2>
        <button type="button" className="copy-button" onClick={copy}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="8" y="8" width="12" height="13" rx="2" />
            <path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3" />
          </svg>
          {status === 'copied' ? 'Copied!' : 'Copy CSS'}
        </button>
      </div>
      <pre tabIndex={0} aria-label="Generated CSS"><code>{code}</code></pre>
      <p className="code-note">
        Use
        <span
          className="inline-swatch"
          aria-hidden="true"
          style={{ '--swatch-colour': backgroundColor }}
        />
        <code>{backgroundColor}</code> on the surrounding surface.
      </p>
      <span className={status === 'failed' ? 'copy-error' : 'sr-only'} role="status">
        {COPY_MESSAGES[status]}
      </span>
    </section>
  );
}
