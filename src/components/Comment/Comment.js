import React from 'react'
import TimeAgo from 'react-timeago'
import { connect } from 'react-redux'

import { Row, Column } from 'components/Layout'
import UserBadge from 'components/UserBadge'
import GithubFlavoredMarkdown from 'components/GithubFlavoredMarkdown/GithubFlavoredMarkdown'

import css from './Comment.scss'

const mapStateToProps = ({ entities }, { user: userId }) => ({
  user: entities.users[userId],
})

const Comment = ({ compact = false, user, body, updated_at }) => (
  <Column className={css.container} shrink={0} style={{ marginTop: compact ? -3 : null }}>
    {compact === false ? (
      <Row className={css.header} shrink={0} alignItems="center" grow={1}>
        <UserBadge size={28} radius={3} avatar={user.avatar_url} />

        <div className={css.username}>
          {user.login} commented <TimeAgo date={updated_at} />
        </div>
      </Row>
    ) : null}

    <GithubFlavoredMarkdown className={css.commentBody} source={body} />
  </Column>
)

export default connect(mapStateToProps)(Comment)
