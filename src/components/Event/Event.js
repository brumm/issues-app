import React from 'react'
import TimeAgo from 'react-timeago'
import Octicon from 'react-octicon'
import { connect } from 'react-redux'

import { Row, Column } from 'components/Layout'
import css from './Event.scss'

const events = {
  closed: event => `${event.compact ? 'and' : event.actor.login} closed this`,
  reopened: event => `${event.compact ? 'and' : event.actor.login} reopened this`,
  merged: event => `${event.compact ? 'and' : event.actor.login} merged this pull request`,
  assigned: event => (
    event.assigner.login === event.assignee.login
    ? `${event.assigner.login} self-assigned this`
    : `${event.assigner.login} assigned ${event.assignee.login}`
  ),
  unassigned: event => (
    event.assigner.login === event.assignee.login
    ? `${event.assigner.login} removed their assignment`
    : `${event.assigner.login} unassigned ${event.assignee.login}`
  ),
  labeled: event => (
    <Row alignItems='center'>
      <span>{`${event.compact ? 'and' : event.actor.login} added the`}</span>
      <span className={css.label}>{event.label.name}</span>
      <span>label</span>
    </Row>
  ),
  unlabeled: event => (
    <Row alignItems='center'>
      <span>{`${event.compact ? 'and' : event.actor.login} removed the`}</span>
      <span className={css.label}>{event.label.name}</span>
      <span>label</span>
    </Row>
  ),
  milestoned: event => `${event.compact ? 'and' : event.actor.login} added a milestone`,
  demilestoned: event => `${event.compact ? 'and' : event.actor.login} removed a milestone`,
  renamed: event => (
    <div>
      <span>{`${event.compact ? 'and' : event.actor.login}: renamed this to `}</span>
      <strong title={`was: ${event.rename.from}`}>
        {event.rename.to}
      </strong>
    </div>
  ),
  locked: event => `${event.compact ? 'and' : event.actor.login} locked this`,
  unlocked: event => `${event.compact ? 'and' : event.actor.login} unlocked this`,
  head_ref_deleted: event => `pull request's branch was deleted`,
  head_ref_restored: event => `pull request's branch was restored.`,
  // subscribed: event => event.event,
  // referenced: event => event.event,
  // mentioned: event => event.event,
  review_dismissed: event => `${event.compact ? 'and' : event.actor.login} dismissed a review`,
  review_requested: event => `${event.compact ? 'and' : event.actor.login} requested a review`,
  review_request_removed: event => `${event.compact ? 'and' : event.actor.login} removed a review request`,
}

@connect(({ entities }, { actor: actorId }) => ({
  actor: entities.users[actorId]
}))
export default class Event extends React.Component {
  render() {
    let eventFormatter = events[this.props.event]

    return eventFormatter ? (
      <Row className={css.container} alignItems='center' justifyContent='space-between'>
        <Row alignItems='center'>
          {!this.props.compact && <Octicon name='primitive-dot' />}
          <div style={{ marginLeft: this.props.compact ? 22 : 5 }}>{eventFormatter(this.props)}</div>
        </Row>
        <TimeAgo style={{ color: '#bcc7d1' }} date={this.props.created_at} />
      </Row>
    ) : null
  }
}
