import React from 'react'
import { Button, Tooltip } from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

const backButton = ({ back }) =>
	<Tooltip title='Back to lobby'>
		<Button
			color='primary'
			onClick={ back }
			style={{ marginLeft: 'auto' }}>
			<ExitToAppIcon/>
		</Button>
	</Tooltip>

export default backButton
