import React from 'react'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import sortBy from 'lodash/sortBy'
import Octicon from 'react-octicon'

import { Row, Column } from 'components/Layout'
import UserBadge from 'components/UserBadge'
import { mapObject, sortByOrder } from 'utils'

import css from './Sidebar.scss'

const ICON_MAP = {
  all: 'issue-opened',
  filter: 'search',
  repo: 'repo',
  member: 'person',
}

const sortOrder = ['all', 'filter', 'member', 'repo']

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

class Sidebar extends React.Component {
  state = Object.keys(this.props.groups).reduce(
    (state, label) => ({
      ...state,
      [label]: false,
    }),
    {}
  )
  render() {
    let { groups, user } = this.props
    groups = mapObject(groups, (label, items) => ({ label, items }))
    groups = groups.sort(sortByOrder(sortOrder, 'label'))

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
        {groups.map(({ label, items }) => (
          <Group
            key={label}
            label={label}
            items={items}
            isCollapsed={this.state[label]}
            onToggle={(label, toggleState) =>
              this.setState({
                [label]: toggleState,
              })
            }
          />
        ))}
      </Column>
    )
  }
}

export default withRouter(connect(({ user }) => ({ user }))(Sidebar))
