import { identity } from 'ramda'
import { connect } from 'react-redux'
import { serverPlay } from '../actions/server'
import React, { useState, Fragment } from 'react'
import Board from './board'
import Tetris from './tetris'
import DuoLobby from './duo'

const Lobby = ({ games, player: { player }, opponent, dispatch }) => {
	const [gameOn, setGameOn] = useState(false)
	const [duo, setDuo] = useState(false)
	const play = (type, host) => {
		dispatch(serverPlay(type, player, host))
		setGameOn(true)
	}
	return gameOn ? (
		<div style={{ display: 'flex' }}>
			<Tetris />
			<Board state={opponent} opponent/>
		</div>
	) : duo ? (
		<DuoLobby
			back={() => setDuo(false)}
			games={games}
			play={host => play('duo', host)}
		/>
	) : (
		<Fragment>
			<button onClick={() => play('solo')}>Solo</button>
			<div>Or </div>
			<button onClick={() => setDuo(true)}>Duo</button>
		</Fragment>
	)
}

export default connect(identity)(Lobby)
