import express from 'express'
import config from './config.js'
import startWs from './ws/wsController.js'

var app = express()


startWs();

console.log("running at port: " + config.serverPort)
app.listen(config.serverPort);