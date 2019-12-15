import React from 'react'
import { compose } from 'ramda'
import { Button } from '@material-ui/core'
import { serverReplayReq, serverReplayRes } from '../actions/server'

export default ({ replay, dispatch, reset }) => {
	const respond = res => () => dispatch(serverReplayRes(res))
	const replayReq = compose(
		reset,
		dispatch,
		serverReplayReq,
	)
	return replay ? (
		<div>
			<h3>Opponent wants to rematch</h3>
			<Button
				onClick={respond(true)}>
				Accept
			</Button>
			<Button
				onClick={respond(false)}>
				Decline
			</Button>
		</div>
	) : (
		<Button
			onClick={replayReq}>
			Replay
		</Button>
	)
}

