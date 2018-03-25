import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import removeMarkdown from 'remove-markdown'
import striptags from 'striptags'
import Flex from 'flex-component'
import Octicon from 'react-octicon'

import { Row } from 'components/Layout'
import css from './IssueListView.scss'

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
        <Flex className={css.repo} alignItems="center">
          {unread && <div className={css.unreadMarker} />}

          {shortName}

          {comments > 0 && (
            <Flex className={css.commentCount} alignItems="center">
              <Octicon name="comment" />
              {comments}
            </Flex>
          )}
        </Flex>

        <Row className={css.title} alignItems="baseline">
          <Octicon
            name={
              pull_request !== undefined
                ? 'git-pull-request'
                : state === 'closed' ? 'issue-closed' : 'issue-opened'
            }
          />
          {title}
        </Row>

        {truncatedBody.length > 0 && (
          <div className={css.body}>{truncatedBody}</div>
        )}
      </NavLink>
    )
  }
}

export default withRouter(
  connect(({ entities }, { user }) => ({
    user: entities.users[user],
  }))(ListItem)
)
