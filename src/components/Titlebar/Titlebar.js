import React from 'react'
import Flex from 'flex-component'
import Octicon from 'react-octicon'

import { Row } from 'components/Layout'

import css from './Titlebar.scss'

export const TitlebarButton = ({
  active,
  icon,
  label,
  spin,
  ...props,
}) => (
  <Flex
    {...props}
    tagName='button'
    alignItems='center'
    justifyContent='center'
    className={css.button}
  >
   <Octicon className={css.icon} name={icon} spin={spin} />
    {label && <span>{label}</span>}
  </Flex>
)

export default ({
  left,
  center,
  right,
  columnSizes: [leftWidth, centerWidth],
}) => (
  <Row
    className={css.container}
    justifyContent='center'
    shrink={0}
  >
    <Row justifyContent='flex-end' className={css.itemContainer} style={{ paddingLeft: 78, width: leftWidth }}>
      {left}
    </Row>

    <Row justifyContent='flex-start' className={css.itemContainer} style={{ width: centerWidth }}>
      {center}
    </Row>

    <Row className={css.itemContainer} justifyContent='flex-end' grow={1}>
      {right}
    </Row>
  </Row>
)
