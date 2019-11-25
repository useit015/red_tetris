import React from 'react'
import { connect } from 'react-redux'
import { Tetris } from '../components/test'

const App = () => <Tetris />

const mapStateToProps = state => {
	return {
		message: state.message,
	}
}

export default connect(
	mapStateToProps,
	null
)(App)
