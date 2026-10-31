import { useId } from 'react';
import styled from 'styled-components';
import ColourPicker from '../common/ColourPicker.jsx';
import RangeControl from '../common/RangeControl.jsx';

const ConfigurationPanel = styled.section`
  background: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: 20px;
  box-shadow: ${({ $distance, $darkColor, $lightColor }) =>
    `${$distance}px ${$distance}px 56px ${$darkColor}, -${$distance}px -${$distance}px 56px ${$lightColor}`};
  flex: 0 1 400px;
  min-width: 0;
  padding: 30px;
`;

export default function Configuration({
  settings,
  onSettingChange,
  lightColor,
  darkColor,
}) {
  const headingId = useId();

  return (
    <ConfigurationPanel
      aria-labelledby={headingId}
      $backgroundColor={settings.backgroundColor}
      $distance={settings.distance}
      $lightColor={lightColor}
      $darkColor={darkColor}
    >
      <h1 id={headingId}>Neumorphism Generator</h1>
      <ColourPicker
        value={settings.backgroundColor}
        onChange={(value) => onSettingChange('backgroundColor', value)}
      />
      <RangeControl
        label="Size"
        min={50}
        max={500}
        step={10}
        unit="px"
        value={settings.size}
        onChange={(value) => onSettingChange('size', value)}
      />
      <RangeControl
        label="Border Radius"
        min={10}
        max={200}
        step={1}
        unit="px"
        value={settings.borderRadius}
        onChange={(value) => onSettingChange('borderRadius', value)}
      />
      <RangeControl
        label="Distance"
        min={5}
        max={60}
        step={5}
        unit="px"
        value={settings.distance}
        onChange={(value) => onSettingChange('distance', value)}
      />
      <RangeControl
        label="Intensity"
        min={0.05}
        max={0.6}
        step={0.01}
        value={settings.intensity}
        onChange={(value) => onSettingChange('intensity', value)}
      />
      <RangeControl
        label="Blur"
        min={0}
        max={120}
        step={1}
        unit="px"
        value={settings.blur}
        onChange={(value) => onSettingChange('blur', value)}
      />
    </ConfigurationPanel>
  );
}
