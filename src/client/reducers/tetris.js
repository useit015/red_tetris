const tetrisReducer = (state = { lines: [] }, action) => {
	switch (action.type) {
		case 'NEW_PIECE':
			return {
				...state,
				piece: null,
				next: action.payload.piece
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
			} = action.payload
			window.location = `${window.location.origin}/#${room}[${player}]`
			return {
				...state,
				ready: action.payload.ready,
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
				lines: [...state.lines, action.payload]
			}
		case 'REMOVE_LINES':
			return {
				...state,
				lines: []
			}
		case 'WIN':
			return {
				...state,
				win: true
			}
		default:
			return state
	}
}

export default tetrisReducer
