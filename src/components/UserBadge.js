import React from 'react'
import { Row } from 'components/Layout'

const UserBadge = ({ avatar, name, radius, size = 20, style, containerStyle }) => (
  <Row alignItems="center" style={containerStyle} shrink={0}>
    <div
      style={{
        borderRadius: radius || size,
        width: size,
        height: size,
        marginRight: name ? 5 : null,
        ...style,
      }}
    >
      <img
        src={`${avatar}'&s=${size}'`}
        alt={name}
        style={{
          backgroundColor: '#E5E5E5',
          borderRadius: radius || size,
          width: size,
          height: size,
        }}
      />
    </div>
    {name && <div>{name}</div>}
  </Row>
)

export default UserBadge
