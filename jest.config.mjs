/** @type {import('jest').Config} */
import nextJest from "next/jest.js";


const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
};

export default createJestConfig(config);
