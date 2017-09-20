import merge from 'lodash/merge'

const initialState = {
  users: {},
  issues: {},
  labels: {},
  comments: {},
  notifications: {},
  repositories: {},
  events: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ENTITIES/SUCCESS':
      return merge({}, state, action.payload.entities)
      break

    case 'RESET':
      return initialState
      break

    default:
      return state
  }
}
