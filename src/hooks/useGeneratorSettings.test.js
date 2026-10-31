import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { DEFAULT_SETTINGS } from '../lib/generatorSettings.js';
import useGeneratorSettings from './useGeneratorSettings.js';

beforeEach(() => window.history.replaceState(null, '', '/'));

describe('useGeneratorSettings', () => {
  it('normalizes hash colours and preserves the route, query, and history state', () => {
    const state = { source: 'test' };
    window.history.replaceState(state, '', '/creator?mode=preview#AbC');
    const { result } = renderHook(useGeneratorSettings);
    expect(result.current.settings.backgroundColor).toBe('#aabbcc');
    expect(window.location.pathname).toBe('/creator');
    expect(window.location.search).toBe('?mode=preview');
    expect(window.location.hash).toBe('#aabbcc');
    expect(window.history.state).toEqual(state);
  });

  it('avoids redundant hash writes and picker history entries', () => {
    window.history.replaceState(null, '', '/#e0e0e0');
    const replace = jest.spyOn(window.history, 'replaceState');
    const length = window.history.length;
    const { result } = renderHook(useGeneratorSettings);
    expect(replace).not.toHaveBeenCalled();
    act(() => result.current.changeSetting('backgroundColor', '#336699'));
    expect(replace).toHaveBeenCalledTimes(1);
    expect(window.history.length).toBe(length);
  });

  it('resets all settings and starts a fresh editing session', () => {
    const { result } = renderHook(useGeneratorSettings);
    act(() => result.current.changeSetting('surface', 'pressed'));
    act(() => result.current.changeSetting('distance', 35));
    expect(result.current.settings.blur).toBe(70);
    act(() => result.current.resetSettings());
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS);
    expect(result.current.formVersion).toBe(1);
  });

  it('reads external hash changes and removes its listener on unmount', () => {
    const remove = jest.spyOn(window, 'removeEventListener');
    const { result, unmount } = renderHook(useGeneratorSettings);
    act(() => {
      window.history.replaceState(null, '', '/#123456');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(result.current.settings.backgroundColor).toBe('#123456');
    expect(result.current.formVersion).toBe(1);
    unmount();
    expect(remove).toHaveBeenCalledWith('hashchange', expect.any(Function));
  });
});
