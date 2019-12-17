import { identity } from 'ramda'
import { connect } from 'react-redux'
import { Button } from '@material-ui/core'
import { serverPlay } from '../actions/server'
import React, { useState } from 'react'
import GameList from '../components/gameList'
import Tetris from './tetris'
import '../styles/lobby.css'

const Lobby = ({ games, dispatch, player: { name } }) => {
	const [gameOn, setGameOn] = useState(false)
	const [rooms, setRooms] = useState(false)

	const play = (type, host) => {
		dispatch(serverPlay(type, name, host))
		setGameOn(true)
	}

	return gameOn ? (
		<Tetris backToLobby={ () => setGameOn(false) }/>
	) : rooms ? (
		<GameList
			games={games}
			play={host => play('duo', host)}
		/>
	) : (
		<div className='lobby__container'>
			<Button
				color='primary'
				variant='outlined'
				onClick={() => play('solo')}>
				Play solo
			</Button>
			<Button
				color='primary'
				variant='outlined'
				onClick={() => play('duo')}>
				Create Room
			</Button>
			<Button
				color='primary'
				variant='outlined'
				onClick={() => setRooms(true)}>
				Join room
			</Button>
		</div>
	)
}

export default connect(identity)(Lobby)
