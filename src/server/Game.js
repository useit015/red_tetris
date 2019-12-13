import { getRandomPiece } from '../client/engine/piece'

const initPcs = () => [getRandomPiece(), getRandomPiece()]

export class Game {
	constructor(host, type, room) {
		this.host = host
		this.room = room
		this.type = type
		this.guest = null
		this.ready = type === 'solo'
		this.pieces = initPcs()
	}

	isFull() {
		return this.type === 'duo'
			? Boolean(this.guest) && Boolean(this.host)
			: Boolean(this.host)
	}
	init() {
		return {
			pieces: this.pieces.slice(0, 2),
			ready: this.ready,
			type: this.type,
			room: this.room
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

	gameEnded() {
		this.ready = false
	}

	replay() {
		this.pieces = initPcs()
		this.ready = true
		return this.init()
	}

	getOpponent(id) {
		return this.host === id ? this.guest : this.host
	}
}
