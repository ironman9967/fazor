
import { useReducer } from 'react'

import createUseContext from 'constate'

export const create = (initialState = {}) => {
	const types = []
	const actions = []
	return [

		createUseContext(() => {
			const [
				state,
				dispatch
			] = useReducer(
				(state, { type, ...action }) => {
					const { reducer } = actions[type]
					const newState = reducer(state, action)
					console.log('%c\tPREVIOUS STATE', 'color: #555555', state)
					console.log('%c\tACTION', 'color: #cc9900', { type, ...action })
					console.log('%c\tNEW STATE', 'color: #0099cc', newState)
					return { ...newState }
				},
				{ __fazor: { started: Date.now() }, ...initialState }
			)
			return [
				() => ({ ...state }),
				() => types.reduce((actionDispatch, type) => {
					actionDispatch[type] = async (...args) => {
						const result = await actions[type].handler.apply(null, args)
						if (result === void 0 || typeof result === 'object') {
							console.log(`%cDISPATCHED: %c${type} %c@${Date.now() - state.__fazor.started}ms`, 'color: #00cc00', 'color: #ff77ff', 'color: #ff9999')
							dispatch({
								type,
								...result
							})
						}
						else if (result !== false) {
							throw new Error(`action handler result must be undefined, an object to dispatch or false to abort dispatch`)
						}
					}
					return actionDispatch
				}, {})
			]
		}),
		action => {
			const typeOnly = typeof action === 'string'
			const isArray = Array.isArray(action)
			if (!isArray && !typeOnly && action.type === void 0) {
				throw new Error(`Actions must have a 'type'`)
			}
			const {
				type,
				handler = () => ({}),
				reducer = state => ({ ...state })
			} = typeOnly
				? { type: action }
				: isArray
					? { type: action[0], handler: action[1], reducer: action[2] }
					: action
			actions[type] = { handler, reducer }
			types.push(type)
		}
	]
}
