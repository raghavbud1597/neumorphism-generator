import { useState } from 'react';
import Color from 'color';
import styled from 'styled-components';
import Configuration from './Configuration.jsx';
import Preview from './Preview.jsx';

const GeneratorLayout = styled.main`
  align-items: center;
  background: ${({ $backgroundColor }) => $backgroundColor};
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: center;
  min-height: 100dvh;
  padding: 32px;
`;

const initialSettings = {
  backgroundColor: '#6ebfb5',
  size: 300,
  borderRadius: 63,
  distance: 20,
  blur: 40,
  intensity: 0.15,
};

export default function Generator() {
  const [settings, setSettings] = useState(initialSettings);
  const color = Color(settings.backgroundColor);
  const lightColor = color.lighten(settings.intensity).hex();
  const darkColor = color.darken(settings.intensity).hex();

  function handleSettingChange(name, value) {
    setSettings((current) => ({
      ...current,
      [name]: value,
      ...(name === 'distance' ? { blur: value * 2 } : {}),
    }));
  }

  return (
    <GeneratorLayout $backgroundColor={settings.backgroundColor}>
      <Preview settings={settings} lightColor={lightColor} darkColor={darkColor} />
      <Configuration
        settings={settings}
        onSettingChange={handleSettingChange}
        lightColor={lightColor}
        darkColor={darkColor}
      />
    </GeneratorLayout>
  );
}
