import makeUuid from 'uuid/v4'
import merge from 'lodash/merge'
import { CALL_API, getJSON } from 'redux-api-middleware'

export const defaultPayload = (action, state, res) => getJSON(res)

export const fetch = (url, { options, reducerKey, payload = defaultPayload }) => {
  const uuid = makeUuid()
  const endpoint = `https://api.github.com/${url}`

  return {
    [CALL_API]: {
      endpoint,
      ...merge(
        {
          method: 'GET',
          headers: ({ user: { token } }) =>
            token
              ? {
                  'User-Agent': 'whatsgit',
                  Accept: 'application/vnd.github.v3+json',
                  Authorization: `token ${token}`,
                }
              : {
                  'User-Agent': 'whatsgit',
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
        },
        options
      ),
      types: [
        { type: `${reducerKey}/REQUEST`, meta: { uuid } },
        {
          type: `${reducerKey}/SUCCESS`,
          meta: { uuid },
          payload,
        },
        { type: `${reducerKey}/FAILURE`, meta: { uuid } },
      ],
    },
  }
}
