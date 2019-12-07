import R from 'ramda'
import {
	rotate,
	anyMatrix,
	forEachIdx,
	copyMatrix,
	forEachMatrix
} from './matrix'

export const getCell = y => x => matrix =>
	matrix && matrix[y] && matrix[y][x] ? matrix[y][x] : null

const emptyCell = cell => cell === '.'

const emptyArenaCell = (x, y) =>
	R.compose(
		emptyCell,
		getCell(y)(x)
	)

const collision = (arena, x, y) => (cell, w, h) =>
	!emptyCell(cell) && !emptyArenaCell(w + x, h + y)(arena)

export const willCollide = (arena, x, y) => anyMatrix(collision(arena, x, y))

export const movePiece = (state, h = 1, w = 0) => ({
	coord: state.piece.coord,
	pos: {
		x: willCollide(state.arena, state.piece.pos.x + w, state.piece.pos.y)(
			state.piece.coord
		)
			? state.piece.pos.x
			: state.piece.pos.x + w,
		y: willCollide(state.arena, state.piece.pos.x, state.piece.pos.y + h)(
			state.piece.coord
		)
			? state.piece.pos.y
			: state.piece.pos.y + h
	}
})

export const dropPiece = (state, i = 1) =>
	willCollide(state.arena, state.piece.pos.x, state.piece.pos.y + i)(
		state.piece.coord
	)
		? R.assocPath(['pos', 'y'], state.piece.pos.y + i - 1, state.piece)
		: dropPiece(state, i + 1)

export const addCurrentPiece = ({ coord, pos }) => arena => {
	const matrix = copyMatrix(arena)
	const merge = ({ x, y }) => (cell, w, h) =>
		cell !== '.' && getCell(h + y)(w + x)(arena)
			? (matrix[y + h][x + w] = cell)
			: 1
	forEachMatrix(merge(pos), coord)
	return matrix
}

export const rotatePiece = state => {
	let offset = 1
	let { coord, pos } = state.piece
	const { x } = pos
	coord = rotate(coord)
	while (willCollide(state.arena, pos.x, pos.y)(coord)) {
		pos.x += offset
		offset = -(offset + (offset > 0 ? 1 : -1))
		if (offset > coord[0].length && x < coord[0].length)
			return {
				coord: rotate(coord, -1),
				pos: {
					x,
					y: pos.y
				}
			}
	}
	return {
		coord,
		pos
	}
}

const clean = (row, i) =>
	R.compose(
		R.prepend(R.map(R.always('.'), row)),
		R.remove(i, 1)
	)

export const cleanArena = arena => {
	let cleaned = copyMatrix(arena)
	const checkRow = (row, i) =>
		(cleaned = !R.any(x => x === '.', row)
			? clean(row, i)(cleaned)
			: cleaned)
	forEachIdx(checkRow, cleaned)
	return cleaned
}
