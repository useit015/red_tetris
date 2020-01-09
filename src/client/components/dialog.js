import { compose } from 'ramda'
import React, { useState, useEffect } from 'react'
import {
	serverReplayReq,
	serverReplayRes,
} from '../actions/server'
import {
	Button,
	Dialog,
	DialogTitle,
	DialogActions
} from '@material-ui/core'

const dialog = ({ tetris, dispatch, reset, leave }) => {
	const { win, lost, askReplay, left } = tetris

	const [sent, setSent] = useState(false)

	const [open, setOpen] = useState(Boolean(win || lost))

	const respond = compose(
		reset,
		dispatch,
		serverReplayRes,
	)

	const replayReq = compose(
		reset,
		dispatch,
		serverReplayReq,
		() => setSent(true),
	)

	const title = !left
		? !askReplay
			? win
				? 'You won :D'
				: 'You lost :('
			: 'Your opponent wants to rematch'
		: 'Your opponent has left'

	const acceptBtn = {
		text: 'Accept',
		handler: respond
	}

	const replayBtn = {
		text: 'Replay',
		handler: replayReq,
		disabled: sent || left
	}

	const btn = askReplay && !left ? acceptBtn : replayBtn

	useEffect(() => {
		const isOpen = Boolean(win || lost)
		setOpen(isOpen)
		setSent(!isOpen)
	}, [win, lost])

	useEffect(() => {
		setSent(left)
	}, [left])

	return (
		<Dialog open={ open } >
			<DialogTitle>{ title }</DialogTitle>
			<DialogActions>
				<Button
					color='primary'
					onClick={ leave }>
					Back to lobby
				</Button>
				<Button
					color='primary'
					onClick={ btn.handler }
					disabled={ btn.disabled }>
					{ btn.text }
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default dialog
