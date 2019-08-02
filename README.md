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

const [ createAction, setInitialFaze ] = createFazor()

// 'createAction' accepts a type, an optional handler and an optional reducer
createAction({

	// the type is the name of the execute function returned by 'getActions'
	type: 'myAction',

	// the handler will be called when the action is executed
	//  -return an object from the handler to add properties to the action
	//  -return false to abort the dispatch
	handler: (i, messages) => ({ myMessage: messages[i] }),

	// the reducer will be passed the current state and the dispatched action
	//  -the new state must be returned
	reducer: ({ i, ...state }, { myMessage }) => ({
		...state,
		i: i === 0 ? 1 : 0,
		myMessage
	})
})

// 'setInitialFaze' accepts an object containing initial state
const getFaze = setInitialFaze({ ...myComponentInitialState })

// your container component that will dispatch 'myAction'
const MyComponent = ({ useFaze, createAction }) => {

	// 'getFaze' will give you a state and any actions you created
	const [ { i, messages }, { myAction } ] = getFaze()

	return (
		<button onClick={ () => myAction(i, messages) }>
			dispatch my action
		</button>
	)
}

const App = () => {
	// wrap your component in 'getFaze.Provider'
	return (
		<getFaze.Provider>
			<MyComponent />
		</getFaze.Provider>
	)
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
)
```
