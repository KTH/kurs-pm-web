'use strict'

const log = require('kth-node-log')
const api = require('./api')

const PUBLISHED = 'published'

async function getMemoDataById(courseCode) {
  const { client, paths } = api.kursPmDataApi
  const uri = client.resolve(paths.getAllMemosByCourseCodeAndType.uri, { courseCode, type: PUBLISHED })

  try {
    const res = await client.getAsync({ uri })
    // log.debug(res)
    return res.body
  } catch (err) {
    log.debug('getMemoDataById is not available', err)
    return err
  }
}

async function getMiniMemosPdfAndWeb(courseCode) {
  const { client, paths } = api.kursPmDataApi
  const uri = client.resolve(paths.getPdfAndWebMemosListByCourseCode.uri, { courseCode })

  try {
    const res = await client.getAsync({ uri })
    return res.body
  } catch (err) {
    log.debug('getMiniMemosPdfAndWeb is not available', err)
    return err
  }
}

module.exports = {
  getMemoDataById,
  getMiniMemosPdfAndWeb
}
