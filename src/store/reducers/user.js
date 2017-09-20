const initialState = {
  loading: false,
  error: false,
  token: null,
  data: undefined,
}

export default function user(state = initialState, action) {
  switch (action.type) {
    case 'USER/SET_TOKEN':
      return {
        ...state,
        token: action.payload,
      }

    case 'USER/REQUEST':
      return {
        ...state,
        loading: true,
        error: false,
        data: action.payload,
      }

    case 'USER/SUCCESS':
      return {
        ...state,
        loading: false,
        error: false,
        data: action.payload,
      }

    case 'USER/FAILURE':
      return {
        ...state,
        loading: false,
        error: true,
      }

    case 'RESET':
      return initialState
      break

    default:
      return state
  }
}
