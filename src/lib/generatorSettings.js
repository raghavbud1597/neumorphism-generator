export const DEFAULT_SETTINGS = Object.freeze({
  backgroundColor: '#e0e0e0',
  size: 250,
  borderRadius: 50,
  distance: 20,
  blur: 40,
  intensity: 0.15,
  surface: 'flat',
  lightDirection: 'top-left',
});

export const SURFACES = ['flat', 'concave', 'convex', 'pressed'];

// Offsets point away from the light; gradient angles point toward it.
export const LIGHT_DIRECTIONS = {
  'top-left': { x: 1, y: 1, angle: 315 },
  'top-right': { x: -1, y: 1, angle: 45 },
  'bottom-left': { x: 1, y: -1, angle: 225 },
  'bottom-right': { x: -1, y: -1, angle: 135 },
};

export const LIMITS = {
  size: { min: 50, max: 500, step: 1 },
  borderRadius: { min: 0, max: 250, step: 0.5 },
  distance: { min: 0, max: 60, step: 1 },
  intensity: { min: 0, max: 0.6, step: 0.01 },
  blur: { min: 0, max: 120, step: 1 },
};

export function normalizeHex(value) {
  const hex = String(value).trim().replace(/^#/, '');
  if (/^[\da-f]{3}$/i.test(hex)) {
    return `#${[...hex].map((character) => character.repeat(2)).join('')}`.toLowerCase();
  }
  return /^[\da-f]{6}$/i.test(hex) ? `#${hex.toLowerCase()}` : null;
}

export function clampNumber(value, { min, max, step }) {
  return Number(Math.min(max, Math.max(min, Math.round(value / step) * step)).toFixed(2));
}

export function updateSetting(settings, name, value) {
  if (name === 'backgroundColor') {
    const color = normalizeHex(value);
    return color ? { ...settings, backgroundColor: color } : settings;
  }
  if (name === 'surface') {
    return SURFACES.includes(value) ? { ...settings, surface: value } : settings;
  }
  if (name === 'lightDirection') {
    return Object.hasOwn(LIGHT_DIRECTIONS, value) ? { ...settings, lightDirection: value } : settings;
  }
  if (!Object.hasOwn(LIMITS, name) || !Number.isFinite(value)) return settings;
  const limits = name === 'borderRadius'
    ? { ...LIMITS.borderRadius, max: settings.size / 2 } : LIMITS[name];
  const next = { ...settings, [name]: clampNumber(value, limits) };
  if (name === 'distance') {
    next.blur = next.distance * 2;
  }
  if (name === 'size') {
    next.borderRadius = Math.min(next.borderRadius, next.size / 2);
  }
  return next;
}
