module.exports = {
  displayName: 'main',
  rootDir: '../..',
  testMatch: ['<rootDir>/projects/main/tests/**/*.test.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@lppjunior).+\\.js$'
  ]
}
