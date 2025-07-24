module.exports = {
  roots: ['<rootDir>/client/src'],
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/client/src/setupTests.ts'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // Optional: Map CSS and static assets to avoid import errors
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/client/src/$1',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@testing-library|@babel|react|framer-motion|lucide-react)/)',
  ],
};