import { sitePaths } from '../../lib/sitePaths.js';
import './SiteHeader.css';

export default function SiteHeader({ activePage = 'generator' }) {
  return (
    <header className="site-header">
      <a className="brand" href={sitePaths.home} aria-label="Neumorphism home">
        <span className="brand-mark" aria-hidden="true"><span /></span>
        <span>neumorphism<span className="brand-period">.</span></span>
      </a>
      <nav className="site-nav" aria-label="Main navigation">
        <a href={sitePaths.home} aria-current={activePage === 'generator' ? 'page' : undefined}>Generator</a>
        <a href={sitePaths.components} aria-current={activePage === 'components' ? 'page' : undefined}>Components <span className="nav-new">NEW</span></a>
        <a href={sitePaths.styleGuide}>Style guide</a>
      </nav>
      <span className="tool-badge"><span aria-hidden="true" /> Made for the web</span>
    </header>
  );
}
