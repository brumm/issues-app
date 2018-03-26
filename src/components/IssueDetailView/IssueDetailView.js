import React from 'react'
import { connect } from 'react-redux'
import parseGithubUrl from 'parse-github-url'
import groupBy from 'lodash/groupBy'
import TimeAgo from 'react-timeago'

import { actionCreators } from 'store'

import { Row, Column, Center } from 'components/Layout'
import UserBadge from 'components/UserBadge'
import Comment from 'components/Comment/Comment'
import Event from 'components/Event/Event'
import GithubFlavoredMarkdown from 'components/GithubFlavoredMarkdown/GithubFlavoredMarkdown'
import ExternalLink from 'components/ExternalLink/ExternalLink'
import Loading from 'components/Loading'
import Reactions from 'components/Reactions/Reactions'

import css from './IssueDetailView.scss'

@connect(({ entities }, { issueId }) => {
  const issue = entities.issues[issueId]
  return {
    issue,
    comments: issue.commentIds.map(commentId => entities.comments[commentId]),
    events: issue.eventIds.map(eventId => entities.events[eventId]),
    labels: issue.labels.map(labelId => entities.labels[labelId]),
    author: entities.users[issue.user],
  }
}, actionCreators)
export default class IssueDetailView extends React.PureComponent {
  componentDidMount() {
    this.loadDetails(this.props.issue.id)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.issue.id !== this.props.issue.id) {
      this.loadDetails(nextProps.issue.id)
    }
  }

  loadDetails(issueId) {
    setTimeout(() => {
      if (this.props.issue.comments > 0) {
        this.props.loadComments(issueId)
        this.props.loadIssueEvents(issueId)
      }
    }, 1000)
  }

  render() {
    const {
      issue: { title, url, html_url, number, body, shortName, created_at, reactions, repository },
      author,
      comments,
      events,
      labels,
      isLoading,
    } = this.props

    console.groupCollapsed('currentIssue')
    console.log(this.props.issue)
    console.groupEnd('currentIssue')

    const hasReactions = reactions.total_count > 0
    const commentsAndEvents = [...comments, ...events].sort(
      (a, b) => (Date.parse(a.created_at) < Date.parse(b.created_at) ? -1 : 1)
    )

    return (
      <Column style={{ height: '100%' }} className={css.container}>
        <Row alignItems="flex-start" className={css.header} shrink={0}>
          <UserBadge size={50} radius={3} avatar={author.avatar_url} />

          <Column className={css.details}>
            <Row className={css.subtle}>
              <ExternalLink url={html_url}>{shortName}</ExternalLink>
              <div style={{ marginLeft: 'auto' }}>
                {author.login} commented <TimeAgo date={created_at} />
              </div>
            </Row>

            <div className={css.title}>{title}</div>

            <Row className={css.labels}>
              {labels.map(({ id, name, color: [backgroundColor, color] }) => (
                <div key={id} className={css.label} style={{ backgroundColor, color }}>
                  {name}
                </div>
              ))}
            </Row>
          </Column>
        </Row>

        <Column grow={1} style={{ overflowY: 'auto' }}>
          <Column
            shrink={0}
            className={css.issueBodyContainer}
            style={{ minHeight: hasReactions ? 30 : 0 }}
          >
            {body && (
              <GithubFlavoredMarkdown
                source={body}
                className={css.issueBody}
                repository={repository}
              />
            )}
            {hasReactions && <Reactions reactions={reactions} />}
          </Column>
          {commentsAndEvents.length === 0 ? (
            isLoading && (
              <Center>
                <Loading />
              </Center>
            )
          ) : (
            <Column shrink={0} style={{ padding: 5 }}>
              {commentsAndEvents.map((commentOrEvent, index) => {
                if (commentOrEvent.actor !== undefined) {
                  const previousEvent = commentsAndEvents[index - 1]
                  const isConsecutive =
                    previousEvent && previousEvent.actor === commentOrEvent.actor
                  return (
                    <Event compact={isConsecutive} key={commentOrEvent.id} {...commentOrEvent} />
                  )
                } else {
                  const previousComment = commentsAndEvents[index - 1]
                  const isConsecutive =
                    previousComment && previousComment.user === commentOrEvent.user
                  return (
                    <Comment compact={isConsecutive} key={commentOrEvent.id} {...commentOrEvent} />
                  )
                }
              })}
            </Column>
          )}
        </Column>
      </Column>
    )
  }
}
