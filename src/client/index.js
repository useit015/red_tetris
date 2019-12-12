import React from 'react'
import ReactDom from 'react-dom'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { storeStateMiddleWare } from './middleware/storeStateMiddleWare'
import App from './containers/app'
import reducer from './reducers'
import createSocketIoMiddleware from 'redux-socket.io'
import io from 'socket.io-client'

const socket = io(`ws://${window.location.hostname}:3004/`)
const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/')
const middleware = [thunk, socketIoMiddleware]
const initialState = {}

const store = createStore(
	reducer,
	initialState,
	applyMiddleware(...middleware, createLogger())
)

store.subscribe(() => {
	console.log('new client state', store.getState())
})

const Root = ({ store }) => (
	<Provider store={store}>
		<App />
	</Provider>
)

ReactDom.render(<Root store={store} />, document.getElementById('tetris'))
