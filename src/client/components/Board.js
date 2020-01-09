import React from 'react'
import { flatten } from 'ramda'
import { stateToArr } from '../engine/state'
import { Typography } from '@material-ui/core'
import NextPiece from './nextPiece'

const getCellColor = (cell, opponent) => {
	const colors = [
		'#FF0D72',
		'#0DC2FF',
		'#0DFFAA',
		'#F538FF',
		'#FF8E0D',
		'#FFE138',
		'#6540EE'
	]
	return {
		background:
			cell !== '.'
				? cell <= 10
					? opponent
						? `${colors[cell]}99`
						: colors[cell]
					: `${colors[cell / 10 - 2]}40`
				: 'transparent'
	}
}

const board = ({ state, opponent, name, score }) => {
	const arr = opponent
		? flatten(state.arena)
		: stateToArr(state)

	return (
		<div className='board__container'>
			<div className='board'>
				<Typography
					variant='h4'
					className='player__name'>
					{ name }
					<span className='game__paused'>
						{ state.pause ? ' (paused)' : null }
					</span>
				</Typography>
				{
					arr.map((cell, i) => (
						<div
							key={ i }
							style={ getCellColor(cell, opponent) }
							className={ cell === '.' ? '' : 'cell' }/>
					))
				}
			</div>
			{
				opponent && !score
					? null
					: <div className='next__container'>
						<Typography
							variant='h5'
							className='player__name'>
							{ (score || [0, 0]).join(' - ') }
						</Typography>
						{
							!opponent && state.next && state.next.coord
								? <NextPiece
									piece={ state.next.coord }
									cellColor={ getCellColor }/>
								: null
						}
					</div>
			}
		</div>
	)
}

export default board

