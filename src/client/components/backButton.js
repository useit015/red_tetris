import React from 'react'
import { Button, Tooltip } from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

const style = {
	btn: {
		marginLeft: 'auto'
	},
	icon: {
		transform: 'scale(1.25)'
	}
}

const backButton = ({ back }) =>
	<Tooltip title='Back to lobby'>
		<Button
			size='large'
			color='primary'
			onClick={ back }
			style={ style.btn }>
			<ExitToAppIcon style={ style.icon }/>
		</Button>
	</Tooltip>

export default backButton
