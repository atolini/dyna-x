export default {
    preset: 'ts-jest',
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
    moduleNameMapper: {
        "@response-builder/(.*)": "<rootDir>/src/utils/response-builder/$1",
        "@logger/(.*)": "<rootDir>/src/utils/logger/$1"
    }
};
