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

// From kurs-pm-data-admin-web
const createPersonHtml = (personList = []) => {
  let personString = ''
  personList.forEach((person) => {
    if (person) {
      personString += `<p class = "person">
      <img src="https://www.kth.se/files/thumbnail/${person.username}" alt="Profile picture" width="31" height="31">
      <a href="/profile/${person.username}/" property="teach:teacher">
          ${person.givenName} ${person.lastName} 
      </a> 
    </p>  `
    }
  })
  return personString
}

async function getDetailedInformation(courseCode, language) {
  const { client } = api.koppsApi
  const uri = `${config.koppsApi.basePath}course/${courseCode}/detailedinformation?l=${language}`
  try {
    const res = await client.getAsync({ uri, useCache: true })
    if (res.body) {
      const { mainSubjects, course, examiners, roundInfos } = res.body
      const isCreditNotStandard =
        course.credits && course.credits.toString().indexOf('.') < 0 && course.credits.toString().indexOf(',') < 0
      return {
        courseMainSubjects: mainSubjects && mainSubjects.length > 0 ? mainSubjects.join(', ') : '',
        recruitmentText: course && course.recruitmentText ? course.recruitmentText : '',
        title: course && course.title ? course.title : '',
        credits: isCreditNotStandard ? course.credits + '.0' : course.credits || '',
        creditUnitAbbr: course && course.creditUnitAbbr ? course.creditUnitAbbr : '',
        infoContactName: course && course.infoContactName ? course.infoContactName : '',
        examiners: createPersonHtml(examiners),
        roundInfos: roundInfos || []
      }
    }

    log.warn(
      'Kopps responded with',
      res.statusCode,
      res.statusMessage,
      'for course code',
      courseCode,
      'with language',
      language
    )
    return {
      courseMainSubjects: '',
      recruitmentText: '',
      title: '',
      credits: '',
      creditUnitAbbr: '',
      examiners: [],
      roundInfos: []
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
