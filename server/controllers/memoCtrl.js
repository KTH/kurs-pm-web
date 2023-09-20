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
const { getDetailedInformation, getCourseRoundTerms } = require('../koppsApi')
const { getServerSideFunctions } = require('../utils/serverSideRendering')
const { createServerSideContext } = require('../ssr-context/createServerSideContext')
const {
  isDateWithInCurrentOrFutureSemester,
  findStartDateForMemo,
  enrichMemoDatasWithOutdatedFlag,
} = require('./memoCtrlHelpers')
const { getLastYearsTerm, extractTerm } = require('../utils/term')
const { redirectToAboutCourseConfig } = require('../utils/helpers')

const locales = { sv, en }

const extractApplicationCodesFromPotentialMemoEndpoint = potentialMemoEndPoint => {
  const parts = potentialMemoEndPoint.split('-')

  let applicationCodes = []
  if (parts.length > 1) {
    applicationCodes = parts.slice(1)
  }
  return applicationCodes
}
const extractSemesterFromPotentialMemoEndpoint = (potentialMemoEndPoint, courseCode) => {
  let semester = ''

  const containsCourseCode = potentialMemoEndPoint.indexOf(courseCode)
  if (containsCourseCode >= 0) {
    semester = potentialMemoEndPoint.slice(courseCode.length, courseCode.length + 5)
  }
  return semester
}

function findMemoWithMatchingEndpoint(memoDatas, memoEndPoint) {
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
        const potentialCourseApplicationCodes = potentialMemoEndPointParts.slice(1)
        const memoData = memoDatas.find(m => {
          const { memoEndPoint, applicationCodes = [] } = m
          const memoEndPointParts = memoEndPoint.split('-')
          if (memoEndPointParts.length > 1) {
            const courseCodeAndSemester = memoEndPointParts[0]
            const courseApplicationCodes = memoEndPointParts.slice(1)
            if (potentialCourseCodeAndSemester === courseCodeAndSemester) {
              if (
                potentialCourseApplicationCodes.length === 1 &&
                courseApplicationCodes.includes(potentialCourseApplicationCodes[0])
              ) {
                return true
              } else {
                if (applicationCodes.length > 0) {
                  let memoMatched = true
                  potentialCourseApplicationCodes.forEach(courseApplicationCode => {
                    const isApplicationCodeMatched = applicationCodes.some(
                      x => x.toString() === courseApplicationCode.toString()
                    )
                    if (!isApplicationCodeMatched) {
                      memoMatched = false
                    }
                  })
                  return memoMatched
                }
              }
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

    if (rawMemos.length === 0) {
      const queryParams = {
        noMemoData: true,
        semester: semester ?? 'noSemester',
        applicationCodes: [],
      }
      return res.redirect(
        ...redirectToAboutCourseConfig({}, serverConfig.hostUrl, serverConfig.proxyPrefixPath.uri, courseCode)
      )
    }

    const potentialMemoEndPoint = resolvePotentialMemoEndPoint(courseCode, semester, id)
    const finalMemoEndPoint = resolveMemoEndPoint(potentialMemoEndPoint, rawMemos)

    if (!finalMemoEndPoint) {
      const queryParams = createQueryParams(id, semester, potentialMemoEndPoint, courseCode)

      return res.redirect(
        ...redirectToAboutCourseConfig({}, serverConfig.hostUrl, serverConfig.proxyPrefixPath.uri, courseCode)
      )
    }

    const rawMemo = await findMemoWithMatchingEndpoint(rawMemos, finalMemoEndPoint)

    const languagesContext = {
      language: responseLanguage,
      memoLanguage: rawMemo?.memoCommonLangAbbr || responseLanguage,
      userLanguageIndex: responseLanguage === 'en' ? 0 : 1,
    }

    let fromTerm = semester ?? extractTerm(courseCode, finalMemoEndPoint)

    const {
      courseMainSubjects,
      recruitmentText,
      title,
      credits,
      creditUnitAbbr,
      infoContactName,
      examiners,
      roundInfos,
    } = await getDetailedInformation(courseCode, languagesContext.memoLanguage, fromTerm)

    const courseContext = {
      courseMainSubjects,
      title,
      credits,
      creditUnitAbbr,
      infoContactName,
      examiners,
    }

    const memoDatas = enrichMemoDatasWithOutdatedFlag(rawMemos, roundInfos)
    const memoWithExtraProps = await findMemoWithMatchingEndpoint(memoDatas, finalMemoEndPoint)

    if (memoWithExtraProps) {
      memoWithExtraProps.startDate = await findStartDateForMemo(memoWithExtraProps, roundInfos)
    }

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

function createQueryParams(id, semester, potentialMemoEndPoint, courseCode) {
  let applicationCodes = id.split('-')
  let memoSemester = semester
  if (!semester) {
    applicationCodes = extractApplicationCodesFromPotentialMemoEndpoint(potentialMemoEndPoint, courseCode)
    memoSemester = extractSemesterFromPotentialMemoEndpoint(potentialMemoEndPoint, courseCode)
  }

  const queryParams = {
    noMemoData: true,
    semester: memoSemester ?? 'noSemester',
    applicationCodes,
  }
  return queryParams
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

    const fromTerm = getLastYearsTerm()

    const { title, credits, creditUnitAbbr, infoContactName, examiners, roundInfos } = await getDetailedInformation(
      courseCode,
      responseLanguage,
      fromTerm
    )
    webContext.title = title
    webContext.credits = credits
    webContext.creditUnitAbbr = creditUnitAbbr
    webContext.infoContactName = infoContactName
    webContext.examiners = examiners

    webContext.memoDatas = enrichMemoDatasWithOutdatedFlag(rawMemos, roundInfos)
    webContext.allTypeMemos = await getMiniMemosPdfAndWeb(courseCode)
    webContext.allRoundsFromKopps = await _getAllRoundsWithApplicationCodes(roundInfos)

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

async function _getAllRoundsWithApplicationCodes(roundInfos) {
  const allRounds = []
  roundInfos.map(roundInfo => {
    const { round } = roundInfo
    const { firstTuitionDate, lastTuitionDate, startTerm, applicationCodes } = round
    const { term } = startTerm
    if (isDateWithInCurrentOrFutureSemester(firstTuitionDate, lastTuitionDate)) {
      round.term = term
      const { applicationCode = '' } = applicationCodes[0]
      round.applicationCode = applicationCode
      delete round.applicationCodes
      allRounds.push(round)
    }
  })
  return allRounds
}

module.exports = {
  getContent,
  getOldContent,
  getNoContent,
  getAboutContent,
  getTermsWithCourseRounds,
}
