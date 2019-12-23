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

const useError = (isInvalid, player, handler) =>
	useEffect(() => {
		if (isInvalid) handler(true)
	}, [isInvalid, player])

const checkIfLoggedIn = login => {
	const player = localStorage.getItem('player')
	if (player) login(player)
}

const Login = ({ player, dispatch, setErrMsg }) => {
	const [newPlayer, hook] = useform('')

	const isInvalid = invalid(player)

	const askForLogin = compose(dispatch, serverLogin)

	useEffect(() => {
		checkIfLoggedIn(askForLogin)
	}, [])

	useError(isInvalid, player, setErrMsg)

	return (
		<div className='login'>
			<TextField
				autoFocus
				size='small'
				label='username'
				variant='outlined'
				onChange={ hook }
				error={ isInvalid }
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
