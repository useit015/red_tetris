import { combineReducers } from 'redux'
import tetris from './tetris'
import player from './player'
import games from './games'
import opponent from './opponent'
import watch from './watch'

export default combineReducers({
	games,
	watch,
	tetris,
	player,
	opponent
})
