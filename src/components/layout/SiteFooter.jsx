import { sitePaths } from '../../lib/sitePaths.js';
import './SiteFooter.css';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-about">
          <a className="footer-brand" href={sitePaths.home}>neumorphism<span>.</span></a>
          <p>Simple shapes. Endless possibilities.</p>
          <p>A little depth for your next idea. Crafted by Raghav.</p>
        </div>
        <nav aria-label="Footer navigation">
          <a href={sitePaths.home}>CSS generator</a>
          <a href={sitePaths.components}>Component library</a>
          <a href={sitePaths.styleGuide}>Style guide</a>
          <a href="https://github.com/raghavbud1597/neumorphism-generator" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Raghav. All rights reserved.</span>
        <span>Made with CSS <span aria-hidden="true">↗</span></span>
      </div>
    </footer>
  );
}
