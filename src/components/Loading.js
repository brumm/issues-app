import React from 'react'
import Loader from 'halogen/MoonLoader'

export default props => (
  <Loader {...{
    ...props,
    color: 'rgba(0, 0, 0, 0.3)',
    size: '50px',
  }} />
)
