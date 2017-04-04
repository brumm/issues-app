import React from 'react'
import { NavLink } from 'react-router-dom'
import Flex from 'flex-component'
import removeMarkdown from 'remove-markdown'
import Octicon from 'react-octicon'
import striptags from 'striptags'
import parseGithubUrl from 'parse-github-url'
import sortBy from 'lodash/sortBy'
import TimeAgo from 'react-timeago'
import { connect } from 'react-redux'

import { mapObject } from 'utils'
import { Row, Column } from 'components/Layout'

import css from './IssueListView.scss'

@connect(({ entities }, { user }) => ({
  user: entities.users[user]
}))
class ListItem extends React.Component {
  render() {
    const {
      body,
      comments,
      id,
      number,
      pull_request,
      state,
      title,
      url,
      shortName,
      unread,
      created_at,
      user,
    } = this.props
    const truncatedBody = removeMarkdown(striptags(body)).slice(0, 200)

    return (
      <NavLink
        to={`/${id}`}
        className={[css.item, state].join(' ')}
        activeClassName={css.itemSelected}
        key={id}
      >
        {/* <Flex className={css.repo} alignItems='center'>
          <TimeAgo className={css.repo} date={created_at} />
          <span className={css.repo} style={{ marginLeft: 4 }}>by {user.login}</span>
        </Flex> */}

        <Flex className={css.repo} alignItems='center'>
          {unread && <div className={css.unreadMarker} />}

          {shortName}

          {comments > 0 &&
            <Flex className={css.commentCount} alignItems='center'>
              <Octicon name='comment' />
              {comments}
            </Flex>
          }
        </Flex>

        <Row className={css.title} alignItems='baseline'>
          <Octicon name={
            pull_request !== undefined
            ? 'git-pull-request'
              : state === 'closed'
                ? 'issue-closed'
                : 'issue-opened'
          } />
          {title}
        </Row>

        {truncatedBody.length > 0 &&
          <div className={css.body}>
            {truncatedBody}
          </div>
        }
      </NavLink>
    )
  }
}

export default class IssuesList extends React.Component {
  render() {
    let { issues, notifications } = this.props

    issues = mapObject(issues, (id, issue) => ({
      ...issue,
      unread: !!(notifications[issue.shortName] && notifications[issue.shortName].unread)
    }))
      .sort((a, b) => Date.parse(a.created_at) < Date.parse(b.created_at) ? -1 : 1)
      .sort((a, b) => Date.parse(a.updated_at) < Date.parse(b.updated_at) ? -1 : 1)

    issues = sortBy(issues, ['unread', ({state}) => state === 'open']).reverse()

    return (
      <Column grow={1} className={css.container}>
        {issues.map(issue => (
          <ListItem
            key={issue.id}
            {...issue}
          />
        ))}
      </Column>
    )
  }
}
