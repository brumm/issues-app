import React from 'react'
import { connect } from 'react-redux'
import { actionCreators } from 'store'
import SplitLayout from 'react-split-layout'
import { Route } from 'react-router-dom'
import groupBy from 'lodash/groupBy'
import pick from 'lodash/pick'
import sortBy from 'lodash/sortBy'
import isEmpty from 'lodash/isEmpty'

import { mapObject } from 'utils'
import { Row, Column, Center } from 'components/Layout'
import Sidebar from 'components/Sidebar/Sidebar'
import IssueListView from 'components/IssueListView/IssueListView'
import IssueDetailView from 'components/IssueDetailView/IssueDetailView'
import Loading from 'components/Loading'

@connect(({
  entities,
  filters,
}, {
  filterId
}) => ({
  notifications: entities.notifications,
  issues: Object.keys(entities.issues).length === 0
    ? false
    : entities.issues,
  groupedFilters: groupBy(mapObject(filters, (id, filter) => ({ ...filter, id })), 'category'),
  activeFilter: filters[filterId],
}), actionCreators)
export default class InboxPage extends React.Component {

  componentWillUpdate(nextProps) {
    this.maybeRefreshFilter(nextProps)
  }

  componentDidMount() {
    if (this.props.issues === false) {
      this.props.loadIssues()
    }
    this.maybeRefreshFilter(this.props)
  }

  maybeRefreshFilter({
    activeFilter,
    filterId,
    refreshFilter,
  }) {
    if (activeFilter.result === null) {
      refreshFilter(filterId)
    }
  }

  render() {
    const {
      issueId,
      issues,
      notifications,
      columnSizes,
      onColumnResize,
      isFocused,
      isLoading,
      groupedFilters,
      activeFilter,
    } = this.props

    let filteredIssues = pick(issues, activeFilter.result)

    filteredIssues = mapObject(filteredIssues, (id, issue) => ({
      ...issue,
      unread: !!(notifications[issue.shortName] && notifications[issue.shortName].unread)
    }))

    filteredIssues = sortBy(filteredIssues, [
      'unread',
      ({ state }) => state === 'open',
      ({ updated_at }) => Date.parse(updated_at).valueOf(),
      ({ created_at }) => Date.parse(created_at).valueOf(),
    ]).reverse()


    return (
      <Row grow={1}>
        <SplitLayout
          direction="vertical"
          onChange={onColumnResize}
          initialSizes={columnSizes}
          minSizes={[100, 300, 100, 100]}
          maxSizes={[400, (window.innerWidth / 3) * 2, null]}
          dividerColor={['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)']}
          style={{
            position: 'relative',
            height: null,
          }}
        >
          <Sidebar
            isFocused={isFocused}
            groups={groupedFilters}
          />

          {!isEmpty(filteredIssues) ? (
            <Column style={{ width: '100%', height: '100%' }}>
              <IssueListView
                issues={filteredIssues}
                notifications={notifications}
              />
            </Column>
          ) : (
            <Center style={{ backgroundColor: '#fff' }}>
              {isLoading ? <Loading /> : 'No Issues'}
            </Center>
          )}

          {issueId ? (
            <IssueDetailView isLoading={isLoading} issueId={issueId} />
          ) : (
            <Center style={{ backgroundColor: '#E9EFF4' }}>
              No Issue Selected
            </Center>
          )}
        </SplitLayout>
      </Row>
    )
  }
}
