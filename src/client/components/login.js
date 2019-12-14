import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { identity } from 'ramda'
import { serverLogin } from '../actions/server'
import { TextField, Button } from '@material-ui/core'

// import Button from '@material-ui/core/Button'
import '../styles/login.css'

const invalid = ({ valid, player }) => Boolean(!valid && player.length)

const useform = initial => {
	const [value, setValue] = useState(initial)
	return [value, e => setValue(e.target.value)]
}

const useError = (valid, handler) =>
	useEffect(() => {
		if (valid) handler(true)
	}, [valid])

const Login = ({ player, dispatch, errMsg }) => {
	const [newPlayer, hook] = useform('')
	const isInvalid = invalid(player)
	useError(isInvalid)
	return (
		<div className='login'>
			<TextField
				error={isInvalid}
				label='username'
				onChange={hook}
				size='small'
				variant='outlined'
			/>
			<Button
				color='primary'
				onClick={() => dispatch(serverLogin(newPlayer))}
				variant='outlined'>
				<span>Enter</span>
			</Button>
		</div>
	)
}

export default connect(identity)(Login)
