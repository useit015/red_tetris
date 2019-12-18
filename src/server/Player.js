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
		const opponent = this.game.getOpponent(this.id)
		this.emit(opponent, action)
	}

	getGames() {
		const list = this.controller.getHosts()
		this.emit(this.id, getGames(list))
	}

	login({ player }) {
		const name = player.trim()
		const valid = this.controller.newPlayer(this.id, name)
		this.emit(this.id, login({ valid, name }))
	}

	lookForGame(type, host) {
		if (type === 'duo' && host) {
			const game = this.controller.getGame(host)
			game.join(this.id)
			this.emit(game.host, ready())
			return game
		} else {
			return new Game(this.id, type, this.controller.newRoom())
		}
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
		if (res && this.gameisDuo()) {
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

	shareState(arena) {
		if (this.gameisDuo())
			this.sendToOpponent(shareState(this.controller.getPlayer(this.id), arena))
	}
}

