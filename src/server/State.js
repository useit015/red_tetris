export class State {
	constructor(emit, broadcast) {
		this.emit = emit
		this.players = {}
		this.games = new Map([])
		this.broadcast = broadcast
		this.allPlayers = new Set([])
	}

	newPlayer(id, player) {
		const valid = Boolean(player) && !this.allPlayers.has(player)
		if (valid) this.setPlayer(id, player)
		return valid
	}

	setPlayer(id, player) {
		this.allPlayers.add(player)
		this.players[id] = player
	}

	getPlayer(id) {
		return this.players[id]
	}

	getHosts() {
		const getHost = game => this.players[game.host]
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
	}

	newRoom() {
		return this.games.size + 1
	}

	free(id) {
		const player = this.getPlayer(id)
		const game = this.getGame(player)
		if (player && game) {
			this.games.delete(player)
			this.allPlayers.delete(player)
			Reflect.deleteProperty(this.players, id)
			if (this.allGames().find(x => x === game)) {
				this.emit(game.getOpponent(id), {
					type: 'OPPONENT_LEFT'
				})
			}
		}
	}
}
