import React from 'react'
import Octicon from 'react-octicon'

import startGithubAuth from 'github-auth-window'
import { Row, Center } from 'components/Layout'
import Loading from 'components/Loading'

import css from './LoginPage.scss'

export default class LoginPage extends React.Component {
  state = {
    clicked: false,
  }

  onClick = () => {
    const { currentWindow, onGetToken } = this.props

    this.setState({ clicked: true }, () => {
      startGithubAuth(currentWindow).then(onGetToken)
    })
  }

  render() {
    const { clicked } = this.state

    return (
      <Center>
        <Row
          tagName="button"
          disabled={clicked}
          alignItems="center"
          onClick={this.onClick}
          className={css.button}
        >
          {clicked ? (
            <Loading />
          ) : (
            [
              <Octicon key="foo" className={css.icon} name="mark-github" />,
              <div key="bar" className={css.label}>
                Login with Github
              </div>,
            ]
          )}
        </Row>
      </Center>
    )
  }
}
