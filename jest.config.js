export default {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: { url: 'http://localhost/' },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  extensionsToTreatAsEsm: ['.jsx'],
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', {
      presets: [['@babel/preset-react', { runtime: 'automatic' }]],
    }],
  },
  moduleNameMapper: { '\\.css$': '<rootDir>/src/test/styleMock.cjs' },
  clearMocks: true,
  restoreMocks: true,
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/setupTests.js',
    '!src/test/**',
  ],
  coverageReporters: ['text', 'html', 'lcov'],
  coverageThreshold: {
    global: { statements: 90, branches: 85, functions: 90, lines: 90 },
  },
};
