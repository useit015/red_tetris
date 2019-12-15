import { makeMatrix } from '../engine/matrix'

const defaultState = {
	arena: makeMatrix()
}

const opponentReducer = (state = defaultState, { type, payload }) => {
	switch (type) {
		case 'SHARE_STATE':
			return { arena: payload }
		case 'server/replay/res':
		case 'server/replay/req':
		case 'ASK_REPLAY':
			return defaultState
		default:
			return state
	}
}

export default opponentReducer
