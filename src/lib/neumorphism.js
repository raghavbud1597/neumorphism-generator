import Color from 'color';
import { LIGHT_DIRECTIONS } from './generatorSettings.js';

function shade(color, amount) {
  const channels = Color(color).rgb().array().map((channel) => (
    Math.round(Math.min(255, Math.max(0, channel * (1 + amount))))
  ));
  return Color.rgb(channels).hex().toLowerCase();
}

export function createNeumorphicStyle(settings) {
  const { backgroundColor, size, borderRadius, distance, blur, intensity, surface } = settings;
  const { x, y, angle } = LIGHT_DIRECTIONS[settings.lightDirection];
  const light = shade(backgroundColor, intensity);
  const dark = shade(backgroundColor, -intensity);
  const inset = surface === 'pressed' ? 'inset ' : '';
  let background = backgroundColor;
  if (surface === 'concave' || surface === 'convex') {
    const gradientLight = shade(backgroundColor, 0.08);
    const gradientDark = shade(backgroundColor, -0.08);
    // The first CSS stop is opposite the gradient's direction.
    const stops = surface === 'convex' ? [gradientDark, gradientLight] : [gradientLight, gradientDark];
    background = `linear-gradient(${angle}deg, ${stops[0]}, ${stops[1]})`;
  }
  return {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: `${borderRadius}px`,
    background,
    boxShadow: `${inset}${x * distance}px ${y * distance}px ${blur}px ${dark}, ${inset}${-x * distance}px ${-y * distance}px ${blur}px ${light}`,
  };
}

export function formatCSS(style) {
  return `.neumorphic {\n  width: ${style.width};\n  height: ${style.height};\n  border-radius: ${style.borderRadius};\n  background: ${style.background};\n  box-shadow: ${style.boxShadow.replace(', ', ',\n              ')};\n}`;
}
