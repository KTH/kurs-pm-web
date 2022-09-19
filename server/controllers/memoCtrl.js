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
const { createServerSideContext, createAdditionalContext } = require('../ssr-context/createServerSideContext')

const locales = { sv, en }

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

    webContext.memoDatas = await markOutdatedMemoDatas(rawMemos, roundInfos)
    webContext.allTypeMemos = await getMiniMemosPdfAndWeb(courseCode)

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

// eslint-disable-next-line consistent-return
async function getTermsWithCourseRounds(req, res, next) {
  try {
    const termsWithCourseRounds = await getCourseRoundTerms(courseCode)
    res.send(termsWithCourseRounds)
  } catch (err) {
    log.error(` Exception from getTermsWithCourseRounds for ${courseCode}`, { error: err })
    next(err)
  }
}

module.exports = {
  markOutdatedMemoDatas,
  getContent,
  getOldContent,
  getNoContent,
  getAboutContent,
  getTermsWithCourseRounds,
}
