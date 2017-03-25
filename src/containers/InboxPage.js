import React from 'react'
import { connect } from 'react-redux'
import { actionCreators } from 'store'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import SplitLayout from 'react-split-layout'
import { Route } from 'react-router-dom'


import { mapObject } from 'utils'
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
    } = this.props

    let issues = mapObject(entities.issues, (id, issue) => issue)
      .sort((a, b) => Date.parse(a.created_at) < Date.parse(b.created_at) ? -1 : 1)
      .sort((a, b) => Date.parse(a.updated_at) < Date.parse(b.updated_at) ? -1 : 1)

    issues = sortBy(issues, ['unread', ({state}) => state === 'open']).reverse()


    return (
      <Row grow={1}>
        <SplitLayout
          direction="vertical"
          onChange={this.onChange}
          initialSizes={[150, 500, null]}
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
              'Filters': {
                'All Issues': 1
              }
            }}
          />
          <Column>
            <IssueListView issues={issues} />
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
