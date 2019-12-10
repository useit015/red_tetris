const playerReducer = (state = { valid: false, player: '' }, action) => {
	console.log('i am the action -----------> ', action)
	switch (action.type) {
		case 'login':
			return action.payload
		default:
			return state
	}
}

export default playerReducer
