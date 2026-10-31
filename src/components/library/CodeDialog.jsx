import { useEffect, useRef, useState } from 'react';
import { createComponentDocument } from '../../lib/componentCatalog.js';
import useClipboard from '../../hooks/useClipboard.js';

export default function CodeDialog({ item, onClose }) {
  const dialogRef = useRef(null);
  const [language, setLanguage] = useState('HTML');
  const languages = item.js ? ['HTML', 'CSS', 'JavaScript'] : ['HTML', 'CSS'];
  const code = { HTML: item.html, CSS: item.css, JavaScript: item.js }[language];
  const snippetClipboard = useClipboard(code);
  const documentClipboard = useClipboard(createComponentDocument(item));

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    dialog.showModal();
    return () => { dialog.close(); trigger?.focus(); };
  }, []);

  function handleTabKey(event) {
    const index = languages.indexOf(language);
    const nextIndex = { ArrowRight: (index + 1) % languages.length, ArrowLeft: (index + languages.length - 1) % languages.length, Home: 0, End: languages.length - 1 }[event.key];
    if (nextIndex === undefined) return;
    event.preventDefault();
    setLanguage(languages[nextIndex]);
    dialogRef.current.querySelector(`#code-tab-${languages[nextIndex]}`).focus();
  }

  const failed = snippetClipboard.status === 'failed' || documentClipboard.status === 'failed';
  const copied = snippetClipboard.status === 'copied' || documentClipboard.status === 'copied';

  return (
    <dialog ref={dialogRef} className="component-code-dialog" aria-labelledby="code-dialog-title" onCancel={event => { event.preventDefault(); onClose(); }}>
      <header className="dialog-heading"><div><span className="library-eyebrow">{item.categoryName}</span><h2 id="code-dialog-title">{item.name}</h2></div><button className="dialog-close" type="button" onClick={onClose} aria-label="Close code viewer">×</button></header>
      <div className="dialog-body">
        <div className="dialog-preview-column"><div className="dialog-preview-label"><span className="status-dot" /> LIVE PREVIEW <span>Try it out ↓</span></div><iframe title={`${item.name} expanded preview`} srcDoc={createComponentDocument(item, { preview: true })} sandbox="allow-scripts allow-forms" style={{ height: Math.max(item.height, 320) }} /><p>{item.description}</p><div className="snippet-tip"><strong>Make it yours.</strong><p>Change the colour, radius, and shadow variables at the top of the CSS. Keep the <code>.neu</code> wrapper around the HTML.</p>{item.js && <p>This component includes JavaScript for its interactions. Copy all three tabs or use Copy all.</p>}</div></div>
        <div className="dialog-code-column"><div className="code-tabs-toolbar"><div className="snippet-tabs" role="tablist" aria-label="Code language">{languages.map(name => <button key={name} role="tab" id={`code-tab-${name}`} aria-selected={name === language} aria-controls="snippet-code-panel" tabIndex={name === language ? 0 : -1} onClick={() => setLanguage(name)} onKeyDown={handleTabKey}>{name}</button>)}</div><button className="snippet-copy" type="button" onClick={snippetClipboard.copy}>{snippetClipboard.status === 'copied' ? '✓ Copied' : `Copy ${language}`}</button></div><div role="tabpanel" id="snippet-code-panel" aria-labelledby={`code-tab-${language}`}><pre tabIndex={0} aria-label={`${language} code for ${item.name}`}><code>{code}</code></pre></div><div className="snippet-bottom"><span>Self-contained. No dependencies.</span><button className="library-button" type="button" onClick={documentClipboard.copy}>{documentClipboard.status === 'copied' ? '✓ Document copied' : 'Copy all'} <span aria-hidden="true">↗</span></button></div><p className={failed ? 'snippet-feedback is-error' : 'snippet-feedback'} role="status">{failed ? 'Could not copy. Select the code above and copy it manually.' : copied ? 'Copied to clipboard. Ready for your project.' : 'Copy all gives you a complete, runnable HTML document.'}</p></div>
      </div>
    </dialog>
  );
}
