import { flatten } from 'ramda'
import React, { Fragment } from 'react'
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

const Board = ({ state, opponent }) => {
	const arr = opponent ? flatten(state.arena) : stateToArr(state)
	return <div className='board'>{arr.map(createCell)}</div>
}

export default Board
