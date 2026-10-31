import { useState } from 'react';
import { componentCategories, components } from '../../lib/componentCatalog.js';
import ComponentCard from './ComponentCard.jsx';
import CodeDialog from './CodeDialog.jsx';
import StyleGuide from './StyleGuide.jsx';
import './ComponentLibrary.css';

const PAGE_SIZE = 12;
const featuredIds = ['profile-card', 'toggle-switch', 'button', 'slider', 'text-field', 'statistic-card'];
const orderedComponents = [...featuredIds.map(id => components.find(item => item.id === id)), ...components.filter(item => !featuredIds.includes(item.id))];

export default function ComponentLibrary() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState(() => components.find(item => item.id === new URLSearchParams(window.location.search).get('component')) || null);
  const filtered = orderedComponents.filter(item => (
    (category === 'all' || item.category === category)
    && `${item.name} ${item.description} ${item.categoryName}`.toLowerCase().includes(query.trim().toLowerCase())
  ));
  const categoryName = componentCategories.find(item => item.id === category)?.name || 'All components';

  function changeCategory(value) {
    setCategory(value);
    setVisibleCount(PAGE_SIZE);
  }

  function clearFilters() {
    setQuery('');
    changeCategory('all');
  }

  return (
    <main id="main-content" className="library-page" tabIndex={-1}>
      <section className="library-hero" aria-labelledby="library-title">
        <div className="library-hero-copy">
          <span className="library-eyebrow"><span /> THE SOFT UI COLLECTION</span>
          <h1 id="library-title">A softer starting point<span>.</span></h1>
          <p>Everyday components, softly sculpted. Find your favourite, try it out, and take the code into your next project.</p>
          <div className="library-facts"><span><strong>{components.length}</strong> components</span><span><strong>{componentCategories.length}</strong> categories</span><span>Plain HTML & CSS</span></div>
        </div>
        <div className="hero-composition" aria-hidden="true">
          <div className="hero-mini-card"><span className="hero-mini-icon">✦</span><span>Thoughtfully shaped.<small>Ready to make your own.</small></span><span className="hero-mini-dot" /></div>
          <div className="hero-mini-row"><span className="hero-mini-switch"><i /></span><span className="hero-mini-pill">A little depth ↗</span></div>
          <div className="hero-mini-slider"><span /><i /></div>
        </div>
      </section>

      <div className="library-layout" id="collection">
        <aside className="library-sidebar" aria-label="Component categories">
          <span className="sidebar-label">THE COLLECTION</span>
          <button className={category === 'all' ? 'category-button is-active' : 'category-button'} aria-pressed={category === 'all'} onClick={() => changeCategory('all')}><span><span aria-hidden="true">▦</span> All components</span><span>{components.length}</span></button>
          <div className="sidebar-rule" />
          {componentCategories.map(item => (
            <button key={item.id} className={category === item.id ? 'category-button is-active' : 'category-button'} aria-pressed={category === item.id} onClick={() => changeCategory(item.id)}><span>{item.name}</span><span>{item.items.length}</span></button>
          ))}
          <a className="sidebar-guide-link" href="#style-guide"><span aria-hidden="true">◈</span> The styling guide <span aria-hidden="true">↗</span></a>
        </aside>

        <section className="library-collection" aria-labelledby="collection-title">
          <div className="library-toolbar">
            <div><h2 id="collection-title">{categoryName}<span>{filtered.length}</span></h2><p>Small details. A whole lot of possibility.</p></div>
            <label className="library-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg><span className="sr-only">Search components</span><input type="search" value={query} placeholder="Search components…" onChange={event => { setQuery(event.target.value); setVisibleCount(PAGE_SIZE); }} /></label>
          </div>
          <label className="mobile-category-select">Browse category<select value={category} onChange={event => changeCategory(event.target.value)}><option value="all">All components ({components.length})</option>{componentCategories.map(item => <option key={item.id} value={item.id}>{item.name} ({item.items.length})</option>)}</select></label>
          {filtered.length > 0 ? (
            <>
              <div className="component-grid">{filtered.slice(0, visibleCount).map(item => <ComponentCard key={item.id} item={item} onView={() => setSelected(item)} />)}</div>
              <div className="collection-pagination"><p role="status">Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} components</p>{visibleCount < filtered.length && <button className="library-button" onClick={() => setVisibleCount(count => count + PAGE_SIZE)}>Load more components <span aria-hidden="true">↓</span></button>}</div>
            </>
          ) : (
            <div className="library-empty"><span aria-hidden="true">⌕</span><h3>No components found.</h3><p>Try another search or explore the full collection.</p><button className="library-button" onClick={clearFilters}>Clear filters</button></div>
          )}
        </section>
      </div>
      <StyleGuide />
      {selected && <CodeDialog key={selected.id} item={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}
