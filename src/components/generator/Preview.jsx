import Color from 'color';
import LightSourceControl from './LightSourceControl.jsx';
import usePreviewScale from '../../hooks/usePreviewScale.js';
import './Preview.css';

export default function Preview({ settings, surfaceStyle, onSettingChange }) {
  // The stage inset already reserves space for the outer shadow falloff.
  const footprint = settings.size + settings.distance + settings.blur;
  const { containerRef, scale } = usePreviewScale(footprint);
  const foreground = Color(settings.backgroundColor).isDark() ? '#f5f5f5' : '#353735';
  const scaleLabel = scale < 0.99 ? `Preview at ${Math.round(scale * 100)}% · ` : '';

  return (
    <section
      className="preview-stage"
      aria-label="Preview"
      style={{
        '--preview-background': settings.backgroundColor,
        '--preview-foreground': foreground,
      }}
    >
      <div className="stage-toolbar">
        <span><span className="live-dot" aria-hidden="true" /> Live preview</span>
        <span>{settings.surface}</span>
      </div>
      <LightSourceControl
        value={settings.lightDirection}
        onChange={(value) => onSettingChange('lightDirection', value)}
      />
      <div className="preview-fit-area" ref={containerRef}>
        <div
          className="preview-shape"
          role="img"
          aria-label="Neumorphic shape"
          style={{ ...surfaceStyle, '--preview-scale': scale }}
        />
      </div>
      <div className="stage-readout">
        <span className="dimension-readout">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M5 2H2v3m9-3h3v3M2 11v3h3m9-3v3h-3" />
          </svg>
          {settings.size} × {settings.size} px
        </span>
        <span className="stage-hint">
          {scaleLabel}Choose a corner to move the light
        </span>
      </div>
    </section>
  );
}
