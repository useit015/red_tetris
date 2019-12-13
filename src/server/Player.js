import { Game } from './Game'
import {
	win,
	init,
	ready,
	login,
	sendLine,
	getGames,
	sendPiece,
	askReplay
} from './actions'

export class Player {
	constructor(state, id, emit) {
		this.id = id
		this.emit = emit
		this.state = state
	}

	sendToOpponent(game, action) {
		this.emit(game.getOpponent(this.id), action)
	}

	getGames() {
		this.emit(this.id, getGames(this.state.getHosts()))
	}

	login(payload) {
		const player = payload.player.trim()
		const valid = this.state.newPlayer(this.id, player)
		this.emit(this.id, login({ valid, player }))
	}

	play({ type, player, host }) {
		let game
		if (type === 'duo' && host) {
			game = this.state.getGame(host)
			game.join(this.id)
			this.emit(game.host, ready())
		} else {
			game = new Game(this.id, type, this.state.newRoom())
		}
		this.game = game
		this.state.setGame(player, game)
		this.emit(
			this.id,
			init({
				player,
				...game.init()
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
		if (this.gameisDuo()) this.sendToOpponent(this.game, sendLine(payload))
	}

	lose() {
		if (this.gameisDuo()) {
			this.game.gameEnded()
			this.sendToOpponent(this.game, win())
		}
	}

	leave() {
		this.state.free(this.id)
	}

	askReplay() {
		if (this.gameisDuo()) this.sendToOpponent(this.game, askReplay())
	}

	replay(res) {
		if (res) {
			if (this.gameisDuo()) {
				const newGame = this.game.replay()
				const player = this.state.getPlayer(this.id)
				const opponent = this.state.getPlayer(
					this.game.getOpponent(this.id)
				)
				this.sendToOpponent(
					this.game,
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
}
