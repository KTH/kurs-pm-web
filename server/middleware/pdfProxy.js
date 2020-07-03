'use strict'

const { createProxyMiddleware } = require('http-proxy-middleware')

function pathRewrite(path) {
  return path.replace('/kurs-pm/', '/api/kurs-pm-data/v1/')
}

function setApiKey(key) {
  return function onProxyReq(proxyReq) {
    proxyReq.setHeader('api_key', key)
  }
}

function logProvider() {
  return require('kth-node-log')
}

function getPdfProxy(config, key) {
  const { https, host, port } = config
  const target = `${https ? 'https' : 'http'}://${host}${port ? ':' + port : ''}`
  const options = {
    target,
    changeOrigin: true,
    pathRewrite,
    onProxyReq: setApiKey(key),
    logProvider
  }
  return createProxyMiddleware(options)
}

module.exports = {
  getPdfProxy
}
