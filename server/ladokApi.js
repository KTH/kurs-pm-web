'use strict'

const { createApiClient } = require('@kth/om-kursen-ladok-client')
const { getLastYearsLadokPeriod } = require('./utils/term')
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

async function getCourseRoundsFromLastYear(courseCode, lang) {
  const fromPeriod = getLastYearsLadokPeriod()
  const client = createApiClient(serverConfig.ladokMellanlagerApi)
  const rounds = await client.getCourseInstancesFromPeriod(courseCode, fromPeriod, lang)
  const mappedRounds = rounds.map(mapRound)
  return mappedRounds
}

async function getCourseRoundsForPeriod(courseCode, startPeriod, lang) {
  const client = createApiClient(serverConfig.ladokMellanlagerApi)
  const rounds = await client.getCourseInstancesForExactStartPeriod(courseCode, startPeriod, lang)
  const mappedRounds = rounds.map(mapRound)
  return mappedRounds
}

const mapRound = ladokRound => {
  const {
    forstaUndervisningsdatum,
    sistaUndervisningsdatum,
    utbildningstillfalleskod,
    kortnamn,
    startperiod,
    installt,
  } = ladokRound
  return {
    round: {
      firstTuitionDate: forstaUndervisningsdatum.date,
      lastTuitionDate: sistaUndervisningsdatum.date,
      startWeek: forstaUndervisningsdatum,
      endWeek: sistaUndervisningsdatum,
      applicationCode: utbildningstillfalleskod,
      shortName: kortnamn,
      startTerm: {
        term: startperiod.inDigits,
      },
      cancelled: installt,
    },
  }
}

module.exports = {
  getLadokCourseData,
  getCourseRoundsFromLastYear,
  getCourseRoundsForPeriod,
}
