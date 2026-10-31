import { describe, expect, it } from '@jest/globals';
import { createSitePaths, isComponentLibraryPath } from './sitePaths.js';

describe('static hosting paths', () => {
  it('supports both root hosting and GitHub project Pages', () => {
    expect(createSitePaths()).toEqual({ home: '/', components: '/components/', styleGuide: '/components/#style-guide' });
    expect(createSitePaths('/neumorphism-generator/')).toEqual({
      home: '/neumorphism-generator/',
      components: '/neumorphism-generator/components/',
      styleGuide: '/neumorphism-generator/components/#style-guide',
    });
    expect(createSitePaths('/neumorphism-generator')).toEqual(createSitePaths('/neumorphism-generator/'));
  });

  it('recognises the library with and without the directory slash under either base', () => {
    expect(isComponentLibraryPath('/components')).toBe(true);
    expect(isComponentLibraryPath('/components/')).toBe(true);
    expect(isComponentLibraryPath('/neumorphism-generator/components/', '/neumorphism-generator/')).toBe(true);
    expect(isComponentLibraryPath('/neumorphism-generator/components', '/neumorphism-generator/')).toBe(true);
    expect(isComponentLibraryPath('/neumorphism-generator/', '/neumorphism-generator/')).toBe(false);
    expect(isComponentLibraryPath('/components', '/neumorphism-generator/')).toBe(false);
    expect(isComponentLibraryPath('/neumorphism-generator/components-example', '/neumorphism-generator/')).toBe(false);
  });
});
