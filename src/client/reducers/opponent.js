import { makeMatrix } from '../engine/matrix'

const defaultState = {
	name: '',
	arena: makeMatrix()
}

const opponentReducer = (state = defaultState, { type, payload }) => {
	switch (type) {
		case 'READY':
		case 'INIT':
			return {
				...defaultState,
				name: payload.opponent
			}
		case 'server/replay/req':
		case 'server/replay/res':
			return {
				...defaultState,
				name: state.name
			}
		case 'SHARE_STATE':
			return payload
		case 'server/left':
			return defaultState
		default:
			return state
	}
}

export default opponentReducer
