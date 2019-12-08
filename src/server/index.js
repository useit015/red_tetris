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

const [games, players] = [{}, {}]

const initEngine = io => {
	io.on('connection', socket => {
		loginfo('Socket connected: ' + socket.id)
		socket.emit('action', {
			type: 'games',
			payload: [...new Set(Object.values(players))]
		})
		socket.on('action', action => {
			if (action.type === 'server/ping') {
				socket.emit('action', { type: 'pong' })
			}
			if (action.type === 'server/init') {
				const { player } = action.payload
				players[socket.id] = player
				games[player] = games[player]
					? games[player]
					: new Game(socket.id, 'duo')
				socket.emit('action', games[player].init())
			}
			if (action.type === 'server/piece') {
				const player = players[socket.id]
				if (games[player])
					socket.emit('action', games[player].piece(action.piece))
			}
		})
		socket.on('disconnect', () => {
			delete players[socket.id]
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
