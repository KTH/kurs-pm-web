'use strict'

const log = require('kth-node-log')
const api = require('./api')

async function getSellingText(courseCode) {
  const { client, paths } = api.kursInfoApi
  const uri = client.resolve(paths.getSellingTextByCourseCode.uri, { courseCode })

  try {
    const res = await client.getAsync({ uri }, { useCache: false })
    return res.body ? res.body.sellingText : ''
  } catch (err) {
    log.debug('getSellingText is not available', err)
    return err
  }
}

module.exports = {
  getSellingText
}
