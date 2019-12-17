import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { identity } from 'ramda'
import { serverLogin } from '../actions/server'
import { TextField, Button } from '@material-ui/core'
import '../styles/login.css'

const invalid = ({ valid, name }) => Boolean(!valid && name.length)

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
	useError(isInvalid, errMsg)
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
				variant='outlined'
				onClick={() => dispatch(serverLogin(newPlayer))}>
				Enter
			</Button>
		</div>
	)
}

export default connect(identity)(Login)
