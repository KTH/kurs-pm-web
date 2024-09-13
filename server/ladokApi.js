'use strict'

const { createApiClient } = require('om-kursen-ladok-client')
const serverConfig = require('./configuration').server

async function getLadokCourseData(courseCode, lang) {
  const client = createApiClient(serverConfig.ladokMellanlagerApi)
  const course = await client.getLatestCourseVersion(courseCode, lang)
  const {
    benamning: ladokCourseTitle,
    omfattning: ladokCourseCredits,
    utbildningstyp: { creditsUnitCode: ladokCreditUnitAbbr },
  } = course

  const isCreditNotStandard =
    ladokCourseCredits &&
    ladokCourseCredits.toString().indexOf('.') < 0 &&
    ladokCourseCredits.toString().indexOf(',') < 0

  return {
    title: ladokCourseTitle ?? '',
    credits: isCreditNotStandard ? ladokCourseCredits + '.0' : ladokCourseCredits || '',
    creditUnitAbbr: ladokCreditUnitAbbr ?? '',
  }
}

async function getActiveCourseRoundsByCourseCodeAndFromTerm(courseCode, fromTerm, lang) {
  const client = createApiClient(serverConfig.ladokMellanlagerApi)
  const rounds = await client.getActiveCourseRoundsFromTerm(courseCode, fromTerm, lang)
  return rounds
}

module.exports = {
  getLadokCourseData,
  getActiveCourseRoundsByCourseCodeAndFromTerm,
}
