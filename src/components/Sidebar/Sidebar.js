import React from 'react'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import sortBy from 'lodash/sortBy'
import Octicon from 'react-octicon'

import { Row, Column } from 'components/Layout'
import UserBadge from 'components/UserBadge'
import { mapObject } from 'utils'

import css from './Sidebar.scss'

const ICON_MAP = {
  all: 'issue-opened',
  filter: 'search',
  repo: 'repo',
  member: 'person',
}

const Group = ({ label, items, onToggle, isCollapsed }) => (
  <Column shrink={0}>
    <Row
      alignItems="flex-end"
      className={css.groupLabel}
      shrink={0}
      onClick={() => onToggle(label, !isCollapsed)}
    >
      {label}
    </Row>

    {!isCollapsed &&
      mapObject(
        sortBy(items.filter(({ result }) => result && result.length), 'result.length').reverse(),
        (_, { id, name, result, category }) => (
          <NavLink to={`/${id}`} key={id} className={css.item} activeClassName={css.itemSelected}>
            <Octicon name={ICON_MAP[category]} className={css.icon} />
            <div className={css.itemLabel}>{name}</div>
            {result !== null &&
              result.length !== 0 && <div className={css.count}>{result.length}</div>}
          </NavLink>
        )
      )}
  </Column>
)

@withRouter
@connect(({ user }) => ({ user }))
export default class Sidebar extends React.Component {
  state = Object.keys(this.props.groups).reduce(
    (state, label) => ({
      ...state,
      [label]: false,
    }),
    {}
  )
  render() {
    const { groups, user } = this.props

    return (
      <Column className={css.container} grow={1}>
        {user.data && (
          <UserBadge
            avatar={user.data.avatar_url}
            radius={3}
            name={user.data.login}
            containerStyle={{ padding: 10 }}
          />
        )}
        {mapObject(groups, (groupLabel, items) => (
          <Group
            key={groupLabel}
            label={groupLabel}
            items={items}
            isCollapsed={this.state[groupLabel]}
            onToggle={(label, toggleState) =>
              this.setState({
                [label]: toggleState,
              })}
          />
        ))}
      </Column>
    )
  }
}
