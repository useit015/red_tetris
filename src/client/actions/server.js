export const login = player => ({
	type: 'server/login',
	payload: { player }
})
export const serverPlay = (type, player, host) => ({
	type: 'server/play',
	payload: { type, player, host }
})
