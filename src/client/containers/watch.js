import React, { useState, useEffect, Fragment } from 'react'
import { identity } from 'ramda'
import { connect } from 'react-redux'
import Board from '../components/board';

const Watch = ({ opponent, watch }) => {
	const [state, setState] = useState(null)

	useEffect(() => {
		setState({
			[watch.host]: opponent,
			[watch.guest]: opponent,
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
		<div className='tetris__container'>
			<Board
				opponent
				state={ state[watch.host] || opponent }
				name={ watch.host }/>
			{
				watch.type === 'solo'
					? null
					: <Fragment>
						<div className='next__container'/>
						<Board
							opponent
							state={ state[watch.guest] || opponent }
							name={ watch.guest }/>
					</Fragment>
			}
		</div>
	)
}

export default connect(identity)(Watch)
