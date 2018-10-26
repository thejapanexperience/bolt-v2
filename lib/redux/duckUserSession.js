// 3rd Party Imports
import { all, takeEvery, call, put } from 'redux-saga/effects'

// Bede Imports
import Api from '@bedegaming/spine-player-client-js'

// Config
import * as config from 'tlob-theme-config/config.yml'

// Actions
export const USER_LOG_IN = 'USER_LOG_IN'
export const USER_LOG_IN_ERROR = 'USER_LOG_IN_ERROR'
export const USER_SESSION_SHOW = 'USER_SESSION_SHOW'

// Action Creators
export function logInUser(data) {
  return { type: USER_LOG_IN, payload: data }
}

export function showUserSession(session) {
  return { type: USER_SESSION_SHOW, payload: session }
}

export function spineError(error) {
  if (error.type === 'login') {
    return { type: USER_LOG_IN_ERROR, payload: error }
  }
}

// Reducers
export const userSession = (state = [], action) => {
  if (action.type === USER_SESSION_SHOW) {
    return action.payload
  }
  if (action.type === USER_LOG_IN_ERROR) {
    return action.payload
  }
  return state
}

// Sagas
// rootSaga
export function* userSessionSaga() {
  yield all([userLoginSaga()]) // yield is like 'await'
}
export function* userLoginSaga() {
  yield takeEvery(USER_LOG_IN, userLoginRequest) // takeEvery will hijack actions
}

export function* userLoginRequest(action) {
  try {
    const session = yield call(apiLogin, {
      username: action.payload.username,
      password: action.payload.password,
      client_id: 'bededemo',
      scope: 'spine',
      grant_type: 'password',
    })
    const playerId = decodeId(session)
    yield put(showUserSession({ session, playerId })) // put will invoke a function
  } catch (error) {
    console.log(`There's an error!`)
    console.log(error)
    yield put(
      spineError({
        type: 'login',
        message: `Sorry. Please try to log in again...`,
        error: error,
      })
    )
  }
}

// Spine
export function apiLogin(data) {
  Api.host(config.ajax.qa02.url.api)
  Api.site(config.ajax.qa02.headers['X-Site-Code'])
  return Api.login(data)
}

export function decodeId(session) {
  return JSON.parse(window.atob(session.access_token.split('.')[1]))
}
