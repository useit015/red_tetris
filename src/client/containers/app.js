import R from 'ramda'
import React, { useState } from 'react'
import Tetris from '../components/test'
import { connect } from 'react-redux'

const App = ({ games, dispatch }) => {
	const [isGame, setIsGame] = useState(false)
	const [player, setPlayer] = useState('')
	if (isGame) return <Tetris />
	const init = name => {
		dispatch({
			type: 'server/init',
			payload: { player: name ? name : player }
		})
		setIsGame(true)
	}
	return (
		<div>
			<label htmlFor='username'>Username</label>
			<input
  name='username'
  onChange={e => setPlayer(e.target.value)}
  type='text'
			/>
			<button onClick={() => init()}>Play</button>
			{games.map(host => (
				<button key={host} onClick={() => init(host)}>
					{host}
				</button>
			))}
		</div>
	)
}

export default connect(R.identity)(App)
