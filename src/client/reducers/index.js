import { combineReducers } from 'redux'
import tetris from './tetris'
import games from './games'

export default combineReducers({
	games,
	tetris
})
