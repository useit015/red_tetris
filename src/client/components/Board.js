import { stateToArr } from '../engine/state'

const cellColor = cell => {
	const colors = [
		'#FF0D72',
		'#0DC2FF',
		'#0DFF72',
		'#F538FF',
		'#FF8E0D',
		'#FFE138',
		'#3877FF'
	]
	return { background: cell === '.' ? 'transparent' : colors[cell] }
}
export const Board = ({ state }) => {
	return (
		<div className='board'>
			{stateToArr(state).map((cell, i) => (
				<div
					className={cell === '.' ? '' : 'cell'}
					key={i}
					style={cellColor(cell)}></div>
			))}
		</div>
	)
}
