import React from 'react'
import {
	Dialog,
	Button,
	DialogTitle,
	DialogActions
} from '@material-ui/core'

const watchDialog = ({ open, back }) =>
	<Dialog open={ open }>
		<DialogTitle>
			This game has ended
		</DialogTitle>
		<DialogActions>
			<Button
				color='primary'
				onClick={ back }>
				Back to lobby
			</Button>
		</DialogActions>
	</Dialog>

export default watchDialog
