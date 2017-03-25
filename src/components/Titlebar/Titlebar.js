import React from 'react'
import Flex from 'flex-component'
import Octicon from 'react-octicon'

import { Row } from 'components/Layout'

import css from './Titlebar.scss'

export const TitlebarButton = ({active, icon, label, spin, ...props}) => (
  <Flex
    {...props}
    tagName='button'
    alignItems='center'
    justifyContent='center'
    className={css.button}
  >
   <Octicon className={css.icon} name={icon} spin={spin} />
    <span>{label}</span>
  </Flex>
)

export default ({ left, center, right }) => (
  <Row
    className={css.container}
    justifyContent='center'
    alignItems='center'
    shrink={0}
  >
    <Row className={css.itemContainer} justifyContent='flex-start' grow={1}>
      {left}
    </Row>

    <Row className={css.title}>
      {center}
    </Row>

    <Row className={css.itemContainer} justifyContent='flex-end' grow={1}>
      {right}
    </Row>
  </Row>
)
