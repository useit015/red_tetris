import React, { useState, useEffect } from 'react'

const nextStyles = (width, height) => ({
	width: `${40 * width}px`,
	height: `${40 * height}px`,
	maxWidth: `${4 * height}vw`,
	maxHeight: `${4 * width}vw`,
	gridTemplateRows: `repeat(${height}, 1fr)`,
	gridTemplateColumns: `repeat(${width}, 1fr)`
})

export default ({ piece, cellColor }) => {
	const [dim, setDim] = useState({ width: 0, height: 0 })

	useEffect(() => {
		setDim({
			height: piece.length,
			width: piece[0].length
		})
	}, [piece])

	return (
		<div className='next' style={ nextStyles(dim.width, dim.height) }>
			{
				piece
					? piece
						.join('')
						.split('')
						.map((cell, i) => (
							<div
								key={ i }
								style={ cellColor(cell) }
								className={ cell === '.' ? '' : 'cell' } />
						))
					: null
			}
		</div>
	)
}
