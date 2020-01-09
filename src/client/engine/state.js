import {
	any,
	tap,
	prop,
	drop,
	assoc,
	flatten,
	compose,
	applySpec,
} from 'ramda'
import {
	movePiece,
	dropPiece,
	cleanArena,
	rotatePiece,
	willCollide,
	addCurrentPiece,
	addIncomingLines
} from './tetris'

import { makeMatrix, toString } from './matrix'

const full = cell => cell !== '.'

const lost = (piece, arena) =>
	!piece.pos.y && (
		any(full, arena[0]) ||
		any(full, piece.coord[0])
	)

const nextArena = ({ sendLine, lose, shareState }) => ({ arena, piece }) =>
	willCollide(arena, piece.pos.x, piece.pos.y + 1)(piece.coord)
		? compose(
			...(
				lost(piece, arena)
					? [tap(lose)]
					: [tap(shareState), cleanArena(sendLine)]
			),
			addCurrentPiece(piece)
		)(arena)
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
				coord: drop(1, coord)
			}
		})

const nextPiece = flag => state =>
	willCollide(state.arena, state.piece.pos.x, state.piece.pos.y + 1)(
		state.piece.coord
	)
		? state.piece.pos.y
			? state.next
			: shiftPiece(state)
		: flag
			? state.piece
			: movePiece(state)

const nextNext = nextPcs => state =>
	willCollide(state.arena, state.piece.pos.x, state.piece.pos.y + 1)(
		state.piece.coord
	) || JSON.stringify(state.next) === JSON.stringify({})
		? nextPcs
		: state.next

const nextState = (nextPcs, curPcs, actions, flag) =>
	applySpec({
		width: prop('width'),
		height: prop('height'),
		pause: prop('pause'),
		arena: nextArena(actions),
		piece: curPcs ? () => curPcs : nextPiece(flag),
		next: nextNext(nextPcs)
	})

const merge = state =>
	compose(
		addCurrentPiece(state.piece),
		prop('arena')
	)(state)

const dropPcs = state => assoc('piece', movePiece(state), state)

const createDropDown = () => {
	let start = Date.now()
	return state => {
		const end = Date.now()
		if (end - start > 250) {
			start = end
			return assoc('piece', dropPiece(state), state)
		}
		return state
	}
}

const dropDown = createDropDown()

const move = dir => state =>
	state.piece.pos.y
		? assoc('piece', movePiece(state, 0, dir), state)
		: state

const rotate = state =>
	state.piece.pos.y
		? assoc('piece', rotatePiece(state), state)
		: state

const togglePause = state => assoc('pause', !state.pause, state)

const mutateState = action => state => (!state.pause ? action(state) : state)

export const initState = (width = 10, height = 20) => ({
	width,
	height,
	pause: false,
	arena: makeMatrix(width, height),
	piece: {
		coord: [],
		pos: { x: 0, y: 0 }
	},
	next: {}
})

export const next = ({ next: nextPcs, piece: curPcs }, actions, flag = false) => state =>
	!state.pause
		? nextState(nextPcs, curPcs, actions, flag)(state)
		: state

export const stateToString = compose(toString, merge)

export const stateToArr = compose(flatten, merge)

export const addLines = addIncomingLines

export const handleInput = cb => ({ keyCode }) => {
	let action = null
	const keys = {
		p: 80,
		top: 38,
		left: 37,
		down: 40,
		right: 39,
		space: 32
	}
	switch (keyCode) {
		case keys.top:
			action = mutateState(rotate)
			break
		case keys.space:
			action = mutateState(dropPcs)
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
