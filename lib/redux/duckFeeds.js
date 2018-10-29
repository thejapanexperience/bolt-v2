// 3rd Party Imports
import axios from 'axios';
import { all, takeEvery, call, put } from 'redux-saga/effects';

// Bede Imports

// Config
import * as config from 'bolt-bede-casino-v2-config/config.yml';

// Actions
export const GET_WINNERS_FEED = 'GET_WINNERS_FEED';
export const SHOW_WINNERS_FEED = 'SHOW_WINNERS_FEED';

// Reducers
export const winnersFeed = (state = [], action) => {
  if (action.type === SHOW_WINNERS_FEED) {
    return action.payload;
  }
  return state;
};

// Action Creators
export function getFeeds() {
  return { type: GET_WINNERS_FEED };
}

export function showFeeds(feeds) {
  return { type: SHOW_WINNERS_FEED, payload: feeds };
}

export function axiosError() {
  console.log('sadface...');
}

// Sagas
// rootSaga
export function* feedsSaga() {
  yield all([getWinnersFeedSaga()]); // yield is like 'await'
}

// getWinnersFeedSaga
export function* getWinnersFeedSaga() {
  yield takeEvery(GET_WINNERS_FEED, getWinnersFeedsRequest); // takeEvery will hijack actions
}

export function* getWinnersFeedsRequest(action) {
  try {
    const response = yield call(axios, {
      method: 'get',
      url: config.ajax.qa02.url.feeds,
      headers: {
        'X-Correlation-Token': config.ajax.qa02.headers['X-Correlation-Token'].feeds,
        'X-Site-Code': config.ajax.qa02.headers['X-Site-Code'],
        'X-Spine-Client': config.ajax.qa02.headers['X-Spine-Client'],
      },
    });
    const feeds = response.data;
    yield put(showFeeds(feeds)); // put will invoke a function
  } catch (error) {
    console.log(`There's an error!`);
    console.log(error);
    yield put(axiosError());
  }
}
