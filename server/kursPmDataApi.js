'use strict'

const log = require('kth-node-log')
const api = require('./api')

function sortBySemesterAndName(firstElement, secondElement) {
  if (firstElement.semester > secondElement.semester) {
    return -1
  }
  if (firstElement.semester < secondElement.semester) {
    return 1
  }
  return firstElement.ladokRoundIds.join('').localeCompare(secondElement.ladokRoundIds.join(''))
}

async function getMemoDataById(courseCode, type, version) {
  const { client, paths } = api.kursPmDataApi
  const uri = client.resolve(paths.getAllMemosByCourseCodeAndType.uri, { courseCode, type })

  try {
    const { body: memoDatas, error, code } = await client.getAsync({ uri })

    if (error || !Array.isArray(memoDatas)) {
      log.debug(`${code} ${courseCode} getMemoDataById is not available`)
      return []
    }
    if (version) {
      return memoDatas.filter(memoData => memoData.version === version || memoData.version === parseInt(version, 10))
    }
    memoDatas.sort(sortBySemesterAndName)
    return memoDatas
  } catch (err) {
    log.error('getMemoDataById is not available', err)
    return []
  }
}

async function getMiniMemosPdfAndWeb(courseCode) {
  const { client, paths } = api.kursPmDataApi
  const uri = client.resolve(paths.getPrioritizedWebOrPdfMemosByCourseCode.uri, { courseCode })

  try {
    const res = await client.getAsync({ uri })
    return res.body
  } catch (err) {
    log.error('getMiniMemosPdfAndWeb is not available', err)
    return {}
  }
}

module.exports = {
  sortBySemesterAndName,
  getMemoDataById,
  getMiniMemosPdfAndWeb,
}
