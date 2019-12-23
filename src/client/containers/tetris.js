import {
	curry,
	assoc,
	compose,
	identity
} from 'ramda'
import {
	serverLeft,
	serverLose,
	serverGetPiece,
	serverSendLine,
	serverShareState,
} from '../actions/server'
import {
	destroyPiece,
	removeLines
} from '../actions/local'
import {
	next,
	addLines,
	initState,
	handleInput
} from '../engine/state'
import { connect } from 'react-redux'
import React, { useState, useEffect } from 'react'
import useEventListener from '@use-it/event-listener'
import BackDialog from '../components/backDialog'
import BackButton from '../components/backButton'
import Dialog from '../components/dialog'
import Board from '../components/board'
import update from '../engine/update'
import '../styles/board.css'

const eqObj = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const emptyObj = curry(eqObj)({})

const needNewPiece = (tetris, state) =>
	emptyObj(tetris.next) || eqObj(state.next.coord, tetris.next.coord)

const useTetrisState = compose(useState, initState)

const containerStyle = type => ({
	display: 'flex',
	flexDirection: 'column',
	paddingLeft: type === 'solo'
		? 'var(--next-width)'
		: null
})

const pauseFactory = () => {
	let prevState = false
	return {
		set: () => state => {
			prevState = state.pause
			return assoc('pause', true, state)
		},
		unset: () => assoc('pause', prevState)
	}
}

const pause = pauseFactory()

const formatScore = score => score ? score.join(' - ') : '0 - 0'

const Tetris = ({ tetris, opponent, player, dispatch, back, type }) => {
	let timer

	const [width, height] = [10, 20]

	const [step, setStep] = useState(0)

	const [pieceIndex, setPieceIndex] = useState(2)

	const [exitDialog, setExitDialog] = useState(false)

	const [state, setState] = useTetrisState(width, height)

	const nextState = compose(setState, next)

	const lose = compose(dispatch, serverLose)

	const clearState = compose(setState, initState)

	const leave = compose(dispatch, serverLeft, back)

	const sendLine = compose(dispatch, serverSendLine)

	const shareState = compose(dispatch, serverShareState)

	const nextStateWithLines = compose(setState, addLines)

	const clearIncomingLines = compose(dispatch, removeLines)

	const getPieceFromServer = compose(dispatch, serverGetPiece)

	const destroyInitialPiece = compose(dispatch, destroyPiece)

	const actions = { sendLine, lose, shareState }

	const gameIsOn = Boolean(tetris.ready && !tetris.win && !tetris.lost)

	const nextPiece = () => {
		if (!tetris.lost && needNewPiece(tetris, state)) {
			getPieceFromServer(pieceIndex)
			setPieceIndex(pieceIndex + 1)
		}
	}

	const exitGame = () => {
		setState(pause.set())
		setExitDialog(true)
	}

	const resumeGame = () => {
		setState(pause.unset())
		setExitDialog(false)
	}

	const resetState = () => {
		setPieceIndex(2)
		clearState(width, height)
	}

	const applyUserInput = action => {
		if (gameIsOn && action) {
			clearInterval(timer)
			setState(action)
			nextPiece()
		}
	}

	useEffect(() => {
		if (gameIsOn) {
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
		<div style={ containerStyle(type) }>
			<BackButton back={ exitGame }/>
			<BackDialog
				leave={ leave }
				open={ exitDialog }
				play={ resumeGame }
			/>
			<div className='tetris__container'>
				<Board
					state={ state }
					name={player.name}
					score={ formatScore(tetris.score) }/>
				{
					type === 'duo'
						? <Board
							opponent
							state={ opponent }
							name={ opponent.name }/>
						: null
				}
			</div>
			<Dialog
				leave={ leave }
				tetris={ tetris }
				reset={ resetState }
				dispatch={ dispatch }
			/>
		</div>

	)
}

export default connect(identity)(Tetris)
