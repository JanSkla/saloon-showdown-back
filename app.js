var express = require('express')
const { createRoom, joinRoom } = require('./controllers/roomController')
const { default: config } = require('./config')

var app = express()

config(); //runs configuration befor server starts

app.post('/create-room', createRoom(req, res))
app.post('/join-room', joinRoom(req, res))

console.log("running at port: 3000")
app.listen(3000);