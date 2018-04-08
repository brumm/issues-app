import makeUuid from 'uuid/v4'
import { normalize } from 'normalizr'
import { filterObject, fetchAll } from 'utils'
import parseGithubUrl from 'parse-github-url'
import qry from 'qry'
import { mapObject } from 'utils'
import { batchActions } from 'redux-batched-actions'

import { fetch, defaultPayload } from './fetch'
import {
  issue as issueSchema,
  comment as commentSchema,
  notification as notificationSchema,
  event as eventSchema,
  repository as repositorySchema,
} from './schemas'

export const loadNotifications = () => (dispatch, getState) => {
  dispatch(
    fetch('notifications?all=1', {
      reducerKey: 'ENTITIES',
      payload: (...args) =>
        defaultPayload(...args).then(notifications =>
          normalize(notifications, [notificationSchema])
        ),
    })
  )
}

export const loadEmojis = () => (dispatch, getState) => {
  dispatch(fetch('emojis', { reducerKey: 'EMOJIS' }))
}

export const bootstrap = token => (dispatch, getState) => {
  dispatch(setToken(token))
  dispatch(loadEmojis())

  dispatch(fetch('user', { reducerKey: 'USER' })).then(({ payload: { id, login } }) => {
    // prettier-ignore
    dispatch( createFilter({ category: 'filter', name: 'Open Issues', query: { state: 'open', pull_request: { $exists: false } }, }) )
    // prettier-ignore
    dispatch( createFilter({ category: 'filter', name: 'Open PRs', query: { state: 'open', pull_request: { $exists: true } }, }) )
    // prettier-ignore
    dispatch( createFilter({ category: 'filter', name: 'Assigned to me', query: { assignees: id }, }) )
    // prettier-ignore
    dispatch( createFilter({ category: 'filter', name: 'Created by me', query: { user: id }, }) )
    // prettier-ignore
    dispatch( createFilter({ category: 'filter', name: 'Participating', query: { $nor: [{ user: id }, { assignees: id }] }, }) )

    dispatch(loadNotifications())
    Promise.all([dispatch(loadIssues()), dispatch(loadUserRepos())]).then(() => {
      const { repositories } = getState().entities
      const createRepoFilterActions = mapObject(repositories, (name, { permissions }) =>
        createFilter({
          name,
          category: permissions ? 'member' : 'repo',
          query: { repository: name },
        })
      )
      dispatch(batchActions(createRepoFilterActions))
      dispatch(refreshFilters())
    })
  })
}

export const refresh = issueId => (dispatch, getState) => {
  dispatch(loadNotifications())
  // prettier-ignore
  Promise.all([
    dispatch(loadIssues()),
    dispatch(loadUserRepos()),
    dispatch(loadComments(issueId))
  ]).then(() => {
    dispatch(refreshFilters())
  })
}

export const loadIssues = () => (dispatch, getState) =>
  fetchAll(`search/issues?q=involves:${getState().user.data.login}`, {
    token: getState().user.token,
    schema: issueSchema,
    mapToResult: ({ items }) => items,
    // dispatch: console.log,
    dispatch,
  })

export const loadUserRepos = () => (dispatch, getState) =>
  fetchAll(`user/repos?type=all`, {
    token: getState().user.token,
    schema: repositorySchema,
    dispatch,
  })

export const loadComments = issueId => (dispatch, getState) => {
  if (!issueId) {
    return
  }
  const issue = getState().entities.issues[issueId]
  const { html_url } = issue
  const { owner, name, filepath } = parseGithubUrl(html_url)

  return fetchAll(`repos/${owner}/${name}/issues/${filepath}/comments`, {
    mutateEntities: (entities, result) => ({
      ...entities,
      issues: {
        [issueId]: {
          ...issue,
          commentIds: result,
        },
      },
    }),
    token: getState().user.token,
    schema: commentSchema,
    dispatch,
  })
}

export const loadIssueEvents = issueId => (dispatch, getState) => {
  const issue = getState().entities.issues[issueId]
  const { html_url } = issue
  const { owner, name, filepath: number } = parseGithubUrl(html_url)

  return fetchAll(`repos/${owner}/${name}/issues/${number}/events`, {
    mutateEntities: (entities, result) => ({
      ...entities,
      issues: {
        [issueId]: {
          ...issue,
          eventIds: result,
        },
      },
    }),
    token: getState().user.token,
    schema: eventSchema,
    dispatch,
  })
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

export const refreshFilters = () => (dispatch, getState) => {
  const { filters } = getState()
  const { issues } = getState().entities

  dispatch(
    batchActions(
      mapObject(filters, (id, { query }) => {
        const result = createFilterResult(issues, query)
        if (result.length) {
          return {
            type: 'FILTERS/UPDATE_RESULT',
            payload: { id, result },
          }
        }
      }).filter(Boolean)
    )
  )
}

export const logout = navigate => dispatch => {
  dispatch({
    type: 'RESET',
  })
  navigate('/')
}

export const setSplitLayoutSizes = sizes => ({
  type: 'UI/SET_SPLIT_LAYOUT_SIZES',
  payload: sizes,
})
