const tetrisReducer = (state = { lines: [] }, { type, payload }) => {
	switch (type) {
		case 'NEW_PIECE':
			return {
				...state,
				piece: null,
				next: payload.piece
			}
		case 'DESTROY_INITIAL_PIECE':
			return {
				...state,
				piece: null
			}
		case 'INIT':
			const {
				room,
				player,
				pieces: [piece, next]
			} = payload
			window.location = `${window.location.origin}/#${room}[${player}]`
			return {
				lines: [],
				win: false,
				lost: false,
				ready: payload.ready,
				piece,
				next
			}
		case 'READY':
			return {
				...state,
				ready: true
			}
		case 'LINE':

			return {
				...state,
				lines: [...state.lines, ...payload]
			}
		case 'REMOVE_LINES':
			return {
				...state,
				lines: []
			}
		case 'WIN':
			return {
				...state,
				ready: false,
				win: true
			}
		case 'ASK_REPLAY':
			return {
				...state,
				askReplay: true
			}
		case 'server/lose':
			return {
				...state,
				ready: false,
				lost: true
			}
		case 'OPPONENT_LEFT':
			return {
				...state,
				ready: false,
				left: true,
				win: true,
			}
		default:
			return state
	}
}

export default tetrisReducer
