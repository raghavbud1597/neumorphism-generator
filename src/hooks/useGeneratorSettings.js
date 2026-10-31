import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_SETTINGS, normalizeHex, updateSetting } from '../lib/generatorSettings.js';

function readHashColour() {
  return normalizeHex(window.location.hash.slice(1)) ?? DEFAULT_SETTINGS.backgroundColor;
}

export default function useGeneratorSettings() {
  const [settings, setSettings] = useState(() => ({
    ...DEFAULT_SETTINGS,
    backgroundColor: readHashColour(),
  }));
  // A new editing session resets unfinished input drafts as well as settings.
  const [formVersion, setFormVersion] = useState(0);

  useEffect(() => {
    function handleHashChange() {
      setSettings((current) => ({ ...current, backgroundColor: readHashColour() }));
      setFormVersion((current) => current + 1);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (window.location.hash === settings.backgroundColor) return;

    const { pathname, search } = window.location;
    window.history.replaceState(
      window.history.state,
      '',
      `${pathname}${search}${settings.backgroundColor}`,
    );
  }, [settings.backgroundColor]);

  const changeSetting = useCallback((name, value) => {
    setSettings((current) => updateSetting(current, name, value));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS });
    setFormVersion((current) => current + 1);
  }, []);

  return { settings, formVersion, changeSetting, resetSettings };
}
