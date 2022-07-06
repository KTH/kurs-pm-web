module.exports = {
  testEnvironment: 'jsdom',
  globals: {
    NODE_ENV: 'test',
  },
  clearMocks: true,
  notifyMode: 'failure-change',
  transformIgnorePatterns: ['node_modules/(?!(@kth|@babel|@jest|uuid)/)', 'test/e2e'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
}
