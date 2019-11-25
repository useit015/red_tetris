import React, { useState, useEffect } from 'react'
import useEventListener from '@use-it/event-listener'
import * as R from 'ramda'
import { initState, next, handleInput } from '../engine/state'
import '../styles/board.css'
import { Board } from './Board'

let [dropInterval, dropCounter, start] = [250, 0, Date.now()]

const update = setX =>
	setTimeout(
		() =>
			setX(x => {
				const end = Date.now()
				const delta = end - start
				start = end
				dropCounter += delta
				if (dropCounter > dropInterval) {
					dropCounter = 0
					return x + 1
				}
				return x
			}),
		300
	)

export const Tetris = () => {
	const [state, nextState] = R.compose(
		useState,
		initState
	)(10, 20)
	const [x, setX] = useState(0)
	const timer = update(setX)
	useEffect(() => {
		nextState(next)
		return () => clearTimeout(timer)
	}, [x])
	useEventListener(
		'keydown',
		handleInput(state => {
			clearTimeout(timer)
			nextState(state)
		})
	)
	return <Board state={state} />
}
