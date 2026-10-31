import { useId } from 'react';
import { SURFACES } from '../../lib/generatorSettings.js';
import './SurfaceSelector.css';

const PROFILES = {
  flat: 'M4 19h4q3 0 3-4V9h26v6q0 4 3 4h4',
  concave: 'M4 19h4q3 0 3-4V9q13 9 26 0v6q0 4 3 4h4',
  convex: 'M4 19h4q3 0 3-4v-2q13-12 26 0v2q0 4 3 4h4',
  pressed: 'M4 9h7v9h26V9h7',
};

export default function SurfaceSelector({ value, onChange }) {
  const headingId = useId();

  return (
    <div className="surface-section" role="group" aria-labelledby={headingId}>
      <div className="section-heading">
        <h3 id={headingId}>Surface</h3>
        <span>The shape of your shadow</span>
      </div>
      <div className="surface-options">
        {SURFACES.map((surface) => (
          <button
            key={surface}
            type="button"
            aria-pressed={value === surface}
            onClick={() => onChange(surface)}
          >
            <svg viewBox="0 0 48 28" aria-hidden="true">
              <path d={PROFILES[surface]} />
            </svg>
            <span>{surface}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
