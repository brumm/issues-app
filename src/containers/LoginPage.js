import React from 'react'
import Octicon from 'react-octicon'

import startGithubAuth from 'github-auth-window'
import { Row } from 'components/Layout'

export default ({ onGetToken, currentWindow }) => (
  <Row grow={1} justifyContent='center' alignItems='center'>
    <Row alignItems='center' onClick={() => (
      startGithubAuth(currentWindow)
        .then(onGetToken)
    )} style={{
      backgroundImage: 'linear-gradient(-180deg, #f5f1f1 0%, #f0f0f0 90%)',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      borderRadius: 5,
      padding: '12px 24px',
    }}>
      <Octicon name='mark-github' mega />
      <div style={{
        marginLeft: 10,
        fontSize: 18,
        fontWeight: 600,
      }}>Login with Github</div>
    </Row>
  </Row>
)
