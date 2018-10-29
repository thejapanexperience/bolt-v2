// 3rd Party Imports
import { all, takeEvery, call, put } from 'redux-saga/effects';

// Bede Imports
import Api from '@bedegaming/spine-player-client-js';

// Config
import * as config from 'bolt-bede-casino-v2-config/config.yml';

// Actions
export const USER_PROFILE_GET = 'USER_PROFILE_GET';
export const USER_PROFILE_ERROR = 'USER_PROFILE_ERROR';
export const USER_PROFILE_SHOW = 'USER_PROFILE_SHOW';

// Action Creators
export function getUserProfile(data) {
  return { type: USER_PROFILE_GET, payload: data };
}

export function showUserProfile(profile) {
  return { type: USER_PROFILE_SHOW, payload: profile };
}

export function spineError(error) {
  if (error.type === 'login') {
    return { type: USER_PROFILE_ERROR, payload: error };
  }
}

// Reducers
export const userProfile = (state = [], action) => {
  if (action.type === USER_PROFILE_SHOW) {
    return action.payload;
  }
  if (action.type === USER_PROFILE_ERROR) {
    return action.payload;
  }
  return state;
};

// Sagas
// rootSaga
export function* userProfileSaga() {
  yield all([getUserProfileSaga()]); // yield is like 'await'
}

export function* getUserProfileSaga() {
  yield takeEvery(USER_PROFILE_GET, userProfileRequest); // takeEvery will hijack actions
}

export function* userProfileRequest(action) {
  try {
    const profile = yield call(apiProfile, {
      session: action.payload.session,
      playerId: action.payload.playerId,
    });
    yield put(showUserProfile({ profile })); // put will invoke a function
  } catch (error) {
    console.log(`There's an error!`);
    console.log(error);
    yield put(
      spineError({
        type: 'Profile',
        message: `Sorry. Can't get profile at this time...`,
        error,
      })
    );
  }
}

// Spine
export function apiProfile(data) {
  if (data.playerId && data.playerId.sub) {
    Api.host(config.ajax.qa02.url.api);
    Api.site(config.ajax.qa02.headers['X-Site-Code']);
    return Api.profile(data.playerId.sub, data.session);
  }
}
