import { combineReducers } from 'redux'
import tetris from './tetris'
import player from './player'
import games from './games'

export default combineReducers({
	games,
	player,
	tetris
})
