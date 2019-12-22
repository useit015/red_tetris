import React from 'react'
import { identity } from 'ramda'
import GamesIcon from '@material-ui/icons/Games'
import { Button, Tooltip } from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'

const gameListActions = ({ play, watch, game: { host, full } }) => {
	const actions = [
		{
			title: 'Play',
			disabled: identity,
			icon: <GamesIcon/>,
			handler: () => play(host)
		},
		{
			title: 'Watch',
			disabled: () => false,
			icon: <VisibilityIcon/>,
			handler: () => watch(host)
		}
	]

	return (
		<div className='gameList actions'>
			{
				actions.map((action, i) =>
					<Tooltip
						key={ i }
						title={ action.title }>
						<span className='gameList btn'>
							<Button
								color='primary'
								onClick={ action.handler }
								disabled={ action.disabled(full) }>
								{ action.icon }
							</Button>
						</span>
					</Tooltip>
				)
			}
		</div>
	)
}

export default gameListActions
