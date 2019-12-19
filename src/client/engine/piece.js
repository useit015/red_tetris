import { compose, curry, join, map } from 'ramda'

import { rotate, mapMatrix, copyMatrix } from './matrix'

const randInt = (max, min = 0) => ~~(Math.random() * max + min)

const randEl = arr => arr[randInt(arr.length)]

const randRot = matrix => {
	const rot = randInt(4)
	let rotated = copyMatrix(matrix)
	for (let i = 0; i < rot; i++) rotated = rotate(rotated)
	return rotated
}

const allPcs = () =>
	'++<++>.+.<.+.<.++>.+.<.+.<++.>++.<.++<...>.++<++.<...>.+.<+++<...>.+..<.+..<.+..<.+..'
		.split('>')
		.map(cur => cur.split('<').map(cur => cur.split('')))

const randPiece = compose(
	randEl,
	allPcs
)

const genPcs = () => {
	const color = randInt(7)
	const formatPiece = cell => (cell === '+' ? color : '.')
	return compose(
		randRot,
		curry(mapMatrix)(formatPiece),
		randPiece
	)()
}

export const getRandomPiece = (width = 10) => {
	const coord = compose(
		map(join('')),
		genPcs
	)()
	return {
		coord,
		pos: {
			x: ~~(width / 2 - coord[0].length / 2),
			y: 0
		}
	}
}

export const initPcs = () => [getRandomPiece(), getRandomPiece()]
