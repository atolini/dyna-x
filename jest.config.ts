export default {
    preset: 'ts-jest',
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
    moduleNameMapper: {
        "@response-builder/(.*)": "<rootDir>/src/response-builder/$1"
    }
};
