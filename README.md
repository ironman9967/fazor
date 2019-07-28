# fazor

## installation
`npm i fazor -S`

## usage
```
import React, { useEffect } from 'react'

import { create } from 'fazor'

const MyComponent = ({ useFaze, createAction }) => {
	const [ getState, getActions ] = useFaze()

	createAction({
		type: 'myAction',
		handler: (int1, int2, int3) => {
			return { myIntArr: [ int1, int2, int3 ] }
		},
		reducer: (state, { myIntArr }) => {
			return {
				...state,
				myIntArr
			}
		}
	})

	return (
		<div>
			<button onClick={() => {
				const { myAction } = getActions()
				myAction(1, 2, 3)
			}}>go</button>
		</div>
	)
}

const App = props => {
	const [ createAction, useFaze ] = create()
	return (
		<useFaze.Provider>

		</useFaze.Provider>
	)
}
```
