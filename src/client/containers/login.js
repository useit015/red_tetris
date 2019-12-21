import { connect } from 'react-redux'
import { identity, compose } from 'ramda'
import { serverLogin } from '../actions/server'
import React, { useState, useEffect } from 'react'
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

	const askForLogin = compose(dispatch, serverLogin)

	useError(isInvalid, errMsg)

	return (
		<div className='login'>
			<TextField
				autoFocus
				size='small'
				label='username'
				variant='outlined'
				error={ isInvalid }
				onChange={ hook }
				onKeyPress={({ key }) =>
					key === 'Enter'
						? askForLogin(newPlayer)
						: null
				}
			/>
			<Button
				color='primary'
				variant='outlined'
				onClick={() => askForLogin(newPlayer)}>
				Enter
			</Button>
		</div>
	)
}

export default connect(identity)(Login)
