import R from 'ramda'

import {
	addCurrentPiece,
	willCollide,
	movePiece,
	dropPiece,
	cleanArena,
	rotatePiece,
	addIncomingLines
} from './tetris'

import { makeMatrix, toString } from './matrix'

const nextArena = ({ sendLine, lose, shareState }) => ({ arena, piece }) =>
	willCollide(arena, piece.pos.x, piece.pos.y + 1)(piece.coord)
		? piece.pos.y
			? R.compose(
					R.tap(shareState),
					cleanArena(sendLine),
					addCurrentPiece(piece)
			  )(arena)
			: R.tap(lose)(arena)
		: arena

const shiftPiece = ({ arena, piece: { pos: { x, y }, coord } }) =>
	!willCollide(arena, x, y)(coord)
		? { pos: { x, y }, coord }
		: shiftPiece({
			arena,
			piece: {
				pos: {
					x,
					y: y - 1
				},
				coord: R.drop(1, coord)
			}
		})

const nextPiece = state =>
	willCollide(state.arena, state.piece.pos.x, state.piece.pos.y + 1)(
		state.piece.coord
	)
		? state.piece.pos.y
			? state.next
			: shiftPiece(state)
		: movePiece(state)

const nextNext = nextPcs => state =>
	willCollide(state.arena, state.piece.pos.x, state.piece.pos.y + 1)(
		state.piece.coord
	) || JSON.stringify(state.next) === '{}'
		? nextPcs
		: state.next

const nextState = (nextPcs, curPcs, actions) =>
	R.applySpec({
		moves: ({ moves }) => moves.slice(1),
		width: R.prop('width'),
		height: R.prop('height'),
		pause: R.prop('pause'),
		arena: nextArena(actions),
		piece: curPcs ? () => curPcs : nextPiece,
		next: nextNext(nextPcs)
	})

const merge = state =>
	R.compose(
		addCurrentPiece(state.piece),
		R.prop('arena')
	)(state)

const drop = state => R.assoc('piece', movePiece(state), state)

const dropDown = state => R.assoc('piece', dropPiece(state), state)

const move = dir => state => R.assoc('piece', movePiece(state, 0, dir), state)

const rotate = state => R.assoc('piece', rotatePiece(state), state)

const togglePause = state => R.assoc('pause', !state.pause, state)

const mutateState = action => state => (!state.pause ? action(state) : state)

export const initState = (width, height) => ({
	width,
	height,
	moves: [],
	pause: false,
	arena: makeMatrix(width, height),
	piece: {
		coord: [],
		pos: { x: 0, y: 0 }
	},
	next: {}
})

export const next = ({ next: nextPcs, piece: curPcs }, actions) => state =>
	!state.pause
		? R.pipe(
				state && state.moves && state.moves.length
					? state.moves[0]
					: R.identity,
				nextState(nextPcs, curPcs, actions)
		  )(state)
		: state

export const stateToString = R.compose(
	toString,
	merge
)

export const stateToArr = R.compose(
	R.flatten,
	merge
)

export const addLines = addIncomingLines

export const handleInput = cb => event => {
	let action = null
	const keys = {
		p: 80,
		top: 38,
		left: 37,
		down: 40,
		right: 39,
		space: 32
	}
	switch (event.keyCode) {
		case keys.top:
			action = mutateState(rotate)
			break
		case keys.space:
			action = mutateState(drop)
			break
		case keys.right:
			action = mutateState(move(1))
			break
		case keys.left:
			action = mutateState(move(-1))
			break
		case keys.down:
			action = mutateState(dropDown)
			break
		case keys.p:
			action = togglePause
			break
		default:
			action = null
			break
	}
	cb(action)
}
