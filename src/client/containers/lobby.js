import { connect } from 'react-redux'
import React, { useState } from 'react'
import { identity, compose } from 'ramda'
import { serverPlay } from '../actions/server'
import GameList from '../components/gameList'
import Menu from '../components/lobbyMenu'
import Tetris from './tetris'
import Watch from './watch'
import '../styles/lobby.css'

const Lobby = ({ games, dispatch, player: { name } }) => {
	const [watch, setWatch] = useState(false)
	const [rooms, setRooms] = useState(false)
	const [gameOn, setGameOn] = useState(false)
	const [gameType, setGameType] = useState('solo')

	const initGame = compose(dispatch, serverPlay)

	const play = (type, host) => {
		initGame(type, name, host)
		setGameType(type)
		setGameOn(true)
	}

	const startWatch = host => {
		dispatch({
			type: 'server/watch',
			payload: host
		})
		setWatch(true)
	}

	const backToLobby = () => {
		setRooms(false)
		setGameOn(false)
	}

	if (watch)
		return <Watch/>

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
				back={ () => setRooms(false) }
				play={ host => play('duo', host) }
				watch={ startWatch }
			/>
		)

	return (
		<Menu
			play={ play }
			setRooms={ setRooms }
		/>
	)
}

export default connect(identity)(Lobby)
