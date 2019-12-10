import { identity } from 'ramda'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { serverPlay } from '../actions/server'
import Tetris from './tetris'
import DuoLobby from './duo'

const Lobby = ({ games, player: { player }, dispatch }) => {
	const [gameOn, setGameOn] = useState(false)
	const [duo, setDuo] = useState(false)
	const play = (type, host) => {
		dispatch(serverPlay(type, player, host))
		setGameOn(true)
	}
	return gameOn ? (
		<Tetris />
	) : duo ? (
		<DuoLobby
			back={() => setDuo(false)}
			games={games}
			play={host => play('duo', host)}
		/>
	) : (
		<div>
			<button onClick={() => play('solo')}>Solo</button>
			<div>Or </div>
			<button onClick={() => setDuo(true)}>Duo</button>
		</div>
	)
}

export default connect(identity)(Lobby)
