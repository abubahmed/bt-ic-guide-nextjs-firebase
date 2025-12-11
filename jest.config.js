module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  },

  testMatch: [
    "**/?(*.)+(test).[tj]s",
    "**/validators/tests/**/*.test.ts"
  ],

  testPathIgnorePatterns: [
    "/node_modules/",
    "/.venv/",
    "/data-gen/.venv/",
    "/data-gen/__pycache__/",
    "__pycache__",
  ],
};
