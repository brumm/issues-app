import React from 'react'
import { connect } from 'react-redux'
import { actionCreators } from 'store'
import SplitLayout from 'react-split-layout'
import { Route } from 'react-router-dom'

import { Row, Column } from 'components/Layout'
import Sidebar from 'components/Sidebar'
import IssueListView from 'components/IssueListView'
import IssueDetailView from 'components/IssueDetailView'

@connect(({ entities }) => ({ entities }), actionCreators)
export default class InboxPage extends React.Component {

  componentWillMount() {
    if (Object.keys(this.props.entities.issues).length === 0) {
      this.props.loadIssues()
    }
  }

  render() {
    const {
      issueId,
      entities,
      columnSizes,
      onColumnResize,
    } = this.props
    const { issues, notifications } = entities

    return (
      <Row grow={1}>
        <SplitLayout
          direction="vertical"
          onChange={onColumnResize}
          initialSizes={columnSizes}
          minSizes={[100, 300, 100, 100]}
          maxSizes={[400, (window.innerWidth / 3) * 2, null]}
          dividerColor='#858585'
          style={{
            position: 'relative',
            height: null,
          }}
        >
          <Sidebar
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
          <Column>
            <IssueListView
              issues={issues}
              notifications={notifications}
            />
          </Column>

          {issueId ? (
            <IssueDetailView issueId={issueId} />
          ) : (
            <Row style={{ height: '100%', backgroundColor: '#E9EFF4' }} alignItems='center' justifyContent='center'>
              No Issue Selected
            </Row>
          )}
        </SplitLayout>
      </Row>
    )
  }
}
