import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import Flex from 'flex-component'
import removeMarkdown from 'remove-markdown'
import Octicon from 'react-octicon'
import striptags from 'striptags'
import parseGithubUrl from 'parse-github-url'
import sortBy from 'lodash/sortBy'
import TimeAgo from 'react-timeago'
import { connect } from 'react-redux'
import { List, AutoSizer } from 'react-virtualized'

import { mapObject } from 'utils'
import { Row, Column } from 'components/Layout'

import 'react-virtualized/styles.css'
import css from './IssueListView.scss'

@withRouter
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
      style,
    } = this.props
    const truncatedBody = removeMarkdown(striptags(body)).slice(0, 200)

    return (
      <NavLink
        key={id}
        to={`/${id}`}
        style={style}
        className={[css.item, state].join(' ')}
        activeClassName={css.itemSelected}
      >
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
    let {
      issues,
      notifications,
    } = this.props

    issues = mapObject(issues, (id, issue) => ({
      ...issue,
      unread: !!(notifications[issue.shortName] && notifications[issue.shortName].unread)
    }))

    issues = sortBy(issues, [
      'unread',
      ({ state }) => state === 'open',
      ({ updated_at }) => Date.parse(updated_at).valueOf(),
      ({ created_at }) => Date.parse(created_at).valueOf(),
    ]).reverse()

    return (
      <AutoSizer>
        {({ height, width }) => (
          <List
            className={css.container}
            style={{ flexGrow: 1 }}
            height={height}
            rowHeight={131}
            rowCount={issues.length}
            rowRenderer={({ key, index, style }) => (
              <ListItem
                key={key}
                style={style}
                {...issues[index]}
              />
            )}
            width={width}
          />
        )}
      </AutoSizer>
    )
  }
}
