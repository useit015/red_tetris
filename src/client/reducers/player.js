const playerReducer = (state = { valid: false, name: '' }, { type, payload }) => {
	switch (type) {
		case 'login':
			return payload
		default:
			return state
	}
}

export default playerReducer
