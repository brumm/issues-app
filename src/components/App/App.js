import React from 'react'
import Flex from 'flex-component'
import { Route } from 'react-router-dom'
import { remote } from 'electron'
import { connect } from 'react-redux'
import Octicon from 'react-octicon'

import { actionCreators } from 'store'

import Titlebar, { TitlebarButton } from 'components/Titlebar'
import { Row, Column } from 'components/Layout'

import InboxPage from 'containers/InboxPage'
import LoginPage from 'containers/LoginPage'

import style from './App.scss'

const currentWindow = remote.getCurrentWindow()
currentWindow.setSheetOffset(38)

@connect(({
  user,
  requests,
}) => ({
  user,
  isLoading: !!requests.length,
}), actionCreators)

class App extends React.Component {
  state = {
    columnSizes: [150, 500, null]
  }

  onColumnResize = columnSizes => this.setState({ columnSizes })

  render () {
    const {
      issueId,
      bootstrap,
      refresh,
      logout,
      isLoading,
      user,
    } = this.props

    const { columnSizes } = this.state

    return (
      <Column className={style.container}>
        <Titlebar
          columnSizes={columnSizes}
          left={null}
          center={
            user.token && <TitlebarButton icon='pencil' />
          }
          right={user.token && (
            <Row>
              <TitlebarButton icon='sync' onClick={refresh} spin={isLoading} />
              <TitlebarButton icon='sign-out' onClick={() => logout() } />
            </Row>
          )}
        />

        {do {
          if (!user.token) {
            <LoginPage
              currentWindow={currentWindow}
              onGetToken={token => bootstrap(token)}
            />
          }
          else if (user.data) {
            <InboxPage
              columnSizes={columnSizes}
              onColumnResize={this.onColumnResize}
              issueId={issueId}
            />
          }
        }}
      </Column>
    )
  }
}

export default App
