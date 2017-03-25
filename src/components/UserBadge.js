import React from 'react'
import { Row, Column } from 'components/Layout'

const UserBadge = ({ avatar, name, radius, size = 20, style, containerStyle }) => (
  <Row alignItems='center' style={containerStyle} shrink={0}>
    <div style={{
      borderRadius: radius || size,
      width: size,
      height: size,
      overflow: 'hidden',
      marginRight: name ? 5 : null,
      ...style,
    }}>
      <img src={avatar} alt={name} />
    </div>
    {name && <div>{name}</div>}
  </Row>
)

export default UserBadge
