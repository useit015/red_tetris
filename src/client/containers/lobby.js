import {
	serverOut,
	serverPlay,
	serverStartWatch,
	serverEndWatch
} from '../actions/server'
import { connect } from 'react-redux'
import React, { useState } from 'react'
import { identity, compose } from 'ramda'
import GameList from '../components/gameList'
import Menu from '../components/lobbyMenu'
import Tetris from './tetris'
import Watch from './watch'
import '../styles/lobby.css'

const Lobby = ({ games, dispatch, player: { name } }) => {
	const [rooms, setRooms] = useState(false)

	const [gameOn, setGameOn] = useState(false)

	const [watching, setWatching] = useState(false)

	const [gameType, setGameType] = useState('solo')

	const initGame = compose(dispatch, serverPlay)

	const askForWatch = compose(dispatch, serverStartWatch)

	const endWatch = compose(back, dispatch, serverEndWatch)

	const logout = compose(dispatch, serverOut)

	const play = (type, host) => {
		initGame(type, name, host)
		setGameType(type)
		setGameOn(true)
	}

	const startWatch = host => {
		askForWatch(host)
		setWatching(true)
	}

	const back = () => {
		setWatching(false)
		setRooms(false)
		setGameOn(false)
	}

	if (watching)
		return <Watch back={ endWatch }/>

	if (gameOn)
		return (
			<Tetris
				back={ back }
				type={ gameType }
			/>
		)

	if (rooms)
		return (
			<GameList
				back={ back }
				games={ games }
				watch={ startWatch }
				play={ host => play('duo', host) }
			/>
		)

	return (
		<Menu
			play={ play }
			logout={logout }
			setRooms={ setRooms }
		/>
	)
}

export default connect(identity)(Lobby)
