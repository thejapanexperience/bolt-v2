// 3rd Party Imports

// Bede Imports

// Config

// Actions
export const SET_LANGUAGE = 'SET_LANGUAGE';

// Action Creators
export function setLanguage(data) {
  return { type: SET_LANGUAGE, payload: data };
}

// Reducers
export const language = (state = 'en_GB', action) => {
  if (action.type === SET_LANGUAGE) {
    return action.payload;
  }
  return state;
};
