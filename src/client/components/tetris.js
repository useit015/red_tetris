import R from 'ramda'
import Board from './board'
import { connect } from 'react-redux'
import React, { useState, useEffect } from 'react'
import useEventListener from '@use-it/event-listener'
import { initState, next, handleInput, addLines } from '../engine/state'
import '../styles/board.css'

const dropInterval = 300
let [dropCounter, piece, start] = [0, 1, Date.now()]

const update = x => {
	const end = Date.now()
	const delta = end - start
	start = end
	dropCounter += delta
	if (dropCounter > dropInterval) {
		dropCounter = 0
		return x + 1
	}
	return x
}

const eqObj = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const emptyObj = R.curry(eqObj)({})

const needNewPiece = (tetris, state) =>
	emptyObj(tetris.next) || eqObj(state.next.coord, tetris.next.coord)

const Tetris = ({ tetris, dispatch }) => {
	let timer
	const [width, height] = [10, 20]
	const [step, setStep] = useState(0)
	const [lost, setLost] = useState(false)
	const [state, setState] = R.compose(
		useState,
		initState
	)(width, height)

	const sendLine = line => dispatch({ type: 'server/line', payload: line })
	const lose = () => {
		setLost(true)
		dispatch({ type: 'server/lose' })
	}

	useEffect(() => {
		if (tetris.ready && !lost && !tetris.win) {
			timer = setInterval(() => setStep(update), 50)
			setTimeout(() => dispatch({ type: 'DESTROY_INITIAL_PIECE' }), 200)
		}
		return () => clearInterval(timer)
	}, [tetris.ready, lost, tetris.win])

	useEffect(() => {
		if (tetris.lines.length) {
			setState(addLines(tetris.lines)(state))
			setTimeout(() => dispatch({ type: 'REMOVE_LINES' }), 200)
		}
	}, [tetris.lines.length])

	useEffect(() => {
		if (tetris && tetris.next) {
			setState(next(tetris, { sendLine, lose }))
			if (needNewPiece(tetris, state)) {
				++piece
				dispatch({ type: 'server/piece', payload: piece })
			}
		}
		return () => clearInterval(timer)
	}, [step])

	useEventListener(
		'keydown',
		handleInput(action => {
			if (action) {
				clearInterval(timer)
				setState(action)
			}
		})
	)

	return tetris.win ? (
		<div>You Won :D</div>
	) : lost ? (
		<div>You lost :/</div>
	) : tetris.ready ? (
		<Board state={state} />
	) : (
		<div>Loading game</div>
	)
}

export default connect(R.identity)(Tetris)
