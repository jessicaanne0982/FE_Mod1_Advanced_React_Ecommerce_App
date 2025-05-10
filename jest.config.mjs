export default {
  // Simulates a browser-like environment for testing
  testEnvironment: 'jsdom',
  preset: 'ts-jest/presets/default-esm',
  // Transforms TypeScript and JavaScript files using ts-jest and babel-jest
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
    '^.+\\.(js|jsx|mjs)$': 'babel-jest',
  },
  // Run the script after the test environment is set up
  setupFilesAfterEnv: ['<rootDir>/jest.envSetup.js'], 
  // Mock static asset imports from 'src/'
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|webp|svg)$': '<rootDir>/fileMock.js',
    '^src/(.*)$': '<rootDir>/src/$1',       
  },
  // Where to look for test files
  roots: ['<rootDir>/src', '<rootDir>/src/__tests__'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/index.{ts,tsx,js,jsx}',
  ],
  transformIgnorePatterns: [
    '/node_modules/',
  ],
  // Look for test file matching this format
  testMatch: [
      '**/__tests__/**/*.test.{ts,tsx,js,jsx}',
  ],
  // Allow absolute imports from src/
  modulePaths: ['<rootDir>/src'],
  // File extensions Jest should handle
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // Directories to search when resolving modules
  moduleDirectories: ['node_modules', 'src'],  
};
