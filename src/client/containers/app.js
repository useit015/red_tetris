import { identity } from 'ramda'
import { connect } from 'react-redux'
import React, { useState } from 'react'
import { Container } from '@material-ui/core'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import Alert from '../components/alert'
import Lobby from './lobby'
import Login from './login'
import '../styles/app.css'

const theme = createMuiTheme({
	palette: {
		type: 'dark',
		primary: {
			main: '#69f0ae'
		}
	}
})

const App = ({ player: { valid } }) => {
	const [errMsg, setErrMsg] = useState(false)
	return (
		<ThemeProvider theme={ theme }>
			<Alert
				isOpen={ errMsg }
				close={ () => setErrMsg(false) }
			/>
			<Container className='app'>
				{
					valid
						? <Lobby />
						: <Login setErrMsg={ setErrMsg } />
				}
			</Container>
		</ThemeProvider>
	)
}

export default connect(identity)(App)
