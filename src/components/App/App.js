import React from 'react'
import { Redirect } from 'react-router-dom'
import { remote } from 'electron'
import { connect } from 'react-redux'
import debounce from 'lodash.debounce'

import { actionCreators } from 'store'

import Titlebar, { TitlebarButton } from 'components/Titlebar/Titlebar'
import { Row, Column } from 'components/Layout'

import InboxPage from 'pages/InboxPage'
import LoginPage from 'pages/LoginPage/LoginPage'

import style from './App.scss'

const currentWindow = remote.getCurrentWindow()
currentWindow.setSheetOffset(38)

class App extends React.Component {
  componentWillMount() {
    currentWindow.on('focus', () => document.body.classList.remove('window-inactive'))
    currentWindow.on('blur', () => document.body.classList.add('window-inactive'))
  }

  componentWillUnmount() {
    currentWindow.removeAllListeners()
  }

  onColumnResize = debounce(columnSizes => this.props.setSplitLayoutSizes(columnSizes), 200)

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
      initialFilterId,
      splitLayoutSizes,
    } = this.props

    let page
    if (!user.token) {
      page = <LoginPage onGetToken={token => bootstrap(token)} />
    } else if (!filterId) {
      page = <Redirect to={`/${initialFilterId}`} />
    } else if (user.data) {
      page = (
        <InboxPage
          isLoading={isLoading}
          columnSizes={splitLayoutSizes}
          onColumnResize={this.onColumnResize}
          issueId={issueId}
          filterId={filterId}
        />
      )
    }

    return (
      <Column className={style.container}>
        <Titlebar
          columnSizes={splitLayoutSizes}
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
        {page}
      </Column>
    )
  }
}

export default connect(
  ({ user, requests, filters, ui }, { filterId }) => ({
    user,
    isLoading: !!requests.length,
    initialFilterId: filterId || Object.keys(filters)[0],
    splitLayoutSizes: ui.splitLayoutSizes,
  }),
  actionCreators
)(App)
