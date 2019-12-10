import { getRandomPiece } from '../client/engine/piece'

export default class Game {
	constructor(host, type, room) {
		this.host = host
		this.room = room
		this.type = type
		this.guest = null
		this.ready = type === 'solo'
		this.pieces = [getRandomPiece(10), getRandomPiece(10)]
	}

	init() {
		return {
			pieces: this.pieces.slice(0, 2),
			ready: this.ready,
			type: this.type
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
}
