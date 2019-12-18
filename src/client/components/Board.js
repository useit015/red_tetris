import React from 'react'
import { flatten } from 'ramda'
import { stateToArr } from '../engine/state'
import { Typography } from '@material-ui/core'
import NextPiece from './nextPiece'

const getCellColor = cell => {
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
				? cell > 10
					? `${colors[cell / 10 - 2]}40`
					: colors[cell]
				: 'transparent'
	}
}

export default ({ state, opponent, name }) => {
	const arr = opponent ? flatten(state.arena) : stateToArr(state)

	return (
		<div className='board__container'>
			<div className='board'>
				<Typography variant='h4' className='player__name'>
					{ name }
				</Typography>
				{
					arr.map((cell, i) => (
						<div
							key={ i }
							style={ getCellColor(cell) }
							className={ cell === '.' ? '' : 'cell' } />
					))
				}
			</div>
			{
				!opponent && state.next && state.next.coord
					? <NextPiece piece={ state.next.coord } cellColor={ getCellColor }/>
					: null
			}
		</div>
	)
}

