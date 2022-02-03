const express = require('express')
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {cors: {origin: "*"}})
const port = 8000
const words = require('an-array-of-english-words')
				.filter(word => (word.length === 5))
				.filter(word => {
					const letters = new Set(word.split(''))
					return letters.size === 5
				})

const correctGuesses = new Map()

io.on("connection", socket => {
	if(!correctGuesses.has(socket.id)){
		const selectedWord = words[Math.floor(Math.random() * words.length)].toLowerCase();
		correctGuesses.set(socket.id, selectedWord);
		console.log(selectedWord)
		setTimeout(() => correctGuesses.delete(socket.id), 60 * 60 * 1000);
	}
	socket.on("evaluate", guess => {
		if(!words.includes(guess))	return socket.emit("invalid guess")
		const correctGuess = correctGuesses.get(socket.id);
		const result = guess.split('').map((letter, idx) => {
			if(letter === correctGuess[idx])	return 'correct'
			if(correctGuess.includes(letter))	return 'present'
			return 'absent'
		})
		socket.emit("result", result)
	})
})

app.get('/', (req, res) => res.send("Service running", words.length))

httpServer.listen(port, () => console.log("Service started!", words.length))

