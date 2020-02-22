'use strict'

const log = require('kth-node-log')
const api = require('./api')

async function getMemoDataById(courseCode, semester) {
  const { client, paths } = api.kursPmDataApi
  const id = `${courseCode}${semester}`
  const uri = client.resolve(paths.getCourseMemoDataById.uri, { id })

  try {
    const res = await client.getAsync({ uri })
    log.debug(res)
    return res.body
  } catch (err) {
    log.debug('getMemoDataById is not available', err)
    return err
  }
}

module.exports = {
  getMemoDataById
}
