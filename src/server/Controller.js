import { getGames, opponentLeft } from './actions'

export class Controller {
	constructor(emit, broadcast) {
		this.emit = emit
		this.games = new Map([])
		this.players = new Map([])
		this.broadcast = broadcast
	}

	newPlayer(id, player) {
		const valid = Boolean(player) && !this.playerExists(player)
		if (valid) this.setPlayer(id, player)
		return valid
	}

	playerExists(player) {
		return new Set(this.players.values()).has(player)
	}

	setPlayer(id, player) {
		this.players.set(id, player)
	}

	getPlayer(id) {
		return this.players.get(id)
	}

	getHosts() {
		const getHost = ({ host }) => this.getPlayer(host)
		const all = this.allGames().map(getHost)
		const incomplete = this.availableGames().map(getHost)
		return all.map(host => ({
			host,
			full: incomplete.indexOf(host) === -1
		}))
	}

	allGames() {
		return [...new Set(this.games.values())]
	}

	availableGames() {
		return this.allGames().filter(game => !game.isFull())
	}

	getGame(player, id) {
		const key = player ? player : this.getPlayer(id)
		return this.games.get(key)
	}

	setGame(player, game) {
		this.games.set(player, game)
		this.broadcastGameList()
	}

	newRoom() {
		return this.allGames().length + 1
	}

	free(id) {
		const player = this.getPlayer(id)
		if (player) {
			this.players.delete(id)
			const game = this.getGame(player)
			if (game) {
				this.games.delete(player)
				if (this.allGames().find(x => x === game)) {
					const opponent = game.getOpponent(id)
					if (opponent)
						this.emit(opponent, opponentLeft())
				} else {
					this.broadcastGameList()
				}
			}
		}
	}

	broadcastGameList() {
		this.broadcast(getGames(this.getHosts()))
	}
}