module.exports = {
  projects: [
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/backend/tests/**/*.test.js'],
      moduleFileExtensions: ['js', 'json', 'node'],
      coverageDirectory: '<rootDir>/coverage/server',
      collectCoverageFrom: ['backend/src/**/*.js', '!**/node_modules/**'],
    },
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/frontend/src/**/*.test.{js,jsx}'],
      moduleFileExtensions: ['js', 'jsx', 'json'],
      setupFilesAfterEnv: ['<rootDir>/frontend/src/tests/setup.js'],
      transform: { '^.+\\.(js|jsx)$': 'babel-jest' },
      moduleNameMapper: {
        '\\\\.(css|less|scss|sass)$': 'identity-obj-proxy'
      },
      coverageDirectory: '<rootDir>/coverage/client',
      collectCoverageFrom: ['frontend/src/**/*.{js,jsx}', '!**/node_modules/**'],
    }
  ],
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  coverageThreshold: {
    global: { statements: 70, branches: 60, functions: 70, lines: 70 }
  },
  testTimeout: 10000
};
