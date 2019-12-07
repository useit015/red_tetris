const reducer = (state = {}, action) => {
	switch (action.type) {
		case 'NEW_PIECE':
			return {
				...state,
				next: action.payload
			}
		case 'DESTROY_INITIAL_PIECE':
			return {
				...state,
				piece: null
			}
		case 'INIT':
			return action.payload
		default:
			return state
	}
}

export default reducer
