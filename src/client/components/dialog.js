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
	const [open, setOpen] = useState(Boolean(win || lost))
	const respond = res => () => dispatch(serverReplayRes(res))

	useEffect(() => {
		setOpen(Boolean(win || lost))
	}, [win, lost])

	const replayReq = compose(
		reset,
		dispatch,
		serverReplayReq,
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
				handler: replayReq
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
					color='primary'>
					{ btn.text }
				</Button>
			)}
		</DialogActions>
	</Dialog>
}

export default dialog
