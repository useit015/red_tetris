
const watchReducer = (state = {}, { type, payload }) => {
	switch (type) {
		case 'INIT_WATCH':
			return payload
		case 'JOIN_WATCH':
			return {
				...state,
				guest: payload
			}
		default:
			return state
	}
}

export default watchReducer
