export const serverLogin = player => ({
	type: 'server/login',
	payload: { player }
})

export const serverPlay = (type, player, host) => ({
	type: 'server/play',
	payload: { type, player, host }
})

export const serverShareState = payload => ({
	type: 'server/state',
	payload
})

export const serverSendLine = payload => ({
	type: 'server/line',
	payload
})

export const serverGetPiece = payload => ({
	type: 'server/piece',
	payload
})

export const serverLose = () => ({
	type: 'server/lose'
})

export const serverReplayRes = () => ({
	type: 'server/replay/res'
})

export const serverReplayReq = () => ({
	type: 'server/replay/req'
})

export const serverLeft = () => ({
	type: 'server/left'
})
