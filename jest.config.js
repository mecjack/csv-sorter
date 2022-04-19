/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/'],
  moduleNameMapper: {
    "^csv/sync": "<rootDir>/node_modules/csv-stringify/dist/cjs/sync.cjs",
    "^csv-parse/sync": "<rootDir>/node_modules/csv-parse/dist/cjs/sync.cjs"
  }
};