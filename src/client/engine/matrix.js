import * as R from 'ramda'

const makeRow = (length, fill = '.') => new Array(length).fill(fill)

export const makeMatrix = (width, height) => makeRow(height, makeRow(width))

const applyToMatrix = hf => (f, matrix) =>
	hf((row, y) => hf((cell, x) => f(cell, x, y), row), matrix)

export const forEachIdx = R.addIndex(R.forEach)

const mapIdx = R.addIndex(R.map)

const anyIdx = R.addIndex(R.any)

export const forEachMatrix = applyToMatrix(forEachIdx)

export const mapMatrix = applyToMatrix(mapIdx)

export const anyMatrix = R.compose(
	R.curry,
	applyToMatrix
)(anyIdx)

export const copyMatrix = R.map(R.clone)

const joinLine = R.join(' ')

const joinRow = R.join('\n')

const doubleRow = R.compose(
	R.flatten,
	R.map(x => [x, x])
)

const getColor = i => {
	const colors = [
		'\x1b[41m',
		'\x1b[42m',
		'\x1b[43m',
		'\x1b[44m',
		'\x1b[45m',
		'\x1b[46m',
		'\x1b[47m'
	]
	const reset = '\x1b[0m'
	return `${colors[i]}\x1b[30m${i}${reset}${reset}`
	// const chars = ['⚽', '⚾', '🏀', '🏐', '🏈', '🏉', '🎾']
	// return chars[i]
}

const applyColor = R.curry(mapMatrix)(c => (c === '.' ? c : getColor(c)))

export const toString = R.compose(
	R.concat('\x1Bc'),
	joinRow,
	doubleRow,
	R.map(
		R.compose(
			joinLine,
			doubleRow
		)
	)
)

export const rotate = (matrix, dir = 1) => {
	const m = R.clone(matrix)
	const len = m.length
	for (let i = 0; i < len / 2; i++)
		for (let j = i; j < len - i - 1; j++) {
			const temp = m[i][j]
			if (dir > 0) {
				m[i][j] = m[len - 1 - j][i]
				m[len - 1 - j][i] = m[len - 1 - i][len - 1 - j]
				m[len - 1 - i][len - 1 - j] = m[j][len - 1 - i]
				m[j][len - 1 - i] = temp
			} else {
				m[i][j] = m[j][len - 1 - i]
				m[j][len - 1 - i] = m[len - 1 - i][len - 1 - j]
				m[len - 1 - i][len - 1 - j] = m[len - 1 - j][i]
				m[len - 1 - j][i] = temp
			}
		}
	return m
}
