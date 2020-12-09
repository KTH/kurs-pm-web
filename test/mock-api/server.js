'use strict'

const express = require('express')
const config = require('./config')

const app = express()
config.paths.forEach((path) => {
  app.get(path.url, (req, res) => {
    res.send(path.response)
  })
})

app.listen(config.host.port, config.host.address)
