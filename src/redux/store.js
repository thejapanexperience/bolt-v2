import { createStore, compose, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'

import * as reducers from './indexReducers'
import { feedsSaga, gamesSaga, userSaga } from './indexSagas'

const rootReducer = combineReducers(reducers)

const sagaMiddleware = createSagaMiddleware()
const middleware = [sagaMiddleware]

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(...middleware),
    typeof window === 'object' &&
    typeof window.devToolsExtension !== 'undefined'
      ? window.devToolsExtension()
      : f => f
  )
)

export default store

sagaMiddleware.run(feedsSaga)
sagaMiddleware.run(gamesSaga)
sagaMiddleware.run(userSaga)
