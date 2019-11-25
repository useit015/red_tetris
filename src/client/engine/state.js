import * as R from 'ramda'

import {
	addCurrentPiece,
	willCollide,
	movePiece,
	sweepArena,
	rotatePiece,
} from './tetris'

import { makeMatrix, toString } from './matrix'

import { getRandomPiece } from './piece'

export const initState = (width, height) => ({
	width,
	height,
	moves: [],
	arena: makeMatrix(width, height),
	piece: getRandomPiece(width),
})

const nextArena = ({ arena, piece, width, height }) =>
	willCollide(arena, piece.pos.x, piece.pos.y + 1)(piece.coord)
		? piece.pos.y
			? R.compose(
					sweepArena,
					addCurrentPiece(piece)
			  )(arena)
			: makeMatrix(width, height)
		: arena

const nextPiece = state =>
	willCollide(state.arena, state.piece.pos.x, state.piece.pos.y + 1)(
		state.piece.coord
	)
		? getRandomPiece(state.width)
		: movePiece()(state)

const nextState = R.applySpec({
	moves: () => [],
	width: R.prop('width'),
	height: R.prop('height'),
	arena: nextArena,
	piece: nextPiece,
})

export const next = state =>
	R.pipe(
		...state.moves,
		nextState
	)(state)

export const stateToString = state =>
	R.compose(
		toString,
		addCurrentPiece(state.piece),
		R.prop('arena')
	)(state)

export const stateToArr = state =>
	R.compose(
		R.flatten,
		addCurrentPiece(state.piece),
		R.prop('arena')
	)(state)

const updatePiece = f =>
	R.applySpec({
		moves: R.prop('moves'),
		width: R.prop('width'),
		height: R.prop('height'),
		arena: R.prop('arena'),
		piece: f,
	})

const drop = state => updatePiece(movePiece())(state)

const move = dir => state => updatePiece(movePiece(0, dir))(state)

const rotate = state => updatePiece(rotatePiece)(state)

export const handleInput = cb => ({ keyCode }) => {
	const ms = {
		'32': rotate,
		'40': drop,
		'39': move(1),
		'37': move(-1),
	}
	if ([32, 40, 39, 37].find(x => x == keyCode)) {
		cb(state => ({
			...state,
			moves: [...state.moves, ms[keyCode]],
		}))
	}
}
