import Game from './Game'
import {
	win,
	lose,
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
			const player = this.controller.getPlayer(this.id)
			game.join(this.id)
			this.emit(game.host, ready(player))
			return game
		} else {
			const room = this.controller.newRoom()
			return new Game(this.id, type, room)
		}
	}

	play({ type, player, host }) {
		this.game = this.lookForGame(type, host)
		this.controller.setGame(player, this.game)
		this.emit(
			this.id,
			init({
				player,
				opponent: host,
				...this.game.init()
			})
		)
	}

	isDuo() {
		return this.game && this.game.type === 'duo'
	}

	getPiece(pieceIndex) {
		if (this.game) {
			const piece = this.game.piece(pieceIndex)
			this.emit(this.id, sendPiece(piece))
		}
	}

	sendLine(payload) {
		if (this.isDuo()) this.sendToOpponent(sendLine(payload))
	}

	lose() {
		if (this.isDuo()) {
			this.game.gameEnded()
			this.emit(this.id, lose())
			this.sendToOpponent(win())
		}
	}

	leave(left) {
		if (left)
			console.log('the player ', this.id, ' has left')
		this.controller.free(this.id, left)
	}

	askReplay() {
		if (this.isDuo()) this.sendToOpponent(askReplay())
	}

	replay() {
		if (this.isDuo()) {
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
					opponent,
					...newGame
				})
			)
		}
	}

	shareState(arena) {
		if (this.isDuo()) {
			const player = this.controller.getPlayer(this.id)
			this.sendToOpponent(shareState(player, arena))
		}
	}
}

