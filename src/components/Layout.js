import React from 'react'
import Flex from 'flex-component'

export const Row = props => <Flex direction="row" {...props} />

export const Column = props => <Flex direction="column" {...props} />

export const Center = ({ style, ...props }) => (
  <Flex
    grow={1}
    alignItems="center"
    justifyContent="center"
    style={{
      ...style,
      width: '100%',
      height: '100%',
    }}
    {...props}
  />
)
