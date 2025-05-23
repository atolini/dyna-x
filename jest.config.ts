export default {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    '^@user-directory/(.*)$': '<rootDir>/src/services/user-directory/$1',
    '^@authorization/(.*)$': '<rootDir>/src/services/authorization/$1',
    '^@database/(.*)$': '<rootDir>/src/services/database/$1',
    '^@email/(.*)$': '<rootDir>/src/services/email/$1',
    '^@event-dispatcher/(.*)$': '<rootDir>/src/services/event-dispatcher/$1',
    '^@log/(.*)$': '<rootDir>/src/services/log/$1',
    '^@file-storage/(.*)$': '<rootDir>/src/services/file-storage/$1',
    '^@template/(.*)$': '<rootDir>/src/services/template/$1',
    '^@logger/(.*)$': '<rootDir>/src/utils/logger/$1',
    '^@event/(.*)$': '<rootDir>/src/utils/event/$1',
    '^@response-builder/(.*)$': '<rootDir>/src/services/response-builder/$1',
    '^@error-handler/(.*)$': '<rootDir>/src/utils/error-handler/$1',
  },
};
