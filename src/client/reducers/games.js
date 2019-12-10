const gamesReducer = (state = [], action) => {
	switch (action.type) {
		case 'games':
			return action.payload
		default:
			return state
	}
}

export default gamesReducer
