import { connect } from 'react-redux'
import { compose, curry, identity } from 'ramda'
import React, { useState, useEffect } from 'react'
import useEventListener from '@use-it/event-listener'
import { destroyPiece, removeLines, } from '../actions/local'
import {
	serverLose,
	serverGetPiece,
	serverSendLine,
	serverShareState,
} from '../actions/server'
import {
	next,
	addLines,
	initState,
	handleInput
} from '../engine/state'
import update from '../engine/update'
import Board from '../components/board'
import Dialog from '../components/dialog'
import '../styles/board.css'

const eqObj = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const emptyObj = curry(eqObj)({})

const needNewPiece = (tetris, state) =>
	emptyObj(tetris.next) || eqObj(state.next.coord, tetris.next.coord)

const Tetris = ({ tetris, opponent, player, dispatch, backToLobby, type }) => {
	let timer
	const [width, height] = [10, 20]
	const [step, setStep] = useState(0)
	const [piece, setPiece] = useState(2)
	const [state, setState] = compose(
		useState,
		initState
	)(width, height)

	const shareState = compose(dispatch, serverShareState)

	const sendLine = compose(dispatch, serverSendLine)

	const lose = compose(dispatch, serverLose)

	const clearState = compose(setState, initState)

	const nextState = compose(setState, next)

	const nextStateWithLines = compose(setState, addLines)

	const clearIncomingLines = compose(dispatch, removeLines)

	const getPieceFromServer = compose(dispatch, serverGetPiece)

	const destroyInitialPiece = compose(dispatch, destroyPiece)

	const actions = { sendLine, lose, shareState }

	const resetState = () => {
		setPiece(2)
		clearState(width, height)
	}

	useEffect(() => {
		if (tetris.ready && !tetris.lost && !tetris.win) {
			timer = setInterval(() => setStep(update), 50)
			setTimeout(destroyInitialPiece, 200)
		}
		return () => clearInterval(timer)
	}, [tetris.ready, tetris.lost, tetris.win])

	useEffect(() => {
		if (tetris.lines.length) {
			nextStateWithLines(tetris.lines, actions, state)
			clearIncomingLines()
		}
	}, [tetris.lines.length])

	useEffect(() => {
		if (tetris.next) {
			nextState(tetris, actions)
			if (!tetris.lost && needNewPiece(tetris, state)) {
				getPieceFromServer(piece)
				setPiece(piece + 1)
			}
		}
		return () => clearInterval(timer)
	}, [step])

	useEventListener(
		'keydown',
		handleInput(newState => {
			if (newState) {
				clearInterval(timer)
				setState(newState)
			}
		})
	)

	return (
		<div className='tetris__container'>
			<Board state={ state } name={player.name}/>
			{
				type === 'duo'
					? <Board
						opponent
						state={ opponent }
						name={ opponent.name }/>
					: null
			}
			<Dialog
				tetris={ tetris }
				reset={ resetState }
				dispatch={ dispatch }
				backToLobby={ backToLobby }
			/>
		</div>
	)
}

export default connect(identity)(Tetris)
