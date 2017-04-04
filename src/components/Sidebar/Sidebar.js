import React from 'react'
import { connect } from 'react-redux'

import { Row, Column } from 'components/Layout'
import UserBadge from 'components/UserBadge'

import { mapObject } from 'utils'

import css from './Sidebar.scss'

@connect(({ user }) => ({ user }))
export default class Sidebar extends React.Component {
  render () {
    const {
      groups,
      user,
    } = this.props

    return (
      <Column className={css.container} grow={1}>
        {user.data && (
          <UserBadge avatar={user.data.avatar_url} radius={2} name={user.data.login} containerStyle={{ padding: 10 }} />
        )}
        {mapObject(groups, (groupLabel, items) => (
          <Column shrink={0} key={groupLabel}>
            <Row alignItems='flex-end' className={css.label} shrink={0}>
              {groupLabel}
            </Row>

            {mapObject(items, (itemLabel, item) => (
              <Row alignItems='center' className={css.item} shrink={0} key={itemLabel}>
                {itemLabel}
              </Row>
            ))}
          </Column>
        ))}
      </Column>
    )
  }
}
