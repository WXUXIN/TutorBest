module.exports = {
  // Other Jest configurations...

  // Enable support for ECMAScript Modules
  globals: {
    'process.env.NODE_ENV': 'test',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios)/', // Ignore node_modules except for the "axios" package
    '^.+\\.gif$', // Ignore GIF files (or any other file extensions you want to ignore)
  ],
  testEnvironment: 'jsdom', // Set the test environment to jsdom
  moduleNameMapper: {
    '\\.(gif)$': '<rootDir>/client/src/components/layout/__mocks__/spinner.gif.js',
  },
};