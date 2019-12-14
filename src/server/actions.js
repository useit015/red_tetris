export const login = payload => ({
	type: 'login',
	payload
})

export const getGames = payload => ({
	type: 'games',
	payload
})

export const ready = () => ({
	type: 'READY'
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

export const shareState = payload => ({
	type: 'SHARE_STATE',
	payload
})

