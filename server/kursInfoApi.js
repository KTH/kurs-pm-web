'use strict'

const log = require('@kth/log')
const api = require('./api')

async function getCourseInfo(courseCode) {
  const { client, paths } = api.kursInfoApi
  const uri = client.resolve(paths.getCourseInfoByCourseCode.uri, { courseCode })

  try {
    const res = await client.getAsync({ uri }, { useCache: false })
    if (res.body) {
      const { sellingText, imageInfo } = res.body
      return { sellingText, imageInfo }
    }
    return { sellingText: {}, imageInfo: '' }
  } catch (err) {
    log.error('getCourseInfo is not available', err)
    return { sellingText: {}, imageInfo: '' }
  }
}

module.exports = {
  getCourseInfo,
}
