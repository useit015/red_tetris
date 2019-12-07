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

let socket = io('ws://0.0.0.0:3004/')
let socketIoMiddleware = createSocketIoMiddleware(socket, 'server/')

const initialState = {}

const middleware = [thunk, socketIoMiddleware]

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
