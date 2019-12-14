import { Game } from './Game'
import {
	win,
	init,
	ready,
	login,
	sendLine,
	getGames,
	sendPiece,
	askReplay,
	shareState
} from './actions'

export class Player {
	constructor(controller, id, emit) {
		this.id = id
		this.emit = emit
		this.controller = controller
	}

	sendToOpponent(action) {
		this.emit(this.game.getOpponent(this.id), action)
	}

	getGames() {
		this.emit(this.id, getGames(this.controller.getHosts()))
	}

	login(payload) {
		const player = payload.player.trim()
		const valid = this.controller.newPlayer(this.id, player)
		this.emit(this.id, login({ valid, player }))
	}

	lookForGame(type, host) {
		let game
		if (type === 'duo' && host) {
			game = this.controller.getGame(host)
			game.join(this.id)
			this.emit(game.host, ready())
		} else {
			game = new Game(this.id, type, this.controller.newRoom())
		}
		return game
	}

	play({ type, player, host }) {
		this.game = this.lookForGame(type, host)
		this.controller.setGame(player, this.game)
		this.emit(
			this.id,
			init({
				player,
				...this.game.init()
			})
		)
	}

	gameisDuo() {
		return this.game && this.game.type === 'duo'
	}

	getPiece(piece) {
		if (this.game) this.emit(this.id, sendPiece(this.game.piece(piece)))
	}

	sendLine(payload) {
		if (this.gameisDuo()) this.sendToOpponent(sendLine(payload))
	}

	lose() {
		if (this.gameisDuo()) {
			this.game.gameEnded()
			this.sendToOpponent(win())
		}
	}

	leave() {
		console.log('the player ', this.id, ' has left')
		this.controller.free(this.id)
	}

	askReplay() {
		if (this.gameisDuo()) this.sendToOpponent(askReplay())
	}

	replay(res) {
		if (res) {
			if (this.gameisDuo()) {
				const newGame = this.game.replay()
				const player = this.controller.getPlayer(this.id)
				const opponent = this.controller.getPlayer(
					this.game.getOpponent(this.id)
				)
				this.sendToOpponent(
					init({
						player: opponent,
						...newGame
					})
				)
				this.emit(
					this.id,
					init({
						player,
						...newGame
					})
				)
			}
		}
	}

	shareState(arena) {
		this.sendToOpponent(shareState(arena))
	}
}
