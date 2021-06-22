'use strict'

const { toJS } = require('mobx')
const ReactDOMServer = require('react-dom/server')

const log = require('kth-node-log')
const languageLib = require('kth-node-web-common/lib/language')

const { sv, en } = require('date-fns/locale')
const { utcToZonedTime, format } = require('date-fns-tz')

const apis = require('../api')
const serverPaths = require('../server').getPaths()
const { browser, server } = require('../configuration')
const { getMemoDataById, getMiniMemosPdfAndWeb } = require('../kursPmDataApi')
const { getCourseInfo } = require('../kursInfoApi')
const { getDetailedInformation } = require('../koppsApi')

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

function hydrateStores(renderProps) {
  // This assumes that all stores are specified in a root element called Provider
  const outp = {}
  const { props } = renderProps.props.children

  Object.keys(props).map((key) => {
    if (typeof props[key].initializeStore === 'function') {
      outp[key] = encodeURIComponent(JSON.stringify(toJS(props[key], true)))
    }
  })

  return outp
}

function _staticRender(context, location) {
  if (process.env.NODE_ENV === 'development') {
    delete require.cache[require.resolve('../../dist/app.js')]
  }

  // During startup, before build, there might not be a app.js yet
  // eslint-disable-next-line import/no-unresolved
  const { staticRender } = require('../../dist/app.js')

  return staticRender(context, location)
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
    const memoDataWithMemoEndPoint = memoDatas.find((m) => m.memoEndPoint === potentialMemoEndPoint)
    if (memoDataWithMemoEndPoint) {
      memoEndPoint = memoDataWithMemoEndPoint.memoEndPoint
    }

    // No match of potential memoEndPoint in memoDatas, search for rounds in memoDatas’ memoEndPoints
    if (!memoEndPoint) {
      const potentialMemoEndPointParts = potentialMemoEndPoint.split('-')
      if (potentialMemoEndPointParts.length > 1) {
        const potentialCourseCodeAndSemester = potentialMemoEndPointParts[0]
        const potentialCourseRounds = potentialMemoEndPointParts.slice(1)
        const memoData = memoDatas.find((m) => {
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
    (o) => memoData.ladokRoundIds.includes(o.ladokRoundId) && memoData.semester === o.semester
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

  const offerings = roundInfos.filter((r) =>
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
          endYear: r.round.endWeek.year
        }
      : {}
  )
  const markedOutDatedMemoDatas = memoDatas.map((m) => ({
    ...m,
    ...{ outdated: outdatedMemoData(offerings, startSelectionYear, m) }
  }))
  return markedOutDatedMemoDatas
}

async function getContent(req, res, next) {
  try {
    const context = {}
    const renderProps = _staticRender(context, req.url)

    const { routerStore } = renderProps.props.children.props

    routerStore.setBrowserConfig(browser, serverPaths, apis, server.hostUrl)

    const { courseCode: rawCourseCode, semester, id } = req.params
    const courseCode = rawCourseCode.toUpperCase()
    routerStore.courseCode = courseCode

    const memoDatas = await getMemoDataById(courseCode, 'published')

    const potentialMemoEndPoint = resolvePotentialMemoEndPoint(courseCode, semester, id)
    routerStore.memoEndPoint = resolveMemoEndPoint(potentialMemoEndPoint, memoDatas)

    const responseLanguage = languageLib.getLanguage(res) || 'sv'
    routerStore.language = responseLanguage

    const {
      courseMainSubjects,
      recruitmentText,
      title,
      credits,
      creditUnitAbbr,
      infoContactName,
      examiners,
      roundInfos
    } = await getDetailedInformation(courseCode, routerStore.memoLanguage)
    routerStore.courseMainSubjects = courseMainSubjects
    routerStore.title = title
    routerStore.credits = credits
    routerStore.creditUnitAbbr = creditUnitAbbr
    routerStore.infoContactName = infoContactName
    routerStore.examiners = examiners

    routerStore.memoDatas = markOutdatedMemoDatas(memoDatas, roundInfos)

    const { sellingText, imageInfo } = await getCourseInfo(courseCode)
    routerStore.sellingText = resolveSellingText(sellingText, recruitmentText, routerStore.memoLanguage)
    routerStore.imageFromAdmin = imageInfo

    // TODO: Proper language constant
    const shortDescription = (responseLanguage === 'sv' ? 'Om kursen ' : 'About course ') + courseCode

    // log.debug(`renderProps ${JSON.stringify(renderProps)}`)
    const html = ReactDOMServer.renderToString(renderProps)

    res.render('memo/index', {
      html,
      aboutCourse: {
        siteName: shortDescription,
        siteUrl: '/student/kurser/kurs/' + courseCode
      },
      initialState: JSON.stringify(hydrateStores(renderProps)),
      instrumentationKey: server.appInsights.instrumentationKey,
      lang: responseLanguage,
      description: shortDescription
    })
  } catch (err) {
    log.error('Error in getContent', { error: err })
    next(err)
  }
}

async function getOldContent(req, res, next) {
  try {
    const context = {}
    const renderProps = _staticRender(context, req.url)

    const { routerStore } = renderProps.props.children.props

    routerStore.setBrowserConfig(browser, serverPaths, apis, server.hostUrl)

    const { courseCode: rawCourseCode, memoEndPoint, version } = req.params
    const courseCode = rawCourseCode.toUpperCase()

    routerStore.courseCode = courseCode
    routerStore.memoEndPoint = memoEndPoint

    const responseLanguage = languageLib.getLanguage(res) || 'sv'
    routerStore.language = responseLanguage

    const memoDatas = await getMemoDataById(courseCode, 'old', version)
    routerStore.memoDatas = memoDatas

    const latestMemoDatas = await getMemoDataById(courseCode, 'published')
    routerStore.latestMemoLabel = resolveLatestMemoLabel(responseLanguage, latestMemoDatas)

    const {
      courseMainSubjects,
      recruitmentText,
      title,
      credits,
      creditUnitAbbr,
      infoContactName,
      examiners
    } = await getDetailedInformation(courseCode, routerStore.memoLanguage)
    routerStore.courseMainSubjects = courseMainSubjects
    routerStore.title = title
    routerStore.credits = credits
    routerStore.creditUnitAbbr = creditUnitAbbr
    routerStore.infoContactName = infoContactName
    routerStore.examiners = examiners

    const { sellingText, imageInfo } = await getCourseInfo(courseCode)
    routerStore.sellingText = resolveSellingText(sellingText, recruitmentText, routerStore.memoLanguage)
    routerStore.imageFromAdmin = imageInfo

    // TODO: Proper language constant
    const shortDescription = (responseLanguage === 'sv' ? 'Om kursen ' : 'About course ') + courseCode

    const html = ReactDOMServer.renderToString(renderProps)

    res.render('memo/index', {
      aboutCourse: {
        siteName: shortDescription,
        siteUrl: '/student/kurser/kurs/' + courseCode
      },
      html,
      initialState: JSON.stringify(hydrateStores(renderProps)),
      instrumentationKey: server.appInsights.instrumentationKey,
      lang: responseLanguage,
      description: shortDescription
    })
  } catch (err) {
    log.error('Error in getContent', { error: err })
    next(err)
  }
}

async function getAboutContent(req, res, next) {
  try {
    const context = {}
    const renderProps = _staticRender(context, req.url)

    const { routerStore } = renderProps.props.children.props

    routerStore.setBrowserConfig(browser, serverPaths, apis, server.hostUrl)

    const { courseCode: rawCourseCode } = req.params
    const courseCode = rawCourseCode.toUpperCase()
    routerStore.courseCode = courseCode

    const memoDatas = await getMemoDataById(courseCode, 'published')

    const responseLanguage = languageLib.getLanguage(res) || 'sv'
    routerStore.language = responseLanguage

    const { title, credits, creditUnitAbbr, infoContactName, examiners, roundInfos } = await getDetailedInformation(
      courseCode,
      routerStore.memoLanguage
    )
    routerStore.title = title
    routerStore.credits = credits
    routerStore.creditUnitAbbr = creditUnitAbbr
    routerStore.infoContactName = infoContactName
    routerStore.examiners = examiners

    routerStore.memoDatas = markOutdatedMemoDatas(memoDatas, roundInfos)

    // TODO: Proper language constant
    const shortDescription = (responseLanguage === 'sv' ? 'Om kursen ' : 'About course ') + courseCode

    const html = ReactDOMServer.renderToString(renderProps)

    res.render('memo/index', {
      html,
      aboutCourse: {
        siteName: shortDescription,
        siteUrl: '/student/kurser/kurs/' + courseCode
      },
      initialState: JSON.stringify(hydrateStores(renderProps)),
      instrumentationKey: server.appInsights.instrumentationKey,
      lang: responseLanguage,
      description: shortDescription
    })
  } catch (err) {
    log.error('Error in getContent', { error: err })
    next(err)
  }
}

async function getNoContent(req, res, next) {
  try {
    const context = {}
    const renderProps = _staticRender(context, req.url)

    const { routerStore } = renderProps.props.children.props

    routerStore.setBrowserConfig(browser, serverPaths, apis, server.hostUrl)

    const responseLanguage = languageLib.getLanguage(res) || 'sv'
    routerStore.language = responseLanguage

    // TODO: Proper language constant
    const shortDescription = responseLanguage === 'sv' ? 'Kurs-PM' : 'Course memo'

    // log.debug(`renderProps ${JSON.stringify(renderProps)}`)
    const html = ReactDOMServer.renderToString(renderProps)

    res.render('memo/index', {
      html,
      aboutCourse: {
        siteName: shortDescription,
        siteUrl: ''
      },
      initialState: JSON.stringify(hydrateStores(renderProps)),
      lang: responseLanguage,
      description: shortDescription
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
  getAboutContent
}
