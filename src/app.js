import express from 'express'
import { createRoom, joinRoom } from './controllers/roomController.js'
import config from './config.js'

var app = express()

app.post('/create-room', (req, res) => createRoom(req, res))
app.post('/join-room', (req, res) => joinRoom(req, res))

console.log("running at port: " + config.serverPort)
app.listen(config.serverPort);