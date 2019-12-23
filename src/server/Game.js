import { initPcs, getRandomPiece } from '../client/engine/piece'

export default class Game {
	constructor(host, type, room) {
		this.host = host
		this.room = room
		this.type = type
		this.guest = null
		this.public = new Set([])
		this.ready = type === 'solo'
		this.pieces = initPcs()
		this.cache = {}
		this.score = [0, 0]
	}

	isFull() {
		return this.type === 'duo'
			? Boolean(this.guest) && Boolean(this.host)
			: Boolean(this.host)
	}

	getScore(id) {
		return id === this.host
			? this.score
			: [...this.score].reverse()
	}

	init(id) {
		return {
			pieces: this.pieces.slice(0, 2),
			score: this.getScore(id),
			ready: this.ready,
			type: this.type,
			room: this.room,
		}
	}

	piece(index) {
		while (index >= this.pieces.length) {
			this.pieces.push(getRandomPiece(10))
		}
		return {
			piece: this.pieces[index]
		}
	}

	join(guest) {
		this.guest = guest
		this.ready = true
	}

	gameEnded(loser) {
		this.score[loser === this.host ? 1 : 0]++
		this.ready = false
	}

	replay(id) {
		this.pieces = initPcs()
		this.ready = true
		return this.init(id)
	}

	getOpponent(id) {
		return this.type === 'duo'
			? this.host === id
				? this.guest
				: this.host
			: null
	}

	subscribe(id) {
		this.public.add(id)
	}

	unsubscribe(id) {
		this.public.delete(id)
	}

	broadcast(cb) {
		[...this.public].forEach(cb)
	}

	cacheState({ name, arena }) {
		this.cache[name] = { arena }
	}
}
