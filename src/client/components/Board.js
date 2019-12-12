import React from 'react'
import { stateToArr } from '../engine/state'

const cellColor = cell => {
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

const cellClass = cell => (cell === '.' ? '' : 'cell')

const createCell = (cell, i) => (
	<div className={cellClass(cell)} key={i} style={cellColor(cell)} />
)

const getObj = o => {
	if (o) return JSON.stringify(o.join('').split(''), null, 4)
}

const Board = ({ state }) => (
	<div>
		<div className='board'>{stateToArr(state).map(createCell)}</div>
		<div className='next'>{getObj(state.next.coord)}</div>
	</div>
)

export default Board
