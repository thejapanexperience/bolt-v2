// 3rd Party Imports

// Bede Imports

// Config

// Actions
export const SET_MODAL = 'SET_MODAL'

// Action Creators
export function setModal(data) {
  return { type: SET_MODAL, payload: data }
}

// Reducers
export const modals = (state = [], action) => {
  if (action.type === SET_MODAL) {
    return action.payload
  }
  return state
}
