module.exports = {
    // Other Jest configurations...
  
    // Enable support for ECMAScript Modules
    globals: {
      'process.env.NODE_ENV': 'test',
    },
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    testEnvironment: 'node',
  };