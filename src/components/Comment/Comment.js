import React from 'react'
import TimeAgo from 'react-timeago'
import { connect } from 'react-redux'

import { Row, Column } from 'components/Layout'
import UserBadge from 'components/UserBadge'
import GithubFlavoredMarkdown from 'components/GithubFlavoredMarkdown/GithubFlavoredMarkdown'
import Reactions from 'components/Reactions/Reactions'

import css from './Comment.scss'

const mapStateToProps = ({ entities }, { user: userId }) => ({
  user: entities.users[userId],
})

const Comment = ({ compact = false, user, body, updated_at, reactions }) => {
  const hasReactions = reactions.total_count > 0

  return (
    <Column
      className={css.container}
      shrink={0}
      style={{ marginTop: compact ? -3 : null }}
    >
      {compact === false && (
        <Row className={css.header} shrink={0} alignItems="center" grow={1}>
          <UserBadge size={28} radius={3} avatar={user.avatar_url} />

          <div className={css.username}>
            {user.login} commented <TimeAgo date={updated_at} />
          </div>
        </Row>
      )}

      <div className={css.commentBody}>
        <GithubFlavoredMarkdown source={body} />
        {hasReactions && <Reactions reactions={reactions} />}
      </div>
    </Column>
  )
}

export default connect(mapStateToProps)(Comment)
