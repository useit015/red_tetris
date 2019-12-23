import React, { useState, useEffect, Fragment } from 'react'
import { identity } from 'ramda'
import { connect } from 'react-redux'
import Board from '../components/board'
import { makeMatrix } from '../engine/matrix'
import { Typography } from '@material-ui/core'
import BackButton from '../components/backButton'
import WatchDialog from '../components/watchDialog'

const emptyState = { arena: makeMatrix() }

const getState = (cache, name) =>
	cache && name && cache[name]
		? cache[name]
		: emptyState

const useInitState = ({ host, guest, cache }, setState) =>
	useEffect(() => {
		setState({
			[host]: getState(cache, host),
			[guest]: getState(cache, guest),
		})
	}, [host, guest, cache])

const useUpdateState = (opponent, setState) =>
	useEffect(() => {
		setState(state => ({
			...state,
			[opponent.name]: opponent
		}))
	}, [opponent])

const Watch = ({ opponent, watch, back }) => {
	const [state, setState] = useState(null)

	const getState = player =>
		state && state[player]
			? state[player]
			: emptyState

	useInitState(watch, setState)

	useUpdateState(opponent, setState)

	if (JSON.stringify(watch) === JSON.stringify({}))
		return (
			<Typography
				variant='h4'
				className='player__name'>
				Loading ...
			</Typography>
		)

	return (
		<div className='watch__container'>
			<BackButton back={ () => back(watch.host) }/>
			<div className='tetris__container'>
				<Board
					opponent
					name={ watch.host }
					state={ getState(watch.host) }
				/>
				{
					watch.type === 'solo'
						? null
						: <Fragment>
							<div className='next__container'/>
							<Board
								opponent
								name={ watch.guest }
								state={ getState(watch.guest) }
							/>
						</Fragment>
				}
			</div>
			<WatchDialog
				back={ () => back(null) }
				open={ Boolean(watch.gameOver) }
			/>
		</div>

	)
}

export default connect(identity)(Watch)
