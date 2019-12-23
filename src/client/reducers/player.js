const playerReducer = (state = { valid: false, name: '' }, { type, payload }) => {
	switch (type) {
		case 'login':
			if (payload.valid) localStorage.setItem('player', payload.name)
			return { ...payload }
		case 'server/logout':
			localStorage.removeItem('player')
			return {
				valid: false,
				name: ''
			}
		default:
			return state
	}
}

export default playerReducer
