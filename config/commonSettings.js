/**
 *
 *     Common settings for server and browser
 *
 * **************************************************
 * * WARNING! Never access any secrets in this file *
 * **************************************************
 *
 */
const { getEnv, devDefaults } = require('kth-node-configuration')

const devPrefixPath = devDefaults('/kurs-pm')
const devMemoStorageUri = devDefaults('https://kursinfostoragestage.blob.core.windows.net/memo-blob-container/')

module.exports = {
  // The proxy prefix path if the application is proxied. E.g /places
  proxyPrefixPath: {
    uri: getEnv('SERVICE_PUBLISH', devPrefixPath),
  },
  memoStorageUri: getEnv('MEMO_STORAGE_URI', devMemoStorageUri),
}
