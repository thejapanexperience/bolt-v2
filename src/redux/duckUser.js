// 3rd Party Imports
import { all, takeEvery, call, put } from 'redux-saga/effects'

// Bede Imports
import Api from '@bedegaming/spine-player-client-js'

// Config
import * as config from 'tlob-theme-config/config.yml'

// Actions
export const LOG_IN_USER = 'LOG_IN_USER'
export const GET_USER_SESSION = 'GET_USER_SESSION'

// Reducers
export const userSession = (state = [], action) => {
  if (action.type === GET_USER_SESSION) {
    return action.payload
  }
  return state
}

// Action Creators
export function logInUser() {
  return { type: LOG_IN_USER }
}

export function getUserSession(session) {
  return { type: GET_USER_SESSION, payload: session }
}

export function spineError() {
  console.log('spine sadface...')
}

// Sagas
// rootSaga
export function* userSaga() {
  yield all([loginUserSaga()]) // yield is like 'await'
}

// loginUserSaga
export function* loginUserSaga() {
  yield takeEvery(LOG_IN_USER, userLoginRequest) // takeEvery will hijack actions
}

export function* userLoginRequest(action) {
  try {
    const session = yield call(apiLogin, {
      username: 'qrk2555',
      password: 'qrk-2555',
      client_id: 'bededemo',
      scope: 'spine',
      grant_type: 'password',
    })
    const playerId = decodeId(session)
    yield put(getUserSession({ session, playerId })) // put will invoke a function
  } catch (error) {
    console.log(`There's an error!`)
    console.log(error)
    yield put(spineError())
  }
}

// Support Functions
export function apiLogin(details) {
  Api.host(config.ajax.qa02.url.api)
  Api.site(config.ajax.qa02.headers['X-Site-Code'])
  return Api.login(details)
}

export function decodeId(session) {
  return JSON.parse(window.atob(session.access_token.split('.')[1]))
}
