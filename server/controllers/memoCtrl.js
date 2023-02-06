'use strict'

const log = require('@kth/log')
const languageLib = require('@kth/kth-node-web-common/lib/language')

const { sv, en } = require('date-fns/locale')
const { utcToZonedTime, format } = require('date-fns-tz')

const apis = require('../api')
const serverPaths = require('../server').getPaths()
const { browser, server: serverConfig } = require('../configuration')
const { getMemoDataById, getMemoVersion, getMiniMemosPdfAndWeb } = require('../kursPmDataApi')
const { getCourseInfo } = require('../kursInfoApi')
const { getDetailedInformation, getCourseRoundTerms, getApplicationFromLadokID } = require('../koppsApi')
const { getServerSideFunctions } = require('../utils/serverSideRendering')
const { createServerSideContext } = require('../ssr-context/createServerSideContext')

const locales = { sv, en }

function getCurrentTerm(overrideDate) {
  const JULY = 6
  const SPRING = 1
  const FALL = 2
  const currentDate = overrideDate || new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const currentSemester = currentMonth < JULY ? SPRING : FALL
  return `${currentYear * 10 + currentSemester}`
}

function findMemo(memoDatas, memoEndPoint) {
  const memoData = memoDatas.find(m => m.memoEndPoint === memoEndPoint)
  return memoData || null
}

function formatVersionDate(language = 'sv', version) {
  const unixTime = Date.parse(version)
  if (unixTime) {
    const timeZone = 'Europe/Berlin'
    const zonedDate = utcToZonedTime(new Date(unixTime), timeZone)
    return format(zonedDate, 'Ppp', { locale: locales[language] })
  }
  return null
}

function formatVersion(version, language, lastChangeDate) {
  return `Ver ${version} – ${formatVersionDate(language, lastChangeDate)}`
}

function resolvePotentialMemoEndPoint(courseCode, semester, id) {
  if (semester) {
    if (id) {
      // Potential memoEndPoint
      return `${courseCode}${semester}-${id}`
    }
  } else if (id) {
    // Probably a memoEndPoint
    return id
  }
  return ''
}

function resolveMemoEndPoint(potentialMemoEndPoint, memoDatas) {
  if (!Array.isArray(memoDatas)) {
    log.error('resolveMemoEndPoint received non-Array memoDatas argument', memoDatas)
    return ''
  }
  // Potential memoEndPoint in URL
  if (potentialMemoEndPoint) {
    let memoEndPoint
    // Do memoDatas contain memoEndPoint that equals potential memoEndPoint
    const memoDataWithMemoEndPoint = memoDatas.find(m => m.memoEndPoint === potentialMemoEndPoint)
    if (memoDataWithMemoEndPoint) {
      memoEndPoint = memoDataWithMemoEndPoint.memoEndPoint
    }

    // No match of potential memoEndPoint in memoDatas, search for rounds in memoDatas’ memoEndPoints
    if (!memoEndPoint) {
      const potentialMemoEndPointParts = potentialMemoEndPoint.split('-')
      if (potentialMemoEndPointParts.length > 1) {
        const potentialCourseCodeAndSemester = potentialMemoEndPointParts[0]
        const potentialCourseRounds = potentialMemoEndPointParts.slice(1)
        const memoData = memoDatas.find(m => {
          const memoEndPointParts = m.memoEndPoint.split('-')
          if (memoEndPointParts.length > 1) {
            const courseCodeAndSemester = memoEndPointParts[0]
            const courseRounds = memoEndPointParts.slice(1)
            if (potentialCourseCodeAndSemester === courseCodeAndSemester) {
              return potentialCourseRounds.length === 1 && courseRounds.includes(potentialCourseRounds[0])
            }
          }
          return m.memoEndPoint === potentialMemoEndPoint
        })
        if (memoData) {
          memoEndPoint = memoData.memoEndPoint
        }
      } else {
        memoEndPoint = ''
      }
    }
    return memoEndPoint
  }
  // No potential memoEndPoint in URL, use the first one in memoDatas, if memoDatas exists
  return memoDatas[0] ? memoDatas[0].memoEndPoint : ''
}

