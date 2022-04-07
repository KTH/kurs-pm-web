/* eslint-disable no-console */

'use strict'

const express = require('express')
const config = require('./config')

const app = express()
config.paths.forEach(path => {
  app[path.method](path.url, (req, res) => {
    res.send(path.response)
  })
})

app.use((req, res) => {
  res.send('')
})

app.listen(config.host.port, config.host.address)
