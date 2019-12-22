import React, { useState, useEffect, Fragment } from 'react'
import { identity } from 'ramda'
import { connect } from 'react-redux'
import Board from '../components/board'
import { makeMatrix } from '../engine/matrix'
import BackButton from '../components/backButton'

const emptyState = { arena: makeMatrix() }

const Watch = ({ opponent, watch, back }) => {
	const [state, setState] = useState(null)

	const getState = player =>
		state && state[player]
			? state[player]
			: emptyState

	useEffect(() => {
		setState({
			[watch.host]: emptyState,
			[watch.guest]: emptyState,
		})
	}, [watch.host, watch.guest])

	useEffect(() => {
		setState(state => ({
			...state,
			[opponent.name]: opponent
		}))
	}, [opponent])

	if (JSON.stringify(watch) === JSON.stringify({}))
		return <div>LOADING ...</div>

	return (
		<div>
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
		</div>

	)
}

export default connect(identity)(Watch)
