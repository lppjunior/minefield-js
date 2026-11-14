module.exports = {
  displayName: 'bot',
  rootDir: '../..',
  testMatch: ['<rootDir>/projects/bot/tests/**/*.test.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@lppjunior).+\\.js$'
  ],
  moduleNameMapper: {
    '^@minefield/main$': '<rootDir>/projects/main/src/index.js'
  }
}
