import { CALL_API, getJSON } from 'redux-api-middleware'
import makeUuid from 'uuid/v4'
import merge from 'lodash/merge'
import { normalize } from 'normalizr'
import { ghRequestAll } from 'utils'
import parseGithubUrl from 'parse-github-url'

import {
  issue as issueSchema,
  comment as commentSchema
} from './schemas'

const defaultPayload = (action, state, res) => getJSON(res)

export const fetch = (url, { options, reducerKey, payload = defaultPayload }) => {
  const uuid = makeUuid()
  const endpoint = `https://api.github.com/${url}`

  return {
    [CALL_API]: {
      endpoint,
      ...merge({
        method: 'GET',
        headers: ({ user: { token }}) => token ? ({
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${token}`,
        }) : ({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        })
      }, options),
      types: [
        { type: [reducerKey, 'REQUEST'].join('/'), meta: { uuid } },
        { type: [reducerKey, 'SUCCESS'].join('/'), meta: { uuid }, payload },
        { type: [reducerKey, 'FAILURE'].join('/'), meta: { uuid } },
      ]
    }
  }
}

export const bootstrap = token => (dispatch, getState) => {
  dispatch(setToken(token))
  dispatch(fetch('user', { reducerKey: 'USER' }))
}

export const loadIssues = () => (dispatch, getState) => {
  const uuid = makeUuid()

  dispatch({ type: 'ENTITIES/REQUEST', meta: { uuid }})

  ghRequestAll({
    url: `search/issues?q=involves:${getState().user.data.login}`,
    headers: {
      'User-Agent': 'whatsgit',
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${getState().user.token}`,
    }
  }).then(issues => (
    dispatch({
      type: 'ENTITIES/SUCCESS',
      payload: normalize(issues, [issueSchema]),
      meta: { uuid },
    })
  ))
}

export const loadComments = issueId => (dispatch, getState) => {
  const uuid = makeUuid()
  const issue = getState().entities.issues[issueId]
  const { html_url } = issue
  const { owner, name, filepath } = parseGithubUrl(html_url)

  dispatch({ type: 'ENTITIES/REQUEST', meta: { uuid }})

  ghRequestAll({
    url: `repos/${owner}/${name}/issues/${filepath}/comments`,
    headers: {
      'User-Agent': 'whatsgit',
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${getState().user.token}`,
    },
    mapToResult: item => item
  }).then(comments => {
    const { result, entities } = normalize(comments, [commentSchema])

    entities.issues = {
      [issueId]: {
        ...issue,
        commentIds: [
          ...issue.commentIds,
          ...result
        ]
      }
    }

    return dispatch({
      type: 'ENTITIES/SUCCESS',
      payload: { result, entities },
      meta: { uuid },
    })

  })
}

const setToken = token => ({
  type: 'USER/SET_TOKEN',
  payload: token
})

export const logout = token => ({
  type: 'RESET'
})
