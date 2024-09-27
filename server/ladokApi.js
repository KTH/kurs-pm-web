'use strict'

const { createApiClient } = require('om-kursen-ladok-client')
const serverConfig = require('./configuration').server

async function getLadokCourseData(courseCode, lang) {
  const client = createApiClient(serverConfig.ladokMellanlagerApi)
  const course = await client.getLatestCourseVersion(courseCode, lang)
  const {
    benamning: ladokCourseTitle,
    omfattning: { formattedWithUnit: ladokCreditsLabel },
  } = course

  return {
    title: ladokCourseTitle ?? '',
    creditsLabel: ladokCreditsLabel ?? '',
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
