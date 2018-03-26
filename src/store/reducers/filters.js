import makeUuid from 'uuid/v4'
import { enableBatching } from 'redux-batched-actions'

const initialState = {
  [makeUuid()]: {
    name: 'All Issues & PRs',
    category: 'all',
    query: { id: { $exists: true } },
    result: null,
  },
}

export default enableBatching((state = initialState, action) => {
  switch (action.type) {
    case 'FILTERS/CREATE':
      return {
        ...state,
        [action.payload.id]: action.payload,
      }

    case 'FILTERS/UPDATE_RESULT':
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          result: action.payload.result,
        },
      }

    case 'RESET':
      return initialState

    default:
      return state
  }
})
