const playerReducer = (state = { valid: false, player: '' }, action) => {
	switch (action.type) {
		case 'login':
			return action.payload
		default:
			return state
	}
}

export default playerReducer
