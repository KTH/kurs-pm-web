'use strict'

const log = require('@kth/log')
const redis = require('kth-node-redis')
const connections = require('@kth/api-call').Connections
const config = require('./configuration').server

const koppsOpts = {
  log,
  https: true,
  redis,
  cache: config.cache,
  timeout: 5000,
  defaultTimeout: config.koppsApi.defaultTimeout,
  retryOnESOCKETTIMEDOUT: true,
  useApiKey: false, // skip key
}

config.koppsApi.doNotCallPathsEndpoint = true // skip checking _paths, because Kopps doesnt have it
config.koppsApi.connected = true

const koppsConfig = {
  koppsApi: config.koppsApi,
}

const api = connections.setup(koppsConfig, koppsConfig, koppsOpts)

// const slashEndedKoppsBase = config.koppsApi.basePath.endsWith('/')
//   ? config.koppsApi.basePath
//   : config.koppsApi.basePath.concat('/')

// From kurs-pm-data-admin-web
const createPersonHtml = (personList = []) => {
  let personString = ''
  personList.forEach(person => {
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
  const uri = `${config.koppsApi.proxyBasePath}course/${courseCode}/detailedinformation?l=${language}`
  try {
    const res = await client.getAsync({ uri, useCache: true })
    if (res.body) {
      const { mainSubjects, course, examiners, roundInfos } = res.body
      const isCreditNotStandard =
        course &&
        course.credits &&
        course.credits.toString().indexOf('.') < 0 &&
        course.credits.toString().indexOf(',') < 0
      return {
        courseMainSubjects: mainSubjects && mainSubjects.length > 0 ? mainSubjects.join(', ') : '',
        recruitmentText: course && course.recruitmentText ? course.recruitmentText : '',
        title: course && course.title ? course.title : '',
        credits: isCreditNotStandard ? course.credits + '.0' : course.credits || '',
        creditUnitAbbr: course && course.creditUnitAbbr ? course.creditUnitAbbr : '',
        infoContactName: course && course.infoContactName ? course.infoContactName : '',
        examiners: createPersonHtml(examiners),
        roundInfos: roundInfos || [],
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
      roundInfos: [],
    }
  } catch (err) {
    log.error('Kopps is not available', err)
    return {
      courseMainSubjects: '',
      recruitmentText: '',
      title: '',
      credits: '',
      creditUnitAbbr: '',
      examiners: [],
      roundInfos: [],
    }
  }
}

async function getCourseRoundTerms(courseCode) {
  const { client } = api.koppsApi
  const uri = `${config.koppsApi.proxyBasePath}course/${courseCode}/courseroundterms`
  log.info('Trying fetch course rounds by', { uri, config: config.koppsApi })
  try {
    const res = await client.getAsync({ uri, useCache: true })

    if (res.body) {
      const { termsWithCourseRounds } = res.body

      return termsWithCourseRounds //array of objects(term, rounds)
    }

    log.warn('Kopps responded with', res.statusCode, res.statusMessage, 'for course code', courseCode)

    return []
  } catch (err) {
    log.error('Kopps is not available', err)
    return []
  }
}

module.exports = {
  koppsApi: api,
  getDetailedInformation,
  getCourseRoundTerms,
}
