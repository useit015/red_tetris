import React, { useState } from 'react'
import { connect } from 'react-redux'
import { identity } from 'ramda'
import { login } from '../actions/server'

const errorMsg = ({ valid, player }) =>
	!valid && player.length ? (
		<span style={{ color: 'red' }}>NAME IS INVALID</span>
	) : (
		''
	)

const useform = initial => {
	const [value, setValue] = useState(initial)
	return [value, e => setValue(e.target.value)]
}

const Login = ({ player, dispatch }) => {
	const [newPlayer, hook] = useform('')
	return (
		<div>
			<label htmlFor='username'>Username</label>
			<input name='username' onChange={hook} type='text' />
			{errorMsg(player)}
			<button onClick={() => dispatch(login(newPlayer))}>Enter</button>
		</div>
	)
}

export default connect(identity)(Login)
