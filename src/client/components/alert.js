import React from 'react'
import {
	Fab,
	Slide,
	Snackbar,
	Typography,
	SnackbarContent
} from '@material-ui/core'
import { Close } from '@material-ui/icons'

const style = {
	message: {
		color: '#fff'
	},
	content: {
		backgroundColor: '#D22F2F'
	},
	fab: {
		color: '#D22F2F',
		backgroundColor: '#fff'
	}
}

const origin = {
	vertical: 'top',
	horizontal: 'center'
}

const Message = () =>
	<Typography
		variant='subtitle2'
		style={ style.message }>
		This username is taken
	</Typography>

const Alert = ({ isOpen, close }) =>
	<Snackbar
		open={ isOpen }
		onClose={ close }
		anchorOrigin={ origin }
		autoHideDuration={ 2000 }
		TransitionComponent={ Slide }>
		<SnackbarContent
			style={ style.content }
			message={ <Message/> }
			action={
				<Fab
					size='small'
					onClick={ close }
					className='snackbar__fab'
					style={ style.fab }>
					<Close />
				</Fab>
			}
		/>
	</Snackbar>

export default Alert
