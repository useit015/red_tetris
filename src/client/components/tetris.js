import R from 'ramda'
import Board from './board'
import Replay from './replay'
import { connect } from 'react-redux'
import useEventListener from '@use-it/event-listener'
import React, { useState, useEffect, Fragment } from 'react'
import { destroyPiece, removeLines, } from '../actions/local'
import { initState, next, handleInput, addLines } from '../engine/state'
import { serverSendLine, serverShareState, serverLose, serverGetPiece } from '../actions/server'
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
	const [state, setState] = R.compose(
		useState,
		initState
	)(width, height)

	const resetState = () => {
		piece = 0
		setState(initState(width, height))
	}

	const shareState = R.compose(
		dispatch,
		serverShareState
	)

	const sendLine = R.compose(
		dispatch,
		serverSendLine
	)

	const lose = R.compose(
		dispatch,
		serverLose
	)

	useEffect(() => {
		if (tetris.ready && !tetris.lost && !tetris.win) {
			timer = setInterval(() => setStep(update), 50)
			setTimeout(() => dispatch(destroyPiece()), 200)
		}
		return () => clearInterval(timer)
	}, [tetris.ready, tetris.lost, tetris.win])

	useEffect(() => {
		if (tetris.lines.length) {
			setState(addLines(tetris.lines, lose, state))
			setTimeout(() => dispatch(removeLines()), 0)
		}
	}, [tetris.lines.length])

	useEffect(() => {
		if (tetris.next) {
			const actions = { sendLine, lose, shareState }
			setState(next(tetris, actions))
			if (needNewPiece(tetris, state))
				dispatch(serverGetPiece(++piece))
		}
		return () => clearInterval(timer)
	}, [step])

	useEffect(() => {
		if (tetris.askReplay) resetState()
	}, [tetris.askReplay])

	useEventListener(
		'keydown',
		handleInput(action => {
			if (action) {
				clearInterval(timer)
				setState(action)
			}
		})
	)

	return <Fragment>
		<Board state={state} />
		{tetris.win ? (
			<Fragment>
				<div>You Won :D</div>
				{ tetris.left ? <div>Because your opponent left</div> : <Replay
					replay={tetris.askReplay}
					dispatch={dispatch}
					reset={resetState}
				/>}
			</Fragment>
		) : tetris.lost ? (
			<Fragment>
				<div>You lost :/</div>
				<Replay
					replay={tetris.askReplay}
					dispatch={dispatch}
					reset={resetState}
				/>
			</Fragment>
		) : tetris.ready ? (
			null
		) : (
			<div>Loading game</div>
		)}
	</Fragment>
}

export default connect(R.identity)(Tetris)
