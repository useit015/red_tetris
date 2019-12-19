import React from 'react';
import {
	List,
	Divider,
	ListItem,
	Container,
	Typography
} from '@material-ui/core'

export default ({ games, play }) =>
	<Container maxWidth='sm'>
		<List component='nav'>
			<Typography
				variant='h3'
				className='gameList title'>
				All Games
			</Typography>
			<Divider light />
			{
				games.map(({ host, full }, i) =>
					<ListItem
						button
						divider
						key={ i }
						disabled={ full}
						onClick={ () => play(host) }>
						<Typography
							variant='h5'
							className='gameList item'>
							{ host }
						</Typography>
						{
							full
								? <Typography
									variant='h6'
									className='gameList flag'>
									Full
								</Typography>
								: null
						}
					</ListItem>
				)
			}
		</List>
	</Container>
