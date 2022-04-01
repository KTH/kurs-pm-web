'use strict'

const log = require('@kth/log')
const languageLib = require('@kth/kth-node-web-common/lib/language')

const { sv, en } = require('date-fns/locale')
const { utcToZonedTime, format } = require('date-fns-tz')

const apis = require('../api')
const serverPaths = require('../server').getPaths()
const { browser, server: serverConfig } = require('../configuration')
const { getMemoDataById, getMiniMemosPdfAndWeb } = require('../kursPmDataApi')
const { getCourseInfo } = require('../kursInfoApi')
const { getDetailedInformation } = require('../koppsApi')
const { getServerSideFunctions } = require('../utils/serverSideRendering')
const { createServerSideContext, createAdditionalContext } = require('../ssr-context/createServerSideContext')

const locales = { sv, en }

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

function resolveLatestMemoLabel(language, latestMemoDatas) {
  const latestMemoData = latestMemoDatas[latestMemoDatas.length - 1]
  if (latestMemoDatas.length > 1) {
    log.warn(
      `Inconsistent data: kursPmDataApi responded with more than one memo with status published for memoEndPoint ${latestMemoData.memoEndPoint}`
    )
  }
  return formatVersion(latestMemoData.version, language, latestMemoData.lastChangeDate)
}

// TODO: Invert logic
function outdatedMemoData(offerings, startSelectionYear, memoData) {
  // Course memo semester is in current or previous year
  const memoYear = Math.floor(memoData.semester / 10)
  if (memoYear >= startSelectionYear) {
    return false
  }

  // Course offering in memo has end year later or equal to previous year
  const offering = offerings.find(
    o => memoData.ladokRoundIds.includes(o.ladokRoundId) && memoData.semester === o.semester
  )
  if (offering && offering.endYear >= startSelectionYear) {
    return false
  }

  // Course memo does not meet the criteria
  return true
}

function markOutdatedMemoDatas(memoDatas = [], roundInfos = []) {
  if (!Array.isArray(memoDatas)) {
    log.error('markOutdatedMemoDatas received non-Array memoDatas argument', memoDatas)
    return []
  }
  const currentYear = new Date().getFullYear()
  const startSelectionYear = currentYear - 1

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
      : {}
  )
  const markedOutDatedMemoDatas = memoDatas.map(m => ({
    ...m,
    ...{ outdated: outdatedMemoData(offerings, startSelectionYear, m) },
  }))
  return markedOutDatedMemoDatas
}

