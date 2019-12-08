import { getRandomPiece } from '../client/engine/piece'

export default class Game {
	constructor(host, type = 'solo') {
		this.host = host
		this.type = type
		this.pieces = [getRandomPiece(10), getRandomPiece(10)]
	}

	init() {
		return {
			type: 'INIT',
			payload: {
				piece: this.pieces[0],
				next: this.pieces[1]
			}
		}
	}

	piece(index) {
		while (index >= this.pieces.length) {
			this.pieces.push(getRandomPiece(10))
		}
		return {
			type: 'NEW_PIECE',
			payload: this.pieces[index]
		}
	}
}
