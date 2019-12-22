import React from 'react'
import {
	Button,
	Dialog,
	DialogTitle,
	DialogActions
} from '@material-ui/core'

const backDialog = ({ open, leave, play }) =>
		<Dialog open={ open }>
			<DialogTitle>
				If you leave you current progress will be lost
			</DialogTitle>
			<DialogActions>
				<Button
					color='primary'
					onClick={ leave }>
					Back to lobby
				</Button>
				<Button
					color='primary'
					onClick={ play }>
					Continue
				</Button>
			</DialogActions>
		</Dialog>

export default backDialog
