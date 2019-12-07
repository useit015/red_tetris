import R from 'ramda'

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

const randPiece = R.compose(
	randEl,
	allPcs
)

const genPcs = () => {
	const color = randInt(7)
	const formatPiece = cell => (cell === '+' ? color : '.')
	return R.compose(
		randRot,
		R.curry(mapMatrix)(formatPiece),
		randPiece
	)()
}

export const getRandomPiece = (width = 10) => {
	const coord = R.compose(
		R.map(R.join('')),
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
