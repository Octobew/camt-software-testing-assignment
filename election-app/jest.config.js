// Unit tests only: no database, no network. Prisma and repositories are replaced by test doubles.
// ts-jest type-checks each test file against tsconfig.test.json, so a type error fails the run.
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json' }],
  },
  clearMocks: true,
};
