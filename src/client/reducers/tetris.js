const tetrisReducer = (state = {}, action) => {
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
				ready: action.payload.ready,
				piece,
				next
			}
		case 'READY':
			return {
				...state,
				ready: true
			}
		default:
			return state
	}
}

export default tetrisReducer
