const express = require('express')
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {cors: {origin: "*"}})
const port = 8000
const words = require('an-array-of-english-words').filter(word => (word.length === 5))

io.on("connection", socket => {
	socket.on("evaluate", guess => {
		if(!words.includes(guess))	return socket.emit("invalid guess")
		return socket.emit("valid guess")
	})
})


httpServer.listen(port, () => console.log("Service started!", words.length))

