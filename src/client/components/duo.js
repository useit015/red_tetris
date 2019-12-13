import React from 'react'

const gamesList = (games, play) =>
	games.map(({ host, full }) => (
		<button key={host} onClick={() => play(host)} disabled={full}>
			{host}
		</button>
	))

const duo = ({ back, games, play }) => (
	<div>
		<button onClick={() => play(null)}>New Game</button>
		<div>Or join existing</div>
		{gamesList(games, play)}
		<button onClick={back}>back</button>
	</div>
)

export default duo
