import { identity } from 'ramda'
import { connect } from 'react-redux'
import React, { useState } from 'react'
import { Close } from '@material-ui/icons'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import {
	Container,
	Snackbar,
	Slide,
	SnackbarContent,
	Fab
} from '@material-ui/core'
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
		<ThemeProvider theme={theme}>
			<Snackbar
				open={errMsg}
				TransitionComponent={Slide}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				ContentProps={{ 'aria-describedby': 'message-id' }}
				autoHideDuration={2000}
				onClose={() => setErrMsg(false)}>
				<SnackbarContent
					style={{
						backgroundColor: '#D22F2F'
					}}
					message={<span>This username is taken</span>}
					action={
						<Fab
							style={{
								color: '#D22F2F',
								backgroundColor: '#fff'
							}}
							onClick={() => setErrMsg(false)}
							className='snackbar__fab'
							size='small'
							>
							<Close />
						</Fab>
					}
				/>
			</Snackbar>
			<Container className='app'>
				{valid ? <Lobby /> : <Login errMsg={setErrMsg} />}
			</Container>
		</ThemeProvider>
	)
}

export default connect(identity)(App)
