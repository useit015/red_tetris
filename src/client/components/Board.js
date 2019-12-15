import React from 'react'
import { flatten } from 'ramda'
import { stateToArr } from '../engine/state'

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

export default ({ state, opponent }) => {
	const arr = opponent ? flatten(state.arena) : stateToArr(state)
	return <div className='board'>{
		arr.map((cell, i) => (
			<div
				key={i}
				style={getCellColor(cell)}
				className={cell === '.' ? '' : 'cell'}
			/>
		))}
	</div>
}

