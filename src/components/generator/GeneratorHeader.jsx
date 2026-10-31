import './GeneratorHeader.css';

export default function GeneratorHeader({ onReset }) {
  return (
    <div className="page-intro">
      <div>
        <h1>Generate neumorphic designs<span>.</span></h1>
        <p className="intro-description">Shape your surface. Find your light. Make it yours.</p>
      </div>
      <button type="button" className="reset-button" onClick={onReset}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 10a9 9 0 1 1 2 8M3 4v6h6" />
        </svg>
        Reset settings
      </button>
    </div>
  );
}
