import React from 'react'
import { connect } from 'react-redux'
import { actionCreators } from 'store'
import SplitLayout from 'react-split-layout'
import { Route } from 'react-router-dom'

import { Row, Column, Center } from 'components/Layout'
import Sidebar from 'components/Sidebar/Sidebar'
import IssueListView from 'components/IssueListView/IssueListView'
import IssueDetailView from 'components/IssueDetailView/IssueDetailView'
import Loading from 'components/Loading'

@connect(({
  entities
}) => ({
  notifications: entities.notifications,
  issues: Object.keys(entities.issues).length === 0
    ? false
    : entities.issues
}), actionCreators)
export default class InboxPage extends React.Component {

  componentDidMount() {
    if (this.props.issues === false) {
      this.props.loadIssues()
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
    } = this.props

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
            groups={{
              '': {
                'All Issues & PRs': 1,
              },
              'Filters': {
                'Assigned to me': 1,
                'Created by me': 1,
                'Participating': 1,
              },
              'My Repos': {
                'brumm/whatsgit': 1,
              }
            }}
          />

          {issues ? (
            <Column style={{ width: '100%', height: '100%' }}>
              <IssueListView
                issues={issues}
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
