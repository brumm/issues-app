import React from 'react'
import Flex from 'flex-component'
import { Route } from 'react-router-dom'
import { remote } from 'electron'
import { connect } from 'react-redux'
import Octicon from 'react-octicon'

import { actionCreators } from 'store'
import startGithubAuth from 'github-auth-window'

import Titlebar, { TitlebarButton } from 'components/Titlebar'
import { Row, Column } from 'components/Layout'

import InboxPage from 'containers/InboxPage'

import style from './App.scss'

const currentWindow = remote.getCurrentWindow()

currentWindow.setSheetOffset(38)

const LoginPage = ({ onGetToken }) => (
  <Row grow={1} justifyContent='center' alignItems='center'>
    <button onClick={() => (
      startGithubAuth(currentWindow)
        .then(onGetToken)
    )}>
      Login with Github
    </button>
  </Row>
)

@connect(({
  user,
  requests,
}) => ({
  user,
  isLoading: !!requests.length,
}), actionCreators)

class App extends React.Component {
  render () {
    const {
      issueId,
      bootstrap,
      loadIssues,
      logout,
      isLoading,
      user,
    } = this.props

    return (
      <Column className={style.container}>
        <Titlebar
          left={
            isLoading && <Octicon spin name='sync'/>
          }
          center={null}
          right={user.token && (
            <Row>
              <TitlebarButton label='Refresh' icon='sync' onClick={() => loadIssues() } spin={isLoading} />
              <TitlebarButton label='Sign out' icon='sign-out' onClick={() => logout() } />
            </Row>
          )}
        />

        {do {
          if (!user.token) { <LoginPage onGetToken={token => bootstrap(token)} /> }
          else if (user.data) { <InboxPage issueId={issueId} /> }
        }}
      </Column>
    )
  }
}

export default App
