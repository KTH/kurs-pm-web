'use strict'

const log = require('@kth/log')
const { getCourseRoundsForPeriod } = require('../ladokApi')
const { getCurrentTerm, convertTermToLadokPeriod } = require('../utils/term')

function enrichMemoDatasWithOutdatedFlag(memoDatas = [], roundInfos = []) {
  if (!Array.isArray(memoDatas)) {
    log.error('enrichMemoDatasWithOutdatedFlag received non-Array memoDatas argument', memoDatas)
    return []
  }

  const startSelectionYear = extractStartSelectionYear(roundInfos)

  const relevantOfferings = filterOutIrrelevantOfferings(roundInfos, startSelectionYear)

  const enrichedMemoDatas = memoDatas.map(memoData => ({
    ...memoData,
    outdated: getIsMemoOutdated(relevantOfferings, startSelectionYear, memoData),
  }))

  return enrichedMemoDatas
}

function extractStartSelectionYear(roundInfos) {
  const allActiveTerms = roundInfos.filter(({ round }) =>
    isDateWithInCurrentOrFutureSemester(round.firstTuitionDate, round.lastTuitionDate)
  )
  const activeYears = removeDuplicates(allActiveTerms.map(term => term.round.startWeek.year)).sort()
  const startSelectionYear = activeYears[0]
  return startSelectionYear
}

function isDateWithInCurrentOrFutureSemester(startSemesterDate, endSemesterDate) {
  const currentDate = new Date()
  const startSemester = new Date(startSemesterDate)
  const endSemester = new Date(endSemesterDate)
  if (startSemester.valueOf() >= currentDate.valueOf() || endSemester.valueOf() >= currentDate.valueOf()) {
    return true
  }
  return false
}

function removeDuplicates(elements) {
  return elements.filter((term, index) => elements.indexOf(term) === index)
}

function filterOutIrrelevantOfferings(roundInfos, startSelectionYear) {
  return roundInfos.filter(
    r =>
      r.round &&
      r.round.applicationCodes &&
      r.round.startTerm &&
      r.round.startTerm.term &&
      r.round.endWeek &&
      r.round.endWeek.year &&
      r.round.firstTuitionDate &&
      r.round.endWeek.year >= startSelectionYear
  )
}

// TODO: Invert logic
function getIsMemoOutdated(offerings, startSelectionYear, memoData) {
  // Course memo semester is in current or previous year
  const memoYear = Math.floor(memoData.semester / 10)
  if (memoYear >= startSelectionYear && memoData.semester >= getCurrentTerm()) {
    return false
  }

  // Course offering in memo has end year later or equal to previous year
  const offering = offerings.find(offer => {
    const { round } = offer
    if (round) {
      const {
        applicationCodes = [],
        startTerm: { term },
      } = round
      if (applicationCodes.length > 0) {
        const { applicationCode } = applicationCodes[0]
        if (memoData.applicationCodes.includes(applicationCode) && memoData.semester === String(term)) {
          return offer
        }
      }
    }
  })

  if (offering) {
    const { round } = offering
    if (round) {
      const { endWeek, lastTuitionDate } = round
      const currentDate = new Date()
      const endSemester = new Date(lastTuitionDate)
      if (endWeek) {
        const { year } = endWeek
        if (year >= startSelectionYear && endSemester.valueOf() >= currentDate.valueOf()) {
          return false
        }
      }
    }
  }

  // Course memo does not meet the criteria
  return true
}

/**
 * Get round for memo. Looks in roundInfos first (i.e. will be rounds
 * from last year and after)
 * If not found in roundInfos; it fetch correct period from Ladok seperatly.
 */
async function getMemoRoundFromRoundInfosOrApi(memo, roundInfos, lang) {
  let matchingRoundInfo = findMemoRoundFromRoundInfos(memo, roundInfos)

  if (!matchingRoundInfo) {
    const memoPeriod = convertTermToLadokPeriod(memo.semester)
    const roundsInfoForMemoPeriod = await getCourseRoundsForPeriod(memo.courseCode, memoPeriod, lang)
    matchingRoundInfo = findMemoRoundFromRoundInfos(memo, roundsInfoForMemoPeriod)

    if (!matchingRoundInfo) {
      log.error(
        `Could not find matching round for courseCode: ${memo.courseCode}, semester: ${memo.semester} and applicationCode: ${memo.applicationCodes}`
      )
    }
  }

  return matchingRoundInfo?.round
}

function findMemoRoundFromRoundInfos(memo, roundInfos) {
  const { semester: memoSemester, applicationCodes: memoApplicationCodes } = memo

  return roundInfos.find(
    ({ round: { applicationCode, startTerm } }) =>
      memoSemester === startTerm.term && applicationCode && memoApplicationCodes.includes(applicationCode)
  )
}

module.exports = {
  enrichMemoDatasWithOutdatedFlag,
  isDateWithInCurrentOrFutureSemester,
  getMemoRoundFromRoundInfosOrApi,
}
