import React from 'react'
import {
	List,
	Chip,
	Divider,
	ListItem,
	Container,
	Typography
} from '@material-ui/core'
import BackButton from './backButton'
import GameListActions from './gameListActions'

const gameList = ({ games, play, back, watch }) =>
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
						: games.map((game, i) =>
							<ListItem
								divider
								key={ i }>
								<div className='gameList item'>
									<Typography
										variant='h5'
										className='gameList'>
										{ game.host }
									</Typography>
									<Chip
										size='small'
										color='primary'
										variant='outlined'
										className='gameList chip'
										label={ game.type }
									/>
								</div>
								<GameListActions
									play={ play }
									game={ game }
									watch={ watch }
								/>
							</ListItem>
						)
				}
			</List>
		</Container>

export default gameList
