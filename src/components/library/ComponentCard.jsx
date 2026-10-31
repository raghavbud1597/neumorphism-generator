import { createComponentDocument } from '../../lib/componentCatalog.js';

export default function ComponentCard({ item, onView }) {
  return (
    <article className="component-card" aria-labelledby={`component-${item.id}`}>
      <div className="component-preview">
        <iframe title={`${item.name} preview`} srcDoc={createComponentDocument(item, { preview: true })} sandbox="allow-scripts allow-forms" loading="lazy" style={{ height: item.height }} />
        <span className="preview-hint">INTERACTIVE PREVIEW</span>
      </div>
      <div className="component-card-info">
        <span className="component-category-label">{item.categoryName}</span>
        <h3 id={`component-${item.id}`}>{item.name}</h3>
        <p>{item.description}</p>
        <div className="component-card-bottom"><span className="component-code-label">HTML · CSS{item.js ? ' · JS' : ''}</span><button type="button" onClick={onView} aria-label={`View code for ${item.name}`}><span aria-hidden="true">&lt;/&gt;</span> View code</button></div>
      </div>
    </article>
  );
}
