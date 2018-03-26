import React from 'react'
import { connect } from 'react-redux'

import { Row } from 'components/Layout'
import { mapObject } from 'utils'

import css from './Reactions.scss'

const emojiMap = {
  '+1': '+1',
  '-1': '-1',
  laugh: 'smile',
  confused: 'confused',
  heart: 'heart',
  hooray: 'tada',
}

const Reactions = connect(({ emojis }) => ({
  emojis: emojis.data,
}))(({ emojis, reactions: { total_count, url, ...reactions } }) => (
  <Row className={css.container}>
    {mapObject(
      reactions,
      (name, count) =>
        count > 0 ? (
          <Row key={name} className={css.reaction}>
            <div className={css.emoji}>
              <img src={emojis[emojiMap[name]]} alt={name} />
            </div>
            <div style={{ marginLeft: 5 }}>{`× ${count}`}</div>
          </Row>
        ) : null
    )}
  </Row>
))

export default Reactions
