const initialState = {
  splitLayoutSizes: [200, 500, null],
}

export default function ui(state = initialState, action) {
  switch (action.type) {
    case 'UI/SET_SPLIT_LAYOUT_SIZES':
      return {
        ...state,
        splitLayoutSizes: action.payload,
      }

    case 'RESET':
      return initialState

    default:
      return state
  }
}
