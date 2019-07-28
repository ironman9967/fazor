# fazor

## description
a redux like state engine for react using ['useReducer'](https://reactjs.org/docs/hooks-reference.html#usereducer) hook and [constate](https://github.com/diegohaz/constate)

## installation
`npm i fazor -S`

## usage
```javascript
import React from 'react'

import { create } from 'fazor'

const myComponentInitialState = {
	i: 0,
	messages: [
		'fazors to stun',
		'faze transitions'
	]
}

const MyComponent = ({ useFaze, createAction }) => {
	const [ getState, getActions ] = useFaze()

	createAction({
		type: 'myAction',
		handler: () => {
			const { i, messages } = getState()
			return { myMessage: messages[i] }
		},
		reducer: ({ i, ...state }, { myMessage }) => ({
			...state,
			i: i === 0 ? 1 : 0,
			myMessage
		})
	})

	return (
		<button onClick={ getActions().myAction }>
			dispatch my message
		</button>
	)
}

const App = () => {
	const [ useFaze, createAction ] = create({ ...myComponentInitialState })
	return (
		<useFaze.Provider>
			<MyComponent useFaze={useFaze} createAction={createAction} />
		</useFaze.Provider>
	)
}
```
