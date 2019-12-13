import fs from 'fs'
import debug from 'debug'
import { Player } from './Player'
import { join } from 'path'
import { State } from './State'

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

const initEngine = io => {
	const broadcast = action => io.emit('action', action)
	const emit = (id, action) => io.sockets.connected[id].emit('action', action)
	const state = new State(emit, broadcast)
	io.on('connection', socket => {
		loginfo('Socket connected: ' + socket.id)
		const player = new Player(state, socket.id, emit)
		player.getGames()
		socket.on('action', ({ type, payload }) => {
			switch (type) {
				case 'server/login':
					player.login(payload)
					break
				case 'server/play':
					player.play(payload)
					break
				case 'server/piece':
					player.getPiece(payload)
					break
				case 'server/line':
					player.sendLine(payload)
					break
				case 'server/lose':
					player.lose()
					break
				case 'server/replay/req':
					player.askReplay()
					break
				case 'server/replay/res':
					player.replay(payload)
					break
			}
		})
		socket.on('disconnect', () => player.leave())
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