function resolveSellingText(sellingText = {}, recruitmentText, lang) {
  return sellingText[lang] ? sellingText[lang] : recruitmentText
}

function resolveLatestMemoLanguage(latestMemoDatas) {
  return latestMemoDatas ? latestMemoDatas.memoCommonLangAbbr : null
}

function resolveLatestMemoLabel(language, latestMemoDatas) {
  if (!latestMemoDatas) return ''
  const { publishedVersion, lastChangeDate } = latestMemoDatas

  return formatVersion(publishedVersion, language, lastChangeDate)
}

// TODO: Invert logic
function outdatedMemoData(offerings, startSelectionYear, memoData) {
  // Course memo semester is in current or previous year
  const memoYear = Math.floor(memoData.semester / 10)
  if (memoYear >= startSelectionYear && memoData.semester >= getCurrentTerm()) {
    return false
  }

  // Course offering in memo has end year later or equal to previous year
  const offering = offerings.find(
    o => memoData.ladokRoundIds.includes(o.round.ladokRoundId) && memoData.semester === String(o.round.startTerm.term)
  )
  if (offering && offering.round.endWeek.year >= startSelectionYear) {
    return false
  }

  // Course memo does not meet the criteria
  return true
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

function markOutdatedMemoDatas(memoDatas = [], roundInfos = []) {
  if (!Array.isArray(memoDatas)) {
    log.error('markOutdatedMemoDatas received non-Array memoDatas argument', memoDatas)
    return []
  }
  // for test
  if (memoDatas.length === 0 || roundInfos.length === 0) {
    return []
  }

  const allActiveTerms = roundInfos.filter(r =>
    isDateWithInCurrentOrFutureSemester(r.round.firstTuitionDate, r.round.lastTuitionDate)
  )
  const activeYears = removeDuplicates(allActiveTerms.map(term => term.round.startWeek.year)).sort()
  const startSelectionYear = activeYears[0]

  const offerings = roundInfos.filter(r =>
    r.round &&
    r.round.ladokRoundId &&
    r.round.startTerm &&
    r.round.startTerm.term &&
    r.round.endWeek &&
    r.round.endWeek.year &&
    r.round.endWeek.year >= startSelectionYear
      ? {
          ladokRoundId: r.round.ladokRoundId,
          semester: r.round.startTerm.term,
          endYear: r.round.endWeek.year,
        }
      : {} && r.round.firstTuitionDate
  )

  const markedOutDatedMemoDatas = memoDatas.map(m => ({
    ...m,
    ...{ outdated: outdatedMemoData(offerings, startSelectionYear, m) },
  }))

  return markedOutDatedMemoDatas
}

/* function addApplicationCodesInAllTypeMemos(allTypeMemos, allRounds) {
  Object.keys(allTypeMemos).forEach(semester => {
    const semesterDetails = allTypeMemos[semester]
    const rounds = allRounds.filter(round => round.term === semester)
    if (rounds && rounds.length > 0) {
      Object.keys(semesterDetails).forEach(key => {
        const roundDetails = semesterDetails[key]
        roundDetails.ladokRoundIds.forEach(roundId => {
          const round = rounds.find(x => x.ladokRoundId === roundId)
          if (round) {
            if (roundDetails.applicationCodes && roundDetails.applicationCodes.length > 0) {
              if (roundDetails.applicationCodes.findIndex(x => x !== round.applicationCodes[0].application_code) < 0) {
                roundDetails.applicationCodes.push(round.applicationCodes[0].application_code)
              }
            } else {
              roundDetails.applicationCodes = [round.applicationCodes[0].application_code]
            }
          }
        })
      })
    }
  })
}

function addApplicationCodesInMemosData(memosData, allRounds) {
  memosData.forEach(memo => {
    memo.ladokRoundIds.forEach(roundId => {
      const round = allRounds.find(round => round.term === memo.semester && roundId === round.ladokRoundId)
      if (round) {
        const { applicationCodes } = round
        if (memo.applicationCodes && memo.applicationCodes.length > 0) {
          if (!memo.applicationCodes.includes(applicationCodes[0].application_code)) {
            memo.applicationCodes.push(applicationCodes[0].application_code)
          }
        } else {
          memo.applicationCodes = [applicationCodes[0].application_code]
        }
      }
    })
  })
} */

async function getContent(req, res, next) {
  try {
    const { getCompressedData, renderStaticPage } = getServerSideFunctions()

    const { courseCode: rawCourseCode, semester = null, id } = req.params
    const courseCode = rawCourseCode.toUpperCase()

    const responseLanguage = languageLib.getLanguage(res) || 'sv'

    const rawContext = {
      ...createServerSideContext(),
      courseCode,
      proxyPrefixPath: serverConfig.proxyPrefixPath,
    }

    rawContext.setBrowserConfig(browser, serverPaths, apis, serverConfig.hostUrl)

    const rawMemos = await getMemoDataById(courseCode, 'published')

    const potentialMemoEndPoint = resolvePotentialMemoEndPoint(courseCode, semester, id)
    const finalMemoEndPoint = resolveMemoEndPoint(potentialMemoEndPoint, rawMemos)
    const rawMemo = await findMemo(rawMemos, finalMemoEndPoint)

    const languagesContext = {
      language: responseLanguage,
      memoLanguage: rawMemo?.memoCommonLangAbbr || responseLanguage,
      userLanguageIndex: responseLanguage === 'en' ? 0 : 1,
    }

    const {
      courseMainSubjects,
      recruitmentText,
      title,
      credits,
      creditUnitAbbr,
      infoContactName,
      examiners,
      roundInfos,
    } = await getDetailedInformation(courseCode, languagesContext.memoLanguage)

    const courseContext = {
      courseMainSubjects,
      title,
      credits,
      creditUnitAbbr,
      infoContactName,
      examiners,
    }

    const memoDatas = await markOutdatedMemoDatas(rawMemos, roundInfos)
    const memoWithExtraProps = await findMemo(memoDatas, finalMemoEndPoint)

    const allTypeMemos = !memoWithExtraProps ? await getMiniMemosPdfAndWeb(courseCode) : []

    const memoContext = {
      allTypeMemos,
      memoData: memoWithExtraProps || {},
      memoEndPoint: finalMemoEndPoint,
      memoDatas,
      semester: semester || memoWithExtraProps?.semester,
    }

    const { sellingText, imageInfo } = await getCourseInfo(courseCode)
    const courseIntroductionContext = {
      sellingText: resolveSellingText(sellingText, recruitmentText, languagesContext.memoLanguage),
      imageFromAdmin: imageInfo,
    }

    const shortDescription = (responseLanguage === 'sv' ? 'Om kursen ' : 'About course ') + courseCode

    const webContext = {
      ...rawContext, // always first
      ...courseIntroductionContext,
      ...languagesContext,
      ...courseContext,
      ...memoContext,
    }

    const compressedData = getCompressedData(webContext)
    const { uri: proxyPrefix } = serverConfig.proxyPrefixPath

    const view = renderStaticPage({
      applicationStore: {},
      location: req.url,
      basename: proxyPrefix,
      context: webContext,
    })

    res.render('memo/index', {
      aboutCourse: {
        siteName: shortDescription,
        siteUrl: '/student/kurser/kurs/' + courseCode,
      },
      compressedData,
      description: shortDescription,
      instrumentationKey: serverConfig.appInsights.instrumentationKey,
      html: view,
      lang: responseLanguage,
      proxyPrefix,
    })
  } catch (err) {
    log.error('Error in getContent', { error: err })
    next(err)
  }
}

async function getOldContent(req, res, next) {
  try {
    const { getCompressedData, renderStaticPage } = getServerSideFunctions()

    const { courseCode: rawCourseCode, memoEndPoint, version } = req.params
    const courseCode = rawCourseCode.toUpperCase()
    const responseLanguage = languageLib.getLanguage(res) || 'sv'

    const rawContext = {
      ...createServerSideContext(),
      courseCode,
      memoEndPoint,
      proxyPrefixPath: serverConfig.proxyPrefixPath,
    }

    rawContext.setBrowserConfig(browser, serverPaths, apis, serverConfig.hostUrl)

    const versionMemo = await getMemoVersion(courseCode, memoEndPoint, version)
    const allTypeMemos = !versionMemo ? await getMiniMemosPdfAndWeb(courseCode) : []

    const languagesContext = {
      language: responseLanguage,
      memoLanguage: versionMemo?.memoCommonLangAbbr || responseLanguage,
      userLanguageIndex: responseLanguage === 'en' ? 0 : 1,
    }
    const latestMemoLanguage = resolveLatestMemoLanguage(versionMemo?.latestVersion) || languagesContext.memoLanguage

    const latestMemoLabel = resolveLatestMemoLabel(latestMemoLanguage, versionMemo?.latestVersion)

    const memoContext = {
      allTypeMemos,
      latestMemoLabel,
      memoData: versionMemo,
      memoDatas: [],
    }

    const { courseMainSubjects, recruitmentText, title, credits, creditUnitAbbr, infoContactName, examiners } =
      await getDetailedInformation(courseCode, languagesContext.memoLanguage)

    const courseContext = {
      courseMainSubjects,
      title,
      credits,
      creditUnitAbbr,
      infoContactName,
      examiners,
    }

    const { sellingText, imageInfo } = await getCourseInfo(courseCode)
    const courseIntroductionContext = {
      sellingText: resolveSellingText(sellingText, recruitmentText, languagesContext.memoLanguage),
      imageFromAdmin: imageInfo,
    }

    const shortDescription = (responseLanguage === 'sv' ? 'Om kursen ' : 'About course ') + courseCode

    const webContext = {
      ...rawContext, // always first
      ...courseIntroductionContext,
      ...languagesContext,
      ...courseContext,
      ...memoContext,
    }
    const compressedData = getCompressedData(webContext)
    const { uri: proxyPrefix } = serverConfig.proxyPrefixPath

    const view = renderStaticPage({
      applicationStore: {},
      location: req.url,
      basename: proxyPrefix,
      context: webContext,
    })

    res.render('memo/index', {
      aboutCourse: {
        siteName: shortDescription,
        siteUrl: '/student/kurser/kurs/' + courseCode,
      },
      compressedData,
      description: shortDescription,
      html: view,
      instrumentationKey: serverConfig.appInsights.instrumentationKey,
      lang: responseLanguage,
    })
  } catch (err) {
    log.error('Error in getContent', { error: err })
    next(err)
  }
}

async function getAboutContent(req, res, next) {
  try {
    const { getCompressedData, renderStaticPage } = getServerSideFunctions()

    const { courseCode: rawCourseCode } = req.params
    const courseCode = rawCourseCode.toUpperCase()

    const responseLanguage = languageLib.getLanguage(res) || 'sv'

    let klaroAnalyticsConsentCookie = false
    if (req.cookies.klaro) {
      const consentCookiesArray = req.cookies.klaro.slice(1, -1).split(',')
      // eslint-disable-next-line prefer-destructuring
      const analyticsConsentCookieString = consentCookiesArray
        .find(cookie => cookie.includes('analytics-consent'))
        .split(':')[1]
      // eslint-disable-next-line no-const-assign
      klaroAnalyticsConsentCookie = analyticsConsentCookieString === 'true'
    }

    const webContext = {
      ...createServerSideContext(),
      courseCode,
      language: responseLanguage,
      proxyPrefixPath: serverConfig.proxyPrefixPath,
      userLanguageIndex: responseLanguage === 'en' ? 0 : 1,
    }

    webContext.setBrowserConfig(browser, serverPaths, apis, serverConfig.hostUrl)

    const rawMemos = await getMemoDataById(courseCode, 'published')

    const { title, credits, creditUnitAbbr, infoContactName, examiners, roundInfos } = await getDetailedInformation(
      courseCode,
      responseLanguage
    )
    webContext.title = title
    webContext.credits = credits
    webContext.creditUnitAbbr = creditUnitAbbr
    webContext.infoContactName = infoContactName
    webContext.examiners = examiners

    const memoDatas = await markOutdatedMemoDatas(rawMemos, roundInfos)
    webContext.allTypeMemos = await getMiniMemosPdfAndWeb(courseCode)

    webContext.allRoundsFromKopps = await _getAllRoundsWithApplicationCodes(courseCode, responseLanguage)
    // Adding application codes in every memo
    // addApplicationCodesInAllTypeMemos(webContext.allTypeMemos, webContext.allRoundsFromKopps)
    // addApplicationCodesInMemosData(memoDatas, webContext.allRoundsFromKopps)

    webContext.memoDatas = memoDatas
    // TODO: Proper language constant
    const shortDescription = (responseLanguage === 'sv' ? 'Om kursen ' : 'About course ') + courseCode

    const compressedData = await getCompressedData(webContext)
    const { uri: proxyPrefix } = serverConfig.proxyPrefixPath

    const view = await renderStaticPage({
      applicationStore: {},
      location: req.url,
      basename: proxyPrefix,
      context: webContext,
    })

    res.render('memo/index', {
      aboutCourse: {
        siteName: shortDescription,
        siteUrl: '/student/kurser/kurs/' + courseCode,
      },
      compressedData,
      description: shortDescription,
      html: view,
      instrumentationKey: serverConfig.appInsights.instrumentationKey,
      lang: responseLanguage,
      klaroAnalyticsConsentCookie,
    })
  } catch (err) {
    log.error('Error', { error: err })
    next(err)
  }
}

async function getNoContent(req, res, next) {
  try {
    const { getCompressedData, renderStaticPage } = getServerSideFunctions()

    const responseLanguage = languageLib.getLanguage(res) || 'sv'

    const webContext = {
      ...createServerSideContext(),
      language: responseLanguage,
      proxyPrefixPath: serverConfig.proxyPrefixPath,
    }
    webContext.setBrowserConfig(browser, serverPaths, apis, serverConfig.hostUrl)

    // TODO: Proper language constant
    const shortDescription = responseLanguage === 'sv' ? 'Kurs-PM' : 'Course memo'

    const compressedData = getCompressedData(webContext)
    const { uri: proxyPrefix } = serverConfig.proxyPrefixPath

    const view = renderStaticPage({
      applicationStore: {},
      location: req.url,
      basename: proxyPrefix,
      context: webContext,
    })

    res.render('memo/index', {
      aboutCourse: {
        siteName: shortDescription,
        siteUrl: '',
      },
      compressedData,
      description: shortDescription,
      html: view,
      lang: responseLanguage,
    })
  } catch (err) {
    log.error('Error in getNoContent', { error: err })
    next(err)
  }
}

async function getTermsWithCourseRounds(req, res, next) {
  const { params, query } = req
  const { courseCode } = params
  try {
    log.info('Get request to fetch course rounds', { function: 'getTermsWithCourseRounds', courseCode, params, query })
    const termsWithCourseRounds = await getCourseRoundTerms(courseCode)
    res.send(termsWithCourseRounds)
  } catch (err) {
    log.error(` Exception from getTermsWithCourseRounds for ${courseCode}`, { error: err })
    next(err)
  }
}

async function _getAllRoundsWithApplicationCodes(courseCode, responseLanguage) {
  //let allRounds = await getCourseRoundTerms(courseCode)
  let allRounds = await getDetailedInformation(courseCode, responseLanguage)
  let allTempRounds = []
  const rounds = []
  allRounds.roundInfos.map(t => {
    if (isDateWithInCurrentOrFutureSemester(t.round.firstTuitionDate, t.round.lastTuitionDate)) {
      t.round.term = t.round.startTerm.term
      rounds.push(t.round)
      allTempRounds = allTempRounds.concat(rounds)
    }
  })
  allRounds = [...allTempRounds]
  return allRounds
}

module.exports = {
  markOutdatedMemoDatas,
  getContent,
  getOldContent,
  getNoContent,
  getAboutContent,
  getTermsWithCourseRounds,
}
