'use strict'

const axios = require('axios')
const log = require('kth-node-log')
const { getEnv, devDefaults } = require('kth-node-configuration')

const apis = require('../api')

async function getPdf(memoEndPoint) {
  const { paths, client } = apis.kursPmDataApi
  const path = client.resolve(paths.getPdfMemoByEndPoint.uri.split(':')[0])
  const { https, host, port } = apis.kursPmDataApi.config
  const url = `${https ? 'https' : 'http'}://${host}${port ? ':' + port : ''}${path}${memoEndPoint}`
  const response = await axios({
    method: 'get',
    url,
    headers: { api_key: getEnv('KURS_PM_DATA_API_KEY', devDefaults('1234')) },
    responseType: 'arraybuffer'
  })
    .then(function returnData(res) {
      return res.data
    })
    .catch(function handleError(err) {
      log.error(err)
      return Buffer.from([])
    })
  return response
}

/* eslint-disable consistent-return */
async function getMemoByEndPoint(req, res) {
  const { id: memoEndPoint } = req.params
  log.info('getMemoByEndPoint: Received request for PDF with memoEndPoint:', memoEndPoint)
  try {
    res.type('application/pdf')
    const pdf = await getPdf(memoEndPoint)
    res.send(pdf)
    if (req.query.download === 'true') {
      res.set('Content-Disposition', 'attachment; filename=' + memoEndPoint + '.pdf')
    }
    log.info('getMemoByEndPoint: Responded to request for PDF with memoEndPoint:', memoEndPoint)
  } catch (err) {
    log.error('getMemoByEndPoint: Failed request for PDF, error:', { err })
    return err
  }
}

module.exports = {
  getMemoByEndPoint
}
