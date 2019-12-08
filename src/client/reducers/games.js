const gamesReducer = (state = [], action) => {
	console.log('THIS IS THE ACTION --> ', action)
	switch (action.type) {
		case 'games':
			return action.payload
		default:
			return state
	}
}

export default gamesReducer
