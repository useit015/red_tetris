const opponentReducer = (state = { arena: [], piece: { coord: [], pos: { x: 0, y: 0 } } }, { type, payload }) => {
	switch (type) {
		case 'SHARE_STATE':
			return {
				...state,
				arena: payload
			}
		default:
			return state
	}
}

export default opponentReducer
