// 3rd Party Imports
import { all, takeEvery, call, put } from 'redux-saga/effects'

// Bede Imports
import Api from '@bedegaming/spine-player-client-js'

// Config
import * as config from 'tlob-theme-config/config.yml'

// Actions
export const USER_WALLETS_GET = 'USER_WALLETS_GET'
export const USER_WALLETS_ERROR = 'USER_WALLETS_ERROR'
export const USER_WALLETS_SHOW = 'USER_WALLETS_SHOW'

// Action Creators
export function getUserWallets(data) {
  return { type: USER_WALLETS_GET, payload: data }
}

export function showUserWallets(transactions) {
  return { type: USER_WALLETS_SHOW, payload: transactions }
}

export function spineError(error) {
  if (error.type === 'login') {
    return { type: USER_WALLETS_ERROR, payload: error }
  }
}

// Reducers
export const userWallets = (state = [], action) => {
  if (action.type === USER_WALLETS_SHOW) {
    return action.payload
  }
  if (action.type === USER_WALLETS_ERROR) {
    return action.payload
  }
  return state
}

// Sagas
// rootSaga
export function* userWalletsSaga() {
  yield all([getUserWalletsSaga()]) // yield is like 'await'
}
export function* getUserWalletsSaga() {
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

// Spine
export function apiWallets(data) {
  Api.host(config.ajax.qa02.url.api)
  Api.site(config.ajax.qa02.headers['X-Site-Code'])
  return Api.wallets(data.playerId.sub, data.session)
}
