import { useId, useState } from 'react';
import { clampNumber } from '../../lib/generatorSettings.js';
import './RangeControl.css';

export default function RangeControl({
  label, value, min, max, step, unit = '', onChange, actions,
}) {
  const id = useId();
  const [draft, setDraft] = useState(null);
  const progress = max > min ? ((value - min) / (max - min)) * 100 : 0;

  function commit() {
    if (draft === null) return;

    const number = draft === '' ? NaN : Number(draft);
    if (Number.isFinite(number)) onChange(clampNumber(number, { min, max, step }));
    setDraft(null);
  }

  function handleSliderChange(event) {
    setDraft(null);
    onChange(event.target.valueAsNumber);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') commit();
    if (event.key === 'Escape') setDraft(null);
  }

  return (
    <div className="range-control">
      <div className="range-label">
        <label htmlFor={id}>{label}</label>
        {actions}
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ '--range-progress': `${progress}%` }}
        onChange={handleSliderChange}
      />
      <div className="number-field">
        <input
          aria-label={`${label} value`}
          type="number"
          min={min}
          max={max}
          step={step}
          value={draft ?? value}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
        />
        {unit && <span>{unit}</span>}
      </div>
    </div>
  );
}
