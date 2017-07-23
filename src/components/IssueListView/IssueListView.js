import React from 'react'
import { NavLink, withRouter, Redirect } from 'react-router-dom'
import Flex from 'flex-component'
import removeMarkdown from 'remove-markdown'
import Octicon from 'react-octicon'
import striptags from 'striptags'
import parseGithubUrl from 'parse-github-url'
import TimeAgo from 'react-timeago'
import { connect } from 'react-redux'
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized'

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
      match,
    } = this.props
    const truncatedBody = removeMarkdown(striptags(body)).slice(0, 200)

    return (
      <NavLink
        key={id}
        to={`/${match.params.filterId}/${id}`}
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

@withRouter
export default class IssueListView extends React.Component {

  cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 80,
    keyMapper: rowIndex => this.props.issues[rowIndex].id
  })


  render() {
    const {
      issues,
      notifications,
      match,
    } = this.props

    if (!match.params.issueId) {
      return <Redirect to={`/${match.params.filterId}/${issues[0].id}`} />
    }

    return (
      <AutoSizer>
        {({ height, width }) => (
          <List
            className={css.container}
            style={{ flexGrow: 1 }}
            height={height}
            rowHeight={this.cache.rowHeight}
            rowCount={issues.length}
            deferredMeasurementCache={this.cache}
            rowRenderer={({ key, index, style, parent }) => (
              <CellMeasurer
                cache={this.cache}
                columnIndex={0}
                key={key}
                rowIndex={index}
                parent={parent}
              >
                <ListItem
                  key={key}
                  style={style}
                  {...issues[index]}
                />
              </CellMeasurer>
            )}
            width={width}
          />
        )}
      </AutoSizer>
    )
  }
}
