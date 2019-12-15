import { identity } from 'ramda'
import { connect } from 'react-redux'
import { Button } from '@material-ui/core'
import { serverPlay } from '../actions/server'
import React, { useState, Fragment } from 'react'
import GameList from '../components/gameList'
import Board from '../components/board'
import Tetris from './tetris'
import '../styles/lobby.css'

const Lobby = ({ games, opponent, dispatch, player: { player } }) => {
	const [gameOn, setGameOn] = useState(false)
	const [rooms, setRooms] = useState(false)

	const play = (type, host) => {
		dispatch(serverPlay(type, player, host))
		setGameOn(true)
	}

	return gameOn ? (
		<div className='tetris__container'>
			<Tetris />
			<Board state={opponent} opponent/>
		</div>
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
				Create Game
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
