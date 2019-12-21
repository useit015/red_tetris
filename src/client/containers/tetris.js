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
	const [pieceIndex, setPieceIndex] = useState(2)
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

	const nextPiece = () => {
		if (!tetris.lost && needNewPiece(tetris, state)) {
			getPieceFromServer(pieceIndex)
			setPieceIndex(pieceIndex + 1)
		}
	}

	const resetState = () => {
		setPieceIndex(2)
		clearState(width, height)
	}

	const applyUserInput = action => {
		if (tetris.ready && !tetris.win && !tetris.lost && action) {
			clearInterval(timer)
			setState(
				compose(
					next(tetris, actions, true),
					action
				)
			)
			nextPiece()
		}
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
			nextPiece()
		}
		return () => clearInterval(timer)
	}, [step])

	useEventListener(
		'keydown',
		handleInput(applyUserInput)
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