async function getContent(req, res, next) {
  try {
    const context = {}
    const { getCompressedData, renderStaticPage } = getServerSideFunctions()
    const webContext = { lang, proxyPrefixPath: serverConfig.proxyPrefixPath, ...createServerSideContext() } // ...createApplicationStore()

    webContext.setBrowserConfig(browser, serverPaths, apis, server.hostUrl)

    const { courseCode: rawCourseCode, semester, id } = req.params
    const courseCode = rawCourseCode.toUpperCase()
    webContext.courseCode = courseCode

    const memoDatas = await getMemoDataById(courseCode, 'published')
    // Set temporary memoDatas to be able to resolve language
    // TODO: Try to rework this unsound solution
    webContext.memoDatas = memoDatas

    const potentialMemoEndPoint = resolvePotentialMemoEndPoint(courseCode, semester, id)
    webContext.memoEndPoint = resolveMemoEndPoint(potentialMemoEndPoint, memoDatas)

    const responseLanguage = languageLib.getLanguage(res) || 'sv'
    webContext.language = responseLanguage
    webContext.memoLanguage = webContext.resolveMemoLanguage()
    webContext.userLanguageIndex = webContext.language === 'en' ? 0 : 1
    webContext.semester = webContext.memoData.semester

    const {
      courseMainSubjects,
      recruitmentText,
      title,
      credits,
      creditUnitAbbr,
      infoContactName,
      examiners,
      roundInfos,
    } = await getDetailedInformation(courseCode, webContext.memoLanguage)
    webContext.courseMainSubjects = courseMainSubjects
    webContext.title = title
    webContext.credits = credits
    webContext.creditUnitAbbr = creditUnitAbbr
    webContext.infoContactName = infoContactName
    webContext.examiners = examiners

    // MemoDatas are set again.
    webContext.memoDatas = markOutdatedMemoDatas(memoDatas, roundInfos)

    const { sellingText, imageInfo } = await getCourseInfo(courseCode)
    webContext.sellingText = resolveSellingText(sellingText, recruitmentText, webContext.memoLanguage)
    webContext.imageFromAdmin = imageInfo

    // TODO: Proper language constant
    const shortDescription = (responseLanguage === 'sv' ? 'Om kursen ' : 'About course ') + courseCode

    const compressedData = getCompressedData(webContext)
    const { uri: proxyPrefix } = serverConfig.proxyPrefixPath

    const view = renderStaticPage({
      applicationStore: {},
      location: req.url,
      basename: proxyPrefix,
      context: webContext,
    })

    log.debug(`kurs_pm_web: toolbarUrl: ${serverConfig.toolbar.url}`)

    res.render('memo/index', {
      aboutCourse: {
        siteName: shortDescription,
        siteUrl: '/student/kurser/kurs/' + courseCode,
      },
      compressedData,
      description: shortDescription,
      instrumentationKey: server.appInsights.instrumentationKey,
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
    const context = {}
    const { getCompressedData, renderStaticPage } = getServerSideFunctions()
    const webContext = {
      lang,
      proxyPrefixPath: serverConfig.proxyPrefixPath,
      ...createServerSideContext(),
    }

    webContext.setBrowserConfig(browser, serverPaths, apis, server.hostUrl)

    const { courseCode: rawCourseCode, memoEndPoint, version } = req.params
    const courseCode = rawCourseCode.toUpperCase()

    webContext.courseCode = courseCode
    webContext.memoEndPoint = memoEndPoint

    const responseLanguage = languageLib.getLanguage(res) || 'sv'
    webContext.language = responseLanguage

    const memoDatas = await getMemoDataById(courseCode, 'old', version)
    webContext.memoDatas = memoDatas

    const latestMemoDatas = await getMemoDataById(courseCode, 'published')
    const currentMemoData = latestMemoDatas.filter(md => md.memoEndPoint === memoEndPoint)
    webContext.latestMemoLabel = resolveLatestMemoLabel(responseLanguage, currentMemoData)

    webContext.memoData = currentMemoData
    webContext.memoLanguage = webContext.resolveMemoLanguage()
    webContext.userLanguageIndex = webContext.language === 'en' ? 0 : 1

    const { courseMainSubjects, recruitmentText, title, credits, creditUnitAbbr, infoContactName, examiners } =
      await getDetailedInformation(courseCode, webContext.memoLanguage)
    webContext.courseMainSubjects = courseMainSubjects
    webContext.title = title
    webContext.credits = credits
    webContext.creditUnitAbbr = creditUnitAbbr
    webContext.infoContactName = infoContactName
    webContext.examiners = examiners

    const { sellingText, imageInfo } = await getCourseInfo(courseCode)
    webContext.sellingText = resolveSellingText(sellingText, recruitmentText, webContext.memoLanguage)
    webContext.imageFromAdmin = imageInfo

    // TODO: Proper language constant
    const shortDescription = (responseLanguage === 'sv' ? 'Om kursen ' : 'About course ') + courseCode

    const compressedData = getCompressedData(webContext)
    const { uri: proxyPrefix } = serverConfig.proxyPrefixPath

    const view = renderStaticPage({
      applicationStore: {},
      location: req.url,
      basename: proxyPrefix,
      context: webContext,
    })

    log.debug(`kurs_pm_web: toolbarUrl: ${serverConfig?.toolbar?.url}`)

    res.render('memo/index', {
      aboutCourse: {
        siteName: shortDescription,
        siteUrl: '/student/kurser/kurs/' + courseCode,
      },
      compressedData,
      description: shortDescription,
      html: view,
      instrumentationKey: server.appInsights.instrumentationKey,
      lang: responseLanguage,
    })
  } catch (err) {
    log.error('Error in getContent', { error: err })
    next(err)
  }
}

async function getAboutContent(req, res, next) {
  try {
    const context = {}

    const { getCompressedData, renderStaticPage } = getServerSideFunctions()
    const webContext = {
      lang,
      proxyPrefixPath: serverConfig.proxyPrefixPath,
      ...createServerSideContext(),
    }

    webContext.setBrowserConfig(browser, serverPaths, apis, server.hostUrl)

    const { courseCode: rawCourseCode } = req.params
    const courseCode = rawCourseCode.toUpperCase()
    webContext.courseCode = courseCode

    const memoDatas = await getMemoDataById(courseCode, 'published')

    const responseLanguage = languageLib.getLanguage(res) || 'sv'
    webContext.language = responseLanguage
    webContext.userLanguageIndex = webContext.language === 'en' ? 0 : 1

    const { title, credits, creditUnitAbbr, infoContactName, examiners, roundInfos } = await getDetailedInformation(
      courseCode,
      webContext.memoLanguage
    )
    webContext.title = title
    webContext.credits = credits
    webContext.creditUnitAbbr = creditUnitAbbr
    webContext.infoContactName = infoContactName
    webContext.examiners = examiners

    webContext.memoDatas = markOutdatedMemoDatas(memoDatas, roundInfos)

    // TODO: Proper language constant
    const shortDescription = (responseLanguage === 'sv' ? 'Om kursen ' : 'About course ') + courseCode

    const compressedData = getCompressedData(webContext)
    const { uri: proxyPrefix } = serverConfig.proxyPrefixPath

    const view = renderStaticPage({
      applicationStore: {},
      location: req.url,
      basename: proxyPrefix,
      context: webContext,
    })

    log.debug(`kurs_pm_web: toolbarUrl: ${serverConfig?.toolbar?.url}`)

    res.render('memo/index', {
      aboutCourse: {
        siteName: shortDescription,
        siteUrl: '/student/kurser/kurs/' + courseCode,
      },
      compressedData,
      description: shortDescription,
      html: view,
      instrumentationKey: server.appInsights.instrumentationKey,
      lang: responseLanguage,
    })
  } catch (err) {
    log.error('Error', { error: err })
    next(err)
  }
}

async function getNoContent(req, res, next) {
  try {
    const context = {}
    const { getCompressedData, renderStaticPage } = getServerSideFunctions()
    const webContext = {
      lang,
      proxyPrefixPath: serverConfig.proxyPrefixPath,
      ...createServerSideContext(),
    }
    webContext.setBrowserConfig(browser, serverPaths, apis, server.hostUrl)

    const responseLanguage = languageLib.getLanguage(res) || 'sv'
    webContext.language = responseLanguage

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

    log.debug(`kurs_pm_web: toolbarUrl: ${serverConfig.toolbar.url}`)

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

async function getAllMemosPdfAndWeb(req, res, next) {
  const { courseCode: rawCourseCode } = req.params
  const courseCode = rawCourseCode.toUpperCase()
  try {
    log.debug('trying to fetch all memos as web or as pdf with course code: ' + courseCode)

    const apiResponse = await getMiniMemosPdfAndWeb(courseCode)
    log.debug('getAllMemosPdfAndWeb response: ', apiResponse)
    res.json(apiResponse)
  } catch (error) {
    log.error('Exception from getAllMemosPdfAndWeb ', { error })
    next(error)
  }
}

module.exports = {
  markOutdatedMemoDatas,
  getAllMemosPdfAndWeb,
  getContent,
  getOldContent,
  getNoContent,
  getAboutContent,
}
