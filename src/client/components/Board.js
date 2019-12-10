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
	return { background: cell === '.' ? 'transparent' : colors[cell] }
}

const cellClass = cell => (cell === '.' ? '' : 'cell')

const createCell = (cell, i) => (
	<div className={cellClass(cell)} key={i} style={cellColor(cell)} />
)

export const Board = ({ state }) => (
	<div className='board'>{stateToArr(state).map(createCell)}</div>
)
