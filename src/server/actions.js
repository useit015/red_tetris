export const login = payload => ({
	type: 'login',
	payload
})

export const getGames = payload => ({
	type: 'games',
	payload
})

export const ready = opponent => ({
	type: 'READY',
	payload: { opponent }
})

export const lose = () => ({
	type: 'LOSE'
})

export const win = () => ({
	type: 'WIN'
})

export const init = payload => ({
	type: 'INIT',
	payload
})

export const sendPiece = payload => ({
	type: 'NEW_PIECE',
	payload
})

export const sendLine = payload => ({
	type: 'LINE',
	payload
})

export const askReplay = () => ({
	type: 'ASK_REPLAY'
})

export const opponentLeft = () => ({
	type: 'OPPONENT_LEFT'
})

export const shareState = (name, arena) => ({
	type: 'SHARE_STATE',
	payload: {
		name,
		arena
	}
})

export const joinWatch = payload => ({
	type: 'JOIN_WATCH',
	payload
})

export const initWatch = payload => ({
	type: 'INIT_WATCH',
	payload
})
