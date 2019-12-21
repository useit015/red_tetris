import React from 'react'
import { Button, ButtonGroup } from '@material-ui/core'

const menu = ({ play, setRooms }) => {
	const buttons = [
		{
			text: 'Play Solo',
			handler: () => play('solo')
		},
		{
			text: 'Create Room',
			handler: () => play('duo')
		},
		{
			text: 'Join Room',
			handler: () => setRooms(true)
		},
	]

	return (
		<div className='lobby__container'>
			<ButtonGroup

				// orientation='vertical'
				variant='outlined'
				color='primary'>
				{
					buttons.map(btn =>
						<Button
							key={ btn.text }
							onClick={ btn.handler }>
							{ btn.text }
						</Button>
					)
				}
			</ButtonGroup>
		</div>
	)
}

export default menu
