'use strict'

const express = require('express')
const config = require('./config')

const app = express()
config.paths.forEach((path) => {
  // eslint-disable-next-line no-console
  console.log('Added path', path.url)
  app.get(path.url, (req, res) => {
    res.send(path.response)
  })
})

app.listen(config.host.port, config.host.address)
