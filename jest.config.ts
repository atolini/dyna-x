export default {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    '@auth/(.*)$': '<rootDir>/src/services/auth/$1',
    '@authorization/(.*)$': '<rootDir>/src/services/authorization/$1',
    '@database/(.*)$': '<rootDir>/src/services/database/$1',
    '@email/(.*)$': '<rootDir>/src/services/email/$1',
    '@event-dispatcher/(.*)$': '<rootDir>/src/services/event-dispatcher/$1',
    '@logger-service/(.*)$': '<rootDir>/src/services/logger-service/$1',
    '@storage/(.*)$': '<rootDir>/src/services/storage/$1',
    '@template/(.*)$': '<rootDir>/src/services/template/$1',
    '@logger/(.*)$': '<rootDir>/src/services/logger/$1',
  },
};
