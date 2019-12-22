import Game from './Game'
import {
	win,
	lose,
	init,
	ready,
	login,
	sendLine,
	getGames,
	joinWatch,
	initWatch,
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
		const list = this.controller.getGames()
		console.log('------------------> THE GAMES ARE >>>>>>>>>> ', list)
		this.emit(this.id, getGames(list))
	}

	login({ player }) {
		const name = player.trim()
		const valid = this.controller.newPlayer(this.id, name)
		this.emit(this.id, login({ valid, name }))
		if (valid) this.player = name
	}

	lookForGame(type, host) {
		if (type === 'duo' && host) {
			const game = this.controller.getGame(host)
			game.join(this.id)
			this.emit(game.host, ready(this.player))
			game.broadcast(id =>
				this.emit(id, joinWatch(this.player))
			)
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
		this.emit(this.id, lose())
		if (this.isDuo()) {
			this.game.gameEnded()
			this.sendToOpponent(win())
		}
	}

	leave(left) {
		if (left)
			console.log('the player ', this.id, ' has left')
		this.controller.free(this.id, left)
	}

	askReplay() {
		if (this.game) {
			this.isDuo()
				? this.sendToOpponent(askReplay())
				: this.emit(
					this.id,
					init({
						player: this.player,
						...this.game.replay()
					})
				)
		}
	}

	replay() {
		if (this.isDuo()) {
			const newGame = this.game.replay()
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
					player: this.player,
					opponent,
					...newGame
				})
			)
		}
	}

	shareState(arena) {
		if (this.isDuo()) {
			this.sendToOpponent(shareState(this.player, arena))
		}
		if (this.game)
			this.game.broadcast(id =>
				this.emit(id, shareState(this.player, arena))
			)
	}

	subscribe(gameHost) {
		const game = this.controller.getGame(gameHost)
		game.subscribe(this.id)
		const { host, guest, type, room } = game
		this.emit(this.id, initWatch({
			host: this.controller.getPlayer(host),
			guest: this.controller.getPlayer(guest),
			type,
			room
		}))
	}

	unsubscribe(gameHost) {
		const game = this.controller.getGame(gameHost)
		game.unsubscribe(this.id)
	}
}

