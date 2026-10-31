import { componentStyles } from '../../lib/componentStyles.js';
import useClipboard from '../../hooks/useClipboard.js';

const colours = [{ name: 'Surface', hex: '#e9ece5' }, { name: 'Shadow', hex: '#c7cdc1' }, { name: 'Light', hex: '#ffffff' }, { name: 'Accent', hex: '#536b3c' }, { name: 'Text', hex: '#30372b' }];

export default function StyleGuide() {
  const { status, copy } = useClipboard(componentStyles);
  return (
    <section className="library-style-guide" id="style-guide" aria-labelledby="style-guide-title">
      <div className="style-guide-heading"><div><span className="library-eyebrow">THE STYLING GUIDE</span><h2 id="style-guide-title">One surface. A shared language.</h2><p>The foundations behind every component in this collection.</p></div><button className="library-button" onClick={copy}>{status === 'copied' ? '✓ Foundations copied' : 'Copy foundation CSS'} <span aria-hidden="true">↗</span></button></div>
      <div className="foundation-grid">
        <article className="foundation-card"><span className="foundation-number">01 / COLOUR</span><h3>A calm canvas.</h3><p>Match the component to its surrounding surface. Reserve the accent for actions and selected states.</p><div className="foundation-swatches">{colours.map(colour => <div key={colour.name}><span style={{ background: colour.hex }} /><strong>{colour.name}</strong><code>{colour.hex}</code></div>)}</div></article>
        <article className="foundation-card"><span className="foundation-number">02 / DEPTH & SHAPE</span><h3>Let the light do the work.</h3><p>Light from the top left. Shadow to the bottom right. Invert them for a pressed or inset surface.</p><div className="foundation-elevations"><span>Flat</span><span>Raised</span><span>Inset</span></div><p className="foundation-spec">6px distance · 14px blur · 10–18px radius</p></article>
        <article className="foundation-card"><span className="foundation-number">03 / INTERACTION</span><h3>Soft. Still clear.</h3><p>Keep text readable, labels visible, and focus unmistakable. Every control should work with a keyboard.</p><ul><li>Default, hover, pressed, and selected states</li><li>Visible focus and disabled states</li><li>Labels, helper text, and validation</li><li>Reduced-motion support</li></ul></article>
      </div>
      <p className={status === 'failed' ? 'foundation-copy-status is-error' : 'foundation-copy-status'} role="status">{status === 'failed' ? 'Could not copy. Open a component’s CSS tab to select and copy the foundations manually.' : status === 'copied' ? 'Foundation CSS copied to clipboard.' : 'The foundation styles are included in every component’s CSS. Copy a component to get everything it needs.'}</p>
    </section>
  );
}
