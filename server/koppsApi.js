'use strict'

const log = require('kth-node-log')
const config = require('./configuration').server
const redis = require('kth-node-redis')
const connections = require('kth-node-api-call').Connections

const koppsOpts = {
  log,
  https: true,
  redis,
  cache: config.cache,
  timeout: 5000,
  defaultTimeout: config.koppsApi.defaultTimeout,
  retryOnESOCKETTIMEDOUT: true,
  useApiKey: false // skip key
}

config.koppsApi.doNotCallPathsEndpoint = true // skip checking _paths, because Kopps doesnt have it
config.koppsApi.connected = true

const koppsConfig = {
  koppsApi: config.koppsApi
}

const api = connections.setup(koppsConfig, koppsConfig, koppsOpts)

async function getDetailedInformation(courseCode, language = 'sv') {
  const { client } = api.koppsApi
  const uri = `${config.koppsApi.basePath}course/${courseCode}/detailedinformation?l=${language}`
  try {
    const res = await client.getAsync({ uri, useCache: true })
    const { mainSubjects, course, examiners } = res.body

    if (res.body) {
      return {
        courseMainSubjects: mainSubjects && mainSubjects.length > 0 ? mainSubjects.join(', ') : '',
        recruitmentText: course && course.recruitmentText ? course.recruitmentText : '',
        title: course && course.title ? course.title : '',
        credits: course && course.credits ? course.credits : '',
        creditUnitAbbr: course && course.creditUnitAbbr ? course.creditUnitAbbr : '',
        examiners
      }
    }

    return {
      courseMainSubjects: '',
      recruitmentText: ''
    }
  } catch (err) {
    log.debug('Kopps is not available', err)
    return err
  }
}

module.exports = {
  koppsApi: api,
  getDetailedInformation
}
