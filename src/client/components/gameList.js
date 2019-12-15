import React, { Fragment } from 'react';

export default ({ games, play }) =>
	<Fragment>
		{games.map(({ host, full }, i) => (
			<button key={i} onClick={() => play(host)} disabled={full}>
				{host}
			</button>
		))}
	</Fragment>
