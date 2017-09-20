import { CALL_API, getJSON } from 'redux-api-middleware'
import makeUuid from 'uuid/v4'
import merge from 'lodash/merge'
import { normalize } from 'normalizr'
import { filterObject, ghRequestAll } from 'utils'
import parseGithubUrl from 'parse-github-url'
import qry from 'qry'
import { mapObject } from 'utils'
import { batchActions } from 'redux-batched-actions'

import {
  issue as issueSchema,
  comment as commentSchema,
  notification as notificationSchema,
  event as eventSchema,
} from './schemas'

const defaultPayload = (action, state, res) => getJSON(res)

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
                  Accept: 'application/vnd.github.v3+json',
                  Authorization: `token ${token}`,
                }
              : {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
        },
        options
      ),
      types: [
        { type: [reducerKey, 'REQUEST'].join('/'), meta: { uuid } },
        { type: [reducerKey, 'SUCCESS'].join('/'), meta: { uuid }, payload },
        { type: [reducerKey, 'FAILURE'].join('/'), meta: { uuid } },
      ],
    },
  }
}

export const loadNotifications = () => (dispatch, getState) => {
  dispatch(
    fetch('notifications?all=true', {
      reducerKey: 'ENTITIES',
      payload: (...args) =>
        defaultPayload(...args).then(notifications =>
          normalize(notifications, [notificationSchema])
        ),
    })
  )
}

export const bootstrap = token => (dispatch, getState) => {
  dispatch(setToken(token))

  dispatch(fetch('user', { reducerKey: 'USER' })).then(({ payload: { id, login } }) => {
    dispatch(refresh())

    dispatch(
      createFilter({
        category: 'filter',
        name: 'Open Issues',
        query: { state: 'open', pull_request: { $exists: false } },
      })
    )
    dispatch(
      createFilter({
        category: 'filter',
        name: 'Open PRs',
        query: { state: 'open', pull_request: { $exists: true } },
      })
    )
    dispatch(
      createFilter({
        category: 'filter',
        name: 'Assigned to me',
        query: { assignees: id },
      })
    )
    dispatch(
      createFilter({
        category: 'filter',
        name: 'Created by me',
        query: { user: id },
      })
    )
    dispatch(
      createFilter({
        category: 'filter',
        name: 'Participating',
        query: { $nor: [{ user: id }, { assignees: id }] },
      })
    )
  })
}

export const refresh = () => (dispatch, getState) => {
  dispatch(loadIssues()).then(({ payload: { entities: { repositories, issues } } }) =>
    dispatch(
      batchActions(
        mapObject(repositories, name =>
          createFilter({
            name,
            category: 'repo',
            query: { repository: name },
            result: createFilterResult(issues, { repository: name }),
          })
        )
      )
    )
  )
  dispatch(loadNotifications())
}

export const loadIssues = () => (dispatch, getState) => {
  const uuid = makeUuid()

  dispatch({ type: 'ENTITIES/REQUEST', meta: { uuid } })

  return ghRequestAll({
    url: `search/issues?q=involves:${getState().user.data.login}`,
    headers: {
      'User-Agent': 'whatsgit',
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${getState().user.token}`,
    },
  })
    .then(issues =>
      dispatch({
        type: 'ENTITIES/SUCCESS',
        payload: normalize(issues, [issueSchema]),
        meta: { uuid },
      })
    )
    .catch(e =>
      dispatch({
        type: 'ENTITIES/FAILURE',
        payload: e,
        meta: { uuid },
      })
    )
}

export const loadComments = issueId => (dispatch, getState) => {
  const uuid = makeUuid()
  const issue = getState().entities.issues[issueId]
  const { html_url } = issue
  const { owner, name, filepath } = parseGithubUrl(html_url)

  dispatch({ type: 'ENTITIES/REQUEST', meta: { uuid } })

  ghRequestAll({
    url: `repos/${owner}/${name}/issues/${filepath}/comments`,
    headers: {
      'User-Agent': 'whatsgit',
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${getState().user.token}`,
    },
    mapToResult: item => item,
  })
    .then(comments => {
      const { result, entities } = normalize(comments, [commentSchema])

      entities.issues = {
        [issueId]: {
          ...issue,
          commentIds: result,
        },
      }

      return dispatch({
        type: 'ENTITIES/SUCCESS',
        payload: { result, entities },
        meta: { uuid },
      })
    })
    .catch(e =>
      dispatch({
        type: 'ENTITIES/FAILURE',
        payload: e,
        meta: { uuid },
      })
    )
}

export const loadIssueEvents = issueId => (dispatch, getState) => {
  const uuid = makeUuid()
  const issue = getState().entities.issues[issueId]
  const { html_url } = issue
  const { owner, name, filepath: number } = parseGithubUrl(html_url)

  dispatch({ type: 'ENTITIES/REQUEST', meta: { uuid } })

  ghRequestAll({
    url: `repos/${owner}/${name}/issues/${number}/events`,
    headers: {
      'User-Agent': 'whatsgit',
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${getState().user.token}`,
    },
    mapToResult: item => item,
  })
    .then(events => {
      const { result, entities } = normalize(events, [eventSchema])

      entities.issues = {
        [issueId]: {
          ...issue,
          eventIds: result,
        },
      }

      return dispatch({
        type: 'ENTITIES/SUCCESS',
        payload: { result, entities },
        meta: { uuid },
      })
    })
    .catch(e =>
      dispatch({
        type: 'ENTITIES/FAILURE',
        payload: e,
        meta: { uuid },
      })
    )
}

const setToken = token => ({
  type: 'USER/SET_TOKEN',
  payload: token,
})

export const createFilter = filter => ({
  type: 'FILTERS/CREATE',
  payload: {
    id: makeUuid(),
    result: null,
    ...filter,
  },
})

const createFilterResult = (issues, query) => {
  const predicate = qry(query)
  const result = filterObject(issues, (id, issue) => predicate(issue))
  return result
}

export const refreshFilter = id => (dispatch, getState) => {
  const { query } = getState().filters[id]
  const { issues } = getState().entities
  const result = createFilterResult(issues, query)
  if (result.length) {
    return dispatch({
      type: 'FILTERS/UPDATE_RESULT',
      payload: { id, result },
    })
  }
}

export const logout = navigate => dispatch => {
  dispatch({
    type: 'RESET',
  })
  navigate('/')
}
