import R from 'ramda'
import React, { useState, useEffect } from 'react'
import useEventListener from '@use-it/event-listener'
import { initState, next, handleInput } from '../engine/state'
import { Board } from './Board'
import { connect } from 'react-redux'
import '../styles/board.css'

const dropInterval = 200
let [dropCounter, start] = [0, Date.now()]

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
	const [width, height] = [10, 20]
	const [step, setStep] = useState(0)
	const timer = setInterval(() => setStep(update), 50)
	const [state, setState] = R.compose(
		useState,
		initState
	)(width, height)

	useEffect(() => {
		dispatch({ type: 'server/init' })
	}, [])

	useEffect(() => {
		setTimeout(() => dispatch({ type: 'DESTROY_INITIAL_PIECE' }), 200)
	}, [tetris.piece])

	useEffect(() => {
		if (tetris && tetris.next) {
			setState(next(tetris.next, tetris.piece))
			if (needNewPiece(tetris, state)) dispatch({ type: 'server/piece' })
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

	return <Board state={state} />
}

export default connect(R.identity)(Tetris)
