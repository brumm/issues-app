import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { apiMiddleware } from 'redux-api-middleware'
import thunk from 'redux-thunk'

import * as reducers from './reducers'
export * as actionCreators from './actions'

export default initialState => {
  const store = createStore(
    combineReducers(reducers),
    initialState,
    compose(
      applyMiddleware(apiMiddleware, thunk),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = combineReducers(require('./reducers').default)
      store.replaceReducer(nextRootReducer)
    })
  }

  Object.defineProperty(window, 'store', {
    get() {
      return store.getState()
    },
  })

  return store
}
