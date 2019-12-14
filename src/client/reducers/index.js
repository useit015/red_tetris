import { combineReducers } from 'redux'
import tetris from './tetris'
import player from './player'
import games from './games'
import opponent from './opponent'

export default combineReducers({
	games,
	player,
	tetris,
	opponent
})
