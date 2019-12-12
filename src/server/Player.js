import { Game } from './Game'
import {
	login,
	getGames,
	ready,
	init,
	sendPiece,
	sendLine,
	win
} from './actions'

export class Player {
	constructor(id, emit, emitTo) {
		this.id = id
		this.emit = emit
		this.emitTo = emitTo
		this.games = new Map([])
		this.players = {}
		this.allPlayers = new Set([])
	}

	getGames(games) {
		this.emit(getGames([...games.keys()]))
	}

	login(payload, players, allPlayers) {
		const player = payload.player.trim()
		const valid = Boolean(player) && !allPlayers.has(player)
		if (valid) {
			allPlayers.add(player)
			players[this.id] = player
		}
		this.emit(login({ valid, player }))
	}

	play({ type, player, host }, games) {
		let game
		if (type === 'duo' && host) {
			game = games.get(host)
			game.join(this.id)
			this.emitTo(game.host, ready())
		} else {
			game = new Game(this.id, type, games.size + 1)
		}
		games.set(player, game)
		this.emit(
			init({
				player,
				...game.init()
			})
		)
	}

	getPiece(piece, games, players) {
		const game = games.get(players[this.id])
		if (game) this.emit(sendPiece(game.piece(piece)))
	}

	sendLine(payload, games, players) {
		const game = games.get(players[this.id])
		if (game && game.type === 'duo')
			this.emitTo(
				game.host === this.id ? game.guest : game.host,
				sendLine(payload)
			)
	}

	lose(games, players) {
		const game = games.get(players[this.id])
		if (game && game.type === 'duo')
			this.emitTo(game.host === this.id ? game.guest : game.host, win())
	}

	leave(allPlayers, players) {
		allPlayers.delete(players[this.id])
		delete players[this.id]
	}
}
