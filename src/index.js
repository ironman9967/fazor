
import { useReducer } from 'react'

import queue from 'async/queue'

import createUseContext from 'constate'

const green = 'color: #00cc00'
const purple = 'color: #ff77ff'
const pink = 'color: #ff4477'
const yellow = 'color: #ffff00'
const orange = 'color: #ffbb22'
const gray = 'color: #555555'
const blue = 'color: #0099cc'

const log = console.log

const logDispatchMessage = (type, {
	__fazor: { started }
}, ignored, dispatchColor, message) => {
	const logArgs = [
		`%cDISPATCH${ignored ? ' IGNORED' : 'ED'}:`
				+ ` %c${type}`
				+ ` %c@${Date.now() - started}ms`
				+ `${message ? ` %c- %c${message}` : ''}`,
			dispatchColor,
			purple,
			pink
	]
	if (message !== void 0) {
		logArgs.push(gray)
		logArgs.push(yellow)
	}
	log.apply(null, logArgs)
}

const createQueue = () => {
	log('createQueue called')
	const q = queue(({
		actions,
		type,
		args,
		state,
		dispatch
	}, cb) => {
		log('push to queue', {
			actions,
			type,
			args,
			state,
			dispatch
		})
		new Promise((resolve, reject) => {
			try {
				resolve(actions[type].handler.apply(null, args))
			} catch (e) {
				reject(e)
			}
		}).then(result => {
			log('handler result', result)
			if (result === void 0 || typeof result === 'object') {
				logDispatchMessage(type, state, false, green)
				dispatch({ type, ...result })
			}
			else if (result !== false) {
				throw new Error(`action handler result must be undefined`
					+ `, an object to dispatch or false to abort dispatch`)
			}
			else {
				logDispatchMessage(type, state, true, yellow, 'handler returned false')
			}
			cb(result)
		})
	})
	return [
		item => new Promise((resolve, reject) => {
			log('pushing to queue', item)
			q.push(item, result => {
				log('queue task result', result)
				if (result instanceof Error) {
					reject(result)
				}
				else {
					resolve(result)
				}
			})
		})
	]
}

const createActionCreator = (types, actions) => {
	log('creating action creator', { types, actions })
	return (...args) => {
		log('create action', args)
		const isFirstArgString = args[0] !== void 0 && typeof args[0] === 'string'
		const isArray = Array.isArray(args[0]) && args[0].length > 0
		const typeOnly = isFirstArgString && args.length === 1
		const isArgs = isFirstArgString && args.length > 1
		const {
			type,
			handler = () => ({}),
			reducer = state => ({ ...state })
		} = typeOnly
			? { type: args[0] }
			: isArray
				? { type: args[0][0], handler: args[0][1], reducer: args[0][2] }
				: isArgs
					? { type: args[0], handler: args[1], reducer: args[2] }
					: args[0]
		if (type === void 0) {
			throw new Error(`you must pass createAction `
				+ `an object, an array or arguments containing `
				+ `'type', 'handler' and 'reducer' - `
				+ `received ${args}`)
		}
		if (actions[type] === void 0) {
			types.push(type)
		}
		actions[type] = { handler, reducer }
		log('action created', { type, handler, reducer })
	}
}

export const create = () => {
	log('creating fazor')

	const types = []
	const actions = []

	const [ queueDispatch ] = createQueue()

	const createAction = createActionCreator(types, actions)

	return [
		createAction,
		clientInitialState => createUseContext(() => {
			const initialState = { __fazor: { started: Date.now() }, ...clientInitialState }
			log('using context', { initialState })
			const [
				state,
				dispatch
			] = useReducer(
				(state, { type, ...action }) => {
					const { reducer } = actions[type]
					const newState = reducer(state, action)
					log('%c\tPREVIOUS STATE', gray, state)
					log('%c\tACTION', orange, { type, ...action })
					log('%c\tNEW STATE', blue, newState)
					return { ...newState }
				},
				initialState
			)
			return [
				({ ...state }),
				types.reduce((actionDispatches, type) => {
					actionDispatches[type] = async (...args) => {
						const actionDispatchCall = {
							actions,
							type,
							args,
							state,
							dispatch
						}
						log('action dispatch called', actionDispatchCall)
						return await queueDispatch(actionDispatchCall)
					}
					return actionDispatches
				}, {})
			]
		})
	]
}
