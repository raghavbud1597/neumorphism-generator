import { describe, expect, it } from '@jest/globals';
import { DEFAULT_SETTINGS, normalizeHex, updateSetting } from './generatorSettings.js';

describe('settings boundaries', () => {
  it('normalizes supported hex input and rejects invalid input', () => {
    expect(normalizeHex(' #AbC ')).toBe('#aabbcc');
    expect(normalizeHex('123456')).toBe('#123456');
    expect(normalizeHex('#1234')).toBeNull();
    expect(normalizeHex('red')).toBeNull();
    expect(updateSetting(DEFAULT_SETTINGS, 'backgroundColor', 'invalid')).toBe(DEFAULT_SETTINGS);
  });

  it('clamps numeric values and keeps radius inside the current dimensions', () => {
    expect(updateSetting(DEFAULT_SETTINGS, 'size', 999).size).toBe(500);
    expect(updateSetting(DEFAULT_SETTINGS, 'distance', -10).distance).toBe(0);
    expect(updateSetting(DEFAULT_SETTINGS, 'intensity', 10).intensity).toBe(0.6);
    expect(updateSetting(DEFAULT_SETTINGS, 'size', 51).borderRadius).toBe(25.5);
    expect(updateSetting(DEFAULT_SETTINGS, 'borderRadius', 999).borderRadius).toBe(125);
    expect(updateSetting(DEFAULT_SETTINGS, 'size', NaN)).toBe(DEFAULT_SETTINGS);
    expect(updateSetting(DEFAULT_SETTINGS, 'surface', 'unknown')).toBe(DEFAULT_SETTINGS);
    expect(updateSetting(DEFAULT_SETTINGS, 'lightDirection', 'unknown')).toBe(DEFAULT_SETTINGS);
  });
});
