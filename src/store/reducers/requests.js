export default (state = [], action) => {
  if (action.type.endsWith('REQUEST')) {
    return [...state, action.meta.uuid]
  }

  if (action.type.endsWith('SUCCESS') || action.type.endsWith('FAILURE')) {
    return state.filter(uuid => uuid !== action.meta.uuid)
  }

  return state
}
