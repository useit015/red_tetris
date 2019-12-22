import {
	map,
	any,
	join,
	curry,
	clone,
	flatten,
	concat,
	forEach,
	compose,
	addIndex,
} from 'ramda'

const makeRow = (length, fill = '.') => new Array(length).fill(fill)

export const makeMatrix = (width = 10, height = 20) => makeRow(height, makeRow(width))

const applyToMatrix = hf => (f, matrix) =>
	hf((row, y) => hf((cell, x) => f(cell, x, y), row), matrix)

export const forEachIdx = addIndex(forEach)

const mapIdx = addIndex(map)

const anyIdx = addIndex(any)

export const forEachMatrix = applyToMatrix(forEachIdx)

export const mapMatrix = applyToMatrix(mapIdx)

export const anyMatrix = compose(
	curry,
	applyToMatrix
)(anyIdx)

export const copyMatrix = map(clone)

const joinLine = join(' ')

const joinRow = join('\n')

const doubleRow = compose(
	flatten,
	map(x => [x, x])
)

export const toString = compose(
	concat('\x1Bc'),
	joinRow,
	doubleRow,
	map(
		compose(
			joinLine,
			doubleRow
		)
	)
)

export const rotate = (matrix, dir = 1) => {
	const m = matrix.map(x => (typeof x === 'string' ? x.split('') : x))
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
