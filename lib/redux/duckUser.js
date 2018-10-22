// 3rd Party Imports
import { all, takeEvery, call, put } from 'redux-saga/effects'

// Config
import { apiLogin, decodeId, apiProfile, apiWallets } from './spineApi'

// Actions
export const USER_LOG_IN = 'USER_LOG_IN'
export const USER_LOG_IN_ERROR = 'USER_LOG_IN_ERROR'
export const USER_SESSION_SHOW = 'USER_SESSION_SHOW'
export const USER_PROFILE_GET = 'USER_PROFILE_GET'
export const USER_PROFILE_ERROR = 'USER_PROFILE_ERROR'
export const USER_PROFILE_SHOW = 'USER_PROFILE_SHOW'
export const USER_WALLETS_GET = 'USER_WALLETS_GET'
export const USER_WALLETS_ERROR = 'USER_WALLETS_ERROR'
export const USER_WALLETS_SHOW = 'USER_WALLETS_SHOW'

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

export const userProfile = (state = [], action) => {
  if (action.type === USER_PROFILE_SHOW) {
    return action.payload
  }
  if (action.type === USER_PROFILE_ERROR) {
    return action.payload
  }
  return state
}

export const userWallets = (state = [], action) => {
  if (action.type === USER_WALLETS_SHOW) {
    return action.payload
  }
  if (action.type === USER_WALLETS_ERROR) {
    return action.payload
  }
  return state
}

// Action Creators
export function logInUser(data) {
  return { type: USER_LOG_IN, payload: data }
}

export function showUserSession(session) {
  return { type: USER_SESSION_SHOW, payload: session }
}

export function getUserProfile(data) {
  return { type: USER_PROFILE_GET, payload: data }
}

export function showUserProfile(profile) {
  return { type: USER_PROFILE_SHOW, payload: profile }
}

export function getUserWallets(data) {
  return { type: USER_WALLETS_GET, payload: data }
}

export function showUserWallets(transactions) {
  return { type: USER_WALLETS_SHOW, payload: transactions }
}

export function spineError(error) {
  if (error.type === 'login') {
    return { type: USER_LOG_IN_ERROR, payload: error }
  }
  if (error.type === 'transactions') {
    return { type: USER_WALLETS_ERROR, payload: error }
  }
}

// Sagas
// rootSaga
export function* userSaga() {
  yield all([userLoginSaga(), userProfileSaga(), userWalletsSaga()])
}

// userLoginSaga
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
        error: error.errors[0],
      })
    )
  }
}

// userProfileSaga
export function* userProfileSaga() {
  yield takeEvery(USER_PROFILE_GET, userProfileRequest) // takeEvery will hijack actions
}

export function* userProfileRequest(action) {
  try {
    const profile = yield call(apiProfile, {
      session: action.payload.session,
      playerId: action.payload.playerId,
    })
    yield put(showUserProfile({ profile })) // put will invoke a function
  } catch (error) {
    console.log(`There's an error!`)
    console.log(error)
    yield put(
      spineError({
        type: 'Profile',
        message: `Sorry. Can't get profile at this time...`,
        error,
      })
    )
  }
}

// userWalletsSaga
export function* userWalletsSaga() {
  yield takeEvery(USER_WALLETS_GET, userWalletsRequest) // takeEvery will hijack actions
}

export function* userWalletsRequest(action) {
  try {
    const wallets = yield call(apiWallets, {
      session: action.payload.session,
      playerId: action.payload.playerId,
    })
    yield put(showUserWallets({ wallets })) // put will invoke a function
  } catch (error) {
    console.log(`There's an error!`)
    console.log(error)
    yield put(
      spineError({
        type: 'wallets',
        message: `Sorry. Can't get wallets at this time...`,
        error,
      })
    )
  }
}
