import { useId, useState } from 'react';
import { normalizeHex } from '../../lib/generatorSettings.js';
import './ColourPicker.css';

export default function ColourPicker({ value, onChange }) {
  const id = useId();
  const [draft, setDraft] = useState(null);
  const [invalid, setInvalid] = useState(false);

  function commit() {
    if (draft === null) return;

    const colour = normalizeHex(draft);
    setInvalid(!colour);
    if (colour) {
      onChange(colour);
      setDraft(null);
    }
  }

  function handleNativeChange(event) {
    setDraft(null);
    setInvalid(false);
    onChange(event.target.value);
  }

  function handleHexChange(event) {
    const text = event.target.value;
    setDraft(text);
    setInvalid(false);
    const colour = normalizeHex(text);
    if (colour) onChange(colour);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') commit();
    if (event.key === 'Escape') {
      setDraft(null);
      setInvalid(false);
    }
  }

  return (
    <div className="colour-control">
      <label className="control-label" htmlFor={id}>Base colour</label>
      <div className="colour-fields">
        <input
          className="colour-swatch"
          id={id}
          type="color"
          value={value}
          onChange={handleNativeChange}
        />
        <div className="hex-field">
          <label className="sr-only" htmlFor={`${id}-hex`}>Hex colour</label>
          <input
            id={`${id}-hex`}
            type="text"
            value={draft ?? value}
            spellCheck={false}
            autoComplete="off"
            maxLength={7}
            aria-invalid={invalid}
            aria-describedby={invalid ? `${id}-error` : undefined}
            onChange={handleHexChange}
            onBlur={commit}
            onKeyDown={handleKeyDown}
          />
          <span>HEX</span>
        </div>
      </div>
      {invalid && (
        <p className="field-error" id={`${id}-error`}>
          Enter a 3 or 6 digit hex colour, like #e0e0e0.
        </p>
      )}
    </div>
  );
}
