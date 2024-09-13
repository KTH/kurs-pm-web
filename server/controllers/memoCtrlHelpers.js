'use strict'

const log = require('@kth/log')
const { getCourseRoundTerms } = require('../koppsApi')
const { getCurrentTerm } = require('../utils/term')

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

async function findStartDateForMemo(memo, roundInfos) {
  const matchingRound = await findMatchingRound(memo, roundInfos)

  return matchingRound.firstTuitionDate
}

async function findMatchingRound(memo, roundInfos) {
  const { semester, applicationCodes, courseCode } = memo
  let matchingRound = lookForMatchingRoundInRoundInfos(semester, applicationCodes, roundInfos)

  if (!matchingRound) {
    log.debug(
      `Could not find matching round for courseCode ${courseCode} and applicationCodes ${applicationCodes}. Fetching courseRoundTerms from KOPPS.`
    )

    matchingRound = lookForMatchingRoundsInCourseRoundTerms(courseCode, semester, applicationCodes)
  }
  return matchingRound
}

function lookForMatchingRoundInRoundInfos(semester, memoApplicationCodes, roundInfos) {
  const matchingRoundInfo = roundInfos.find(({ round: { applicationCodes } }) => {
    if (!applicationCodes) return false
    const hasMatchingTermAndApplicationCode = applicationCodes.some(({ applicationCode, term }) => {
      return term === semester && memoApplicationCodes.includes(applicationCode)
    })

    return hasMatchingTermAndApplicationCode
  })

  if (matchingRoundInfo) {
    return matchingRoundInfo.round
  }

  return undefined
}

async function lookForMatchingRoundsInCourseRoundTerms(courseCode, semester, applicationCodes) {
  const courseRoundTerms = await getCourseRoundTerms(courseCode)

  const courseRoundForTerm = courseRoundTerms.find(({ term }) => term === semester)

  if (!courseRoundForTerm) {
    log.error(`Could not find matching round for courseCode ${courseCode} and term ${semester}.`)
    return { firstTuitionDate: '' }
  }

  const firstRoundWithMatchingApplicationCode = courseRoundForTerm.rounds.find(({ applicationCode }) =>
    applicationCodes.includes(applicationCode)
  )

  if (firstRoundWithMatchingApplicationCode && firstRoundWithMatchingApplicationCode.firstTuitionDate) {
    return firstRoundWithMatchingApplicationCode
  }

  log.error(
    `Could not find matching round with firstTuitionDate in courseRoundInfo for courseCode ${courseCode} and applicationCodes ${applicationCodes}.`
  )

  return { firstTuitionDate: '' }
}

module.exports = {
  enrichMemoDatasWithOutdatedFlag,
  isDateWithInCurrentOrFutureSemester,
  findStartDateForMemo,
}
