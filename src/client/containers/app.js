import React from 'react'
import { identity } from 'ramda'
import { connect } from 'react-redux'
import Lobby from '../components/lobby'
import Login from '../components/login'

const App = ({ player: { valid } }) => {
	return valid ? <Lobby /> : <Login />
}

export default connect(identity)(App)
