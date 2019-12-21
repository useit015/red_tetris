import { compose } from 'ramda'
import React, { useState, useEffect } from 'react'
import {
	serverReplayReq,
	serverReplayRes,
	serverLeft
} from '../actions/server'
import {
	Button,
	Dialog,
	DialogActions,
	DialogTitle
} from '@material-ui/core'

const dialog = ({ tetris, dispatch, reset, backToLobby }) => {
	const { win, lost, askReplay } = tetris
	const [sent, setSent] = useState(false)
	const [open, setOpen] = useState(Boolean(win || lost))

	const leave = compose(
		dispatch,
		serverLeft,
		backToLobby
	)

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

	const title = !tetris.left
		? !askReplay
			? win
				? 'You won :D'
				: 'You lost :('
			: 'Your opponent wants to rematch'
		: 'Your opponent has left'

	const button = askReplay
		? {
			text: 'Accept',
			handler: respond
		} : {
			text: 'Replay',
			handler: replayReq,
			disabled: sent
		}

	useEffect(() => {
		const isOpen = Boolean(win || lost)
		setOpen(isOpen)
		setSent(!isOpen)
	}, [win, lost])

	useEffect(() => {
		setSent(tetris.left)
	}, [tetris.left])

	return (
		<Dialog open={ open } >
			<DialogTitle>{ title }</DialogTitle>
			<DialogActions>
				<Button onClick={ leave } color='primary'>
					Back to lobby
				</Button>
				<Button
					key={ button.text }
					onClick={ button.handler }
					disabled={ button.disabled }
					color='primary'>
					{ button.text }
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default dialog
