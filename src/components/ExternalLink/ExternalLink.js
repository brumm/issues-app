import React from 'react'
import { shell } from 'electron'

import css from './ExternalLink.scss'

export default ({ url, children }) => (
  <a
    className={css.link}
    href={url}
    onClick={e => {
      e.preventDefault()
      shell.openExternal(url)
    }}
  >
    {children}
  </a>
)
