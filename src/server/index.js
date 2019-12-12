import fs from 'fs'
import debug from 'debug'
import { Player } from './Player'
import { join } from 'path'

const logerror = debug('tetris:error'),
	loginfo = debug('tetris:info')

const initApp = (app, params, cb) => {
	const { host, port } = params
	const handler = (req, res) => {
		const file =
			req.url === '/bundle.js'
				? '/../../build/bundle.js'
				: '/../../index.html'
		fs.readFile(join(__dirname, file), (err, data) => {
			if (err) {
				logerror(err)
				res.writeHead(500)
				return res.end('Error loading index.html')
			}
			res.writeHead(200)
			res.end(data)
		})
	}

	app.on('request', handler)

	app.listen({ host, port }, () => {
		loginfo(`tetris listen on ${params.url}`)
		cb()
	})
}

const [players, allPlayers, games] = [{}, new Set([]), new Map([])]

const initEngine = io => {
	io.on('connection', socket => {
		loginfo('Socket connected: ' + socket.id)
		const emit = action => socket.emit('action', action)
		const emitTo = (id, action) =>
			io.sockets.connected[id].emit('action', action)
		const player = new Player(socket.id, emit, emitTo)
		player.getGames(games)
		socket.on('action', action => {
			switch (action.type) {
				case 'server/login':
					player.login(action.payload, players, allPlayers)
					break
				case 'server/play':
					player.play(action.payload, games, io.sockets.connected)
					break
				case 'server/piece':
					player.getPiece(action.payload, games, players)
					break
				case 'server/line':
					player.sendLine(
						action.payload,
						games,
						players,
						io.sockets.connected
					)
					break
				case 'server/lose':
					player.lose(games, players, io.sockets.connected)
					break
			}
		})
		socket.on('disconnect', () => player.leave(allPlayers, players))
	})
}

export function create(params) {
	const promise = new Promise((resolve, reject) => {
		const app = require('http').createServer()
		initApp(app, params, () => {
			const io = require('socket.io')(app)
			const stop = cb => {
				io.close()
				app.close(() => {
					app.unref()
				})
				loginfo('Engine stopped.')
				cb()
			}
			initEngine(io)
			resolve({ stop })
		})
	})
	return promise
}
