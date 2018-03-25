import React from 'react'
import PropTypes from 'prop-types'

class Flex extends React.Component {
  render() {
    let {
      display,
      direction,
      justifyContent,
      wrap,
      alignItems,
      alignContent,
      basis,
      grow,
      shrink,
      order,
      alignSelf,
      tagName,
      children,
      style,
      innerRef,
      ...props
    } = this.props

    return React.createElement(
      tagName,
      {
        ...props,
        ref: innerRef,
        style: {
          flexDirection: direction,
          flexWrap: wrap,
          flexBasis: basis,
          flexGrow: grow,
          flexShrink: shrink,
          display,
          justifyContent,
          alignItems,
          alignContent,
          order,
          alignSelf,
          ...style,
        },
      },
      children
    )
  }
}

Flex.defaultProps = {
  tagName: 'div',
  // parent defaults
  display: 'flex',
  // direction: 'row',
  // justifyContent: 'flex-start',
  // wrap: 'nowrap',
  // alignItems: 'stretch',
  // alignContent: 'stretch',
  // child defaults
  // basis: 'auto',
  // grow: 0,
  // shrink: 1,
  // order: 0,
  // alignSelf: 'flex-start'
}

Flex.propTypes = {
  tagName: PropTypes.string,
  // parent
  display: PropTypes.string,
  direction: PropTypes.string,
  justifyContent: PropTypes.string,
  wrap: PropTypes.string,
  alignItems: PropTypes.string,
  alignContent: PropTypes.string,
  // child
  basis: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  grow: PropTypes.number,
  shrink: PropTypes.number,
  order: PropTypes.number,
  alignSelf: PropTypes.number,
}

export default Flex
