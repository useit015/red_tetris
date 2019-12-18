import { compose } from 'ramda'
import { serverReplayReq, serverReplayRes } from '../actions/server'
import React, { useState, useEffect } from 'react'
import {
	Button,
	Dialog,
	DialogActions,
	DialogTitle
} from '@material-ui/core'

const dialog = ({ tetris: { win, lost, askReplay }, dispatch, reset, backToLobby }) => {
	const [sent, setSent] = useState(false)
	const [open, setOpen] = useState(Boolean(win || lost))
	const respond = res => () => dispatch(serverReplayRes(res))

	useEffect(() => {
		const isOpen = Boolean(win || lost)
		setOpen(isOpen)
		setSent(!isOpen)
	}, [win, lost])

	const replayReq = compose(
		reset,
		dispatch,
		serverReplayReq,
		() => setSent(true),
	)

	const title = !askReplay
		? win
			? 'You won :D'
			: 'You lost :('
		: 'Opponent wants to rematch'

	const buttons = askReplay
		? [
			{
				text: 'Accept',
				handler: respond(true)
			},
			{
				text: 'Decline',
				handler: respond(false)
			}
		] : [
			{
				text: 'Replay',
				handler: replayReq,
				disabled: sent
			}
		]

	return <Dialog open={ open } >
		<DialogTitle>{ title }</DialogTitle>
		<DialogActions>
			<Button onClick={ backToLobby } color='primary'>
				Back to lobby
			</Button>
			{buttons.map(btn =>
				<Button
					key={ btn.text }
					onClick={ btn.handler }
					disabled={ btn.disabled }
					color='primary'>
					{ btn.text }
				</Button>
			)}
		</DialogActions>
	</Dialog>
}

export default dialog
