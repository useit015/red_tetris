import React from 'react'
import {
	List,
	Button,
	Divider,
	Tooltip,
	ListItem,
	Container,
	Typography
} from '@material-ui/core'
import { identity } from 'ramda'
import GamesIcon from '@material-ui/icons/Games'
import VisibilityIcon from '@material-ui/icons/Visibility'
import BackButton from './backButton'

const gameList = ({ games, play, back, watch }) => {
	const actions = [
		{
			title: 'Play',
			disabled: identity,
			icon: <GamesIcon/>,
			handler: host => () => play(host)
		},
		{
			title: 'Watch',
			disabled: () => false,
			icon: <VisibilityIcon/>,
			handler: host => () => watch(host)
		}
	]
	return (
		<Container
			maxWidth='md'
			className='gameList__container'>
			<BackButton back={ back }/>
			<List component='nav'>
				<Typography
					variant='h3'
					className='gameList title'>
					All Games
				</Typography>
				<Divider light />
				{
					!games.length
						? <Typography
							variant='h5'
							className='gameList title'>
							Oups no games are available right now
						</Typography>
						: games.map(({ host, full }, i) =>
							<ListItem
								divider
								key={ i }>
								<Typography
									variant='h5'
									className='gameList item'>
									{ host }
								</Typography>
								<div className='gameList actions'>
									{
										actions.map((action, i) =>
											<Tooltip
												key={ i }
												title={ action.title }>
												<span className='gameList btn'>
													<Button
														color='primary'
														disabled={ action.disabled(full) }
														onClick={ action.handler(host) }>
														{ action.icon }
													</Button>
												</span>
											</Tooltip>
										)
									}
								</div>
							</ListItem>
						)
				}
			</List>
		</Container>
	)
}

export default gameList
