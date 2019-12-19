import { identity } from 'ramda'
import { connect } from 'react-redux'
import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import { serverPlay } from '../actions/server'
import GameList from '../components/gameList'
import Tetris from './tetris'
import '../styles/lobby.css'

const Lobby = ({ games, dispatch, player: { name } }) => {
	const [rooms, setRooms] = useState(false)
	const [gameOn, setGameOn] = useState(false)
	const [gameType, setGameType] = useState('solo')

	const play = (type, host) => {
		dispatch(serverPlay(type, name, host))
		setGameType(type)
		setGameOn(true)
	}

	const backToLobby = () => {
		setRooms(false)
		setGameOn(false)
	}

	if (gameOn)
		return (
			<Tetris
				type={ gameType }
				backToLobby={ backToLobby }
			/>
		)

	if (rooms)
		return (
			<GameList
				games={ games }
				play={ host => play('duo', host) }
			/>
		)

	return (
		<div className='lobby__container'>
			<Button
				color='primary'
				variant='outlined'
				onClick={ () => play('solo') }>
				Play solo
			</Button>
			<Button
				color='primary'
				variant='outlined'
				onClick={ () => play('duo') }>
				Create Room
			</Button>
			<Button
				color='primary'
				variant='outlined'
				onClick={ () => setRooms(true) }>
				Join room
			</Button>
		</div>
	)
}

export default connect(identity)(Lobby)
