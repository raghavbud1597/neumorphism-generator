import { useEffect } from 'react';
import Generator from './components/generator/Generator.jsx';
import ComponentLibrary from './components/library/ComponentLibrary.jsx';
import SiteHeader from './components/layout/SiteHeader.jsx';
import SiteFooter from './components/layout/SiteFooter.jsx';
import { isComponentLibraryPath } from './lib/sitePaths.js';

export default function App() {
  const isLibrary = isComponentLibraryPath(window.location.pathname);
  useEffect(() => {
    document.title = isLibrary ? 'Component Library · Neumorphism' : 'Neumorphism Generator';
  }, [isLibrary]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content').focus(); }}>Skip to content</a>
      <SiteHeader activePage={isLibrary ? 'components' : 'generator'} />
      {isLibrary ? <ComponentLibrary /> : <Generator />}
      <SiteFooter />
    </div>
  );
}
