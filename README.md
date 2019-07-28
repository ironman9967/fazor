# fazor

## description
a redux like state engine for react using ['useReducer'](https://reactjs.org/docs/hooks-reference.html#usereducer) hook and [constate](https://github.com/diegohaz/constate)

## installation
`npm i @fazor/fazor -S`

## usage
```javascript
import React from 'react'
import ReactDOM from 'react-dom'

import { create as createFazor } from '@fazor/fazor'

// an initial state for your component
const myComponentInitialState = {
	i: 0,
	messages: [
		'fazors to stun',
		'faze transitions'
	]
}

// your container component that will dispatch 'myAction'
const MyComponent = ({ useFaze, createAction }) => {
	// 'useFaze' will give you a method to get state and any actions you created
	const [ getState, getActions ] = useFaze()

	// 'createAction' accepts a type, an optional handler and an optional reducer
	createAction({
		// the type is the name of the execute function returned by 'getActions'
		type: 'myAction',
		// the handler will be called when the action is executed
		//  -return an object from the handler to add properties to the action
		//  -return false to abort the dispatch
		handler: () => {
			const { i, messages } = getState()
			return { myMessage: messages[i] }
		},
		// the reducer will be passed the current state and the dispatched action
		//  -the new state must be returned
		reducer: ({ i, ...state }, { myMessage }) => ({
			...state,
			i: i === 0 ? 1 : 0,
			myMessage
		})
	})

	return (
		// calling 'getActions' returns an object with all the actions you've created
		<button onClick={ getActions().myAction }>
			dispatch my action
		</button>
	)
}

const App = () => {
	// pass any initial state to 'createFazor'
	const [
		useFaze,
		createAction
	] = createFazor({ ...myComponentInitialState })
	return (
		// wrap your component in 'useFaze.Provider'
		<useFaze.Provider>
			// pass 'useFaze' and 'createAction' to containers that need
			//  state or to dispatch actions
			<MyComponent useFaze={useFaze} createAction={createAction} />
		</useFaze.Provider>
	)
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
)
```
