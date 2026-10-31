import { useId } from 'react';
import ColourPicker from '../common/ColourPicker.jsx';
import RangeControl from '../common/RangeControl.jsx';
import SurfaceSelector from './SurfaceSelector.jsx';
import { LIMITS } from '../../lib/generatorSettings.js';
import './Configuration.css';

export default function Configuration({ settings, onSettingChange }) {
  const headingId = useId();

  return (
    <section className="configuration panel" aria-labelledby={headingId}>
      <div className="panel-heading">
        <h2 id={headingId}>Make it yours</h2>
        <svg viewBox="0 0 24 24" className="settings-icon" aria-hidden="true">
          <path d="M4 7h16M4 17h16M9 4v6M15 14v6" />
        </svg>
      </div>
      <ColourPicker
        value={settings.backgroundColor}
        onChange={(value) => onSettingChange('backgroundColor', value)}
      />
      <div className="control-section">
        <div className="section-heading"><h3>Dimensions</h3><span>px</span></div>
        <RangeControl
          label="Size"
          {...LIMITS.size}
          value={settings.size}
          onChange={(value) => onSettingChange('size', value)}
        />
        <RangeControl
          label="Radius"
          {...LIMITS.borderRadius}
          max={settings.size / 2}
          value={settings.borderRadius}
          onChange={(value) => onSettingChange('borderRadius', value)}
          actions={(
            <span className="radius-actions">
              <button
                type="button"
                aria-label="Square corners"
                title="Square corners"
                onClick={() => onSettingChange('borderRadius', 0)}
              >
                □
              </button>
              <button
                type="button"
                aria-label="Circular shape"
                title="Circular shape"
                onClick={() => onSettingChange('borderRadius', settings.size / 2)}
              >
                ○
              </button>
            </span>
          )}
        />
      </div>
      <div className="control-section">
        <div className="section-heading">
          <h3>Shadows</h3><span>Light makes the difference</span>
        </div>
        <RangeControl
          label="Distance"
          {...LIMITS.distance}
          value={settings.distance}
          onChange={(value) => onSettingChange('distance', value)}
        />
        <RangeControl
          label="Intensity"
          min={LIMITS.intensity.min * 100}
          max={LIMITS.intensity.max * 100}
          step={LIMITS.intensity.step * 100}
          unit="%"
          value={Math.round(settings.intensity * 100)}
          onChange={(value) => onSettingChange('intensity', value / 100)}
        />
        <RangeControl
          label="Blur"
          {...LIMITS.blur}
          value={settings.blur}
          onChange={(value) => onSettingChange('blur', value)}
        />
      </div>
      <SurfaceSelector
        value={settings.surface}
        onChange={(value) => onSettingChange('surface', value)}
      />
    </section>
  );
}
