'use strict'

const { toJS } = require('mobx')
const ReactDOMServer = require('react-dom/server')

const log = require('kth-node-log')
const language = require('kth-node-web-common/lib/language')

const apis = require('../api')
const serverPaths = require('../server').getPaths()
const { browser, server } = require('../configuration')
const { getMemoDataById } = require('../kursPmDataApi')
const { getSellingText } = require('../kursInfoApi')
const { getMainSubjects } = require('../koppsApi')

function hydrateStores(renderProps) {
  // This assumes that all stores are specified in a root element called Provider
  const outp = {}
  const { props } = renderProps.props.children

  Object.keys(props).map(key => {
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

  const { staticRender } = require('../../dist/app.js')

  return staticRender(context, location)
}

async function getContent(req, res, next) {
  try {
    const context = {}
    const renderProps = _staticRender(context, req.url)

    const { routerStore } = renderProps.props.children.props

    routerStore.setBrowserConfig(browser, serverPaths, apis, server.hostUrl)

    const { courseCode, semester } = req.params
    routerStore.courseCode = courseCode
    routerStore.semester = semester

    const lang = language.getLanguage(res) || 'sv'
    routerStore.memoData = await getMemoDataById(courseCode)
    routerStore.courseMainSubjects = await getMainSubjects(courseCode, lang)
    routerStore.sellingText = await getSellingText(courseCode)

    const shortDescription = (lang === 'sv' ? 'Om kursen ' : 'About course ') + courseCode

    // log.debug(`renderProps ${JSON.stringify(renderProps)}`)
    const html = ReactDOMServer.renderToString(renderProps)

    res.render('memo/index', {
      html,
      title: shortDescription,
      initialState: JSON.stringify(hydrateStores(renderProps)),
      lang,
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
