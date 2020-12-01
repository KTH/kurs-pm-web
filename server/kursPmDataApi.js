'use strict'

const log = require('kth-node-log')
const api = require('./api')

async function getMemoDataById(courseCode, type, version) {
  const { client, paths } = api.kursPmDataApi
  const uri = client.resolve(paths.getAllMemosByCourseCodeAndType.uri, { courseCode, type })

  try {
    const res = await client.getAsync({ uri })
    const memoDatas = res.body
    if (version) {
      return memoDatas.filter((memoData) => memoData.version === version || memoData.version === parseInt(version, 10))
    }
    return memoDatas
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
