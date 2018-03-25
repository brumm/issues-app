import React from 'react'
import Spinner from 'react-svg-spinner'

export default props => (
  <Spinner
    {...{
      ...props,
      color: 'rgba(0, 0, 0, 0.3)',
      size: '50px',
    }}
  />
)
