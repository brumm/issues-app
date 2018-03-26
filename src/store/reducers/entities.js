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

    case 'RESET':
      return initialState

    default:
      return state
  }
}
