import { describe, expect, it } from '@jest/globals';
import { DEFAULT_SETTINGS, LIGHT_DIRECTIONS, SURFACES } from './generatorSettings.js';
import { createNeumorphicStyle, formatCSS } from './neumorphism.js';

describe('surface generation', () => {
  it('generates the expected neutral raised surface and complete CSS', () => {
    const style = createNeumorphicStyle(DEFAULT_SETTINGS);
    expect(style.boxShadow).toBe('20px 20px 40px #bebebe, -20px -20px 40px #ffffff');
    expect(formatCSS(style)).toBe(`.neumorphic {\n  width: 250px;\n  height: 250px;\n  border-radius: 50px;\n  background: #e0e0e0;\n  box-shadow: 20px 20px 40px #bebebe,\n              -20px -20px 40px #ffffff;\n}`);
  });

  const offsets = {
    'top-left': ['20px 20px', '-20px -20px', '315deg'],
    'top-right': ['-20px 20px', '20px -20px', '45deg'],
    'bottom-left': ['20px -20px', '-20px 20px', '225deg'],
    'bottom-right': ['-20px -20px', '20px 20px', '135deg'],
  };
  it.each(SURFACES.flatMap((surface) => Object.keys(LIGHT_DIRECTIONS).map((direction) => [surface, direction])))(
    'generates %s with %s lighting', (surface, direction) => {
      const style = createNeumorphicStyle({ ...DEFAULT_SETTINGS, surface, lightDirection: direction });
      const [darkOffset, lightOffset, angle] = offsets[direction];
      const inset = surface === 'pressed' ? 'inset ' : '';
      expect(style.boxShadow).toBe(`${inset}${darkOffset} 40px #bebebe, ${inset}${lightOffset} 40px #ffffff`);
      if (surface === 'convex' || surface === 'concave') {
        const stops = surface === 'convex' ? '#cecece, #f2f2f2' : '#f2f2f2, #cecece';
        expect(style.background).toBe(`linear-gradient(${angle}, ${stops})`);
      } else expect(style.background).toBe('#e0e0e0');
    },
  );

  it.each(['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'])(
    'keeps colour channels valid at %s', (backgroundColor) => {
      const style = createNeumorphicStyle({ ...DEFAULT_SETTINGS, backgroundColor, intensity: 0.6 });
      expect(style.boxShadow).toMatch(/^20px 20px 40px #[\da-f]{6}, -20px -20px 40px #[\da-f]{6}$/);
    },
  );
});

