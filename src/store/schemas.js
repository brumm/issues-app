import { schema } from 'normalizr'
import parseGithubUrl from 'parse-github-url'

import { getReadableColor } from 'utils'

const user = new schema.Entity('users')

const label = new schema.Entity('labels', {}, {
  processStrategy: label => ({
    ...label,
    color: [
      `#${label.color}`,
      getReadableColor(`#${label.color}`)
    ]
  })
})

const repository = new schema.Entity('repositories', {
  owner: user,
}, {
  idAttribute: ({ full_name }) => full_name
})

export const issue = new schema.Entity('issues', {
  user,
  repository,
  labels: [label],
  assignee: user,
  assignees: [user],
}, {
  processStrategy: issue => {
    const { repo, filepath } = parseGithubUrl(issue.url)
    return {
      ...issue,
      shortName: `${repo}/${filepath}`,
      commentIds: [],
      eventIds: [],
      repository: {
        html_url: issue.repository_url,
        full_name: `${repo}/${filepath}`,
      }
    }
  }
})

export const comment = new schema.Entity('comments', {
  user,
})

export const event = new schema.Entity('events', {
  actor: user,
  requested_reviewer: user,
  review_requester: user,
})

export const notification = new schema.Entity('notifications', {
  repository,
}, {
  idAttribute: ({ subject: { url }}) => {
    const { repo, filepath } = parseGithubUrl(url)
    return `${repo}/${filepath}`
  }
})
