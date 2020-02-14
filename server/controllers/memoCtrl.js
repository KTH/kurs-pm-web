'use strict'

const log = require('kth-node-log')
const language = require('kth-node-web-common/lib/language')

const { toJS } = require('mobx')
const ReactDOMServer = require('react-dom/server')

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
    const lang = language.getLanguage(res) || 'sv'
    const renderProps = _staticRender(context, req.url)
    const { courseCode /* semester */ } = req.params
    const html = ReactDOMServer.renderToString(renderProps)

    const shortDescription = (lang === 'sv' ? 'Om kursen ' : 'About course ') + courseCode

    res.render('sample/index', {
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
