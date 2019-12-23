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
import Game from './Game'

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
		this.emit(this.id, getGames(list))
	}

	login({ player }) {
		const name = player.trim()
		const valid = this.controller.newPlayer(this.id, name)
		if (valid) this.player = name
		this.emit(this.id, login({ valid, name }))
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
		this.startGame(player, host)
	}

	startGame(player, host) {
		this.emit(
			this.id,
			init({
				player,
				opponent: host,
				...this.game.init(this.id)
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
			this.game.gameEnded(this.id)
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
						...this.game.replay(this.id)
					})
				)
		}
	}

	replay() {
		if (this.isDuo()) {
			const newGame = this.game.replay(this.id)
			const opponentId = this.game.getOpponent(this.id)
			const opponent = this.controller.getPlayer(opponentId)
			this.sendReplayToPlayer(newGame, this.player, opponent)
			this.sendReplayToOpponent(newGame, opponent, this.player)
		}
	}

	sendReplayToPlayer(game, player, opponent) {
		this.emit(
			this.id,
			init({
				...game,
				player,
				opponent
			})
		)
	}

	sendReplayToOpponent(game, player, opponent) {
		this.sendToOpponent(
			init({
				...game,
				player,
				opponent,
				score: [...game.score].reverse()
			})
		)
	}

	shareState(arena) {
		const action = shareState(this.player, arena)
		if (this.isDuo())
			this.sendToOpponent(action)
		if (this.game) {
			this.game.cacheState(action.payload)
			this.game.broadcast(id => this.emit(id, action))
		}
	}

	subscribe(gameHost) {
		if (gameHost) {
			const game = this.controller.getGame(gameHost)
			if (game) {
				game.subscribe(this.id)
				const { host, guest, type, room, cache } = game
				this.emit(this.id, initWatch({
					host: this.controller.getPlayer(host),
					guest: this.controller.getPlayer(guest),
					type,
					room,
					cache
				}))
			}
		}
	}

	unsubscribe(gameHost) {
		if (gameHost) {
			const game = this.controller.getGame(gameHost)
			if (game) game.unsubscribe(this.id)
		}
	}
}

