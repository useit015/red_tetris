import { connect } from 'react-redux'
import { compose, curry, identity } from 'ramda'
import React, { useState, useEffect } from 'react'
import useEventListener from '@use-it/event-listener'
import { destroyPiece, removeLines, } from '../actions/local'
import {
	next,
	addLines,
	initState,
	handleInput
} from '../engine/state'
import {
	serverLose,
	serverGetPiece,
	serverSendLine,
	serverShareState,
} from '../actions/server'
import Board from '../components/board'
import Dialog from '../components/dialog'
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
const emptyObj = curry(eqObj)({})

const needNewPiece = (tetris, state) =>
	emptyObj(tetris.next) || eqObj(state.next.coord, tetris.next.coord)

const Tetris = ({ tetris, opponent, player, dispatch, backToLobby, type }) => {
	let timer
	const [width, height] = [10, 20]
	const [step, setStep] = useState(0)
	const [state, setState] = compose(
		useState,
		initState
	)(width, height)

	const resetState = () => {
		piece = 0
		setState(initState(width, height))
	}

	const shareState = compose(
		dispatch,
		serverShareState
	)

	const sendLine = compose(
		dispatch,
		serverSendLine
	)

	const lose = compose(
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
			const actions = { shareState, lose }
			setState(addLines(tetris.lines, actions, state))
			dispatch(removeLines())
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

	return <div className='tetris__container'>
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
}

export default connect(identity)(Tetris)
