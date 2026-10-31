import { LIGHT_DIRECTIONS } from '../../lib/generatorSettings.js';
import './LightSourceControl.css';

export default function LightSourceControl({ value, onChange }) {
  return (
    <div className="light-controls" role="group" aria-label="Light source">
      {Object.keys(LIGHT_DIRECTIONS).map((direction) => {
        const label = `Light from ${direction.replace('-', ' ')}`;

        return (
          <button
            key={direction}
            type="button"
            className={`light-button ${direction}`}
            aria-label={label}
            aria-pressed={value === direction}
            title={label}
            onClick={() => onChange(direction)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
