const initialState = {
  loading: false,
  error: false,
  token: null,
  data: undefined,
}

export default function user(state = initialState, action) {
  switch (action.type) {
    case 'EMOJIS/REQUEST':
      return {
        ...state,
        loading: true,
        error: false,
        data: action.payload,
      }

    case 'EMOJIS/SUCCESS':
      return {
        ...state,
        loading: false,
        error: false,
        data: action.payload,
      }

    case 'EMOJIS/FAILURE':
      return {
        ...state,
        loading: false,
        error: true,
      }

    case 'RESET':
      return initialState

    default:
      return state
  }
}
