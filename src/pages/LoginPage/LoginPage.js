import React from 'react'
import Octicon from 'react-octicon'

import { Row, Center } from 'components/Layout'

import css from './LoginPage.scss'

export default class LoginPage extends React.Component {
  state = {
    clicked: false,
  }

  handleCallback = url => {
    const { onGetToken } = this.props
    let regex = /token=([a-z0-9]+$)/
    if (regex.test(url)) {
      let [match, token] = url.match(regex)
      if (match) {
        onGetToken(token)
      }
    }
  }

  handleRef = webview => {
    if (webview) {
      webview.addEventListener('will-navigate', ({ url }) => {
        this.handleCallback(url)
      })
      webview.addEventListener('did-get-redirect-request', ({ newURL }) => {
        this.handleCallback(newURL)
      })
    }
  }

  render() {
    const { clicked } = this.state

    return (
      <Center>
        {clicked ? (
          <webview
            style={{ width: '100%', height: '100%' }}
            src="http://whatsgit-auth.apps.railslabs.com/login"
            ref={this.handleRef}
          />
        ) : (
          <Row
            tagName="button"
            disabled={clicked}
            alignItems="center"
            onClick={() =>
              this.setState({
                clicked: true,
              })
            }
            className={css.button}
          >
            <Octicon key="foo" className={css.icon} name="mark-github" />
            <div key="bar" className={css.label}>
              Login with Github
            </div>
          </Row>
        )}
      </Center>
    )
  }
}
