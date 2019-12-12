import React, { useState } from 'react'
import { identity } from 'ramda'
import { connect } from 'react-redux'
import Lobby from '../components/lobby'
import Login from '../components/login'
import {
	Container,
	Snackbar,
	Slide,
	SnackbarContent,
	Fab
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import '../styles/app.css'

const App = ({ player: { valid } }) => {
	const [errMsg, setErrMsg] = useState(false)
	return (
		<div>
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
							size='small'
							className='snackbar__fab'
							onClick={() => setErrMsg(false)}>
							<Close />
						</Fab>
					}
				/>
			</Snackbar>
			<Container maxWidth='sm' className='app'>
				{valid ? <Lobby /> : <Login errMsg={setErrMsg} />}
			</Container>
		</div>
	)
}

export default connect(identity)(App)
