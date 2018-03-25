import React from 'react'
import Flex from 'flex-component'
import { Route, Redirect } from 'react-router-dom'
import { remote } from 'electron'
import { connect } from 'react-redux'
import Octicon from 'react-octicon'

import { actionCreators } from 'store'

import Titlebar, { TitlebarButton } from 'components/Titlebar/Titlebar'
import { Row, Column } from 'components/Layout'

import InboxPage from 'containers/InboxPage'
import LoginPage from 'containers/LoginPage/LoginPage'

import style from './App.scss'

const currentWindow = remote.getCurrentWindow()
currentWindow.setSheetOffset(38)

@connect(
  ({ user, requests, filters }, { filterId }) => ({
    user,
    isLoading: !!requests.length,
    initialFilterId: filterId || Object.keys(filters)[0],
  }),
  actionCreators
)
class App extends React.Component {
  state = {
    columnSizes: [200, 500, null],
  }

  componentWillMount() {
    currentWindow.on('focus', () => document.body.classList.remove('window-inactive'))
    currentWindow.on('blur', () => document.body.classList.add('window-inactive'))
  }

  componentWillUnmount() {
    currentWindow.removeAllListeners()
  }

  onColumnResize = columnSizes => this.setState({ columnSizes })

  render() {
    const {
      issueId,
      filterId,
      bootstrap,
      refresh,
      logout,
      isLoading,
      user,
      history,
      location,
      initialFilterId,
    } = this.props

    const { columnSizes } = this.state

    return (
      <Column className={style.container}>
        <Titlebar
          columnSizes={columnSizes}
          left={null}
          center={user.token && <TitlebarButton icon="pencil" />}
          right={
            user.token && (
              <Row>
                <TitlebarButton icon="sync" onClick={() => refresh(issueId)} spin={isLoading} />
                <TitlebarButton icon="sign-out" onClick={() => logout(history.replace)} />
              </Row>
            )
          }
        />

        {// prettier-ignore
        do {
            if (!user.token) {
              <LoginPage onGetToken={token => bootstrap(token)} />
            } else if (!filterId) {
              <Redirect to={`/${initialFilterId}`} />
            } else if (user.data) {
              <InboxPage
                isLoading={isLoading}
                columnSizes={columnSizes}
                onColumnResize={this.onColumnResize}
                issueId={issueId}
                filterId={filterId}
              />
            }
          }}
      </Column>
    )
  }
}

export default App
