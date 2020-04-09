'use strict'

const { toJS } = require('mobx')
const ReactDOMServer = require('react-dom/server')

const log = require('kth-node-log')
const language = require('kth-node-web-common/lib/language')

const apis = require('../api')
const serverPaths = require('../server').getPaths()
const { browser, server } = require('../configuration')
const { getMemoDataById } = require('../kursPmDataApi')
const { getCourseInfo } = require('../kursInfoApi')
const { getDetailedInformation } = require('../koppsApi')

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

function resolveSellingText(sellingText, recruitmentText, lang) {
  return sellingText[lang] ? sellingText[lang] : recruitmentText
}

async function getContent(req, res, next) {
  try {
    const context = {}
    const renderProps = _staticRender(context, req.url)

    const { routerStore } = renderProps.props.children.props

    routerStore.setBrowserConfig(browser, serverPaths, apis, server.hostUrl)

    const { courseCode, memoId: memoEndPoint } = req.params
    routerStore.courseCode = courseCode

    const responseLanguage = language.getLanguage(res) || 'sv'
    routerStore.language = responseLanguage

    const memoDatas = await getMemoDataById(courseCode)
    routerStore.memoDatas = memoDatas
    if (memoEndPoint) {
      routerStore.memoEndPoint = memoEndPoint
    } else {
      routerStore.memoEndPoint = memoDatas[0] ? memoDatas[0].memoEndPoint : ''
    }

    const {
      courseMainSubjects,
      recruitmentText,
      title,
      credits,
      creditUnitAbbr,
      department,
      examiners,
      roundInfos,
      validFromTerm
    } = await getDetailedInformation(courseCode, routerStore.semester, routerStore.memoLanguage)
    routerStore.courseMainSubjects = courseMainSubjects
    routerStore.title = title
    routerStore.credits = credits
    routerStore.creditUnitAbbr = creditUnitAbbr
    routerStore.department = department
    routerStore.examiners = examiners
    routerStore.allRoundInfos = roundInfos
    routerStore.validFromTerm = validFromTerm

    const { sellingText, imageInfo } = await getCourseInfo(courseCode)
    routerStore.sellingText = resolveSellingText(sellingText, recruitmentText, routerStore.memoLanguage)
    routerStore.imageFromAdmin = imageInfo

    // TODO: Proper language constant
    const shortDescription = (responseLanguage === 'sv' ? 'Om kursen ' : 'About course ') + courseCode

    // log.debug(`renderProps ${JSON.stringify(renderProps)}`)
    const html = ReactDOMServer.renderToString(renderProps)

    res.render('memo/index', {
      html,
      title: shortDescription,
      initialState: JSON.stringify(hydrateStores(renderProps)),
      responseLanguage,
      description: shortDescription
    })
  } catch (err) {
    log.error('Error in getContent', { error: err })
    next(err)
  }
}

module.exports = {
  getContent
}
