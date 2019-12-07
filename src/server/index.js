import fs from 'fs'
import { join } from 'path'
import debug from 'debug'
import { getRandomPiece } from '../client/engine/piece.js'

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
	io.on('connection', socket => {
		loginfo('Socket connected: ' + socket.id)
		socket.on('action', action => {
			if (action.type === 'server/ping') {
				socket.emit('action', { type: 'pong' })
			}
			if (action.type === 'server/init') {
				socket.emit('action', {
					type: 'INIT',
					payload: {
						piece: getRandomPiece(10),
						next: getRandomPiece(10)
					}
				})
			}
			if (action.type === 'server/piece') {
				socket.emit('action', {
					type: 'NEW_PIECE',
					payload: getRandomPiece(10)
				})
			}
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
