import fs from 'fs'
import debug from 'debug'
import Game from './Game'
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

const [games, players, allPlayers] = [new Map([]), {}, new Set([])]

const initEngine = io => {
	io.on('connection', socket => {
		loginfo('Socket connected: ' + socket.id)
		socket.emit('action', {
			type: 'games',
			payload: [...games.keys()]
		})
		socket.on('action', action => {
			if (action.type === 'server/login') {
				const player = action.payload.player.trim()
				const valid = Boolean(player) && !allPlayers.has(player)
				if (valid) {
					allPlayers.add(player)
					players[socket.id] = player
				}
				socket.emit('action', {
					type: 'login',
					payload: { valid, player }
				})
			}
			if (action.type === 'server/play') {
				let game
				const { type, player, host } = action.payload
				if (type === 'duo' && host) {
					game = games.get(host)
					game.join(socket.id)
					io.sockets.connected[game.host].emit('action', {
						type: 'READY'
					})
				} else {
					game = new Game(socket.id, type, games.size + 1)
				}
				games.set(player, game)
				socket.emit('action', {
					type: 'INIT',
					payload: {
						player,
						room: game.room,
						...game.init()
					}
				})
			}
			if (action.type === 'server/piece') {
				const game = games.get(players[socket.id])
				socket.emit('action', {
					type: 'NEW_PIECE',
					payload: game.piece(action.piece)
				})
			}
		})
		socket.on('disconnect', () => {
			delete allPlayers.delete()
		})
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
