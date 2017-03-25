import { schema } from 'normalizr'

const user = new schema.Entity('users')
const label = new schema.Entity('labels')

export const issue = new schema.Entity('issues', {
  user,
  labels: [label],
  assignee: user,
  assignees: [user],
}, {
  processStrategy: issue => ({
    ...issue,
    commentIds: []
  })
})

export const comment = new schema.Entity('comments', {
  user,
})
